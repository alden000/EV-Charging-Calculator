import { useMemo } from "react";
import type { EvVehicle } from "../data/types";
import { Card } from "./Card";

export function VehicleSelector({
  vehicles,
  vehicle,
  onChange,
}: {
  vehicles: EvVehicle[];
  vehicle: EvVehicle;
  onChange: (id: string) => void;
}) {
  const groups = useMemo(() => {
    const byMake = new Map<string, EvVehicle[]>();
    for (const v of vehicles) {
      const list = byMake.get(v.make) ?? [];
      list.push(v);
      byMake.set(v.make, list);
    }
    return Array.from(byMake.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [vehicles]);

  return (
    <Card title={`Vehicle (${vehicles.length} models)`}>
      <select
        value={vehicle.id}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        {groups.map(([make, models]) => (
          <optgroup key={make} label={make}>
            {models.map((v) => (
              <option key={v.id} value={v.id}>
                {v.model} — {v.trim} ({v.year})
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Spec label="Usable battery" value={`${vehicle.batteryCapacityKWh} kWh`} />
        <Spec label="Max AC" value={`${vehicle.acMaxPowerKW} kW`} />
        <Spec label="Max DC" value={`${vehicle.dcMaxPowerKW} kW`} />
        <Spec label="Data as of" value={vehicle.lastUpdated} />
      </dl>
    </Card>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
      <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}
