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
  stupen: StupenStavu;
  popis: string;
  zhodnocenoKdy: string;
}

export interface Listing {
  id: ID;
  componentId: ID;
  prodejceId: ID;
  stavHodnoceniId: ID;
  /** Prodejní cena kusu. */
  cena: Penize;
  /** Výkupní cena, za kterou byl kus pořízen. */
  nakupniCena: Penize;
  dostupnost: Dostupnost;
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
  listingId: ID;
  typZasahu: TypZasahu;
  popis: string;
  naklady: Penize;
  provedenoKdy: string;
}

export type VysledekTestu = "prosel" | "selhal" | "casti";

export interface TestEvidence {
  id: ID;
  listingId: ID;
  nazevTestu: string;
  vysledek: VysledekTestu;
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
  /** Konkrétní kus v katalogu, pokud je sestava složená z reálných nabídek. */
  listingId: ID | null;
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

export interface ListingZDetailem {
  listing: Listing;
  component: Component;
  stav: ConditionGrade;
  prodejce: Seller;
}
