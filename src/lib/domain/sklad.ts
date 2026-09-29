import type { Component, Dostupnost, Listing, StupenStavu, ListingZDetailem } from "./types";

export interface FiltroSkladu {
  kategorie?: Component["kategorie"];
  dostupnost?: Dostupnost;
  stupen?: StupenStavu;
  hledani?: string;
}

export type RazeniSkladu = "cena-asc" | "cena-desc" | "stav" | "novejsi";

export interface PrehledSkladu {
  kusuCelkem: number;
  kusuDostupnych: number;
  hodnotaSkladu: number;
  hodnotaDostupnych: number;
  marze: number;
  marzeProcenta: number;
  podleKategorie: Array<{ kategorie: Component["kategorie"]; kusu: number; hodnota: number }>;
  podleStavu: Array<{ stupen: StupenStavu; kusu: number }>;
}

/** Kus s dopočtenou marží. Marže je rozdíl prodejní a výkupní ceny. */
export function spocitatMarzi(ceny: Pick<Listing, "cena" | "nakupniCena">): number {
  return ceny.cena - ceny.nakupniCena;
}

/** Marže v procentech vůči výkupní ceně. U kusů s nulovou výkupní cenou vrací nulu. */
export function spocitatMarziProcenta(ceny: Pick<Listing, "cena" | "nakupniCena">): number {
  if (ceny.nakupniCena === 0) {
    return 0;
  }
  return (spocitatMarzi(ceny) / ceny.nakupniCena) * 100;
}

export function filtrovatSklad(
  zaznamy: ListingZDetailem[],
  filtro: FiltroSkladu = {},
): ListingZDetailem[] {
  const hledani = filtro.hledani?.trim().toLowerCase();

  return zaznamy.filter((zaznam) => {
    if (filtro.kategorie && zaznam.component.kategorie !== filtro.kategorie) {
      return false;
    }
    if (filtro.dostupnost && zaznam.listing.dostupnost !== filtro.dostupnost) {
      return false;
    }
    if (filtro.stupen && zaznam.stav.stupen !== filtro.stupen) {
      return false;
    }
    if (hledani) {
      const hledanyText = `${zaznam.component.vyrobce} ${zaznam.component.model} ${zaznam.prodejce.nazev}`;
      if (!hledanyText.toLowerCase().includes(hledani)) {
        return false;
      }
    }
    return true;
  });
}

export function raditSklad(
  zaznamy: ListingZDetailem[],
  razeni: RazeniSkladu,
): ListingZDetailem[] {
  const kopie = [...zaznamy];

  switch (razeni) {
    case "cena-asc":
      return kopie.sort((a, b) => a.listing.cena - b.listing.cena);
    case "cena-desc":
      return kopie.sort((a, b) => b.listing.cena - a.listing.cena);
    case "stav":
      return kopie.sort(
        (a, b) => a.stav.stupen.localeCompare(b.stav.stupen) || a.listing.cena - b.listing.cena,
      );
    case "novejsi":
      return kopie.sort(
        (a, b) => Date.parse(b.listing.vytvorenoKdy) - Date.parse(a.listing.vytvorenoKdy),
      );
  }
}

/**
 * Souhrn skladu pro nástěnku. Počítá se z aktuálně dostupných kusů, rezervované
 * kusy se do prodejní hodnoty nezahrnují, ale zůstávají v `kusuCelkem`.
 */
export function spocitatPrehledSkladu(zaznamy: ListingZDetailem[]): PrehledSkladu {
  const dostupne = zaznamy.filter((zaznam) => zaznam.listing.dostupnost === "dostupne");

  const hodnotaSkladu = zaznamy.reduce((soucet, zaznam) => soucet + zaznam.listing.cena, 0);
  const hodnotaDostupnych = dostupne.reduce((soucet, zaznam) => soucet + zaznam.listing.cena, 0);
  const nakupniHodnota = dostupne.reduce(
    (soucet, zaznam) => soucet + zaznam.listing.nakupniCena,
    0,
  );
  const marze = hodnotaDostupnych - nakupniHodnota;

  const podleKategorie = new Map<Component["kategorie"], { kusu: number; hodnota: number }>();
  const podleStavu = new Map<StupenStavu, number>();

  for (const zaznam of dostupne) {
    const kategorie = zaznam.component.kategorie;
    const existujici = podleKategorie.get(kategorie) ?? { kusu: 0, hodnota: 0 };
    podleKategorie.set(kategorie, {
      kusu: existujici.kusu + 1,
      hodnota: existujici.hodnota + zaznam.listing.cena,
    });

    podleStavu.set(zaznam.stav.stupen, (podleStavu.get(zaznam.stav.stupen) ?? 0) + 1);
  }

  return {
    kusuCelkem: zaznamy.length,
    kusuDostupnych: dostupne.length,
    hodnotaSkladu,
    hodnotaDostupnych,
    marze,
    marzeProcenta: nakupniHodnota === 0 ? 0 : (marze / nakupniHodnota) * 100,
    podleKategorie: [...podleKategorie.entries()]
      .map(([kategorie, hodnoty]) => ({ kategorie, ...hodnoty }))
      .sort((a, b) => b.hodnota - a.hodnota),
    podleStavu: [...podleStavu.entries()]
      .map(([stupen, kusu]) => ({ stupen, kusu }))
      .sort((a, b) => a.stupen.localeCompare(b.stupen)),
  };
}

/** Kusy, u kterých je výkupní cena příliš blízko prodejní — kandidáti na přehodnocení. */
export function najdiNizsiMarzi(
  zaznamy: ListingZDetailem[],
  minMarzeProcenta: number,
  limit = 5,
): ListingZDetailem[] {
  return zaznamy
    .filter((zaznam) => zaznam.listing.dostupnost === "dostupne")
    .filter((zaznam) => spocitatMarziProcenta(zaznam.listing) < minMarzeProcenta)
    .sort((a, b) => spocitatMarziProcenta(a.listing) - spocitatMarziProcenta(b.listing))
    .slice(0, limit);
}
