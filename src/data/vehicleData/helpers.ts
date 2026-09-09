import { curveFromShape } from "../curveShapes";
import type { EvVehicle } from "../types";

export const LAST_UPDATED = "2026-09-09";
export const SOURCE =
  "Manufacturer specs & public charging-curve tests (approximate; verify before relying on it)";

export function veh(v: Omit<EvVehicle, "lastUpdated" | "source">): EvVehicle {
  return { ...v, lastUpdated: LAST_UPDATED, source: SOURCE };
}

export { curveFromShape };
