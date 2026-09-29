"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/badge";
import { PrazdnyStav } from "@/components/prazdny-stav";
import { Tabulka, TabulkaBunka, TabulkaHlavicka, TabulkaRadek } from "@/components/tabulka";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";
import {
  DOSTUPNOST_POPIS,
  KATEGORIE_POPIS,
  PORADI_KATEGORII,
} from "@/lib/domain/slovnik";
import { filtrovatSklad, raditSklad, spocitatMarzi, spocitatMarziProcenta } from "@/lib/domain/sklad";
import type { Dostupnost, ListingZDetailem, StupenStavu } from "@/lib/domain/types";

const RAZENI: Array<{ hodnota: "cena-asc" | "cena-desc" | "stav" | "novejsi"; popis: string }> = [
  { hodnota: "novejsi", popis: "Nejnovější" },
  { hodnota: "cena-desc", popis: "Cena od nejvyšší" },
  { hodnota: "cena-asc", popis: "Cena od nejnižší" },
  { hodnota: "stav", popis: "Stav A až D" },
];

const STUPNE: StupenStavu[] = ["A", "B", "C", "D"];

function odstinStavu(stupen: StupenStavu): "success" | "info" | "warning" | "danger" {
  switch (stupen) {
    case "A":
      return "success";
    case "B":
      return "info";
    case "C":
      return "warning";
    case "D":
      return "danger";
  }
}

/**
 * Filtr skladu běží na klientu nad daty, která sem serverová komponenta
 * předala. Pravidla filtru nejsou v této komponentě — pocházejí z `src/lib`,
 * aby se neopakovala na jiném místě.
 */
export function FiltrSkladu({ zaznamy }: { zaznamy: ListingZDetailem[] }) {
  const [hledani, setHledani] = useState("");
  const [kategorie, setKategorie] = useState<string>("");
  const [dostupnost, setDostupnost] = useState<string>("");
  const [stupen, setStupen] = useState<string>("");
  const [razeni, setRazeni] = useState<(typeof RAZENI)[number]["hodnota"]>("novejsi");

  const vysledky = useMemo(() => {
    const filtrovane = filtrovatSklad(zaznamy, {
      hledani,
      kategorie: kategorie ? (kategorie as ListingZDetailem["component"]["kategorie"]) : undefined,
      dostupnost: dostupnost ? (dostupnost as Dostupnost) : undefined,
      stupen: stupen ? (stupen as StupenStavu) : undefined,
    });
    return raditSklad(filtrovane, razeni);
  }, [zaznamy, hledani, kategorie, dostupnost, stupen, razeni]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          Hledat
          <input
            type="search"
            value={hledani}
            onChange={(udalost) => setHledani(udalost.target.value)}
            placeholder="výrobce, model, prodejce"
            className="w-56 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          Kategorie
          <select
            value={kategorie}
            onChange={(udalost) => setKategorie(udalost.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            <option value="">Všechny</option>
            {PORADI_KATEGORII.map((polozka) => (
              <option key={polozka} value={polozka}>
                {KATEGORIE_POPIS[polozka]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          Dostupnost
          <select
            value={dostupnost}
            onChange={(udalost) => setDostupnost(udalost.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            <option value="">Všechny</option>
            {Object.entries(DOSTUPNOST_POPIS).map(([hodnota, popis]) => (
              <option key={hodnota} value={hodnota}>
                {popis}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          Stav
          <select
            value={stupen}
            onChange={(udalost) => setStupen(udalost.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            <option value="">Všechny</option>
            {STUPNE.map((hodnota) => (
              <option key={hodnota} value={hodnota}>
                {hodnota}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          Řazení
          <select
            value={razeni}
            onChange={(udalost) => setRazeni(udalost.target.value as typeof razeni)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            {RAZENI.map((polozka) => (
              <option key={polozka.hodnota} value={polozka.hodnota}>
                {polozka.popis}
              </option>
            ))}
          </select>
        </label>
      </div>

      {vysledky.length === 0 ? (
        <PrazdnyStav
          titulek="Žádné kusy neodpovídají filtru"
          popis="Zkuste zmírnit filtry nebo hledat jiný výraz."
        />
      ) : (
        <Tabulka>
          <TabulkaHlavicka>
            <tr>
              <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Komponenta
              </th>
              <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Kategorie
              </th>
              <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Prodejce
              </th>
              <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Stav
              </th>
              <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Dostupnost
              </th>
              <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Výkup
              </th>
              <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Prodej
              </th>
              <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Marže
              </th>
            </tr>
          </TabulkaHlavicka>
          <tbody>
            {vysledky.map((zaznam) => (
              <TabulkaRadek key={zaznam.listing.id}>
                <TabulkaBunka hlavni>
                  {zaznam.component.vyrobce} {zaznam.component.model}
                  <span className="block text-xs font-normal text-zinc-400 dark:text-zinc-500">
                    {formatDate(zaznam.listing.vytvorenoKdy)}
                  </span>
                </TabulkaBunka>
                <TabulkaBunka>{KATEGORIE_POPIS[zaznam.component.kategorie]}</TabulkaBunka>
                <TabulkaBunka>{zaznam.prodejce.nazev}</TabulkaBunka>
                <TabulkaBunka>
                  <Badge odstin={odstinStavu(zaznam.stav.stupen)}>{zaznam.stav.stupen}</Badge>
                </TabulkaBunka>
                <TabulkaBunka>{DOSTUPNOST_POPIS[zaznam.listing.dostupnost]}</TabulkaBunka>
                <TabulkaBunka className="text-right">
                  {formatCurrency(zaznam.listing.nakupniCena)}
                </TabulkaBunka>
                <TabulkaBunka className="text-right" hlavni>
                  {formatCurrency(zaznam.listing.cena)}
                </TabulkaBunka>
                <TabulkaBunka className="text-right">
                  <span className="block">{formatCurrency(spocitatMarzi(zaznam.listing))}</span>
                  <span className="block text-xs text-zinc-400 dark:text-zinc-500">
                    {formatPercent(spocitatMarziProcenta(zaznam.listing))}
                  </span>
                </TabulkaBunka>
              </TabulkaRadek>
            ))}
          </tbody>
        </Tabulka>
      )}

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Zobrazeno {vysledky.length} z {zaznamy.length} kusů.
      </p>
    </div>
  );
}
