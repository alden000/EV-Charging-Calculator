import { TESLA_VEHICLES } from "./tesla";
import { CHINESE_VEHICLES } from "./chinese";
import { KOREAN_VEHICLES } from "./korean";
import { JAPANESE_VEHICLES } from "./japanese";
import { EUROPEAN_VEHICLES } from "./european";
import { AMERICAN_VEHICLES } from "./american";
import type { EvVehicle } from "../types";

/**
 * Full built-in vehicle roster, grouped by region/brand family for
 * maintainability. Weighted toward vehicles actually seen in Singapore's EV
 * population (LTA registrations) plus deep coverage of Chinese brands
 * (BYD in particular), since that's this app's primary market focus.
 */
export const ALL_VEHICLES: EvVehicle[] = [
  ...CHINESE_VEHICLES,
  ...KOREAN_VEHICLES,
  ...TESLA_VEHICLES,
  ...EUROPEAN_VEHICLES,
  ...JAPANESE_VEHICLES,
  ...AMERICAN_VEHICLES,
];
