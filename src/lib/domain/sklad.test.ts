import { describe, expect, it } from "vitest";

import {
  filtrovatSklad,
  najdiNizsiMarzi,
  raditSklad,
  spocitatMarzi,
  spocitatMarziProcenta,
  spocitatPrehledSkladu,
} from "./sklad";
import type { KusZDetailem, StavKusu } from "./types";

/** Testovací kus pro kategorie, které testy potřebují, s platnou šablonou specifikace. */
function testovaciKomponenta(
  id: string,
  kategorie: "ram" | "ssd",
  model: string,
): KusZDetailem["component"] {
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
  /** Prodejní cena. `null` znamená, že kus ještě není vystaven. */
  cena?: number | null;
  nakupniCena: number;
  stav?: StavKusu;
  stupen?: "A" | "B" | "C" | "D";
  hledanyText?: string;
  vytvorenoKdy?: string;
}): KusZDetailem {
  const stav = overrides.stav ?? "vystaveno";
  const bezOhnoceni = overrides.stupen === undefined;

  return {
    kus: {
      id: overrides.id,
      componentId: `${overrides.id}-cmp`,
      prodejceId: `${overrides.id}-sel`,
      stav,
      nakupniCena: overrides.nakupniCena,
      prodejniCena: "cena" in overrides ? (overrides.cena ?? null) : 1000,
      datumVykupu: "2026-09-01",
      vytvorenoKdy: overrides.vytvorenoKdy ?? "2026-09-01",
    },
    component: testovaciKomponenta(
      `${overrides.id}-cmp`,
      overrides.kategorie ?? "ram",
      overrides.hledanyText ?? "Fury Beast 16 GB DDR4",
    ),
    stav: bezOhnoceni
      ? undefined
      : {
          id: `${overrides.id}-grd`,
          kusId: overrides.id,
          stupen: overrides.stupen!,
          popis: "Testovací hodnocení",
          zhodnocenoKdy: "2026-09-01",
        },
    prodejce: { id: `${overrides.id}-sel`, nazev: "Bazar Test", typ: "bazar" },
  };
}

describe("spocitatMarzi", () => {
  it("rozdíl prodejní a výkupní ceny v haléřích", () => {
    expect(spocitatMarzi({ prodejniCena: 329000, nakupniCena: 280000 })).toBe(49000);
  });

  it("záporná marže u kusu prodávaného pod výkupem", () => {
    expect(spocitatMarzi({ prodejniCena: 10000, nakupniCena: 15000 })).toBe(-5000);
  });

  it("nevystavený kus bez prodejní ceny nemá marži", () => {
    expect(spocitatMarzi({ prodejniCena: null, nakupniCena: 10000 })).toBe(0);
  });
});

describe("spocitatMarziProcenta", () => {
  it("marže v procentech vůči výkupní ceně", () => {
    expect(spocitatMarziProcenta({ prodejniCena: 15000, nakupniCena: 10000 })).toBe(50);
  });

  it("nulová výkupní cena nesmí dělit nulou", () => {
    expect(spocitatMarziProcenta({ prodejniCena: 15000, nakupniCena: 0 })).toBe(0);
  });

  it("kus bez prodejní ceny nemá procenta", () => {
    expect(spocitatMarziProcenta({ prodejniCena: null, nakupniCena: 10000 })).toBe(0);
  });
});

describe("filtrovatSklad", () => {
  const data = [
    zaznam({ id: "1", kategorie: "ram", cena: 1000, nakupniCena: 500, stupen: "A" }),
    zaznam({ id: "2", kategorie: "ssd", cena: 2000, nakupniCena: 1000, stupen: "B", stav: "prodano", hledanyText: "MX500 500 GB" }),
    zaznam({ id: "3", kategorie: "ram", cena: 3000, nakupniCena: 2000, stupen: "C" }),
  ];

  it("bez filtru vrací vše", () => {
    expect(filtrovatSklad(data)).toHaveLength(3);
  });

  it("filtruje podle kategorie", () => {
    expect(filtrovatSklad(data, { kategorie: "ram" })).toHaveLength(2);
  });

  it("filtruje podle stavu kusu", () => {
    const vysledky = filtrovatSklad(data, { stav: "vystaveno" });
    expect(vysledky.map((zaznam) => zaznam.kus.id)).toEqual(["1", "3"]);
  });

  it("filtruje kusy, které ještě neprošly ohodnocením", () => {
    const vRepase = [
      zaznam({ id: "1", cena: 1000, nakupniCena: 500, stav: "v_repasu" }),
      zaznam({ id: "2", cena: 1000, nakupniCena: 500, stav: "ohodnoceno" }),
    ];
    expect(filtrovatSklad(vRepase, { stav: "v_repasu" }).map((z) => z.kus.id)).toEqual(["1"]);
    expect(filtrovatSklad(vRepase, { stav: "ohodnoceno" }).map((z) => z.kus.id)).toEqual(["2"]);
  });

  it("filtruje podle stupně hodnocení", () => {
    expect(filtrovatSklad(data, { stupen: "B" })).toHaveLength(1);
  });

  it("kus bez hodnocení neprojde filtrem stupně", () => {
    const neohodnocene = [zaznam({ id: "1", cena: 1000, nakupniCena: 500, stav: "vykoupeno" })];
    expect(filtrovatSklad(neohodnocene, { stupen: "A" })).toHaveLength(0);
  });

  it("hledá bez rozlišování velikosti písmen a ignoruje okolní mezery", () => {
    const vysledky = filtrovatSklad(data, { hledani: "  ddr4 " });
    expect(vysledky.map((zaznam) => zaznam.kus.id)).toEqual(["1", "3"]);
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
    expect(raditSklad(data, "cena-asc").map((z) => z.kus.id)).toEqual(["2", "3", "1"]);
  });

  it("řadí podle ceny sestupně", () => {
    expect(raditSklad(data, "cena-desc").map((z) => z.kus.id)).toEqual(["1", "3", "2"]);
  });

  it("řadí podle stavu od A", () => {
    expect(raditSklad(data, "stav").map((z) => z.kus.id)).toEqual(["2", "3", "1"]);
  });

  it("řadí podle data vytvoření, nejnovější první", () => {
    expect(raditSklad(data, "novejsi").map((z) => z.kus.id)).toEqual(["3", "1", "2"]);
  });

  it("kus bez ceny se v řazení podle ceny srovná až na konec", () => {
    const sBezCeny = [
      zaznam({ id: "1", cena: null, nakupniCena: 500, stav: "vykoupeno" }),
      zaznam({ id: "2", cena: 1000, nakupniCena: 500, stupen: "A" }),
    ];
    expect(raditSklad(sBezCeny, "cena-asc").map((z) => z.kus.id)).toEqual(["2", "1"]);
    expect(raditSklad(sBezCeny, "cena-desc").map((z) => z.kus.id)).toEqual(["2", "1"]);
  });

  it("nemění vstupní pole", () => {
    const puvodniPoradi = data.map((z) => z.kus.id);
    raditSklad(data, "cena-asc");
    expect(data.map((z) => z.kus.id)).toEqual(puvodniPoradi);
  });
});

describe("spocitatPrehledSkladu", () => {
  const data = [
    zaznam({ id: "1", kategorie: "ram", cena: 3000, nakupniCena: 1000, stupen: "A" }),
    zaznam({ id: "2", kategorie: "ssd", cena: 2000, nakupniCena: 1000, stupen: "B", stav: "rezervovano" }),
    zaznam({ id: "3", kategorie: "ram", cena: 1000, nakupniCena: 500, stupen: "B" }),
  ];

  it("počítá kusy a rozlišuje investovanou a prodejní hodnotu", () => {
    const prehled = spocitatPrehledSkladu(data);
    expect(prehled.kusuCelkem).toBe(3);
    expect(prehled.kusuVystavenych).toBe(2);
    expect(prehled.investovano).toBe(2500);
    expect(prehled.hodnotaVystaveno).toBe(4000);
  });

  it("rezervovaný kus se nezapočítává do vystavené hodnoty", () => {
    expect(spocitatPrehledSkladu(data).hodnotaVystaveno).toBe(4000);
  });

  it("marže se počítá jen z vystavených kusů", () => {
    const prehled = spocitatPrehledSkladu(data);
    expect(prehled.marze).toBe(2500);
    expect(prehled.marzeProcenta).toBeCloseTo(166.67, 2);
  });

  it("sestaví rozpad podle kategorie sestupně podle hodnoty", () => {
    const prehled = spocitatPrehledSkladu(data);
    expect(prehled.podleKategorie).toEqual([{ kategorie: "ram", kusu: 2, hodnota: 4000 }]);
  });

  it("sestaví rozpad podle stupně hodnocení", () => {
    const prehled = spocitatPrehledSkladu(data);
    expect(prehled.podleStavu).toEqual([
      { stupen: "A", kusu: 1 },
      { stupen: "B", kusu: 1 },
    ]);
  });

  it("vystavený kus bez hodnocení se do rozpadu podle stupně nedostane", () => {
    const prehled = spocitatPrehledSkladu([zaznam({ id: "1", cena: 1000, nakupniCena: 500 })]);
    expect(prehled.podleStavu).toEqual([]);
    expect(prehled.kusuVystavenych).toBe(1);
  });

  it("prázdná databáze nesmí spadnout ani dělit nulou", () => {
    const prehled = spocitatPrehledSkladu([]);
    expect(prehled.kusuCelkem).toBe(0);
    expect(prehled.kusuVystavenych).toBe(0);
    expect(prehled.investovano).toBe(0);
    expect(prehled.hodnotaVystaveno).toBe(0);
    expect(prehled.marze).toBe(0);
    expect(prehled.marzeProcenta).toBe(0);
    expect(prehled.podleKategorie).toEqual([]);
    expect(prehled.podleStavu).toEqual([]);
  });
});

describe("najdiNizsiMarzi", () => {
  const data = [
    zaznam({ id: "1", cena: 1000, nakupniCena: 500 }),
    zaznam({ id: "2", cena: 1100, nakupniCena: 1000 }),
    zaznam({ id: "3", cena: 2000, nakupniCena: 1000, stav: "prodano" }),
    zaznam({ id: "4", cena: null, nakupniCena: 1000, stav: "v_repasu" }),
  ];

  it("vrací jen vystavené kusy pod hranicí, od nejnižší marže", () => {
    const vysledky = najdiNizsiMarzi(data, 30);
    expect(vysledky.map((z) => z.kus.id)).toEqual(["2"]);
  });

  it("respektuje limit", () => {
    expect(najdiNizsiMarzi(data, 500, 1)).toHaveLength(1);
  });
});
