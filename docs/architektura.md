# Architektura

> Technický návrh systému. Produktové záměry a pravidla tvorby katalogu jsou v [vizi](vize.md), konkrétní změny v jednotlivých funkcích v [dokumentech funkce](funkce/). Uspořádání práce a priority v čase drží [ROADMAP.md](../ROADMAP.md).
>
> Poznámka k stavu: repozitář obsahuje scaffold aplikace (viz [dokument funkce 000](funkce/000-zalozeni-projektu.md)), vnitřní šablonu aplikace (viz [dokument funkce 002](funkce/002-zakladni-sablona-aplikace.md)) a datovou vrstvu nad SQLite (viz [dokument funkce 003](funkce/003-kus-a-persistence.md)). Části tohoto dokumentu označené jako plánované jsou návrh a nepopisují existující kód.

## Vrstvy a adresářová struktura

Aplikace je třívrstvá: uživatelské rozhraní, aplikační logika a datová vrstva. Každá vrstva má vlastní pravidla, která brání tomu, aby se logika promíchala.

| Vrstva                 | Kde           | Odpovědnost                                                        | Pravidlo                                                       |
| --------------------- | ------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| Rozhraní (UI)         | `src/app/`, `src/components/` | Routy, serverové i klientské komponenty, formuláře, zobrazení stavů | Komponenta neobsahuje obchodní logiku, jen volá vrstvu pod sebou |
| Aplikační logika      | `src/lib/`, `src/server/` | Validace, výpočty, skládání sestav, transformace dat pro UI | Čisté funkce, bez vazby na konkrétní UI; testovatelné bez DOM |
| Datová vrstva         | `src/db/`, `src/server/repo/` | Dotazy, perzistence, mapování entit | Jediné místo přístupu k datům, mimo UI |

Skutečná struktura adresářů:

```
src/
  app/            routy (App Router), layouty, globalni styly
    (app)/        skupina rout se spolecnou kostrou aplikace (nastenka, sklad, ...)
  components/     slozene UI komponenty (sdilene i specificke pro domenu)
  lib/
    domain/       typy entit a ciste obchodni vypocty (sklad, finance, sestavy)
    format.ts     formatovani meny, cisel, procent a dat pro UI
  server/
    repo/         repository vrstva - jediny pristup k datum
docs/             tato dokumentace
```

Plánované složky, které zatím neexistují: `src/db/` (připojení a migrace po rozhodnutí
persistence) a `src/server/actions.ts` (serverové akce, až bude co zapisovat).

## Klíčová rozhodnutí

Krátké záznamy ve formátu kontext / rozhodnutí / důsledky. Formální záznamy s dalšími souvislostmi patří do `docs/adr/` (viz [ADR index](adr/README.md)); tento seznam je souhrn a odkazuje se na ně.

### Next.js 16 s App Routerem

- **Kontext:** Potřebujeme unifikovaný routing, serverové renderování a koexistenci serverových a klientských komponent.
- **Rozhodnutí:** Next.js 16, App Router, celá aplikace v jednom repozitáři.
- **Důsledky:** Routy jsou adresářářová struktura v `src/app/`. Výrazná část datových operací může běžet na serveru, což šetří round-trips, ale zvyšuje nároky na pochopení hranice server / klient. Změna routeru by byla nákladná.

### TypeScript v režimu strict

- **Kontext:** Cílem je předcházet chybám dřív než na produkci, aplikace pracuje s uživatelskými daty a cenami.
- **Rozhodnutí:** TypeScript s `strict: true`, bez `any`, kontrola typů skriptem `pnpm typecheck` (generování typů Next.js a `tsc --noEmit`).
- **Důsledky:** Chyby v typech jsou chyby buildu a CI. Obory datových modelů je nutné definovat centrálně, aby se typy nesměšovaly.

### Tailwind CSS 4

- **Kontext:** Potřebujeme jednotný vizuální jazyk bez vlastního CSS frameworku a bez tření mezi systémem a designem.
- **Rozhodnutí:** Tailwind CSS 4, třídy v komponentách, globální styly jen v `src/app/globals.css`.
- **Důsledky:** Žádné další CSS frameworky ani styly v inline atributech. Vizuální konzistence je zajištěna sdílenými hodnotami v tématu; nové barvy se přidávají do `globals.css`, ne jako ad-hoc třída.

### Vitest s jsdom

- **Kontext:** Testy patří vedle testovaného souboru, koexistence s frameworkem Next.js a s prostředím Node.
- **Rozhodnutí:** Vitest, prostředí jsdom, konfigurace v `vitest.config.mts`, testy `cokoliv.test.ts` vedle zdroje.
- **Důsledky:** Testy běží rychle a sdílejí konfiguraci s TypeScriptem. Aplikační logika musí být psaná tak, aby byla testovatelná bez běžícího serveru.

### pnpm

- **Kontext:** Potřeba deterministická a rychlá instalace závislostí.
- **Rozhodnutí:** pnpm, verze managera je fixovaná přes `packageManager` v `package.json`.
- **Důsledky:** Příkazy jsou pnpm (`pnpm add`, `pnpm check`), lockfile se commituje. Není dovoleno míchat balíčkové managery, protože by lockfile přestal být autoritativní.

### Alias `@/*` pro `src/*`

- **Kontext:** Importy relativními cestami jsou při růstu projektu křečkovité.
- **Rozhodnutí:** Alias `@/*` ukazuje do `src/*` (konfigurace v `tsconfig.json`, podporováno i runtime, takže se nepoužívají relativní importy přes `src`).
- **Důsledky:** Všechny interní importy začínají `@/`. Alias je definovaný jen na jednom místě, proto se nesmí duplikovat v konfiguraci nástrojů.

### Skupina rout `(app)` se společnou kostrou

- **Kontext:** Aplikace potřebuje postranní menu a hlavičku ve všech obrazovkách, ale budoucí veřejný marketplace bude chtít jinou kostru.
- **Rozhodnutí:** Routy aplikace jsou ve skupině `src/app/(app)/`, která má vlastní `layout.tsx` s komponentou `Kostra`. Skupina rout se v URL neobjeví. Kořenový layout řeší jen `html` a `body`.
- **Důsledky:** Přidání veřejné skupiny rout s jiným layoutem neomezuje interní sekce. Aktivní položka menu se řeší na klientu přes `usePathname`, proto je `Navigace` klientská komponenta.

### Datová vrstva: `src/db/` a `src/server/repo/`

- **Kontext:** Rozhraní potřebovalo data dřív, než byla persistence rozhodnuta.
- **Rozhodnutí:** `src/server/repo/` je jediné místo, kde se dotazuje na data. UI nesmí importovat `src/db/` ani `src/server/repo/` přímo, jde přes funkce repozitáře. Klient databáze je označen `server-only`, takže chybný import do klientské komponenty spadne už při sestavení.
- **Důsledky:** Změna zdroje dat (například přechod na Postgres) se dotkne jen `src/db/` a `src/server/repo/`; stránky zůstanou. Data se na rozdíl od dřívějšího stavu mění za běhu, proto se vnitřní aplikace vykresluje dynamicky a filtr skladu si data dostává jako propy.

### Peněžní hodnoty jako celé haléře

- **Kontext:** Ceny se sčítají, porovnávají a násobí procenty; float by generoval rozdíly v haléřích.
- **Rozhodnutí:** Typ `Penize` je celé číslo v haléřích. Formátování na českou měnu dělá výhradně `formatCurrency` v `src/lib/format.ts`.
- **Důsledky:** Procenta a poměry jsou výsledek dělení až v okamžiku zobrazení. Procentní sazební výpočty zaokrouhlují na celé haléře (`spocitatDph`).

## Datový model

Návrh je konceptuální. Popisuje entity, jejich pole a vztahy; tabulky odpovídají schématu v `src/db/schema.ts` (viz níže). Každá nová entita musí být zapracována do tohoto oddílu a do [dokumentu funkce](funkce/_template.md), který ji zavádí.

### Component (typ komponenty)

Katalogový typ zboží, ne konkrétní kus.

| Pole            | Typ             | Poznámka |
| --------------- | --------------- | -------- |
| `id`            | id              | Primární klíč |
| `kategorie`     | enum            | Základní rozdělení nabídky (např. procesor, grafická karta, úložiště) |
| `vyrobce`       | text            | Značka |
| `model`         | text            | Obchodní označení modelu |
| `specifikace`   | strukturovaná   | Klíčové parametry dle typu komponenty |

V kódu je `Component` sjednocený typ (diskriminovaný na `kategorie`), takže
`specifikace` má u každé kategorie vlastní tvar — například procesor nese `socket` a `tdp`,
grafická karta `prikonW` a `delkaMm`, základní deska `typRam` a počet slotů M.2. Bez toho
by kontrola kompatibility sestav musela sahat na `any`. Tvar jednotlivých specifikací je v
`src/lib/domain/types.ts`.

### Kus (bazarový kus od výkupu po prodej)

Fyzický kus, který FLIPCORE koupil a který postupuje životním cyklem. Dřívější
`Listing` popisoval nabídku ke koupi, a tím po prodeji zanikal; kus oproti tomu existuje
i po prodeji, aby šlo dohledat jeho historii. Zaveden v [dokumentu funkce 003](funkce/003-kus-a-persistence.md).

| Pole            | Typ            | Poznámka |
| --------------- | -------------- | -------- |
| `id`            | id             | Primární klíč |
| `componentId`   | vazba          | Odkaz na typ komponenty |
| `prodejceId`    | vazba          | Bazar, firma nebo jednotlivec, od kterého byl kus koupen |
| `stav`          | enum           | Životní cyklus, viz níže |
| `nakupniCena`   | celé číslo v haléřích | Výkupní cena, ze které se počítá marže; známa od zápisu výkupu |
| `prodejniCena`  | celé číslo v haléřích, může být `NULL` | Dokud kus není vystaven, prodejní cenu neznáme a marži nepočítáme |
| `datumVykupu`   | datum          | Datum výkupu ve tvaru `RRRR-MM-DD` |
| `vytvorenoKdy`  | čas            | Časová razítka pro řazení a auditaci |

Hodnoty `stav` v pořadí životního cyklu:

| Stav           | Význam                                     | Prodává se |
| -------------- | ------------------------------------------ | ---------- |
| `vykoupeno`    | Kus je ve skladu, nic na něm nebylo provedeno | ne         |
| `v_repasu`     | Probíhá zásah nebo testování                | ne         |
| `ohodnoceno`   | Má stavové hodnocení, ale není vystaven     | ne         |
| `vystaveno`    | Nabízí se v katalogu                         | ano        |
| `rezervovano`  | Vybráno, čeká na kupujícího                 | ne         |
| `prodano`      | Prodáno                                     | ne         |

Prodejní hodnota skladu a marže se počítají jen z kusů ve stavu `vystaveno`; investovaná
hodnota se počítá ze všech kusů, protože odpovídá penězům, které vložil provozovatel.

### ConditionGrade (stavové hodnocení)

Výsledek hodnocení kusu, ne deklarace prodávajícího. Škála a doklady jsou navrženy v [dokumentu funkce repasu](funkce/001-repas-a-stavove-hodnoceni.md).

Vazba na kus je **1:N**, aby bylo možné hodnocení v průběhu času revidovat a neztratit
původní záznam. Aktuální stupeň kusu je hodnocení s nejpozdějším `zhodnocenoKdy`;
repozitář ho doplní při čtení.

| Pole            | Typ            | Poznámka |
| --------------- | -------------- | -------- |
| `id`            | id             | Primární klíč |
| `kusId`         | vazba          | Odkaz na kus, ke kterému hodnocení patří |
| `stupen`        | enum           | Stupeň škály A / B / C / D |
| `popis`         | text           | Zdůvodnění stupně |
| `zhodnocenoKdy` | čas            | Časová razítka; určují, které hodnocení je aktuální |

### RepairTicket (záznam repasu)

Historie zásahů na kus. Vztah ke kusu je 1:N — historie přežívá změnu vlastnictví i opakované zveřejnění.

| Pole          | Typ            | Poznámka |
| ------------- | -------------- | -------- |
| `id`          | id             | Primární klíč |
| `kusId`       | vazba          | Který kus se zásahu týká |
| `typZasahu`   | enum           | Čištění, výměna dílu, oprava, testování |
| `popis`       | text           | Co se udělalo a proč |
| `nahradniDil` | vazba volitelná | Použitý náhradní díl, pokud se měnilo |
| `provedlId`   | vazba          | Kdo zásah provedl |
| `provedenoKdy`| čas            | Časová razítka |

### TestEvidence (důkaz z testu)

Podklady, na kterých stavové hodnocení stojí. Bez nich nelze kus vydávat jako ověřený (viz [vize — principy](vize.md#principy)).

| Pole            | Typ            | Poznámka |
| --------------- | -------------- | -------- |
| `id`            | id             | Primární klíč |
| `kusId`         | vazba          | Který kus se týká důkazu |
| `typTestu`      | enum           | Co se ověřovalo |
| `vysledek`      | enum           | Prošel / Selhal / Částečně |
| `naměřenéHodnoty`| strukturované | Výsledky měření |
| `priloha`       | odkaz na soubor | Snímek nebo výstup testu |
| `provedlKdy`    | čas            | Časová razítka |

### Seller (bazar / prodejce)

Účastník, který vystavuje nabídky.

| Pole            | Typ     | Poznámka |
| --------------- | ------- | -------- |
| `id`            | id      | Primární klíč |
| `nazev`         | text    | Obchodní název |
| `typ`           | enum    | Fyzický bazar nebo jednotlivec |
| `kontakt`       | vazba   | Kontaktní údaje, neverejně přes `User` |

### User

Účet uživatele. Role se řeší odděleně, aby bylo možné přidat role bez změny všech dotazů (viz Otevřené otázky).

| Pole            | Typ     | Poznámka |
| --------------- | ------- | -------- |
| `id`            | id      | Primární klíč |
| `email`         | text    | Unikátní, neverejně |
| `jmeno`         | text    | Zobrazované jméno |
| `role`          | vazba   | Odkaz na roli (pro `User` samostatné `UserRole`) |

### Order (objednávka)

| Pole            | Typ            | Poznámka |
| --------------- | -------------- | -------- |
| `id`            | id             | Primární klíč |
| `kupujiciId`    | vazba          | Odkaz na `User` |
| `polozky`       | vazby          | Viz `BuildItem` a jednotlivé `Kus` |
| `stav`          | enum           | Rozpracováno / Potvrzeno / Doručeno / Zrušeno |
| `celkemCena`    | celé číslo v menší jednotce | Vypočteno serverově, klient ho nemůže změnit |

### Build (sestavená konfigurace)

Konfigurace sestavená z kusů v katalogu, v jedné ze tří cenových kategorií podle [vize](vize.md#cenové-kategorie).

| Pole            | Typ            | Poznámka |
| --------------- | -------------- | -------- |
| `id`            | id             | Primární klíč |
| `kategorie`     | enum           | Základ / Střední / Premium |
| `nazev`         | text           | Název pro zobrazení |
| `celkemCena`    | celé číslo v menší jednotce | Součet cen položek, vypočteno serverově |
| `polozky`       | vazby          | Viz `BuildItem` |
| `platnostKdy`   | čas            | Do kdy je sestava dostupná v dané podobě |

Vztah s `Kus`: sestava odkazuje na konkrétní kusy, které musí být v okamžiku objednávky stále dostupné. Podmínky pro zachování platnosti sestavy jsou otevřená otázka.

### BuildItem (položka sestavy)

| Pole          | Typ            | Poznámka |
| ------------- | -------------- | -------- |
| `id`          | id             | Primární klíč |
| `buildId`     | vazba          | Vztah k sestavě |
| `kusId`       | vazba volitelná | Přímý odkaz na kus ve skladu |
| `nazev`       | text           | Název pozice v sestavě (např. GPU) |
| `cenaSnapshot`| celé číslo v menší jednotce | Cena v okamžiku sestavení, pro auditaci |

`cenaSnapshot` se ukládá, aby bylo dohledatelné, za jakých podmínek byla sestava nabídnuta, i když se cena kusu později změní.

### Přehled vztahů

```
Component 1 --- N Kus
Seller    1 --- N Kus
Kus       1 --- N RepairTicket
Kus       1 --- N TestEvidence
Kus       1 --- N ConditionGrade
User      1 --- N Kus          (jako prodejce)
User      1 --- N Order
Build     1 --- N BuildItem
Kus       1 --- N BuildItem
Order     N --- M Kus          (přes BuildItem)
```

## URL struktura rout

Návrh, připravený pro použití s App Routerem. Skutečné routy vzniknou postupně podle
[ROADMAP.md](../ROADMAP.md); konkrétní cestu zavádí dokument příslušné funkce.

### Veřejná část (plánováno)

| Roura               | Obsah |
| ------------------- | ----- |
| `/`                 | Vstupní stránka s přehledem kategorií a sestav |
| `/katalog`          | Výpis dostupných kusů, filtry dle kategorie a stavu |
| `/katalog/[id]`     | Detail jednoho kusu včetně stavového hodnocení a důkazů |
| `/repas`            | Přehled hodnocených kusů a jejich historie zásahů |
| `/repas/[id]`      | Detail hodnocení: stupně, důkazy, záznamy zásahů |
| `/pc`               | Výběr cenové kategorie |
| `/pc/[kategorie]`   | Nabídka sestav v dané kategorii |
| `/pc/[kategorie]/[id]` | Detail sestavy a jednotlivých položek |
| `/prodejce`         | Profil bazaru nebo prodejce |
| `/moje-ucet`        | Přihlášení, objednávky, nabídky |

### Vnitřní aplikace (existuje, viz [dokument funkce 002](funkce/002-zakladni-sablona-aplikace.md))

| Routa         | Obsah |
| ------------- | ----- |
| `/nastenka`   | Souhrn skladu, financí, objednávek, sestav a posledních zásahů |
| `/sklad`      | Kusy ve skladu s filtrem, marží a rozpadem podle hodnocení |
| `/finance`    | Příjmy, výdaje, DPH a přehled po měsících |
| `/sestavy`    | Sestavy, kontrola kompatibility a porovnání s rozpočtem |
| `/nastaveni`  | Obchod, rozpočty kategorií, DPH a skladová rezerva (jen pro čtení) |

`/` dnes přesměrovává na `/nastenka`. Kam umístit veřejnou část, až přijde, je otevřená
otázka: buď se `/` stane veřejnou stránkou a vnitřní aplikace se přesune na prefix, nebo
zůstanou obě vedle sebe. Viz [Otevřené otázky architektury](#otevřené-otázky-architektury).

## Persistence

Persistence je zvolená: **SQLite přes Drizzle ORM** (`drizzle-orm` + `better-sqlite3`).
Rozhodnutí a jeho důsledky popisuje [ADR 002](adr/002-sqlite-a-drizzle-pro-ukazkove-funkce.md);
původní [ADR 001](adr/001-ukazkova-data-do-dokonceni-funkci.md) byl nahrazen, protože
jeho podmínka — „vše zůstává ukázkové, dokud nebudou fungovat všechny funkce" — se
ukázala nesplnitelná: zápis do statických konstant není možný a aplikace bez zápisu
nemůže mít vlastní data.

Rozvržení vrstev:

| Vrstva                | Obsah                                                                   |
| --------------------- | ----------------------------------------------------------------------- |
| `src/db/schema.ts`    | Drizzle schéma — jediný zdroj pravdy o tvaru dat                       |
| `src/db/client.ts`    | Připojení, `server-only`, automatická aplikace migrací                 |
| `src/db/seed.ts`      | Naplnění ukázkovými daty, **výhradně** ručně přes `pnpm db:seed`     |
| `src/db/seed-data.ts` | Ukázková data jako hodnoty, mimo databázi                               |
| `src/server/repo/`    | Dotazy; UI nesmí sahat na `src/db/` ani na dotazy přímo                |

Pravidla:

- Repozitář vystavuje entity jako objekty, veškerý přístup k datům jde přes `src/server/repo/`.
- Ceny se ukládají jako celé číslo v haléřích, nikoli jako desetinné číslo, aby nevznikaly
  chyby zaokrouhlení. Do databáze se nikdy nezapisuje float.
- Formátování peněz do korun řeší výhradně `src/lib/format.ts`.
- Časová razítka se ukládají v UTC.
- Cizí klíče se v kódu vyjadřují přes sdílené typy, ne jako volné řetězce.
- Ceny sestav a objednávek se počítají na serveru.
- **Databáze startuje prázdná.** Aplikace musí fungovat i bez jediného kusu. Demo data
  se přidávají jedině příkazem `pnpm db:seed`; neexistuje přepínač mezi ukázkovým a
  ostrým režimem, protože by vedl k promísení dat.
- Migrace (`pnpm db:generate`, `pnpm db:migrate`) se commitují. Soubor databáze se nikdy.
- Vnitřní aplikace se vykresluje dynamicky (`export const dynamic = "force-dynamic"`),
  jinak by se stav skladu zapečel do buildu.

Skripty:

| Příkaz             | Účel                                             |
| ------------------ | ------------------------------------------------ |
| `pnpm db:generate` | Vygeneruje migrační SQL ze změn schématu         |
| `pnpm db:migrate`  | Aplikuje migrace na připojenou databázi          |
| `pnpm db:seed`     | Přebije databázi ukázkovými daty                 |
| `pnpm db:studio`   | Prohlížeč pro ruční kontrolu dat                 |

Otevřené otázky k persistence:

- Kdy přejít z SQLite na Postgres a kde běží migrace v prostředí s více instalacemi?
  SQLite má jednoho zapisovatele, což nestačí pro souběžnou rezervaci více kusů.
- Je potřeba plná transakčnost při objednávce, která současně rezervuje více kusů?
- Kam ukládáme přílohy důkazů (TestEvidence) a jak je doručíme klientovi?
- Potřebujeme auditní stopu změn u stavového hodnocení a historie repasu?

## Bezpečnost a tajné env proměnné

- **Validace na hranici.** Vstupní data se ověřují na serveru. Validace pouze v klientu je chybová.
- **Autorizace.** Každý dotaz na data explicitně rozhoduje, zda je požadovaná přihlášenina a zda má daná role přístup. Výchozí stav je odepřen.
- **Ceny.** Cena se nikdy nepřebírá od klienta veřejného košíku — klient posílá jen
  identifikátory a server ceny dopočítá. **Výkupní cena bazarového kusu je výjimka:** jde
  o částku, kterou provozovatel sám zaplatil prodávajícímu, a zadává ji na serveru.
  Server ji proto přijímá ve formuláři, ale vždy ji zvaliduje a uloží sám — nikdy ji
  nepřebírá z klientského košíku a nikdy ji neodvozuje z ceny prodejní.
- **Osobní údaje.** Kontakty se zobrazují v nezbytném rozsahu. Detailní osobní údaje se nepropagují do klientských komponent, pokud nejsou potřeba.
- **Přílohy testů.** Nahrávané soubory se považují za nedůvěryhodné vstup a vyžadují kontrolu typu a velikosti.
- **Tajné env proměnné** se nikdy necommitují a nepropagují do klienta. Ve frontendu jsou přípustné pouze proměnné s prefixem `NEXT_PUBLIC_`.
  - Použité názvy: `DATABASE_URL` (cesta k souboru SQLite, má výchozí hodnotu a v `.env` ji není třeba uvádět).
  - Plánované názvy a účel: `SESSION_SECRET` (podepisování relací), `UPLOAD_STORAGE` (umístění příloh). Na budoucím přechodu na Postgres převezme `DATABASE_URL` connection string, například `postgresql://localhost:5432/flipcore`.
- Obsah `.env` se řídí `.gitignore`; do repozitáře patří pouze `.env.example` s názvy bez hodnot.

## Otevřené otázky architektury

- Který mechanismus přihlášení a rolí použijeme?
- Je potřeba podpora více jazyků rozhraní, nebo začínáme pouze česky? — rozhraní je nyní
  česky a `<html lang="cs">`, ale texty nejsou přeložené, takže plné zvládnutí dalšího
  jazyka je stále otevřené.
- Bude potřeba řešit více trhů nebo měn? (Ovlivňuje zobrazení cen.)
- Která část platformy řeší notifikace a jak?
- Kam přijde veřejný marketplace, až bude hotový: na `/` s vnitřní aplikací na prefixu,
  nebo vedle? Dnes `/` přesměrovává na `/nastenka`.

Poslední aktualizace: 2026-09-29
