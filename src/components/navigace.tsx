"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Ikona, type IkonaNazev } from "./ikona";

export const POLOZKY_NAVBARU: Array<{ href: string; popis: string; ikona: IkonaNazev }> = [
  { href: "/nastenka", popis: "Nástěnka", ikona: "nastenka" },
  { href: "/sklad", popis: "Sklad", ikona: "sklad" },
  { href: "/finance", popis: "Finance", ikona: "finance" },
  { href: "/sestavy", popis: "Sestavy", ikona: "sestavy" },
  { href: "/nastaveni", popis: "Nastavení", ikona: "nastaveni" },
];

/**
 * Aktivní položka se zjistí na klientu, protože `usePathname` není
 * dostupný v serverových komponentách.
 */
export function Navigace() {
  const pathname = usePathname();

  return (
    <nav aria-label="Hlavní navigace" className="flex flex-col gap-1">
      {POLOZKY_NAVBARU.map((polozka) => {
        const jeAktivni = pathname === polozka.href;
        return (
          <Link
            key={polozka.href}
            href={polozka.href}
            aria-current={jeAktivni ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              jeAktivni
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            <Ikona nazev={polozka.ikona} />
            {polozka.popis}
          </Link>
        );
      })}
    </nav>
  );
}
