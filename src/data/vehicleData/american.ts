import { stepCurve, vehMeasured } from "./helpers";
import type { EvVehicle } from "../types";

export const AMERICAN_VEHICLES: EvVehicle[] = [
  // Measured (InsideEVs/Mark Kane DC fast-charge analysis of a 2021 Mach-E First Edition ER AWD,
  // https://insideevs.com/news/492727/ford-mustang-mache-fast-charging-analysis/ — peaks briefly near
  // 150-159kW, steps down to ~106-112kW by 7-10%, ~95-97kW at 31-37%, a long ~76-80kW plateau to 80%,
  // then the well-documented "charging cliff". Post-80% numbers reflect Ford's Nov 2021 OTA fix, which
  // raised the cliff from ~11-12kW to ~40-50kW through 90%, per
  // https://insideevs.com/news/550986/ford-mache-faster-charging-above80/ — current Mach-E software.
  vehMeasured({
    id: "ford-mache-er-2024",
    make: "Ford",
    model: "Mustang Mach-E",
    trim: "Extended Range AWD",
    year: 2024,
    batteryCapacityKWh: 91,
    acMaxPowerKW: 10.5,
    dcMaxPowerKW: 150,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.5,
    dcChargingCurve: stepCurve([
      { upTo: 7, kw: 150 },
      { upTo: 27, kw: 109 },
      { upTo: 40, kw: 96 },
      { upTo: 80, kw: 78 },
      { upTo: 90, kw: 45 },
      { upTo: 100, kw: 15 },
    ]),
  }),
  // Measured (EVChargingStations.com/State Of Charge DC fast-charge test of a 2023 Chevrolet Bolt EV
  // 1LT, 65kWh, https://evchargingstations.com/chargingnews/2023-chevrolet-bolt-charging/ — the article
  // states results are valid for the whole 2017-2023 Bolt EV/EUV family since the platforms differ very
  // little). Notoriously weak/flat curve: ramps to its ~54kW cap almost immediately, holds flat 1-51%,
  // then tapers gently — <25kW by 80%, ~11kW by 98%.
  vehMeasured({
    id: "chevrolet-bolt-euv-2023",
    make: "Chevrolet",
    model: "Bolt EUV",
    trim: "Premier",
    year: 2023,
    batteryCapacityKWh: 65,
    acMaxPowerKW: 11.5,
    dcMaxPowerKW: 55,
    acEfficiency: 0.88,
    dcEfficiency: 0.91,
    idleOverheadKW: 0.3,
    dcChargingCurve: stepCurve([
      { upTo: 2, kw: 45 },
      { upTo: 51, kw: 54 },
      { upTo: 76, kw: 30 },
      { upTo: 80, kw: 23 },
      { upTo: 98, kw: 13 },
      { upTo: 100, kw: 10 },
    ]),
  }),
  // Measured (InsideEVs/Tom Moloughney 20-80% DC fast-charge test on a 350kW Electrify America
  // charger, https://insideevs.com/news/676839/cadillac-lyriq-fast-charge-test/). Confirmed the 190kW
  // spec (peaked 188kW), but the curve is unusually choppy rather than a clean taper: gradually falls
  // from ~188kW to just 29kW by 51% SOC, recovers to 97kW, drops again to 33kW, then climbs back to
  // 42kW through 80% (InsideEVs speculated thermal-throttling cycling). Tail beyond 80% is not covered
  // by the source and is estimated.
  vehMeasured({
    id: "cadillac-lyriq-2024",
    make: "Cadillac",
    model: "Lyriq",
    trim: "AWD",
    year: 2024,
    batteryCapacityKWh: 102,
    acMaxPowerKW: 11.5,
    dcMaxPowerKW: 190,
    acEfficiency: 0.89,
    dcEfficiency: 0.94,
    idleOverheadKW: 0.55,
    dcChargingCurve: stepCurve([
      { upTo: 20, kw: 187 },
      { upTo: 35, kw: 150 },
      { upTo: 45, kw: 95 },
      { upTo: 51, kw: 29 },
      { upTo: 58, kw: 97 },
      { upTo: 68, kw: 33 },
      { upTo: 80, kw: 42 },
      { upTo: 90, kw: 22 },
      { upTo: 100, kw: 10 },
    ]),
  }),
  // Measured (InsideEVs/Tom Moloughney 0-100% DC fast-charge test after Rivian's OTA update raising
  // max charge current to 500A, https://insideevs.com/news/586886/how-long-to-charge-rivian-r1t/ —
  // pulled just over 200kW briefly, held 200kW to 22% SOC, dropped to ~170kW then held >150kW to 45%,
  // fell under 100kW by 72%, and hit 50kW at 80% with a smooth gradual decline after. The 58%
  // breakpoint is bridged in from an earlier InsideEVs/Kane analysis of a separate Out of Spec Reviews
  // session, https://insideevs.com/news/575986/rivian-r1t-charging-analysis/, which independently
  // found the curve "relatively flat" through ~58% SOC.
  vehMeasured({
    id: "rivian-r1t-large-2024",
    make: "Rivian",
    model: "R1T",
    trim: "Large Pack",
    year: 2024,
    batteryCapacityKWh: 135,
    acMaxPowerKW: 11.5,
    dcMaxPowerKW: 220,
    acEfficiency: 0.88,
    dcEfficiency: 0.93,
    idleOverheadKW: 0.7,
    dcChargingCurve: stepCurve([
      { upTo: 22, kw: 200 },
      { upTo: 45, kw: 158 },
      { upTo: 58, kw: 120 },
      { upTo: 72, kw: 95 },
      { upTo: 80, kw: 50 },
      { upTo: 90, kw: 25 },
      { upTo: 100, kw: 10 },
    ]),
  }),
];
