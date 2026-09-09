import { curveFromShape, stepCurve } from "../curveShapes";
import type { EvVehicle } from "../types";

export const LAST_UPDATED = "2026-09-09";
export const SOURCE =
  "Manufacturer specs & public charging-curve tests (approximate; verify before relying on it)";

/** Source note for entries whose dcChargingCurve was built from real published test data (stepCurve), not the generic shape approximation. */
export const MEASURED_CURVE_SOURCE =
  "Published charging-curve test data (measured step curve, not the generic shape approximation)";

export function veh(v: Omit<EvVehicle, "lastUpdated" | "source">): EvVehicle {
  return { ...v, lastUpdated: LAST_UPDATED, source: SOURCE };
}

/** Like veh(), but stamps the vehicle as sourced from measured curve test data. */
export function vehMeasured(v: Omit<EvVehicle, "lastUpdated" | "source">): EvVehicle {
  return { ...v, lastUpdated: LAST_UPDATED, source: MEASURED_CURVE_SOURCE };
}

export { curveFromShape, stepCurve };
