import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import type { Component, Seller, StavKusu } from "@/lib/domain/types";

/**
 * Zápis zásahů, testů a hodnocení do skutečné SQLite. Tady se láme na
 * transakci (důkaz bez změny stavu by byl v rozporu s dokumentem 005), na
 * zakázaný návrat kusu z katalogu do Repasu a na to, že historie hodnocení
 * nesmí přepsat starý záznam.
 */

// `revalidatePath` mimo Next.js nemá co dělat; sledujeme, které cesty se po
// zápisu vyčistí, protože právě na nich se data mění.
const revalidovano: string[] = [];
vi.mock("next/cache", () => ({
  revalidatePath: (cesta: string) => {
    revalidovano.push(cesta);
  },
}));

let getKusZDetailem: typeof import("@/server/repo").getKusZDetailem;
let zapsatZasah: typeof import("@/server/repo").zapsatZasah;
let zapsatTest: typeof import("@/server/repo").zapsatTest;
let zapsatOhodnoceni: typeof import("@/server/repo").zapsatOhodnoceni;
let getZasahy: typeof import("@/server/repo").getZasahy;
let getTesty: typeof import("@/server/repo").getTesty;
let zalozitVykup: typeof import("@/server/repo").zalozitVykup;
let ChybaZapisu: typeof import("@/server/repo").ChybaZapisu;
// Akce mají stejné jméno jako repozitářové funkce, proto se v testu přejmenovávají.
let akceZapsatZasah: typeof import("@/server/actions/repas").zapsatZasah;
let akceZapsatTest: typeof import("@/server/actions/repas").zapsatTest;
let akceOhodnotitKus: typeof import("@/server/actions/repas").ohodnotitKus;
let databaze: typeof import("@/db/client").databaze;
let schema: typeof import("@/db/schema");
let odvodStupne: typeof import("@/lib/domain/repas").odvodStupne;

const adresar = mkdtempSync(join(tmpdir(), "flipcore-repas-"));

const komponenta: Component = {
  id: "cmp-repas-01",
  kategorie: "gpu",
  vyrobce: "NVIDIA",
  model: "GeForce RTX 3060",
  specifikace: { prikonW: 170, delkaMm: 242, vramGb: 12, napajeniPiny: 1 },
};

const prodejce: Seller = { id: "sel-repas-01", nazev: "Bazar Testovací", typ: "bazar" };

/** Kus ve výchozím stavu `vykoupeno`; test si z něj udělá co potřebuje. */
function novyKus(): string {
  return zalozitVykup({
    componentId: komponenta.id,
    prodejce: { rezim: "existujici", prodejceId: prodejce.id },
    nakupniCena: 250000,
    datumVykupu: "2026-09-20",
  }).id;
}

/** Tento stav se v testech nastavuje ručně — přes `zmenaStavu` by nešlo. */
function nastavStav(kusId: string, stav: StavKusu): void {
  databaze().update(schema.kusy).set({ stav }).where(eq(schema.kusy.id, kusId)).run();
}

function stavKusu(kusId: string): string | undefined {
  const radek = databaze().select().from(schema.kusy).where(eq(schema.kusy.id, kusId)).get();
  return radek?.stav;
}

function vlozZasah(kusId: string, id: string, provedenoKdy: string): void {
  databaze()
    .insert(schema.zasahy)
    .values({
      id,
      kusId,
      typZasahu: "vymena",
      popis: "Výměna ventilátoru",
      nahradniDil: true,
      naklady: 45000,
      provedenoKdy,
    })
    .run();
}

function vlozTest(
  kusId: string,
  id: string,
  typTestu: "profil" | "funkcni" | "vizualni",
  vysledek: "prosel" | "selhal" | "casti",
  nalezenaVada: boolean,
  provedenoKdy: string,
): void {
  databaze()
    .insert(schema.dukazyTestu)
    .values({
      id,
      kusId,
      nazevTestu: `Test ${id}`,
      typTestu,
      vysledek,
      nalezenaVada,
      provedenoKdy,
    })
    .run();
}

beforeAll(async () => {
  // Klient si cestu k databázi přečte při načtení modulu, proto ho importujeme
  // až poté, co je nastavena.
  process.env.DATABASE_URL = join(adresar, "test.db");

  const repo = await import("@/server/repo");
  const db = await import("@/db/client");
  const domena = await import("@/lib/domain/repas");
  const akce = await import("@/server/actions/repas");
  schema = await import("@/db/schema");

  getKusZDetailem = repo.getKusZDetailem;
  zapsatZasah = repo.zapsatZasah;
  zapsatTest = repo.zapsatTest;
  zapsatOhodnoceni = repo.zapsatOhodnoceni;
  getZasahy = repo.getZasahy;
  getTesty = repo.getTesty;
  zalozitVykup = repo.zalozitVykup;
  ChybaZapisu = repo.ChybaZapisu;
  akceZapsatZasah = akce.zapsatZasah;
  akceZapsatTest = akce.zapsatTest;
  akceOhodnotitKus = akce.ohodnotitKus;
  databaze = db.databaze;
  odvodStupne = domena.odvodStupne;

  // Klient při prvním připojení sám aplikuje migrace.
  databaze();
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
  databaze()
    .insert(schema.prodejci)
    .values({ id: prodejce.id, nazev: prodejce.nazev, typ: prodejce.typ })
    .run();
});

afterAll(() => {
  rmSync(adresar, { force: true, recursive: true });
});

describe("zapsatZasah", () => {
  it("kus ve stavu vykoupeno přejde do v_repasu a zásah se uloží", () => {
    const kusId = novyKus();

    zapsatZasah({
      kusId,
      typZasahu: "vymena",
      popis: "Výměna chladiče",
      nahradniDil: true,
      naklady: 120000,
      provedenoKdy: "2026-09-21",
    });

    expect(stavKusu(kusId)).toBe("v_repasu");

    const zapsane = getZasahy().filter((zasah) => zasah.kusId === kusId);
    expect(zapsane).toHaveLength(1);
    expect(zapsane[0].nahradniDil).toBe(true);
    expect(zapsane[0].typZasahu).toBe("vymena");
    expect(zapsane[0].naklady).toBe(120000);
    // ID generuje server, ne volající.
    expect(zapsane[0].id).toMatch(/^zas_/);
  });

  it("druhý zápis na kus už v Repase stav nezmění", () => {
    const kusId = novyKus();
    zapsatZasah({
      kusId,
      typZasahu: "cisteni",
      popis: "Vyčištění chladiče",
      nahradniDil: false,
      naklady: 0,
      provedenoKdy: "2026-09-21",
    });

    zapsatZasah({
      kusId,
      typZasahu: "oprava",
      popis: "Drobná oprava",
      nahradniDil: false,
      naklady: 1500,
      provedenoKdy: "2026-09-22",
    });

    expect(stavKusu(kusId)).toBe("v_repasu");
    expect(getZasahy().filter((zasah) => zasah.kusId === kusId)).toHaveLength(2);
  });

  it("na kus ve stavu vystaveno zápis odmítne a stav nezmění", () => {
    const kusId = novyKus();
    nastavStav(kusId, "vystaveno");

    expect(() =>
      zapsatZasah({
        kusId,
        typZasahu: "oprava",
        popis: "Zásah do vystaveného kusu",
        nahradniDil: false,
        naklady: 0,
        provedenoKdy: "2026-09-22",
      }),
    ).toThrow(ChybaZapisu);

    expect(stavKusu(kusId)).toBe("vystaveno");
    expect(getZasahy().filter((zasah) => zasah.kusId === kusId)).toHaveLength(0);
  });

  it("na neexistující kus skončí ChybaZapisu", () => {
    expect(() =>
      zapsatZasah({
        kusId: "kus-neexistuje",
        typZasahu: "oprava",
        popis: "Zásah bez kusu",
        nahradniDil: false,
        naklady: 0,
        provedenoKdy: "2026-09-22",
      }),
    ).toThrow(ChybaZapisu);
  });
});

describe("zapsatTest", () => {
  it("kus ve stavu vykoupeno přejde do v_repasu a test se uloží", () => {
    const kusId = novyKus();

    zapsatTest({
      kusId,
      nazevTestu: "Profil karty",
      typTestu: "profil",
      vysledek: "prosel",
      nalezenaVada: false,
      provedenoKdy: "2026-09-23",
    });

    expect(stavKusu(kusId)).toBe("v_repasu");

    const zapsane = getTesty().filter((test) => test.kusId === kusId);
    expect(zapsane).toHaveLength(1);
    expect(zapsane[0].typTestu).toBe("profil");
    expect(zapsane[0].nalezenaVada).toBe(false);
    expect(zapsane[0].id).toMatch(/^tst_/);
  });

  it("zapíše i příznak nalezene vady u vizuální kontroly", () => {
    const kusId = novyKus();

    zapsatTest({
      kusId,
      nazevTestu: "Vizuální kontrola",
      typTestu: "vizualni",
      vysledek: "casti",
      nalezenaVada: true,
      provedenoKdy: "2026-09-23",
    });

    const zapsane = getTesty().filter((test) => test.kusId === kusId);
    expect(zapsane[0].nalezenaVada).toBe(true);
  });

  it("na kus ve stavu vystaveno zápis odmítne a stav nezmění", () => {
    const kusId = novyKus();
    nastavStav(kusId, "vystaveno");

    expect(() =>
      zapsatTest({
        kusId,
        nazevTestu: "Profil karty",
        typTestu: "profil",
        vysledek: "prosel",
        nalezenaVada: false,
        provedenoKdy: "2026-09-23",
      }),
    ).toThrow(ChybaZapisu);

    expect(stavKusu(kusId)).toBe("vystaveno");
    expect(getTesty().filter((test) => test.kusId === kusId)).toHaveLength(0);
  });

  it("na neexistující kus skončí ChybaZapisu", () => {
    expect(() =>
      zapsatTest({
        kusId: "kus-neexistuje",
        nazevTestu: "Profil karty",
        typTestu: "profil",
        vysledek: "prosel",
        nalezenaVada: false,
        provedenoKdy: "2026-09-23",
      }),
    ).toThrow(ChybaZapisu);
  });
});

describe("zapsatOhodnoceni", () => {
  it("kus v Repase přejde do stavu ohodnoceno a popis nese důvod", () => {
    const kusId = novyKus();
    zapsatZasah({
      kusId,
      typZasahu: "vymena",
      popis: "Výměna chladiče",
      nahradniDil: true,
      naklady: 120000,
      provedenoKdy: "2026-09-21",
    });

    const duvod = "Na kusu je zapsán zásah, ale chybí čerstvý profilový test.";
    const hodnoceni = zapsatOhodnoceni({ kusId, stupen: "C", duvod });

    expect(stavKusu(kusId)).toBe("ohodnoceno");
    expect(hodnoceni.stupen).toBe("C");
    expect(hodnoceni.popis).toBe(duvod);
    expect(hodnoceni.kusId).toBe(kusId);
    expect(hodnoceni.id).toMatch(/^stn_/);
    expect(Date.parse(hodnoceni.zhodnocenoKdy)).not.toBeNaN();
  });

  it("druhé hodnocení starý záznam nepřepíše, jen přidá nový", () => {
    const kusId = novyKus();
    nastavStav(kusId, "v_repasu");

    // Čas musí být řízený: `zhodnocenoKdy` je ISO timestamp s přesností na
    // milisekundu a historie se řadí podle `zhodnocenoKdy DESC, id DESC`.
    // Dva zápisy za sebou by jinak dostaly shodné časlo a o pořadí by rozhodl
    // až náhodně generovaný identifikátor `stn_…` — test by kolísal. Fiktivní
    // hodiny rozdělí oba zápisy o celou sekundu, takže pořadí je dané datem.
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-09-25T08:00:00.000Z"));
      const prvni = zapsatOhodnoceni({ kusId, stupen: "C", duvod: "První důvod" });
      vi.setSystemTime(new Date("2026-09-25T08:00:01.000Z"));
      const druhe = zapsatOhodnoceni({ kusId, stupen: "A", duvod: "Druhý důvod" });

      expect(prvni.id).not.toBe(druhe.id);

      const historie = getKusZDetailem(kusId)!.historieHodnoceni;
      expect(historie).toHaveLength(2);
      // Sestupně podle data: novější nahoře.
      expect(historie.map((radek) => radek.id)).toEqual([druhe.id, prvni.id]);
      expect(historie[0].stupen).toBe("A");
      expect(historie[1].stupen).toBe("C");
      expect(getKusZDetailem(kusId)!.stupen?.id).toBe(druhe.id);
    } finally {
      vi.useRealTimers();
    }
  });

  it("kus už ohodnocený projde a získá další záznam", () => {
    const kusId = novyKus();
    nastavStav(kusId, "v_repasu");
    zapsatOhodnoceni({ kusId, stupen: "D", duvod: "Selhání testu" });

    const dalsi = zapsatOhodnoceni({ kusId, stupen: "B", duvod: "Opravený kus" });

    expect(dalsi.stupen).toBe("B");
    expect(stavKusu(kusId)).toBe("ohodnoceno");
    expect(getKusZDetailem(kusId)!.historieHodnoceni).toHaveLength(2);
  });

  it("na kus ve stavu vystaveno hodnocení odmítne", () => {
    const kusId = novyKus();
    nastavStav(kusId, "vystaveno");

    expect(() => zapsatOhodnoceni({ kusId, stupen: "A", duvod: "Nesmysl" })).toThrow(
      ChybaZapisu,
    );
    expect(stavKusu(kusId)).toBe("vystaveno");
    expect(getKusZDetailem(kusId)!.historieHodnoceni).toHaveLength(0);
  });

  it("na neexistující kus skončí ChybaZapisu", () => {
    expect(() => zapsatOhodnoceni({ kusId: "kus-neexistuje", stupen: "A", duvod: "X" })).toThrow(
      ChybaZapisu,
    );
  });
});

describe("getKusZDetailem", () => {
  it("načte kus, komponentu a prodejce", () => {
    const kusId = novyKus();

    const detail = getKusZDetailem(kusId)!;

    expect(detail.kus.id).toBe(kusId);
    expect(detail.component.id).toBe(komponenta.id);
    expect(detail.prodejce).toEqual(prodejce);
  });

  it("důkazy a historie hodnocení jsou sestupně, na vrcholu nejnovější", () => {
    const kusId = novyKus();
    vlozZasah(kusId, "zas-stary", "2026-09-21");
    vlozZasah(kusId, "zas-novy", "2026-09-25");
    vlozTest(kusId, "tst-stary", "profil", "prosel", false, "2026-09-22");
    vlozTest(kusId, "tst-novy", "vizualni", "prosel", false, "2026-09-26");
    databaze()
      .insert(schema.stavyHodnoceni)
      .values({
        id: "stn-stary",
        kusId,
        stupen: "D",
        popis: "Staré hodnocení",
        zhodnocenoKdy: "2026-09-23T10:00:00.000Z",
      })
      .run();
    databaze()
      .insert(schema.stavyHodnoceni)
      .values({
        id: "stn-novy",
        kusId,
        stupen: "A",
        popis: "Nové hodnocení",
        zhodnocenoKdy: "2026-09-27T10:00:00.000Z",
      })
      .run();

    const detail = getKusZDetailem(kusId)!;

    expect(detail.zasahy.map((zasah) => zasah.id)).toEqual(["zas-novy", "zas-stary"]);
    expect(detail.testy.map((test) => test.id)).toEqual(["tst-novy", "tst-stary"]);
    expect(detail.historieHodnoceni.map((radek) => radek.id)).toEqual(["stn-novy", "stn-stary"]);
    expect(detail.stupen?.id).toBe("stn-novy");
    expect(detail.stupen?.stupen).toBe("A");
  });

  it("při shodě data rozhoduje vyšší ID", () => {
    const kusId = novyKus();
    vlozZasah(kusId, "zas-a", "2026-09-25");
    vlozZasah(kusId, "zas-b", "2026-09-25");

    expect(getKusZDetailem(kusId)!.zasahy.map((zasah) => zasah.id)).toEqual(["zas-b", "zas-a"]);
  });

  it("u kusu bez důkazů odvození říká, co chybí", () => {
    const detail = getKusZDetailem(novyKus())!;

    expect(detail.zasahy).toHaveLength(0);
    expect(detail.testy).toHaveLength(0);
    expect(detail.historieHodnoceni).toHaveLength(0);
    expect(detail.stupen).toBeUndefined();
    expect(detail.odvozeni.stupen).toBeNull();
    expect(detail.odvozeni.duvod).toContain("žádné důkazy");
  });

  it("odvození odpovídá odvodStupne nad stejnými důkazy", () => {
    const kusId = novyKus();
    vlozZasah(kusId, "zas-1", "2026-09-21");
    vlozTest(kusId, "tst-1", "profil", "prosel", false, "2026-09-22");
    vlozTest(kusId, "tst-2", "vizualni", "prosel", false, "2026-09-23");

    const detail = getKusZDetailem(kusId)!;

    expect(detail.odvozeni).toEqual(odvodStupne({ zasahy: detail.zasahy, testy: detail.testy }));
    // Profil prošel a vizuálka vadu nenašla — stupeň A.
    expect(detail.odvozeni.stupen).toBe("A");
  });

  it("důkazy zapsané přes repozitář do odvození vstupují celé", () => {
    const kusId = novyKus();
    zapsatZasah({
      kusId,
      typZasahu: "vymena",
      popis: "Výměna ventilátoru",
      nahradniDil: true,
      naklady: 45000,
      provedenoKdy: "2026-09-21",
    });
    zapsatTest({
      kusId,
      nazevTestu: "Profil karty",
      typTestu: "profil",
      vysledek: "prosel",
      nalezenaVada: false,
      provedenoKdy: "2026-09-22",
    });
    zapsatTest({
      kusId,
      nazevTestu: "Vizuální kontrola",
      typTestu: "vizualni",
      vysledek: "prosel",
      nalezenaVada: false,
      provedenoKdy: "2026-09-23",
    });

    const detail = getKusZDetailem(kusId)!;

    expect(detail.zasahy[0].nahradniDil).toBe(true);
    expect(detail.testy.map((test) => test.typTestu).sort()).toEqual(["profil", "vizualni"]);
    expect(detail.odvozeni.stupen).toBe("A");
  });

  it("neexistující kus vrátí undefined", () => {
    expect(getKusZDetailem("kus-neexistuje")).toBeUndefined();
  });
});

describe("serverové akce repasi", () => {
  /**
   * Serverové akce jsou veřejné a dostávají klientem poslaná data. Testy tady
   * hlídají dvě věci: že se za chybu nevyhazuje výjimka (stránka by spadla)
   * a že se stránky vyčistí jen tehdy, když se data skutečně změnila.
   */

  function formulare(hodnoty: Record<string, string>): FormData {
    const data = new FormData();
    for (const [klic, hodnota] of Object.entries(hodnoty)) {
      data.append(klic, hodnota);
    }
    return data;
  }

  const platnyZasah = {
    typZasahu: "vymena",
    popis: "Výměna chladiče",
    nahradniDil: "1",
    naklady: "450",
    provedenoKdy: "2026-09-20",
  };

  const platnyTest = {
    nazevTestu: "Profil karty",
    typTestu: "profil",
    vysledek: "prosel",
    provedenoKdy: "2026-09-20",
  };

  describe("zapsatZasah", () => {
    it("vrátí ID kusu a vyčistí sklad, detail kusu i nástěnku", async () => {
      revalidovano.length = 0;
      const kusId = novyKus();

      const stav = await akceZapsatZasah(kusId, {}, formulare(platnyZasah));

      expect(stav.uspech).toEqual({ kusId });
      expect(stav.chyby).toBeUndefined();
      expect(stav.obecna).toBeUndefined();
      expect(revalidovano).toEqual(["/sklad", `/sklad/${kusId}`, "/nastenka"]);
      expect(getZasahy().filter((zasah) => zasah.kusId === kusId)).toHaveLength(1);
      // Náklady se ukládají v haléřích, i když se zadávají v korunách.
      expect(getZasahy().find((zasah) => zasah.kusId === kusId)!.naklady).toBe(45000);
    });

    it("chyba formuláře vrátí hlášky u polí a nic nevyčistí", async () => {
      revalidovano.length = 0;
      const kusId = novyKus();

      const stav = await akceZapsatZasah(
        kusId,
        {},
        formulare({ ...platnyZasah, popis: "a", naklady: "hodně" }),
      );

      expect(stav.uspech).toBeUndefined();
      expect(stav.chyby?.popis).toBeDefined();
      expect(stav.chyby?.naklady).toBeDefined();
      // Neúspěch nesmí přegenerovat žádnou stránku.
      expect(revalidovano).toEqual([]);
      expect(getZasahy().filter((zasah) => zasah.kusId === kusId)).toHaveLength(0);
    });

    it("u výměny bez nahradeni dilu odmítne zápis", async () => {
      revalidovano.length = 0;
      const kusId = novyKus();

      const stav = await akceZapsatZasah(
        kusId,
        {},
        formulare({ ...platnyZasah, nahradniDil: "0" }),
      );

      expect(stav.uspech).toBeUndefined();
      expect(stav.chyby?.nahradniDil).toBeDefined();
      expect(revalidovano).toEqual([]);
    });

    it("neexistující kus skončí hláškou, ne výjimkou", async () => {
      revalidovano.length = 0;

      const stav = await akceZapsatZasah("kus-neexistuje", {}, formulare(platnyZasah));

      expect(stav.uspech).toBeUndefined();
      expect(stav.obecna).toBe("Kus neexistuje.");
      expect(revalidovano).toEqual([]);
    });
  });

  describe("zapsatTest", () => {
    it("vrátí ID kusu a vyčistí sklad, detail kusu i nástěnku", async () => {
      revalidovano.length = 0;
      const kusId = novyKus();

      const stav = await akceZapsatTest(kusId, {}, formulare(platnyTest));

      expect(stav.uspech).toEqual({ kusId });
      expect(stav.chyby).toBeUndefined();
      expect(revalidovano).toEqual(["/sklad", `/sklad/${kusId}`, "/nastenka"]);
      expect(getTesty().filter((test) => test.kusId === kusId)).toHaveLength(1);
    });

    it("chyba formuláře vrátí hlášky u polí a nic nevyčistí", async () => {
      revalidovano.length = 0;
      const kusId = novyKus();

      const stav = await akceZapsatTest(
        kusId,
        {},
        formulare({ ...platnyTest, typTestu: "neproznamy", provedenoKdy: "" }),
      );

      expect(stav.uspech).toBeUndefined();
      expect(stav.chyby?.typTestu).toBeDefined();
      expect(stav.chyby?.provedenoKdy).toBeDefined();
      expect(revalidovano).toEqual([]);
      expect(getTesty().filter((test) => test.kusId === kusId)).toHaveLength(0);
    });

    it("příznak vady u jiného než vizuálního testu odmítne", async () => {
      revalidovano.length = 0;
      const kusId = novyKus();

      const stav = await akceZapsatTest(
        kusId,
        {},
        formulare({ ...platnyTest, nalezenaVada: "1" }),
      );

      expect(stav.uspech).toBeUndefined();
      expect(stav.chyby?.nalezenaVada).toBeDefined();
      expect(revalidovano).toEqual([]);
    });

    it("neexistující kus skončí hláškou, ne výjimkou", async () => {
      revalidovano.length = 0;

      const stav = await akceZapsatTest("kus-neexistuje", {}, formulare(platnyTest));

      expect(stav.uspech).toBeUndefined();
      expect(stav.obecna).toBe("Kus neexistuje.");
      expect(revalidovano).toEqual([]);
    });
  });

  describe("ohodnotitKus", () => {
    /** Kus s důkazy, ze kterých stupeň A vyplývá: profil prošel, vizuálka čistá. */
    function kusSeStupnemA(): string {
      const kusId = novyKus();
      nastavStav(kusId, "v_repasu");
      vlozZasah(kusId, `zas-a-${kusId}`, "2026-09-20");
      vlozTest(kusId, `tst-prof-${kusId}`, "profil", "prosel", false, "2026-09-21");
      vlozTest(kusId, `tst-viz-${kusId}`, "vizualni", "prosel", false, "2026-09-22");
      return kusId;
    }

    it("z důkazů odvodí stupeň, zapíše ho a přesune kus do ohodnoceno", async () => {
      revalidovano.length = 0;
      const kusId = kusSeStupnemA();

      const stav = await akceOhodnotitKus(kusId, {}, new FormData());

      expect(stav.uspech?.stupen).toBe("A");
      expect(stav.obecna).toBeUndefined();
      expect(stavKusu(kusId)).toBe("ohodnoceno");
      expect(getKusZDetailem(kusId)!.stupen?.stupen).toBe("A");
      expect(revalidovano).toEqual(["/sklad", `/sklad/${kusId}`, "/nastenka"]);
    });

    it("stupen poslaný ve FormData ignoruje a zapíše odvozený", async () => {
      revalidovano.length = 0;
      const kusId = novyKus();
      nastavStav(kusId, "v_repasu");
      vlozZasah(kusId, `zas-b-${kusId}`, "2026-09-20");

      const stav = await akceOhodnotitKus(kusId, {}, formulare({ stupen: "A" }));

      // Zásah bez profilového testu dává stupeň C, ne A z formuláře.
      expect(stav.uspech?.stupen).toBe("C");
      expect(getKusZDetailem(kusId)!.stupen?.stupen).toBe("C");
    });

    it("na kus bez důkazů nic nezapíše a vysvětlí, co chybí", async () => {
      revalidovano.length = 0;
      const kusId = novyKus();
      nastavStav(kusId, "v_repasu");

      const stav = await akceOhodnotitKus(kusId, {}, new FormData());

      expect(stav.uspech).toBeUndefined();
      expect(stav.obecna).toContain("žádné důkazy");
      // Hláška musí být doslova důvod z `odvodStupne`, ne vlastní formulace.
      expect(stav.obecna).toBe(odvodStupne({ zasahy: [], testy: [] }).duvod);
      expect(stavKusu(kusId)).toBe("v_repasu");
      expect(getKusZDetailem(kusId)!.historieHodnoceni).toHaveLength(0);
      expect(revalidovano).toEqual([]);
    });

    it("u profilu bez vizuální kontroly vysvětlí, že stupeň ještě nelze odvodit", async () => {
      revalidovano.length = 0;
      const kusId = novyKus();
      nastavStav(kusId, "v_repasu");
      vlozTest(kusId, `tst-prof-${kusId}`, "profil", "prosel", false, "2026-09-21");

      const stav = await akceOhodnotitKus(kusId, {}, new FormData());

      expect(stav.uspech).toBeUndefined();
      expect(stav.obecna).toContain("vizuální kontrola");
      expect(stavKusu(kusId)).toBe("v_repasu");
      expect(getKusZDetailem(kusId)!.historieHodnoceni).toHaveLength(0);
      expect(revalidovano).toEqual([]);
    });

    it("kus vykoupený bez zásahu vyzve nejdřív k zápisu důkazu", async () => {
      revalidovano.length = 0;
      const kusId = novyKus();
      vlozTest(kusId, `tst-prof-${kusId}`, "profil", "prosel", false, "2026-09-21");

      const stav = await akceOhodnotitKus(kusId, {}, new FormData());

      expect(stav.uspech).toBeUndefined();
      expect(stav.obecna).toContain("zapiš zásah nebo test");
      expect(stavKusu(kusId)).toBe("vykoupeno");
      expect(getKusZDetailem(kusId)!.historieHodnoceni).toHaveLength(0);
      expect(revalidovano).toEqual([]);
    });

    it("kus vystavený odmítne a stav nezmění", async () => {
      revalidovano.length = 0;
      const kusId = kusSeStupnemA();
      nastavStav(kusId, "vystaveno");

      const stav = await akceOhodnotitKus(kusId, {}, new FormData());

      expect(stav.uspech).toBeUndefined();
      expect(stav.obecna).toBe("Kus už je vystavený, zpět do Repasu se nevrací.");
      expect(stavKusu(kusId)).toBe("vystaveno");
      expect(getKusZDetailem(kusId)!.historieHodnoceni).toHaveLength(0);
      expect(revalidovano).toEqual([]);
    });

    it("rezervovaný kus odmítne a stav nezmění", async () => {
      revalidovano.length = 0;
      const kusId = kusSeStupnemA();
      nastavStav(kusId, "rezervovano");

      const stav = await akceOhodnotitKus(kusId, {}, new FormData());

      expect(stav.uspech).toBeUndefined();
      expect(stav.obecna).toContain("Rezervováno");
      expect(stavKusu(kusId)).toBe("rezervovano");
      expect(getKusZDetailem(kusId)!.historieHodnoceni).toHaveLength(0);
      expect(revalidovano).toEqual([]);
    });

    it("prodaný kus odmítne a stav nezmění", async () => {
      revalidovano.length = 0;
      const kusId = kusSeStupnemA();
      nastavStav(kusId, "prodano");

      const stav = await akceOhodnotitKus(kusId, {}, new FormData());

      expect(stav.uspech).toBeUndefined();
      expect(stav.obecna).toContain("Prodáno");
      expect(stavKusu(kusId)).toBe("prodano");
      expect(revalidovano).toEqual([]);
    });

    it("neexistující kus skončí hláškou, ne výjimkou", async () => {
      revalidovano.length = 0;

      const stav = await akceOhodnotitKus("kus-neexistuje", {}, new FormData());

      expect(stav.uspech).toBeUndefined();
      expect(stav.obecna).toBe("Kus neexistuje.");
      expect(revalidovano).toEqual([]);
    });
  });
});
