import { Card } from "./Card";

export function SocInputs({
  currentSoc,
  stopSoc,
  onCurrentSocChange,
  onStopSocChange,
}: {
  currentSoc: number;
  stopSoc: number;
  onCurrentSocChange: (v: number) => void;
  onStopSocChange: (v: number) => void;
}) {
  return (
    <Card title="Battery state of charge">
      <SocRow label="Current SOC" value={currentSoc} onChange={onCurrentSocChange} accent="text-sky-600 dark:text-sky-400" trackColor="#0284c7" />
      <div className="mt-5">
        <SocRow label="Stop charging at" value={stopSoc} onChange={onStopSocChange} accent="text-emerald-600 dark:text-emerald-400" trackColor="#059669" />
      </div>
      {stopSoc <= currentSoc && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          Stop SOC must be higher than the current SOC to estimate a charging session.
        </p>
      )}
    </Card>
  );
}

function SocRow({
  label,
  value,
  onChange,
  accent,
  trackColor,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  accent: string;
  trackColor: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <span className={`text-lg font-bold tabular-nums ${accent}`}>{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, ${trackColor} ${value}%, #94a3b8 ${value}%)`,
        }}
        className="mt-2 h-2 w-full cursor-pointer rounded-full"
      />
    </div>
  );
}
