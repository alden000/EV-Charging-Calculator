import { Card } from "./Card";

const CURRENCIES = ["$", "€", "£", "¥", "₹", "R$", "kr", "₩"];

export function CostInputs({
  costPerKWh,
  currencySymbol,
  parkingEnabled,
  parkingRatePerHour,
  onCostChange,
  onCurrencyChange,
  onParkingEnabledChange,
  onParkingRateChange,
}: {
  costPerKWh: number;
  currencySymbol: string;
  parkingEnabled: boolean;
  parkingRatePerHour: number;
  onCostChange: (v: number) => void;
  onCurrencyChange: (v: string) => void;
  onParkingEnabledChange: (v: boolean) => void;
  onParkingRateChange: (v: number) => void;
}) {
  return (
    <Card title="Cost">
      <div className="grid grid-cols-[auto_1fr] gap-3">
        <select
          value={currencySymbol}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-2 py-2.5 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Electricity cost / kWh</label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={costPerKWh}
            onChange={(e) => onCostChange(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={parkingEnabled}
          onChange={(e) => onParkingEnabledChange(e.target.checked)}
          className="h-4 w-4 rounded accent-emerald-600"
        />
        Include parking / session fee
      </label>

      {parkingEnabled && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Parking rate ({currencySymbol}/hour)
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.1}
            value={parkingRatePerHour}
            onChange={(e) => onParkingRateChange(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      )}
    </Card>
  );
}
