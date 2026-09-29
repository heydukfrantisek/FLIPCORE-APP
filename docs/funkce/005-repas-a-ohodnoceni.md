# 005: Repas a ohodnocení

| Položka         | Hodnota                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status          | `Implementováno`                                                                                                                                    |
| Vlastník        | FLIPCORE                                                                                                                                            |
| Datum           | 2026-09-29                                                                                                                                          |
| Oblast          | repas, zápis dat                                                                                                                                  |
| Navazující dokl. | [001 — Repas a stavové hodnocení](001-repas-a-stavove-hodnoceni.md), [004 — Evidence výkupu](004-evidence-vykupu.md), [ADR 005 — Stupeň se odvozuje z důkazů](../adr/005-stupen-se-odvoduje-z-dukazu.md), [architektura](../architektura.md#datový-model), [ROADMAP](../../ROADMAP.md) |

> Dokument popisuje implementovanou funkci I3. Popisuje, jak se stupeň A–D
> **odvozuje z důkazů**, jak se mění stav kusu a co UI ukazuje. Definice polí
> entit nejsou zde — jsou v [architektuře](../architektura.md#datový-model), sem
> patří jen to, co se mění. Nevratné rozhodnutí „stupeň se nevolí" má vlastní
> [ADR 005](../adr/005-stupen-se-odvoduje-z-dukazu.md).

## Zadání a cíl

Umožnit provozovateli zapsat zásah na kus, zapsat výsledek testu a nechat
aplikaci **odvodit** stavové hodnocení kusu ze zapsaných důkazů.

[001](001-repas-a-stavove-hodnoceni.md) dává škálu A–D a pravidla, ale ne
algoritmus. Tento dokument rozhoduje, jak se ze seznamu zásahů a testů stupeň
vypočítá, aby dvě implementace nevznikly různými způsoby.

Rozsah: přechody stavů kusu, zápis zásahu, zápis testu, odvození stupně,
zápis hodnocení, detail kusu s historií zásahů a důkazů, legenda A–D.

Mimo rozsah: vystavení kusu do katalogu a prodejní cena (I4), veřejný katalog,
přílohy důkazů a naměřené hodnoty (viz [Známé omezení](#známé-omezení)),
workflow zásahu, autorizace.

## Návrh odvození stupně

### Rozhodnutí 1 — stupeň se odvozuje, ne volí

Specifikace 001 dává škálu a pravidla, ale nealgoritmus. Rozhodnutí:

Stupeň se odvozuje z důkazů, které se počítají **od posledního zásahu**. Důkazy
starší než poslední zásah se nehodnotí: zásah je sám o sobě záznam, který
původní stav přepsal, a hodnocení platí ke konkrétnímu okamžiku, ne ke kusu
obecně. Test se stejným datem jako zásah (`>=`) se už počítá jako čerstvý.

Definice „čerstvého důkazu", kterou implementace použije:

- `posledniZasah` = nejpozdější `provedenoKdy` mezi zásahy kusu. Kus bez zásahu
  nemá `posledniZasah` a **všechny jeho testy jsou čerstvé**.
- Test je čerstvý, pokud `Date.parse(test.provedenoKdy) >= Date.parse(posledniZasah)`.
- Zásahy se jako čerstvé/steré neposuzují — pravidlo 2 pracuje s tím, že zásah na
  kusu existuje vůbec.

Přesné pořadí pravidel. **První splněné vyhrává**, pořadí se nesmí prohodit a
pravidlo se nesmí přeskáčnout. Pravidla se aplikují jen na čerstvé důkazy.

| # | Podmínka na čerstvé důkazy | Výsledný stupeň |
| - | ------------------------ | -------------- |
| 1 | Existuje test s `vysledek: "selhal"` (libovolného typu) | `D` |
| 2 | Existuje zásah na kusu a **ne** existuje test `typTestu: "profil"` s `vysledek: "prosel"` | `C` |
| 3 | Existuje test `profil` + `prosel` a existuje test `vizualni` s `nalezenaVada: true` | `B` |
| 4 | Existuje test `profil` + `prosel` a existuje test `vizualni` s `nalezenaVada: false` | `A` |
| 5 | Jinak | žádný stupeň |

Toto pořadí přímo realizuje dvě pravidla z 001:

- **Pravidlo 5** — dílčí selhání testu není možné „přebodovat" na lepší stupeň
  kombinací s jiným testem. Proto je selhání (pravidlo 1) první a nelze se k němu
  vrátit později: profilový test prošel, ale funkční selhal, výsledek je `D`.
- **Pravidlo 1** — každý stupeň vyžaduje důkaz. `A` a `B` vyžadují profilový test
  **a** vizuální kontrolu, `C` vyžaduje zásah, `D` vyžaduje zápis o selhání.
  Žádná kombinace důkazů nevede ke stupni, který by jej neměl.

Výsledek 5 není chyba ani odhad: kus **zůstává ve stavu `v_repasu`** a UI musí
říct, co chybí. Odvození vrací vždy i `duvod` — i když stupeň vznikne — a UI ho
ukazuje pod hodnotou stupně.

Kdy přesně stupeň nevznikne: **jen u kusu bez zásahu a bez čerstvého profilového
průchodu.** U kusu, na kterém je zásah, pravidlo 2 odvodí nejméně stupeň `C`, i
kdyby všechny starší testy padly mimo poslední zásah. Kus bez zásahu musí mít
čerstvý profilový test s výsledkem `prosel`, jinak spadne na pravidlo 5; má-li ho,
rozhoduje čerstvá vizuální kontrola (`B` při nalezené vadě, `A` bez vady).

Toto rozhodnutí má vlastní [ADR 005](../adr/005-stupen-se-odvoduje-z-dukazu.md).

`VysledekTestu` má hodnotu `casti` (částečně). Ta **nespouští pravidlo 1** —
částečný průchod není selhání. Zároveň `casti` není `prosel`, takže profilový
test s výsledkem `casti` stupeň `A` ani `B` neudělí (spadne na pravidlo 2 nebo 5).

### Rozhodnutí 2 — typy testů

Aby se stupeň dal vůbec odvodit, musí být zřejmé, **co** test dokazuje. Zavedeme
tři typy:

| Typ        | Co dokazuje                                                              | Může vést k |
| ---------- | ------------------------------------------------------------------------ | ----------- |
| `profil`   | Funkční test celého výkonového profilu komponenty                         | `A`, `B`    |
| `funkcni`  | Funkční test v rozsahu, který dovolil zásah                               | `C`         |
| `vizualni` | Vizuální kontrola; nese příznak `nalezenaVada` (ano/ne) — tedy **měření**, ne úsudek | `B` (při `true`), `A` (při `false`) |

`nalezenaVada` je jediný způsob, jak se kosmetická vada dostane do logiky. Není
to posouzení provozovatele („vypadá to dobře"), je to zaznamenané zjištění, zda
při vizuální kontrole byla vada nalezena.

`nalezenaVada` je smysluplné jen u typu `vizualni`; u `profil` a `funkcni` je
vždy `false`. Aplikace to musí **vynutit** (Zod `superRefine`), ne spoléhat na to,
že to provozovatel nezadá.

### Rozhodnutí 3 — zásah nese informaci o výměně

`RepairTicket` získá příznak `nahradniDil: boolean`. Pravidlo 4 z 001 požaduje,
aby u stupně `C` bylo vidět, **co** bylo vyměněno a **co** zůstalo původní.
`nahradniDil` tuto informaci nese.

Bez `nahradniDil` stupně `C` nelze přiřadit: `nahradniDil: false` u typu zásahu
`vymena` je rozpor, který validace odmítne. Viz
[Vývojářské poznámky](#vývojářské-poznámky).

### Rozhodnutí 4 — škála je jednotná

Škála A–D je jednotná pro všechny kategorie komponent, výjimky se nezavádějí.
Důvod: výjimky by vyžadovaly definovat požadované testy pro každou kategorii
zvlášť, a to je práce, která se musí odložit, dokud nevznikne reálný seznam
testů z provozu. Vymýšlení požadovaných důkazů pro každou kategorii by bylo
odhadnutí, ne evidence — a škála by pak nebyla doložitelná.

Důsledek pro budoucí iterace: seznam povinných testů pro konkrétní kategorii se
může doplnit, ale nesmí se přidat jako výjimka ze škály. Viz
[Následné kroky](#následné-kroky).

## Uživatelský příběh

Jako `provozovatel FLIPCORE` chci `zapsat, co jsem na kus udělal a jak testy
dopadly`, abych `měl stav kusu doložený místo odhadovaného`.

## Uživatelská rozhodnutí v této iteraci

Tato rozhodnutí jsou **hotová**, ne chybějící. Otevřené otázky jsou uvedené
v [Známé omezení](#známé-omezení) a [Následné kroky](#následné-kroky).

- **Nejnovější hodnocení.** Vazba kus → hodnocení je 1:N. Aktuální stupeň je
  hodnocení s nejpozdějším `zhodnocenoKdy`; historie zůstává dohledatelná.
  Oprava chybně uděleného stupně je **nový záznam**, starý se nepřepisuje
  (scénář 7 z 001).
- **Přechody stavů.** `vykoupeno → v_repasu` (první zásah nebo test),
  `v_repasu → ohodnoceno` (zápis odvozeného stupně), `ohodnoceno → vystaveno`
  až v I4. Logika přechodů je čistá funkce v `src/lib/domain/repas.ts`, **ne** v
  repo vrstvě. Nepovolený přechod musí vyhodit chybu, ne tiše projít.
- **Kus ve stavu `vystaveno` se nesmí dostat zpět do repasu.** Je prodávaný;
  oprava takového kusu je problém I4/I5, ne I3.
- **Chybějící důkaz = žádný stupeň, nikoli odhad.** UI musí vysvětlit, co chybí,
  a nechat kus ve stavu `v_repasu`.
- **Autorita (rozhodnutí 5).** Hodnocení uděluje **provozovatel FLIPCORE**.
  Kupující ho může zpochybnit až s veřejným katalogem, kde bude hodnocení
  veřejné a dohledatelné. Autorizace je v této iteraci stále žádná
  (jednoprovzorová aplikace) — je to dluh, který se musí vyřešit při zavedení
  přihlášení; kam se má podívat, je v
  [Bezpečnost a soukromí](#bezpečnost-a-soukromí).

### Rozhodnutí, která vznikla až při implementaci

Tato část zachycuje věci, které nebyly v návrhu rozhodnuty a které se ukázaly
teprve při psaní kódu a testů. Jsou stejně závazné jako výšejší.

- **Nulové náklady na zásah jsou povolené.** Rozsah je 0 až 100 000 Kč, záporná
  hodnota i text jsou chyba. Nula znamená „nulové náklady" — čištění, utahování,
  výměna dílu z vlastní zásoby nebo práce, kterou udělal přímo provozovatel, mají
  skutečně nulový výdaj. Vynucovat kladnou hodnotu by znamenalo zapisovat umělou
  částku jen proto, aby prošla validací, a v důkazech by pak byl údaj, který ve
  skutečnosti neplatí. Oproti výkupní ceně (kde je nula chyba, protože kus musí
  stát něco) je to vědomá odlišnost.
- **Důkaz lze zapsat i na kus ve stavu `ohodnoceno` a stav se tím nemění.** Kus
  může být ohodnocen a pak se na něm znovu pracuje; důkaz přijde, přechodu stavu
  se tím nevznikne. Zápis na kus ve stavu `vystaveno`, `rezervovano` nebo
  `prodano` je zakázán.
- **`zapsatOhodnoceni` na kus ve stavu `vykoupeno` skončí chybou** s větou, že
  nejdřív musí být zapsán zásah nebo test. Je to kontrola na úrovni serverové
  akce, ne skrytí tlačítka: kus bez jediného důkazu nemá co ohodnotit a věta
  z `odvodStupne` by jen opakovala, že chybí důkazy.
- **Úspěch zásahu i testu vrací `kusId`, ne ID záznamu.** Repozitář vrací `void`
  a ID zásahu ani testu nedává — UI ho nepotřebuje, potřebuje jen vědět, pod jakým
  kusem se stránka překreslila. Úspěch ohodnocení vrací `{ stupen }`, protože ten
  se v UI zobrazuje.
- **Prázdné důkazy znamenají kus bez jakéhokoli stupně.** `odvodStupne` vrací
  `duvod` říkající, že chybí zásah i testy; tlačítko potvrzení je neaktivní a
  žádný záznam do historie hodnocení nevznikne. Kus zůstává `vykoupeno`, dokud
  se na něm něco neudělá.


## Scénáře

| # | Jako kdo     | Situace                                                     | Očekávaný výsledek |
| - | ------------ | ----------------------------------------------------------- | ------------------- |
| 1 | Provozovatel | Na kusu ve stavu `vykoupeno` zapíše první zásah              | Kus přejde do `v_repasu`, zásah je v historii, aktuální stupeň je stále žádný |
| 2 | Provozovatel | Zapíše profilový test, který prošel, a vizuální kontrolu bez vady | Odvozený stupeň `A`, UI ukáže i důvod odvození |
| 3 | Provozovatel | Totéž, ale vizuální kontrola nalezla vadu                    | Odvozený stupeň `B` |
| 4 | Provozovatel | Zapíše zásah s `nahradniDil` a funkční test, který prošel jen v ověřeném rozsahu | Odvozený stupeň `C`, u něj je vidět, co bylo vyměněno |
| 5 | Provozovatel | Jakýkoli test skončí `selhal`                                 | Odvozený stupeň `D`, i kdyby profilový test prošel |
| 6 | Provozovatel | Zkusí potvrdit stupeň, ale žádný důkaz neodpovídá             | Stupeň se neuloží, UI vysvětlí, co chybí, kus zůstává `v_repasu` |
| 7 | Provozovatel | Po zásahu najde starý profilový test, který prošel před zásahem | Starý test se nehodnotí, takže `A` ani `B` nevznikne. Protože ale na kusu zásah je, pravidlo 2 odvodí nejméně stupeň `C`; `duvod` říká, že chybí čerstvý profilový test |
| 8 | Provozovatel | U testu `funkcni` zaškrtne „nalezena vada"                    | Formulář to odmítne, test se neuloží |
| 9 | Provozovatel | U zásahu typu `vymena` nezaškrtne `nahradniDil`               | Formulář to odmítne, zásah se neuloží |
| 10 | Provozovatel | Odmítne potvrdit stupeň na kusu, který je už `ohodnoceno`  | Serverová akce skončí chybou, kus se nezmění |
| 11 | Provozovatel | Otevře detail kusu, který ještě nemá žádný zásah ani test   | Prázdný stav s výzvou k zápisu, bez stupně |
| 12 | Provozovatel | Zapíše zásah s nulovými náklady                               | Zásah se uloží, náklady budou `0 Kč`; záporné náklady formulář odmítne |
| 13 | Provozovatel | Zapíše další důkaz na kus, který je už `ohodnoceno`          | Důkaz se uloží, kus zůstává `ohodnoceno` |
| 14 | Provozovatel | Chce ohodnotit kus ve stavu `vykoupeno`, na kterém nic není   | Serverová akce odmítne a vysvětlí, že nejdřív musí být zásah nebo test |
| 15 | Provozovatel | Otevře detail kusu, na kterém žádný důkaz neodpovídá pravidlům | Tlačítko potvrzení je neaktivní, UI vysvětlí, co doplnit, kus zůstává `v_repasu` |
| 16 | Provozovatel | Otevře detail kusu ve stavu `vystaveno`                       | Formuláře se nezobrazí, zobrazí se věta, že kus je vystavený a zpět do Repasu se nevrací |

## Přechody stavů kusu

Povolené přechody. Cokoliv jiného je chyba — `zmenaStavu` vyhodí výjimku,
nikoli tichý průchod.

| Z             | Na            | Kdy                         | Implementace |
| ------------- | ------------- | --------------------------- | ----------- |
| `vykoupeno`   | `v_repasu`    | První zásah nebo první test na kusu | I3, ano |
| `v_repasu`    | `ohodnoceno`  | Zápis odvozeného stupně A–D | I3, ano |
| `ohodnoceno`  | `vystaveno`   | Vystavení s prodejní cenou   | I4 — v I3 **nesmí** být v `POVOLENE_PRECHODY` |
| `vystaveno`   | `v_repasu`    | —                           | **Zakázáno**; prodávaný kus se neopravuje zpět |
| `rezervovano`  | `v_repasu`    | —                           | Zakázáno |
| `prodano`     | `v_repasu`    | —                           | Zakázáno |

Další přechody životního cyklu (`vystaveno → rezervovano → prodano`) nejsou
předmětem I3 a v tomto dokumentu se neřeší.

## Datový dopad

Konceptuální entity jsou v [architektuře](../architektura.md#datový-model);
zde je jen to, co se mění.

- Nové entity: žádné. `ConditionGrade`, `RepairTicket` a `TestEvidence` už
  existují v [datovém modelu](../architektura.md#datový-model) i ve schématu.
- Změny existujících entit:
  - `TestEvidence` získá `typTestu` (enum `profil` / `funkcni` / `vizualni`) a
    `nalezenaVada` (boolean) — rozhodnutí 2.
  - `RepairTicket` získá `nahradniDil` (boolean) — rozhodnutí 3.
  - `StavKusu` a `VysledekTestu` se **nemění**.
  - `ConditionGrade` se nemění: `popis` nese `duvod` z odvození.
- Migrace: `drizzle/0001_repas-dukazy.sql` — přidání `typ_testu` a `nalezena_vada` do
  `test_evidence` a `nahradni_dil` do `repair_ticket`. Nové sloupce jsou
  `NOT NULL` s výchozí hodnotou, aby se daly doplnit i na existujících řádcích.
  `typ_testu` přibývá s výchozí hodnotou `'profil'`, `nalezena_vada` a
  `nahradni_dil` s výchozí hodnotou `false`. Migrace má přesně pět příkazů:
  - `ALTER TABLE test_evidence ADD typ_testu text DEFAULT 'profil' NOT NULL;`
  - `ALTER TABLE test_evidence ADD nalezena_vada integer DEFAULT false NOT NULL;`
  - `CREATE INDEX test_evidence_kus_idx ON test_evidence (kus_id);`
  - `ALTER TABLE repair_ticket ADD nahradni_dil integer DEFAULT false NOT NULL;`
  - `CREATE INDEX repair_ticket_kus_idx ON repair_ticket (kus_id);`
- **Oprava indexů:** `test_evidence` a `repair_ticket` dnes nemají index na
  `kus_id` (mají prázdné pole indexů), takže dotaz na důkazy jednoho kusu jde
  přes celou tabulku. Migrace přidává `index("test_evidence_kus_idx").on(kus_id)`
  a `index("repair_ticket_kus_idx").on(kus_id)` ve stejném souboru. Je to dnes
  nevšimnutý bug, tady se opravuje, protože právě teď se podle `kus_id` poprvé
  filtruje.
- Vazba kus → hodnocení zůstává 1:N, historie se nepřepisuje.

## API/změny v kódu

Kontrakt, který implementace musí mít. Cesty a názvy jsou závazné, aby
souběžně psané části (doména, repo, UI) na sebe navazovaly.

### `src/lib/domain/types.ts`

```ts
export type TypTestu = "profil" | "funkcni" | "vizualni";

export interface TestEvidence {
  // existující pole zůstávají
  typTestu: TypTestu;
  /** Smysluplné jen u `vizualni`; u ostatních vždy `false`. */
  nalezenaVada: boolean;
}

export interface RepairTicket {
  // existující pole zůstávají
  /** `true`, pokud se měnil díl. U `typZasahu: "vymena"` povinné `true`. */
  nahradniDil: boolean;
}
```

`StavKusu`, `VysledekTestu` a `ConditionGrade` se nemění.

### `src/lib/domain/repas.ts` (nový)

Čistý modul **bez importu databáze** a bez `server-only` — stejně jako
`src/lib/domain/vykup.ts`, aby šel testovat bez serveru.

```ts
/** Povolené přechody stavů. V I3 obsahuje jen první dva řádky tabulky přechodů. */
export const POVOLENE_PRECHODY: ReadonlyArray<readonly [StavKusu, StavKusu]>;

export function muzzePrejitStav(od: StavKusu, na: StavKusu): boolean;
export function zmenaStavu(od: StavKusu, na: StavKusu): StavKusu; // throw na nepovolený

export type VysledekOhodnoceni =
  | { stupen: StupenStavu; duvod: string }
  | { stupen: null; duvod: string };

export interface DokladyKusu {
  zasahy: RepairTicket[];
  testy: TestEvidence[];
}

export function odvodStupne(doklady: DokladyKusu): VysledekOhodnoceni;
```

- `duvod` je vyplněný vždy, i když stupeň vznikne, a jde do `popis` hodnocení.
- `odvodStupne` implementuje tabulku pravidel z
  [Návrh odvození stupně](#návrh-odvození-stupně) doslova, v uvedeném pořadí.
  Neexistuje žádná výjimka, která by pravidla mohla přeskočit.
- Validační část ve stylu `src/lib/domain/vykup.ts`:

```ts
export const schemaZasahu: z.ZodType<ZasahZFormulare>;
export const schemaTestu: z.ZodType<TestZFormulare>;
export function validujZasah(formulare: FormData, dnes?: Date): VysledekValidaceZasahu;
export function validujTest(formulare: FormData, dnes?: Date): VysledekValidaceTestu;

export interface VysledekValidaceZasahu {
  uspech: boolean;
  zasah?: ZasahZFormulare;
  chyby?: ChybyFormulareZasahu;
  obecna?: string;
}
```

  `VysledekValidaceTestu` má stejný tvar s `test` místo `zasah`. Obě mají
  `uspech` / `chyby` / `obecna`; **první chyba pole vyhrává** (další by v UI jen
  zdvojovaly hlášku), stejně jako ve `vykup.ts`. `schemaTestu` používá
  `superRefine` pro vynucení `nalezenaVada` mimo typ `vizualni`.
  `kusId` se ve formuláři neposílá — pochází z adresy detailu kusu.

### `src/db/schema.ts`

- `test_evidence`: přidat `typTestu: text("typ_testu").notNull()` a
  `nalezenaVada: integer("nalezena_vada", { mode: "boolean" }).notNull()`.
- `repair_ticket`: přidat `nahradniDil: integer("nahradni_dil", { mode: "boolean" }).notNull()`.
- Obě tabulky: doplnit prázdné pole indexů o `index(...).on(tabulka.kusId)`.
- Nová migrace v `drizzle/`.
- `naTest()` a `naZasah()` v repozitáři se rozšíří o nová pole — jinak by
  `getTesty()` a `getZasahy()` vracely objekty, které nesedí s doménovými typy.

### `src/server/repo/index.ts`

```ts
export interface KusZRepasem {
  kus: Kus;
  component: Component;
  prodejce: Seller;
  /** Nejnovější hodnocení; `undefined`, dokud stupeň nebyl odvozen a zapsán. */
  stupen: ConditionGrade | undefined;
  /** Sestupně podle `provedenoKdy`. */
  zasahy: RepairTicket[];
  /** Sestupně podle `provedenoKdy`. */
  testy: TestEvidence[];
  /** Sestupně podle `zhodnocenoKdy`, včetně toho v poli `stupen`. */
  historieHodnoceni: ConditionGrade[];
  /** Odvození z aktuálních důkazů, i když zatím nic nebylo zapsáno. */
  odvozeni: VysledekOhodnoceni;
}

export function getKusZDetailem(id: ID): KusZRepasem | undefined;

/** ID kusu generuje server. */
export interface VstupZasahu {
  kusId: ID;
  typZasahu: TypZasahu;
  popis: string;
  nahradniDil: boolean;
  /** Náklady v haléřích. */
  naklady: number;
  provedenoKdy: string;
}

/** ID kusu generuje server. */
export interface VstupTestu {
  kusId: ID;
  nazevTestu: string;
  typTestu: TypTestu;
  vysledek: VysledekTestu;
  nalezenaVada: boolean;
  provedenoKdy: string;
}

export function zapsatZasah(vstup: VstupZasahu): void;
export function zapsatTest(vstup: VstupTestu): void;
export function zapsatOhodnoceni(vstup: {
  kusId: ID;
  stupen: StupenStavu;
  duvod: string;
}): ConditionGrade;
```

- `zasahy` a `testy` jsou sestupně podle `provedenoKdy` (při shodě rozhoduje vyšší
  ID), `historieHodnoceni` sestupně podle `zhodnocenoKdy` a obsahuje i záznam
  v poli `stupen`. `odvozeni` je výsledek `odvodStupne` nad právě načtenými
  `zasahy` a `testy` — i když na kusu zatím nic není.
- `zapsatZasah` a `zapsatTest` převezmou kus do `v_repasu` (je-li ve stavu
  `vykoupeno`) a zápis samotný provedou v téže transakci, jinak by zásah existoval
  bez změny stavu. Kus ve stavu `vystaveno`, `rezervovano` nebo `prodano` je
  odmítnut; kus ve stavu `ohodnoceno` důkaz přijme a stav se nemění.
- `zapsatOhodnoceni` ověří přechod stavem, přepíše `v_repasu` na `ohodnoceno`
  (u `ohodnoceno` jde o no-op) a vloží nový řádek hodnocení. **Stávající hodnocení
  se nepřepíše**, jen vznikne nový. `duvod` z odvození jde do `popis`.
- Stupeň se v repovrstvě **neodvozuje** ani nepočítá. Repozitář přijímá hotový
  `stupen` + `duvod` z doménové vrstvy a zapisuje je. `getKusZDetailem` naopak
  volá `odvodStupne` z domény, aby nevznikla druhá implementace pravidel.
- Chyby nesrovnalosti (neexistující kus, nedovolený přechod, zásah na kusu ve
  stavu `vystaveno`) se vyhazují jako `ChybaZapisu` — stejně jako v I2.
- `getKus()` zůstává a `getKusy()` se nemění; seznam skladu pracuje dál přes
  `KusZDetailem`.

### `src/server/actions/repas.ts` (nový)

Serverové akce ve stylu `src/server/actions/vykup.ts` — `ChybyFormulare` se
vrací jako návratová hodnota, ne vyhozená výjimka. `kusId` je u všech tří akcí
**první parametr**, aby se daly svázat přes `.bind(null, kusId)` v klientské
komponentě s `useActionState` a aby se ID kusu **neposílalo z klienta v
`FormData`** — pochází z parametrů routy.

```ts
export interface StavFormulareZasahu {
  uspech?: { kusId: string };
  chyby?: ChybyFormulareZasahu;
  obecna?: string;
}

export interface StavFormulareTestu {
  uspech?: { kusId: string };
  chyby?: ChybyFormulareTestu;
  obecna?: string;
}

export interface StavFormulareOhodnoceni {
  uspech?: { stupen: StupenStavu };
  obecna?: string;
}

export async function zapsatZasah(
  kusId: string,
  _predchozi: StavFormulareZasahu,
  formulare: FormData,
): Promise<StavFormulareZasahu>;

export async function zapsatTest(
  kusId: string,
  _predchozi: StavFormulareTestu,
  formulare: FormData,
): Promise<StavFormulareTestu>;

export async function ohodnotitKus(
  kusId: string,
  _predchozi: StavFormulareOhodnoceni,
  _formulare: FormData,
): Promise<StavFormulareOhodnoceni>;
```

Proč jsou stavová rozhraní taková, jaká jsou:

- Zápis zásahu a zápis testu vrací `uspech: { kusId }`. Repozitář vrací `void` a ID
  záznamu nedává; UI ID zásahu nepotřebuje, potřebuje vědět, **pod jakým kusem** se
  stránka překreslila.
- Ohodnocení vrací `uspech: { stupen }`, protože stupeň se v UI zobrazuje — a je to
  stupeň **odvozený na serveru**, ne hodnota poslaná klientem.
- `ohodnotitKus` má `_formulare`, které se k ničemu nepoužije. `useActionState` a
  `.bind` mají pevný tvar, takže parametr ve signatuře zůstane, ale hodnota se
  zahazuje (`void _formulare`).

Chování akcí:

- `zapsatZasah` a `zapsatTest` validují `FormData` znovu na serveru a po zápisu
  volají `revalidatePath` na `/sklad`, `/sklad/[id]` a `/nastenka` (nástěnka
  zobrazuje poslední zásahy a přehled skladu). Při neúspěchu se nic nevyčistí,
  protože data se nezměnila.
- `ohodnotitKus` volá `odvodStupne` nad důkazy načtenými v repozitáři a zapisuje
  výsledek. Pokud vyjde `stupen: null`, **nezapisuje nic** a vrací `obecna` s
  `duvod`. Kus ve stavu `vykoupeno` odmítne ještě před odvozením; kusy
  `vystaveno` / `rezervovano` / `prodano` jsou odmítnuty s větou, že se zpět do
  Repasu nevrací.
- Akce **nečtou `stupen` z `FormData`**. Pokud by ve formuláři byl, musí být
  ignorován — klientem poslaný stupeň je jen návrh, který jde podvrhnout.
- Očekávané chyby (`ChybaZapisu`) se propuknou do `obecna` s textem pro
  provozovatele; neočekávané chyby databáze se do UI nepropagují, aby neprozradily
  detaily o instalaci.

Soubory UI, které vznikly:

- `src/app/(app)/sklad/[id]/page.tsx` — serverová komponenta, detail kusu.
  `params` se v Next 16 předává jako promise, takže se `await`-uje; neexistující
  kus končí `notFound()`.
- `src/components/formular-zasahu.tsx`, `src/components/formular-testu.tsx` a
  `src/components/formular-ohodnoceni.tsx` — klientské komponenty s
  `useActionState` ve stylu `formular-vykupu.tsx`, s `kusId` svázaným přes
  `.bind(null, kusId)`.
- Odkaz na detail kusu ze seznamu `/sklad` v `src/components/filtr-skladu.tsx` —
  `next/link` na `/sklad/[id]`.
- Legenda A–D se skládá z `STUPEN_POPIS` v `src/lib/domain/slovnik.ts`, ne z
  slovníku v komponentě. Vedle písmene je vždy i textová popiska, protože samotné
  písmeno ani barva stupeň nevysvětlí.
- `src/components/formular-ohodnoceni.tsx` obsahuje žádný vstup pro stupeň. Pole
  pro výběr tu není a být nesmí; tlačítko je neaktivní, dokud z důkazů stupeň
  neplyne.

## UI

Detail kusu na `/sklad/[id]`. Sekce na stránce:

1. **Identifikace kusu** — komponenta (výrobce, model, kategorie), prodejce, stav
   životního cyklu, výkupní cena.
2. **Stavové hodnocení** — odvozený stupeň velkým písmenem, vedle něj **důvod
   odvození**. Když stupeň vznikl, zobrazí se i odkaz na záznam v historii
   hodnocení a datum posledního testu. Když nevznikl, místo stupně je věta
   s `duvod` a výzvou, co doplnit.
3. **Důkazy** — tabulka testů: název, typ testu, výsledek, `nalezenaVada`
   (zobrazí se jen u typu `vizualni`), datum. Nové testy přidává formulář.
4. **Historie zásahů** — tabulka zásahů: typ, popis, zda se měnil díl, náklady,
   datum. Nové zásahy přidává formulář.
5. **Historie hodnocení** — všechna hodnocení kusu, nejnovější nahoře. Slouží ke
   zjištění, že starý stupeň zůstal dohledatelný.
6. **Legenda A–D** — z `STUPEN_POPIS`, včetně věty, že stupeň se odvozuje
   z důkazů a nedá se zvolit.

Formuláře:

| Formulář   | Pole                                                                 | Poznámka |
| ---------- | -------------------------------------------------------------------- | -------- |
| Zásah      | typ zásahu, popis, `nahradniDil` (jen u `vymena`), náklady, datum      | Náklady se ukládají v haléřích, zadávají v korunách jako ve výkupu; povoleno je 0 až 100 000 Kč |
| Test       | název testu, typ testu, výsledek, `nalezenaVada` (jen u `vizualni`), datum | Pole `nalezenaVada` se zobrazí až po výběru typu `vizualni`; u ostatních typů je ve formuláři vůbec |

**Formulář neobsahuje pole pro stupeň.** Ani jeden. Stupeň je výstup odvození.

Stavy obrazovky:

- **Prázdný stav** — kus bez zásahů a testů: výzva k zápisu prvního zásahu,
  stupeň se nezobrazuje vůbec.
- **Kus bez stupně** — důkazy jsou, ale stupeň nevyšel: zobrazí se `duvod`.
- **Kus ve stavu `vystaveno`** — formuláře zásahu a testu se nezobrazují,
  zobrazí se věta, že kus je vystavený a zpět do repasu se nevrací.
- **Chyba uložení** — `ChybaZapisu` se propukne jako `obecna` u formuláře,
  stránka nespadne.
- **Neexistující kus** — `notFound()`.

Responzivita: tabulky zásahů a důkazů na úzkém displeji přecházejí na
jednosloupcové rozvržení ve stylu ostatních obrazovek skladu. Přístupnost: každé
pole formuláře má `<label>`, chyby jsou s textem, ne jen barvou, legenda stupeň
má textovou popisku vedle písmene.

## Vývojářské poznámky

### Rozhodnutí 6 — platnost hodnocení

Hodnocení **nemá časové omezení**. V detailu kusu se musí zobrazit datum posledního
testu, aby provozovatel viděl, jak dávno byl kus ověřen; datum je součást UI, ne
podmínka platnosti. Otevřená otázka zůstává, zda je nutné test po určité době
opakovat — odpověď se neuhadí, viz [Následné kroky](#následné-kroky).

Důvod: v bazarovém reálnym oběhu je opakovaný test dražší než samotný stupeň a
bez znalosti skutečného stavu skladu by automatická expirace jen množila zásahy
na kusy, které nikdo nechce prodávat. Nejdřív je potřeba vidět, jestli vůbec
stárnou.

- **Stupeň se nesmí dát vybrat ručně.** Formulář ho nikdy neobsahuje a akce
  ho nečte z `FormData`. Stupeň je výstup `odvodStupne`. Kód, který by umožnil
  přiřadit stupeň jinak, je chyba — ne zjednodušení.
- **Pořadí pravidel je významné.** Pravidlo 1 nesmí být přesunuto dolů, aby se
  „selhání" dalo přebodovat lepším testem (pravidlo 5 z 001). Implementace
  `odvodStupne` je čitelná posloupnost `if` v pořadí 1–5, ne množina podmínek
  seskupených do vyjádření typu „profil prošel **a** selhání neexistuje".
- **Čerstvé důkazy se počítají od posledního zásahu, ne od posledního testu.**
  Jiné pořadí by umožnilo, aby starý test kryl nový zásah.
- **`nalezenaVada` mimo `vizualni` je chyba, ne varování.** Vynucuje to
  `superRefine` ve schématu, ne klientové schéma. Zaškrtnutí vady u
  `funkcni` testu by totiž pravidla 3 a 4 potichu změnila.
- **`nahradniDil` a typ zásahu nesmí být v rozporu.** `typZasahu: "vymena"`
  s `nahradniDil: false` validace odmítne — bez toho nelze stupni `C` říct, **co**
  bylo vyměněno a **co** zůstalo původní (rozhodnutí 3).
- **Přechod stavu se nekontroluje v repovrstvě po hlavě.** Kontrola jde přes
  `muzzePrejitStav` / `zmenaStavu` z `repas.ts`; repozitář jen volá a předává
  výjimku dál jako `ChybaZapisu`.
- **Kus ve stavu `vystaveno` je zkontrolovaný i na úrovni akce**, ne jen
  skrytím formuláře. Skrytí tlačítka je pohodlí, kontrola je záruka.
- **Oprava chybného stupně je nový řádek.** `UPDATE` nad `condition_grade` je
  v této funkci zakázaná operace.
- Serverová akce ověřuje vstup **znovu**, i když má klient HTML `required`;
  klientská validace je pohodlí, ne záruka.
- UI nesmí sahat do `src/db/` ani do dotazů — vše jde přes `src/server/repo`.

## Testy

Konvence: `cokoliv.test.ts` vedle testovaného souboru.

| Úroveň      | Co se testuje                                                                                             | Kde |
| ----------- | --------------------------------------------------------------------------------------------------------- | --- |
| Unit        | `odvodStupne` pro všech pět pravidel, včetně prázdného seznamu důkazů, jediného selhání, kombinace zásahu + částečného testu (`C`), profil + vizuální vada (`B`), profil + čistá vizuálka (`A`), `vysledek: "casti"` | `src/lib/domain/repas.test.ts` |
| Unit        | **starý test před zásahem neudělí `A` ani `B`** — je starý, takže se nehodnotí, a protože zásah existuje, spadne to na pravidlo 2 a vyjde nejméně `C`. Testuje se, že starý důkaz nepromění stupeň, ne že stupeň nevznikne | `src/lib/domain/repas.test.ts` |
| Unit        | `muzzePrejitStav` a `zmenaStavu` včetně nepovoleného přechodu a návratu z `vystaveno` do `v_repasu`          | `src/lib/domain/repas.test.ts` |
| Unit        | `validujZasah` a `validujTest`: `nalezenaVada` mimo typ `vizualni`, `nahradniDil` u `vymena`, prázdná pole, datum v budoucnu, nulové náklady (povoleno) a záporné (odmítnuto) | `src/lib/domain/repas.test.ts` |
| Integrace   | `zapsatZasah` a `zapsatTest` přesunou kus do `v_repasu`, důkaz na kusu `ohodnoceno` se uloží bez změny stavu a důkaz na kusu `vystaveno` je odmítnut, `zapsatOhodnoceni` přepíše stav na `ohodnoceno` a nechá staré hodnocení být, `zapsatOhodnoceni` na kusu `vykoupeno` skončí chybou, `getKusZDetailem` vrátí chronologii | `src/server/repo/repas.test.ts` |
| E2E / ruční | prázdný detail kusu, průchod všemi pěti pravidly v UI, zákaz ručního zadání stupně, chyba při potvrzení bez důkazů, neaktivní tlačítko na kusu `vystaveno` | Ručně v `pnpm dev`; **ověření v prohlížeči nebylo provedeno** — v tomto prostředí není prohlížeč dostupný, takže vizuální stav, rozvržení na úzkém displeji ani reakce na kliknutí zůstávají neověřené (totéž platí pro I2) |

## Bezpečnost a soukromí

- **Stupeň neukládá chráněné údaje.** Do `TestEvidence` se nezapisují sériová
  čísla ani uživatelská data z paměti, přestože je 001 zmiňuje jako chráněné
  údaje v testech. Zapisuje se název testu, jeho typ, výsledek a případný příznak
  nalezene vady — nic, co by identifikovalo konkrétní zařízení nebo uživatele.
- **Autorizace je dluh, ne rozhodnutí.** Hodnocení uděluje provozovatel FLIPCORE
  (rozhodnutí 5); kupující ho může zpochybnit až s veřejným katalogem. V této
  iteraci je aplikace jednoprovzorová, takže **autorizace není žádná**. Každá
  serverová akce v `src/server/actions/repas.ts` musí při zavedení přihlášení
  začít kontrolou relace a ověřit roli — stejně jako `src/server/actions/vykup.ts`.
  Je to věc, na kterou nesmí zapomenout iterace s přihlášením.
- **Ověření vstupů na hranici.** Zod validuje `FormData` znovu na serveru.
  `kusId` se z `FormData` nereadě — pochází z parametrů routy a znovu se ověří,
  že existuje.
- **Klientem poslaný stupeň se ignoruje.** Akce si stupeň odvodí sama; hodnota
  `stupen` v `FormData` se nesmí použít ani jako podmínka.
- Osobní údaje: jméno provozovatele se v této iteraci neukládá — `RepairTicket`
  nemá vyplněné `provedlId`, protože tabulka `user` v této iteraci neexistuje.
  Doplní se s přihlášením.
- SQL injekce: dotazy jdou přes Drizzle parametry.
- Tajné env proměnné: žádné nové.

## Výkonnost

Objemy jsou bazarové: stovky kusů, desítky důkazů na kus. Jde o dotazy na jeden
kus podle `kus_id` a o přepočet seznamu skladu po zápisu.

- Bez indexu na `kus_id` v `test_evidence` a `repair_ticket` by každé načtení
  detailu kusu prošlo přes celé tabulky. Indexy přidává migrace v této iteraci.
- `odvodStupne` je čistá funkce nad už načtenými poli, bez dalších dotazů.
- Po každém zápisu se přepočítá celý seznam skladu a nástěnka; nad jedním skladem
  je to zanedbatelné. Stránkování přijde s veřejným katalogem (I4).

## Analytika/telemetrie

Nic se nesbírá.

## Známé omezení

- **Přílohy důkazů (`priloha`) jsou mimo rozsah**, přestože je 001 požaduje ve
  formuláři. Kam ukládat přílohy je stále otevřená otázka v
  [architektuře](../architektura.md). Bez přílohy důkaz pořád existuje, je jen
  textový — stupeň se odvodí, jen ho nelze ukázat obrázkem.
- **Naměřené hodnoty (`namereHodnoty`) jsou mimo rozsah.** Bez nich test dokazuje
  *průchod*, ne konkrétní čísla. UI to musí napsat výslovně („prošel" ≠ „v
  pořádku"), jinak bazar bude „prošel" číst jako měření v pořádku.
- **Workflow zásahu je mimo rozsah záměrně.** `RepairTicket` zůstává prostý
  záznam historie bez stavu. Stavový tok `received → diagnostics → repair →
  testing → grading → done` z [ROADMAP](../../ROADMAP.md) se nyní nezavádí:
  vnitřní aplikace má jednoho provozovatele, který nemusí hlídat, v jaké fázi
  práce je. Zavedení přinese až více lidí v aplikaci nebo více pracovišť — do té
  doby by to byl stav navíc, který by nikdo nečetl.
- **Displeje se škálou neřeší.** V katalogu žádná kategorie `displej` není, takže
  se pro ni škála ani výjimka nedefinuje. Není to výjimka ze škaly (rozhodnutí 4),
  je to prostě kategorie, která v katalogu zatím není.
- **Stupeň se neodvozuje z `ConditionGrade` staršího kusu.** Odvození běží vždy
  nad aktuálními důkazy, i když už kus jedno hodnocení má.
- Bez zásahu jde stupeň `A` nebo `B` získat jen z profilového testu a vizuální
  kontroly. Kus `vykoupeno`, na kterém nikdo nepracoval, nemá jak mít stupeň —
  to je zamýšlené, ne chybějící krok.
- **Žádný stupeň nevznikne jen kusu bez zásahu a bez čerstvého profilového
  průchodu.** Na kusu, kde zásah je, odvodí pravidlo 2 nejméně `C` — i kdyby
  jediným důkazem byl starý profilový průchod z doby před zásahem. Stupeň tedy po
  zásahu bez čerstvého testu nevznikne jako „žádný", ale jako `C`, jehož `duvod`
  říká, že chybí čerstvý profilový test.
- **Ruční ověření v prohlížeči neproběhlo.** V prostředí, kde I3 vznikalo, není
  dostupný prohlížeč, takže vizuální stav obrazovky, rozvržení na úzkém displeji
  a reakce na kliknutí nebyly ověřeny (totéž platí pro I2 a jeho formulář
  výkupu). Ověřeno je chování vrstev pod obrazovkou — domény a repozitáře — testem.
  Viz [Testy](#testy).
- Jeden zásah i jeden test patří jednomu kusu; není možné zapsat zásah na více kusů
  jedním zápisem (výměna ventilátorů ve dvou kusech = dva záznamy).

## Následné kroky

- I4 — vystavení kusu do katalogu: přechod `ohodnoceno → vystaveno` doplní do
  `POVOLENE_PRECHODY`, prodejní cena, filtr podle stupně.
- I4 — veřejný detail nabídky se stupeň, důkazy a historií zásahů; tam se poprvé
  objeví potřeba zpochybnit hodnocení ze strany kupujícího.
- Vyřešit otevřenou otázku ukládání příloh důkazů a doplnit `priloha` do
  `TestEvidence` včetně omezení typu a velikosti.
- Seznam povinných testů pro konkrétní kategorii komponenty, až vznikne z reálného
  provozu. Musí zůstat jako **seznam důkazů**, ne jako výjimka ze škaly
  (rozhodnutí 4).
- Opakovaný test po určité době (otázka platnosti hodnocení, rozhodnutí 6) — zatím
  bez omezení, datum posledního testu je jen informace pro provozovatele.
- Zpřesnit `STUPEN_POPIS` v `src/lib/domain/slovnik.ts`, pokud legenda A–D
  ukáže, že slovník nestačí srozumitelně vysvětlit rozdíl B proti C.
- Ruční odzkus v prohlížeči, až bude dostupný: průchod všemi pěti pravidly, zákaz
  ručního zadání stupně a rozvržení detailu kusu na úzkém displeji.

## Checklist před mergem

- [x] Dokument vytvořen z této šablony, název ve tvaru `NNN-kebab-nazev.md`
- [x] Sekce `Datový dopad` a `API/změny v kódu` odpovídají skutečnosti
- [x] Status a Datum aktualizované
- [x] `docs/README.md` obsahuje řádek s tímto dokumentem
- [x] `docs/architektura.md` aktualizovaný — vznikly nové sloupce, indexy, vrstva
      (`src/lib/domain/repas.ts`), vrstva akcí, routa `/sklad/[id]` a bezpečnostní
      požadavek na autorizaci
- [x] `ROADMAP.md` aktualizovaný — I3 označena za hotovou
- [x] Důležité technické rozhodnutí zapsáno jako ADR v `docs/adr/` —
      [ADR 005](../adr/005-stupen-se-odvoduje-z-dukazu.md)
- [ ] `pnpm check` prochází (lint, typecheck, testy) — běží jako zvláštní finální
      verifikace mimo tuto iteraci dokumentace
- [x] Patička `Poslední aktualizace: YYYY-MM-DD` odpovídá dnešnímu datu

Poslední aktualizace: 2026-09-29
