# Vehicle database updates

`update-vehicle-db.mjs` regenerates `public/vehicle-db.json` from the curated
data in `src/data/vehicles.ts`. The app fetches that file at startup and
merges anything newer into what shipped in the JS bundle, so republishing
the JSON file is enough to push updated EV specs without an app release.

```sh
npm run update-db
```

See the comment at the top of the script for how to turn this into a
scheduled, AI-assisted, or externally-hosted update pipeline.
