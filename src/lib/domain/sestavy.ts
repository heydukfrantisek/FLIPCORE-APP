import type { Build, Component, ID, Penize } from "./types";

/** Rezerva výkonu zdroje nad součtem spotřeby procesoru a grafické karty. */
export const REZERVA_VYCONU_W = 150;

/** Povinné pozice — sestava bez nich není počítač. */
export const POVINNE_POZICE: Component["kategorie"][] = [
  "cpu",
  "chladic",
  "mb",
  "ram",
  "psu",
  "skrin",
];

/** Pozice, kde smí být jen jeden kus. U disků je jich v sestavě víc. */
export const JEDNOUCNE_POZICE: Component["kategorie"][] = [
  "cpu",
  "gpu",
  "chladic",
  "mb",
  "ram",
  "psu",
  "skrin",
];

export interface ZhodnoceniSestavy {
  kompatibilni: boolean;
  problemy: string[];
  celkemCena: Penize;
  spotrebaW: number;
  doporucenyVykonZdrojeW: number;
}

/** Mapuje ID kusu (nabídky) na katalogovou komponentu, ke které ten kus patří. */
export type MapaKomponent = Map<ID, Component>;

type KomponentaKategorie<K extends Component["kategorie"]> = Extract<Component, { kategorie: K }>;

function najdi<K extends Component["kategorie"]>(
  sestava: Build,
  komponenty: MapaKomponent,
  kategorie: K,
): KomponentaKategorie<K> | null {
  const polozka = sestava.polozky.find((polozka) => polozka.pozice === kategorie);
  if (!polozka || !polozka.listingId) {
    return null;
  }
  const component = komponenty.get(polozka.listingId);
  if (!component || component.kategorie !== kategorie) {
    return null;
  }
  return component as KomponentaKategorie<K>;
}

export function spocitatCelkovouCenu(sestava: Build): Penize {
  return sestava.polozky.reduce((soucet, polozka) => soucet + polozka.cenaSnapshot, 0);
}

/** Předpokládaná spotřeba sestavy: TDP procesoru a příkon grafické karty. */
export function spocitatSpotrebu(sestava: Build, komponenty: MapaKomponent): number {
  const cpu = najdi(sestava, komponenty, "cpu");
  const gpu = najdi(sestava, komponenty, "gpu");
  return (cpu?.specifikace.tdp ?? 0) + (gpu?.specifikace.prikonW ?? 0);
}

export function spocitatDoporucenyZdroj(spotrebaW: number): number {
  return spotrebaW + REZERVA_VYCONU_W;
}

/** Srovnání ceny sestavy s rozpočtem kategorie. */
export function porovnatSRozpoctem(
  celkemCena: Penize,
  rozpoctet: Penize,
): { vRozpoctu: boolean; rozdil: Penize } {
  return { vRozpoctu: celkemCena <= rozpoctet, rozdil: rozpoctet - celkemCena };
}

/**
 * Ověří, zda sestava dává smysl: má všechny povinné pozice, žádné duplicity
 * a vzájemně si komponenty odpovídají. Vrací seznam problémů k zobrazení
 * uživateli; prázdný seznam znamená funkční sestavu.
 */
export function zhodnotitSestavu(sestava: Build, komponenty: MapaKomponent): ZhodnoceniSestavy {
  const problemy: string[] = [];

  const obsazenePozice = new Set<Component["kategorie"]>();
  for (const polozka of sestava.polozky) {
    if (JEDNOUCNE_POZICE.includes(polozka.pozice)) {
      if (obsazenePozice.has(polozka.pozice)) {
        problemy.push(`Pozice ${polozka.pozice} je obsazena vícekrát.`);
      }
      obsazenePozice.add(polozka.pozice);
    }
  }

  for (const pozice of POVINNE_POZICE) {
    if (!sestava.polozky.some((polozka) => polozka.pozice === pozice)) {
      problemy.push(`Chybí povinná pozice: ${pozice}.`);
    }
  }

  for (const polozka of sestava.polozky) {
    if (polozka.listingId && !komponenty.has(polozka.listingId)) {
      problemy.push(`Komponenta ${polozka.nazev} už v katalogu není.`);
    }
  }

  const cpu = najdi(sestava, komponenty, "cpu");
  const mb = najdi(sestava, komponenty, "mb");
  const ram = najdi(sestava, komponenty, "ram");
  const gpu = najdi(sestava, komponenty, "gpu");
  const psu = najdi(sestava, komponenty, "psu");
  const chladic = najdi(sestava, komponenty, "chladic");
  const skrin = najdi(sestava, komponenty, "skrin");

  if (cpu && mb && cpu.specifikace.socket !== mb.specifikace.socket) {
    problemy.push(
      `Procesor má socket ${cpu.specifikace.socket}, ale deska podporuje ${mb.specifikace.socket}.`,
    );
  }

  if (chladic && cpu && !chladic.specifikace.podporovaneSockety.includes(cpu.specifikace.socket)) {
    problemy.push(`Chladič nepodporuje socket ${cpu.specifikace.socket}.`);
  }

  if (ram && mb && ram.specifikace.typ !== mb.specifikace.typRam) {
    problemy.push(`Paměť ${ram.specifikace.typ} není kompatibilní s deskou (${mb.specifikace.typRam}).`);
  }

  if (gpu && skrin && gpu.specifikace.delkaMm > skrin.specifikace.maxDelkaGpuMm) {
    problemy.push(
      `Grafická karta (${gpu.specifikace.delkaMm} mm) se do skříně (${skrin.specifikace.maxDelkaGpuMm} mm) nevejde.`,
    );
  }

  if (mb && skrin && !skrin.specifikace.podporovaneFormFactor.includes(mb.specifikace.formFactor)) {
    problemy.push(`Skříň nepodporuje formát základní desky ${mb.specifikace.formFactor}.`);
  }

  const spotrebaW = spocitatSpotrebu(sestava, komponenty);
  const doporucenyVykonZdrojeW = spocitatDoporucenyZdroj(spotrebaW);

  if (psu && psu.specifikace.vykonW < doporucenyVykonZdrojeW) {
    problemy.push(
      `Zdroj má ${psu.specifikace.vykonW} W, ale sestava potřebuje alespoň ${doporucenyVykonZdrojeW} W.`,
    );
  }

  if (psu && gpu && psu.specifikace.piny < gpu.specifikace.napajeniPiny) {
    problemy.push(
      `Zdroj má ${psu.specifikace.piny} konektorů napájení grafické karty, karta potřebuje ${gpu.specifikace.napajeniPiny}.`,
    );
  }

  if (mb) {
    const disky = sestava.polozky.filter(
      (polozka) => polozka.pozice === "ssd" || polozka.pozice === "hdd",
    );
    const potrebneM2 = disky.filter((polozka) => jeM2(sestava, komponenty, polozka.id)).length;
    if (potrebneM2 > mb.specifikace.slotyM2) {
      problemy.push(`Deska má ${mb.specifikace.slotyM2} slotů M.2, sestava potřebuje ${potrebneM2}.`);
    }

    const potrebneSata = disky.filter(
      (polozka) => !jeM2(sestava, komponenty, polozka.id),
    ).length;
    if (potrebneSata > mb.specifikace.slotySata) {
      problemy.push(
        `Deska má ${mb.specifikace.slotySata} SATA portů, sestava potřebuje ${potrebneSata}.`,
      );
    }
  }

  return {
    kompatibilni: problemy.length === 0,
    problemy,
    celkemCena: spocitatCelkovouCenu(sestava),
    spotrebaW,
    doporucenyVykonZdrojeW,
  };
}

function jeM2(sestava: Build, komponenty: MapaKomponent, polozkaId: string): boolean {
  const polozka = sestava.polozky.find((polozka) => polozka.id === polozkaId);
  if (!polozka || !polozka.listingId) {
    return false;
  }
  const component = komponenty.get(polozka.listingId);
  return component !== undefined && component.kategorie === "ssd" && component.specifikace.typ === "M.2";
}
