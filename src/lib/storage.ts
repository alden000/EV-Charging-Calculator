import type { ChargerType } from "./chargingModel";

export const STORAGE_KEY = "ev-charge-estimator:inputs:v1";

export interface SavedInputs {
  vehicleId: string;
  chargerType: ChargerType;
  chargerMaxPowerKW: number;
  currentSocPercent: number;
  stopSocPercent: number;
  costPerKWh: number;
  parkingEnabled: boolean;
  parkingRatePerHour: number;
  currencySymbol: string;
}

export const DEFAULT_SAVED_INPUTS: SavedInputs = {
  vehicleId: "tesla-model-3-lr-2024",
  chargerType: "DC",
  chargerMaxPowerKW: 150,
  currentSocPercent: 20,
  stopSocPercent: 80,
  costPerKWh: 0.35,
  parkingEnabled: false,
  parkingRatePerHour: 0,
  currencySymbol: "$",
};
