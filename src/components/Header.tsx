import type { VehicleDbStatus } from "../data/vehicleUpdater";

export function Header({
  dbUpdatedAt,
  status,
  onRefresh,
}: {
  dbUpdatedAt: string;
  status: VehicleDbStatus;
  onRefresh: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            ⚡
          </span>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">EV Charge Estimator</h1>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          title="Check for updated vehicle specs"
        >
          <span className={status === "checking" ? "animate-spin" : ""}>{"↻"}</span>
          <span className="hidden sm:inline">DB {dbUpdatedAt}</span>
        </button>
      </div>
    </header>
  );
}
