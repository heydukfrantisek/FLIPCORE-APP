import type {
  Component,
  ConditionGrade,
  ID,
  Listing,
  ListingZDetailem,
  Nastaveni,
  Objednavka,
  RepairTicket,
  Seller,
  TestEvidence,
  Transakce,
} from "@/lib/domain/types";
import { spocitatPrehledSkladu, najdiNizsiMarzi, type PrehledSkladu } from "@/lib/domain/sklad";
import { spocitatPrehledFinanc, type PrehledFinanc } from "@/lib/domain/finance";
import { zhodnotitSestavu, type MapaKomponent, type ZhodnoceniSestavy } from "@/lib/domain/sestavy";
import type { Build } from "@/lib/domain/types";

import {
  KOMPONENTY,
  NABIDKY,
  NASTAVENI,
  OBJEDNAVKY,
  PRODEJCI,
  SESTAVY,
  STAVY,
  TESTY,
  TRANSAKCE,
  ZASAHY,
} from "./data";

/**
 * Dočasná datová vrstva. UI nesmí sahat přímo do `data.ts`; veškeré dotazy
 * procházejí přes tyto funkce, aby se po rozhodnutí persistence změnil jen
 * tento soubor.
 */

function komponentyPodleId(): Map<ID, Component> {
  return new Map(KOMPONENTY.map((komponenta) => [komponenta.id, komponenta]));
}

function stavyPodleId(): Map<ID, ConditionGrade> {
  return new Map(STAVY.map((stav) => [stav.id, stav]));
}

function prodejciPodleId(): Map<ID, Seller> {
  return new Map(PRODEJCI.map((prodejce) => [prodejce.id, prodejce]));
}

/** Kusy v katalogu doplněné o katalogovou komponentu, stav a prodejce. */
export function getNabidky(): ListingZDetailem[] {
  const komponenty = komponentyPodleId();
  const stavy = stavyPodleId();
  const prodejci = prodejciPodleId();

  return NABIDKY.flatMap((listing) => {
    const component = komponenty.get(listing.componentId);
    const stav = stavy.get(listing.stavHodnoceniId);
    const prodejce = prodejci.get(listing.prodejceId);

    if (!component || !stav || !prodejce) {
      return [];
    }
    return [{ listing, component, stav, prodejce }];
  });
}

export function getSklad(): { zaznamy: ListingZDetailem[]; prehled: PrehledSkladu } {
  const zaznamy = getNabidky();
  return { zaznamy, prehled: spocitatPrehledSkladu(zaznamy) };
}

export function getComponenty(): Component[] {
  return KOMPONENTY;
}

export function getProdejci(): Seller[] {
  return PRODEJCI;
}

export function getZasahy(): RepairTicket[] {
  return ZASAHY;
}

export interface ZasahSDetailem {
  zasah: RepairTicket;
  /** Kus, ke kterému zásah patří. Chybí, pokud je nabídka v datech už odstraněná. */
  zaznam: ListingZDetailem | undefined;
}

export function getZasahySDetaily(): ZasahSDetailem[] {
  const zaznamy = new Map(getNabidky().map((zaznam) => [zaznam.listing.id, zaznam]));
  return ZASAHY.map((zasah) => ({ zasah, zaznam: zaznamy.get(zasah.listingId) }));
}

export function getTesty(): TestEvidence[] {
  return TESTY;
}

export function getObjednavky(): Objednavka[] {
  return OBJEDNAVKY;
}

export function getNastaveni(): Nastaveni {
  return NASTAVENI;
}

export function getFinance(): { transakce: Transakce[]; prehled: PrehledFinanc } {
  const transakce = TRANSAKCE;
  return { transakce, prehled: spocitatPrehledFinanc(transakce, NASTAVENI.dphProcenta) };
}

export interface SestavaSCenou extends Build {
  zhodnoceni: ZhodnoceniSestavy;
}

/** Mapuje ID kusu (listingu) na katalogovou komponentu, kterou vlastní. */
function mapaKomponentProKus(): MapaKomponent {
  const komponenty = komponentyPodleId();
  const mapa: MapaKomponent = new Map();
  for (const listing of NABIDKY) {
    const component = komponenty.get(listing.componentId);
    if (component) {
      mapa.set(listing.id, component);
    }
  }
  return mapa;
}

export function getSestavy(): SestavaSCenou[] {
  const komponenty = mapaKomponentProKus();
  return SESTAVY.map((sestava) => ({ ...sestava, zhodnoceni: zhodnotitSestavu(sestava, komponenty) }));
}

export function getNabidka(id: ID): Listing | undefined {
  return NABIDKY.find((listing) => listing.id === id);
}

export interface PrehledNastenky {
  sklad: PrehledSkladu;
  finance: PrehledFinanc;
  sestavy: {
    celkem: number;
    kompatibilnich: number;
    sProblemem: number;
    vRozpoctu: number;
  };
  objednavky: Objednavka[];
  nizsiMarze: ListingZDetailem[];
  posledniZasahy: ZasahSDetailem[];
}

/** Souhrn pro nástěnku — skládá ho jednotlivé repo funkce, žádná vlastní logika. */
export function getPrehledNastenky(): PrehledNastenky {
  const { zaznamy, prehled: sklad } = getSklad();
  const { prehled: finance } = getFinance();
  const sestavy = getSestavy();

  const vRozpoctu = sestavy.filter((sestava) => {
    const rozpoctet = NASTAVENI.rozpoctyKategorii[sestava.kategorie];
    return sestava.zhodnoceni.celkemCena <= rozpoctet;
  }).length;

  return {
    sklad,
    finance,
    sestavy: {
      celkem: sestavy.length,
      kompatibilnich: sestavy.filter((sestava) => sestava.zhodnoceni.kompatibilni).length,
      sProblemem: sestavy.filter((sestava) => !sestava.zhodnoceni.kompatibilni).length,
      vRozpoctu,
    },
    objednavky: OBJEDNAVKY,
    nizsiMarze: najdiNizsiMarzi(zaznamy, 30),
    posledniZasahy: getZasahySDetaily()
      .slice()
      .sort((a, b) => Date.parse(b.zasah.provedenoKdy) - Date.parse(a.zasah.provedenoKdy)),
  };
}
