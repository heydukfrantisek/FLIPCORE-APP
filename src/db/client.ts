import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "./schema";

/**
 * Cesta k souboru databáze. Výchozí hodnota je lokální SQLite soubor, který se
 * necommituje. Přechod na Postgres v budoucnu znamená vyměnit tento klient;
 * dotazy v `src/server/repo/` zůstanou stejné.
 */
const cesta = process.env.DATABASE_URL ?? "./data/flipcore.db";

function pripojit() {
  if (cesta !== ":memory:") {
    // SQLite neumí vytvořit adresář, musíme ho založit před prvním spojením.
    mkdirSync(dirname(cesta), { recursive: true });
  }

  const raw = new Database(cesta);
  // WAL umožňuje číst během zápisu, cizí klíče brání souběžnému zápisu dvou procesů.
  raw.pragma("journal_mode = WAL");
  raw.pragma("foreign_keys = ON");
  return raw;
}

function vytvoritDb() {
  const db = drizzle(pripojit(), { schema });
  migrate(db, { migrationsFolder: join(process.cwd(), "drizzle") });
  return db;
}

export type Databaze = ReturnType<typeof vytvoritDb>;

let sdruzeny: Databaze | undefined;

/** Připojení se sdružuje do jedné instance, aby se otevřelo jednou na proces. */
export function databaze(): Databaze {
  sdruzeny ??= vytvoritDb();
  return sdruzeny;
}

export { schema };
