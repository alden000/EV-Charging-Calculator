import type { ChargingEstimate } from "../lib/chargingModel";
import { formatCurrency, formatDateTime, formatDurationHours, formatKWh } from "../lib/format";
import { Card } from "./Card";

export function ResultsSummary({
  estimate,
  currencySymbol,
  parkingEnabled,
}: {
  estimate: ChargingEstimate;
  currencySymbol: string;
  parkingEnabled: boolean;
}) {
  const { sample, overheadEnergyKWh, conversionLossKWh, energyCost, parkingCost, totalCost, completionTime, averagePowerKW } = estimate;

  return (
    <Card title="Estimate" className="border-emerald-200 dark:border-emerald-900/60">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Charging time" value={formatDurationHours(sample.elapsedHours)} big />
        <Stat label="Done by" value={formatDateTime(completionTime)} big />
        <Stat label="Added to battery" value={formatKWh(sample.batteryEnergyKWh)} big />
        <Stat label="Total cost" value={formatCurrency(totalCost, currencySymbol)} big accent="text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Energy pulled from the source: {formatKWh(sample.wallEnergyKWh)}
        </h3>
        <div className="space-y-1.5 text-sm">
          <BreakdownRow label="To battery" value={formatKWh(sample.batteryEnergyKWh)} />
          <BreakdownRow label="Conversion losses (AC/DC)" value={formatKWh(conversionLossKWh)} />
          <BreakdownRow label="Idle / overhead draw" value={formatKWh(overheadEnergyKWh)} />
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="space-y-1.5 text-sm">
          <BreakdownRow label="Average charge rate" value={`${averagePowerKW.toFixed(1)} kW`} />
          <BreakdownRow label="Energy cost" value={formatCurrency(energyCost, currencySymbol)} />
          {parkingEnabled && <BreakdownRow label="Parking / session fee" value={formatCurrency(parkingCost, currencySymbol)} />}
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value, big, accent }: { label: string; value: string; big?: boolean; accent?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-800/60">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-0.5 font-bold tabular-nums ${big ? "text-lg sm:text-xl" : "text-base"} ${accent ?? "text-slate-900 dark:text-slate-100"}`}>
        {value}
      </div>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className="font-medium tabular-nums text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}
