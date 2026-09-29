import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  titulek,
  popis,
  akce,
}: {
  titulek: string;
  popis?: string;
  akce?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {titulek}
        </h2>
        {popis ? <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{popis}</p> : null}
      </div>
      {akce}
    </div>
  );
}

export function PanelBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
