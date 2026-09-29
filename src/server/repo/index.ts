import "server-only";

import { randomUUID } from "node:crypto";

import { desc, eq } from "drizzle-orm";

import { databaze, schema } from "@/db/client";
import { spocitatPrehledSkladu, najdiNizsiMarzi, type PrehledSkladu } from "@/lib/domain/sklad";
import { spocitatPrehledFinanc, type PrehledFinanc } from "@/lib/domain/finance";
import { zhodnotitSestavu, type MapaKomponent, type ZhodnoceniSestavy } from "@/lib/domain/sestavy";
import type {
  Component,
  ConditionGrade,
  ID,
  Kus,
  KusZDetailem,
  Nastaveni,
  Objednavka,
  RepairTicket,
  Seller,
  StavKusu,
  TestEvidence,
  Transakce,
  Build,
} from "@/lib/domain/types";

/**
 * Datová vrstva. UI nesmí sahat do `src/db/` ani do dotazů; veškeré čtení
 * prochází přes tyto funkce, takže se změna zdroje dat dotkne jen tohoto souboru.
 */

/** Řádky z databáze převádí na doménové typy; ceny jsou už v haléřích. */
function naKomponentu(radek: typeof schema.komponenty.$inferSelect): Component {
  return { ...radek, specifikace: radek.specifikace } as Component;
}

function naStav(radek: typeof schema.stavyHodnoceni.$inferSelect): ConditionGrade {
  return {
    id: radek.id,
    kusId: radek.kusId,
    stupen: radek.stupen as ConditionGrade["stupen"],
    popis: radek.popis,
    zhodnocenoKdy: radek.zhodnocenoKdy,
  };
}

function naProdejce(radek: typeof schema.prodejci.$inferSelect): Seller {
  return { id: radek.id, nazev: radek.nazev, typ: radek.typ as Seller["typ"] };
}

function naKus(radek: typeof schema.kusy.$inferSelect): Kus {
  return {
    id: radek.id,
    componentId: radek.componentId,
    prodejceId: radek.prodejceId,
    stav: radek.stav as StavKusu,
    nakupniCena: radek.nakupniCena,
    prodejniCena: radek.prodejniCena,
    datumVykupu: radek.datumVykupu,
    vytvorenoKdy: radek.vytvorenoKdy,
  };
}

/**
 * Kusy doplněné o katalogovou komponentu, prodejce a nejnovější stavové hodnocení.
 * Hodnocení je vazba 1:N, takže se z řádků vybírá to s nejpozdějším datem.
 */
export function getKusy(): KusZDetailem[] {
  const db = databaze();
  const radky = db.select().from(schema.kusy).all();
  if (radky.length === 0) {
    return [];
  }

  const komponenty = new Map(
    db.select().from(schema.komponenty).all().map((radek) => [radek.id, naKomponentu(radek)]),
  );
  const prodejci = new Map(
    db.select().from(schema.prodejci).all().map((radek) => [radek.id, naProdejce(radek)]),
  );

  // Nejnovější hodnocení pro každý kus; při shodě rozhoduje vyšší ID jako pojistka.
  const nejnovejsiHodnoceni = new Map<ID, ConditionGrade>();
  for (const radek of db
    .select()
    .from(schema.stavyHodnoceni)
    .orderBy(desc(schema.stavyHodnoceni.zhodnocenoKdy), desc(schema.stavyHodnoceni.id))
    .all()) {
    if (!nejnovejsiHodnoceni.has(radek.kusId)) {
      nejnovejsiHodnoceni.set(radek.kusId, naStav(radek));
    }
  }

  return radky.flatMap((radek) => {
    const kus = naKus(radek);
    const component = komponenty.get(kus.componentId);
    const prodejce = prodejci.get(kus.prodejceId);

    if (!component || !prodejce) {
      // Cizí klíč to nedovolí, ale bez komponenty nelze kus v UI ukázat.
      return [];
    }
    return [{ kus, component, stav: nejnovejsiHodnoceni.get(kus.id), prodejce }];
  });
}

export function getSklad(): { zaznamy: KusZDetailem[]; prehled: PrehledSkladu } {
  const zaznamy = getKusy();
  return { zaznamy, prehled: spocitatPrehledSkladu(zaznamy) };
}

export function getComponenty(): Component[] {
  return databaze()
    .select()
    .from(schema.komponenty)
    .all()
    .map(naKomponentu);
}

export function getProdejci(): Seller[] {
  return databaze()
    .select()
    .from(schema.prodejci)
    .all()
    .map(naProdejce);
}

export function getZasahy(): RepairTicket[] {
  return databaze()
    .select()
    .from(schema.zasahy)
    .all()
    .map((radek) => ({
      id: radek.id,
      kusId: radek.kusId,
      typZasahu: radek.typZasahu as RepairTicket["typZasahu"],
      popis: radek.popis,
      naklady: radek.naklady,
      provedenoKdy: radek.provedenoKdy,
    }));
}

export interface ZasahSDetailem {
  zasah: RepairTicket;
  /** Kus, ke kterému zásah patří. Chybí, pokud kus v datech už odstraněný není. */
  zaznam: KusZDetailem | undefined;
}

export function getZasahySDetaily(): ZasahSDetailem[] {
  const zaznamy = new Map(getKusy().map((zaznam) => [zaznam.kus.id, zaznam]));
  return getZasahy().map((zasah) => ({ zasah, zaznam: zaznamy.get(zasah.kusId) }));
}

export function getTesty(): TestEvidence[] {
  return databaze()
    .select()
    .from(schema.dukazyTestu)
    .all()
    .map((radek) => ({
      id: radek.id,
      kusId: radek.kusId,
      nazevTestu: radek.nazevTestu,
      vysledek: radek.vysledek as TestEvidence["vysledek"],
      provedenoKdy: radek.provedenoKdy,
    }));
}

export function getObjednavky(): Objednavka[] {
  // Objednávky zatím nejsou součástí schématu — přijdou s veřejným katalogem.
  return [];
}

export function getNastaveni(): Nastaveni {
  const radek = databaze().select().from(schema.nastaveni).limit(1).get();

  if (!radek) {
    return {
      nazevObchodu: "FLIPCORE",
      mena: "CZK",
      rozpoctyKategorii: { zaklad: 0, stredni: 0, premium: 0 },
      dphProcenta: 0,
      skladovaRezerva: 0,
    };
  }

  return {
    nazevObchodu: radek.nazevObchodu,
    mena: radek.mena,
    rozpoctyKategorii: radek.rozpoctyKategorii as Nastaveni["rozpoctyKategorii"],
    dphProcenta: radek.dphProcenta,
    skladovaRezerva: radek.skladovaRezerva,
  };
}

export function getFinance(): { transakce: Transakce[]; prehled: PrehledFinanc } {
  const transakce: Transakce[] = databaze()
    .select()
    .from(schema.transakce)
    .all()
    .map((radek) => ({
      id: radek.id,
      typ: radek.typ as Transakce["typ"],
      kategorie: radek.kategorie as Transakce["kategorie"],
      popis: radek.popis,
      castka: radek.castka,
      datum: radek.datum,
    }));

  return { transakce, prehled: spocitatPrehledFinanc(transakce, getNastaveni().dphProcenta) };
}

export interface SestavaSCenou extends Build {
  zhodnoceni: ZhodnoceniSestavy;
}

/** Mapuje ID kusu na katalogovou komponentu, kterou kus obsahuje. */
function mapaKomponentProKus(): MapaKomponent {
  const mapa: MapaKomponent = new Map();
  for (const zaznam of getKusy()) {
    mapa.set(zaznam.kus.id, zaznam.component);
  }
  return mapa;
}

export function getSestavy(): SestavaSCenou[] {
  const db = databaze();
  const radky = db.select().from(schema.sestavy).all();
  const polozky = db.select().from(schema.polozkySestav).all();

  return radky.map((radek) => {
    const sestava: Build = {
      id: radek.id,
      nazev: radek.nazev,
      kategorie: radek.kategorie as Build["kategorie"],
      popis: radek.popis,
      polozky: polozky
        .filter((polozka) => polozka.sestavaId === radek.id)
        .map((polozka) => ({
          id: polozka.id,
          pozice: polozka.pozice as Build["polozky"][number]["pozice"],
          nazev: polozka.nazev,
          kusId: polozka.kusId,
          cenaSnapshot: polozka.cenaSnapshot,
        })),
    };
    return { ...sestava, zhodnoceni: zhodnotitSestavu(sestava, mapaKomponentProKus()) };
  });
}

export interface VstupVykupu {
  componentId: ID;
  prodejce:
    | { rezim: "existujici"; prodejceId: ID }
    | { rezim: "novy"; nazev: string; typ: Seller["typ"] };
  nakupniCena: number;
  datumVykupu: string;
}

/**
 * Chyba, jejíž text je bezpečné ukázat provozovateli — nejde o selhání databáze,
 * ale o rozpor mezi formulářem a stavem dat (například ID, které už neexistuje).
 */
export class ChybaZapisu extends Error {}

/** Nové ID kusu a prodejce generujeme na serveru; klient ID neposílá. */
function noveId(prefix: string): string {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

/**
 * Založí výkup: kus v stavu `vykoupeno` bez prodejní ceny a bez hodnocení.
 * Nový prodejce a kus vznikají v jedné transakci — jedno bez druhého by
 * zanechalo v databázi odkaz na nic.
 *
 * Cizí klíče se zde ověřují znovu, i když je ověřil formulář: klient mohl
 * poslat ID, které ve chvíli zápisu neexistuje.
 */
export function zalozitVykup(vstup: VstupVykupu): Kus {
  const db = databaze();

  const komponenta = db
    .select()
    .from(schema.komponenty)
    .where(eq(schema.komponenty.id, vstup.componentId))
    .get();
  if (!komponenta) {
    throw new ChybaZapisu("Vybraná komponenta v katalogu neexistuje.");
  }

  const kus = db.transaction((tx) => {
    let prodejceId: ID;
    if (vstup.prodejce.rezim === "novy") {
      prodejceId = noveId("sel");
      tx.insert(schema.prodejci)
        .values({ id: prodejceId, nazev: vstup.prodejce.nazev, typ: vstup.prodejce.typ })
        .run();
    } else {
      const existujici = tx
        .select()
        .from(schema.prodejci)
        .where(eq(schema.prodejci.id, vstup.prodejce.prodejceId))
        .get();
      if (!existujici) {
        throw new ChybaZapisu("Vybraný prodejce neexistuje.");
      }
      prodejceId = existujici.id;
    }

    const id = noveId("kus");
    tx.insert(schema.kusy)
      .values({
        id,
        componentId: vstup.componentId,
        prodejceId,
        // Nově vykoupený kus se ještě neprodejí a nemá hodnocení.
        stav: "vykoupeno",
        nakupniCena: vstup.nakupniCena,
        prodejniCena: null,
        datumVykupu: vstup.datumVykupu,
        vytvorenoKdy: new Date().toISOString(),
      })
      .run();

    return tx.select().from(schema.kusy).where(eq(schema.kusy.id, id)).get()!;
  });

  return naKus(kus);
}

export function getKus(id: ID): Kus | undefined {
  const radek = databaze().select().from(schema.kusy).where(eq(schema.kusy.id, id)).get();
  return radek ? naKus(radek) : undefined;
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
  nizsiMarze: KusZDetailem[];
  posledniZasahy: ZasahSDetailem[];
}

/** Souhrn pro nástěnku — skládá ho jednotlivé repo funkce, žádná vlastní logika. */
export function getPrehledNastenky(): PrehledNastenky {
  const { zaznamy, prehled: sklad } = getSklad();
  const { prehled: finance } = getFinance();
  const sestavy = getSestavy();
  const nastaveni = getNastaveni();

  const vRozpoctu = sestavy.filter((sestava) => {
    const rozpoctet = nastaveni.rozpoctyKategorii[sestava.kategorie];
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
    objednavky: getObjednavky(),
    nizsiMarze: najdiNizsiMarzi(zaznamy, 30),
    posledniZasahy: getZasahySDetaily()
      .slice()
      .sort((a, b) => Date.parse(b.zasah.provedenoKdy) - Date.parse(a.zasah.provedenoKdy)),
  };
}
