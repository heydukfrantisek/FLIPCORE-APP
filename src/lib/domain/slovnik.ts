import type {
  CenovaKategorie,
  Dostupnost,
  KategorieKomponenty,
  StupenStavu,
  StavObjednavky,
  TypProdejce,
  TypZasahu,
  VysledekTestu,
} from "./types";

export const KATEGORIE_POPIS: Record<KategorieKomponenty, string> = {
  cpu: "Procesor",
  gpu: "Grafická karta",
  ram: "Operační paměť",
  ssd: "SSD",
  hdd: "Pevný disk",
  mb: "Základní deska",
  psu: "Zdroj napájení",
  chladic: "Chladič",
  skrin: "Skříň",
};

/** Pořadí kategorií v UI odpovídá pořadí ve sestavě počítače. */
export const PORADI_KATEGORII: KategorieKomponenty[] = [
  "cpu",
  "chladic",
  "mb",
  "ram",
  "gpu",
  "ssd",
  "hdd",
  "psu",
  "skrin",
];

export const STUPEN_POPIS: Record<StupenStavu, string> = {
  A: "A — jako nový, plně funkční",
  B: "B — funkční, kosmetické vady",
  C: "C — funkční s odchylkou, doloženo",
  D: "D — mimo provoz, na náhradní díly",
};

export const DOSTUPNOST_POPIS: Record<Dostupnost, string> = {
  dostupne: "Dostupné",
  rezervovano: "Rezervováno",
  prodano: "Prodáno",
};

export const PRODEJCE_POPIS: Record<TypProdejce, string> = {
  bazar: "Bazar",
  firma: "Firma",
  jednotlivec: "Jednotlivec",
};

export const ZASAH_POPIS: Record<TypZasahu, string> = {
  cisteni: "Čištění",
  vymena: "Výměna dílu",
  oprava: "Oprava",
  testovani: "Testování",
};

export const TEST_POPIS: Record<VysledekTestu, string> = {
  prosel: "Prošel",
  selhal: "Selhal",
  casti: "Částečně",
};

export const OBJEDNAVKA_POPIS: Record<StavObjednavky, string> = {
  rozpracovana: "Rozpracovaná",
  potvrzena: "Potvrzena",
  dodana: "Dodána",
  zrusena: "Zrušena",
};

export const KATEGORIE_SESTAVY_POPIS: Record<CenovaKategorie, string> = {
  zaklad: "Základ",
  stredni: "Střední",
  premium: "Premium",
};

export const KATEGORIE_SESTAVY_POPIS_ROZVINUTA: Record<CenovaKategorie, string> = {
  zaklad: "Základ — nejvyšší výkon za nejnižší cenu",
  stredni: "Střední — vyvážený poměr výkonu a ceny",
  premium: "Premium — maximum výkonu z bazarových dílů",
};
