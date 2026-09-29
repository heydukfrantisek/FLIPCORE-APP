/**
 * Naplnění databáze ukázkovými daty. Spouští se výhradně ručně přes
 * `pnpm db:seed`; aplikace nikdy seed nevolá a databáze startuje prázdná.
 */
import { createHash } from "node:crypto";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "./schema";
import {
  KOMPONENTY,
  KUSY,
  NASTAVENI,
  PRODEJCI,
  SESTAVY,
  STAVY,
  TESTY,
  TRANSAKCE,
  ZASAHY,
  type SeedHodnoceni,
} from "./seed-data";

const cesta = process.env.DATABASE_URL ?? "./data/flipcore.db";

/**
 * Každý běh seedu dostane svou vlastní hodnotu ID, aby se při opakovaném
 * spuštění neopakovaly cizí klíče. Bez toho by druhý běh spadl na PK.
 */
function idPro(prefix: string, klic: string): string {
  const zkratka = createHash("sha1").update(klic).digest("hex").slice(0, 8);
  return `${prefix}_${zkratka}`;
}

function vymazat(db: ReturnType<typeof drizzle<typeof schema>>) {
  db.delete(schema.polozkySestav).run();
  db.delete(schema.sestavy).run();
  db.delete(schema.dukazyTestu).run();
  db.delete(schema.zasahy).run();
  db.delete(schema.stavyHodnoceni).run();
  db.delete(schema.kusy).run();
  db.delete(schema.komponenty).run();
  db.delete(schema.prodejci).run();
  db.delete(schema.transakce).run();
  db.delete(schema.nastaveni).run();
}

/**
 * Seed přebíjí migrace, protože starý soubor by obsahoval data ve starším
 * schématu, která by po přidání sloupců zůstala v databázi napůl.
 */
function vypustitSoubor() {
  if (cesta === ":memory:") {
    return;
  }
  for (const pripona of ["", "-shm", "-wal"]) {
    rmSync(`${cesta}${pripona}`, { force: true });
  }
}

function main() {
  vypustitSoubor();
  // SQLite adresář nevytvoří, musíme ho založit před otevřením souboru.
  mkdirSync(dirname(cesta), { recursive: true });

  const raw = new Database(cesta);
  raw.pragma("journal_mode = WAL");
  raw.pragma("foreign_keys = ON");

  const db = drizzle(raw, { schema });
  migrate(db, { migrationsFolder: join(process.cwd(), "drizzle") });
  vymazat(db);

  db.insert(schema.komponenty)
    .values(
      KOMPONENTY.map((komponenta) => ({
        id: komponenta.id,
        kategorie: komponenta.kategorie,
        vyrobce: komponenta.vyrobce,
        model: komponenta.model,
        specifikace: komponenta.specifikace,
      })),
    )
    .run();

  db.insert(schema.prodejci)
    .values(
      PRODEJCI.map((prodejce) => ({
        id: prodejce.id,
        nazev: prodejce.nazev,
        typ: prodejce.typ,
      })),
    )
    .run();

  // Hodnocení se generuje z kusů: jedno hodnocení může patřit více kusům,
  // protože vazba je 1:N a stupeň se k kusu váže až v okamžiku ohodnocení.
  const hodnoceni = new Map<string, SeedHodnoceni>();
  for (const kus of KUSY) {
    for (const id of kus.hodnoceni) {
      const zdroj = STAVY.find((stav) => stav.id === id);
      if (!zdroj) {
        throw new Error(`Seed odkazuje na neexistující hodnocení ${id} (kus ${kus.id}).`);
      }
      hodnoceni.set(id, zdroj);
    }
  }

  db.insert(schema.kusy)
    .values(
      KUSY.map((kus) => ({
        id: kus.id,
        componentId: kus.componentId,
        prodejceId: kus.prodejceId,
        stav: kus.stav,
        nakupniCena: kus.nakupniCena,
        prodejniCena: kus.prodejniCena,
        datumVykupu: kus.datumVykupu,
        vytvorenoKdy: kus.vytvorenoKdy,
      })),
    )
    .run();

  // Hodnocení přijde až za kusy, na které cizím klíč odkazuje.
  db.insert(schema.stavyHodnoceni)
    .values(
      KUSY.flatMap((kus) =>
        kus.hodnoceni.map((id) => {
          const zdroj = hodnoceni.get(id)!;
          return {
            // ID musí být unikátní na dvojici kus–hodnocení: tentýž text hodnocení
            // může být přiřazen více kusům, protože vazba je 1:N.
            id: idPro("grd", `${kus.id}:${id}`),
            kusId: kus.id,
            stupen: zdroj.stupen,
            popis: zdroj.popis,
            zhodnocenoKdy: zdroj.zhodnocenoKdy,
          };
        }),
      ),
    )
    .run();

  db.insert(schema.zasahy)
    .values(
      ZASAHY.map((zasah) => ({
        id: idPro("zas", zasah.id),
        kusId: zasah.kusId,
        typZasahu: zasah.typZasahu,
        popis: zasah.popis,
        nahradniDil: zasah.nahradniDil,
        naklady: zasah.naklady,
        provedenoKdy: zasah.provedenoKdy,
      })),
    )
    .run();

  db.insert(schema.dukazyTestu)
    .values(
      TESTY.map((test) => ({
        id: idPro("tst", test.id),
        kusId: test.kusId,
        nazevTestu: test.nazevTestu,
        typTestu: test.typTestu,
        vysledek: test.vysledek,
        nalezenaVada: test.nalezenaVada,
        provedenoKdy: test.provedenoKdy,
      })),
    )
    .run();

  db.insert(schema.sestavy)
    .values(
      SESTAVY.map((sestava) => ({
        id: sestava.id,
        nazev: sestava.nazev,
        kategorie: sestava.kategorie,
        popis: sestava.popis,
      })),
    )
    .run();

  db.insert(schema.polozkySestav)
    .values(
      SESTAVY.flatMap((sestava) =>
        sestava.polozky.map((polozka) => ({
          id: polozka.id,
          sestavaId: sestava.id,
          pozice: polozka.pozice,
          nazev: polozka.nazev,
          kusId: polozka.kusId,
          cenaSnapshot: polozka.cenaSnapshot,
        })),
      ),
    )
    .run();

  db.insert(schema.transakce)
    .values(
      TRANSAKCE.map((transakce) => ({
        id: idPro("trx", transakce.id),
        typ: transakce.typ,
        kategorie: transakce.kategorie,
        popis: transakce.popis,
        castka: transakce.castka,
        datum: transakce.datum,
      })),
    )
    .run();

  db.insert(schema.nastaveni)
    .values({
      id: schema.NASTAVENI_ID,
      nazevObchodu: NASTAVENI.nazevObchodu,
      mena: NASTAVENI.mena,
      rozpoctyKategorii: NASTAVENI.rozpoctyKategorii,
      dphProcenta: NASTAVENI.dphProcenta,
      skladovaRezerva: NASTAVENI.skladovaRezerva,
    })
    .run();

  console.log(
    `Seed hotov: ${KUSY.length} kusů, ${KOMPONENTY.length} komponent, ` +
      `${ZASAHY.length} zásahů, ${TESTY.length} testů, ${SESTAVY.length} sestav, ` +
      `${TRANSAKCE.length} transakcí.`,
  );
}

main();
