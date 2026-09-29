# Základní šablona aplikace (nástěnka, sklad, finance, sestavy, nastavení)

| Položka         | Hodnota                                                                                |
| --------------- | -------------------------------------------------------------------------------------- |
| Status          | `Náhled`                                                                                |
| Vlastník        | FLIPCORE                                                                                |
| Datum           | 2026-09-29                                                                            |
| Oblast          | `infrastruktura`                                                                        |
| Navazující dokl. | [architektura](../architektura.md), [vize](../vize.md), [ROADMAP](../../ROADMAP.md) |

## Zadání a cíl

Šablona vnitřní aplikace FLIPCORE — kostra s pěti sekcemi, na kterou se navážou další
funkce. Řeší otázku „kam v aplikaci co patří“ dřív, než vznikne první obrazovka s reálnými
daty, a drží jednotný vizuální jazyk pro všechny další obrazovky.

Rozsah: navigace mezi pěti sekcemi, přehledové karty, tabulkový výpis skladu s filtrem,
přehled financí, seznam sestav s kontrolou kompatibility a read-only nastavení.

Mimo rozsah: zápis dat, přihlášení, persistence, detail jednoho kusu, konfigurátor sestav,
nákupní košík. To vše je plánováno v [ROADMAP](../../ROADMAP.md).

## Uživatelský příběh

Jako `provozovatel FLIPCORE` chci `mít všechny sekce dostupné z jednoho místa`, abych
`viděl stav obchodu bez hledání v jednotlivých nástrojích`.

## Scénáře

| # | Jako kdo          | Situace                                                     | Očekávaný výsledek                                                        |
| - | ----------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1 | Provozovatel      | Otevře `/`                                                   | Přesměrování na `/nastenka`                                               |
| 2 | Provozovatel      | Prokliká sekci v menu                                        | Aktivní sekce je zvýrazněna (`aria-current="page"`)                       |
| 3 | Provozovatel      | Otevře nástěnku s prázdným skladem                          | Karty s nulami, u seznamů prázdný stav s českou hláškou, žádná výjimka      |
| 4 | Provozovatel      | Na skladu zadá neexistující výraz do hledání                | Prázdný stav „Žádné kusy neodpovídají filtru“, počet zobrazených kusů       |
| 5 | Provozovatel      | Na sestavě s nesouladem (např. DDR4 v desce s DDR5)         | Odstavec „Co je potřeba opravit“ s konkrétním seznamem problémů             |
| 6 | Provozovatel      | Otevře nastavení                                            | Pole jen pro čtení, výslovně uvedeno, co ještě není napojeno              |
| 7 | Provozovatel      | Otevře stránku na úzkém displeji                            | Postranní menu se přesune nad obsah, obsah zůstává čitelný                |

Chybové scénáře: u dat v `src/server/repo` chybí vazba (např. chybějící prodejce) se
nabídka tiše vyřadí, aby se neukázal kus bez kontextu. V reálné persistence to bude
odložená relace, viz [architektura](../architektura.md#datovy-model).

## Datový dopad

- Nové entity: žádné. Všechny typy už jsou v [architektuře](../architektura.md#datovy-model),
  tato funkce je jen čte.
- Změny existujících entit: `Kus` dostal pole `nakupniCena` (výkupní cena) — bez ní
  nešel spočítat skladový přehled a marže.
- Migrace: neprobíhají, data jsou ukázková v `src/server/repo/data.ts`.

## API/změny v kódu

- Server Actions / Route Handlers: žádné, funkce je read-only.
- Server komponenty: všechny stránky i `Kostra`. Klientská je jen `Navigace` (kvůli
  `usePathname`) a `FiltrSkladu` (kvůli stavu filtru).
- Sdílené utility v `src/lib/`:
  - `src/lib/domain/types.ts` — typy entit a `Penize` (celé číslo v haléřích),
  - `src/lib/domain/sklad.ts` — marže, filtrování, řazení, přehled skladu,
  - `src/lib/domain/finance.ts` — příjmy, výdaje, DPH, rozpad po měsících,
  - `src/lib/domain/sestavy.ts` — kompatibilita sestavy, spotřeba, rozpočet,
  - `src/lib/domain/slovnik.ts` — české popisky hodnot,
  - `src/lib/format.ts` — formátování měny, čísla, procent a data.

## UI

Obrazovky: `/nastenka`, `/sklad`, `/finance`, `/sestavy`, `/nastaveni`. Každá má hlavní
název, čtyři souhrnné karty a panely s tabulkami. Stavy: prázdný stav má každý seznam,
stav načítání a chyby řeší až persistence (viz omezení).

Přístupnost: menu má `aria-label`, aktivní položka `aria-current="page"`, tabulky mají
`scope="col"` na hlavičkách, ikony jsou `aria-hidden`. Responzita: postranní menu se od
`lg` schová a zůstane jako vodorovné menu nad obsahem.

## Vývojářské poznámky

- Ceny jsou celé haléře. `formatCurrency` dělí stem, sčítání nikdy nepracuje s floaty.
- `FiltroSkladu` je klientská komponenta, ale pravidla filtru neopakuje — volá
  `filtrovatSklad` a `raditSklad` z `src/lib`. Data dostává jako propy ze serveru.
- `MapaKomponent` mapuje **ID kusu** na katalogovou komponentu, ne ID komponenty.
  Sestava totiž odkazuje na konkrétní kus.
- Disky se v sestavě mohou opakovat (`JEDNOUCNE_POZICE` je neobsahuje), ostatní pozice ne.
- `src/server/repo/data.ts` je dočasná databáze. Nesmí se do ní importovat z klientské
  komponenty.

## Testy

| Úroveň      | Co se testuje                                                                          | Kde                                     |
| ----------- | --------------------------------------------------------------------------------------- | ---------------------------------------- |
| Unit        | marže, filtrování, řazení, přehled skladu, DPH, rozpad po měsících, kompatibilita sestavy | `src/lib/domain/*.test.ts` (65 testů)   |
| Integrace   | N/A — repo vrstva je náhrada databáze, testovat bez persistence nemá co ověřit            | —                                        |
| E2E / ruční | Průchod všech pěti sekcemi v `pnpm dev`, přesměrování z `/`, filtr na skladu            | Ručně, zapsat kdo a kdy v `ROADMAP.md` |

## Bezpečnost a soukromí

- Autorizace: N/A — aplikace zatím nemá přihlášení. Při jeho doplnění musí každá repo
  funkce explicitně ověřit roli; výchozí stav je odepřen.
- Ověření vstupů: N/A, funkce nic nezapisuje.
- Osobní údaje: v ukázkových datech jsou pouze názvy prodejců, žádné kontakty.
- Tajné env proměnné: žádné, funkce si žádné nepoužívá.

## Výkonnost

Všechny stránky jsou staticky předrenderované a data jsou v paměti. Se skutečnou
persistencí budou náročné přehledy nad skladem a financemi — počítat se musí s indexem
na stav kusu a stránkováním. Zatím se nic nestřídá, stránkování ani cache nejsou
potřeba.

## Analytika/telemetrie

Nic se nesbírá.

## Známé omezení

- Data jsou ukázková, po restartu dev serveru se nemění (nezapisují se).
- Nastavení je read-only, chybí uložení i přihlášení.
- Filtr skladu běží až po načtení stránky, u velkého katalogu bude potřeba filtrovat na
  serveru.
- Kontrola kompatibility sestav je pravidlová, ne plnoúčinná — neřeší například
  chlazení konkrétního CPU nad TDP, pokud to není v `podporovaneSockety`.

## Následné kroky

- Persistence (blokuje zápis dat) — záměrně odloženo, viz
  [ADR 001](../adr/001-ukazkova-data-do-dokonceni-funkci.md). Do té doby žádná nová
  funkce nezapisuje data.
- Přihlášení a role, aby šlo nastavení měnit a data chránit.
- Detail kusu a detail sestavy jako další routy.
- Rozhodnout, zda veřejný marketplace půjde do `/` (dnes tam je přesměrování na nástěnku)
  — otevřená otázka v architektuře.

## Checklist před mergem

- [x] Dokument vytvořen z této šablony, název ve tvaru `NNN-kebab-nazev.md`
- [x] Sekce `Datový dopad` a `API/změny v kódu` odpovídají skutečnosti
- [x] Status a Datum aktualizované
- [x] `docs/README.md` obsahuje řádek s tímto dokumentem
- [x] `docs/architektura.md` aktualizovaný — vznikly nové routy, složka `src/components` a datová vrstva
- [x] `ROADMAP.md` aktualizovaný
- [x] Důležité technické rozhodnutí zapsáno jako ADR v `docs/adr/` —
      [ADR 001](../adr/001-ukazkova-data-do-dokonceni-funkci.md) popisuje, proč aplikace
      běží na ukázkových datech a proč se persistence zatím nezavádí
- [x] `pnpm check` prochází (lint, typecheck, testy)
- [x] Patička `Poslední aktualizace: YYYY-MM-DD` odpovídá dnešnímu datu

Poslední aktualizace: 2026-09-29
