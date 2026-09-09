import { curveFromShape, stepCurve, veh, vehMeasured } from "./helpers";
import type { EvVehicle } from "../types";

// BYD — LFP "Blade" packs on most models: flat plateau, gradual taper (teslaLfp shape approximates this well).
const BYD: EvVehicle[] = [
  // Extended Range measured curve (evkx.net / zecar / planevcharge test data): flat
  // ~85kW plateau from ~5% clear through 60%, drops to ~54kW at 64%, small recovery to
  // ~57kW through ~85%, then tapers (tail beyond 85% not covered by sources — estimated).
  vehMeasured({
    id: "byd-atto3-sr-2024",
    make: "BYD",
    model: "Atto 3",
    trim: "Standard Range",
    year: 2024,
    batteryCapacityKWh: 49.9,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 80,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.35,
    // Scaled from the Extended Range's measured curve by its lower 80kW (vs 88kW) cap.
    dcChargingCurve: stepCurve([
      { upTo: 60, kw: 77 },
      { upTo: 64, kw: 49 },
      { upTo: 85, kw: 52 },
      { upTo: 95, kw: 23 },
      { upTo: 100, kw: 11 },
    ]),
  }),
  vehMeasured({
    id: "byd-atto3-er-2024",
    make: "BYD",
    model: "Atto 3",
    trim: "Extended Range",
    year: 2024,
    batteryCapacityKWh: 60.5,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 88,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.35,
    dcChargingCurve: stepCurve([
      { upTo: 60, kw: 85 },
      { upTo: 64, kw: 54 },
      { upTo: 85, kw: 57 },
      { upTo: 95, kw: 25 },
      { upTo: 100, kw: 12 },
    ]),
  }),
  // Same Blade LFP platform/BMS family as Atto 3 (flat plateau to ~60-70%, then tapers —
  // zecar/soyacincau confirm the shape but not exact breakpoints for Dolphin specifically),
  // so the Atto 3's measured curve shape is scaled to Dolphin's own DC power caps.
  vehMeasured({
    id: "byd-dolphin-sr-2024",
    make: "BYD",
    model: "Dolphin",
    trim: "Standard Range",
    year: 2024,
    batteryCapacityKWh: 44.9,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 65,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.3,
    dcChargingCurve: stepCurve([
      { upTo: 60, kw: 63 },
      { upTo: 64, kw: 40 },
      { upTo: 85, kw: 42 },
      { upTo: 95, kw: 18 },
      { upTo: 100, kw: 9 },
    ]),
  }),
  vehMeasured({
    id: "byd-dolphin-lr-2024",
    make: "BYD",
    model: "Dolphin",
    trim: "Long Range (Dynamic)",
    year: 2024,
    batteryCapacityKWh: 60.5,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 88,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.3,
    dcChargingCurve: stepCurve([
      { upTo: 60, kw: 85 },
      { upTo: 64, kw: 54 },
      { upTo: 85, kw: 57 },
      { upTo: 95, kw: 25 },
      { upTo: 100, kw: 12 },
    ]),
  }),
  // Measured curve (soyacincau Malaysia DC fast-charge test, 150kW-capable Seal): 150kW
  // plateau 34-55%, drops to 120kW to 60%, then 70kW to 80%; tail beyond 80% (where BYD's
  // own guidance says rapid charging is rarely pushed past) is an estimated taper.
  vehMeasured({
    id: "byd-seal-dynamic-rwd-2024",
    make: "BYD",
    model: "Seal",
    trim: "Dynamic RWD",
    year: 2024,
    batteryCapacityKWh: 61.4,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 110,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.4,
    // Scaled from the Premium/Performance measured curve by its lower 110kW (vs 150kW) cap.
    dcChargingCurve: stepCurve([
      { upTo: 55, kw: 110 },
      { upTo: 60, kw: 88 },
      { upTo: 80, kw: 51 },
      { upTo: 90, kw: 26 },
      { upTo: 100, kw: 11 },
    ]),
  }),
  vehMeasured({
    id: "byd-seal-premium-rwd-2024",
    make: "BYD",
    model: "Seal",
    trim: "Premium RWD",
    year: 2024,
    batteryCapacityKWh: 82.5,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 150,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.45,
    dcChargingCurve: stepCurve([
      { upTo: 55, kw: 150 },
      { upTo: 60, kw: 120 },
      { upTo: 80, kw: 70 },
      { upTo: 90, kw: 35 },
      { upTo: 100, kw: 15 },
    ]),
  }),
  vehMeasured({
    id: "byd-seal-performance-awd-2024",
    make: "BYD",
    model: "Seal",
    trim: "Performance AWD",
    year: 2024,
    batteryCapacityKWh: 82.6,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 150,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.5,
    // Same pack/BMS as Premium RWD (AWD adds a second drive motor, not charging hardware).
    dcChargingCurve: stepCurve([
      { upTo: 55, kw: 150 },
      { upTo: 60, kw: 120 },
      { upTo: 80, kw: 70 },
      { upTo: 90, kw: 35 },
      { upTo: 100, kw: 15 },
    ]),
  }),
  // Measured (ev-database.org Seal U Design 87kWh/140kW trim): 140kW peak, 84.8kW average
  // 10-80% SOC, 43:05 10-80% charge time — a fairly gradual taper for a Blade LFP pack (not a
  // long flat plateau). Scaled to this Comfort trim's lower 110kW (vs 140kW) cap.
  vehMeasured({
    id: "byd-sealu-2024",
    make: "BYD",
    model: "Seal U",
    trim: "Comfort",
    year: 2024,
    batteryCapacityKWh: 71.8,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 110,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 20, kw: 110 },
      { upTo: 40, kw: 83 },
      { upTo: 60, kw: 59 },
      { upTo: 80, kw: 39 },
      { upTo: 95, kw: 20 },
      { upTo: 100, kw: 9 },
    ]),
  }),
  // Shares the same 150kW DC hardware/BMS as Premium RWD and Performance AWD.
  vehMeasured({
    id: "byd-sealion7-dynamic-2025",
    make: "BYD",
    model: "Sealion 7",
    trim: "Dynamic RWD",
    year: 2025,
    batteryCapacityKWh: 71.8,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 150,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 65, kw: 150 },
      { upTo: 85, kw: 80 },
      { upTo: 99, kw: 45 },
      { upTo: 100, kw: 22.5 },
    ]),
  }),
  vehMeasured({
    id: "byd-sealion7-premium-2025",
    make: "BYD",
    model: "Sealion 7",
    trim: "Premium RWD",
    year: 2025,
    batteryCapacityKWh: 82.5,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 150,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.45,
    dcChargingCurve: stepCurve([
      { upTo: 65, kw: 150 },
      { upTo: 85, kw: 80 },
      { upTo: 99, kw: 45 },
      { upTo: 100, kw: 22.5 },
    ]),
  }),
  vehMeasured({
    id: "byd-sealion7-performance-2025",
    make: "BYD",
    model: "Sealion 7",
    trim: "Performance AWD",
    year: 2025,
    batteryCapacityKWh: 82.5,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 150,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.5,
    dcChargingCurve: stepCurve([
      { upTo: 65, kw: 150 },
      { upTo: 85, kw: 80 },
      { upTo: 99, kw: 45 },
      { upTo: 100, kw: 22.5 },
    ]),
  }),
  // The domestic-China Song Plus EV is the same vehicle BYD exports as the Seal U (Wikipedia:
  // "Since 2024, the Song Plus is exported overseas as the BYD Seal U and BYD Sealion 6") —
  // same 71.8kWh Blade LFP pack. Reuses the Seal U Comfort's measured curve (ev-database.org
  // Seal U Design 87kWh/140kW trim, scaled to 110kW for Comfort), scaled again to this trim's
  // 90kW cap.
  vehMeasured({
    id: "byd-songplus-2024",
    make: "BYD",
    model: "Song Plus EV",
    trim: "Comfort",
    year: 2024,
    batteryCapacityKWh: 71.8,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 90,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 20, kw: 90 },
      { upTo: 40, kw: 68 },
      { upTo: 60, kw: 48 },
      { upTo: 80, kw: 32 },
      { upTo: 95, kw: 16 },
      { upTo: 100, kw: 7 },
    ]),
  }),
  veh({
    id: "byd-songl-2025",
    make: "BYD",
    model: "Song L EV",
    trim: "Performance AWD",
    year: 2025,
    batteryCapacityKWh: 82.5,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 180,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.45,
    dcChargingCurve: curveFromShape(180, "flat800v"),
  }),
  // Real-world tests (Proefritten/InsideEVs) found a notably slow initial ramp (5-10kW right
  // after plugging in) before settling into a ~88-115kW plateau — not the fast early peak
  // "teslaLfp" assumes — so this uses "gradualTaper" instead. Time-based test readings only
  // (no clean SOC breakpoints), so this stays a shape approximation rather than a measured
  // stepCurve.
  veh({
    id: "byd-tang-awd-2024",
    make: "BYD",
    model: "Tang",
    trim: "AWD (7-seat)",
    year: 2024,
    batteryCapacityKWh: 86.4,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 110,
    acEfficiency: 0.89,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.55,
    dcChargingCurve: curveFromShape(110, "gradualTaper"),
  }),
  // ev-database.org and evkx.net both confirm the 85.4kWh AWD Performance Han (380kW/517PS
  // motor, 3.9s 0-100) caps DC charging at 120kW, not 150kW as previously listed here — fixed
  // below. ev-database's claimed spec (120kW peak, 85kW average 10-80%, 44min 10-80%) implies
  // more taper than a flat plateau, so this uses "gradualTaper" instead of "teslaLfp". evkx.net
  // also serves a per-SOC chart/table for the Han, but it is byte-for-byte identical to the one
  // it serves for the unrelated Tang (different battery/motor) and contradicts this file's own
  // sourced note on Tang's real (slow-ramp) behavior — treated as a generic model-tier template,
  // not vehicle-specific measured data, so it is NOT used here despite looking like real test
  // data. RWD trim's power cap is unverified (no independent source found for it specifically);
  // shape corrected to match for consistency with the same platform/chemistry.
  veh({
    id: "byd-han-rwd-2024",
    make: "BYD",
    model: "Han",
    trim: "RWD",
    year: 2024,
    batteryCapacityKWh: 65.4,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 120,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.4,
    dcChargingCurve: curveFromShape(120, "gradualTaper"),
  }),
  veh({
    id: "byd-han-awd-performance-2024",
    make: "BYD",
    model: "Han",
    trim: "AWD Performance",
    year: 2024,
    batteryCapacityKWh: 85.4,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 120,
    acEfficiency: 0.9,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.45,
    dcChargingCurve: curveFromShape(120, "gradualTaper"),
  }),
  veh({
    id: "byd-e6-2023",
    make: "BYD",
    model: "e6",
    trim: "Base (MPV)",
    year: 2023,
    batteryCapacityKWh: 71.7,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 60,
    acEfficiency: 0.87,
    dcEfficiency: 0.91,
    idleOverheadKW: 0.4,
    dcChargingCurve: curveFromShape(60, "slowLegacy"),
  }),
  // Power caps corrected per BYD's own regional spec sheet (reverautomotive.com/en/model/m6/tech-spec,
  // mirroring bydcars.sg's published M6 spec sheet): Standard Range 85kW (was 80kW), Extended
  // Range 115kW (was 90kW). No independent per-SOC breakpoint data found, so this stays a shape
  // approximation.
  veh({
    id: "byd-m6-standard-2024",
    make: "BYD",
    model: "M6",
    trim: "Standard Range (MPV)",
    year: 2024,
    batteryCapacityKWh: 55.4,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 85,
    acEfficiency: 0.88,
    dcEfficiency: 0.92,
    idleOverheadKW: 0.4,
    dcChargingCurve: curveFromShape(85, "teslaLfp"),
  }),
  veh({
    id: "byd-m6-superior-2024",
    make: "BYD",
    model: "M6",
    trim: "Superior / Long Range (MPV)",
    year: 2024,
    batteryCapacityKWh: 71.8,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 115,
    acEfficiency: 0.88,
    dcEfficiency: 0.92,
    idleOverheadKW: 0.45,
    dcChargingCurve: curveFromShape(115, "teslaLfp"),
  }),
];

// MG (SAIC)
// Measured (evparts4x4/mgevs.com DC tests, Trophy Long Range): peak hit almost immediately
// after plugging in, holds >100kW to ~55% SOC, then tapers. Standard/XPower scaled by cap.
const MG: EvVehicle[] = [
  vehMeasured({
    id: "mg4-standard-2024",
    make: "MG",
    model: "MG4 Electric",
    trim: "Standard",
    year: 2024,
    batteryCapacityKWh: 51,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 84,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.35,
    dcChargingCurve: stepCurve([
      { upTo: 55, kw: 84 },
      { upTo: 70, kw: 61 },
      { upTo: 85, kw: 36 },
      { upTo: 95, kw: 18 },
      { upTo: 100, kw: 9 },
    ]),
  }),
  vehMeasured({
    id: "mg4-longrange-2024",
    make: "MG",
    model: "MG4 Electric",
    trim: "Long Range",
    year: 2024,
    batteryCapacityKWh: 64,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 117,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 55, kw: 117 },
      { upTo: 70, kw: 85 },
      { upTo: 85, kw: 50 },
      { upTo: 95, kw: 25 },
      { upTo: 100, kw: 12 },
    ]),
  }),
  vehMeasured({
    id: "mg4-xpower-2024",
    make: "MG",
    model: "MG4 Electric",
    trim: "XPower AWD",
    year: 2024,
    batteryCapacityKWh: 77,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 144,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.45,
    dcChargingCurve: stepCurve([
      { upTo: 55, kw: 144 },
      { upTo: 70, kw: 105 },
      { upTo: 85, kw: 62 },
      { upTo: 95, kw: 31 },
      { upTo: 100, kw: 15 },
    ]),
  }),
  // MG5 shares the older eMP platform/92kW DC cap with the ZS EV Long Range rather than MG4's
  // platform, so it reuses the ZS EV LR measured curve (no direct MG5 test data found).
  vehMeasured({
    id: "mg5-2023",
    make: "MG",
    model: "MG5 Electric",
    trim: "Excite",
    year: 2023,
    batteryCapacityKWh: 61.1,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 92,
    acEfficiency: 0.88,
    dcEfficiency: 0.92,
    idleOverheadKW: 0.35,
    dcChargingCurve: stepCurve([
      { upTo: 7, kw: 73 },
      { upTo: 60, kw: 92 },
      { upTo: 80, kw: 48 },
      { upTo: 92, kw: 22 },
      { upTo: 100, kw: 10 },
    ]),
  }),
  // Measured (InsideEVs/mgevs.com DC test, SR trim — peak matches its 76kW cap exactly): 76kW
  // peak at 59-60% SOC, 70kW+ held 7-60%, ~40kW 60-80%, drops below 20kW past 80%. LR scaled by
  // its higher 92kW cap.
  vehMeasured({
    id: "mg-zs-ev-sr-2023",
    make: "MG",
    model: "ZS EV",
    trim: "Standard Range",
    year: 2023,
    batteryCapacityKWh: 51.1,
    acMaxPowerKW: 7,
    dcMaxPowerKW: 76,
    acEfficiency: 0.87,
    dcEfficiency: 0.92,
    idleOverheadKW: 0.35,
    dcChargingCurve: stepCurve([
      { upTo: 7, kw: 60 },
      { upTo: 60, kw: 76 },
      { upTo: 80, kw: 40 },
      { upTo: 92, kw: 18 },
      { upTo: 100, kw: 8 },
    ]),
  }),
  vehMeasured({
    id: "mg-zs-ev-lr-2023",
    make: "MG",
    model: "ZS EV",
    trim: "Long Range",
    year: 2023,
    batteryCapacityKWh: 68.3,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 92,
    acEfficiency: 0.87,
    dcEfficiency: 0.92,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 7, kw: 73 },
      { upTo: 60, kw: 92 },
      { upTo: 80, kw: 48 },
      { upTo: 92, kw: 22 },
      { upTo: 100, kw: 10 },
    ]),
  }),
];

// GWM Ora (Good Cat / Funky Cat / Ora 03)
// Measured (EVKX.net/ev.care DC tests): documented "optimum charging area" of ~7-54% SOC near
// peak (34:15 held there), then a moderate taper. LR scaled to its 80kW cap; SR to 64kW.
const GWM: EvVehicle[] = [
  vehMeasured({
    id: "ora-goodcat-sr-2023",
    make: "GWM",
    model: "Ora Good Cat",
    trim: "Standard Range",
    year: 2023,
    batteryCapacityKWh: 47.8,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 64,
    acEfficiency: 0.87,
    dcEfficiency: 0.91,
    idleOverheadKW: 0.3,
    dcChargingCurve: stepCurve([
      { upTo: 7, kw: 44 },
      { upTo: 54, kw: 64 },
      { upTo: 75, kw: 36 },
      { upTo: 90, kw: 18 },
      { upTo: 100, kw: 8 },
    ]),
  }),
  vehMeasured({
    id: "ora-goodcat-lr-2023",
    make: "GWM",
    model: "Ora Good Cat",
    trim: "Long Range",
    year: 2023,
    batteryCapacityKWh: 63,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 80,
    acEfficiency: 0.87,
    dcEfficiency: 0.91,
    idleOverheadKW: 0.35,
    dcChargingCurve: stepCurve([
      { upTo: 7, kw: 55 },
      { upTo: 54, kw: 80 },
      { upTo: 75, kw: 45 },
      { upTo: 90, kw: 22 },
      { upTo: 100, kw: 10 },
    ]),
  }),
];

// XPeng — 800V SiC architecture on G6/G9, flatter/faster curve.
// Measured (real-world 800V DC test, LR AWD — 279kW observed vs 280kW spec): unusually, peak
// power actually occurs mid-charge (~279kW at 45% SOC) rather than at the start — stays above
// 230kW for several minutes, 218kW at 75%, 185kW at 80%. SR RWD scaled by its 215kW cap.
const XPENG: EvVehicle[] = [
  vehMeasured({
    id: "xpeng-g6-sr-2024",
    make: "XPeng",
    model: "G6",
    trim: "Standard Range RWD",
    year: 2024,
    batteryCapacityKWh: 66,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 215,
    acEfficiency: 0.9,
    dcEfficiency: 0.95,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 30, kw: 177 },
      { upTo: 45, kw: 214 },
      { upTo: 75, kw: 167 },
      { upTo: 80, kw: 142 },
      { upTo: 92, kw: 69 },
      { upTo: 100, kw: 27 },
    ]),
  }),
  vehMeasured({
    id: "xpeng-g6-lr-2024",
    make: "XPeng",
    model: "G6",
    trim: "Long Range AWD",
    year: 2024,
    batteryCapacityKWh: 87.5,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 280,
    acEfficiency: 0.9,
    dcEfficiency: 0.95,
    idleOverheadKW: 0.5,
    dcChargingCurve: stepCurve([
      { upTo: 30, kw: 230 },
      { upTo: 45, kw: 279 },
      { upTo: 75, kw: 218 },
      { upTo: 80, kw: 185 },
      { upTo: 92, kw: 90 },
      { upTo: 100, kw: 35 },
    ]),
  }),
  // No independent per-SOC breakpoint data found for this specific 70.8kWh/110kW original-generation
  // RWD pack (evkx.net only covers the newer P7+/P7-series trims — 60.7/74.9kWh, or the 82.7kWh
  // usable "RWD Long Range"/"AWD Performance" — none matching this battery+power combo; ev-database
  // and other spec sources likewise only cover the newer 77.9-86.2kWh trims). Stays a shape
  // approximation; "gradualTaper" left as-is since the closest comparable data point (P7 82.7kWh/
  // 175kW trim: ev-database avg/peak ratio 135/175=0.77, and a Proefritten real-world test of that
  // same trim showing a slow initial ramp then plateau then taper) is broadly consistent with it.
  veh({
    id: "xpeng-p7-rwd-2023",
    make: "XPeng",
    model: "P7",
    trim: "RWD",
    year: 2023,
    batteryCapacityKWh: 70.8,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 110,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.4,
    dcChargingCurve: curveFromShape(110, "gradualTaper"),
  }),
  // Measured (evkx.net per-1%-SOC table for the G9 "RWD Long Range"/650-702 Pro-Max, 98kWh nominal/
  // ~93.6kWh usable NMC pack, 315kW DC cap — matches this trim's spec per Wikipedia's XPeng G9 trim
  // table). Corroborated independently by electrive.com's 2024 real-world test of the same Long
  // Range G9 (93.1kWh net battery): "we even saw a peak of 320 kW... continues for a while at
  // 270 kW", "over 200 kW flowed in immediately" at 50% SOC — both match evkx's measured plateaus
  // (317kW at 10-21%, 270kW at 24-39%, 213kW at 42-51%) almost exactly, and the evkx curve itself
  // shows genuine discrete BMS step-plateaus (not a smooth synthetic shape), unlike the templated
  // curves found for some other under-tested models. batteryCapacityKWh corrected to the usable
  // (net) figure per both sources; dcMaxPowerKW corrected to the measured/spec 315kW (was 300kW).
  vehMeasured({
    id: "xpeng-g9-2024",
    make: "XPeng",
    model: "G9",
    trim: "Long Range AWD",
    year: 2024,
    batteryCapacityKWh: 93.1,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 315,
    acEfficiency: 0.9,
    dcEfficiency: 0.95,
    idleOverheadKW: 0.55,
    dcChargingCurve: stepCurve([
      { upTo: 8, kw: 150 },
      { upTo: 21, kw: 315 },
      { upTo: 39, kw: 270 },
      { upTo: 51, kw: 213 },
      { upTo: 60, kw: 190 },
      { upTo: 69, kw: 173 },
      { upTo: 81, kw: 158 },
      { upTo: 90, kw: 80 },
      { upTo: 96, kw: 48 },
      { upTo: 100, kw: 24 },
    ]),
  }),
];

// Zeekr
const ZEEKR: EvVehicle[] = [
  // Measured (EVKX.net/evcourse.com, matches this 200kW-cap trim): peak 200kW at low SOC,
  // tapers past 60-70%, 10-80% in ~28 min.
  vehMeasured({
    id: "zeekr-001-lr-2024",
    make: "Zeekr",
    model: "001",
    trim: "Long Range RWD",
    year: 2024,
    batteryCapacityKWh: 86,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 200,
    acEfficiency: 0.9,
    dcEfficiency: 0.95,
    idleOverheadKW: 0.5,
    dcChargingCurve: stepCurve([
      { upTo: 20, kw: 200 },
      { upTo: 50, kw: 165 },
      { upTo: 70, kw: 120 },
      { upTo: 85, kw: 65 },
      { upTo: 100, kw: 25 },
    ]),
  }),
  // Measured (evkx.net per-1%-SOC table for Zeekr X "Privilege AWD", same 66kWh/64kWh-usable
  // 150kW-cap AWD powertrain shared across Zeekr X AWD trims per ultimatespecs.com — 10-80% in
  // ~31 min matches the official "150kW DC, 10-80% in 30 min" spec almost exactly). This is a
  // 400V platform with a smooth continuous taper (not the 800V flat-plateau-then-cliff shape
  // this entry previously used), which independently checks out: fetching evkx's curve for the
  // unrelated higher-power "Long Range RWD" Zeekr X trim (287kW peak, tapering below 200kW by
  // ~40% SOC) matches a separate real-world test (thecooldown.com) almost exactly, confirming
  // evkx's Zeekr X data is genuinely vehicle-specific rather than a templated curve.
  // batteryCapacityKWh corrected to the usable figure (was gross 66kWh).
  vehMeasured({
    id: "zeekr-x-2024",
    make: "Zeekr",
    model: "X",
    trim: "Core AWD",
    year: 2024,
    batteryCapacityKWh: 64,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 150,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.4,
    dcChargingCurve: stepCurve([
      { upTo: 15, kw: 148 },
      { upTo: 30, kw: 137 },
      { upTo: 45, kw: 110 },
      { upTo: 60, kw: 85 },
      { upTo: 75, kw: 55 },
      { upTo: 90, kw: 25 },
      { upTo: 100, kw: 14 },
    ]),
  }),
];

// Wuling (budget city EV)
const WULING: EvVehicle[] = [
  // No evkx.net entry exists for this model (only the Hongguang Mini EV is covered) and no
  // real per-SOC breakpoint test data was found — stays a shape approximation. But the previous
  // "slowLegacy" shape implied far more taper than sourced data supports: Philippines/Indonesia
  // market specs list "DC Fast Charge 30%-80% in 30 min" (visor.ph), which for this 26.7kWh pack
  // implies ~26.7kW average over that band vs. a 30kW peak — a much flatter curve than
  // "slowLegacy" produces. This is also consistent with the vehicle's LFP chemistry (flatter
  // power delivery than NMC packs), so switched to "teslaLfp" instead, which better matches both
  // the chemistry and the ~30min/30-80% aggregate figure.
  veh({
    id: "wuling-air-ev-lr-2023",
    make: "Wuling",
    model: "Air EV",
    trim: "Long Range",
    year: 2023,
    batteryCapacityKWh: 26.7,
    acMaxPowerKW: 6.6,
    dcMaxPowerKW: 30,
    acEfficiency: 0.86,
    dcEfficiency: 0.9,
    idleOverheadKW: 0.2,
    dcChargingCurve: curveFromShape(30, "teslaLfp"),
  }),
];

// Nio
// Measured (electrive.com/evcourse.com DC tests): real peak observed ~123kW (vs 140kW spec),
// tapers past 60-70% SOC, 10-80% in ~38 min.
const NIO: EvVehicle[] = [
  vehMeasured({
    id: "nio-et5-2024",
    make: "Nio",
    model: "ET5",
    trim: "75 kWh RWD",
    year: 2024,
    batteryCapacityKWh: 75,
    acMaxPowerKW: 11,
    dcMaxPowerKW: 140,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.45,
    dcChargingCurve: stepCurve([
      { upTo: 15, kw: 95 },
      { upTo: 40, kw: 110 },
      { upTo: 65, kw: 80 },
      { upTo: 80, kw: 45 },
      { upTo: 92, kw: 22 },
      { upTo: 100, kw: 10 },
    ]),
  }),
];

export const CHINESE_VEHICLES: EvVehicle[] = [...BYD, ...MG, ...GWM, ...XPENG, ...ZEEKR, ...WULING, ...NIO];
