import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import type { Component, Seller } from "@/lib/domain/types";

/**
 * Zápis kusu do skutečné SQLite. Na rozdíl od testů v `src/lib/domain` jde o
 * pomalou integrační vrstvu, ale právě tady se láme na cizích klíčích, na
 * transakci a na stavu, který kus po výkupu dostane.
 */

// `revalidatePath` mimo Next.js nemá co dělat; sledujeme, které cesty se po
// zápisu vyčistí, protože na nich se data mění.
const revalidovano: string[] = [];
vi.mock("next/cache", () => ({
  revalidatePath: (cesta: string) => {
    revalidovano.push(cesta);
  },
}));

let zalozitVykup: typeof import("@/server/repo").zalozitVykup;
let getKusy: typeof import("@/server/repo").getKusy;
let getProdejci: typeof import("@/server/repo").getProdejci;
let ChybaZapisu: typeof import("@/server/repo").ChybaZapisu;
let zapsatVykup: typeof import("@/server/actions/vykup").zapsatVykup;
let databaze: typeof import("@/db/client").databaze;
let schema: typeof import("@/db/schema");

const adresar = mkdtempSync(join(tmpdir(), "flipcore-test-"));

/** Katalogová komponenta, na kterou se výkupy odkazují. */
const komponenta: Component = {
  id: "cmp-test-01",
  kategorie: "cpu",
  vyrobce: "Intel",
  model: "Core i5-12400F",
  specifikace: { socket: "LGA1700", tdp: 65, jader: 6, generace: "12. generace" },
};

function zalozProdejce(id: string, nazev: string, typ: Seller["typ"] = "bazar"): void {
  databaze()
    .insert(schema.prodejci)
    .values({ id, nazev, typ })
    .run();
}

function zalozKomponentu(): void {
  databaze()
    .insert(schema.komponenty)
    .values({
      id: komponenta.id,
      kategorie: komponenta.kategorie,
      vyrobce: komponenta.vyrobce,
      model: komponenta.model,
      specifikace: komponenta.specifikace,
    })
    .run();
}

beforeAll(async () => {
  // Klient si cestu k databázi přečte při načtení modulu, proto ho importujeme
  // až poté, co je nastavena.
  process.env.DATABASE_URL = join(adresar, "test.db");

  const repo = await import("@/server/repo");
  const db = await import("@/db/client");
  const akce = await import("@/server/actions/vykup");
  schema = await import("@/db/schema");

  zalozitVykup = repo.zalozitVykup;
  getKusy = repo.getKusy;
  getProdejci = repo.getProdejci;
  ChybaZapisu = repo.ChybaZapisu;
  zapsatVykup = akce.zapsatVykup;
  databaze = db.databaze;

  // Klient při prvním připojení sám aplikuje migrace.
  databaze();
  zalozKomponentu();
  zalozProdejce("sel-test-01", "Bazar Testovací");
});

afterAll(() => {
  rmSync(adresar, { force: true, recursive: true });
});

describe("zalozitVykup", () => {
  it("uloží kus ve stavu vykoupeno, bez prodejní ceny a hodnocení", () => {
    const kus = zalozitVykup({
      componentId: komponenta.id,
      prodejce: { rezim: "existujici", prodejceId: "sel-test-01" },
      nakupniCena: 160050,
      datumVykupu: "2026-09-28",
    });

    expect(kus.stav).toBe("vykoupeno");
    expect(kus.nakupniCena).toBe(160050);
    expect(kus.prodejniCena).toBeNull();
    expect(kus.prodejceId).toBe("sel-test-01");
    expect(kus.datumVykupu).toBe("2026-09-28");
  });

  it("nový kus se neobjeví mezi vystavenými, ale ve skladu ano", () => {
    const kusy = getKusy();
    const novy = kusy.find((zaznam) => zaznam.kus.datumVykupu === "2026-09-28");

    expect(novy).toBeDefined();
    expect(novy!.stav).toBeUndefined();
  });

  it("založí nového prodejce a použije ho pro kus", () => {
    const kus = zalozitVykup({
      componentId: komponenta.id,
      prodejce: { rezim: "novy", nazev: "IT Recyklace s.r.o.", typ: "firma" },
      nakupniCena: 90000,
      datumVykupu: "2026-09-27",
    });

    const prodejce = getProdejci().find((kandidat) => kandidat.id === kus.prodejceId);
    expect(prodejce).toEqual({ id: kus.prodejceId, nazev: "IT Recyklace s.r.o.", typ: "firma" });
  });

  it("neexistující prodejce odmítne a nepočítá si ho", () => {
    const pocetPred = getProdejci().length;

    expect(() =>
      zalozitVykup({
        componentId: komponenta.id,
        prodejce: { rezim: "existujici", prodejceId: "sel-neexistuje" },
        nakupniCena: 1000,
        datumVykupu: "2026-09-26",
      }),
    ).toThrow(ChybaZapisu);

    expect(getProdejci()).toHaveLength(pocetPred);
  });

  it("neexistující komponentu odmítne a nepočítá si kus", () => {
    const kusyPred = getKusy().length;

    expect(() =>
      zalozitVykup({
        componentId: "cmp-neexistuje",
        prodejce: { rezim: "existujici", prodejceId: "sel-test-01" },
        nakupniCena: 1000,
        datumVykupu: "2026-09-26",
      }),
    ).toThrow(ChybaZapisu);

    expect(getKusy()).toHaveLength(kusyPred);
  });

  it("dvě výkupy za sebou mají různé ID", () => {
    const prvni = zalozitVykup({
      componentId: komponenta.id,
      prodejce: { rezim: "existujici", prodejceId: "sel-test-01" },
      nakupniCena: 1000,
      datumVykupu: "2026-09-25",
    });
    const druhy = zalozitVykup({
      componentId: komponenta.id,
      prodejce: { rezim: "existujici", prodejceId: "sel-test-01" },
      nakupniCena: 1000,
      datumVykupu: "2026-09-25",
    });

    expect(prvni.id).not.toBe(druhy.id);
  });
});

describe("zapsatVykup (serverová akce)", () => {
  function formulare(hodnoty: Record<string, string>): FormData {
    const data = new FormData();
    for (const [klic, hodnota] of Object.entries(hodnoty)) {
      data.append(klic, hodnota);
    }
    return data;
  }

  const platny = {
    componentId: "cmp-test-01",
    prodejceId: "sel-test-01",
    nakupniCena: "1600",
    datumVykupu: "2026-09-28",
  };

  it("vrátí ID kusu a vyčistí sklad i nástěnku", async () => {
    revalidovano.length = 0;

    const stav = await zapsatVykup({}, formulare(platny));

    expect(stav.uspech?.kusId).toBeDefined();
    expect(stav.chyby).toBeUndefined();
    expect(revalidovano).toEqual(["/sklad", "/nastenka"]);
  });

  it("chybou vrací hlášku u pole a nevyvolá výjimku", async () => {
    revalidovano.length = 0;

    const stav = await zapsatVykup({}, formulare({ ...platny, nakupniCena: "špatně" }));

    expect(stav.uspech).toBeUndefined();
    expect(stav.chyby?.nakupniCena).toBeDefined();
    // Neúspěch nesmí přegenerovat žádnou stránku.
    expect(revalidovano).toEqual([]);
  });

  it("nedatabázovou chybu provozovateli neprozradí", async () => {
    revalidovano.length = 0;

    // Formulář je v pořádku, ale odkazuje na neexistujícího prodejce.
    const stav = await zapsatVykup(
      {},
      formulare({ ...platny, prodejceId: "sel-neexistuje" }),
    );

    expect(stav.uspech).toBeUndefined();
    expect(stav.obecna).toBe("Vybraný prodejce neexistuje.");
    expect(revalidovano).toEqual([]);
  });
});
