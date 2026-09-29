# Název funkce

> Kopie této šablony. Při každé nové funkci:
> 1. zkopíruj soubor jako `docs/funkce/NNN-kebab-nazev.md` (viz [konvence](../README.md#konvence)),
> 2. přečti si celou šablonu a smaž všechny instrukce v kurzívě,
> 3. doplň každou sekci; kde věc neplatí, napiš `Neprozkoumáno` nebo `N/A` s krátkým důvodem — nevynechávej sekci potichu,
> 4. zkontroluj checklist na konci a odškrtni vše, co je splněné.

| Položka        | Hodnota                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| Status          | `Návrh` / `Rozpracováno` / `Náhled` / `V produkci` / `Zastaralé`         |
| Vlastník        | Jméno nebo tým                                                           |
| Datum           | YYYY-MM-DD (datum poslední věcné změny obsahu)                          |
| Oblast          | `marketplace` / `repas` / `pc-build` / `infrastruktura`                 |
| Navazující dokl. | Odkazy na ADR, jiné dokumenty funkce, issue                             |

## Zadání a cíl

Jedna věta: co funkce řeší. Potom kontext: jaký uživatelský problém, proč teď.

Rozsah (scope) a mimo rozsah (non-goals) — co funkce výslovně **ne**dělá.

## Uživatelský příběh

Jako `role` chci `činnost`, abych `výsledek`.

## Scénáře

| # | Jako kdo | Situace | Očekávaný výsledek |
| - | -------- | ------- | ------------------- |
| 1 |          |         |                     |

Uveď i chybové a hraniční scénáře (chybějící údaje, prázdný seznam, selhání externího kroku).

## Datový dopad

Nové entity, změny polí, migrace. Konceptuální návrh entit žije v [architektuře](../architektura.md) — sem odkazuj a neduplikuj definice polí.

- Nové entity: …
- Změny existujících entit: …
- Migrace: …

## API/změny v kódu

- Server Actions / Route Handlers: …
- Server komponenty vs. klient komponenty: …
- Sdílené utility a jejich umístění v `src/lib/`

## UI

- Seznam obrazovek a stavů (prázdný stav, načítání, chyba, úspěch).
- Zdroje dat a způsob načítání.
- Responzivita a přístupnost (klávesnice, kontrast, štítky polí).

## Vývojářské poznámky

- Co je netriviální a vynucuje si to pozornost při revizi.
- Časté chyby, pasti, důležité invarianty.
- Co se nesmí robit (např. obcházet validaci, tahat data do klientské komponenty).

## Testy

| Úroveň       | Co se testuje | Kde |
| ------------ | ------------- | --- |
| Unit         |               |     |
| Integrace    |               |     |
| E2E / ruční  |               |     |

Konvence testů: `cokoliv.test.ts` vedle testovaného souboru (viz kořenové [README](../../README.md#konvence)).

## Bezpečnost a soukromí

- Autorizace: kdo smí data číst a zapisovat.
- Ověření vstupů na hranici (server, ne jen klient).
- Osobní údaje a jejich zpracování.
- Tajné env proměnné — pouze názvy a účel, nikdy hodnoty (viz [architektura](../architektura.md#bezpečnost-a-tajné-env-proměnné)).

## Výkonnost

Očekávané datové objemy, možné úzké hrdla, co se bude měřit. Pokud je potřeba index, cache nebo stránkování, uveď to zde.

## Analytika/telemetrie

Jaké události nebo metriky se sbírají. Pokud se nic nesbírá, napiš to výslovně.

## Známé omezení

Co funkce neumí, kde je zjednodušená a proč.

## Následné kroky

Co navazuje, na co čeká, co je záměrně odloženo.

## Checklist před mergem

- [ ] Dokument vytvořen z této šablony, název ve tvaru `NNN-kebab-nazev.md`
- [ ] Sekce `Datový dopad` a `API/změny v kódu` odpovídají skutečnosti
- [ ] Status a Datum aktualizované
- [ ] `docs/README.md` obsahuje řádek s tímto dokumentem, pokud je v mapě uveden
- [ ] `docs/architektura.md` aktualizovaný, pokud vznikla nová entita, vrstva, routa nebo bezpečnostní požadavek
- [ ] `ROADMAP.md` aktualizovaný
- [ ] Důležité technické rozhodnutí zapsáno jako ADR v `docs/adr/`
- [ ] `pnpm check` prochází (lint, typecheck, testy)
- [ ] Patička `Poslední aktualizace: YYYY-MM-DD` odpovídá dnešnímu datu

Poslední aktualizace: 2026-09-29
