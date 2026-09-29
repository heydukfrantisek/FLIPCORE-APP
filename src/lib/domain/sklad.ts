import type { Component, Kus, StavKusu, StupenStavu, KusZDetailem } from "./types";

export interface FiltroSkladu {
  kategorie?: Component["kategorie"];
  stav?: StavKusu;
  stupen?: StupenStavu;
  hledani?: string;
}

export type RazeniSkladu = "cena-asc" | "cena-desc" | "stav" | "novejsi";

export interface PrehledSkladu {
  kusuCelkem: number;
  kusuVystavenych: number;
  /** Součet výkupních cen všech kusů, které stále vlastníme. */
  investovano: number;
  /** Součet prodejních cen kusů ve stavu `vystaveno`. */
  hodnotaVystaveno: number;
  marze: number;
  marzeProcenta: number;
  podleKategorie: Array<{ kategorie: Component["kategorie"]; kusu: number; hodnota: number }>;
  podleStavu: Array<{ stupen: StupenStavu; kusu: number }>;
}

/**
 * Marže kusu. Kus, který ještě není vystaven, nemá prodejní cenu a marži
 * nepočítáme — vrací nulu, aby se do součtů nedostala falešná hodnota.
 */
export function spocitatMarzi(ceny: Pick<Kus, "prodejniCena" | "nakupniCena">): number {
  if (ceny.prodejniCena === null) {
    return 0;
  }
  return ceny.prodejniCena - ceny.nakupniCena;
}

/** Marže v procentech vůči výkupní ceně. U kusů s nulovou výkupní cenou vrací nulu. */
export function spocitatMarziProcenta(ceny: Pick<Kus, "prodejniCena" | "nakupniCena">): number {
  if (ceny.nakupniCena === 0 || ceny.prodejniCena === null) {
    return 0;
  }
  return (spocitatMarzi(ceny) / ceny.nakupniCena) * 100;
}

export function filtrovatSklad(
  zaznamy: KusZDetailem[],
  filtro: FiltroSkladu = {},
): KusZDetailem[] {
  const hledani = filtro.hledani?.trim().toLowerCase();

  return zaznamy.filter((zaznam) => {
    if (filtro.kategorie && zaznam.component.kategorie !== filtro.kategorie) {
      return false;
    }
    if (filtro.stav && zaznam.kus.stav !== filtro.stav) {
      return false;
    }
    if (filtro.stupen && zaznam.stav?.stupen !== filtro.stupen) {
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
  zaznamy: KusZDetailem[],
  razeni: RazeniSkladu,
): KusZDetailem[] {
  const kopie = [...zaznamy];

  // Kus, který ještě není vystaven, nemá prodejní cenu. V obou směrech řazení
  // patří na konec — není nejlevnější ani nejdražší, prostě se ještě neprodává.
  const bezCeny = (a: KusZDetailem, b: KusZDetailem) =>
    Number(a.kus.prodejniCena === null) - Number(b.kus.prodejniCena === null);

  switch (razeni) {
    case "cena-asc":
      return kopie.sort((a, b) => bezCeny(a, b) || a.kus.nakupniCena - b.kus.nakupniCena);
    case "cena-desc":
      return kopie.sort((a, b) => bezCeny(a, b) || b.kus.nakupniCena - a.kus.nakupniCena);
    case "stav":
      return kopie.sort(
        (a, b) =>
          (a.stav?.stupen ?? "E").localeCompare(b.stav?.stupen ?? "E") ||
          (a.kus.prodejniCena ?? 0) - (b.kus.prodejniCena ?? 0),
      );
    case "novejsi":
      return kopie.sort(
        (a, b) => Date.parse(b.kus.vytvorenoKdy) - Date.parse(a.kus.vytvorenoKdy),
      );
  }
}

/**
 * Souhrn skladu pro nástěnku. Prodejní hodnota a marže se počítají jen z kusů
 * ve stavu `vystaveno` — kus, který se neprodává, do výnosu nepatří. Investovaná
 * hodnota se naopak počítá ze všech kusů, protože odpovídá penězům, které
 * vložil provozovatel.
 */
export function spocitatPrehledSkladu(zaznamy: KusZDetailem[]): PrehledSkladu {
  const vystavene = zaznamy.filter((zaznam) => zaznam.kus.stav === "vystaveno");

  const investovano = zaznamy.reduce((soucet, zaznam) => soucet + zaznam.kus.nakupniCena, 0);
  const hodnotaVystaveno = vystavene.reduce(
    (soucet, zaznam) => soucet + (zaznam.kus.prodejniCena ?? 0),
    0,
  );
  const nakupniHodnota = vystavene.reduce((soucet, zaznam) => soucet + zaznam.kus.nakupniCena, 0);
  const marze = hodnotaVystaveno - nakupniHodnota;

  const podleKategorie = new Map<Component["kategorie"], { kusu: number; hodnota: number }>();
  const podleStavu = new Map<StupenStavu, number>();

  for (const zaznam of vystavene) {
    const kategorie = zaznam.component.kategorie;
    const existujici = podleKategorie.get(kategorie) ?? { kusu: 0, hodnota: 0 };
    podleKategorie.set(kategorie, {
      kusu: existujici.kusu + 1,
      hodnota: existujici.hodnota + (zaznam.kus.prodejniCena ?? 0),
    });

    if (zaznam.stav) {
      podleStavu.set(zaznam.stav.stupen, (podleStavu.get(zaznam.stav.stupen) ?? 0) + 1);
    }
  }

  return {
    kusuCelkem: zaznamy.length,
    kusuVystavenych: vystavene.length,
    investovano,
    hodnotaVystaveno,
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
  zaznamy: KusZDetailem[],
  minMarzeProcenta: number,
  limit = 5,
): KusZDetailem[] {
  return zaznamy
    .filter((zaznam) => zaznam.kus.stav === "vystaveno")
    .filter((zaznam) => spocitatMarziProcenta(zaznam.kus) < minMarzeProcenta)
    .sort((a, b) => spocitatMarziProcenta(a.kus) - spocitatMarziProcenta(b.kus))
    .slice(0, limit);
}
