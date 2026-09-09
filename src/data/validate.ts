import type { EvVehicle, VehicleDatabase } from "./types";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

export function isValidVehicle(v: unknown): v is EvVehicle {
  if (!v || typeof v !== "object") return false;
  const x = v as Record<string, unknown>;
  return (
    typeof x.id === "string" &&
    typeof x.make === "string" &&
    typeof x.model === "string" &&
    typeof x.trim === "string" &&
    isFiniteNumber(x.year) &&
    isFiniteNumber(x.batteryCapacityKWh) &&
    x.batteryCapacityKWh > 0 &&
    isFiniteNumber(x.acMaxPowerKW) &&
    isFiniteNumber(x.dcMaxPowerKW) &&
    isFiniteNumber(x.acEfficiency) &&
    x.acEfficiency > 0 &&
    x.acEfficiency <= 1 &&
    isFiniteNumber(x.dcEfficiency) &&
    x.dcEfficiency > 0 &&
    x.dcEfficiency <= 1 &&
    isFiniteNumber(x.idleOverheadKW) &&
    x.idleOverheadKW >= 0 &&
    Array.isArray(x.dcChargingCurve) &&
    x.dcChargingCurve.length >= 2 &&
    x.dcChargingCurve.every(
      (p) =>
        p &&
        typeof p === "object" &&
        isFiniteNumber((p as { soc?: unknown }).soc) &&
        isFiniteNumber((p as { kw?: unknown }).kw),
    ) &&
    typeof x.lastUpdated === "string" &&
    typeof x.source === "string"
  );
}

/** Validates a fetched/parsed vehicle database, filtering out any malformed entries. */
export function sanitizeVehicleDatabase(data: unknown): VehicleDatabase | null {
  if (!data || typeof data !== "object") return null;
  const x = data as Record<string, unknown>;
  if (typeof x.version !== "string" || typeof x.updatedAt !== "string" || !Array.isArray(x.vehicles)) {
    return null;
  }
  const vehicles = x.vehicles.filter(isValidVehicle);
  if (vehicles.length === 0) return null;
  return { version: x.version, updatedAt: x.updatedAt, vehicles };
}
