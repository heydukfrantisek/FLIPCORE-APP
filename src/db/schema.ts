import { relations, type InferSelectModel } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Peněžní hodnoty jsou celé haléře. Zobrazování do korun řeší výhradně
 * `src/lib/format.ts`; do databáze se nikdy nezapisuje float.
 */
const halere = (nazev: string) => integer(nazev);

export const komponenty = sqliteTable("component", {
  id: text("id").primaryKey(),
  kategorie: text("kategorie").notNull(),
  vyrobce: text("vyrobce").notNull(),
  model: text("model").notNull(),
  /** Parametry komponenty uložené jako JSON, tvar určuje `Component` v `types.ts`. */
  specifikace: text("specifikace", { mode: "json" }).notNull(),
});

export const prodejci = sqliteTable("seller", {
  id: text("id").primaryKey(),
  nazev: text("nazev").notNull(),
  typ: text("typ").notNull(),
});

export const kusy = sqliteTable(
  "kus",
  {
    id: text("id").primaryKey(),
    componentId: text("component_id")
      .notNull()
      .references(() => komponenty.id),
    prodejceId: text("seller_id")
      .notNull()
      .references(() => prodejci.id),
    stav: text("stav").notNull(),
    nakupniCena: halere("nakupni_cena").notNull(),
    /** `NULL`, dokud kus není vystaven — marži nelze spočítat z kusu bez prodejní ceny. */
    prodejniCena: halere("prodejni_cena"),
    datumVykupu: text("datum_vykupu").notNull(),
    vytvorenoKdy: text("vytvoreno_kdy").notNull(),
  },
  (tabulka) => [
    index("kus_stav_idx").on(tabulka.stav),
    index("kus_component_idx").on(tabulka.componentId),
    index("kus_seller_idx").on(tabulka.prodejceId),
  ],
);

/**
 * Vazba 1:N, aby šlo hodnocení v průběhu času revidovat a neztratit historii.
 * Aktuální stupeň kusu je hodnocení s nejpozdějším `zhodnoceno_kdy`.
 */
export const stavyHodnoceni = sqliteTable(
  "condition_grade",
  {
    id: text("id").primaryKey(),
    kusId: text("kus_id")
      .notNull()
      .references(() => kusy.id),
    stupen: text("stupen").notNull(),
    popis: text("popis").notNull(),
    zhodnocenoKdy: text("zhodnoceno_kdy").notNull(),
  },
  (tabulka) => [index("condition_grade_kus_idx").on(tabulka.kusId)],
);

export const zasahy = sqliteTable(
  "repair_ticket",
  {
    id: text("id").primaryKey(),
    kusId: text("kus_id")
      .notNull()
      .references(() => kusy.id),
    typZasahu: text("typ_zasahu").notNull(),
    popis: text("popis").notNull(),
    /**
     * `true`, pokud se měnil díl. U `typ_zasahu: "vymena"` je povinné `true` —
     * bez toho stupni `C` nelze vysvětlit, co bylo vyměněno a co zůstalo původní.
     */
    nahradniDil: integer("nahradni_dil", { mode: "boolean" })
      .notNull()
      .default(false),
    naklady: halere("naklady").notNull(),
    provedenoKdy: text("provedeno_kdy").notNull(),
  },
  (tabulka) => [index("repair_ticket_kus_idx").on(tabulka.kusId)],
);

export const dukazyTestu = sqliteTable(
  "test_evidence",
  {
    id: text("id").primaryKey(),
    kusId: text("kus_id")
      .notNull()
      .references(() => kusy.id),
    nazevTestu: text("nazev_testu").notNull(),
    /**
     * Co test dokazuje: `"profil"` (celý výkonový profil), `"funkcni"` (rozsah
     * dovolený zásahem) nebo `"vizualni"` (vizuální kontrola). Bez typu nelze
     * stupeň odvodit — z „prošel“ u libovolného testu by nevadilo, co bylo ověřeno.
     */
    typTestu: text("typ_testu")
      .notNull()
      .default("profil"),
    vysledek: text("vysledek").notNull(),
    /** Zaznamenané zjištění při vizuální kontrole; jen u typu `vizualni`, u ostatních vždy `false`. */
    nalezenaVada: integer("nalezena_vada", { mode: "boolean" })
      .notNull()
      .default(false),
    provedenoKdy: text("provedeno_kdy").notNull(),
  },
  (tabulka) => [index("test_evidence_kus_idx").on(tabulka.kusId)],
);

export const sestavy = sqliteTable("build", {
  id: text("id").primaryKey(),
  nazev: text("nazev").notNull(),
  kategorie: text("kategorie").notNull(),
  popis: text("popis").notNull(),
});

export const polozkySestav = sqliteTable(
  "build_item",
  {
    id: text("id").primaryKey(),
    sestavaId: text("build_id")
      .notNull()
      .references(() => sestavy.id),
    pozice: text("pozice").notNull(),
    nazev: text("nazev").notNull(),
    /** `NULL`, pokud sestava stojí na katalogové komponentě, ne na skutečném kusu. */
    kusId: text("kus_id").references(() => kusy.id),
    cenaSnapshot: halere("cena_snapshot").notNull(),
  },
  (tabulka) => [index("build_item_build_idx").on(tabulka.sestavaId)],
);

export const transakce = sqliteTable("transakce", {
  id: text("id").primaryKey(),
  typ: text("typ").notNull(),
  kategorie: text("kategorie").notNull(),
  popis: text("popis").notNull(),
  castka: halere("castka").notNull(),
  /** Datum ve tvaru ISO `RRRR-MM-DD`. */
  datum: text("datum").notNull(),
});

/**
 * Nastavení držíme v jednom řádku, jehož ID je konstantní, aby se nemuselo
 * řešit upsert nad jiným klíčem.
 */
export const NASTAVENI_ID = "nastaveni";
export const nastaveni = sqliteTable("nastaveni", {
  id: text("id").primaryKey(),
  nazevObchodu: text("nazev_obchodu").notNull(),
  mena: text("mena").notNull(),
  rozpoctyKategorii: text("rozpocty_kategorii", { mode: "json" }).notNull(),
  dphProcenta: integer("dph_procenta").notNull(),
  skladovaRezerva: integer("skladova_rezerva").notNull(),
});

export const komponentyRelace = relations(komponenty, ({ many }) => ({
  kusy: many(kusy),
}));

export const prodejciRelace = relations(prodejci, ({ many }) => ({
  kusy: many(kusy),
}));

export const kusyRelace = relations(kusy, ({ one, many }) => ({
  komponenta: one(komponenty, { fields: [kusy.componentId], references: [komponenty.id] }),
  prodejce: one(prodejci, { fields: [kusy.prodejceId], references: [prodejci.id] }),
  hodnoceni: many(stavyHodnoceni),
  zasahy: many(zasahy),
  testy: many(dukazyTestu),
}));

export const stavyHodnoceniRelace = relations(stavyHodnoceni, ({ one }) => ({
  kus: one(kusy, { fields: [stavyHodnoceni.kusId], references: [kusy.id] }),
}));

export const zasahyRelace = relations(zasahy, ({ one }) => ({
  kus: one(kusy, { fields: [zasahy.kusId], references: [kusy.id] }),
}));

export const dukazyTestuRelace = relations(dukazyTestu, ({ one }) => ({
  kus: one(kusy, { fields: [dukazyTestu.kusId], references: [kusy.id] }),
}));

export const sestavyRelace = relations(sestavy, ({ many }) => ({
  polozky: many(polozkySestav),
}));

export const polozkySestavRelace = relations(polozkySestav, ({ one }) => ({
  sestava: one(sestavy, { fields: [polozkySestav.sestavaId], references: [sestavy.id] }),
  kus: one(kusy, { fields: [polozkySestav.kusId], references: [kusy.id] }),
}));

export const transakceRelace = relations(transakce, () => ({}));

export const nastaveniRelace = relations(nastaveni, () => ({}));

export type KomponentaRow = InferSelectModel<typeof komponenty>;
export type KusRow = InferSelectModel<typeof kusy>;
export type StavHodnoceniRow = InferSelectModel<typeof stavyHodnoceni>;
export type SestavaRow = InferSelectModel<typeof sestavy>;
export type PolozkaSestavyRow = InferSelectModel<typeof polozkySestav>;
export type TransakceRow = InferSelectModel<typeof transakce>;
export type NastaveniRow = InferSelectModel<typeof nastaveni>;
