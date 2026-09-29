import type { ReactNode } from "react";

export function Tabulka({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-160 border-collapse text-sm">{children}</table>
    </div>
  );
}

export function TabulkaHlavicka({ children }: { children: ReactNode }) {
  return <thead className="bg-zinc-50 dark:bg-zinc-800/60">{children}</thead>;
}

export function TabulkaRadek({ children }: { children: ReactNode }) {
  return (
    <tr className="border-t border-zinc-200 dark:border-zinc-800 [&>td]:px-5 [&>td]:py-3 [&>td]:align-middle">
      {children}
    </tr>
  );
}

export function TabulkaBunka({
  children,
  className = "",
  hlavni = false,
}: {
  children: ReactNode;
  className?: string;
  hlavni?: boolean;
}) {
  return (
    <td
      className={`${hlavni ? "font-medium text-zinc-900 dark:text-zinc-50" : "text-zinc-600 dark:text-zinc-300"} ${className}`}
    >
      {children}
    </td>
  );
}
