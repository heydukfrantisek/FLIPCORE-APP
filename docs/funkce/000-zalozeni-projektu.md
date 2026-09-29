# 000: Založení projektu

| Položka         | Hodnota                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| Status          | V produkci                                                                   |
| Vlastník        | Tým FLIPCORE                                                                |
| Datum           | 2026-09-29                                                                  |
| Oblast          | infrastruktura                                                               |
| Navazující dokl. | [ADR 000](../adr/README.md#000-základní-stack)                           |

> Referenční vyplněný dokument. Slouží jako vzor, jak má ostatní dokumenty vypadat. Vznikl jako souhrn toho, co je v repu dnes; nevznikal podle [šablony](_template.md), proto je u něj několik sekací zkráceno. Všechny věty níže popisují skutečný stav repozitáře.

## Zadání a cíl

Založit opakovatelný základ projektu: aplikaci, která se dá lokálně spustit jedním příkazem a automaticky ověřit kódem (lint, typy, testy, build) v CI. Základ slouží jako podložka pro budoucí funkce FLIPCORE (viz [vize](../vize.md)); zatím neobsahuje žádnou produktovou funkci.

Rozsah: scaffold aplikace, konfigurace nástrojů, jednotka testů, kontinuáční integrace, licence a příspěvkové pravidla.

Mimo rozsah: jakákoli doménová logika, databáze, přihlášení, design UI. Záměrem nebylo ani tyto oblasti předjímat.

## Uživatelský příběh

Jako vývojář FLIPCORE chci po naklonování repozitáře spustit aplikaci a stejnými příkazy ji ověřit lokálně i v CI, abych nemusel zjišťovat, kde se co kontroluje.

## Scénáře

| # | Jako kdo     | Situace                                                        | Očekávaný výsledek                                   |
| - | ------------ | -------------------------------------------------------------- | ----------------------------------------------------- |
| 1 | Vývojář      | Spustí `pnpm install` a `pnpm dev`                             | Aplikace běží na `http://localhost:3000`             |
| 2 | Vývojář      | Spustí `pnpm check` před pushem                                | Projdou lint, typecheck a testy                      |
| 3 | Vývojář      | Otevře PR                                                       | CI na Node 22 projde ve stejném pořadí                |
| 4 | Vývojář      | Chce přispět                                                    | Najde postup v `CONTRIBUTING.md` a pravidla v `AGENTS.md` |
| 5 | Vývojář      | Není si jistý formátem                                         | Nahlédne do `docs/funkce/000-zalozeni-projektu.md`     |

## Datový dopad

Žádný. Repozitář nemá datovou vrstvu a záměrně ji zatím neobsahuje; výběr persistence je otevřená otázka popsaná v [architektuře](../architektura.md#persistence).

## API/změny v kódu

- `src/app/layout.tsx` a `src/app/page.tsx` — výchozí routa s kořenovým layoutem.
- `src/app/globals.css` — globální styly a import Tailwindu.
- `src/lib/format.ts` — `formatCurrency` pro formátování peněžních částek v češtém prostředí (CZK, vstup v nejmenší jednotce).
- `src/lib/format.test.ts` — testy k `formatCurrency`.
- `package.json` — definice skriptů a fixovaná verze balíčkového managera.
- `tsconfig.json` — přísné typování, alias `@/*` na `src/*`.
- `eslint.config.mjs` — ESLint 9 ve flat konfiguraci, sdílená pravidla s Next.js.
- `vitest.config.mts` — Vitest s prostředím jsdom a aliasem shodným s TypeScriptem.
- `next.config.ts`, `postcss.config.mjs` — výchozí konfigurace frameworku a zpracování stylů.
- `.github/workflows/ci.yml` — pipeline na Node 22: lint, typecheck, testy, build.

## UI

Kořenová stráka je záměrně minimální: rozlišení serverové a klientské komponenty jako vzor, žádné produktové obrazovky. Vizuální jazyk je zatím neformální.

## Vývojářské poznámky

- Skript `typecheck` nejprve generuje typy Next.js (`next typegen`) a teprve potom spouští `tsc --noEmit`. Nahradit vlastním `tsc` voláním by znamenalo obejít generované typy rout.
- `check` je záměrná agregace tří kontrol, aby je vývojář nemusel pamatovat.
- Testy leží vedle testovaného souboru, ne ve složce `tests/`.
- `AGENTS.md` obsahuje pravidla pro práci s AI agenty v repu, včetně pravidla, že Next.js verze v repu může mít breaking changes oproti běžné dokumentaci.

## Testy

| Úroveň      | Co se testuje                                    | Kde                     |
| ----------- | ------------------------------------------------ | ----------------------- |
| Unit        | Formátování peněžní částky                      | `src/lib/format.test.ts` |
| Integrace   | Nic, aplikace zatím nemá datovou vrstvu          | —                       |
| E2E / ruční | Aplikace se načte a stránka je dostupná          | Ručně přes `pnpm dev`   |

## Bezpečnost a soukromí

- Žádná tajná data v repu, `.env` je v `.gitignore`.
- Zatím nejsou použity žádné env proměnné ani tajné klíče; seznam plánovaných názvů je v [architektuře](../architektura.md#bezpečnost-a-tajné-env-proměnné).
- Žádný sběr osobních údajů ani externí požadavky.

## Výkonnost

Není relevantní: stránka je statická, bez datové vrstvy a bez externích závislostí.

## Analytika/telemetrie

Žádná. Sledování není součástí scaffoldu; co se bude měřit, rozhodne dokument konkrétní funkce.

## Známé omezení

- Není datová vrstva, přihlášení, žádné doménové entity.
- Kořenová stránka je jen technický vzor, ne produktová nabídka.
- Chybí README sekce o nasazení, ta je záměrně TODO do rozhodnutí cílové platformy.

## Následné kroky

- Rozhodnout o persistence (viz otevřené otázky v [architektuře](../architektura.md#persistence)) a zapsat ADR.
- První doménová funkce: [repas a stavové hodnocení](001-repas-a-stavove-hodnoceni.md).
- Doplnit nasazení do kořenového README, jakmile bude cílová platforma rozhodnuta.

## Checklist před mergem

- [x] Dokument existuje a je odkázán z `docs/README.md`
- [x] Obsah odpovídá skutečnému stavu repozitáře
- [x] `pnpm check` prochází
- [x] Odkazy na existující soubory jsou platné
- [x] Patička s datem

Poslední aktualizace: 2026-09-29
