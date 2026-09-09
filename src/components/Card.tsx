import type { ReactNode } from "react";

export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 ${className}`}
    >
      {title && <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h2>}
      {children}
    </section>
  );
}
