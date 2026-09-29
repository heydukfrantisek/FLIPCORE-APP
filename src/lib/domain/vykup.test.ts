import { describe, expect, it } from "vitest";

import {
  NOVYY_PRODEJCE,
  jeDatumVykupuPovolene,
  prevodCenyNaHalere,
  validujVykup,
} from "./vykup";

/** Sestaví `FormData` jako by přišel z prohlížeče. */
function formulare(hodnoty: Record<string, string>): FormData {
  const data = new FormData();
  for (const [klic, hodnota] of Object.entries(hodnoty)) {
    data.append(klic, hodnota);
  }
  return data;
}

const DNES = new Date("2026-09-29T10:00:00Z");

const platnyVykup = {
  componentId: "cmp-cpu-01",
  prodejceId: "sel-01",
  nakupniCena: "1600",
  datumVykupu: "2026-09-28",
};

describe("prevodCenyNaHalere", () => {
  it("celé číslo bez oddělovače", () => {
    expect(prevodCenyNaHalere("1600")).toBe(160000);
  });

  it("česká desetinná čárka", () => {
    expect(prevodCenyNaHalere("1600,50")).toBe(160050);
  });

  it("mezery jako oddělovač tisíců", () => {
    expect(prevodCenyNaHalere("1 600,50")).toBe(160050);
  });

  it("tečka jako oddělovač tisíců", () => {
    expect(prevodCenyNaHalere("1.600")).toBe(160000);
  });

  it("tečky oddělující tisíce", () => {
    expect(prevodCenyNaHalere("1.234.567")).toBe(123456700);
  });

  it("jedno desetinné místo doplní nulu", () => {
    expect(prevodCenyNaHalere("12,5")).toBe(1250);
  });

  it("nulová celá část", () => {
    expect(prevodCenyNaHalere("0,99")).toBe(99);
  });

  it("ignoruje okolní mezery", () => {
    expect(prevodCenyNaHalere("  1 600  ")).toBe(160000);
  });

  it.each([
    ["prázdný řetězec", ""],
    ["jen mezery", "   "],
    ["text", "abc"],
    ["záporné číslo", "-100"],
    ["tři desetinná místa", "12,345"],
    ["desetinná čárka bez číslic", "12,"],
    ["podtržítko místo číslice", "12_00"],
    ["více znaků, než je číslo", "12 Kč"],
  ])("odmítne %s", (_, vstup) => {
    expect(prevodCenyNaHalere(vstup)).toBeNull();
  });
});

describe("jeDatumVykupuPovolene", () => {
  it("dnešní datum je povoleno", () => {
    expect(jeDatumVykupuPovolene("2026-09-29", DNES)).toBe(true);
  });

  it("minulé datum je povoleno", () => {
    expect(jeDatumVykupuPovolene("2026-01-01", DNES)).toBe(true);
  });

  it("zítřejší datum není povoleno", () => {
    expect(jeDatumVykupuPovolene("2026-09-30", DNES)).toBe(false);
  });

  it("datum v jiném tvaru není povoleno", () => {
    expect(jeDatumVykupuPovolene("29. 9. 2026", DNES)).toBe(false);
  });

  it("neexistující datum není povoleno", () => {
    expect(jeDatumVykupuPovolene("2026-02-30", DNES)).toBe(false);
  });
});

describe("validujVykup", () => {
  it("přijme platný výkup u existujícího prodejce", () => {
    const vysledek = validujVykup(formulare(platnyVykup), DNES);
    expect(vysledek.uspech).toBe(true);
    expect(vysledek.vykup).toEqual({
      componentId: "cmp-cpu-01",
      prodejce: { rezim: "existujici", prodejceId: "sel-01" },
      nakupniCena: 160000,
      datumVykupu: "2026-09-28",
    });
  });

  it("přijme nového prodejce a ostřího název", () => {
    const vysledek = validujVykup(
      formulare({
        ...platnyVykup,
        prodejceId: NOVYY_PRODEJCE,
        nazevProdejce: "  Bazar Sever  ",
        typProdejce: "bazar",
      }),
      DNES,
    );

    expect(vysledek.uspech).toBe(true);
    expect(vysledek.vykup?.prodejce).toEqual({
      rezim: "novy",
      nazev: "Bazar Sever",
      typ: "bazar",
    });
  });

  it("vyžaduje výběr komponenty", () => {
    const vysledek = validujVykup(formulare({ ...platnyVykup, componentId: "" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.componentId).toBe("Vyberte typ komponenty.");
  });

  it("vyžaduje prodejce", () => {
    const vysledek = validujVykup(formulare({ ...platnyVykup, prodejceId: "" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.prodejce).toBe("Vyberte prodejce.");
  });

  it("u nového prodejce vyžaduje název", () => {
    const vysledek = validujVykup(
      formulare({
        ...platnyVykup,
        prodejceId: NOVYY_PRODEJCE,
        nazevProdejce: " ",
        typProdejce: "bazar",
      }),
      DNES,
    );
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.prodejce).toBe("Zadejte název prodejce.");
  });

  it("u nového prodejce vyžaduje platný typ", () => {
    const vysledek = validujVykup(
      formulare({
        ...platnyVykup,
        prodejceId: NOVYY_PRODEJCE,
        nazevProdejce: "Nový bazar",
        typProdejce: "krtek",
      }),
      DNES,
    );
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.prodejce).toBe("Vyberte typ prodejce.");
  });

  it("prázdný formulář nahlásí chyby u jednotlivých polí", () => {
    const vysledek = validujVykup(formulare({}), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby).toMatchObject({
      componentId: expect.any(String),
      prodejce: expect.any(String),
      nakupniCena: expect.any(String),
      datumVykupu: expect.any(String),
    });
  });

  it.each([
    ["zápornou cenu", "-100"],
    ["nulovou cenu", "0"],
    ["text místo ceny", "levně"],
    ["nepřijatelně vysokou cenu", "99999999"],
  ])("odmítne %s", (_, cena) => {
    const vysledek = validujVykup(formulare({ ...platnyVykup, nakupniCena: cena }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.nakupniCena).toBeDefined();
    expect(vysledek.vykup).toBeUndefined();
  });

  it("odmítne datum výkupu v budoucnu", () => {
    const vysledek = validujVykup(formulare({ ...platnyVykup, datumVykupu: "2026-10-01" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.datumVykupu).toBe("Datum výkupu nesmí být v budoucnu.");
  });

  it("vyžaduje datum výkupu", () => {
    const vysledek = validujVykup(formulare({ ...platnyVykup, datumVykupu: "" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.datumVykupu).toBe("Zadejte datum výkupu.");
  });

  it("hledá vstup jako FormData, ne jako hotový objekt", () => {
    // Serverová akce dostává FormData; chyba musí být na poli, ne výjimka.
    const vysledek = validujVykup(formulare({ ...platnyVykup, nakupniCena: "abc" }), DNES);
    expect(vysledek.uspech).toBe(false);
  });
});
