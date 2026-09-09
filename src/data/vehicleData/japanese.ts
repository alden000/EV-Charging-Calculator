import { curveFromShape, stepCurve, veh, vehMeasured } from "./helpers";
import type { EvVehicle } from "../types";

const NISSAN: EvVehicle[] = [
  // Measured (evkx.net per-SOC table; shape corroborated by mynissanleaf/SpeakEV forum
  // reports of "fast charging until 60%, then noticeably slower" and a Nextmove real-world
  // session peaking at 44kW from a 38C pack): holds ~46kW 10-30%, gradual taper to ~28kW by
  // 60%, then a steep drop past 80% typical of CHAdeMO-era air-cooled Leaf packs. NOTE: evkx
  // serves this exact per-SOC power table (only kWh/time columns rescaled) for the 62kWh e+
  // below too, which is the templating pattern flagged for evkx elsewhere in this codebase —
  // but for the 40kWh pack alone this shape is independently corroborated, so it's used here.
  vehMeasured({
    id: "nissan-leaf-40-2023",
    make: "Nissan",
    model: "Leaf",
    trim: "40 kWh",
    year: 2023,
    batteryCapacityKWh: 39,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 50,
    acEfficiency: 0.86,
    dcEfficiency: 0.91,
    idleOverheadKW: 0.2,
    dcChargingCurve: stepCurve([
      { upTo: 10, kw: 42 },
      { upTo: 30, kw: 46 },
      { upTo: 50, kw: 40 },
      { upTo: 60, kw: 30 },
      { upTo: 75, kw: 15 },
      { upTo: 85, kw: 6 },
      { upTo: 100, kw: 2 },
    ]),
  }),
  // dcMaxPowerKW corrected from 100 to ~72: Nissan's 100kW nameplate for the e+/62kWh pack is
  // well documented as unreachable in practice (no active thermal management on this
  // air-cooled pack) — Electric Revs and mynissanleaf forum reports place the real observed
  // peak at 69-76kW, and CleanTechnica's "Rapidgate" testing found power drops much further
  // on back-to-back DC sessions as the pack heats up. evkx.net's own per-SOC table for this
  // trim is a byte-for-byte rescaled copy of the 40kWh Leaf's table above (a templating
  // pattern this codebase treats as untrustworthy elsewhere), and its ~46kW "peak" undershoots
  // the independently-reported 69-76kW range, so it is NOT used here; lacking a clean
  // vehicle-specific per-SOC table from an independent source, this stays a shape
  // approximation (slowLegacy fits the early-peak/moderate-taper behavior reasonably well).
  veh({
    id: "nissan-leaf-e-plus-2023",
    make: "Nissan",
    model: "Leaf",
    trim: "e+ SV",
    year: 2023,
    batteryCapacityKWh: 59,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 72,
    acEfficiency: 0.87,
    dcEfficiency: 0.92,
    idleOverheadKW: 0.25,
    dcChargingCurve: curveFromShape(72, "slowLegacy"),
  }),
  // Measured (evkx.net per-SOC table): distinct from the 87kWh curve below (not a template
  // duplicate — different plateau length and taper rate), and its implied 10-80% time (~31min)
  // and shape (ramp to ~115kW by 10%, gradual taper from there) line up with independent
  // aggregate write-ups (recharged.com/evchargingstations.com) describing Ariya's 10-80% window
  // as "30-40 min" with an "average ~0.85 of peak".
  vehMeasured({
    id: "nissan-ariya-63-2023",
    make: "Nissan",
    model: "Ariya",
    trim: "63 kWh FWD",
    year: 2023,
    batteryCapacityKWh: 63,
    acMaxPowerKW: 7.4,
    dcMaxPowerKW: 130,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.35,
    dcChargingCurve: stepCurve([
      { upTo: 5, kw: 100 },
      { upTo: 30, kw: 115 },
      { upTo: 40, kw: 100 },
      { upTo: 55, kw: 87 },
      { upTo: 70, kw: 71 },
      { upTo: 85, kw: 55 },
      { upTo: 95, kw: 42 },
      { upTo: 100, kw: 15 },
    ]),
  }),
  // Measured (evkx.net per-SOC table): holds a flat ~130kW plateau from ~10-45% SOC (reaching
  // the vehicle's own DC cap, unlike the 63kWh pack), then tapers — implied 10-80% time
  // (~34min) again matches independent aggregate write-ups for the Ariya.
  vehMeasured({
    id: "nissan-ariya-87-e4orce-2023",
    make: "Nissan",
    model: "Ariya",
    trim: "87 kWh e-4ORCE AWD",
    year: 2023,
    batteryCapacityKWh: 87,
    acMaxPowerKW: 7.4,
    dcMaxPowerKW: 130,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.45,
    dcChargingCurve: stepCurve([
      { upTo: 10, kw: 110 },
      { upTo: 45, kw: 130 },
      { upTo: 55, kw: 110 },
      { upTo: 65, kw: 95 },
      { upTo: 80, kw: 85 },
      { upTo: 90, kw: 66 },
      { upTo: 100, kw: 20 },
    ]),
  }),
];

// FWD and AWD (non-US, 71.4kWh Panasonic-pack) trims share the same battery/DC-charging
// hardware on Toyota's e-TNGA platform, and evkx.net serves an identical per-SOC table for
// both — here that's platform-justified rather than the lazy-templating pattern flagged
// elsewhere (unlike e.g. BYD Han/Tang, which have different batteries/motors but got
// identical evkx tables). Corroborated independently by ev-database.org, which lists the same
// 147kW peak / ~85kW average 10-80% / ~35min 10-80% for both trims.
const TOYOTA: EvVehicle[] = [
  vehMeasured({
    id: "toyota-bz4x-fwd-2024",
    make: "Toyota",
    model: "bZ4X",
    trim: "FWD",
    year: 2024,
    batteryCapacityKWh: 71.4,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 150,
    acEfficiency: 0.87,
    dcEfficiency: 0.92,
    idleOverheadKW: 0.35,
    dcChargingCurve: stepCurve([
      { upTo: 10, kw: 88 },
      { upTo: 25, kw: 135 },
      { upTo: 35, kw: 110 },
      { upTo: 50, kw: 85 },
      { upTo: 60, kw: 60 },
      { upTo: 75, kw: 42 },
      { upTo: 90, kw: 27 },
      { upTo: 100, kw: 8 },
    ]),
  }),
  vehMeasured({
    id: "toyota-bz4x-awd-2024",
    make: "Toyota",
    model: "bZ4X",
    trim: "AWD",
    year: 2024,
    batteryCapacityKWh: 71.4,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 150,
    acEfficiency: 0.87,
    dcEfficiency: 0.92,
    idleOverheadKW: 0.4,
    // Same 71.4kWh Panasonic pack/charging hardware as FWD (see note above) — note this is
    // the non-US spec; the US-market AWD's optional 72.8kWh CATL pack instead caps at 100kW
    // and charges markedly worse (InsideEVs measured 61 min for 10-80%, peaking only ~88kW).
    dcChargingCurve: stepCurve([
      { upTo: 10, kw: 88 },
      { upTo: 25, kw: 135 },
      { upTo: 35, kw: 110 },
      { upTo: 50, kw: 85 },
      { upTo: 60, kw: 60 },
      { upTo: 75, kw: 42 },
      { upTo: 90, kw: 27 },
      { upTo: 100, kw: 8 },
    ]),
  }),
];

const MAZDA: EvVehicle[] = [
  // dcMaxPowerKW corrected from 50 to 37: InsideEVs' Fastned-sourced DC test found a real peak
  // around 37kW (not the 50kW "up to" spec figure), and MX-30 forum members traced this to a
  // hardware limit (100A at the pack's 355V nominal is only ~35.5kW after inverter losses,
  // ~37.5kW indicated). evkx.net's table for this model claims a 56kW peak, which exceeds that
  // documented electrical limit — an implausible value in the spirit of the corrupted-peak
  // pattern flagged elsewhere for evkx, so it is NOT used. InsideEVs describes the real curve
  // as flat at roughly 1C (~36kW) up to ~55% SOC, then falling roughly linearly to ~15kW by
  // 100% — specific enough to encode as a measured step curve.
  vehMeasured({
    id: "mazda-mx30-2023",
    make: "Mazda",
    model: "MX-30",
    trim: "EV",
    year: 2023,
    batteryCapacityKWh: 35.5,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 37,
    acEfficiency: 0.86,
    dcEfficiency: 0.91,
    idleOverheadKW: 0.2,
    dcChargingCurve: stepCurve([
      { upTo: 55, kw: 36 },
      { upTo: 80, kw: 24 },
      { upTo: 100, kw: 15 },
    ]),
  }),
];

const LEXUS: EvVehicle[] = [
  // Shares the 71.4kWh Panasonic pack and e-TNGA DC charging hardware with the Toyota bZ4X
  // above (evkx.net serves the identical per-SOC table for all three) — independently
  // corroborated by ev-database.org's own RZ 450e page, which separately lists the same
  // 147kW peak / 85kW average 10-80% / 33min 10-80% figures.
  vehMeasured({
    id: "lexus-rz450e-2024",
    make: "Lexus",
    model: "RZ",
    trim: "450e",
    year: 2024,
    batteryCapacityKWh: 71.4,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 150,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 10, kw: 88 },
      { upTo: 25, kw: 135 },
      { upTo: 35, kw: 110 },
      { upTo: 50, kw: 85 },
      { upTo: 60, kw: 60 },
      { upTo: 75, kw: 42 },
      { upTo: 90, kw: 27 },
      { upTo: 100, kw: 8 },
    ]),
  }),
];

const HONDA: EvVehicle[] = [
  // Measured (evkx.net per-SOC table): closely corroborated by InsideEVs' independent
  // Fastned-sourced analysis — both show peak power (~46-50kW) at 10-20% SOC and a plateau
  // around 20kW held from ~70% to 95% SOC. The evkx table's implied 20-80% average (~29kW)
  // matches InsideEVs' reported 30kW almost exactly, which is why this evkx curve is trusted
  // here despite the general caution around evkx for less-common models.
  vehMeasured({
    id: "honda-e-2022",
    make: "Honda",
    model: "e",
    trim: "Advance",
    year: 2022,
    batteryCapacityKWh: 35.5,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 50,
    acEfficiency: 0.86,
    dcEfficiency: 0.91,
    idleOverheadKW: 0.2,
    dcChargingCurve: stepCurve([
      { upTo: 10, kw: 48 },
      { upTo: 20, kw: 46 },
      { upTo: 40, kw: 39 },
      { upTo: 60, kw: 30 },
      { upTo: 75, kw: 20 },
      { upTo: 90, kw: 18 },
      { upTo: 100, kw: 5 },
    ]),
  }),
];

export const JAPANESE_VEHICLES: EvVehicle[] = [...NISSAN, ...TOYOTA, ...MAZDA, ...LEXUS, ...HONDA];
