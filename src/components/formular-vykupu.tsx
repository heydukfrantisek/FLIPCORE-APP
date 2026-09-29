"use client";

import { useActionState, useState } from "react";

import { NOVYY_PRODEJCE } from "@/lib/domain/vykup";
import { KATEGORIE_POPIS, PORADI_KATEGORII } from "@/lib/domain/slovnik";
import type { Component, Seller } from "@/lib/domain/types";
import { zapsatVykup, type StavFormulareVykupu } from "@/server/actions/vykup";

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
}: {
  popisek: string;
  chyba?: string;
  idPole: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
      {popisek}
      {children}
      <ChybovaZprava id={`chyba-${idPole}`} chyba={chyba} />
    </label>
  );
}

/**
 * Formulář evidence výkupu. Chyby se vrací jako návratová hodnota serverové
 * akce a zobrazují se u jednotlivých polí. Po uložení se formulář vyprázdní,
 * protože bazar výkupů zaznamenává více po sobě.
 */
export function FormularVykupu({
  komponenty,
  prodejci,
}: {
  komponenty: Component[];
  prodejci: Seller[];
}) {
  const [stav, odeslat, probiha] = useActionState<StavFormulareVykupu, FormData>(
    zapsatVykup,
    {},
  );
  const [novyProdejce, setNovyProdejce] = useState(false);
  // Přemountováním se vyprázdní všechna pole formuláře.
  const [kluc, setKluc] = useState(0);
  const [ulozeneKusId, setUlozeneKusId] = useState<string | null>(null);

  // Stav se mění až po odeslání, takže hodnotu posledního uloženého kusu
  // upravíme tady během vykreslení. React při tom překreslí formulář rovnou,
  // bez efektu a bez druhého průchodu.
  if (stav.uspech && stav.uspech.kusId !== ulozeneKusId) {
    setUlozeneKusId(stav.uspech.kusId);
    setKluc((puvodni) => puvodni + 1);
    setNovyProdejce(false);
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
          Výkup uložen. Kus čeká v repase.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Pole popisek="Komponenta" chyba={stav.chyby?.componentId} idPole="componentId">
          <select
            name="componentId"
            required
            defaultValue=""
            aria-invalid={stav.chyby?.componentId ? true : undefined}
            aria-describedby={stav.chyby?.componentId ? "chyba-componentId" : undefined}
            className={tridaPole(stav.chyby?.componentId)}
          >
            <option value="" disabled>
              Vyberte…
            </option>
            {PORADI_KATEGORII.map((kategorie) => {
              const vKategorii = komponenty.filter(
                (komponenta) => komponenta.kategorie === kategorie,
              );
              if (vKategorii.length === 0) {
                return null;
              }
              return (
                <optgroup key={kategorie} label={KATEGORIE_POPIS[kategorie]}>
                  {vKategorii.map((komponenta) => (
                    <option key={komponenta.id} value={komponenta.id}>
                      {komponenta.vyrobce} {komponenta.model}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </Pole>

        <Pole popisek="Prodejce" chyba={stav.chyby?.prodejce} idPole="prodejce">
          <select
            name="prodejceId"
            required
            value={novyProdejce ? NOVYY_PRODEJCE : ""}
            onChange={(udalost) => setNovyProdejce(udalost.target.value === NOVYY_PRODEJCE)}
            aria-invalid={stav.chyby?.prodejce ? true : undefined}
            aria-describedby={stav.chyby?.prodejce ? "chyba-prodejce" : undefined}
            className={tridaPole(stav.chyby?.prodejce)}
          >
            <option value="" disabled>
              {prodejci.length === 0 ? "Zatím žádný prodejce" : "Vyberte prodejce…"}
            </option>
            {prodejci.map((prodejce) => (
              <option key={prodejce.id} value={prodejce.id}>
                {prodejce.nazev}
              </option>
            ))}
            <option value={NOVYY_PRODEJCE}>Nový prodejce…</option>
          </select>
        </Pole>
      </div>

      {novyProdejce ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Pole popisek="Název prodejce" chyba={stav.chyby?.prodejce} idPole="nazevProdejce">
            <input
              type="text"
              name="nazevProdejce"
              required
              autoComplete="off"
              className={tridaPole(stav.chyby?.prodejce)}
            />
          </Pole>
          <Pole popisek="Typ prodejce" chyba={stav.chyby?.prodejce} idPole="typProdejce">
            <select name="typProdejce" required defaultValue="bazar" className={tridaPole()}>
              <option value="bazar">Bazar</option>
              <option value="firma">Firma</option>
              <option value="jednotlivec">Jednotlivec</option>
            </select>
          </Pole>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Pole popisek="Výkupní cena (Kč)" chyba={stav.chyby?.nakupniCena} idPole="nakupniCena">
          <input
            type="text"
            name="nakupniCena"
            required
            inputMode="decimal"
            autoComplete="off"
            placeholder="1600 nebo 1 600,50"
            aria-invalid={stav.chyby?.nakupniCena ? true : undefined}
            aria-describedby={stav.chyby?.nakupniCena ? "chyba-nakupniCena" : undefined}
            className={tridaPole(stav.chyby?.nakupniCena)}
          />
        </Pole>

        <Pole popisek="Datum výkupu" chyba={stav.chyby?.datumVykupu} idPole="datumVykupu">
          <input
            type="date"
            name="datumVykupu"
            required
            defaultValue={dnes()}
            max={dnes()}
            aria-invalid={stav.chyby?.datumVykupu ? true : undefined}
            aria-describedby={stav.chyby?.datumVykupu ? "chyba-datumVykupu" : undefined}
            className={tridaPole(stav.chyby?.datumVykupu)}
          />
        </Pole>
      </div>

      <div>
        <button
          type="submit"
          disabled={probiha}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {probiha ? "Ukládám…" : "Zapsat výkup"}
        </button>
      </div>
    </form>
  );
}
