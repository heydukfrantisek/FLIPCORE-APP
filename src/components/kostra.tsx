import type { ReactNode } from "react";

import { getNastaveni } from "@/server/repo";

import { Navigace } from "./navigace";

/**
 * Kostra celé aplikace: postranní navigace a obsah. Serverová komponenta —
 * načítá jen název obchodu, navigace si aktivní položku řeší sama na klientu.
 */
export function Kostra({ children }: { children: ReactNode }) {
  const nastaveni = getNastaveni();

  return (
    <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-zinc-900 lg:flex lg:flex-col">
        <div className="px-3">
          <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {nastaveni.nazevObchodu}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Bazarové komponenty a sestavy
          </p>
        </div>
        <div className="mt-6 flex-1">
          <Navigace />
        </div>
        <p className="px-3 text-xs text-zinc-400 dark:text-zinc-500">
          Všechna data jsou ukázková.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {nastaveni.nazevObchodu}
          </p>
          <div className="mt-3 overflow-x-auto">
            <Navigace />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
