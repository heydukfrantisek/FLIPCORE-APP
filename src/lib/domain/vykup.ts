import { z } from "zod";

/**
 * Validace formuláře evidence výkupu a převod jeho hodnot na doménové typy.
 * Modul nesmí importovat databázi ani `server-only` — díky tomu se dá testovat
 * bez serveru a stejná schémata mohou kontrolovat vstup na klientě.
 */

/** Horní mez výkupní ceny: 100 000 Kč. Bazarový kus za milion nemá smysl. */
const MAX_VYKUPNI_CENA = 10_000_000;

/**
 * Celá část čísla, která smí mít oddělovače tisíců: `1600` nebo `1.600`.
 * Oddělovačem tisíců může být mezera (zruší se ní) nebo tečka, ale tečka musí
 * stát vždy po třech číslicích — jinak by to byla desetinná část.
 */
function jeCelaCast(text: string): boolean {
  const skupiny = text.split(".");
  if (skupiny.length === 1) {
    return /^\d+$/.test(skupiny[0]);
  }
  return /^\d{1,3}$/.test(skupiny[0]) && skupiny.slice(1).every((s) => /^\d{3}$/.test(s));
}

/**
 * Vrátí cenu v haléřích, nebo `null`, pokud vstup není číslo.
 *
 * Desetinnou část určuje počet číslic za oddělovačem: jedna až dvě jsou setiny,
 * tři a více jsou tisíce. Čárka je v českém zápisu vždy desetinná, tečka je
 * dvojznačná — podle toho, kolik číslic za ní následuje. Tím projde `1 600,50`,
 * `1600,50` i `1.600`, ale `12,345` je chyba, protože česká čárka nemůže být
 * oddělovačem tisíců.
 *
 * Záporná čísla a text nejsou ceny; nulu posoudí až schéma.
 */
export function prevodCenyNaHalere(vstup: string): number | null {
  const text = vstup.replace(/\s/g, "");

  const cisloCarkou = text.indexOf(",");
  if (cisloCarkou !== -1) {
    // Čárek smí být jen jedna a za ní jedna až dvě číslice.
    if (text.indexOf(",", cisloCarkou + 1) !== -1) {
      return null;
    }
    const cela = text.slice(0, cisloCarkou);
    const setiny = text.slice(cisloCarkou + 1);
    if (!/^\d{1,2}$/.test(setiny) || !jeCelaCast(cela)) {
      return null;
    }
    return Number(cela.replace(/\./g, "")) * 100 + Number(setiny) * 10 ** (2 - setiny.length);
  }

  const skupiny = text.split(".");
  if (skupiny.length === 1) {
    return /^\d+$/.test(text) ? Number(text) * 100 : null;
  }

  // Jediná tečka za jednou až dvěma číslicemi je desetinná část.
  if (skupiny.length === 2 && /^\d{1,2}$/.test(skupiny[1]) && /^\d+$/.test(skupiny[0])) {
    return Number(skupiny[0]) * 100 + Number(skupiny[1]) * 10 ** (2 - skupiny[1].length);
  }

  // Jinak jsou všechny tečky oddělovače tisíců.
  if (jeCelaCast(text)) {
    return Number(skupiny.join("")) * 100;
  }

  return null;
}

/** Datum ve tvaru `RRRR-MM-DD`, které skutečně existuje. */
function jePlatneDatum(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return false;
  }
  const [rok, mesic, den] = iso.split("-").map(Number);
  const datum = new Date(Date.UTC(rok, mesic - 1, den));
  return (
    datum.getUTCFullYear() === rok &&
    datum.getUTCMonth() === mesic - 1 &&
    datum.getUTCDate() === den
  );
}

/** Datum výkupu nesmí být v budoucnu. `dnes` je parametr, aby šel testovat. */
export function jeDatumVykupuPovolene(iso: string, dnes: Date): boolean {
  if (!jePlatneDatum(iso)) {
    return false;
  }
  // ISO datum jde porovnat jako řetězec, čas se na rozhodnutí nepodílí.
  return iso <= dnes.toISOString().slice(0, 10);
}

/** Hodnota, kterou ve výběru prodejce znamená „založit nového prodejce". */
export const NOVYY_PRODEJCE = "__novy__";

const schemaProdejce = z.discriminatedUnion("rezimProdejce", [
  z.object({
    rezimProdejce: z.literal("existujici"),
    prodejceId: z.string().min(1, "Vyberte prodejce."),
  }),
  z.object({
    rezimProdejce: z.literal("novy"),
    nazevProdejce: z
      .string()
      .trim()
      .min(2, "Zadejte název prodejce.")
      .max(120, "Název je příliš dlouhý."),
    typProdejce: z.enum(["bazar", "firma", "jednotlivec"], {
      error: "Vyberte typ prodejce.",
    }),
  }),
]);

export const schemaVykupu = z.object({
  componentId: z.string().min(1, "Vyberte typ komponenty."),
  prodejce: schemaProdejce,
  nakupniCena: z
    .string()
    .min(1, "Zadejte výkupní cenu.")
    .refine((vstup) => prevodCenyNaHalere(vstup) !== null, {
      error: "Zadejte cenu číslem, například 1600 nebo 1600,50.",
    })
    .refine(
      (vstup) => {
        const halere = prevodCenyNaHalere(vstup);
        return halere !== null && halere > 0 && halere <= MAX_VYKUPNI_CENA;
      },
      { error: "Cena musí být větší než nula a nejvýše 100 000 Kč." },
    ),
  datumVykupu: z.string().min(1, "Zadejte datum výkupu."),
});

/** Pole formuláře, ke kterým se vrací chyba. */
export type PoleFormulare = "componentId" | "nakupniCena" | "datumVykupu" | "prodejce";

/** Zparsovaný formulář s cenou už v haléřích. */
export interface VykupZFormulare {
  componentId: string;
  prodejce:
    | { rezim: "existujici"; prodejceId: string }
    | { rezim: "novy"; nazev: string; typ: "bazar" | "firma" | "jednotlivec" };
  nakupniCena: number;
  datumVykupu: string;
}

/** Chyby formuláře seskupené podle pole; prázdný objekt znamená, že je vše v pořádku. */
export type ChybyFormulare = Partial<Record<PoleFormulare, string>>;

function retezec(formulare: FormData, klic: string): string {
  const hodnota = formulare.get(klic);
  return typeof hodnota === "string" ? hodnota : "";
}

/**
 `FormData` převede na objekt vhodný pro `schemaVykupu`. Hodnoty zůstávají
 řetězce — čísla vznikají až po validaci, aby chybný vstup neskončil tichým `NaN`.
 */
export function prevodFormulareNaVstup(formulare: FormData) {
  const prodejceId = retezec(formulare, "prodejceId");

  return {
    componentId: retezec(formulare, "componentId"),
    prodejce:
      prodejceId === NOVYY_PRODEJCE
        ? {
            rezimProdejce: "novy" as const,
            nazevProdejce: retezec(formulare, "nazevProdejce"),
            typProdejce: retezec(formulare, "typProdejce"),
          }
        : {
            rezimProdejce: "existujici" as const,
            prodejceId,
          },
    nakupniCena: retezec(formulare, "nakupniCena"),
    datumVykupu: retezec(formulare, "datumVykupu"),
  };
}

/** Chybu přiřadí k poli podle cesty, kterou ukázal Zod. */
function poleZCesty(cesta: PropertyKey[]): PoleFormulare {
  const prvni = cesta[0];
  if (prvni === "prodejce" || prvni === "prodejceId" || prvni === "nazevProdejce") {
    return "prodejce";
  }
  if (prvni === "componentId" || prvni === "nakupniCena" || prvni === "datumVykupu") {
    return prvni;
  }
  return "componentId";
}

export interface VysledekValidace {
  uspech: boolean;
  /** Hodnoty připravené k zápisu; vyplněné jen při `uspech`. */
  vykup?: VykupZFormulare;
  /** Chyby pro jednotlivá pole; vyplněné jen při neúspěchu. */
  chyby?: ChybyFormulare;
  /** Chyba mimo konkrétní pole, například nesrovnalost s katalogem. */
  obecna?: string;
}

/**
 * Ověří formulář a připraví hodnoty k zápisu. Datum se porovnává k `dnes`,
 * což je parametr kvůli testům — v aplikaci se používá aktuální den.
 */
export function validujVykup(formulare: FormData, dnes: Date = new Date()): VysledekValidace {
  const vstup = prevodFormulareNaVstup(formulare);
  const overeni = schemaVykupu.safeParse(vstup);

  if (!overeni.success) {
    const chyby: ChybyFormulare = {};
    for (const chyba of overeni.error.issues) {
      const pole = poleZCesty(chyba.path);
      // První chyba pole stačí; další by v UI jen zdvojovaly hlášku.
      if (!chyby[pole]) {
        chyby[pole] = chyba.message;
      }
    }
    return { uspech: false, chyby };
  }

  if (!jeDatumVykupuPovolene(overeni.data.datumVykupu, dnes)) {
    return {
      uspech: false,
      chyby: { datumVykupu: "Datum výkupu nesmí být v budoucnu." },
    };
  }

  const prodejce =
    overeni.data.prodejce.rezimProdejce === "novy"
      ? {
          rezim: "novy" as const,
          nazev: overeni.data.prodejce.nazevProdejce.trim(),
          typ: overeni.data.prodejce.typProdejce,
        }
      : { rezim: "existujici" as const, prodejceId: overeni.data.prodejce.prodejceId };

  return {
    uspech: true,
    vykup: {
      componentId: overeni.data.componentId,
      prodejce,
      nakupniCena: prevodCenyNaHalere(overeni.data.nakupniCena)!,
      datumVykupu: overeni.data.datumVykupu,
    },
  };
}
