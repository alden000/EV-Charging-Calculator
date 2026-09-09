import { ALL_VEHICLES } from "./vehicleData";
import { LAST_UPDATED } from "./vehicleData/helpers";
import type { VehicleDatabase } from "./types";

export const BUILT_IN_VEHICLES = ALL_VEHICLES;

export const VEHICLE_DB_VERSION = "2026.09.0";

export const BUILT_IN_VEHICLE_DB: VehicleDatabase = {
  version: VEHICLE_DB_VERSION,
  updatedAt: LAST_UPDATED,
  vehicles: BUILT_IN_VEHICLES,
};
