import type {
  Build,
  Component,
  Nastaveni,
  Objednavka,
  RepairTicket,
  Seller,
  StavKusu,
  TestEvidence,
  Transakce,
} from "@/lib/domain/types";

/** Hodnocení kusu, jak ho vkládá `src/db/seed.ts`. */
export interface SeedHodnoceni {
  id: string;
  stupen: "A" | "B" | "C" | "D";
  popis: string;
  zhodnocenoKdy: string;
}

/**
 * Kus vkládaný do databáze. `hodnoceni` jsou ID hodnocení, která patří tomuto
 * kusu; hodnocení tak zůstává vazba 1:N, jak vyžaduje `docs/funkce/001`.
 */
export interface SeedKus {
  id: string;
  componentId: string;
  prodejceId: string;
  stav: StavKusu;
  nakupniCena: number;
  prodejniCena: number | null;
  datumVykupu: string;
  vytvorenoKdy: string;
  hodnoceni: string[];
}

/**
 * Ukázková data pro `pnpm db:seed`. Sem se nikdy nezapisuje za běhu aplikace —
 * databáze startuje prázdná a demo plní výhradně tento samostatný příkaz.
 * Ceny jsou v celých haléřích.
 */
export const KOMPONENTY: Component[] = [
  {
    id: "cmp-cpu-01",
    kategorie: "cpu",
    vyrobce: "Intel",
    model: "Core i5-12400F",
    specifikace: { socket: "LGA1700", tdp: 65, jader: 6, generace: "12. generace" },
  },
  {
    id: "cmp-cpu-02",
    kategorie: "cpu",
    vyrobce: "AMD",
    model: "Ryzen 5 5600",
    specifikace: { socket: "AM4", tdp: 65, jader: 6, generace: "Zen 3" },
  },
  {
    id: "cmp-cpu-03",
    kategorie: "cpu",
    vyrobce: "AMD",
    model: "Ryzen 7 5800X",
    specifikace: { socket: "AM4", tdp: 105, jader: 8, generace: "Zen 3" },
  },
  {
    id: "cmp-gpu-01",
    kategorie: "gpu",
    vyrobce: "NVIDIA",
    model: "GeForce RTX 3060 12GB",
    specifikace: { prikonW: 170, delkaMm: 242, vramGb: 12, napajeniPiny: 1 },
  },
  {
    id: "cmp-gpu-02",
    kategorie: "gpu",
    vyrobce: "AMD",
    model: "Radeon RX 6700 XT",
    specifikace: { prikonW: 230, delkaMm: 320, vramGb: 12, napajeniPiny: 2 },
  },
  {
    id: "cmp-ram-01",
    kategorie: "ram",
    vyrobce: "Kingston",
    model: "Fury Beast 16 GB DDR4",
    specifikace: { typ: "DDR4", kapacitaGb: 16, rychlostMhz: 3200, pocetModulu: 2 },
  },
  {
    id: "cmp-ram-02",
    kategorie: "ram",
    vyrobce: "G.Skill",
    model: "Trident Z 32 GB DDR5",
    specifikace: { typ: "DDR5", kapacitaGb: 32, rychlostMhz: 6000, pocetModulu: 2 },
  },
  {
    id: "cmp-ssd-01",
    kategorie: "ssd",
    vyrobce: "Samsung",
    model: "980 NVMe 1 TB",
    specifikace: { kapacitaGb: 1000, rozhrani: "NVMe", typ: "M.2" },
  },
  {
    id: "cmp-ssd-02",
    kategorie: "ssd",
    vyrobce: "Crucial",
    model: "MX500 500 GB",
    specifikace: { kapacitaGb: 500, rozhrani: "SATA", typ: "2.5" },
  },
  {
    id: "cmp-hdd-01",
    kategorie: "hdd",
    vyrobce: "WD",
    model: "Blue 2 TB",
    specifikace: { kapacitaGb: 2000, rozhrani: "SATA", typ: "3.5" },
  },
  {
    id: "cmp-mb-01",
    kategorie: "mb",
    vyrobce: "MSI",
    model: "B550 Gaming Plus",
    specifikace: {
      socket: "AM4",
      typRam: "DDR4",
      formFactor: "ATX",
      slotyM2: 2,
      slotySata: 6,
    },
  },
  {
    id: "cmp-mb-02",
    kategorie: "mb",
    vyrobce: "ASUS",
    model: "TUF Gaming B760M",
    specifikace: {
      socket: "LGA1700",
      typRam: "DDR5",
      formFactor: "mATX",
      slotyM2: 3,
      slotySata: 4,
    },
  },
  {
    id: "cmp-psu-01",
    kategorie: "psu",
    vyrobce: "Corsair",
    model: "CX450",
    specifikace: { vykonW: 450, piny: 1, certifikace: "80+ Bronze" },
  },
  {
    id: "cmp-psu-02",
    kategorie: "psu",
    vyrobce: "Corsair",
    model: "RM750e",
    specifikace: { vykonW: 750, piny: 2, certifikace: "80+ Gold" },
  },
  {
    id: "cmp-chladic-01",
    kategorie: "chladic",
    vyrobce: "Arctic",
    model: "Freezer 34",
    specifikace: { typ: "vzduch", podporovaneSockety: ["AM4", "AM5"], chladiciVykonW: 95 },
  },
  {
    id: "cmp-chladic-02",
    kategorie: "chladic",
    vyrobce: "be quiet!",
    model: "Pure Rock 2",
    specifikace: {
      typ: "vzduch",
      podporovaneSockety: ["LGA1700", "AM4", "AM5"],
      chladiciVykonW: 150,
    },
  },
  {
    id: "cmp-skrin-01",
    kategorie: "skrin",
    vyrobce: "Fractal",
    model: "Define 7",
    specifikace: { podporovaneFormFactor: ["ATX", "mATX", "ITX"], maxDelkaGpuMm: 360, slotyM2: 4 },
  },
  {
    id: "cmp-skrin-02",
    kategorie: "skrin",
    vyrobce: "Cooler",
    model: "MasterBox Q300",
    specifikace: { podporovaneFormFactor: ["mATX", "ITX"], maxDelkaGpuMm: 300, slotyM2: 2 },
  },
];

export const PRODEJCI: Seller[] = [
  { id: "sel-01", nazev: "Bazar Sever", typ: "bazar" },
  { id: "sel-02", nazev: "IT Recyklace s.r.o.", typ: "firma" },
  { id: "sel-03", nazev: "Petr Novák", typ: "jednotlivec" },
];

export const STAVY: SeedHodnoceni[] = [
  { id: "grd-01", stupen: "A", popis: "Plně funkční, bez kosmetických vad.", zhodnocenoKdy: "2026-08-02" },
  { id: "grd-02", stupen: "B", popis: "Funkční, drobné kosmetické vady.", zhodnocenoKdy: "2026-08-05" },
  { id: "grd-03", stupen: "C", popis: "Funkční, výkon mimo specifikaci, zapsáno v popisu.", zhodnocenoKdy: "2026-08-11" },
  { id: "grd-04", stupen: "D", popis: "Mimo provoz, prodává se na náhradní díly.", zhodnocenoKdy: "2026-08-19" },
  { id: "grd-05", stupen: "B", popis: "Funkční, kosmetické vady, původní balení chybí.", zhodnocenoKdy: "2026-09-01" },
];

export const KUSY: SeedKus[] = [

  {
    id: "kus-01",
    componentId: "cmp-cpu-01",
    prodejceId: "sel-02",
    stav: "vystaveno",
    nakupniCena: 160000,
    prodejniCena: 245000,
    datumVykupu: "2026-09-05",
    vytvorenoKdy: "2026-09-12",
    hodnoceni: ["grd-01"],
  },
  {
    id: "kus-02",
    componentId: "cmp-cpu-02",
    prodejceId: "sel-01",
    stav: "vystaveno",
    nakupniCena: 90000,
    prodejniCena: 135000,
    datumVykupu: "2026-09-07",
    vytvorenoKdy: "2026-09-14",
    hodnoceni: ["grd-02"],
  },
  {
    id: "kus-03",
    componentId: "cmp-cpu-03",
    prodejceId: "sel-01",
    stav: "rezervovano",
    nakupniCena: 160000,
    prodejniCena: 210000,
    datumVykupu: "2026-09-01",
    vytvorenoKdy: "2026-09-08",
    hodnoceni: ["grd-03"],
  },
  {
    id: "kus-04",
    componentId: "cmp-gpu-01",
    prodejceId: "sel-02",
    stav: "vystaveno",
    nakupniCena: 280000,
    prodejniCena: 329000,
    datumVykupu: "2026-09-03",
    vytvorenoKdy: "2026-09-10",
    hodnoceni: ["grd-02"],
  },
  {
    id: "kus-05",
    componentId: "cmp-gpu-02",
    prodejceId: "sel-01",
    stav: "vystaveno",
    nakupniCena: 330000,
    prodejniCena: 415000,
    datumVykupu: "2026-09-08",
    vytvorenoKdy: "2026-09-15",
    hodnoceni: ["grd-05"],
  },
  {
    id: "kus-06",
    componentId: "cmp-ram-01",
    prodejceId: "sel-03",
    stav: "vystaveno",
    nakupniCena: 22000,
    prodejniCena: 39000,
    datumVykupu: "2026-09-09",
    vytvorenoKdy: "2026-09-16",
    hodnoceni: ["grd-01"],
  },
  {
    id: "kus-07",
    componentId: "cmp-ram-02",
    prodejceId: "sel-02",
    stav: "vystaveno",
    nakupniCena: 65000,
    prodejniCena: 79000,
    datumVykupu: "2026-09-02",
    vytvorenoKdy: "2026-09-09",
    hodnoceni: ["grd-02"],
  },
  {
    id: "kus-08",
    componentId: "cmp-ssd-01",
    prodejceId: "sel-02",
    stav: "vystaveno",
    nakupniCena: 55000,
    prodejniCena: 85000,
    datumVykupu: "2026-09-04",
    vytvorenoKdy: "2026-09-11",
    hodnoceni: ["grd-01"],
  },
  {
    id: "kus-09",
    componentId: "cmp-ssd-02",
    prodejceId: "sel-03",
    stav: "vystaveno",
    nakupniCena: 12000,
    prodejniCena: 21000,
    datumVykupu: "2026-09-06",
    vytvorenoKdy: "2026-09-13",
    hodnoceni: ["grd-02"],
  },
  {
    id: "kus-10",
    componentId: "cmp-hdd-01",
    prodejceId: "sel-01",
    stav: "vystaveno",
    nakupniCena: 4000,
    prodejniCena: 12000,
    datumVykupu: "2026-08-21",
    vytvorenoKdy: "2026-08-28",
    hodnoceni: ["grd-04"],
  },
  {
    id: "kus-11",
    componentId: "cmp-mb-01",
    prodejceId: "sel-01",
    stav: "vystaveno",
    nakupniCena: 95000,
    prodejniCena: 128000,
    datumVykupu: "2026-08-31",
    vytvorenoKdy: "2026-09-07",
    hodnoceni: ["grd-02"],
  },
  {
    id: "kus-12",
    componentId: "cmp-mb-02",
    prodejceId: "sel-02",
    stav: "vystaveno",
    nakupniCena: 215000,
    prodejniCena: 265000,
    datumVykupu: "2026-09-10",
    vytvorenoKdy: "2026-09-17",
    hodnoceni: ["grd-01"],
  },
  {
    id: "kus-13",
    componentId: "cmp-psu-01",
    prodejceId: "sel-01",
    stav: "vystaveno",
    nakupniCena: 30000,
    prodejniCena: 52000,
    datumVykupu: "2026-08-29",
    vytvorenoKdy: "2026-09-05",
    hodnoceni: ["grd-03"],
  },
  {
    id: "kus-14",
    componentId: "cmp-psu-02",
    prodejceId: "sel-02",
    stav: "vystaveno",
    nakupniCena: 115000,
    prodejniCena: 149000,
    datumVykupu: "2026-09-11",
    vytvorenoKdy: "2026-09-18",
    hodnoceni: ["grd-01"],
  },
  {
    id: "kus-15",
    componentId: "cmp-chladic-01",
    prodejceId: "sel-03",
    stav: "vystaveno",
    nakupniCena: 5000,
    prodejniCena: 12000,
    datumVykupu: "2026-08-30",
    vytvorenoKdy: "2026-09-06",
    hodnoceni: ["grd-02"],
  },
  {
    id: "kus-16",
    componentId: "cmp-chladic-02",
    prodejceId: "sel-01",
    stav: "vystaveno",
    nakupniCena: 13000,
    prodejniCena: 22000,
    datumVykupu: "2026-09-11",
    vytvorenoKdy: "2026-09-18",
    hodnoceni: ["grd-01"],
  },
  {
    id: "kus-17",
    componentId: "cmp-skrin-01",
    prodejceId: "sel-02",
    stav: "vystaveno",
    nakupniCena: 50000,
    prodejniCena: 78000,
    datumVykupu: "2026-08-28",
    vytvorenoKdy: "2026-09-04",
    hodnoceni: ["grd-02"],
  },
  {
    id: "kus-18",
    componentId: "cmp-skrin-02",
    prodejceId: "sel-01",
    stav: "prodano",
    nakupniCena: 20000,
    prodejniCena: 42000,
    datumVykupu: "2026-08-15",
    vytvorenoKdy: "2026-08-22",
    hodnoceni: ["grd-03"],
  },
];

/**
 * Zásahy a testy jsou demo data pro odvození stupně podle
 * `docs/funkce/005-repas-a-ohodnoceni.md`: na různých kusech záměrně vychází
 * stupeň `A`, `B`, `C`, `D` i žádný. Datum je ISO `RRRR-MM-DD`, aby šlo
 * použít `Date.parse` při porovnávání s posledním zásahem.
 */
export const ZASAHY: RepairTicket[] = [
  {
    id: "rep-01",
    kusId: "kus-04",
    typZasahu: "cisteni",
    popis: "Vyčištění chladiče a výměna termopasty.",
    nahradniDil: false,
    naklady: 3500,
    provedenoKdy: "2026-08-02",
  },
  {
    id: "rep-02",
    kusId: "kus-04",
    typZasahu: "testovani",
    popis: "Zátěžový test 30 minut, teploty v normě.",
    nahradniDil: false,
    naklady: 0,
    provedenoKdy: "2026-08-02",
  },
  {
    id: "rep-03",
    kusId: "kus-05",
    typZasahu: "vymena",
    popis: "Výměna ventilátoru, který hučel.",
    nahradniDil: true,
    naklady: 12000,
    provedenoKdy: "2026-09-01",
  },
  {
    id: "rep-04",
    kusId: "kus-13",
    typZasahu: "testovani",
    popis: "Měření na vstupu 5V a 12V, rozsah mimo toleranci.",
    nahradniDil: false,
    naklady: 0,
    provedenoKdy: "2026-08-20",
  },
  {
    id: "rep-05",
    kusId: "kus-10",
    typZasahu: "oprava",
    popis: "Defektní hlavačku, kus uvolněn na náhradní díly.",
    nahradniDil: false,
    naklady: 0,
    provedenoKdy: "2026-08-24",
  },
  {
    id: "rep-06",
    kusId: "kus-03",
    typZasahu: "vymena",
    popis: "Výměna chladiče CPU, který se přehříval pod zátěží.",
    nahradniDil: true,
    naklady: 18000,
    provedenoKdy: "2026-09-02",
  },
  {
    id: "rep-07",
    kusId: "kus-15",
    typZasahu: "cisteni",
    popis: "Vyčištění lamel chladiče a dosednutí větráku.",
    nahradniDil: false,
    naklady: 0,
    provedenoKdy: "2026-09-07",
  },
];

export const TESTY: TestEvidence[] = [
  // Pro ukázku odvození: `C` (zásah + funkční test), `D` (selhání) a `B` (vada).
  {
    id: "tst-01",
    kusId: "kus-04",
    nazevTestu: "Zátěžový test 30 min",
    typTestu: "profil",
    vysledek: "prosel",
    nalezenaVada: false,
    provedenoKdy: "2026-08-02",
  },
  {
    id: "tst-02",
    kusId: "kus-13",
    nazevTestu: "Měření napětí",
    typTestu: "funkcni",
    vysledek: "casti",
    nalezenaVada: false,
    provedenoKdy: "2026-08-20",
  },
  {
    id: "tst-03",
    kusId: "kus-10",
    nazevTestu: "Kontrola SMART",
    typTestu: "funkcni",
    vysledek: "selhal",
    nalezenaVada: false,
    provedenoKdy: "2026-08-24",
  },
  // K tomu vizuální kontrola s nálezem: dohromady profil + vizuálka dávají `B`.
  {
    id: "tst-04",
    kusId: "kus-04",
    nazevTestu: "Vizuální kontrola krytu a větráků",
    typTestu: "vizualni",
    vysledek: "casti",
    nalezenaVada: true,
    provedenoKdy: "2026-08-02",
  },
  // Stupeň A: zásah + profil prošel + vizuální kontrola bez vady.
  {
    id: "tst-05",
    kusId: "kus-05",
    nazevTestu: "Test herního profilu",
    typTestu: "profil",
    vysledek: "prosel",
    nalezenaVada: false,
    provedenoKdy: "2026-09-01",
  },
  {
    id: "tst-06",
    kusId: "kus-05",
    nazevTestu: "Vizuální kontrola krytu",
    typTestu: "vizualni",
    vysledek: "prosel",
    nalezenaVada: false,
    provedenoKdy: "2026-09-01",
  },
  // Stupeň C: zásah a funkční test, který prošel jen v ověřeném rozsahu.
  {
    id: "tst-07",
    kusId: "kus-03",
    nazevTestu: "Test chlazení pod zátěží 20 min",
    typTestu: "funkcni",
    vysledek: "prosel",
    nalezenaVada: false,
    provedenoKdy: "2026-09-02",
  },
  // Stupeň A: profil prošel a vizuální kontrola nenašla žádnou vadu.
  {
    id: "tst-08",
    kusId: "kus-01",
    nazevTestu: "Test základního profilu",
    typTestu: "profil",
    vysledek: "prosel",
    nalezenaVada: false,
    provedenoKdy: "2026-09-12",
  },
  {
    id: "tst-09",
    kusId: "kus-01",
    nazevTestu: "Vizuální kontrola",
    typTestu: "vizualni",
    vysledek: "prosel",
    nalezenaVada: false,
    provedenoKdy: "2026-09-12",
  },
  // Staré testy z před zásahu (rep-07): nepočítají se, takže profilový průchod
  // nepomůže a kus skončí na `C` — bez čerstvého profilu a vizuálky nevznikne `A`.
  {
    id: "tst-10",
    kusId: "kus-15",
    nazevTestu: "Test předání z výkupu",
    typTestu: "profil",
    vysledek: "prosel",
    nalezenaVada: false,
    provedenoKdy: "2026-08-30",
  },
  {
    id: "tst-11",
    kusId: "kus-15",
    nazevTestu: "Vizuální kontrola předání",
    typTestu: "vizualni",
    vysledek: "prosel",
    nalezenaVada: false,
    provedenoKdy: "2026-08-30",
  },
  // Kus bez zásahu a bez profilového testu: žádný stupeň, UI má říct, co chybí.
  {
    id: "tst-12",
    kusId: "kus-09",
    nazevTestu: "Kontrola přenosu rychlosti",
    typTestu: "funkcni",
    vysledek: "casti",
    nalezenaVada: false,
    provedenoKdy: "2026-09-13",
  },
  // Stupeň B: stejný profilový průchod, ale vizuální kontrola nalezla vadu.
  {
    id: "tst-13",
    kusId: "kus-02",
    nazevTestu: "Test základního profilu",
    typTestu: "profil",
    vysledek: "prosel",
    nalezenaVada: false,
    provedenoKdy: "2026-09-14",
  },
  {
    id: "tst-14",
    kusId: "kus-02",
    nazevTestu: "Vizuální kontrola krytu",
    typTestu: "vizualni",
    vysledek: "prosel",
    nalezenaVada: true,
    provedenoKdy: "2026-09-14",
  },
];

export const OBJEDNAVKY: Objednavka[] = [
  { id: "ord-01", cislo: "FL-2026-0141", stav: "potvrzena", castka: 329000, vytvorenoKdy: "2026-09-12" },
  { id: "ord-02", cislo: "FL-2026-0140", stav: "dodana", castka: 415000, vytvorenoKdy: "2026-09-06" },
  { id: "ord-03", cislo: "FL-2026-0139", stav: "rozpracovana", castka: 245000, vytvorenoKdy: "2026-09-05" },
  { id: "ord-04", cislo: "FL-2026-0138", stav: "zrusena", castka: 79000, vytvorenoKdy: "2026-09-02" },
];

export const TRANSAKCE: Transakce[] = [
  { id: "trx-01", typ: "prijem", kategorie: "prodej", popis: "Prodej RTX 3060 12 GB", castka: 329000, datum: "2026-09-12" },
  { id: "trx-02", typ: "prijem", kategorie: "prodej", popis: "Prodej sestavy RX 6700 XT", castka: 415000, datum: "2026-09-06" },
  { id: "trx-03", typ: "prijem", kategorie: "prodej", popis: "Prodej DDR5 32 GB", castka: 79000, datum: "2026-08-28" },
  { id: "trx-04", typ: "vydaj", kategorie: "nakup", popis: "Výkup RTX 3060 12 GB", castka: 280000, datum: "2026-08-30" },
  { id: "trx-05", typ: "vydaj", kategorie: "nakup", popis: "Výkup Ryzen 5 5600", castka: 90000, datum: "2026-08-22" },
  { id: "trx-06", typ: "vydaj", kategorie: "repas", popis: "Čištění a testování", castka: 15500, datum: "2026-09-02" },
  { id: "trx-07", typ: "vydaj", kategorie: "doprava", popis: "Doprava kurýrem", castka: 6900, datum: "2026-09-07" },
  { id: "trx-08", typ: "vydaj", kategorie: "skladovani", popis: "Nájem skladovny za srpen", castka: 12000, datum: "2026-08-31" },
  { id: "trx-09", typ: "prijem", kategorie: "prodej", popis: "Prodej Core i5-12400F", castka: 245000, datum: "2026-07-18" },
  { id: "trx-10", typ: "vydaj", kategorie: "nakup", popis: "Výkup Core i5-12400F", castka: 160000, datum: "2026-07-10" },
];

/** Sestavy odkazují na konkrétní kusy (`kusId`), proto musí existovat v `KUSY`. */
export const SESTAVY: Build[] = [
  {
    id: "bld-01",
    nazev: "Hraci sestava Základ",
    kategorie: "zaklad",
    popis: "Ryzen 5 5600 s RTX 3060, 16 GB DDR4.",
    polozky: [
      { id: "itm-01", pozice: "cpu", nazev: "AMD Ryzen 5 5600", kusId: "kus-02", cenaSnapshot: 135000 },
      { id: "itm-02", pozice: "chladic", nazev: "Arctic Freezer 34", kusId: "kus-15", cenaSnapshot: 12000 },
      { id: "itm-03", pozice: "mb", nazev: "MSI B550 Gaming Plus", kusId: "kus-11", cenaSnapshot: 128000 },
      { id: "itm-04", pozice: "ram", nazev: "Kingston Fury Beast 16 GB DDR4", kusId: "kus-06", cenaSnapshot: 39000 },
      { id: "itm-05", pozice: "gpu", nazev: "NVIDIA GeForce RTX 3060 12GB", kusId: "kus-04", cenaSnapshot: 329000 },
      { id: "itm-06", pozice: "ssd", nazev: "Samsung 980 NVMe 1 TB", kusId: "kus-08", cenaSnapshot: 85000 },
      { id: "itm-07", pozice: "psu", nazev: "Corsair CX450", kusId: "kus-13", cenaSnapshot: 52000 },
      { id: "itm-08", pozice: "skrin", nazev: "Fractal Define 7", kusId: "kus-17", cenaSnapshot: 78000 },
    ],
  },
  {
    id: "bld-02",
    nazev: "Hraci sestava Stredni",
    kategorie: "stredni",
    popis: "Ryzen 7 5800X s Radeon RX 6700 XT, 32 GB DDR4, NVMe i HDD.",
    polozky: [
      { id: "itm-09", pozice: "cpu", nazev: "AMD Ryzen 7 5800X", kusId: "kus-03", cenaSnapshot: 210000 },
      { id: "itm-10", pozice: "chladic", nazev: "be quiet! Pure Rock 2", kusId: "kus-16", cenaSnapshot: 22000 },
      { id: "itm-11", pozice: "mb", nazev: "MSI B550 Gaming Plus", kusId: "kus-11", cenaSnapshot: 128000 },
      { id: "itm-12", pozice: "ram", nazev: "Kingston Fury Beast 16 GB DDR4", kusId: "kus-06", cenaSnapshot: 39000 },
      { id: "itm-13", pozice: "gpu", nazev: "AMD Radeon RX 6700 XT", kusId: "kus-05", cenaSnapshot: 415000 },
      { id: "itm-14", pozice: "ssd", nazev: "Samsung 980 NVMe 1 TB", kusId: "kus-08", cenaSnapshot: 85000 },
      { id: "itm-15", pozice: "hdd", nazev: "WD Blue 2 TB", kusId: "kus-10", cenaSnapshot: 12000 },
      { id: "itm-16", pozice: "psu", nazev: "Corsair RM750e", kusId: "kus-14", cenaSnapshot: 149000 },
      { id: "itm-17", pozice: "skrin", nazev: "Fractal Define 7", kusId: "kus-17", cenaSnapshot: 78000 },
    ],
  },
  {
    id: "bld-03",
    nazev: "Kancelarska sestava",
    kategorie: "zaklad",
    popis: "Core i5-12400F s integrovanou grafikou — sestava k demonstraci nesouladu typu paměti.",
    polozky: [
      { id: "itm-18", pozice: "cpu", nazev: "Intel Core i5-12400F", kusId: "kus-01", cenaSnapshot: 245000 },
      { id: "itm-19", pozice: "chladic", nazev: "be quiet! Pure Rock 2", kusId: "kus-16", cenaSnapshot: 22000 },
      { id: "itm-20", pozice: "mb", nazev: "ASUS TUF Gaming B760M", kusId: "kus-12", cenaSnapshot: 265000 },
      { id: "itm-21", pozice: "ram", nazev: "Kingston Fury Beast 16 GB DDR4", kusId: "kus-06", cenaSnapshot: 39000 },
      { id: "itm-22", pozice: "ssd", nazev: "Samsung 980 NVMe 1 TB", kusId: "kus-08", cenaSnapshot: 85000 },
      { id: "itm-23", pozice: "psu", nazev: "Corsair CX450", kusId: "kus-13", cenaSnapshot: 52000 },
      { id: "itm-24", pozice: "skrin", nazev: "Cooler MasterBox Q300", kusId: null, cenaSnapshot: 42000 },
    ],
  },
];

export const NASTAVENI: Nastaveni = {
  nazevObchodu: "FLIPCORE",
  mena: "CZK",
  rozpoctyKategorii: {
    zaklad: 900000,
    stredni: 1500000,
    premium: 2500000,
  },
  dphProcenta: 21,
  skladovaRezerva: 3,
};
