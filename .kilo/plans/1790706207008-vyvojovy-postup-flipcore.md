# Vývojový postup FLIPCORE — plán

## Kontext

Repo má pět read-only sekcí (`/nástěnka`, `/sklad`, `/finance`, `/sestavy`, `/nastavení`)
nad ukázkovými daty v `src/server/repo/data.ts`. Doménová logika je čistá a pokrytá
65 testy v `src/lib/domain/*.test.ts`, funguje `pnpm check` i `pnpm build`, a existuje
dokumentační rámec (`docs/README.md` s pravidly, `docs/funkce/`, `docs/adr/`, `ROADMAP.md`
s Definicí hotovosti).

V `docs/adr/001-ukazkova-data-do-dokonceni-funkci.md` stojí, že vše zůstává ukázkové,
„dokud nebudou fungovat všechny funkce“. Tato podmínka je nesplnitelná: zápis dat
(nabídka, nastavení, zásah repasu, objednávka) se na statických datech provést nedá.
Níže je rozhodnutá splnitelná náhrada.

## Rozhodnutí

1. **Persistence přijde s první zapisovací funkcí**, ne až „na konci". Podmínka ADR 001 se
   přepisuje: ukázková data končí s iterací I1.
2. **Databáze: SQLite + Drizzle ORM** (`drizzle-orm`, `drizzle-kit`, `better-sqlite3`).
   Bez instalace služby, migrace v SQL. Přechod na Postgres je později změna dialektu.
3. **Entita `Kus` s životním cyklem** `vykoupeno → v_repasu → ohodnoceno → vystaveno →
   prodano`. Nahrazuje dnešní `Listing`, který dnes směšuje nabídku ke koupi s kusem
   ve skladě. Repas, hodnocení i testy patří kusi, takže historie přežije opakované
   vystavení — to už vyžaduje i `docs/architektura.md` u `RepairTicket`.
4. **Jeden provozovatel.** FLIPCORE jediný; bazary a jednotlivci jsou data u kusu
   (název, typ, kontakt), bez přihlašování. Auth se neřeší, dokud nepůjde o veřejný obchod.
5. **Cíl dalších iterací: provozuschopná vnitřní aplikace** — výkup → repas a ohodnocení
   → vystavení kusu. Veřejný katalog až poté.

## Důležité závěry z dokumentace

- `docs/vize.md` nedopouští v katalogu zboží, které neprošlo minimálním vstupním testem.
  **Veřejný katalog tedy nelze postavit před ohodnocením** — je to podmínka konzistence,
  ne preference pořadí. `ROADMAP.md` má pořadí správně.
- `docs/architektura.md` říká „cena se nikdy nepřebírá od klienta". To platí pro veřejný
  košík. U interní evidence výkupu je provozovatel sám autoritou a výkupní cenu zadává.
  **Toto upřesnění je nutné doplnit do `docs/architektura.md` v I1**, jinak budou
  dvě pravidla v rozporu.
- `docs/funkce/001-repas-a-stavove-hodnoceni.md` už má rozhodnuto stavovou škálu A–D
  a pravidlo „stupeň se odvozuje z důkazů". Nepočítat znovu, jen dotáhnout.
- `AGENTS.md` vyžaduje přečíst Next.js dokumentaci z `node_modules/next/dist/docs/` před
  psaním kódu. **Tento adresář existuje až po `pnpm install`** — v aktuálním běhu chybí.

## Postup práce na jedné iteraci

Každá iterace je jeden svislý řez, ideálně velikosti S/M. Větší se rozdělí.

1. **Vybrat jednu položku z `ROADMAP.md`.** Jedna. Ne dvě sousední, ne „a při té příležitosti
   ještě".
2. **`docs/funkce/NNN-kebab-nazev.md` vznikne před kódem** (už je to pravidlo
   v `docs/README.md`, nezakládat na něm). Doplnit `Datový dopad`, `API/změny v kódu`,
   `Testy`, `Bezpečnost`.
3. **Rozhodnout a zapsat:**
   - nová entita nebo změna polí → `docs/architektura.md#datový-model` ve stejné změně;
   - obtížně vratné technické rozhodnutí → nový záznam v `docs/adr/`;
   - jinak nic dalšího. Drobnosti se nezapisují.
4. **Schéma a migrace**, pokud se mění data: Drizzle schéma + `drizzle-kit generate`.
   Migrace se commituje.
5. **Repo vrstva `src/server/repo/`** — dotazy a mapování. Žádná obchodní logika.
6. **Aplikační logika `src/lib/domain/`** — čisté funkce s testy vedle souboru.
   Výpočty patří sem, nikoli do komponenty.
7. **UI** — server komponenta; formulář přes server action; **validace na serveru i v klientu**;
   prázdný, chybový a stav během čekání u každého seznamu i formuláře.
8. **Brány před považováním za hotové:**
   - `pnpm check` zelené (lint, typecheck, testy) a `pnpm build` prochází;
   - ruční průchod v `pnpm dev` zapsaný v `ROADMAP.md` (kdo a kdy odzkoušel);
   - odškrtnutá celá Definice hotovosti v `ROADMAP.md`;
   - `docs/README.md` mapa obsahuje nový dokument funkce.

### Invarianty, které nesmějí platit

- Zápis dat jde výhradně přes server action s validací. Klient posílá vstup, ne výsledek.
- Ceny se počítají a zaokrouhlují celočíselně v haléřích (`Penize`), formátování jen v
  `src/lib/format.ts`.
- Klientská komponenta neimportuje `src/server/repo/`.
- `docs/funkce/NNN-*.md` se nepíše až po implementaci.

## Pořadí iterací

### I1 — Entita Kus a persistence (M)
- `pnpm add drizzle-orm better-sqlite3 zod`, `pnpm add -D drizzle-kit @types/better-sqlite3`.
- `src/db/schema.ts` (tabulky `component`, `kus`, `prodejce`, `condition_grade`,
  `repair_ticket`, `test_evidence`, `build`, `build_item`, `transakce`, `nastaveni`),
  `drizzle.config.ts`, migrace.
- `src/db/client.ts` — připojení přes `DATABASE_URL`; `.env.example` pouze s názvy
  proměnných, `.env` v `.gitignore`, soubor databáze v `.gitignore`.
- **Refaktor modelu před schémem:** `Listing` → `Kus` (nový `stav`),
  `ListingZDetailem` → `KusZDetailem`, `BuildItem.listingId` → `kusId`,
  `RepairTicket.listingId` → `kusId`, `TestEvidence.listingId` → `kusId`,
  `MapaKomponent` v `sestavy.ts` mapuje `kusId` → `Component`.
  Dotčené: `types.ts`, `sklad.ts`(+test), `sestavy.ts`(+test), `data.ts`,
  `server/repo/index.ts`, `filtr-skladu.tsx`, 4 stránky.
- `src/server/repo/` přepsat na dotazy; `data.ts` nahradit **seed skriptem**, aby šlo
  znovu naplnit ukázková data a porovnat výstup.
- Nahradit ADR 001 novým záznamem o persistence; doplnit upřesnění pravidla o cenách
  do `docs/architektura.md`.
- Hotovo, když: `pnpm check` zelené, všechny dotazy jdou do DB, seed reprodukuje dnešní data.

### I2 — Evidence výkupu, první zápis (M)
- Server action `zapsatVykup` + schéma vstupu ve Zod; chyby formuláře se vracejí do UI.
- Formulář na `/sklad`: vybrat typ komponenty, prodejce, výkupní cenu, datum.
- Kus vzniká ve stavu `vykoupeno`; `prodejce` lze zadat nového i vybrat existujícího.
- Testy: čistá validační logika + přechod `vykoupeno → v_repasu` (viz I3, funkce v `lib`).

### I3 — Repas a ohodnocení (L)
- Realizovat `docs/funkce/001-repas-a-stavove-hodnoceni.md`: přechody stavů kusu,
  zápis zásahu, zápis testu, **výpočet stupně A–D z důkazů** (odvozený, ne ruční).
- UI: detail kusu s historií zásahů a důkazy; šipka/legenda A–D.
- Rozhodnutí k udělení (dosud otevřené ve `docs/vize.md`): zda je škála jednotná pro
  všechny typy komponent, nebo má výjimky (disky, displeje).

### I4 — Vystavení nabídky a katalog (M)
- Z kusu ve stavu `ohodnoceno` vzniká nabídka s prodejní cenou; blokace vystavení
  kusu bez ohodnocení.
- Katalog: filtry přesunout na server (dnes běží v klienti nad celou sadou).
- Marže se počítá z výkupní ceny kusu.

### I5 — Finance z reálných dat (S–M)
- Přehled financí nad skutečnými výkupy a prodeji místo dnešních konstant.

### I6 — Sestavy (L)
- Konfigurátor vybírající z kusů v katalogu; znovu použít `zhodnotitSestavu`.
- **Blokuje:** cenové hranice kategorií (otevřená otázka v `docs/vize.md`). Bez čísel
  nejde porovnat sestavu s rozpočtem — rozhodnout před I6.

### Mimo rozsah plánu
Veřejný katalog, košík, platby, přihlášení a role, více bazarů s účty, přílohy testů.

## Rizika

- **SQLite má jednoho zapisovatele.** Rezervace více kusů v jedné objednávce později
  narazí. Je to přijaté riziko: je to i důvod, proč je SQLite dočasné.
- **Refaktor `Listing` → `Kus` rozbije všech 65 testů a 4 stránky.** Proto je součástí I1
  a musí být hotový před nasazením schématu, ne po něm.
- **Seed a ID kusů.** `MapaKomponent` v `sestavy.ts` se skládá z `listingId`; po přejmu
  na `kusId` musí seed generovat ID tak, aby na ně sestavy odkazovaly.
- **Zod je nová závislost** — popsat v ADR, i když je to běžná volba.
- **Server actions a stavy formuláře** v Next.js 16 neprozkoumat z hlavy: po `pnpm install`
  přečíst `node_modules/next/dist/docs/` (Agent rules v `AGENTS.md` to vyžadují) a teprve
  pak psát.

## Validace

Po každé iteraci, bez výjimky:

1. `pnpm check` — lint, typecheck, testy zelené.
2. `pnpm build` — prochází, seznam rout odpovídá tomu, co je opravdu implementované.
3. Ruční průchod v `pnpm dev` celé dotčené sekce včetně prázdného stavu a chybného vstupu;
   zapsat kdo a kdy do `ROADMAP.md`.
4. `git status` — migrace a schéma commitnuté, `.env` ani soubor databáze ne.

## Otevřené otázky (rozhodnout uvedenou iteraci)

| Otázka | Kdy | Doporučení |
| --- | --- | --- |
| Odvozovat transakce z událostí kusu, nebo zadávat ručně? | I5 | odvozovat: výkup → výdaj, prodej → příjem. Ruční zápis by duplicoval životní cyklus |
| Jednotná stavová škála, nebo výjimky pro disky a displeje? | I3 | škála jednotná, **požadované důkazy** se liší podle typu komponenty |
| Kdo je autoritou hodnocení? | I3 | provozovatel FLIPCORE; kupující může hodnocení zpochybnit až s veřejným katalogem |
| Jak dlouho platí doložený stav? | I3 | bez časového omezení, ale s viditelným datem posledního testu |
| Cenové hranice kategorií Základ / Střední / Premium | před I6 | obchodní rozhodnutí, ne technické — neuhadit |
