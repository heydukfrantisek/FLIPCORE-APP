import { describe, expect, it } from "vitest";

import {
  POVOLENE_PRECHODY,
  muzzePrejitStav,
  odvodStupne,
  validujTest,
  validujZasah,
  zmenaStavu,
  type DokladyKusu,
} from "./repas";
import type { RepairTicket, TestEvidence } from "./types";

/** Sestaví `FormData` jako by přišel z prohlížeče; hodnota `on` znamená zaškrtnutý checkbox. */
function formulare(hodnoty: Record<string, string>): FormData {
  const data = new FormData();
  for (const [klic, hodnota] of Object.entries(hodnoty)) {
    data.append(klic, hodnota);
  }
  return data;
}

const DNES = new Date("2026-09-29T10:00:00Z");

function zasah(nadrazene: Partial<RepairTicket> = {}): RepairTicket {
  return {
    id: "zas-01",
    kusId: "kus-01",
    typZasahu: "cisteni",
    popis: "Vyčištění chladiče.",
    nahradniDil: false,
    naklady: 0,
    provedenoKdy: "2026-09-20",
    ...nadrazene,
  };
}

function test(nadrazene: Partial<TestEvidence> = {}): TestEvidence {
  return {
    id: "tst-01",
    kusId: "kus-01",
    nazevTestu: "Test základního profilu",
    typTestu: "profil",
    vysledek: "prosel",
    nalezenaVada: false,
    provedenoKdy: "2026-09-21",
    ...nadrazene,
  };
}

function doklady(zasahy: RepairTicket[], testy: TestEvidence[]): DokladyKusu {
  return { zasahy: zasahy, testy };
}

describe("POVOLENE_PRECHODY", () => {
  it("v I3 obsahuje jen vykoupeno → v_repasu a v_repasu → ohodnoceno", () => {
    expect(POVOLENE_PRECHODY).toEqual([
      ["vykoupeno", "v_repasu"],
      ["v_repasu", "ohodnoceno"],
    ]);
  });

  it("neobsahuje ohodnoceno → vystaveno, ten přijde až v I4", () => {
    expect(muzzePrejitStav("ohodnoceno", "vystaveno")).toBe(false);
  });
});

describe("muzzePrejitStav", () => {
  it.each([
    ["vykoupeno", "v_repasu"],
    ["v_repasu", "ohodnoceno"],
  ] as const)("povolí %s → %s", (od, na) => {
    expect(muzzePrejitStav(od, na)).toBe(true);
  });

  it.each([
    ["vystaveno", "v_repasu"],
    ["rezervovano", "v_repasu"],
    ["prodano", "v_repasu"],
    ["ohodnoceno", "vystaveno"],
    ["v_repasu", "vykoupeno"],
    ["vykoupeno", "prodano"],
  ] as const)("zakáže %s → %s", (od, na) => {
    expect(muzzePrejitStav(od, na)).toBe(false);
  });
});

describe("zmenaStavu", () => {
  it("vrátí cílový stav u povoleného přechodu", () => {
    expect(zmenaStavu("vykoupeno", "v_repasu")).toBe("v_repasu");
    expect(zmenaStavu("v_repasu", "ohodnoceno")).toBe("ohodnoceno");
  });

  it("stejný stav vrátí beze změny", () => {
    expect(zmenaStavu("vystaveno", "vystaveno")).toBe("vystaveno");
  });

  it.each([
    ["vystaveno", "v_repasu"],
    ["rezervovano", "v_repasu"],
    ["prodano", "v_repasu"],
    ["ohodnoceno", "vystaveno"],
  ] as const)("vyhodí chybu na zakázaném přechodu %s → %s", (od, na) => {
    expect(() => zmenaStavu(od, na)).toThrow(/není povolený/);
  });

  it("chybová hláška jmenuje oba stavy česky", () => {
    expect(() => zmenaStavu("vystaveno", "v_repasu")).toThrow(
      "Přechod z Vystaveno do V repasu není povolený.",
    );
  });
});

describe("odvodStupne", () => {
  it("u kusu bez důkazů nevymyslí stupeň a řekne, co chybí", () => {
    const vysledek = odvodStupne(doklady([], []));
    expect(vysledek.stupen).toBeNull();
    expect(vysledek.duvod).toContain("žádné důkazy");
  });

  it("jediné selhání jakéhokoli typu dává D", () => {
    const vysledek = odvodStupne(
      doklady([], [test({ id: "tst-f", typTestu: "funkcni", vysledek: "selhal" })]),
    );
    expect(vysledek.stupen).toBe("D");
    expect(vysledek.duvod).toContain("selhání");
  });

  it("selhání vyhrává i nad profilovým testem, který prošel", () => {
    const vysledek = odvodStupne(
      doklady([], [
        test(),
        test({ id: "tst-f", typTestu: "funkcni", vysledek: "selhal" }),
        test({ id: "tst-v", typTestu: "vizualni" }),
      ]),
    );
    expect(vysledek.stupen).toBe("D");
  });

  it("profil prošel a vizuálka bez vady dává A", () => {
    const vysledek = odvodStupne(
      doklady([], [test(), test({ id: "tst-v", typTestu: "vizualni", nalezenaVada: false })]),
    );
    expect(vysledek.stupen).toBe("A");
    expect(vysledek.duvod).toContain("vizuální kontrola");
  });

  it("profil prošel a vizuálka s vadou dává B", () => {
    const vysledek = odvodStupne(
      doklady([], [test(), test({ id: "tst-v", typTestu: "vizualni", nalezenaVada: true })]),
    );
    expect(vysledek.stupen).toBe("B");
    expect(vysledek.duvod).toContain("vizuální kontrole");
  });

  it("dvě vizuální kontroly, jedna s vadou, dávají B", () => {
    const vysledek = odvodStupne(
      doklady([], [
        test(),
        test({ id: "tst-v1", typTestu: "vizualni", nalezenaVada: false }),
        test({ id: "tst-v2", typTestu: "vizualni", nalezenaVada: true }),
      ]),
    );
    expect(vysledek.stupen).toBe("B");
  });

  it("zásah s funkčním testem, který prošel, a bez profilu dává C", () => {
    const vysledek = odvodStupne(
      doklady([zasah()], [test({ typTestu: "funkcni", vysledek: "prosel" })]),
    );
    expect(vysledek.stupen).toBe("C");
    expect(vysledek.duvod).toContain("zásah");
  });

  it("zásah a částečně prošlý test dávají C", () => {
    const vysledek = odvodStupne(
      doklady([zasah()], [test({ typTestu: "funkcni", vysledek: "casti" })]),
    );
    expect(vysledek.stupen).toBe("C");
  });

  it("zásah a profilový test, který neprošel, dávají C", () => {
    const vysledek = odvodStupne(
      doklady([zasah()], [test({ vysledek: "casti" })]),
    );
    expect(vysledek.stupen).toBe("C");
  });

  it("částečný profilový test neudělí ani A, ani B", () => {
    const vysledek = odvodStupne(
      doklady(
        [],
        [
          test({ vysledek: "casti" }),
          test({ id: "tst-v", typTestu: "vizualni", nalezenaVada: false }),
        ],
      ),
    );
    expect(vysledek.stupen).toBeNull();
    expect(vysledek.duvod).toContain("profilový test");
  });

  it("profil prošel, ale vizuální kontrola chybí, stupeň nevznikne", () => {
    const vysledek = odvodStupne(doklady([], [test()]));
    expect(vysledek.stupen).toBeNull();
    expect(vysledek.duvod).toContain("vizuální kontrola");
  });

  it("starý profilový test před zásahem se nehodnotí", () => {
    const vysledek = odvodStupne(
      doklady(
        [zasah({ provedenoKdy: "2026-09-25" })],
        [
          test({ provedenoKdy: "2026-09-20" }),
          test({ id: "tst-v", typTestu: "vizualni", provedenoKdy: "2026-09-20" }),
        ],
      ),
    );
    expect(vysledek.stupen).toBe("C");
  });

  it("test se stejným datem jako zásah je čerstvý", () => {
    const vysledek = odvodStupne(
      doklady(
        [zasah({ provedenoKdy: "2026-09-25" })],
        [
          test({ provedenoKdy: "2026-09-25" }),
          test({ id: "tst-v", typTestu: "vizualni", provedenoKdy: "2026-09-25" }),
        ],
      ),
    );
    expect(vysledek.stupen).toBe("A");
  });

  it("kus bez zásahu má všechny testy čerstvé", () => {
    const vysledek = odvodStupne(
      doklady([], [test({ provedenoKdy: "2019-01-01" }), test({ id: "tst-v", typTestu: "vizualni", provedenoKdy: "2019-01-01" })]),
    );
    expect(vysledek.stupen).toBe("A");
  });

  it("čerstvost se počítá od posledního zásahu, ne od posledního testu", () => {
    const vysledek = odvodStupne(
      doklady(
        [zasah({ id: "zas-01", provedenoKdy: "2026-09-10" }), zasah({ id: "zas-02", provedenoKdy: "2026-09-25" })],
        [test({ provedenoKdy: "2026-09-20" })],
      ),
    );
    expect(vysledek.stupen).toBe("C");
  });
});

const platnyZasah = {
  typZasahu: "cisteni",
  popis: "Vyčištění chladiče a výměna pasti.",
  naklady: "0",
  provedenoKdy: "2026-09-28",
};

describe("validujZasah", () => {
  it("přijme platný zásah a převede nulové náklady", () => {
    const vysledek = validujZasah(formulare(platnyZasah), DNES);
    expect(vysledek.uspech).toBe(true);
    expect(vysledek.zasah).toEqual({
      typZasahu: "cisteni",
      popis: "Vyčištění chladiče a výměna pasti.",
      nahradniDil: false,
      naklady: 0,
      provedenoKdy: "2026-09-28",
    });
  });

  it("u výměny vyžaduje zaškrtnuté nahradniDil", () => {
    const vysledek = validujZasah(formulare({ ...platnyZasah, typZasahu: "vymena" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.nahradniDil).toBeDefined();
    expect(vysledek.zasah).toBeUndefined();
  });

  it("u výměny s nahradniDil projde", () => {
    const vysledek = validujZasah(
      formulare({ ...platnyZasah, typZasahu: "vymena", nahradniDil: "on" }),
      DNES,
    );
    expect(vysledek.uspech).toBe(true);
    expect(vysledek.zasah?.nahradniDil).toBe(true);
  });

  it("nahradniDil u čištění je v pořádku", () => {
    const vysledek = validujZasah(formulare({ ...platnyZasah, nahradniDil: "on" }), DNES);
    expect(vysledek.uspech).toBe(true);
    expect(vysledek.zasah?.nahradniDil).toBe(true);
  });

  it("vyžaduje popis", () => {
    const vysledek = validujZasah(formulare({ ...platnyZasah, popis: "   " }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.popis).toBeDefined();
  });

  it("vyžaduje typ zásahu", () => {
    const vysledek = validujZasah(formulare({ ...platnyZasah, typZasahu: "spalovani" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.typZasahu).toBe("Vyberte typ zásahu.");
  });

  it.each([
    ["text místo data", "28. 9. 2026"],
    ["neexistující den", "2026-02-30"],
  ])("odmítne %s", (_, datum) => {
    const vysledek = validujZasah(formulare({ ...platnyZasah, provedenoKdy: datum }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.provedenoKdy).toBeDefined();
    expect(vysledek.zasah).toBeUndefined();
  });

  it("odmítne datum v budoucnu", () => {
    const vysledek = validujZasah(formulare({ ...platnyZasah, provedenoKdy: "2026-10-01" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.provedenoKdy).toBe("Datum zásahu nesmí být v budoucnu.");
  });

  it("převede české náklady na haléře", () => {
    const vysledek = validujZasah(formulare({ ...platnyZasah, naklady: "1 250,50" }), DNES);
    expect(vysledek.uspech).toBe(true);
    expect(vysledek.zasah?.naklady).toBe(125050);
  });

  it.each([
    ["prázdné náklady", ""],
    ["záporné náklady", "-100"],
    ["text místo nákladů", "levně"],
    ["nepřijatelně vysoké náklady", "100 001"],
  ])("odmítne %s", (_, naklady) => {
    const vysledek = validujZasah(formulare({ ...platnyZasah, naklady }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.naklady).toBeDefined();
    expect(vysledek.zasah).toBeUndefined();
  });

  it("prázdný formulář nahlásí chyby u jednotlivých polí", () => {
    const vysledek = validujZasah(formulare({}), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby).toMatchObject({
      typZasahu: expect.any(String),
      popis: expect.any(String),
      naklady: expect.any(String),
      provedenoKdy: expect.any(String),
    });
  });
});

const platnyTest = {
  nazevTestu: "Test základního profilu",
  typTestu: "profil",
  vysledek: "prosel",
  provedenoKdy: "2026-09-28",
};

describe("validujTest", () => {
  it("přijme platný test", () => {
    const vysledek = validujTest(formulare(platnyTest), DNES);
    expect(vysledek.uspech).toBe(true);
    expect(vysledek.test).toEqual({
      nazevTestu: "Test základního profilu",
      typTestu: "profil",
      vysledek: "prosel",
      nalezenaVada: false,
      provedenoKdy: "2026-09-28",
    });
  });

  it.each(["funkcni", "profil"])("odmítne nalezenaVada u typu %s", (typTestu) => {
    const vysledek = validujTest(formulare({ ...platnyTest, typTestu, nalezenaVada: "on" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.nalezenaVada).toBeDefined();
    expect(vysledek.test).toBeUndefined();
  });

  it("u vizuální kontroly nalezenaVada projde", () => {
    const vysledek = validujTest(
      formulare({ ...platnyTest, typTestu: "vizualni", nalezenaVada: "on" }),
      DNES,
    );
    expect(vysledek.uspech).toBe(true);
    expect(vysledek.test?.nalezenaVada).toBe(true);
  });

  it("u vizuální kontroly bez vady projde", () => {
    const vysledek = validujTest(formulare({ ...platnyTest, typTestu: "vizualni" }), DNES);
    expect(vysledek.uspech).toBe(true);
    expect(vysledek.test?.nalezenaVada).toBe(false);
  });

  it("vyžaduje název testu", () => {
    const vysledek = validujTest(formulare({ ...platnyTest, nazevTestu: "" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.nazevTestu).toBeDefined();
  });

  it("vyžaduje známý typ testu", () => {
    const vysledek = validujTest(formulare({ ...platnyTest, typTestu: "akustika" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.typTestu).toBe("Vyberte typ testu.");
  });

  it("vyžaduje známý výsledek testu", () => {
    const vysledek = validujTest(formulare({ ...platnyTest, vysledek: "tak-tak" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.vysledek).toBe("Vyberte výsledek testu.");
  });

  it("vyžaduje datum", () => {
    const vysledek = validujTest(formulare({ ...platnyTest, provedenoKdy: "" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.provedenoKdy).toBeDefined();
  });

  it("odmítne datum v budoucnu", () => {
    const vysledek = validujTest(formulare({ ...platnyTest, provedenoKdy: "2026-10-01" }), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby?.provedenoKdy).toBe("Datum testu nesmí být v budoucnu.");
  });

  it("prázdný formulář nahlásí chyby u jednotlivých polí", () => {
    const vysledek = validujTest(formulare({}), DNES);
    expect(vysledek.uspech).toBe(false);
    expect(vysledek.chyby).toMatchObject({
      nazevTestu: expect.any(String),
      typTestu: expect.any(String),
      vysledek: expect.any(String),
      provedenoKdy: expect.any(String),
    });
  });
});
