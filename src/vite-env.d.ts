/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VEHICLE_DB_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
