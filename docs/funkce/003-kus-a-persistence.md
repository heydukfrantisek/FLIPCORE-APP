# 003: Entita Kus a persistence

| Položka         | Hodnota                                                                                |
| --------------- | -------------------------------------------------------------------------------------- |
| Status          | `Rozpracováno`                                                                         |
| Vlastník        | FLIPCORE                                                                                |
| Datum           | 2026-09-29                                                                            |
| Oblast          | `infrastruktura`                                                                       |
| Navazující dokl. | [ADR 001](</docs/adr/001-ukazkova-data-do-dokonceni-funkci.md>) (bude nahrazeno), [architektura](../architektura.md), [001 — repas](001-repas-a-stavove-hodnoceni.md) |

## Zadání a cíl

Převést aplikaci z ukázkových konstant na skutečnou databázi a zavést entitu `Kus`,
která popisuje bazarový kus od výkupu po prodej. Zatím bez zápisů — funkce je čistě
čtecí a připravuje půdu pro evidenci výkupu (I2).

Rozsah: schéma databáze, klient, migrace, dotazy v repo vrstvě, seed jako samostatný
příkaz, přejmenování `Listing` → `Kus`.

Mimo rozsah: jakýkoliv zápis dat, přihlášení, veřejný katalog.

## Uživatelský příběh

Jako `provozovatel FLIPCORE` chci `aby aplikace četla ze skutečné databáze`, abych
`mohl na reálných datech ověřit, že marže, přehled skladu a kontrola sestav fungují
stejně jako na ukázce`.

## Proč entita Kus

Dnešní `Listing` popisuje *nabídku ke koupi*. Bazarový kus ale nejprve koupíme, pak
repasujeme, ohodnotíme a teprve potom vystavíme. `docs/architektura.md` u `RepairTicket`
vyžaduje, aby „historie přežívá změnu vlastnictví i opakované zveřejnění" — tomu
`Listing` jako entita vyhovět nemůže, protože po prodeji zaniká.

Nový `Kus` má životní cyklus uložený jako pole `stav`:

| Stav           | Význam                                                  | Prodává se? |
| -------------- | ------------------------------------------------------- | ----------- |
| `vykoupeno`    | Kus je ve skladu, nic na něm nebylo provedeno           | ne          |
| `v_repasu`     | Probíhá zásah nebo testování                            | ne          |
| `ohodnoceno`   | Má stavové hodnocení, ale není vystaven                 | ne          |
| `vystaveno`    | Nabízí se v katalogu                                     | ano         |
| `rezervovano`  | Vybráno, čeká na kupujícího                             | ne          |
| `prodano`      | Prodáno                                                   | ne          |

`rezervovano` a `prodano` přebírají dosavadní význam `dostupnost`; zbytek doplňuje
repas a ohodnocení. Stavové hodnocení (A–D) zůstává **oddělenou entitou** a je s kusem
spojeno 1:N, aby šlo hodnocení v průběhu času revidovat a neztratit historii
(viz [001](001-repas-a-stavove-hodnoceni.md)). Aktuální stupeň je ten s nejpozdějším
datem hodnocení; repo vrstva ho doplní při čtení.

## Scénáře

| # | Jako kdo     | Situace                                          | Očekávaný výsledek |
| - | ------------ | ------------------------------------------------ | ------------------- |
| 1 | Provozovatel | Spustí aplikaci s prázdnou databází              | Aplikace naběhne, všechny seznamy ukážou prázdný stav, žádná výjimka |
| 2 | Provozovatel | Spustí `pnpm db:seed` a pak `pnpm dev`          | Obrazovky ukážou dnešní ukázková data |
| 3 | Provozovatel | Filtruje sklad podle stavu kusu                  | Filtrování funguje i pro nové stavy `vykoupeno` a `v_repasu` |
| 4 | Provozovatel | Otevře sestavu                                  | Funguje `zhodnotitSestavu`, kusy se hledají podle `kusId` |
| 5 | Vývojář      | Spustí `pnpm check`                              | Migrace v CI proběhne a sedí se schématem |
| 6 | Vývojář      | Otevře repozitář                                | Soubor databáze ani `.env` nejsou commitnuté |

## Datový dopad

- Nové entity v DB: `component`, `kus`, `prodejce`, `condition_grade`, `repair_ticket`,
  `test_evidence`, `build`, `build_item`, `transakce`, `nastaveni`.
- Změny: `Listing` → `Kus`; pole `dostupnost` nahrazeno polem `stav`;
  vazby `RepairTicket.listingId`, `TestEvidence.listingId` a `BuildItem.listingId`
  přejmenovány na `kusId`.
- Migrace: první migrační soubor vytvoří `drizzle-kit generate`, aplikuje `pnpm db:migrate`.
  Soubor databáze je lokální a necommituje se.

## API/změny v kódu

- `src/db/schema.ts` — Drizzle schéma, `src/db/client.ts` — připojení (`server-only`).
- `src/db/seed.ts` — dnešní ukázková data a `pnpm db:seed`.
- `src/server/repo/index.ts` — stejné funkce jako doteď, dotazy místo konstant.
- `src/lib/domain/types.ts` — `Kus`, `StavKusu`, `KusZDetailem`; `Dostupnost` zmizí.
- `src/lib/domain/sklad.ts` — filtrování podle stavu kusu, přehled rozlišuje
  **investovanou hodnotu** (součet výkupních cen všech kusů) a **hodnotu vystaveného
  zboží** (součet prodejních cen kusů ve stavu `vystaveno`).
- `src/lib/domain/sestavy.ts` — `MapaKomponent` mapuje `kusId` na komponentu.
- Serverové komponenty čtou databázi; klientské komponenty data jen dostávají jako propy.

## UI

Obrazovky zůstávají stejné. Mění se pouze obsah sloupce „Dostupnost" — místo tří hodnot
se zobrazuje stav kusu se šesti hodnotami, aby bylo vidět i kusy, které ještě nejsou
na prodej. Formuláře žádné, aplikace je stále read-only.

## Vývojářské poznámky

- Ceny jsou celé haléře v `integer` sloupcích. `prodejniCena` je `NULL`, dokud kus není
  vystaven — marže se nesmí počítat z kusu, který ještě prodávat nechceme.
- Klient databáze je `server-only`. Klientská komponenta, která by ho omylem naimportovala,
  má spadnout s chybou při sestavení.
- `db:seed` je oddělený příkaz a nikdy se nesmí spouštět automaticky. Aplikace musí
  fungovat i s prázdnou databází.
- Migrace se commitují, soubor databáze ne.

## Testy

| Úroveň      | Co se testuje                                                                | Kde |
| ----------- | ---------------------------------------------------------------------------- | --- |
| Unit        | marže, filtrování podle stavu kusu, investovaná a vystavená hodnota, přehled, kompatibilita sestav | `src/lib/domain/*.test.ts` |
| Integrace   | Dotazy v repo vrstvě nad prázdnou i naplněnou databází                       | Ručně v `pnpm dev` — zatím bez automatizace |
| E2E / ruční | Prázdná DB, DB po `pnpm db:seed`, filtry, sestavy                            | Ručně, zapsat do `ROADMAP.md` |

## Bezpečnost a soukromí

- Autorizace: stále žádná, aplikace je jednoprovzorová. Výchozí stav bude odepřen ve
  chvíli, kdy vznikne přihlášení.
- Validace vstupů: žádný vstup ze strany uživatele, funkce nic nezapisuje.
- Osobní údaje: v tabulce `prodejce` je zatím název a typ. Kontakty přibydou až
  s veřejným katalogem, do té doby se do DB ukládat nemají.
- Tajné proměnné: `DATABASE_URL` — cesta k souboru databáze, v `.env`, v `.env.example`
  pouze název. Žádné tajné klíče v repozitáři.

## Výkonnost

Databáze je malý SQLite soubor, dotazy jsou jednoduché spojení a filtry nad indexovanými
sloupci (`kus.stav`, `kus.componentId`, `kus.prodejceId`). Ceny se nepočítají v dotazu,
ale až nad výsledkem v `src/lib/domain/`, aby zůstaly otestované bez databáze. Při růstu
katalogu se filtry přesunou na server — to je úkol I4.

## Analytika/telemetrie

Nic se nesbírá.

## Známé omezení

- Aplikace je stále read-only; zápis přijde v I2.
- SQLite má jednoho zapisovatele. Rezervace více kusů v jedné objednávce později narazí —
  je to přijaté riziko doby, kdy je jediným provozovatelem FLIPCORE.
- Seed data jsou umělá a nesmějí se plést se skutečnými kusy.
- Prázdné stavy se poprvé objeví právě teď a je potřeba je projít — dodnes nebyly reálně
  prověřené, protože všechno bylo naplněné ukázkou.

## Následné kroky

- I2 — evidence výkupu: první zápis přes server action s validací ve Zod.
- I3 — zápis zásahu, testu a odvození stupně A–D z důkazů.

## Checklist před mergem

- [x] Dokument vytvořen z této šablony, název ve tvaru `NNN-kebab-nazev.md`
- [x] Sekce `Datový dopad` a `API/změny v kódu` odpovídají skutečnosti
- [x] Status a Datum odpovídají skutečnému stavu (`Rozpracováno`) — na `V produkci` přechází po ruční průchodce
- [x] `docs/README.md` obsahuje řádek s tímto dokumentem
- [x] `docs/architektura.md` aktualizovaný
- [x] `ROADMAP.md` aktualizovaný
- [x] `pnpm check` prochází
- [x] Patička `Poslední aktualizace: YYYY-MM-DD` odpovídá dnešnímu datu

Poslední aktualizace: 2026-09-29
