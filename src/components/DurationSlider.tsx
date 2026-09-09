import type { ChargingEstimate } from "../lib/chargingModel";
import { formatCurrency, formatDurationHours, formatKWh } from "../lib/format";
import { Card } from "./Card";

export function DurationSlider({
  hours,
  maxHours,
  estimate,
  currencySymbol,
  onChange,
}: {
  hours: number;
  maxHours: number;
  estimate: ChargingEstimate;
  currencySymbol: string;
  onChange: (hours: number) => void;
}) {
  const pct = maxHours > 0 ? Math.min(100, (hours / maxHours) * 100) : 0;

  return (
    <Card title="Explore: charge for a set amount of time">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Drag to see the resulting battery level if you unplug after a given amount of time, regardless of your stop-SOC setting above.
      </p>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Plugged in for</span>
        <span className="text-lg font-bold tabular-nums text-sky-600 dark:text-sky-400">{formatDurationHours(hours)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={maxHours}
        step={Math.max(maxHours / 200, 1 / 3600)}
        value={hours}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, #0284c7 ${pct}%, #94a3b8 ${pct}%)` }}
        className="mt-2 h-2 w-full cursor-pointer rounded-full"
      />

      <div className="mt-4 grid grid-cols-3 gap-3">
        <MiniStat label="SOC reached" value={`${estimate.sample.soc.toFixed(0)}%`} />
        <MiniStat label="Added" value={formatKWh(estimate.sample.batteryEnergyKWh)} />
        <MiniStat label="Cost so far" value={formatCurrency(estimate.totalCost, currencySymbol)} />
      </div>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-center dark:bg-slate-800/60">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-0.5 font-bold tabular-nums text-slate-900 dark:text-slate-100">{value}</div>
    </div>
  );
}
