import "server-only";

import { randomUUID } from "node:crypto";

import { desc, eq } from "drizzle-orm";

import { databaze, schema, type Databaze } from "@/db/client";
import { odvodStupne, zmenaStavu, type VysledekOhodnoceni } from "@/lib/domain/repas";
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
  StupenStavu,
  TestEvidence,
  Transakce,
  TypTestu,
  TypZasahu,
  VysledekTestu,
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

function naZasah(radek: typeof schema.zasahy.$inferSelect): RepairTicket {
  return {
    id: radek.id,
    kusId: radek.kusId,
    typZasahu: radek.typZasahu as TypZasahu,
    popis: radek.popis,
    nahradniDil: radek.nahradniDil,
    naklady: radek.naklady,
    provedenoKdy: radek.provedenoKdy,
  };
}

function naTest(radek: typeof schema.dukazyTestu.$inferSelect): TestEvidence {
  return {
    id: radek.id,
    kusId: radek.kusId,
    nazevTestu: radek.nazevTestu,
    typTestu: radek.typTestu as TypTestu,
    vysledek: radek.vysledek as VysledekTestu,
    nalezenaVada: radek.nalezenaVada,
    provedenoKdy: radek.provedenoKdy,
  };
}

export function getZasahy(): RepairTicket[] {
  return databaze()
    .select()
    .from(schema.zasahy)
    .all()
    .map(naZasah);
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
    .map(naTest);
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

/**
 * Kus s důkazy pro detail kusu. Na rozdíl od `KusZDetailem` z
 * `src/lib/domain/types.ts`, kterou pracují sklad a nástěnka, tady nese
 * i historii zásahů, testů a hodnocení a odvozený stupeň.
 */
export interface KusZRepasem {
  kus: Kus;
  component: Component;
  prodejce: Seller;
  /** Nejnovější hodnocení; `undefined`, dokud stupeň nebyl odvozen a zapsán. */
  stupen: ConditionGrade | undefined;
  zasahy: RepairTicket[];
  testy: TestEvidence[];
  /** Sestupně podle `zhodnocenoKdy`, včetně toho v poli `stupen`. */
  historieHodnoceni: ConditionGrade[];
  /** Odvození z aktuálních důkazů, i když zatím nic nebylo zapsáno. */
  odvozeni: VysledekOhodnoceni;
}

/**
 * Načte všechno, co detail kusu potřebuje. Odvození stupeň **nepočítá
 * jinak** — volá `odvodStupne` z domény, aby v repovrstvě nevznikla druhá
 * implementace pravidel.
 */
export function getKusZDetailem(id: ID): KusZRepasem | undefined {
  const db = databaze();

  const radek = db.select().from(schema.kusy).where(eq(schema.kusy.id, id)).get();
  if (!radek) {
    return undefined;
  }
  const kus = naKus(radek);

  const radekKomponenty = db
    .select()
    .from(schema.komponenty)
    .where(eq(schema.komponenty.id, kus.componentId))
    .get();
  const radekProdejce = db
    .select()
    .from(schema.prodejci)
    .where(eq(schema.prodejci.id, kus.prodejceId))
    .get();
  if (!radekKomponenty || !radekProdejce) {
    // Cizí klíč to nedovolí, ale bez komponenty nebo prodejce nelze kus v UI ukázat.
    return undefined;
  }

  // Sestupně podle data; při shodě rozhoduje vyšší ID jako pojistka.
  const zasahy = db
    .select()
    .from(schema.zasahy)
    .where(eq(schema.zasahy.kusId, kus.id))
    .orderBy(desc(schema.zasahy.provedenoKdy), desc(schema.zasahy.id))
    .all()
    .map(naZasah);

  const testy = db
    .select()
    .from(schema.dukazyTestu)
    .where(eq(schema.dukazyTestu.kusId, kus.id))
    .orderBy(desc(schema.dukazyTestu.provedenoKdy), desc(schema.dukazyTestu.id))
    .all()
    .map(naTest);

  const historieHodnoceni = db
    .select()
    .from(schema.stavyHodnoceni)
    .where(eq(schema.stavyHodnoceni.kusId, kus.id))
    .orderBy(desc(schema.stavyHodnoceni.zhodnocenoKdy), desc(schema.stavyHodnoceni.id))
    .all()
    .map(naStav);

  return {
    kus,
    component: naKomponentu(radekKomponenty),
    prodejce: naProdejce(radekProdejce),
    // Seznam je sestupný, takže nejnovější záznam je první.
    stupen: historieHodnoceni[0],
    zasahy,
    testy,
    historieHodnoceni,
    odvozeni: odvodStupne({ zasahy, testy }),
  };
}

/** Zásah připravený k zápisu. ID generuje server. */
export interface VstupZasahu {
  kusId: ID;
  typZasahu: TypZasahu;
  popis: string;
  nahradniDil: boolean;
  /** Náklady v haléřích. */
  naklady: number;
  provedenoKdy: string;
}

/** Test připravený k zápisu. ID generuje server. */
export interface VstupTestu {
  kusId: ID;
  nazevTestu: string;
  typTestu: TypTestu;
  vysledek: VysledekTestu;
  nalezenaVada: boolean;
  provedenoKdy: string;
}

/** Proč se kus do Repasu nevrací — text je bezpečné ukázat provozovateli. */
const ZPRAVA_ZAKAZANEHO_NAVRATU: Partial<Record<StavKusu, string>> = {
  vystaveno: "Kus už je vystavený, zpět do Repasu se nevrací.",
  rezervovano: "Kus už je rezervovaný, zpět do Repasu se nevrací.",
  prodano: "Kus už je prodaný, zpět do Repasu se nevrací.",
};

/** Dávkový kontext transakce; sdílený všemi zápisy v tomto souboru. */
type Tx = Parameters<Parameters<Databaze["transaction"]>[0]>[0];

/**
 * Stav kusu, ve kterém smí vzniknout nový důkaz. Přechod se neposuzuje
 * v repovrstvě po hlavě — `zmenaStavu` ho ověří a případnou výjimku
 * převedeme na `ChybaZapisu`. Ostatní stavy (už `v_repasu`, `ohodnoceno`)
 * se nechávají beze změny.
 */
function stavProZapisDokladu(stav: StavKusu): StavKusu {
  const zakaz = ZPRAVA_ZAKAZANEHO_NAVRATU[stav];
  if (zakaz) {
    throw new ChybaZapisu(zakaz);
  }
  if (stav !== "vykoupeno") {
    return stav;
  }
  try {
    return zmenaStavu(stav, "v_repasu");
  } catch {
    throw new ChybaZapisu("Stav kusu nedovoluje zapsat nový důkaz.");
  }
}

/** Načte kus uvnitř transakce; chybějící kus je chyba, ne tichý průchod. */
function kusVZakluke(tx: Tx, kusId: ID): Kus {
  const radek = tx.select().from(schema.kusy).where(eq(schema.kusy.id, kusId)).get();
  if (!radek) {
    throw new ChybaZapisu("Kus neexistuje.");
  }
  return naKus(radek);
}

/** Přechod do Repasu provede a zapíše důkaz v téže transakci. */
function zapsatDoklad(vstup: { kusId: ID }, vlozit: (tx: Tx) => void): void {
  databaze().transaction((tx) => {
    const kus = kusVZakluke(tx, vstup.kusId);
    const stav = stavProZapisDokladu(kus.stav);
    if (stav !== kus.stav) {
      tx.update(schema.kusy).set({ stav }).where(eq(schema.kusy.id, kus.id)).run();
    }
    vlozit(tx);
  });
}

/**
 * Zapíše zásah. Kus ve stavu `vykoupeno` přechází do `v_repasu` v téže
 * transakci jako zásah — jinak by existoval zásah bez změny stavu.
 */
export function zapsatZasah(vstup: VstupZasahu): void {
  zapsatDoklad(vstup, (tx) => {
    tx.insert(schema.zasahy)
      .values({
        id: noveId("zas"),
        kusId: vstup.kusId,
        typZasahu: vstup.typZasahu,
        popis: vstup.popis,
        nahradniDil: vstup.nahradniDil,
        naklady: vstup.naklady,
        provedenoKdy: vstup.provedenoKdy,
      })
      .run();
  });
}

/** Zapíše test důkazů; přechod `vykoupeno → v_repasu` proběhne zároveň. */
export function zapsatTest(vstup: VstupTestu): void {
  zapsatDoklad(vstup, (tx) => {
    tx.insert(schema.dukazyTestu)
      .values({
        id: noveId("tst"),
        kusId: vstup.kusId,
        nazevTestu: vstup.nazevTestu,
        typTestu: vstup.typTestu,
        vysledek: vstup.vysledek,
        nalezenaVada: vstup.nalezenaVada,
        provedenoKdy: vstup.provedenoKdy,
      })
      .run();
  });
}

/**
 * Zapíše odvozený stupeň. Stupeň ani důvod se tu **neodvozí** — příchozí
 * `stupen` a `duvod` jsou hotové rozhodnutí doménové vrstvy.
 *
 * Stávající hodnocení se nepřepisuje: oprava chybného stupně je nový řádek,
 * takže historie zůstává dohledatelná. `UPDATE` nad `condition_grade` je proto
 * v této funkci zakázaná operace.
 */
export function zapsatOhodnoceni(vstup: {
  kusId: ID;
  stupen: StupenStavu;
  duvod: string;
}): ConditionGrade {
  const db = databaze();

  return db.transaction((tx) => {
    const kus = kusVZakluke(tx, vstup.kusId);

    let stav: StavKusu;
    try {
      // Když je kus už `ohodnoceno`, `zmenaStavu` vrátí beze změny — nový
      // záznam tím zůstane dovolený.
      stav = zmenaStavu(kus.stav, "ohodnoceno");
    } catch {
      const zakaz = ZPRAVA_ZAKAZANEHO_NAVRATU[kus.stav];
      throw new ChybaZapisu(zakaz ?? "Stav kusu nedovoluje zapsat hodnocení.");
    }
    if (stav !== kus.stav) {
      tx.update(schema.kusy).set({ stav }).where(eq(schema.kusy.id, kus.id)).run();
    }

    const id = noveId("stn");
    tx.insert(schema.stavyHodnoceni)
      .values({
        id,
        kusId: kus.id,
        stupen: vstup.stupen,
        // Důvod odvození jde do `popis` — hodnocení musí být čitelné bez
        // znalosti pravidel.
        popis: vstup.duvod,
        zhodnocenoKdy: new Date().toISOString(),
      })
      .run();

    return naStav(
      tx.select().from(schema.stavyHodnoceni).where(eq(schema.stavyHodnoceni.id, id)).get()!,
    );
  });
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
