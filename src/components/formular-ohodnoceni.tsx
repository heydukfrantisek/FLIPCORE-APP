"use client";

import { useActionState } from "react";

import { STUPEN_POPIS } from "@/lib/domain/slovnik";
import type { VysledekOhodnoceni } from "@/lib/domain/repas";
import type { StupenStavu } from "@/lib/domain/types";
import { ohodnotitKus, type StavFormulareOhodnoceni } from "@/server/actions/repas";

/** Popis stupně bez úvodního písmene — vedle písmene by se opakoval. */
function popisStupu(stupen: StupenStavu): string {
  return STUPEN_POPIS[stupen].replace(`${stupen} — `, "");
}

/**
 * Potvrzení odvozeného stupně. **Formulář tu není a být nesmí** — stupeň se
 * nevolí, odvozuje se z důkazů v `src/lib/domain/repas.ts` a serverová akce si
 * ho spočítá sama. Komponenta jen řekne, co se uloží, a umožní to potvrdit.
 *
 * Bez odvozeného stupně (`odvozeni.stupen === null`) je tlačítko neaktivní:
 * chybějící důkaz je chybějící důkaz, a doplnit ho musí zásah nebo test,
 * ne odhad provozovatele.
 */
export function FormularOhodnoceni({
  kusId,
  odvozeni,
}: {
  kusId: string;
  odvozeni: VysledekOhodnoceni;
}) {
  const [stav, odeslat, probiha] = useActionState<StavFormulareOhodnoceni, FormData>(
    ohodnotitKus.bind(null, kusId),
    {},
  );

  const stupen = odvozeni.stupen;

  return (
    <form action={odeslat} className="flex flex-col gap-4">
      {stav.obecna ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {stav.obecna}
        </p>
      ) : null}

      {stav.uspech ? (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          Hodnocení zapsáno. Uložený stupeň: {stav.uspech.stupen}.
        </p>
      ) : null}

      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        {stupen ? (
          <p className="text-sm text-zinc-900 dark:text-zinc-50">
            Uloží se stupeň{" "}
            <strong className="text-base tracking-tight">{stupen}</strong> —{" "}
            {popisStupu(stupen)}.
          </p>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Z důkazů zatím žádný stupeň neplyne.
          </p>
        )}
        {/* `duvod` je vyplněný vždy — i když stupeň vznikne — a jde i do
            `popis` zapsaného hodnocení. */}
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{odvozeni.duvod}</p>
      </div>

      <div>
        <button
          type="submit"
          disabled={probiha || stupen === null}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {probiha ? "Ukládám…" : "Zapsat odvozený stupeň"}
        </button>
        {stupen === null ? (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Dokud z důkazů stupeň neplyne, tlačítko zůstává neaktivní. Doplnit musí
            zásah nebo test, ne volba.
          </p>
        ) : null}
      </div>
    </form>
  );
}
