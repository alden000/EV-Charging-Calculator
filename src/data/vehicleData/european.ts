import { curveFromShape, stepCurve, veh, vehMeasured } from "./helpers";
import type { EvVehicle } from "../types";

// Measured (recharged.com/xc40forum.com tests): 150kW peak held only briefly (~7-17% SOC),
// fastest 10-30%, slows dramatically past 50%, down near L2 AC speed by 80%.
const VOLVO: EvVehicle[] = [
  vehMeasured({
    id: "volvo-xc40-recharge-sm-2024",
    make: "Volvo",
    model: "XC40 Recharge",
    trim: "Single Motor Extended Range",
    year: 2024,
    batteryCapacityKWh: 69,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 150,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 7, kw: 110 },
      { upTo: 17, kw: 150 },
      { upTo: 30, kw: 130 },
      { upTo: 50, kw: 90 },
      { upTo: 80, kw: 35 },
      { upTo: 100, kw: 11 },
    ]),
  }),
  vehMeasured({
    id: "volvo-xc40-recharge-tm-awd-2024",
    make: "Volvo",
    model: "XC40 Recharge",
    trim: "Twin Motor AWD",
    year: 2024,
    batteryCapacityKWh: 69,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 130,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.45,
    dcChargingCurve: stepCurve([
      { upTo: 7, kw: 95 },
      { upTo: 17, kw: 130 },
      { upTo: 30, kw: 113 },
      { upTo: 50, kw: 78 },
      { upTo: 80, kw: 30 },
      { upTo: 100, kw: 10 },
    ]),
  }),
  // Same platform/pack as XC40 Recharge Single Motor.
  vehMeasured({
    id: "volvo-c40-recharge-sm-2024",
    make: "Volvo",
    model: "C40 Recharge",
    trim: "Single Motor Extended Range",
    year: 2024,
    batteryCapacityKWh: 69,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 150,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 7, kw: 110 },
      { upTo: 17, kw: 150 },
      { upTo: 30, kw: 130 },
      { upTo: 50, kw: 90 },
      { upTo: 80, kw: 35 },
      { upTo: 100, kw: 11 },
    ]),
  }),
];

// Measured (i4talk.com/bmwblog.com): unusually, max power (205kW) occurs near 30-40% SOC
// rather than at the start of the session — a robust ~200kW is already available at 50% SOC,
// then it tapers gradually rather than falling off a cliff.
const BMW: EvVehicle[] = [
  vehMeasured({
    id: "bmw-i4-edrive40-2024",
    make: "BMW",
    model: "i4",
    trim: "eDrive40",
    year: 2024,
    batteryCapacityKWh: 81.5,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 205,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 10, kw: 140 },
      { upTo: 35, kw: 205 },
      { upTo: 50, kw: 195 },
      { upTo: 70, kw: 130 },
      { upTo: 85, kw: 70 },
      { upTo: 100, kw: 25 },
    ]),
  }),
  // Same Gen5 BMW platform/205kW charging hardware as i4 eDrive40.
  vehMeasured({
    id: "bmw-i5-edrive40-2024",
    make: "BMW",
    model: "i5",
    trim: "eDrive40",
    year: 2024,
    batteryCapacityKWh: 81.2,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 205,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.45,
    dcChargingCurve: stepCurve([
      { upTo: 10, kw: 140 },
      { upTo: 35, kw: 205 },
      { upTo: 50, kw: 195 },
      { upTo: 70, kw: 130 },
      { upTo: 85, kw: 70 },
      { upTo: 100, kw: 25 },
    ]),
  }),
  veh({
    id: "bmw-ix1-edrive20-2024",
    make: "BMW",
    model: "iX1",
    trim: "eDrive20",
    year: 2024,
    batteryCapacityKWh: 64.7,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 130,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.35,
    dcChargingCurve: curveFromShape(130, "gradualTaper"),
  }),
  // Measured (InsideEVs DC fast-charging analysis of the 74kWh-usable iX3, sourced from Fastned's
  // curve): ~157kW peak, held near ~150kW to ~25% SOC, then multiple step-downs, still ~50kW
  // between 80-95% SOC. Average 20-80% SOC was 91kW (58% of peak).
  vehMeasured({
    id: "bmw-ix3-2024",
    make: "BMW",
    model: "iX3",
    trim: "Impressive",
    year: 2024,
    batteryCapacityKWh: 74,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 150,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 10, kw: 155 },
      { upTo: 25, kw: 145 },
      { upTo: 45, kw: 110 },
      { upTo: 65, kw: 85 },
      { upTo: 80, kw: 60 },
      { upTo: 95, kw: 50 },
      { upTo: 100, kw: 20 },
    ]),
  }),
];

const MERCEDES: EvVehicle[] = [
  // Improved approximation (ev-database.org aggregate + planevcharge.com/electrly.com test
  // summaries): ~100-112kW peak held essentially flat from ~4% to ~50% SOC (avg 10-80% ~99kW,
  // a 0.88 avg/peak ratio - a long plateau, not a steady taper), then declining through 80%.
  // Aggregate-only data (no clean per-SOC breakpoints), so kept as a shape approximation, but
  // switched from gradualTaper to the flatter-plateau "flat800v" shape to match that ratio.
  veh({
    id: "mercedes-eqa250-2024",
    make: "Mercedes-Benz",
    model: "EQA",
    trim: "250",
    year: 2024,
    batteryCapacityKWh: 66.5,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 100,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.4,
    dcChargingCurve: curveFromShape(100, "flat800v"),
  }),
  // Improved approximation (recharged.com/findyourev.net test summaries): similarly flat plateau
  // to the EQA (shared EVA2 platform/pack) - avg 10-80% ~93.8kW vs ~100-102kW peak (~0.92 ratio).
  // Aggregate-only, so kept as a shape approximation but switched to "flat800v" for the plateau.
  veh({
    id: "mercedes-eqb300-2024",
    make: "Mercedes-Benz",
    model: "EQB",
    trim: "300 4MATIC",
    year: 2024,
    batteryCapacityKWh: 66.5,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 100,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.45,
    dcChargingCurve: curveFromShape(100, "flat800v"),
  }),
  // Measured (proefritten.be real-world range/charging test): charged at ~163-167kW initially
  // (11% SOC), still ~127kW by 38% SOC, dropping to ~75kW by 63% SOC and holding close to that
  // out to ~79-80%. Reached 79% SOC in 30 minutes (Mercedes claims 32 min for 10-80%).
  vehMeasured({
    id: "mercedes-eqe350-2024",
    make: "Mercedes-Benz",
    model: "EQE",
    trim: "350+",
    year: 2024,
    batteryCapacityKWh: 90.6,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 170,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.5,
    dcChargingCurve: stepCurve([
      { upTo: 11, kw: 167 },
      { upTo: 38, kw: 150 },
      { upTo: 63, kw: 100 },
      { upTo: 80, kw: 75 },
      { upTo: 90, kw: 40 },
      { upTo: 100, kw: 20 },
    ]),
  }),
  // Measured (InsideEVs DC fast-charging analysis of a 0-100% test by Kyle Conner/Out of Spec
  // Reviews at a 350kW EVgo station): peak ~202-203kW at ~29% SOC, held near ~200kW to ~1/3 SOC,
  // gradually down to ~100kW by 80% SOC, then ~40kW before 90%. Avg 20-80% SOC was 153kW (76% of
  // peak); 20-80% took 27 min (Mercedes' 10-80% claim of 31 min was matched in the test).
  vehMeasured({
    id: "mercedes-eqs450-2024",
    make: "Mercedes-Benz",
    model: "EQS",
    trim: "450+",
    year: 2024,
    batteryCapacityKWh: 107.8,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 200,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.6,
    dcChargingCurve: stepCurve([
      { upTo: 5, kw: 160 },
      { upTo: 33, kw: 200 },
      { upTo: 55, kw: 165 },
      { upTo: 70, kw: 135 },
      { upTo: 80, kw: 100 },
      { upTo: 90, kw: 40 },
      { upTo: 100, kw: 20 },
    ]),
  }),
];

const AUDI: EvVehicle[] = [
  // Improved approximation (audi-mediacenter.com press release + InsideEVs coverage of the
  // updated-charging-capacity Q4 e-tron quattro trims): climbs to peak within the first few
  // minutes and "holds near peak through 40-60% SOC" before ramping down past 70-80% - a longer
  // plateau than a steady taper. Aggregate/qualitative only (no per-SOC breakpoints), so kept as
  // a shape approximation but switched from gradualTaper to the flatter-plateau "flat800v" shape.
  veh({
    id: "audi-q4-etron-45-2024",
    make: "Audi",
    model: "Q4 e-tron",
    trim: "45 quattro AWD",
    year: 2024,
    batteryCapacityKWh: 82,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 175,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.45,
    dcChargingCurve: curveFromShape(175, "flat800v"),
  }),
  veh({
    id: "audi-q4-etron-50-2024",
    make: "Audi",
    model: "Q4 e-tron",
    trim: "50 quattro",
    year: 2024,
    batteryCapacityKWh: 76.6,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 135,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.45,
    dcChargingCurve: curveFromShape(135, "gradualTaper"),
  }),
  veh({
    id: "audi-etron-gt-quattro-2024",
    make: "Audi",
    model: "e-tron GT",
    trim: "quattro (800V)",
    year: 2024,
    batteryCapacityKWh: 93.4,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 270,
    acEfficiency: 0.9,
    dcEfficiency: 0.95,
    idleOverheadKW: 0.5,
    dcChargingCurve: curveFromShape(270, "flat800v"),
  }),
];

// Measured (InsideEVs DC fast-charging analysis, 93.4kWh pack shared by 4S/Turbo): 270kW peak
// held to ~25% SOC, drops to ~200kW, then ~150kW held 35-67% SOC, 5-80% in 22.5 min.
const PORSCHE: EvVehicle[] = [
  vehMeasured({
    id: "porsche-taycan-4s-2024",
    make: "Porsche",
    model: "Taycan",
    trim: "4S (800V)",
    year: 2024,
    batteryCapacityKWh: 93.4,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 270,
    acEfficiency: 0.9,
    dcEfficiency: 0.95,
    idleOverheadKW: 0.5,
    dcChargingCurve: stepCurve([
      { upTo: 25, kw: 270 },
      { upTo: 35, kw: 200 },
      { upTo: 67, kw: 150 },
      { upTo: 85, kw: 70 },
      { upTo: 100, kw: 25 },
    ]),
  }),
  vehMeasured({
    id: "porsche-taycan-turbo-2024",
    make: "Porsche",
    model: "Taycan",
    trim: "Turbo (800V)",
    year: 2024,
    batteryCapacityKWh: 93.4,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 270,
    acEfficiency: 0.9,
    dcEfficiency: 0.95,
    idleOverheadKW: 0.55,
    dcChargingCurve: stepCurve([
      { upTo: 25, kw: 270 },
      { upTo: 35, kw: 200 },
      { upTo: 67, kw: 150 },
      { upTo: 85, kw: 70 },
      { upTo: 100, kw: 25 },
    ]),
  }),
  // Measured (evchargingstations.com "State Of Charge" 2025 Porsche Macan Electric DC
  // fast-charging analysis, 100kWh pack/270kW-class PPE charging hardware): power surges to
  // ~270kW almost instantly and holds through ~35% SOC (briefly touching 285kW at 27%), then
  // tapers mostly linearly — still 116kW at 80% SOC, matching Porsche's 10-80% in ~21min spec.
  vehMeasured({
    id: "porsche-macan-electric-2024",
    make: "Porsche",
    model: "Macan Electric",
    trim: "4S (800V)",
    year: 2024,
    batteryCapacityKWh: 100,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 270,
    acEfficiency: 0.9,
    dcEfficiency: 0.95,
    idleOverheadKW: 0.55,
    dcChargingCurve: stepCurve([
      { upTo: 35, kw: 270 },
      { upTo: 50, kw: 200 },
      { upTo: 65, kw: 160 },
      { upTo: 80, kw: 116 },
      { upTo: 90, kw: 60 },
      { upTo: 100, kw: 20 },
    ]),
  }),
];

const POLESTAR: EvVehicle[] = [
  // Measured (InsideEVs DC fast-charging tests): peak power held only briefly, up to ~17% SOC,
  // then a steady taper through the mid-range — scaled here to this trim's listed 205kW cap.
  vehMeasured({
    id: "polestar-2-lr-dm-2024",
    make: "Polestar",
    model: "2",
    trim: "Long Range Dual Motor",
    year: 2024,
    batteryCapacityKWh: 78,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 205,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 17, kw: 200 },
      { upTo: 40, kw: 150 },
      { upTo: 65, kw: 100 },
      { upTo: 80, kw: 55 },
      { upTo: 92, kw: 28 },
      { upTo: 100, kw: 12 },
    ]),
  }),
  // Approximation, tuned to aggregate ev-database.org figures for this (pre-2026, 400V) Polestar
  // 3: ~150kW average across 10-80% SOC against a 250kW peak (ratio ~0.6, more taper than the
  // generic gradualTaper curve implies) — independent tests have also observed a brief peak up
  // to ~257kW. Not real per-SOC breakpoints, so kept as curveFromShape rather than a step curve.
  veh({
    id: "polestar-3-2024",
    make: "Polestar",
    model: "3",
    trim: "Long Range Dual Motor",
    year: 2024,
    batteryCapacityKWh: 111,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 250,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.55,
    dcChargingCurve: curveFromShape(250, "slowLegacy"),
  }),
  // Approximation. Polestar 4 is a 400V-class architecture (not 800V, unlike Polestar 3's 2026
  // refresh) so "flat800v" was the wrong family entirely; ev-database.org's aggregate ~137kW
  // average across 10-80% SOC against a 200kW peak (ratio ~0.68) fits gradualTaper much better.
  // A cold-battery Proefritten test (12% start SOC) saw 109-122kW through the first 30% SOC,
  // consistent with this shape once preconditioning is accounted for.
  veh({
    id: "polestar-4-2024",
    make: "Polestar",
    model: "4",
    trim: "Long Range Single Motor",
    year: 2024,
    batteryCapacityKWh: 94,
    acMaxPowerKW: 22,
    dcMaxPowerKW: 200,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.45,
    dcChargingCurve: curveFromShape(200, "gradualTaper"),
  }),
];

const CUPRA: EvVehicle[] = [
  // Approximation, tuned to ev-database.org aggregate figures (peak ~124kW, ~75kW average across
  // 10-80% SOC — ratio ~0.6) and cross-checked against a Proefritten real-world session (64-69kW
  // through 34-49% SOC); no clean per-SOC breakpoints found, so kept as curveFromShape, but
  // slowLegacy's taper matches the measured ratio much better than gradualTaper did.
  veh({
    id: "cupra-born-58-2024",
    make: "Cupra",
    model: "Born",
    trim: "58 kWh",
    year: 2024,
    batteryCapacityKWh: 58,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 120,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.35,
    dcChargingCurve: curveFromShape(120, "slowLegacy"),
  }),
  // Measured: this trim shares its 77kWh pack and 135kW DC charging hardware with VW's MEB
  // platform siblings (identical to the VW ID.4 Pro/GTX 77kWh/135kW spec in this same file), so
  // reuses that measured stepCurve — corroborated by a Proefritten real-world Born 77kWh session
  // (64-69kW through 34-49% SOC) landing on the same taper.
  vehMeasured({
    id: "cupra-born-77-2024",
    make: "Cupra",
    model: "Born",
    trim: "77 kWh",
    year: 2024,
    batteryCapacityKWh: 77,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 135,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 30, kw: 128 },
      { upTo: 70, kw: 80 },
      { upTo: 80, kw: 69 },
      { upTo: 90, kw: 41 },
      { upTo: 100, kw: 15 },
    ]),
  }),
];

// Approximation, tuned to ev-database.org aggregate figures for both trims: E averages ~60kW
// across 10-80% SOC against a ~70-75kW peak, SE averages ~75kW against a 95kW peak (ratio
// ~0.8-0.86 for both) — flatter than the generic gradualTaper curve implies. No clean per-SOC
// breakpoints found for this generation, so kept as curveFromShape but switched to teslaLfp,
// whose flatter mid-curve plateau fits the measured ratio much better.
const MINI: EvVehicle[] = [
  veh({
    id: "mini-cooper-e-2024",
    make: "Mini",
    model: "Cooper Electric",
    trim: "E",
    year: 2024,
    batteryCapacityKWh: 40.7,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 75,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.25,
    dcChargingCurve: curveFromShape(75, "teslaLfp"),
  }),
  veh({
    id: "mini-cooper-se-2024",
    make: "Mini",
    model: "Cooper Electric",
    trim: "SE",
    year: 2024,
    batteryCapacityKWh: 54.2,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 95,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.3,
    dcChargingCurve: curveFromShape(95, "teslaLfp"),
  }),
];

// Measured (InsideEVs DC fast-charging test of the Peugeot e-208, a PSA e-CMP platform sibling
// that InsideEVs explicitly lists as sharing the e-2008's identical 50kWh pack and 100kW DC
// hardware): peak ~99kW at ~12% SOC, ~95kW by 20%, then step-tapers through ~76kW (21-48%),
// ~50kW (52-65%), ~43kW (68-71%), ~27kW (74-84%), ~11kW to ~93%.
const PEUGEOT: EvVehicle[] = [
  vehMeasured({
    id: "peugeot-e2008-2024",
    make: "Peugeot",
    model: "e-2008",
    trim: "GT",
    year: 2024,
    batteryCapacityKWh: 54,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 100,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.3,
    dcChargingCurve: stepCurve([
      { upTo: 12, kw: 99 },
      { upTo: 20, kw: 95 },
      { upTo: 48, kw: 76 },
      { upTo: 65, kw: 50 },
      { upTo: 71, kw: 43 },
      { upTo: 84, kw: 27 },
      { upTo: 93, kw: 11 },
      { upTo: 100, kw: 5 },
    ]),
  }),
];

// Measured (InsideEVs DC fast-charging analysis, Kyle Conner/Tom Moloughney tests cross-checked
// with Fastned data): ~128kW held to ~30% SOC (11 min), fades to ~69kW by 80%, ~41kW by 90%.
// Pro RWD and GTX AWD share the same 77kWh pack/135kW charging hardware.
const VOLKSWAGEN: EvVehicle[] = [
  vehMeasured({
    id: "vw-id4-pro-2024",
    make: "Volkswagen",
    model: "ID.4",
    trim: "Pro RWD",
    year: 2024,
    batteryCapacityKWh: 77,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 135,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 30, kw: 128 },
      { upTo: 70, kw: 80 },
      { upTo: 80, kw: 69 },
      { upTo: 90, kw: 41 },
      { upTo: 100, kw: 15 },
    ]),
  }),
  vehMeasured({
    id: "vw-id4-gtx-2024",
    make: "Volkswagen",
    model: "ID.4",
    trim: "GTX AWD",
    year: 2024,
    batteryCapacityKWh: 77,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 135,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.45,
    dcChargingCurve: stepCurve([
      { upTo: 30, kw: 128 },
      { upTo: 70, kw: 80 },
      { upTo: 80, kw: 69 },
      { upTo: 90, kw: 41 },
      { upTo: 100, kw: 15 },
    ]),
  }),
];

// Approximation, tuned to ev-database.org aggregate figures (peak ~130kW, ~80kW average across
// 10-80% SOC — ratio ~0.62); no clean per-SOC breakpoints found, so kept as curveFromShape, but
// slowLegacy's taper matches the measured ratio much better than gradualTaper did.
const RENAULT: EvVehicle[] = [
  veh({
    id: "renault-megane-etech-2024",
    make: "Renault",
    model: "Megane E-Tech",
    trim: "EV60",
    year: 2024,
    batteryCapacityKWh: 60,
    acMaxPowerKW: 22,
    dcMaxPowerKW: 130,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.35,
    dcChargingCurve: curveFromShape(130, "slowLegacy"),
  }),
];

// Measured: this trim's 77kWh pack and 135kW DC charging hardware are the same MEB-platform
// spec as VW's ID.4 Pro/GTX (identical battery/power numbers in this file), so reuses that
// measured stepCurve — the resulting ~92kW average across 10-80% SOC (ratio ~0.68) also lines
// up with ev-database.org's aggregate figures for the closest tested Enyaq variant.
const SKODA: EvVehicle[] = [
  vehMeasured({
    id: "skoda-enyaq-2024",
    make: "Skoda",
    model: "Enyaq",
    trim: "Long Range",
    year: 2024,
    batteryCapacityKWh: 77,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 135,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 30, kw: 128 },
      { upTo: 70, kw: 80 },
      { upTo: 80, kw: 69 },
      { upTo: 90, kw: 41 },
      { upTo: 100, kw: 15 },
    ]),
  }),
];

export const EUROPEAN_VEHICLES: EvVehicle[] = [
  ...VOLVO,
  ...BMW,
  ...MERCEDES,
  ...AUDI,
  ...PORSCHE,
  ...POLESTAR,
  ...CUPRA,
  ...MINI,
  ...PEUGEOT,
  ...VOLKSWAGEN,
  ...RENAULT,
  ...SKODA,
];
