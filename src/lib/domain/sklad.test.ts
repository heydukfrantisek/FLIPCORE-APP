import { describe, expect, it } from "vitest";

import {
  filtrovatSklad,
  najdiNizsiMarzi,
  raditSklad,
  spocitatMarzi,
  spocitatMarziProcenta,
  spocitatPrehledSkladu,
} from "./sklad";
import type { ListingZDetailem } from "./types";

/** Testovací kus pro kategorie, které testy potřebují, s platnou šablonou specifikace. */
function testovaciKomponenta(
  id: string,
  kategorie: "ram" | "ssd",
  model: string,
): ListingZDetailem["component"] {
  if (kategorie === "ram") {
    return {
      id,
      kategorie,
      vyrobce: "Kingston",
      model,
      specifikace: { typ: "DDR4", kapacitaGb: 16, rychlostMhz: 3200, pocetModulu: 2 },
    };
  }
  return {
    id,
    kategorie,
    vyrobce: "Crucial",
    model,
    specifikace: { kapacitaGb: 500, rozhrani: "SATA", typ: "2.5" },
  };
}

function zaznam(overrides: {
  id: string;
  kategorie?: "ram" | "ssd";
  cena: number;
  nakupniCena: number;
  dostupnost?: ListingZDetailem["listing"]["dostupnost"];
  stupen?: "A" | "B" | "C" | "D";
  hledanyText?: string;
  vytvorenoKdy?: string;
}): ListingZDetailem {
  return {
    listing: {
      id: overrides.id,
      componentId: `${overrides.id}-cmp`,
      prodejceId: `${overrides.id}-sel`,
      stavHodnoceniId: `${overrides.id}-grd`,
      cena: overrides.cena,
      nakupniCena: overrides.nakupniCena,
      dostupnost: overrides.dostupnost ?? "dostupne",
      vytvorenoKdy: overrides.vytvorenoKdy ?? "2026-09-01",
    },
    component: testovaciKomponenta(
      `${overrides.id}-cmp`,
      overrides.kategorie ?? "ram",
      overrides.hledanyText ?? "Fury Beast 16 GB DDR4",
    ),
    stav: {
      id: `${overrides.id}-grd`,
      stupen: overrides.stupen ?? "A",
      popis: "Testovací hodnocení",
      zhodnocenoKdy: "2026-09-01",
    },
    prodejce: { id: `${overrides.id}-sel`, nazev: "Bazar Test", typ: "bazar" },
  };
}

describe("spocitatMarzi", () => {
  it("rozdíl prodejní a výkupní ceny v haléřích", () => {
    expect(spocitatMarzi({ cena: 329000, nakupniCena: 280000 })).toBe(49000);
  });

  it("záporná marže u kusu prodávaného pod výkupem", () => {
    expect(spocitatMarzi({ cena: 10000, nakupniCena: 15000 })).toBe(-5000);
  });
});

describe("spocitatMarziProcenta", () => {
  it("marže v procentech vůči výkupní ceně", () => {
    expect(
      spocitatMarziProcenta({ cena: 15000, nakupniCena: 10000 }),
    ).toBe(50);
  });

  it("nulová výkupní cena nesmí dělit nulou", () => {
    expect(spocitatMarziProcenta({ cena: 15000, nakupniCena: 0 })).toBe(0);
  });
});

describe("filtrovatSklad", () => {
  const data = [
    zaznam({ id: "1", kategorie: "ram", cena: 1000, nakupniCena: 500, stupen: "A" }),
    zaznam({ id: "2", kategorie: "ssd", cena: 2000, nakupniCena: 1000, stupen: "B", dostupnost: "prodano", hledanyText: "MX500 500 GB" }),
    zaznam({ id: "3", kategorie: "ram", cena: 3000, nakupniCena: 2000, stupen: "C" }),
  ];

  it("bez filtru vrací vše", () => {
    expect(filtrovatSklad(data)).toHaveLength(3);
  });

  it("filtruje podle kategorie", () => {
    expect(filtrovatSklad(data, { kategorie: "ram" })).toHaveLength(2);
  });

  it("filtruje podle dostupnosti", () => {
    const vysledky = filtrovatSklad(data, { dostupnost: "dostupne" });
    expect(vysledky.map((zaznam) => zaznam.listing.id)).toEqual(["1", "3"]);
  });

  it("filtruje podle stupně stavu", () => {
    expect(filtrovatSklad(data, { stupen: "B" })).toHaveLength(1);
  });

  it("hledá bez rozlišování velikosti písmen a ignoruje okolní mezery", () => {
    const vysledky = filtrovatSklad(data, { hledani: "  ddr4 " });
    expect(vysledky.map((zaznam) => zaznam.listing.id)).toEqual(["1", "3"]);
  });

  it("kombinuje filtry", () => {
    expect(filtrovatSklad(data, { kategorie: "ram", stupen: "C" })).toHaveLength(1);
  });
});

describe("raditSklad", () => {
  const data = [
    zaznam({ id: "1", cena: 3000, nakupniCena: 1000, stupen: "C" }),
    zaznam({ id: "2", cena: 1000, nakupniCena: 500, stupen: "A" }),
    zaznam({ id: "3", cena: 2000, nakupniCena: 900, stupen: "B", vytvorenoKdy: "2026-09-10" }),
  ];

  it("řadí podle ceny vzestupně", () => {
    expect(raditSklad(data, "cena-asc").map((z) => z.listing.id)).toEqual(["2", "3", "1"]);
  });

  it("řadí podle ceny sestupně", () => {
    expect(raditSklad(data, "cena-desc").map((z) => z.listing.id)).toEqual(["1", "3", "2"]);
  });

  it("řadí podle stavu od A", () => {
    expect(raditSklad(data, "stav").map((z) => z.listing.id)).toEqual(["2", "3", "1"]);
  });

  it("řadí podle data vytvoření, nejnovější první", () => {
    expect(raditSklad(data, "novejsi").map((z) => z.listing.id)).toEqual(["3", "1", "2"]);
  });

  it("nemění vstupní pole", () => {
    const puvodniPoradi = data.map((z) => z.listing.id);
    raditSklad(data, "cena-asc");
    expect(data.map((z) => z.listing.id)).toEqual(puvodniPoradi);
  });
});

describe("spocitatPrehledSkladu", () => {
  const data = [
    zaznam({ id: "1", kategorie: "ram", cena: 3000, nakupniCena: 1000 }),
    zaznam({ id: "2", kategorie: "ssd", cena: 2000, nakupniCena: 1000, dostupnost: "rezervovano" }),
    zaznam({ id: "3", kategorie: "ram", cena: 1000, nakupniCena: 500, stupen: "B" }),
  ];

  it("počítá kusy a hodnoty celého skladu", () => {
    const prehled = spocitatPrehledSkladu(data);
    expect(prehled.kusuCelkem).toBe(3);
    expect(prehled.kusuDostupnych).toBe(2);
    expect(prehled.hodnotaSkladu).toBe(6000);
  });

  it("rezervovaný kus se nezapočítává do dostupné hodnoty", () => {
    expect(spocitatPrehledSkladu(data).hodnotaDostupnych).toBe(4000);
  });

  it("marže se počítá jen z dostupných kusů", () => {
    const prehled = spocitatPrehledSkladu(data);
    expect(prehled.marze).toBe(2500);
    expect(prehled.marzeProcenta).toBeCloseTo(166.67, 2);
  });

  it("sestaví rozpad podle kategorie sestupně podle hodnoty", () => {
    const prehled = spocitatPrehledSkladu(data);
    expect(prehled.podleKategorie).toEqual([{ kategorie: "ram", kusu: 2, hodnota: 4000 }]);
  });

  it("sestaví rozpad podle stupně stavu", () => {
    const prehled = spocitatPrehledSkladu(data);
    expect(prehled.podleStavu).toEqual([
      { stupen: "A", kusu: 1 },
      { stupen: "B", kusu: 1 },
    ]);
  });

  it("prázdný sklad nesmí dělit nulou", () => {
    const prehled = spocitatPrehledSkladu([]);
    expect(prehled.marzeProcenta).toBe(0);
    expect(prehled.podleKategorie).toEqual([]);
  });
});

describe("najdiNizsiMarzi", () => {
  const data = [
    zaznam({ id: "1", cena: 1000, nakupniCena: 500 }),
    zaznam({ id: "2", cena: 1100, nakupniCena: 1000 }),
    zaznam({ id: "3", cena: 2000, nakupniCena: 1000, dostupnost: "prodano" }),
  ];

  it("vrací jen dostupné kusy pod hranicí, od nejnižší marže", () => {
    const vysledky = najdiNizsiMarzi(data, 30);
    expect(vysledky.map((z) => z.listing.id)).toEqual(["2"]);
  });

  it("respektuje limit", () => {
    expect(najdiNizsiMarzi(data, 500, 1)).toHaveLength(1);
  });
});
