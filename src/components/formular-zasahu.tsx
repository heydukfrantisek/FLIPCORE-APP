"use client";

import { useActionState, useState } from "react";

import { ZASAH_POPIS } from "@/lib/domain/slovnik";
import type { TypZasahu } from "@/lib/domain/types";
import { zapsatZasah, type StavFormulareZasahu } from "@/server/actions/repas";

/** Dnes ve formátu `RRRR-MM-DD`, jaký čeká pole `type="date"`. */
function dnes(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Chybné pole musí být vidět i bez myši, proto obnáší červený rámeček. */
function tridaPole(chyba?: string): string {
  const zaklad =
    "rounded-lg border px-3 py-2 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50";
  return chyba
    ? `${zaklad} border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/30`
    : `${zaklad} border-zinc-300 dark:border-zinc-700`;
}

function ChybovaZprava({ chyba, id }: { chyba?: string; id: string }) {
  if (!chyba) {
    return null;
  }
  return (
    <p id={id} role="alert" className="text-xs text-red-600 dark:text-red-400">
      {chyba}
    </p>
  );
}

function Pole({
  popisek,
  chyba,
  idPole,
  children,
  napoveda,
}: {
  popisek: string;
  chyba?: string;
  idPole: string;
  children: React.ReactNode;
  napoveda?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
      {popisek}
      {children}
      {napoveda && !chyba ? <span className="text-xs text-zinc-400">{napoveda}</span> : null}
      <ChybovaZprava id={`chyba-${idPole}`} chyba={chyba} />
    </label>
  );
}

/** Typy zásahu v pevném pořadí slovníku, ne v abecedním pořadí klíčů. */
const TYPY_ZASAHU: TypZasahu[] = ["cisteni", "oprava", "vymena", "testovani"];

/**
 * Formulář zápisu zásahu na kus. `kusId` pochází z adresy detailu kusu, proto
 * je svázán `.bind(null, kusId)` a **neposílá se z klienta v `FormData`** —
 * klientem poslané ID by šlo podvrhnout.
 *
 * Klient nic nevaliduje obsahově: server zásah ověří znovu a chyby vrátí k
 * jednotlivým polím. Jediná věc, kterou tu řešíme, je zobrazení pole
 * `nahradniDil`, které má význam jen u výměny.
 */
export function FormularZasahu({ kusId }: { kusId: string }) {
  const [stav, odeslat, probiha] = useActionState<StavFormulareZasahu, FormData>(
    zapsatZasah.bind(null, kusId),
    {},
  );
  const [typZasahu, setTypZasahu] = useState<TypZasahu | "">("");
  // Přemountováním se vyprázdní všechna pole formuláře.
  const [kluc, setKluc] = useState(0);
  const [ulozeneKusId, setUlozeneKusId] = useState<string | null>(null);

  // Stav se mění až po odeslání, takže hodnotu posledního uloženého kusu
  // upravíme tady během vykreslení — stejně jako ve formuláři výkupu.
  if (stav.uspech && stav.uspech.kusId !== ulozeneKusId) {
    setUlozeneKusId(stav.uspech.kusId);
    setKluc((puvodni) => puvodni + 1);
    setTypZasahu("");
  }

  return (
    <form key={kluc} action={odeslat} className="flex flex-col gap-4">
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
          Zásah zapsán.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Pole popisek="Typ zásahu" chyba={stav.chyby?.typZasahu} idPole="typZasahu">
          <select
            name="typZasahu"
            required
            value={typZasahu}
            onChange={(udalost) => setTypZasahu(udalost.target.value as TypZasahu | "")}
            aria-invalid={stav.chyby?.typZasahu ? true : undefined}
            aria-describedby={stav.chyby?.typZasahu ? "chyba-typZasahu" : undefined}
            className={tridaPole(stav.chyby?.typZasahu)}
          >
            <option value="" disabled>
              Vyberte…
            </option>
            {TYPY_ZASAHU.map((typ) => (
              <option key={typ} value={typ}>
                {ZASAH_POPIS[typ]}
              </option>
            ))}
          </select>
        </Pole>

        <Pole popisek="Datum zásahu" chyba={stav.chyby?.provedenoKdy} idPole="provedenoKdy">
          <input
            type="date"
            name="provedenoKdy"
            required
            defaultValue={dnes()}
            max={dnes()}
            aria-invalid={stav.chyby?.provedenoKdy ? true : undefined}
            aria-describedby={stav.chyby?.provedenoKdy ? "chyba-provedenoKdy" : undefined}
            className={tridaPole(stav.chyby?.provedenoKdy)}
          />
        </Pole>
      </div>

      <Pole popisek="Co jste na kusu udělali" chyba={stav.chyby?.popis} idPole="popis">
        <textarea
          name="popis"
          required
          rows={3}
          placeholder="Vyčištění chladiče, výměna ventilátoru…"
          aria-invalid={stav.chyby?.popis ? true : undefined}
          aria-describedby={stav.chyby?.popis ? "chyba-popis" : undefined}
          className={tridaPole(stav.chyby?.popis)}
        />
      </Pole>

      <div className="grid gap-4 sm:grid-cols-2">
        <Pole popisek="Náklady zásahu (Kč)" chyba={stav.chyby?.naklady} idPole="naklady">
          <input
            type="text"
            name="naklady"
            required
            inputMode="decimal"
            autoComplete="off"
            placeholder="450 nebo 450,50"
            aria-invalid={stav.chyby?.naklady ? true : undefined}
            aria-describedby={stav.chyby?.naklady ? "chyba-naklady" : undefined}
            className={tridaPole(stav.chyby?.naklady)}
          />
        </Pole>

        {/* Zaškrtávátko se objeví jen u výměny — u ostatních zásahů nemá význam
            a posílalo by falešný údaj do důkazů. Klient ho nevynucuje, server
            výměnu bez `nahradniDil` stejně odmítne. */}
        {typZasahu === "vymena" ? (
          <Pole
            popisek="Měnil se díl"
            chyba={stav.chyby?.nahradniDil}
            idPole="nahradniDil"
            napoveda="U výměny je nutné uvést, že se měnil díl."
          >
            <input
              type="checkbox"
              name="nahradniDil"
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </Pole>
        ) : null}
      </div>

      <div>
        <button
          type="submit"
          disabled={probiha}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {probiha ? "Ukládám…" : "Zapsat zásah"}
        </button>
      </div>
    </form>
  );
}
