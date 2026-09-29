import type { KategorieTransakce, Penize, Transakce } from "./types";

export interface PrehledFinanc {
  prijmy: Penize;
  vydaje: Penize;
  vysledek: Penize;
  marzeProcenta: number;
  zakladDanoveZakladny: Penize;
  dph: Penize;
  dphProcenta: number;
  podleKategorie: Array<{ kategorie: KategorieTransakce; castka: Penize }>;
  podleMesice: Array<{ mesic: string; prijmy: Penize; vydaje: Penize; vysledek: Penize }>;
}

export const MESICE_CZ = [
  "leden",
  "únor",
  "březen",
  "duben",
  "květen",
  "červen",
  "červenec",
  "srpen",
  "září",
  "říjen",
  "listopad",
  "prosinec",
];

/** Formát `RRRR-MM` používaný jako klíč měsíce. */
export function mesicZDatumu(isoDatum: string): string {
  return isoDatum.slice(0, 7);
}

export function nazevMesice(mesic: string): string {
  const poradi = Number(mesic.slice(5, 7)) - 1;
  return MESICE_CZ[poradi] ?? mesic;
}

/** Výnosy z prodeje za daný měsíc — základ daně jde z obratu, ne z marže. */
export function spocitatZakladDanoveZakladny(transakce: Transakce[]): Penize {
  return transakce
    .filter((transakce) => transakce.typ === "prijem" && transakce.kategorie === "prodej")
    .reduce((soucet, transakce) => soucet + transakce.castka, 0);
}

export function spocitatDph(zakladDanoveZakladny: Penize, dphProcenta: number): Penize {
  return Math.round((zakladDanoveZakladny * dphProcenta) / 100);
}

export function spocitatPrehledFinanc(
  transakce: Transakce[],
  dphProcenta: number,
): PrehledFinanc {
  const prijmy = transakce
    .filter((transakce) => transakce.typ === "prijem")
    .reduce((soucet, transakce) => soucet + transakce.castka, 0);
  const vydaje = transakce
    .filter((transakce) => transakce.typ === "vydaj")
    .reduce((soucet, transakce) => soucet + transakce.castka, 0);
  const vysledek = prijmy - vydaje;

  const zakladDanoveZakladny = spocitatZakladDanoveZakladny(transakce);
  const dph = spocitatDph(zakladDanoveZakladny, dphProcenta);

  const podleKategorie = new Map<KategorieTransakce, Penize>();
  for (const polozka of transakce) {
    podleKategorie.set(
      polozka.kategorie,
      (podleKategorie.get(polozka.kategorie) ?? 0) + polozka.castka,
    );
  }

  const podleMesice = new Map<string, { prijmy: Penize; vydaje: Penize }>();
  for (const polozka of transakce) {
    const mesic = mesicZDatumu(polozka.datum);
    const hodnoty = podleMesice.get(mesic) ?? { prijmy: 0, vydaje: 0 };
    if (polozka.typ === "prijem") {
      hodnoty.prijmy += polozka.castka;
    } else {
      hodnoty.vydaje += polozka.castka;
    }
    podleMesice.set(mesic, hodnoty);
  }

  return {
    prijmy,
    vydaje,
    vysledek,
    marzeProcenta: prijmy === 0 ? 0 : (vysledek / prijmy) * 100,
    zakladDanoveZakladny,
    dph,
    dphProcenta,
    podleKategorie: [...podleKategorie.entries()]
      .map(([kategorie, castka]) => ({ kategorie, castka }))
      .sort((a, b) => b.castka - a.castka),
    podleMesice: [...podleMesice.entries()]
      .map(([mesic, hodnoty]) => ({ mesic, ...hodnoty, vysledek: hodnoty.prijmy - hodnoty.vydaje }))
      .sort((a, b) => a.mesic.localeCompare(b.mesic)),
  };
}

export function filtrovatTransakce(
  transakce: Transakce[],
  kategorie?: KategorieTransakce,
): Transakce[] {
  if (!kategorie) {
    return transakce;
  }
  return transakce.filter((transakce) => transakce.kategorie === kategorie);
}
