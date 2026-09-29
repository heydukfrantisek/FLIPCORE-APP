# ADR 002: SQLite a Drizzle pro ukázkovou funkci výkupu

- Status: Přijato
- Datum: 2026-09-29
- Dotýká se: persistence, datové vrstvy, plánování prací
- Nahrazuje: [ADR 001](001-ukazkova-data-do-dokonceni-funkci.md)

## Kontext

ADR 001 rozhodl, že aplikace zůstane na ukázkových datech, dokud nebudou hotové všechny
funkce. Tento stav měl jedinou podmínku ukončení: persistence se zavede, jakmile bude
hotová první funkce vyžadující zápis a bude známý výběr databáze.

Podmínka nyní platí. Další iterací je evidence výkupu — první zápis, který aplikaci bez
uložiště znemožňuje. V tomto okamžiku je ale nutné říct, proč ADR 001 nebylo možné
prostě dodržet déle: ukázková data jsou konstanty v kódu a nelze do nich zapsat. Dokud
trvalo toto ADR, nebylo možné ověřit, že data v aplikaci odpovídají tomu, co do ní
provozovatel zadal. Ukázková data navíc vytvářela falejný dojem hotové funkce: všechny
obrazovky byly plné, ale žádná nesloužila svému účelu.

Pro výběr persistence přicházejí v úvahu tři cesty:

1. **SQLite + Drizzle ORM** — nativní knihovna, schéma v TypeScriptu, typované dotazy
   a migrace ze stejného schématu.
2. **SQLite + dotazovací builder** — méně kódu, ale schéma a dotazy nejsou typované
   proti doménovým typům, což je pro tento projekt zásadní: `Component` je diskriminovaná
   unie a chyba ve sloupci se musí projevit při typechecku.
3. **Postgres od začátku** — správná volba až pro více provozovatelů, ale vyžaduje
   běžící server a vlastní správu schématu, což je pro jednoho provozovatele FLIPCORE
   zbytečná režie.

## Rozhodnutí

Použijeme **SQLite přes Drizzle ORM** (`drizzle-orm` s `better-sqlite3`). Schéma je
jediný zdroj pravdy v `src/db/schema.ts`, dotazy žijí v `src/server/repo/`, klient
databáze je označen `server-only` a migrace se aplikují automaticky při prvním
připojení.

Důsledky tohoto rozhodnutí:

- **Databáze startuje prázdná.** Aplikace musí fungovat i bez jediného kusu. Ukázková
  data se naplňují výhradně ručním příkazem `pnpm db:seed`, který databázi přebíjí.
  Nepřidáváme přepínač mezi ukázkovým a ostrým režimem — umožnil by omylen smíchat
  ukázková data se skutečnými, a to je přesně to, čemu ADR 001 mělo bránit.
- **Entity `Kus` nahrazuje `Listing`.** Dnešní `Listing` popisuje nabídku ke koupi,
  a tím po prodeji zaniká. Kus ale prochází cyklem výkup → repas → ohodnocení → výstavení
  → prodej, takže musí existovat i po prodeji, aby šlo dohledat jeho historii.
- **Stavové hodnocení zůstává oddělenou entitou** s vazbou 1:N na kus, aby bylo možné
  hodnocení v průběhu času revidovat bez ztráty historie.
- **Ceny jsou celé haléře** v `integer` sloupcích. Do databáze se nikdy nezapisuje float.
- **Stránky se vykreslují dynamicky.** Statické předgenerování by na obrazovkách
  ponechalo data z okamžiku `next build`.
- **Migrace se commitují, data ne.** Soubor databáze je v `.gitignore`; `.env.example`
  uvádí pouze název `DATABASE_URL` bez hodnoty.

## Důsledky

- Repozitář už není zdroj dat, ale vrstva dotazů nad cizím zdrojem. Testy doménových
  funkcí v `src/lib/domain/` proto pracují s připravenými hodnotami a nepotřebují databázi;
  dotazy nad skutečnou databází se ověřují ručně v `pnpm dev`.
- Klientské komponenty nesmějí importovat `src/db/` ani `src/server/repo/`. Označení
  `server-only` to vynucuje už při sestavení.
- SQLite má jednoho zapisovatele. Souběžná rezervace více kusů v jedné objednávce
  narazí na omezení — je to přijaté riziko doby, kdy je FLIPCORE jediným provozovatelem,
  a otevřená otázka pro přechod na Postgres.
- Přechod na Postgres znamená vyměnit `src/db/client.ts` a dialekt ve `drizzle.config.ts`.
  Dotazy v `src/server/repo/` zůstanou stejné, protože jsou psané proti schématu,
  ne proti SQLite.
- Přílohy důkazů (`TestEvidence`) zatím nejsou uložené; je potřeba rozhodnout, zda
  zůstanou na disku, nebo přejdou do Postgres.

## Proč to nebude stačit

Jednozapisové SQLite funkci stačí. Přestane stačit, jakmile vznikne souběžný zápis —
například dva prodejci jednoho kusu v jedné objednávce, nebo více provozovatelů. V tom
okamžiku je nutný Postgres s řádkovými zámky a až potom transakce přes více kusů.

Poslední aktualizace: 2026-09-29
