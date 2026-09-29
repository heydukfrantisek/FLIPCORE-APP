export type ID = string;

/**
 * Peněžní hodnota v nejmenší jednotce (haléře), nikoli desetinné číslo.
 * Sčítání a porovnávání cen je v této vrstvě vždy celočíselné.
 */
export type Penize = number;

export type KategorieKomponenty =
  | "cpu"
  | "gpu"
  | "ram"
  | "ssd"
  | "hdd"
  | "mb"
  | "psu"
  | "chladic"
  | "skrin";

export type StupenStavu = "A" | "B" | "C" | "D";

export type Dostupnost = "dostupne" | "rezervovano" | "prodano";

export type TypProdejce = "bazar" | "firma" | "jednotlivec";

export type CenovaKategorie = "zaklad" | "stredni" | "premium";

export interface SpecifikaceCPU {
  socket: string;
  tdp: number;
  jader: number;
  generace: string;
}

export interface SpecifikaceGPU {
  prikonW: number;
  delkaMm: number;
  vramGb: number;
  napajeniPiny: number;
}

export interface SpecifikaceRAM {
  typ: "DDR4" | "DDR5";
  kapacitaGb: number;
  rychlostMhz: number;
  pocetModulu: number;
}

export interface SpecifikaceSSD {
  kapacitaGb: number;
  rozhrani: "NVMe" | "SATA";
  typ: "M.2" | "2.5";
}

export interface SpecifikaceHDD {
  kapacitaGb: number;
  rozhrani: "SATA";
  typ: "3.5";
}

export interface SpecifikaceMB {
  socket: string;
  typRam: "DDR4" | "DDR5";
  formFactor: "ATX" | "mATX" | "ITX";
  slotyM2: number;
  slotySata: number;
}

export interface SpecifikacePSU {
  vykonW: number;
  piny: number;
  certifikace: string;
}

export interface SpecifikaceChladic {
  typ: "vzduch" | "voda";
  podporovaneSockety: string[];
  chladiciVykonW: number;
}

export interface SpecifikaceSkrin {
  podporovaneFormFactor: Array<"ATX" | "mATX" | "ITX">;
  maxDelkaGpuMm: number;
  slotyM2: number;
}

/**
 * Katalogový typ komponenty. Diskriminátor `kategorie` určuje tvar
 * `specifikace`, takže je vždy možné přistupovat k parametrům bez dalších
 * kontrol na `any`.
 */
export type Component =
  | { id: ID; kategorie: "cpu"; vyrobce: string; model: string; specifikace: SpecifikaceCPU }
  | { id: ID; kategorie: "gpu"; vyrobce: string; model: string; specifikace: SpecifikaceGPU }
  | { id: ID; kategorie: "ram"; vyrobce: string; model: string; specifikace: SpecifikaceRAM }
  | { id: ID; kategorie: "ssd"; vyrobce: string; model: string; specifikace: SpecifikaceSSD }
  | { id: ID; kategorie: "hdd"; vyrobce: string; model: string; specifikace: SpecifikaceHDD }
  | { id: ID; kategorie: "mb"; vyrobce: string; model: string; specifikace: SpecifikaceMB }
  | { id: ID; kategorie: "psu"; vyrobce: string; model: string; specifikace: SpecifikacePSU }
  | {
      id: ID;
      kategorie: "chladic";
      vyrobce: string;
      model: string;
      specifikace: SpecifikaceChladic;
    }
  | { id: ID; kategorie: "skrin"; vyrobce: string; model: string; specifikace: SpecifikaceSkrin };

export interface ConditionGrade {
  id: ID;
  kusId: ID;
  stupen: StupenStavu;
  popis: string;
  zhodnocenoKdy: string;
}

/** Životní cyklus bazarového kusu. `rezervovano` a `prodano` znamenají, že už nevystavujeme. */
export type StavKusu =
  | "vykoupeno"
  | "v_repasu"
  | "ohodnoceno"
  | "vystaveno"
  | "rezervovano"
  | "prodano";

export interface Kus {
  id: ID;
  componentId: ID;
  prodejceId: ID;
  stav: StavKusu;
  /** Výkupní cena, za kterou byl kus pořízen. Známa od zápisu výkupu. */
  nakupniCena: Penize;
  /** Prodejní cena. `null`, dokud kus není vystaven. */
  prodejniCena: Penize | null;
  /** Datum výkupu ve tvaru ISO `RRRR-MM-DD`. */
  datumVykupu: string;
  vytvorenoKdy: string;
}

export interface Seller {
  id: ID;
  nazev: string;
  typ: TypProdejce;
}

export type TypZasahu = "cisteni" | "vymena" | "oprava" | "testovani";

export interface RepairTicket {
  id: ID;
  kusId: ID;
  typZasahu: TypZasahu;
  popis: string;
  /** `true`, pokud se měnil díl. U `typZasahu: "vymena"` povinné `true`. */
  nahradniDil: boolean;
  naklady: Penize;
  provedenoKdy: string;
}

export type VysledekTestu = "prosel" | "selhal" | "casti";

/**
 * Co test dokazuje. Bez typu nelze stupeň odvodit — z „prošel“ u libovolného
 * testu by nevadilo, co vlastně bylo ověřeno.
 */
export type TypTestu = "profil" | "funkcni" | "vizualni";

export interface TestEvidence {
  id: ID;
  kusId: ID;
  nazevTestu: string;
  typTestu: TypTestu;
  vysledek: VysledekTestu;
  /** Smysluplné jen u `vizualni`; u ostatních vždy `false`. */
  nalezenaVada: boolean;
  provedenoKdy: string;
}

export type StavObjednavky = "rozpracovana" | "potvrzena" | "dodana" | "zrusena";

export interface Objednavka {
  id: ID;
  cislo: string;
  stav: StavObjednavky;
  castka: Penize;
  vytvorenoKdy: string;
}

export interface BuildItem {
  id: ID;
  pozice: KategorieKomponenty;
  nazev: string;
  /** Konkrétní kus, pokud sestava stojí na skutečných kusech ze skladu. */
  kusId: ID | null;
  cenaSnapshot: Penize;
}

export interface Build {
  id: ID;
  nazev: string;
  kategorie: CenovaKategorie;
  popis: string;
  polozky: BuildItem[];
}

export type TypTransakce = "prijem" | "vydaj";

export type KategorieTransakce =
  | "prodej"
  | "nakup"
  | "repas"
  | "doprava"
  | "dan"
  | "skladovani";

export interface Transakce {
  id: ID;
  typ: TypTransakce;
  kategorie: KategorieTransakce;
  popis: string;
  castka: Penize;
  /** Datum ve tvaru ISO `RRRR-MM-DD`. */
  datum: string;
}

export interface Nastaveni {
  nazevObchodu: string;
  mena: string;
  /** Orientační rozpočty kategorií v haléřích; viz otevřená otázka v ROADMAP. */
  rozpoctyKategorii: Record<CenovaKategorie, Penize>;
  /** Výše DPH v procentech. */
  dphProcenta: number;
  skladovaRezerva: number;
}

export interface KusZDetailem {
  kus: Kus;
  component: Component;
  /** Nejnovější hodnocení kusu. `undefined`, pokud kus ještě nebyl ohodnocen. */
  stav: ConditionGrade | undefined;
  prodejce: Seller;
}
