import type { ChargerType } from "../lib/chargingModel";
import { Card } from "./Card";

const AC_PRESETS = [3.7, 7.4, 11, 22];
const DC_PRESETS = [50, 100, 150, 250, 350];

export function ChargerInputs({
  chargerType,
  chargerMaxPowerKW,
  onChargerTypeChange,
  onChargerPowerChange,
}: {
  chargerType: ChargerType;
  chargerMaxPowerKW: number;
  onChargerTypeChange: (type: ChargerType) => void;
  onChargerPowerChange: (kw: number) => void;
}) {
  const presets = chargerType === "AC" ? AC_PRESETS : DC_PRESETS;

  return (
    <Card title="Charger">
      <div className="flex gap-2">
        {(["AC", "DC"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChargerTypeChange(type)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              chargerType === type
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {type === "AC" ? "AC (Level 2)" : "DC Fast Charging"}
          </button>
        ))}
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Charger max power (kW)
      </label>
      <input
        type="number"
        inputMode="decimal"
        min={0.5}
        step={0.1}
        value={chargerMaxPowerKW}
        onChange={(e) => onChargerPowerChange(Math.max(0, Number(e.target.value) || 0))}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChargerPowerChange(p)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              chargerMaxPowerKW === p
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            }`}
          >
            {p} kW
          </button>
        ))}
      </div>
    </Card>
  );
}
