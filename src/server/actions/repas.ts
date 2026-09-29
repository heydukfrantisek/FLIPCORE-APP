"use server";

import { revalidatePath } from "next/cache";

import { STAV_KUSU_POPIS } from "@/lib/domain/slovnik";
import { odvodStupne, validujTest, validujZasah } from "@/lib/domain/repas";
import type { ChybyFormulareTestu, ChybyFormulareZasahu } from "@/lib/domain/repas";
import type { StavKusu, StupenStavu } from "@/lib/domain/types";
import {
  ChybaZapisu,
  getKusZDetailem,
  zapsatOhodnoceni,
  zapsatTest as zapsatTestDoRepo,
  zapsatZasah as zapsatZasahDoRepo,
} from "@/server/repo";

/**
 * Zápis důkazů a odvozeného stupně z Repasu. Akce jsou ve stylu
 * `src/server/actions/vykup.ts`: chyby jsou návratová hodnota, ne vyhozená
 * výjimka, a rozbitý formulář nesmí shodit celou stránku.
 *
 * `kusId` je **první parametr** právě proto, že se pak akce dá svázat
 * přes `.bind(null, kusId)` v klientské komponentě s `useActionState` a
 * neposílat se z klienta v `FormData` — pochází z parametrů routy.
 *
 * DLUH — autorizace: v této iteraci je aplikace jednoprovazorová, takže
 * relace se nekontroluje (viz oddíl „Bezpečnost a soukromí“ v dokumentu 005).
 * Každá z těchto akcí musí při zavedení přihlášení **začít** kontrolou
 * relace a ověřením role — stejně jako to musí udělat i ostatní akce.
 */

/** Stav, který `zapsatZasah` vrací do formuláře zásahu. */
export interface StavFormulareZasahu {
  /** Vyplněné jen při úspěchu; obsahuje ID kusu, ke kterému zásah patří. */
  uspech?: { kusId: string };
  chyby?: ChybyFormulareZasahu;
  /** Chyba mimo konkrétní pole, například rozpor se stavem kusu. */
  obecna?: string;
}

/** Stav, který `zapsatTest` vrací do formuláře testu. */
export interface StavFormulareTestu {
  /** Vyplněné jen při úspěchu; obsahuje ID kusu, ke kterému test patří. */
  uspech?: { kusId: string };
  chyby?: ChybyFormulareTestu;
  /** Chyba mimo konkrétní pole, například rozpor se stavem kusu. */
  obecna?: string;
}

/** Stav, který `ohodnotitKus` vrací k potvrzení stupně. */
export interface StavFormulareOhodnoceni {
  /** Vyplněné jen při úspěchu; obsahuje odvozený stupeň, ne volbu uživatele. */
  uspech?: { stupen: StupenStavu };
  /**
   * Věta, co s kusem udělat dál — typicky „zatím chybí čerstvá vizuální
   * kontrola“. Kus v takovém případě zůstává v repase.
   */
  obecna?: string;
}

/** Vyčistí všechna místa, kde se projeví nový důkaz na kusu. */
function vycistitCesty(kusId: string): void {
  revalidatePath("/sklad");
  revalidatePath(`/sklad/${kusId}`);
  // Nástěnka zobrazuje poslední zásahy a přehled skladu.
  revalidatePath("/nastenka");
}

/**
 * Zapíše zásah na kus. První zásah převede kus z `vykoupeno` do `v_repasu` —
 * ten přechod dělá repozitář v téže transakci jako zápis.
 *
 * Formulář se validuje znovu tady na serveru: klientská validace je pohodlí,
 * ne záruka, protože serverová akce je veřejná a může se volat i mimo formulář.
 */
export async function zapsatZasah(
  kusId: string,
  _predchozi: StavFormulareZasahu,
  formulare: FormData,
): Promise<StavFormulareZasahu> {
  const vysledek = validujZasah(formulare);

  if (!vysledek.uspech || !vysledek.zasah) {
    // Neúspěch nic nevyčistí — data se nezměnila, není co překreslovat.
    return { chyby: vysledek.chyby };
  }

  try {
    zapsatZasahDoRepo({ kusId, ...vysledek.zasah });
    vycistitCesty(kusId);
    // Repozitář vrací `void` a ID zásahu nedává — vracíme proto ID kusu,
    // pod kterým se kus překreslil.
    return { uspech: { kusId } };
  } catch (chyba) {
    // Jen rozpor se stavem kusu má text určený provozovateli. Selhání databáze
    // se do UI nepropaguje, protože jeho zpráva může obsahovat detaily
    // o instalaci.
    if (chyba instanceof ChybaZapisu) {
      return { obecna: chyba.message };
    }
    return { obecna: "Zásah se nepodařilo uložit. Zkuste to prosím znovu." };
  }
}

/**
 * Zapíše test jako důkaz o stavu kusu. První test převede kus z `vykoupeno`
 * do `v_repasu` právě tak jako první zásah.
 */
export async function zapsatTest(
  kusId: string,
  _predchozi: StavFormulareTestu,
  formulare: FormData,
): Promise<StavFormulareTestu> {
  const vysledek = validujTest(formulare);

  if (!vysledek.uspech || !vysledek.test) {
    return { chyby: vysledek.chyby };
  }

  try {
    zapsatTestDoRepo({ kusId, ...vysledek.test });
    vycistitCesty(kusId);
    return { uspech: { kusId } };
  } catch (chyba) {
    if (chyba instanceof ChybaZapisu) {
      return { obecna: chyba.message };
    }
    return { obecna: "Test se nepodařilo uložit. Zkuste to prosím znovu." };
  }
}

/** Stavy, ve kterých kus z katalogu zpět do repasi neputřebuje chodit. */
const ZAKAZ_OHODNOCENI: Partial<Record<StavKusu, string>> = {
  vystaveno: "Kus už je vystavený, zpět do Repasu se nevrací.",
  rezervovano: `Kus už je ve stavu ${STAV_KUSU_POPIS.rezervovano}, zpět do Repasu se nevrací.`,
  prodano: `Kus už je ve stavu ${STAV_KUSU_POPIS.prodano}, zpět do Repasu se nevrací.`,
};

/**
 * Odvodí stupeň z důkazů na kusu a zapíše ho.
 *
 * **`formulare` se tu k ničemu nepoužije.** Stupeň se nikdy nečte z
 * `FormData` — klientem poslaná hodnota by byla jen návrh, který by šel
 * podvrhnout, a stupeň je výstup pravidel, ne volba provozovatele. Klient
 * posílá prázdný `FormData`, protože `useActionState` vyžaduje třetí parametr.
 */
export async function ohodnotitKus(
  kusId: string,
  _predchozi: StavFormulareOhodnoceni,
  _formulare: FormData,
): Promise<StavFormulareOhodnoceni> {
  // Oba parametry musí ve signatuře zůstat — `useActionState` a `.bind` mají
  // pevný tvar — ale k ničemu se tady nepoužijí.
  void _predchozi;
  void _formulare;

  const detail = getKusZDetailem(kusId);
  if (!detail) {
    return { obecna: "Kus neexistuje." };
  }

  const zakaz = ZAKAZ_OHODNOCENI[detail.kus.stav];
  if (zakaz) {
    return { obecna: zakaz };
  }

  if (detail.kus.stav === "vykoupeno") {
    // Kus bez jediného důkazu nemá co ohodnotit; bez zásahu či testu by stupeň
    // stejně nevznikl a věta z `odvodStupne` by jen opakovala, že chybí důkazy.
    return {
      obecna: "Nejdřív na kus zapiš zásah nebo test, teprve potom ho lze ohodnotit.",
    };
  }

  // Pravidla zůstávají v doménové vrstvě — tady se jen předávají důkazy,
  // které už repozitář načetl; podruhé se z databáze nic nečte.
  const odvozeni = odvodStupne({ zasahy: detail.zasahy, testy: detail.testy });

  if (odvozeni.stupen === null) {
    // Bez stupně se nezapisuje nic: kus zůstává v repase a UI ukáže důvod.
    return { obecna: odvozeni.duvod };
  }

  try {
    zapsatOhodnoceni({ kusId, stupen: odvozeni.stupen, duvod: odvozeni.duvod });
    vycistitCesty(kusId);
    return { uspech: { stupen: odvozeni.stupen } };
  } catch (chyba) {
    if (chyba instanceof ChybaZapisu) {
      return { obecna: chyba.message };
    }
    return { obecna: "Ohodnocení se nepodařilo uložit. Zkuste to prosím znovu." };
  }
}
