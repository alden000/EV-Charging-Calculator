/**
 * A single point on a DC fast-charging power curve: at this state of charge,
 * the vehicle's onboard charge controller will accept at most `kw` of DC power
 * (before the vehicle's own DC-DC conversion losses are applied).
 */
export interface ChargeCurvePoint {
  soc: number; // 0-100
  kw: number; // charge power the pack will accept at this SOC
}

export interface EvVehicle {
  id: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  /** Usable battery capacity in kWh (delivered to the wheels, not gross/nominal). */
  batteryCapacityKWh: number;
  /** Max AC power the onboard charger can accept, in kW (e.g. 7.4, 11, 22). */
  acMaxPowerKW: number;
  /** Max DC fast-charging power the vehicle can accept, in kW. */
  dcMaxPowerKW: number;
  /**
   * Efficiency of the onboard AC->DC charger, as energy delivered to the battery
   * divided by energy drawn from the wall. Captures conversion losses + onboard
   * electronics overhead while actively charging.
   */
  acEfficiency: number;
  /**
   * Efficiency of DC fast charging path (wall/charger DC output -> battery).
   * Generally higher than AC since it bypasses the onboard charger.
   */
  dcEfficiency: number;
  /**
   * Average parasitic / overhead power draw (kW) while plugged in and charging:
   * battery thermal conditioning, cabin preconditioning, onboard computers, etc.
   * This is drawn from the wall in addition to the energy delivered to the pack.
   */
  idleOverheadKW: number;
  /**
   * DC fast-charging power curve as a function of SOC. Values are interpolated
   * linearly between points. Should start at soc:0 and end at soc:100.
   */
  dcChargingCurve: ChargeCurvePoint[];
  /** ISO date string of when this entry's specs were last verified/updated. */
  lastUpdated: string;
  /** Where this data came from, e.g. "manufacturer spec", "EV-Database", "community data". */
  source: string;
}

export interface VehicleDatabase {
  version: string;
  updatedAt: string;
  vehicles: EvVehicle[];
}
