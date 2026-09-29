export type Odstin = "neutral" | "success" | "warning" | "danger" | "info";

const ODSTINY: Record<Odstin, string> = {
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
};

export function Badge({ children, odstin = "neutral" }: { children: React.ReactNode; odstin?: Odstin }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${ODSTINY[odstin]}`}
    >
      {children}
    </span>
  );
}
