# EV Charge Estimator

A responsive web app that estimates EV charging time, energy, and cost using
per-vehicle charging curves. Built as a single React codebase so it adapts to
any device width (phone, tablet, desktop) and installs as a PWA on both
mobile and desktop.

## Stack

- **React + TypeScript + Vite** — fast dev/build, one codebase for web and
  mobile via responsive layout + installable PWA (no separate native app
  needed to hit "web and mobile").
- **Tailwind CSS v4** — responsive layout, light/dark theme via
  `prefers-color-scheme`.
- **Recharts** — the charge-power-vs-SOC curve chart.
- No backend: all calculation runs client-side; last-used inputs persist to
  `localStorage`.

## Features

- Vehicle database with battery capacity, AC/DC max power, efficiency,
  idle/overhead draw, and a DC fast-charging power curve per vehicle
  (`src/data/vehicles.ts`).
- Updatable vehicle DB: the app fetches `public/vehicle-db.json` at startup
  and merges in anything newer than what shipped in the bundle, so specs can
  be refreshed without an app release. See `scripts/update-vehicle-db.mjs`
  and `scripts/README.md` for the update workflow (manual, CI-scheduled, or
  AI-assisted).
- Charging model (`src/lib/chargingModel.ts`) numerically integrates the
  session across the vehicle's power curve, accounting for AC/DC conversion
  losses and constant idle/overhead draw, to estimate:
  - Energy delivered to the battery and pulled from the wall
  - Charging duration and expected completion time
  - Total cost (energy + optional parking/session fee)
- Inputs: vehicle, charger type/power, current SOC, stop-charging SOC,
  cost per kWh, optional parking rate — all restored from `localStorage` on
  reload.
- "Explore" duration slider: drag to see the SOC you'd reach after plugging
  in for a given amount of time, independent of the stop-SOC setting.

## Development

```sh
npm install
npm run dev       # start dev server
npm run build     # typecheck + production build
npm run update-db # regenerate public/vehicle-db.json from src/data/vehicles.ts
```

## Notes on accuracy

Vehicle specs and charging curves are approximate, modeled from publicly
known specs/behavior rather than measured live — see each vehicle's `source`
field in `src/data/vehicles.ts`. Real-world charging speed varies with
temperature, state of charge history, and station conditions.
