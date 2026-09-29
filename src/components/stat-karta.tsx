import { Panel } from "./panel";

export function StatKarta({
  nazev,
  hodnota,
  popis,
  odstin,
}: {
  nazev: string;
  hodnota: string;
  popis?: string;
  odstin?: "neutral" | "success" | "warning" | "danger";
}) {
  const barva = {
    neutral: "text-zinc-900 dark:text-zinc-50",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400",
  }[odstin ?? "neutral"];

  return (
    <Panel className="p-5">
      <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
        {nazev}
      </p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight ${barva}`}>{hodnota}</p>
      {popis ? <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{popis}</p> : null}
    </Panel>
  );
}
