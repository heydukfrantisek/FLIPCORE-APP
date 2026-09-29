import { describe, expect, it } from "vitest";

import { mesicZDatumu, nazevMesice, spocitatDph, spocitatPrehledFinanc, spocitatZakladDanoveZakladny } from "./finance";
import type { Transakce } from "./types";

const TRANSAKCE: Transakce[] = [
  { id: "t1", typ: "prijem", kategorie: "prodej", popis: "Prodej", castka: 100000, datum: "2026-09-01" },
  { id: "t2", typ: "prijem", kategorie: "prodej", popis: "Prodej", castka: 20000, datum: "2026-09-15" },
  { id: "t3", typ: "vydaj", kategorie: "nakup", popis: "Výkup", castka: 90000, datum: "2026-09-10" },
  { id: "t4", typ: "vydaj", kategorie: "doprava", popis: "Doprava", castka: 1000, datum: "2026-08-30" },
  { id: "t5", typ: "prijem", kategorie: "prodej", popis: "Prodej srpna", castka: 50000, datum: "2026-08-05" },
];

describe("mesicZDatumu", () => {
  it("vytáhne měsíc z data", () => {
    expect(mesicZDatumu("2026-09-15")).toBe("2026-09");
  });
});

describe("nazevMesice", () => {
  it("přeloží číslo měsíce na český název", () => {
    expect(nazevMesice("2026-01")).toBe("leden");
    expect(nazevMesice("2026-09")).toBe("září");
    expect(nazevMesice("2026-12")).toBe("prosinec");
  });

  it("nesmyslný měsíc vrátí beze změny", () => {
    expect(nazevMesice("2026-99")).toBe("2026-99");
  });
});

describe("spocitatZakladDanoveZakladny", () => {
  it("základ daně je obrat z prodejů, ne z marže", () => {
    expect(spocitatZakladDanoveZakladny(TRANSAKCE)).toBe(170000);
  });

  it("ignoruje ostatní příjmy", () => {
    const prehled = spocitatPrehledFinanc(
      [{ id: "x", typ: "prijem", kategorie: "skladovani", popis: "Vratka nájmu", castka: 1000, datum: "2026-09-01" }],
      21,
    );
    expect(prehled.zakladDanoveZakladny).toBe(0);
    expect(prehled.dph).toBe(0);
  });
});

describe("spocitatDph", () => {
  it("počítá DPH ze základu a zaokrouhlí na celé haléře", () => {
    expect(spocitatDph(100000, 21)).toBe(21000);
    expect(spocitatDph(33333, 21)).toBe(7000);
  });

  it("nulová sazba dává nulu", () => {
    expect(spocitatDph(100000, 0)).toBe(0);
  });
});

describe("spocitatPrehledFinanc", () => {
  it("sečte příjmy, výdaje a výsledek", () => {
    const prehled = spocitatPrehledFinanc(TRANSAKCE, 21);
    expect(prehled.prijmy).toBe(170000);
    expect(prehled.vydaje).toBe(91000);
    expect(prehled.vysledek).toBe(79000);
  });

  it("marže v procentech je vztažena k příjmům", () => {
    const prehled = spocitatPrehledFinanc(TRANSAKCE, 21);
    expect(prehled.marzeProcenta).toBeCloseTo(46.47, 2);
  });

  it("počítá DPH z prodejů", () => {
    const prehled = spocitatPrehledFinanc(TRANSAKCE, 21);
    expect(prehled.zakladDanoveZakladny).toBe(170000);
    expect(prehled.dph).toBe(35700);
    expect(prehled.dphProcenta).toBe(21);
  });

  it("rozdělí pohyby podle měsíce a seřadí chronologicky", () => {
    const prehled = spocitatPrehledFinanc(TRANSAKCE, 21);
    expect(prehled.podleMesice).toEqual([
      { mesic: "2026-08", prijmy: 50000, vydaje: 1000, vysledek: 49000 },
      { mesic: "2026-09", prijmy: 120000, vydaje: 90000, vysledek: 30000 },
    ]);
  });

  it("seskupí kategorie a seřadí je sestupně podle částky", () => {
    const prehled = spocitatPrehledFinanc(TRANSAKCE, 21);
    expect(prehled.podleKategorie.map((radek) => radek.kategorie)).toEqual([
      "prodej",
      "nakup",
      "doprava",
    ]);
  });

  it("prázdné období nesmí dělit nulou", () => {
    const prehled = spocitatPrehledFinanc([], 21);
    expect(prehled.prijmy).toBe(0);
    expect(prehled.vydaje).toBe(0);
    expect(prehled.marzeProcenta).toBe(0);
    expect(prehled.podleMesice).toEqual([]);
  });
});
