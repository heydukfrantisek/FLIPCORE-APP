"use client";

import { useActionState, useState } from "react";

import { TEST_POPIS, TYP_TESTU_POPIS } from "@/lib/domain/slovnik";
import type { TypTestu, VysledekTestu } from "@/lib/domain/types";
import { zapsatTest, type StavFormulareTestu } from "@/server/actions/repas";

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

/** Pořadí typů odpovídá pořadí v `TYP_TESTU_POPIS`, ne pořadí klíčů objektu. */
const TYPY_TESTU: TypTestu[] = ["profil", "funkcni", "vizualni"];

/** Pořadí výsledků od nejlepšího k nejhoršímu — je to pořadí, ve kterém člověk čte. */
const VYSLEDKY: VysledekTestu[] = ["prosel", "casti", "selhal"];

/**
 * Formulář zápisu testu jako důkazu o stavu kusu. `kusId` pochází z adresy
 * detailu kusu, proto je svázán `.bind(null, kusId)` a **neposílá se z klienta
 * v `FormData`**.
 *
 * Pole `nalezenaVada` je zaznamenané zjištění, ne úsudek provozovatele, a
 * patří jen vizuální kontrole — u ostatních typů se proto vůbec nezobrazuje a
 * server je stejně odmítí, pokud by se poslalo.
 */
export function FormularTestu({ kusId }: { kusId: string }) {
  const [stav, odeslat, probiha] = useActionState<StavFormulareTestu, FormData>(
    zapsatTest.bind(null, kusId),
    {},
  );
  const [typTestu, setTypTestu] = useState<TypTestu | "">("");
  // Přemountováním se vyprázdní všechna pole formuláře.
  const [kluc, setKluc] = useState(0);
  const [ulozeneKusId, setUlozeneKusId] = useState<string | null>(null);

  if (stav.uspech && stav.uspech.kusId !== ulozeneKusId) {
    setUlozeneKusId(stav.uspech.kusId);
    setKluc((puvodni) => puvodni + 1);
    setTypTestu("");
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
          Test zapsán.
        </p>
      ) : null}

      <Pole popisek="Název testu" chyba={stav.chyby?.nazevTestu} idPole="nazevTestu">
        <input
          type="text"
          name="nazevTestu"
          required
          autoComplete="off"
          placeholder="Profilový test komponenty"
          aria-invalid={stav.chyby?.nazevTestu ? true : undefined}
          aria-describedby={stav.chyby?.nazevTestu ? "chyba-nazevTestu" : undefined}
          className={tridaPole(stav.chyby?.nazevTestu)}
        />
      </Pole>

      <div className="grid gap-4 sm:grid-cols-2">
        <Pole popisek="Typ testu" chyba={stav.chyby?.typTestu} idPole="typTestu">
          <select
            name="typTestu"
            required
            value={typTestu}
            onChange={(udalost) => setTypTestu(udalost.target.value as TypTestu | "")}
            aria-invalid={stav.chyby?.typTestu ? true : undefined}
            aria-describedby={stav.chyby?.typTestu ? "chyba-typTestu" : undefined}
            className={tridaPole(stav.chyby?.typTestu)}
          >
            <option value="" disabled>
              Vyberte…
            </option>
            {TYPY_TESTU.map((typ) => (
              <option key={typ} value={typ}>
                {TYP_TESTU_POPIS[typ]}
              </option>
            ))}
          </select>
        </Pole>

        <Pole popisek="Výsledek" chyba={stav.chyby?.vysledek} idPole="vysledek">
          <select
            name="vysledek"
            required
            defaultValue="prosel"
            aria-invalid={stav.chyby?.vysledek ? true : undefined}
            aria-describedby={stav.chyby?.vysledek ? "chyba-vysledek" : undefined}
            className={tridaPole(stav.chyby?.vysledek)}
          >
            {VYSLEDKY.map((vysledek) => (
              <option key={vysledek} value={vysledek}>
                {TEST_POPIS[vysledek]}
              </option>
            ))}
          </select>
        </Pole>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Pole popisek="Datum testu" chyba={stav.chyby?.provedenoKdy} idPole="provedenoKdy">
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

        {/* Příznak vady je smysluplný jen u vizuální kontroly. Klient ho
            nevynucuje ani nevaliduje — server odmítne vadu mimo typ `vizualni`. */}
        {typTestu === "vizualni" ? (
          <Pole
            popisek="Byla nalezena vada"
            chyba={stav.chyby?.nalezenaVada}
            idPole="nalezenaVada"
            napoveda="Zaznamenané zjištění z kontroly, ne odhad."
          >
            <input
              type="checkbox"
              name="nalezenaVada"
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </Pole>
        ) : null}
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        &bdquo;Prošel&ldquo; znamená, že test proběhl bez chyby. Neznamená to, že byla
        naměřena konkrétní hodnota — naměřené hodnoty se v této iteraci neukládají.
      </p>

      <div>
        <button
          type="submit"
          disabled={probiha}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {probiha ? "Ukládám…" : "Zapsat test"}
        </button>
      </div>
    </form>
  );
}
