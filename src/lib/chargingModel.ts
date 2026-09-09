import type { ChargeCurvePoint, EvVehicle } from "../data/types";

export type ChargerType = "AC" | "DC";

export interface ChargingInputs {
  vehicle: EvVehicle;
  chargerType: ChargerType;
  /** Rated max power of the charger/EVSE being used, in kW. */
  chargerMaxPowerKW: number;
  currentSocPercent: number;
}

/** A point in a simulated charging session, with cumulative totals since the start SOC. */
export interface TrajectorySample {
  soc: number;
  elapsedHours: number;
  /** Cumulative energy delivered into the battery pack. */
  batteryEnergyKWh: number;
  /** Cumulative energy drawn from the wall/source (includes conversion losses + overhead). */
  wallEnergyKWh: number;
  /** Instantaneous charge power reaching the battery at this point. */
  powerToBatteryKW: number;
  /** Instantaneous total power drawn from the source at this point. */
  wallPowerKW: number;
}

export interface ChargingEstimate {
  sample: TrajectorySample;
  overheadEnergyKWh: number;
  conversionLossKWh: number;
  energyCost: number;
  parkingCost: number;
  totalCost: number;
  completionTime: Date;
  averagePowerKW: number;
  /** totalCost / wallEnergyKWh — effective rate per kWh drawn from the source, with any parking fee blended in. */
  effectiveCostPerKWhSource: number;
  /** totalCost / batteryEnergyKWh — effective rate per kWh that actually reaches the battery, factoring in conversion losses, overhead, and parking. Always >= effectiveCostPerKWhSource. */
  effectiveCostPerKWhBattery: number;
}

function interpolateCurve(curve: ChargeCurvePoint[], soc: number): number {
  if (curve.length === 0) return 0;
  if (soc <= curve[0].soc) return curve[0].kw;
  const last = curve[curve.length - 1];
  if (soc >= last.soc) return last.kw;
  for (let i = 0; i < curve.length - 1; i++) {
    const a = curve[i];
    const b = curve[i + 1];
    if (soc >= a.soc && soc <= b.soc) {
      const t = b.soc === a.soc ? 0 : (soc - a.soc) / (b.soc - a.soc);
      return a.kw + t * (b.kw - a.kw);
    }
  }
  return last.kw;
}

/**
 * Power actually delivered BY the charger/source at this SOC — i.e. what a
 * station meter or wall circuit reports. This is a hard physical cap: the
 * curve value (DC) or AC rating can never be exceeded, so this is the
 * ceiling everything else (efficiency, overhead) has to fit inside of.
 */
function instantaneousInputPowerKW(inputs: ChargingInputs, soc: number): number {
  const { vehicle, chargerType, chargerMaxPowerKW } = inputs;
  if (chargerType === "DC") {
    const curveKW = interpolateCurve(vehicle.dcChargingCurve, soc);
    return Math.max(0, Math.min(curveKW, chargerMaxPowerKW, vehicle.dcMaxPowerKW));
  }
  return Math.max(0, Math.min(chargerMaxPowerKW, vehicle.acMaxPowerKW));
}

/**
 * Power that actually reaches the battery pack, given a fixed input power:
 * AC/DC conversion losses take a cut (efficiency < 1), and the vehicle's
 * idle/overhead draw (climate control, battery conditioning, onboard
 * computer, ...) is drawn from the same converted power budget before the
 * remainder charges the pack. Both reduce battery power — neither can make
 * the source deliver more than its rated cap.
 */
function batteryPowerFromInputKW(vehicle: EvVehicle, chargerType: ChargerType, inputPowerKW: number): number {
  const efficiency = chargerType === "DC" ? vehicle.dcEfficiency : vehicle.acEfficiency;
  return Math.max(0, inputPowerKW * efficiency - vehicle.idleOverheadKW);
}

/**
 * Numerically integrates the charging session from `currentSocPercent` up to
 * `endSocPercent` (default 100%) using the vehicle's power curve, in small
 * SOC steps. Returns a trajectory of cumulative samples that can be queried
 * by SOC (sampleAtSoc) or elapsed time (sampleAtDuration).
 */
export function simulateChargingTrajectory(
  inputs: ChargingInputs,
  endSocPercent = 100,
  stepPercent = 0.5,
): TrajectorySample[] {
  const { vehicle, chargerType } = inputs;
  const start = clamp(inputs.currentSocPercent, 0, 100);
  const end = clamp(endSocPercent, 0, 100);

  const firstInputPower = instantaneousInputPowerKW(inputs, start);
  const samples: TrajectorySample[] = [
    {
      soc: start,
      elapsedHours: 0,
      batteryEnergyKWh: 0,
      wallEnergyKWh: 0,
      powerToBatteryKW: batteryPowerFromInputKW(vehicle, chargerType, firstInputPower),
      wallPowerKW: firstInputPower,
    },
  ];

  if (end <= start) return samples;

  let soc = start;
  let elapsedHours = 0;
  let batteryEnergyKWh = 0;
  let wallEnergyKWh = 0;

  while (soc < end - 1e-9) {
    const nextSoc = Math.min(end, soc + stepPercent);
    const midSoc = (soc + nextSoc) / 2;
    const wallPowerKW = instantaneousInputPowerKW(inputs, midSoc);
    const batteryPowerKW = batteryPowerFromInputKW(vehicle, chargerType, wallPowerKW);

    if (batteryPowerKW <= 1e-6) break;

    const stepEnergyKWh = (vehicle.batteryCapacityKWh * (nextSoc - soc)) / 100;
    const dtHours = stepEnergyKWh / batteryPowerKW;

    elapsedHours += dtHours;
    batteryEnergyKWh += stepEnergyKWh;
    wallEnergyKWh += wallPowerKW * dtHours;
    soc = nextSoc;

    const endInputPower = instantaneousInputPowerKW(inputs, soc);
    samples.push({
      soc,
      elapsedHours,
      batteryEnergyKWh,
      wallEnergyKWh,
      powerToBatteryKW: batteryPowerFromInputKW(vehicle, chargerType, endInputPower),
      wallPowerKW: endInputPower,
    });
  }

  return samples;
}

function interpolateSample(a: TrajectorySample, b: TrajectorySample, t: number): TrajectorySample {
  return {
    soc: a.soc + t * (b.soc - a.soc),
    elapsedHours: a.elapsedHours + t * (b.elapsedHours - a.elapsedHours),
    batteryEnergyKWh: a.batteryEnergyKWh + t * (b.batteryEnergyKWh - a.batteryEnergyKWh),
    wallEnergyKWh: a.wallEnergyKWh + t * (b.wallEnergyKWh - a.wallEnergyKWh),
    powerToBatteryKW: a.powerToBatteryKW + t * (b.powerToBatteryKW - a.powerToBatteryKW),
    wallPowerKW: a.wallPowerKW + t * (b.wallPowerKW - a.wallPowerKW),
  };
}

/** Finds (interpolating if needed) the trajectory sample at a given SOC. */
export function sampleAtSoc(trajectory: TrajectorySample[], soc: number): TrajectorySample {
  const first = trajectory[0];
  const last = trajectory[trajectory.length - 1];
  if (soc <= first.soc) return first;
  if (soc >= last.soc) return last;
  for (let i = 0; i < trajectory.length - 1; i++) {
    const a = trajectory[i];
    const b = trajectory[i + 1];
    if (soc >= a.soc && soc <= b.soc) {
      const t = b.soc === a.soc ? 0 : (soc - a.soc) / (b.soc - a.soc);
      return interpolateSample(a, b, t);
    }
  }
  return last;
}

/** Finds (interpolating if needed) the trajectory sample at a given elapsed duration (hours). */
export function sampleAtDuration(trajectory: TrajectorySample[], hours: number): TrajectorySample {
  const first = trajectory[0];
  const last = trajectory[trajectory.length - 1];
  if (hours <= 0) return first;
  if (hours >= last.elapsedHours) return last;
  for (let i = 0; i < trajectory.length - 1; i++) {
    const a = trajectory[i];
    const b = trajectory[i + 1];
    if (hours >= a.elapsedHours && hours <= b.elapsedHours) {
      const t = b.elapsedHours === a.elapsedHours ? 0 : (hours - a.elapsedHours) / (b.elapsedHours - a.elapsedHours);
      return interpolateSample(a, b, t);
    }
  }
  return last;
}

export function buildEstimate(
  vehicle: EvVehicle,
  sample: TrajectorySample,
  costPerKWh: number,
  parkingRatePerHour: number | undefined,
  startTime: Date,
): ChargingEstimate {
  const overheadEnergyKWh = vehicle.idleOverheadKW * sample.elapsedHours;
  const conversionLossKWh = Math.max(0, sample.wallEnergyKWh - overheadEnergyKWh - sample.batteryEnergyKWh);
  const energyCost = sample.wallEnergyKWh * costPerKWh;
  const parkingCost = (parkingRatePerHour ?? 0) * sample.elapsedHours;
  const totalCost = energyCost + parkingCost;
  const completionTime = new Date(startTime.getTime() + sample.elapsedHours * 3600 * 1000);
  const averagePowerKW = sample.elapsedHours > 0 ? sample.batteryEnergyKWh / sample.elapsedHours : 0;
  const effectiveCostPerKWhSource = sample.wallEnergyKWh > 0 ? totalCost / sample.wallEnergyKWh : 0;
  const effectiveCostPerKWhBattery = sample.batteryEnergyKWh > 0 ? totalCost / sample.batteryEnergyKWh : 0;
  return {
    sample,
    overheadEnergyKWh,
    conversionLossKWh,
    energyCost,
    parkingCost,
    totalCost,
    completionTime,
    averagePowerKW,
    effectiveCostPerKWhSource,
    effectiveCostPerKWhBattery,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
