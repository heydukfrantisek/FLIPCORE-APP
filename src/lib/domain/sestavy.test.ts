import { describe, expect, it } from "vitest";

import {
  JEDNOUCNE_POZICE,
  POVINNE_POZICE,
  REZERVA_VYCONU_W,
  porovnatSRozpoctem,
  spocitatCelkovouCenu,
  spocitatDoporucenyZdroj,
  spocitatSpotrebu,
  zhodnotitSestavu,
  type MapaKomponent,
} from "./sestavy";
import type { Build, Component } from "./types";

type Pozice = Build["polozky"][number]["pozice"];

const KOMPONENTY: Component[] = [
  {
    id: "l-cpu",
    kategorie: "cpu",
    vyrobce: "AMD",
    model: "Ryzen 5 5600",
    specifikace: { socket: "AM4", tdp: 65, jader: 6, generace: "Zen 3" },
  },
  {
    id: "l-mb",
    kategorie: "mb",
    vyrobce: "MSI",
    model: "B550",
    specifikace: { socket: "AM4", typRam: "DDR4", formFactor: "ATX", slotyM2: 2, slotySata: 6 },
  },
  {
    id: "l-mb-uzke",
    kategorie: "mb",
    vyrobce: "ASUS",
    model: "B550M",
    specifikace: { socket: "AM4", typRam: "DDR4", formFactor: "mATX", slotyM2: 1, slotySata: 2 },
  },
  {
    id: "l-mb-ddr5",
    kategorie: "mb",
    vyrobce: "ASUS",
    model: "B760M",
    specifikace: {
      socket: "LGA1700",
      typRam: "DDR5",
      formFactor: "mATX",
      slotyM2: 1,
      slotySata: 1,
    },
  },
  {
    id: "l-ram",
    kategorie: "ram",
    vyrobce: "Kingston",
    model: "16 GB DDR4",
    specifikace: { typ: "DDR4", kapacitaGb: 16, rychlostMhz: 3200, pocetModulu: 2 },
  },
  {
    id: "l-gpu",
    kategorie: "gpu",
    vyrobce: "NVIDIA",
    model: "RTX 3060",
    specifikace: { prikonW: 170, delkaMm: 242, vramGb: 12, napajeniPiny: 1 },
  },
  {
    id: "l-gpu-velka",
    kategorie: "gpu",
    vyrobce: "AMD",
    model: "RX 6700 XT",
    specifikace: { prikonW: 230, delkaMm: 320, vramGb: 12, napajeniPiny: 2 },
  },
  {
    id: "l-psu",
    kategorie: "psu",
    vyrobce: "Corsair",
    model: "RM750e",
    specifikace: { vykonW: 750, piny: 2, certifikace: "80+ Gold" },
  },
  {
    id: "l-psu-maly",
    kategorie: "psu",
    vyrobce: "Corsair",
    model: "CX350",
    specifikace: { vykonW: 350, piny: 1, certifikace: "80+ Bronze" },
  },
  {
    id: "l-chladic",
    kategorie: "chladic",
    vyrobce: "Arctic",
    model: "Freezer 34",
    specifikace: { typ: "vzduch", podporovaneSockety: ["AM4", "AM5"], chladiciVykonW: 95 },
  },
  {
    id: "l-chladic-lga",
    kategorie: "chladic",
    vyrobce: "DeepCool",
    model: "AK400",
    specifikace: { typ: "vzduch", podporovaneSockety: ["LGA1700"], chladiciVykonW: 220 },
  },
  {
    id: "l-skrin",
    kategorie: "skrin",
    vyrobce: "Fractal",
    model: "Define 7",
    specifikace: { podporovaneFormFactor: ["ATX", "mATX", "ITX"], maxDelkaGpuMm: 360, slotyM2: 4 },
  },
  {
    id: "l-skrin-mala",
    kategorie: "skrin",
    vyrobce: "Cooler",
    model: "Q300",
    specifikace: { podporovaneFormFactor: ["mATX", "ITX"], maxDelkaGpuMm: 300, slotyM2: 2 },
  },
  {
    id: "l-skrin-itx",
    kategorie: "skrin",
    vyrobce: "Shuttle",
    model: "XPC Prime",
    specifikace: { podporovaneFormFactor: ["ITX"], maxDelkaGpuMm: 310, slotyM2: 1 },
  },
  {
    id: "l-ssd-m2",
    kategorie: "ssd",
    vyrobce: "Samsung",
    model: "980 NVMe",
    specifikace: { kapacitaGb: 1000, rozhrani: "NVMe", typ: "M.2" },
  },
  {
    id: "l-ssd-sata",
    kategorie: "ssd",
    vyrobce: "Crucial",
    model: "MX500",
    specifikace: { kapacitaGb: 500, rozhrani: "SATA", typ: "2.5" },
  },
  {
    id: "l-hdd",
    kategorie: "hdd",
    vyrobce: "WD",
    model: "Blue 2 TB",
    specifikace: { kapacitaGb: 2000, rozhrani: "SATA", typ: "3.5" },
  },
];

const MAPA: MapaKomponent = new Map(KOMPONENTY.map((komponenta) => [komponenta.id, komponenta]));

function sestava(polozky: Array<{ pozice: Pozice; listingId: string | null; cena?: number }>): Build {
  return {
    id: "b1",
    nazev: "Testovací sestava",
    kategorie: "zaklad",
    popis: "",
    polozky: polozky.map((polozka, index) => ({
      id: `p${index}`,
      pozice: polozka.pozice,
      nazev: polozka.listingId ?? "bez kusu",
      listingId: polozka.listingId,
      cenaSnapshot: polozka.cena ?? 1000,
    })),
  };
}

type Polozka = { pozice: Pozice; listingId: string | null };

const KOMPLETNI: Polozka[] = [
  { pozice: "cpu", listingId: "l-cpu" },
  { pozice: "chladic", listingId: "l-chladic" },
  { pozice: "mb", listingId: "l-mb" },
  { pozice: "ram", listingId: "l-ram" },
  { pozice: "gpu", listingId: "l-gpu" },
  { pozice: "psu", listingId: "l-psu" },
  { pozice: "skrin", listingId: "l-skrin" },
];

function nahrad(seznam: Polozka[], pozice: Pozice, listingId: string): Polozka[] {
  return seznam.map((polozka) => (polozka.pozice === pozice ? { pozice, listingId } : polozka));
}

function bezPozice(seznam: Polozka[], pozice: Pozice): Polozka[] {
  return seznam.filter((polozka) => polozka.pozice !== pozice);
}

describe("spocitatCelkovouCenu", () => {
  it("sečte ceny položek v haléřích", () => {
    const cena = spocitatCelkovouCenu(
      sestava([
        { pozice: "cpu", listingId: "l-cpu", cena: 135000 },
        { pozice: "ram", listingId: "l-ram", cena: 39000 },
      ]),
    );
    expect(cena).toBe(174000);
  });

  it("prázdná sestava stojí nulu", () => {
    expect(spocitatCelkovouCenu(sestava([]))).toBe(0);
  });
});

describe("spocitatSpotrebu", () => {
  it("sečte TDP procesoru a příkon grafické karty", () => {
    expect(spocitatSpotrebu(sestava(KOMPLETNI), MAPA)).toBe(65 + 170);
  });

  it("sestava bez grafické karty počítá jen procesor", () => {
    expect(spocitatSpotrebu(sestava(bezPozice(KOMPLETNI, "gpu")), MAPA)).toBe(65);
  });
});

describe("spocitatDoporucenyZdroj", () => {
  it("přidá rezervu nad spotřebou", () => {
    expect(spocitatDoporucenyZdroj(235)).toBe(235 + REZERVA_VYCONU_W);
  });
});

describe("porovnatSRozpoctem", () => {
  it("sestava v rozpočtu vrací kladný rozdíl", () => {
    expect(porovnatSRozpoctem(800000, 900000)).toEqual({ vRozpoctu: true, rozdil: 100000 });
  });

  it("sestava na hranici rozpočtu je ještě v rozpočtu", () => {
    expect(porovnatSRozpoctem(900000, 900000).vRozpoctu).toBe(true);
  });

  it("překročení vrací záporný rozdíl", () => {
    expect(porovnatSRozpoctem(1000000, 900000)).toEqual({
      vRozpoctu: false,
      rozdil: -100000,
    });
  });
});

describe("zhodnotitSestavu — úplná sestava", () => {
  it("kompatibilní sestava nemá žádný problém", () => {
    const zhodnoceni = zhodnotitSestavu(sestava(KOMPLETNI), MAPA);
    expect(zhodnoceni.kompatibilni).toBe(true);
    expect(zhodnoceni.problemy).toEqual([]);
  });

  it("grafická karta není povinná pozice", () => {
    const zhodnoceni = zhodnotitSestavu(sestava(bezPozice(KOMPLETNI, "gpu")), MAPA);
    expect(zhodnoceni.kompatibilni).toBe(true);
  });

  it("vrací součet ceny a spotřeby", () => {
    const zhodnoceni = zhodnotitSestavu(sestava(KOMPLETNI), MAPA);
    expect(zhodnoceni.celkemCena).toBe(7000);
    expect(zhodnoceni.spotrebaW).toBe(235);
    expect(zhodnoceni.doporucenyVykonZdrojeW).toBe(385);
  });
});

describe("zhodnotitSestavu — povinné pozice a duplicity", () => {
  it("vypíše chybějící povinnou pozici", () => {
    const zhodnoceni = zhodnotitSestavu(sestava(bezPozice(KOMPLETNI, "psu")), MAPA);
    expect(zhodnoceni.problemy).toContain("Chybí povinná pozice: psu.");
  });

  it("prázdná sestava vypíše všechny povinné pozice", () => {
    const zhodnoceni = zhodnotitSestavu(sestava([]), MAPA);
    expect(zhodnoceni.problemy).toHaveLength(POVINNE_POZICE.length);
  });

  it("vypíše obsazení pozice dvěma kusy", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava([...KOMPLETNI, { pozice: "ram", listingId: "l-ram" }]),
      MAPA,
    );
    expect(zhodnoceni.problemy).toContain("Pozice ram je obsazena vícekrát.");
  });

  it("více disků v jedné sestavě nese chybu", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava([...KOMPLETNI, { pozice: "ssd", listingId: "l-ssd-m2" }]),
      MAPA,
    );
    expect(zhodnoceni.kompatibilni).toBe(true);
    expect(JEDNOUCNE_POZICE).not.toContain("ssd");
  });
});

describe("zhodnotitSestavu — kompatibilita komponent", () => {
  it("nesoulad socketu procesoru a desky", () => {
    const zhodnoceni = zhodnotitSestavu(sestava(nahrad(KOMPLETNI, "mb", "l-mb-ddr5")), MAPA);
    expect(zhodnoceni.problemy).toContain(
      "Procesor má socket AM4, ale deska podporuje LGA1700.",
    );
  });

  it("nesoulad typu paměti", () => {
    const zhodnoceni = zhodnotitSestavu(sestava(nahrad(KOMPLETNI, "mb", "l-mb-ddr5")), MAPA);
    expect(zhodnoceni.problemy).toContain("Paměť DDR4 není kompatibilní s deskou (DDR5).");
  });

  it("chladič, který nepodporuje socket procesoru", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava(nahrad(KOMPLETNI, "chladic", "l-chladic-lga")),
      MAPA,
    );
    expect(zhodnoceni.problemy).toContain("Chladič nepodporuje socket AM4.");
  });

  it("grafická karta, která se do malé skříně nevejde", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava(nahrad(nahrad(KOMPLETNI, "gpu", "l-gpu-velka"), "skrin", "l-skrin-mala")),
      MAPA,
    );
    expect(zhodnoceni.problemy).toContain(
      "Grafická karta (320 mm) se do skříně (300 mm) nevejde.",
    );
  });

  it("základní deska v nepodporovaném formátu", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava(nahrad(nahrad(KOMPLETNI, "mb", "l-mb"), "skrin", "l-skrin-itx")),
      MAPA,
    );
    expect(zhodnoceni.problemy).toContain("Skříň nepodporuje formát základní desky ATX.");
  });

  it("nedostatečný výkon zdroje", () => {
    const zhodnoceni = zhodnotitSestavu(sestava(nahrad(KOMPLETNI, "psu", "l-psu-maly")), MAPA);
    expect(zhodnoceni.problemy).toContain(
      "Zdroj má 350 W, ale sestava potřebuje alespoň 385 W.",
    );
  });

  it("nedostatečný počet konektorů napájení grafické karty", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava(nahrad(nahrad(KOMPLETNI, "gpu", "l-gpu-velka"), "psu", "l-psu-maly")),
      MAPA,
    );
    expect(zhodnoceni.problemy).toContain(
      "Zdroj má 1 konektorů napájení grafické karty, karta potřebuje 2.",
    );
  });

  it("kus, který už v katalogu není", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava([...KOMPLETNI, { pozice: "ssd", listingId: "l-ssd-mazany" }]),
      MAPA,
    );
    expect(zhodnoceni.problemy.some((problem) => problem.includes("už v katalogu není"))).toBe(
      true,
    );
  });

  it("pozice bez kusu v katalogu se přeskočí", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava([...KOMPLETNI, { pozice: "hdd", listingId: null }]),
      MAPA,
    );
    expect(zhodnoceni.kompatibilni).toBe(true);
  });
});

describe("zhodnotitSestavu — úložiště", () => {
  it("více disků M.2 než slotů na desce", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava([
        ...nahrad(KOMPLETNI, "mb", "l-mb-uzke"),
        { pozice: "ssd", listingId: "l-ssd-m2" },
        { pozice: "ssd", listingId: "l-ssd-m2" },
      ]),
      MAPA,
    );
    expect(zhodnoceni.problemy).toContain("Deska má 1 slotů M.2, sestava potřebuje 2.");
  });

  it("více SATA disků než portů na desce", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava([
        ...nahrad(KOMPLETNI, "mb", "l-mb-uzke"),
        { pozice: "hdd", listingId: "l-hdd" },
        { pozice: "ssd", listingId: "l-ssd-sata" },
        { pozice: "ssd", listingId: "l-ssd-sata" },
      ]),
      MAPA,
    );
    expect(zhodnoceni.problemy).toContain("Deska má 2 SATA portů, sestava potřebuje 3.");
  });

  it("M.2 disk nezabírá SATA port", () => {
    const zhodnoceni = zhodnotitSestavu(
      sestava([
        ...nahrad(KOMPLETNI, "mb", "l-mb-uzke"),
        { pozice: "ssd", listingId: "l-ssd-m2" },
        { pozice: "hdd", listingId: "l-hdd" },
      ]),
      MAPA,
    );
    expect(zhodnoceni.problemy).toEqual([]);
  });
});
