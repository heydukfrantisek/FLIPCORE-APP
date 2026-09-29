# ADR: zaznamenávání architektonických rozhodnutí

## Co je ADR

ADR (Architecture Decision Record) je krátký záznam jednoho rozhodnutí, které v projektu těžko obrátíme. Zachycuje, v jakém kontextu rozhodnutí vzniklo, co přesně jsme se rozhodli a jaké to má následky — včetně těch nepříjemných. Cílem není popsat systém, ale uchovat důvod, proč systém vypadá tak, jak vypadá.

ADR se píše, když rozhodnutí:

- mění směr projektu (například výběr frameworku, databáze, modelu autorizace),
- zavádí závislost, kterou půjde obtížně vyměnit,
- vylučuje reálné alternativy,
- řeší problém, který by bez zápisu po půl roce nikdo nepochopil.

ADR se **nepíše** kvůli každému drobnému detailu. Drobnosti patří do [dokumentu funkce](../funkce/_template.md) nebo do [architektury](../architektura.md).

## Zásady

- Jeden soubor = jedno rozhodnutí. Výjimkou je téma, které je nutné chápat jako celek.
- Text se po rozhodnutí už nevlastní. Chybný ADR se nahradí novým, který odkazuje na ten předchozí a uvádí důvod změny.
- Formát je pevný, aby šly záznamy skenovat.
- Žádné HTML, žádné emoji, čeština, název souboru v `kebab-case.md`.

## Šablona

```markdown
# ADR NNN: Krátký název rozhodnutí

- Status: Navrženo | Přijato | Nahrazeno ADR NNN
- Datum: YYYY-MM-DD
- Dotýká se: oblast (např. persistence, UI, bezpečnost)

## Kontext

Jakou situaci řešíme. Jaké jsme měli možnosti a proč vznikla potřeba
rozhodnout právě teď. Bez znalosti kódu, jen fakta a omezení.

## Rozhodnutí

Co přesně jsme se rozhodli. Jednoznačná formulace ve třetí osobě,
aby šlo později vyhledat „co jsme se rozhodli udělat".

## Důsledky

- Co to přináší (pozitivní).
- Co to znamená nevýhodně a co tím ztrácíme.
- Co tím nejisté zůstává a kdy je nutné rozhodnutí přezkoumat.
- Jaké změny v kódu nebo konfiguraci z toho přímo vyplývají.
```

## Index rozhodnutí

| Číslo | Téma                              | Status    | Datum       | Soubor                       |
| ----- | --------------------------------- | --------- | ----------- | ---------------------------- |
| 000   | Základní stack                   | Přijato   | 2026-09-29 | inline šablona níže         |
| 001   | Ukázková data do dokončení funkcí | Nahrazeno | 2026-09-29 | [001-ukazkova-data-do-dokonceni-funkci.md](001-ukazkova-data-do-dokonceni-funkci.md) |
| 002   | SQLite a Drizzle pro ukázkovou funkci výkupu | Přijato | 2026-09-29 | [002-sqlite-a-drizzle-pro-ukazkove-funkce.md](002-sqlite-a-drizzle-pro-ukazkove-funkce.md) |
| 003   | Přihlášení a model rolí           | Navrženo  |             | zatím nevytvořeno            |
| 004   | Ukládání příloh testů            | Navrženo  |             | zatím nevytvořeno            |

Řádky 003 a 004 odpovídají otevřeným otázkám v [architektuře](../architektura.md).
Zatím nevytvořený záznam vznikne v okamžiku, kdy bude otázka rozhodnuta, a řádek se
doplní o odkaz na soubor. Otázka databáze a persistence byla rozhodnuta v ADR 002:
SQLite přes Drizzle, prázdná databáze a demo data výhradně přes `pnpm db:seed`.

## 000: Základní stack

- Status: Přijato
- Datum: 2026-09-29
- Dotýká se: celého projektu

### Kontext

Projekt začíná jako prázdný základ. Potřebujeme sadu technologií, která podporuje rychlý vývoj, silné statické typování, jednoduché testování a automatizovanou kontrolu kvality v CI. Výběr proběhl bez porovnávání více kandidátů, protože zvolená sada odpovídá obvyklé praxi pro Next.js a projekt nemá výjimečné požadavky, které by ji zpochybňovaly.

### Rozhodnutí

- Next.js 16 s App Routerem a React 19 jako aplikační a UI vrstva.
- TypeScript v režimu `strict` jako jediný jazyk pro kód aplikace.
- Tailwind CSS 4 pro styly.
- Vitest s prostředím jsdom pro testy, konfigurace v `vitest.config.mts`.
- pnpm jako balíčkový manager, verze fixovaná přes `packageManager`.
- Alias `@/*` mapující na `src/*`, definovaný v `tsconfig.json`.
- Node.js 22 v CI, kontroly v pořadí lint, typecheck, testy, build.

### Důsledky

- Aplikace má jedno místo, kde se front end, serverová logika a budoucí datová vrstva setkávají, a jednu sadu nástrojů pro celý životní cyklus.
- Striktní typování a `typecheck` v CI znamenají, že chyby v typech blokují merge. To je zamýšleno, i když to zpočátku prodlužuje implementaci.
- Nevýhodou je nevratnost volby frameworku: přechod na jiný řešení by byl drahý. Proto je tento záznam součástí indexu a nová funkce, která by sáhla na základní stack, musí doplnit nový ADR.
- Volba persistence, přihlášení a rolí zůstává otevřená; do té doby se v kódu neobjeví žádná vazba na konkrétní databázovou službu.

Poslední aktualizace: 2026-09-29
