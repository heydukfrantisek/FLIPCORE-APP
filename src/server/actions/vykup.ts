"use server";

import { revalidatePath } from "next/cache";

import { ChybaZapisu, zalozitVykup } from "@/server/repo";
import { validujVykup, type ChybyFormulare } from "@/lib/domain/vykup";

/**
 * Stav, který serverová akce vrací do formuláře. Chyby jsou návratová hodnota,
 * ne vyhozená výjimka — rozbitý formulář nesmí shodit celou stránku.
 */
export interface StavFormulareVykupu {
  uspech?: { kusId: string };
  chyby?: ChybyFormulare;
  /** Chyba mimo konkrétní pole, například rozpor s katalogem. */
  obecna?: string;
}

/**
 * Zapíše výkup bazarového kusu. Nový kus vzniká ve stavu `vykoupeno` — bez
 * prodejní ceny a bez hodnocení; ta se doplňuje až při repasi.
 *
 * Formulář se validuje znovu tady na serveru. Klientská validace je pohodlí,
 * ne záruka: serverová akce je veřejná a může se volat i mimo formulář.
 */
export async function zapsatVykup(
  _predchozi: StavFormulareVykupu,
  formulare: FormData,
): Promise<StavFormulareVykupu> {
  const vysledek = validujVykup(formulare);

  if (!vysledek.uspech || !vysledek.vykup) {
    return { chyby: vysledek.chyby };
  }

  try {
    const kus = zalozitVykup(vysledek.vykup);

    // Sklad i nástěnka ukazují investovanou hodnotu, která se zápisem mění.
    revalidatePath("/sklad");
    revalidatePath("/nastenka");

    return { uspech: { kusId: kus.id } };
  } catch (chyba) {
    // Jen rozpor s daty má text určený provozovateli. Selhání databáze se do UI
    // nepropaguje, protože jeho zpráva může obsahovat detaily o instalaci.
    if (chyba instanceof ChybaZapisu) {
      return { obecna: chyba.message };
    }
    return { obecna: "Výkup se nepodařilo uložit. Zkuste to prosím znovu." };
  }
}
