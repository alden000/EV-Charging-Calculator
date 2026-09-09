#!/usr/bin/env node
/**
 * Regenerates public/vehicle-db.json from the curated data in
 * src/data/vehicles.ts. The running app fetches that file at startup
 * (see src/data/vehicleUpdater.ts) and merges in anything newer than what
 * was bundled at build time, so republishing this file is enough to push
 * updated EV specs to users without an app-store release.
 *
 * Usage:
 *   npm run update-db            # sync public/vehicle-db.json from src/data/vehicles.ts
 *
 * Wiring this into a real "auto-updating" pipeline (either is fine; both
 * can be layered):
 *
 * 1. Scheduled CI (e.g. a weekly GitHub Actions cron):
 *      - Run this script and commit the regenerated public/vehicle-db.json
 *        if it changed, so the next deploy ships fresher curves.
 *
 * 2. AI-assisted refresh:
 *      - Before running this script, have an LLM research current specs
 *        for each vehicle in src/data/vehicles.ts (battery capacity, AC/DC
 *        max power, efficiency, charging curve shape) and propose updated
 *        entries as VehicleDatabase-shaped JSON.
 *      - Validate the proposal with src/data/validate.ts's
 *        sanitizeVehicleDatabase() (import via tsx, same as this script)
 *        before accepting any entry — never trust unvalidated model output.
 *      - Merge accepted entries into src/data/vehicles.ts (or maintain a
 *        separate overrides JSON merged at this step) and re-run this
 *        script to publish.
 *
 * 3. Live external source:
 *      - Skip this file entirely and set VITE_VEHICLE_DB_URL to an
 *        externally-hosted, versioned JSON endpoint matching
 *        VehicleDatabase. The app polls it directly at runtime.
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { BUILT_IN_VEHICLE_DB } from "../src/data/vehicles.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "public", "vehicle-db.json");

const db = {
  ...BUILT_IN_VEHICLE_DB,
  updatedAt: new Date().toISOString().slice(0, 10),
};

await writeFile(outPath, JSON.stringify(db, null, 2) + "\n", "utf8");

console.log(`Wrote ${db.vehicles.length} vehicles to ${path.relative(process.cwd(), outPath)} (version ${db.version})`);
