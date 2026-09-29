# Architektura

> Technický návrh systému. Produktové záměry a pravidla tvorby katalogu jsou v [vizi](vize.md), konkrétní změny v jednotlivých funkcích v [dokumentech funkce](funkce/). Uspořádání práce a priority v čase drží [ROADMAP.md](../ROADMAP.md).
>
> Poznámka k stavu: repozitář obsahuje scaffold aplikace (viz [dokument funkce 000](funkce/000-zalozeni-projektu.md)) a vnitřní šablonu aplikace nad ukázkovými daty (viz [dokument funkce 002](funkce/002-zakladni-sablona-aplikace.md)). Části tohoto dokumentu označené jako plánované jsou návrh a nepopisují existující kód.

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

### Dočasná datová vrstva v `src/server/repo/data.ts`

- **Kontext:** Persistence není rozhodnuta, ale bez dat se nedá navrhnout ani otestovat rozhraní.
- **Rozhodnutí:** `src/server/repo/` vrací data z ukázkových konstant v `data.ts`. UI nesmí importovat `data.ts` přímo, jde přes funkce repozitáře.
- **Důsledky:** Při zvolení persistence se mění jen `src/server/repo/`, stránky zůstávají. Data jsou statická a nejsou serializovatelná pro klientské komponenty — filtr skladu si je proto předává stránka jako propy.

### Peněžní hodnoty jako celé haléře

- **Kontext:** Ceny se sčítají, porovnávají a násobí procenty; float by generoval rozdíly v haléřích.
- **Rozhodnutí:** Typ `Penize` je celé číslo v haléřích. Formátování na českou měnu dělá výhradně `formatCurrency` v `src/lib/format.ts`.
- **Důsledky:** Procenta a poměry jsou výsledek dělení až v okamžiku zobrazení. Procentní sazební výpočty zaokrouhlují na celé haléře (`spocitatDph`).

## Datový model

Návrh je konceptuální. Popisuje entity, jejich pole a vztahy; konkrétní implementace závisí na nerozhodnuté otázce persistence (viz níže). Každá nová entita musí být zapracována do tohoto oddílu a do [dokumentu funkce](funkce/_template.md), který ji zavádí.

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

### Listing (nabídka konkrétního kusu)

Nabídka, kterou prodávající vystaví, včetně stavu a ceny.

| Pole             | Typ            | Poznámka |
| ---------------- | -------------- | -------- |
| `id`             | id             | Primární klíč |
| `componentId`    | vazba          | Odkaz na typ komponenty |
| `prodejceId`     | vazba          | Odkaz na bazar nebo prodejce |
| `stavHodnoceniId`| vazba          | Odkaz na stavové hodnocení, viz níže |
| `cena`           | celé číslo v menší jednotce | Peněžní hodnota nabídky |
| `nakupniCena`    | celé číslo v menší jednotce | Výkupní cena, ze které se počítá marže |
| `popis`          | text           | Volný popis stavu, může být prázdný |
| `dostupnost`     | enum           | Dostupné / rezervované / prodané |
| `vytvorenoKdy`   | čas            | Časová razítka pro řazení a auditaci |

### ConditionGrade (stavové hodnocení)

Výsledek hodnocení kusu, ne deklarace prodávajícího. Škála a doklady jsou navrženy v [dokumentu funkce repasu](funkce/001-repas-a-stavove-hodnoceni.md).

| Pole            | Typ            | Poznámka |
| --------------- | -------------- | -------- |
| `id`            | id             | Primární klíč |
| `stupen`        | enum           | Stupeň škály (navrženo A / B / C / D) |
| `posuzovaloId`  | vazba          | Kdo hodnocení provedl |
| `dokladyId`     | vazby          | Odkazy na důkazy (TestEvidence) |
| `zhodnocenoKdy` | čas            | Časová razítka |

### RepairTicket (záznam repasu)

Historie zásahů na kus. Vztah k nabídce je 1:N — historie přežívá změnu vlastnictví i opakované zveřejnění.

| Pole          | Typ            | Poznámka |
| ------------- | -------------- | -------- |
| `id`          | id             | Primární klíč |
| `listingId`   | vazba          | Který se kus týká |
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
| `listingId`     | vazba          | Který se kus týká |
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
| `polozky`       | vazby          | Viz `BuildItem` a jednotlivé `Listing` |
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

Vztah s `Listing`: sestava odkazuje na konkrétní kusy, které musí být v okamžiku objednávky stále dostupné. Podmínky pro zachování platnosti sestavy jsou otevřená otázka.

### BuildItem (položka sestavy)

| Pole          | Typ            | Poznámka |
| ------------- | -------------- | -------- |
| `id`          | id             | Primární klíč |
| `buildId`     | vazba          | Vztah k sestavě |
| `listingId`   | vazba volitelná | Přímý odkaz na kus v katalogu |
| `nazev`       | text           | Název pozice v sestavě (např. GPU) |
| `cenaSnapshot`| celé číslo v menší jednotce | Cena v okamžiku sestavení, pro auditaci |

`cenaSnapshot` se ukládá, aby bylo dohledatelné, za jakých podmínek byla sestava nabídnuta, i když se cena kusu později změní.

### Přehled vztahů

```
Component 1 --- N Listing
Seller    1 --- N Listing
Listing   1 --- N RepairTicket
Listing   1 --- N TestEvidence
Listing   1 --- 1 ConditionGrade
User      1 --- N Listing      (jako prodejce)
User      1 --- N Order
Build     1 --- N BuildItem
Listing   1 --- N BuildItem
Order     N --- M Listing      (přes BuildItem)
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
| `/sklad`      | Katalog kusů s filtrem, marží a rozpadem podle stavu |
| `/finance`    | Příjmy, výdaje, DPH a přehled po měsících |
| `/sestavy`    | Sestavy, kontrola kompatibility a porovnání s rozpočtem |
| `/nastaveni`  | Obchod, rozpočty kategorií, DPH a skladová rezerva (jen pro čtení) |

`/` dnes přesměrovává na `/nastenka`. Kam umístit veřejnou část, až přijde, je otevřená
otázka: buď se `/` stane veřejnou stránkou a vnitřní aplikace se přesune na prefix, nebo
zůstanou obě vedle sebe. Viz [Otevřené otázky architektury](#otevřené-otázky-architektury).

## Persistence

Datová persistence není rozhodnutá. Repo záměrně neobsahuje žádný výběr databáze ani klienta, aby se nerozhodlo předtím, než je známo, jaké dotazy a objemy budeme potřebovat.

Následující je plánovaný model, ne implementace:

- Repozitář vystavuje entity jako objekty, veškerý přístup k datům jde přes `src/server/repo/`.
- Ceny se ukládají jako celé číslo v nejmenší jednotce, nikoli jako desetinné číslo, aby nevznikaly chyby zaokrouhlení.
- Časová razítka se ukládají v UTC.
- Cizí klíče se v kódu vyjadřují přes sdílené typy, ne jako volné řetězce.
- Ceny sestav a objednávek se počítají na serveru.

Otevřené otázky k persistence:

- Který typ databáze a jaký klient (včetně ORM nebo dotazovacího builderu) použijeme?
- Je potřeba plná transakčnost při objednávce, která současně rezervuje více kusů?
- Kam ukládáme přílohy důkazů (TestEvidence) a jak je doručíme klientovi?
- Potřebujeme auditní stopu změn u stavového hodnocení a historie repasu?
- Kde běží migrace a jak se řídí v prostředí s více instalacemi?

## Bezpečnost a tajné env proměnné

- **Validace na hranici.** Vstupní data se ověřují na serveru. Validace pouze v klientu je chybová.
- **Autorizace.** Každý dotaz na data explicitně rozhoduje, zda je požadovaná přihlášenina a zda má daná role přístup. Výchozí stav je odepřen.
- **Ceny.** Cena se nikdy nepřebírá od klienta. Klient posílá jen identifikátory, server ceny dopočítá.
- **Osobní údaje.** Kontakty se zobrazují v nezbytném rozsahu. Detailní osobní údaje se nepropagují do klientských komponent, pokud nejsou potřeba.
- **Přílohy testů.** Nahrávané soubory se považují za nedůvěryhodné vstup a vyžadují kontrolu typu a velikosti.
- **Tajné env proměnné** se nikdy necommitují a nepropagují do klienta. Ve frontendu jsou přípustné pouze proměnné s prefixem `NEXT_PUBLIC_`.
  - Použité názvy: žádné.
  - Plánované názvy a účel: `DATABASE_URL` (připojení k databázi), `SESSION_SECRET` (podepisování relací), `UPLOAD_STORAGE` (umístění příloh). Názvy jsou návrh, do použití vstupují až se zvolenou persistence a přihlášením.
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
