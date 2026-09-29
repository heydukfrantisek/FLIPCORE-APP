import { z } from "zod";

import { STAV_KUSU_POPIS } from "./slovnik";
import type {
  RepairTicket,
  StavKusu,
  StupenStavu,
  TestEvidence,
  TypTestu,
  TypZasahu,
  VysledekTestu,
} from "./types";
import { jeDatumVykupuPovolene, jePlatneDatum, prevodCenyNaHalere } from "./vykup";

/**
 * Přechody stavů kusu, odvození stupně A–D z důkazů a validace formulářů zásahu
 * a testu. Modul nesmí importovat databázi ani `server-only` — díky tomu se
 * dá testovat bez serveru a stejná schémata mohou kontrolovat vstup na klientě.
 */

/**
 * Povolené přechody stavů. V I3 obsahuje jen první dva řádky tabulky přechodů
 * z dokumentace 005; `ohodnoceno → vystaveno` doplní až I4 spolu s prodejní
 * cenou.
 *
 * `vystaveno → v_repasu`, `rezervovano → v_repasu` a `prodano → v_repasu`
 * zakázány nejsou jen proto, že je nezapsané — kus, který je vystavený nebo
 * prodaný, se zpět do práce nevrací; jeho oprava je problém pozdější iterace.
 */
export const POVOLENE_PRECHODY: ReadonlyArray<readonly [StavKusu, StavKusu]> = [
  ["vykoupeno", "v_repasu"],
  ["v_repasu", "ohodnoceno"],
];

/** Je přechod `od → na` v I3 povolený? */
export function muzzePrejitStav(od: StavKusu, na: StavKusu): boolean {
  return POVOLENE_PRECHODY.some(([z, cil]) => z === od && cil === na);
}

/**
 * Vrátí nový stav kusu, nebo vyhodí chybu. Nepovolený přechod je chyba, ne
 * tichý průchod — kus, který se vrací z katalogu do repasu, by jinak prošel
 * bez zvěstnosti.
 */
export function zmenaStavu(od: StavKusu, na: StavKusu): StavKusu {
  if (od === na) {
    return od;
  }
  if (!muzzePrejitStav(od, na)) {
    throw new Error(
      `Přechod z ${STAV_KUSU_POPIS[od]} do ${STAV_KUSU_POPIS[na]} není povolený.`,
    );
  }
  return na;
}

/**
 * Odvozený stupeň a důvod, proč vznikl. `duvod` je vyplněný vždy — i když
 * stupeň vznikne — protože jde do `popis` hodnocení a musí být čitelný bez
 * znalosti pravidel. `stupen: null` znamená, že žádný stupeň z důkazů
 * nevyplývá; kus pak zůstává ve stavu `v_repasu`.
 */
export type VysledekOhodnoceni =
  | { stupen: StupenStavu; duvod: string }
  | { stupen: null; duvod: string };

/** Důkazy o stavu kusu: co se s kusem dělalo a jak testy dopadly. */
export interface DokladyKusu {
  zasahy: RepairTicket[];
  testy: TestEvidence[];
}

/**
 * Čas posledního zásahu kusu jako číslo, nebo `undefined`, když kus zásah
 * nemá (pak jsou čerstvé všechny jeho testy).
 */
function posledniZasah(zasahy: RepairTicket[]): number | undefined {
  let nejpovyzsi: number | undefined;
  for (const zasah of zasahy) {
    const cas = Date.parse(zasah.provedenoKdy);
    if (Number.isNaN(cas)) {
      continue;
    }
    if (nejpovyzsi === undefined || cas > nejpovyzsi) {
      nejpovyzsi = cas;
    }
  }
  return nejpovyzsi;
}

/**
 * Testy počítané k poslednímu zásahu. Důkaz starší než poslední zásah se
 * nehodnotí — zásah je záznam, který původní stav přepsal. Test se stejným
 * datem jako zásah už čerstvý je (`>=`), protože vznikl ve stejném okamžiku.
 */
function cerstveTesty(doklady: DokladyKusu): TestEvidence[] {
  const mez = posledniZasah(doklady.zasahy);
  if (mez === undefined) {
    return doklady.testy;
  }
  return doklady.testy.filter((test) => {
    const cas = Date.parse(test.provedenoKdy);
    return !Number.isNaN(cas) && cas >= mez;
  });
}

/**
 * Odvodí stupeň kusu z jeho důkazů podle tabulky pravidel z dokumentu 005.
 *
 * Pravidla jsou zapsaná doslova v pořadí 1–5 a **první splněné vyhrává**.
 * Pořadí není kosmetické: selhání je první, protože se nesmí přebodovat
 * lepším testem, a stupeň `A`/`B` vyžaduje profilový test *a* vizuální
 * kontrolu, takže žádná kombinace důkazů nedá stupeň bez svědectví.
 */
export function odvodStupne(doklady: DokladyKusu): VysledekOhodnoceni {
  const cerstve = cerstveTesty(doklady);
  const selhani = cerstve.find((test) => test.vysledek === "selhal");
  const profilProsel = cerstve.some(
    (test) => test.typTestu === "profil" && test.vysledek === "prosel",
  );

  // Pravidlo 1 — zapsané selhání jakéhokoli typu testu.
  if (selhani) {
    return {
      stupen: "D",
      duvod: `Je zapsáno selhání testu „${selhani.nazevTestu}“, kus tedy nelze uznat za funkční.`,
    };
  }

  // Pravidlo 2 — na kusu se pracovalo, ale nikdo nepotvrdil celý profil.
  if (doklady.zasahy.length > 0 && !profilProsel) {
    return {
      stupen: "C",
      duvod: "Na kusu je zapsán zásah, ale chybí čerstvý profilový test, který by prošel.",
    };
  }

  // Pravidlo 3 — profil prošel a při čerstvé vizuální kontrole byla nalezena vada.
  if (
    profilProsel &&
    cerstve.some((test) => test.typTestu === "vizualni" && test.nalezenaVada)
  ) {
    return {
      stupen: "B",
      duvod: "Profilový test prošel, ale při vizuální kontrole byla nalezena vada.",
    };
  }

  // Pravidlo 4 — profil prošel a žádná čerstvá vizuální kontrola vadu nenašla.
  if (
    profilProsel &&
    cerstve.some((test) => test.typTestu === "vizualni" && !test.nalezenaVada)
  ) {
    return {
      stupen: "A",
      duvod: "Profilový test prošel a vizuální kontrola nenašla žádnou vadu.",
    };
  }

  // Pravidlo 5 — žádný stupeň neplyne, kus zůstává v Repase. Věta říká, co doplnit.
  if (doklady.zasahy.length === 0 && doklady.testy.length === 0) {
    return {
      stupen: null,
      duvod: "Na kusu nejsou žádné důkazy — chybí zásah i testy.",
    };
  }
  if (!profilProsel) {
    return {
      stupen: null,
      duvod: "Chybí čerstvý profilový test s výsledkem „prošel“, bez něj stupeň nelze odvodit.",
    };
  }
  return {
    stupen: null,
    duvod: "Profilový test prošel, ale chybí čerstvá vizuální kontrola, která rozhodne mezi A a B.",
  };
}

/**
 * Horní mez nákladů zásahu: 100 000 Kč. Stejně jako u výkupní ceny — bazarový
 * kus dražší než bazarový kus nepotřebujeme.
 *
 * **Nula je povolená** a znamená „nulové náklady“: čištění, utahování, výměna
 * dílu z vlastní zásoby nebo práce, kterou udělal přímo provozovatel, mají
 * skutečně nulový výdaj. Vynucovat kladnou hodnotu by znamenalo zapisovat
 * umělou částku jen proto, aby prošla validace — v důkazech by pak byl údaj,
 * který ve skutečnosti neplatí. Záporná hodnota a text jsou vždy chyba.
 */
const MAX_NAKLADY_ZASAHU = 10_000_000;

/** Zasah připravený k zápisu do repozitáře. */
export interface ZasahZFormulare {
  typZasahu: TypZasahu;
  popis: string;
  /** `true`, pokud se měnil díl; u `vymena` povinné `true`. */
  nahradniDil: boolean;
  /** Náklady v haléřích. */
  naklady: number;
  /** Datum ve tvaru ISO `RRRR-MM-DD`. */
  provedenoKdy: string;
}

/** Test připravený k zápisu do repozitáře. */
export interface TestZFormulare {
  nazevTestu: string;
  typTestu: TypTestu;
  vysledek: VysledekTestu;
  /** Smysluplné jen u `vizualni`; u ostatních vždy `false`. */
  nalezenaVada: boolean;
  provedenoKdy: string;
}

export const schemaZasahu: z.ZodType<ZasahZFormulare> = z
  .object({
    typZasahu: z.enum(["cisteni", "vymena", "oprava", "testovani"], {
      error: "Vyberte typ zásahu.",
    }),
    popis: z
      .string()
      .trim()
      .min(3, "Napište, co jste na kusu udělali.")
      .max(500, "Popis zásahu je příliš dlouhý."),
    nahradniDil: z.boolean(),
    naklady: z
      .string()
      .min(1, "Zadejte náklady zásahu.")
      .refine((vstup) => prevodCenyNaHalere(vstup) !== null, {
        error: "Zadejte náklady číslem, například 450 nebo 450,50.",
      })
      .refine(
        (vstup) => {
          const halere = prevodCenyNaHalere(vstup);
          return halere !== null && halere >= 0 && halere <= MAX_NAKLADY_ZASAHU;
        },
        { error: "Náklady musí být od 0 do 100 000 Kč." },
      ),
    provedenoKdy: z.string().min(1, "Zadejte datum zásahu."),
  })
  .superRefine((vstup, ctx) => {
    // Výměna bez `nahradniDil` je rozpor: bez vědět, co bylo vyměněno, nelze
    // stupni `C` vysvětlit, co zůstalo původní.
    if (vstup.typZasahu === "vymena" && !vstup.nahradniDil) {
      ctx.addIssue({
        code: "custom",
        path: ["nahradniDil"],
        message: "U výměny je nutné uvést, že se měnil díl.",
      });
    }
  })
  .transform((vstup) => ({ ...vstup, naklady: prevodCenyNaHalere(vstup.naklady)! }));

export const schemaTestu: z.ZodType<TestZFormulare> = z
  .object({
    nazevTestu: z
      .string()
      .trim()
      .min(3, "Zadejte název testu.")
      .max(120, "Název testu je příliš dlouhý."),
    typTestu: z.enum(["profil", "funkcni", "vizualni"], { error: "Vyberte typ testu." }),
    vysledek: z.enum(["prosel", "selhal", "casti"], { error: "Vyberte výsledek testu." }),
    nalezenaVada: z.boolean(),
    provedenoKdy: z.string().min(1, "Zadejte datum testu."),
  })
  .superRefine((vstup, ctx) => {
    // Příznak vady smí patřit jen vizuální kontrole; jinak by tiše měnil stupeň.
    if (vstup.nalezenaVada && vstup.typTestu !== "vizualni") {
      ctx.addIssue({
        code: "custom",
        path: ["nalezenaVada"],
        message: "Zaznamenanou vadu lze uvést jen u vizuální kontroly.",
      });
    }
  });

/** Pole formuláře zásahu, ke kterým se vrací chyba. */
export type PoleFormulareZasahu =
  | "typZasahu"
  | "popis"
  | "nahradniDil"
  | "naklady"
  | "provedenoKdy";

/** Pole formuláře testu, ke kterým se vrací chyba. */
export type PoleFormulareTestu =
  | "nazevTestu"
  | "typTestu"
  | "vysledek"
  | "nalezenaVada"
  | "provedenoKdy";

/** Chyby seskupené podle pole; prázdný objekt znamená, že je vše v pořádku. */
export type ChybyFormulareZasahu = Partial<Record<PoleFormulareZasahu, string>>;
export type ChybyFormulareTestu = Partial<Record<PoleFormulareTestu, string>>;

function retezec(formulare: FormData, klic: string): string {
  const hodnota = formulare.get(klic);
  return typeof hodnota === "string" ? hodnota : "";
}

/**
 * Checkbox z HTML: nepřítomné pole znamená `null`, zapnuté posílá prohlížeč
 * jako `"on"`. Hidden pole se stejným jménem může poslat i `"0"`, proto je
 * bráno jako vypnuté.
 */
function zaskrtnuto(formulare: FormData, klic: string): boolean {
  const hodnota = formulare.get(klic);
  if (hodnota === null) {
    return false;
  }
  return hodnota !== "0" && hodnota !== "false";
}

export interface VysledekValidaceZasahu {
  uspech: boolean;
  /** Hodnoty připravené k zápisu; vyplněné jen při `uspech`. */
  zasah?: ZasahZFormulare;
  /** Chyby pro jednotlivá pole; vyplněné jen při neúspěchu. */
  chyby?: ChybyFormulareZasahu;
  /** Chyba mimo konkrétní pole, například nesrovnalost s katalogem. */
  obecna?: string;
}

export interface VysledekValidaceTestu {
  uspech: boolean;
  /** Hodnoty připravené k zápisu; vyplněné jen při `uspech`. */
  test?: TestZFormulare;
  /** Chyby pro jednotlivá pole; vyplněné jen při neúspěchu. */
  chyby?: ChybyFormulareTestu;
  /** Chyba mimo konkrétní pole, například nesrovnalost s katalogem. */
  obecna?: string;
}

/** `FormData` převede na vstup `schemaZasahu`; hodnoty zůstávají řetězce a flagy booleany. */
function vstupZasahu(formulare: FormData) {
  return {
    typZasahu: retezec(formulare, "typZasahu"),
    popis: retezec(formulare, "popis"),
    nahradniDil: zaskrtnuto(formulare, "nahradniDil"),
    naklady: retezec(formulare, "naklady"),
    provedenoKdy: retezec(formulare, "provedenoKdy"),
  };
}

/** `FormData` převede na vstup `schemaTestu`; hodnoty zůstávají řetězce a flagy booleany. */
function vstupTestu(formulare: FormData) {
  return {
    nazevTestu: retezec(formulare, "nazevTestu"),
    typTestu: retezec(formulare, "typTestu"),
    vysledek: retezec(formulare, "vysledek"),
    nalezenaVada: zaskrtnuto(formulare, "nalezenaVada"),
    provedenoKdy: retezec(formulare, "provedenoKdy"),
  };
}

/** Chybu přiřadí k poli podle cesty, kterou ukázal Zod. */
function poleZCesty(cesta: PropertyKey[]): PoleFormulareZasahu | PoleFormulareTestu {
  const prvni = cesta[0];
  switch (prvni) {
    case "typZasahu":
    case "popis":
    case "nahradniDil":
    case "naklady":
    case "provedenoKdy":
    case "nazevTestu":
    case "typTestu":
    case "vysledek":
    case "nalezenaVada":
      return prvni;
    default:
      return "popis";
  }
}

/**
 * Ověří formulář zásahu a připraví hodnoty k zápisu. Datum se porovnává k
 * `dnes`, což je parametr kvůli testům — v aplikaci se používá aktuální den.
 * `kusId` se z formuláře nečte: pochází z adresy detailu kusu.
 */
export function validujZasah(
  formulare: FormData,
  dnes: Date = new Date(),
): VysledekValidaceZasahu {
  const overeni = schemaZasahu.safeParse(vstupZasahu(formulare));

  if (!overeni.success) {
    const chyby: ChybyFormulareZasahu = {};
    for (const chyba of overeni.error.issues) {
      const pole = poleZCesty(chyba.path) as PoleFormulareZasahu;
      // První chyba pole stačí; další by v UI jen zdvojovaly hlášku.
      if (!chyby[pole]) {
        chyby[pole] = chyba.message;
      }
    }
    return { uspech: false, chyby };
  }

  if (!jePlatneDatum(overeni.data.provedenoKdy)) {
    return {
      uspech: false,
      chyby: { provedenoKdy: "Zadejte skutečné datum ve tvaru RRRR-MM-DD." },
    };
  }

  if (!jeDatumVykupuPovolene(overeni.data.provedenoKdy, dnes)) {
    return { uspech: false, chyby: { provedenoKdy: "Datum zásahu nesmí být v budoucnu." } };
  }

  return { uspech: true, zasah: overeni.data };
}

/**
 * Ověří formulář testu a připraví hodnoty k zápisu. `dnes` je parametr kvůli
 * testům, stejně jako u výkupu. `kusId` se z formuláře nečte.
 */
export function validujTest(
  formulare: FormData,
  dnes: Date = new Date(),
): VysledekValidaceTestu {
  const overeni = schemaTestu.safeParse(vstupTestu(formulare));

  if (!overeni.success) {
    const chyby: ChybyFormulareTestu = {};
    for (const chyba of overeni.error.issues) {
      const pole = poleZCesty(chyba.path) as PoleFormulareTestu;
      // První chyba pole stačí; další by v UI jen zdvojovaly hlášku.
      if (!chyby[pole]) {
        chyby[pole] = chyba.message;
      }
    }
    return { uspech: false, chyby };
  }

  if (!jePlatneDatum(overeni.data.provedenoKdy)) {
    return {
      uspech: false,
      chyby: { provedenoKdy: "Zadejte skutečné datum ve tvaru RRRR-MM-DD." },
    };
  }

  if (!jeDatumVykupuPovolene(overeni.data.provedenoKdy, dnes)) {
    return { uspech: false, chyby: { provedenoKdy: "Datum testu nesmí být v budoucnu." } };
  }

  return { uspech: true, test: overeni.data };
}
