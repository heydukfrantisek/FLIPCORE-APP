# 004: Evidence výkupu

| Položka         | Hodnota                                                                                |
| --------------- | -------------------------------------------------------------------------------------- |
| Status          | `Rozpracováno`                                                                         |
| Vlastník        | FLIPCORE                                                                                |
| Datum           | 2026-09-29                                                                            |
| Oblast          | sklad, zápis dat                                                                        |
| Navazující dokl. | [003 — Kus a persistence](003-kus-a-persistence.md), [ADR 002](</docs/adr/002-sqlite-a-drizzle-pro-ukazkove-funkce.md>), [architektura](../architektura.md) |

## Zadání a cíl

Umožnit provozovateli zapsat výkup bazarového kusu. Jde o **první zápis dat
v aplikaci** — dosud se pouze četlo, takže všechno, co dnes ukazuje sklad, bylo
ukázkové.

Výkup je začátek životního cyklu kusu: kus vznikne ve stavu `vykoupeno`, bez prodejní
ceny a bez hodnocení. Obojí se doplní až po repasi (viz [001](001-repas-a-stavove-hodnoceni.md)).

Rozsah: formulář, validace, serverová akce, zápis kusu a případně nového prodejce.

Mimo rozsah: zadávání zásahů, hodnocení, vystavení kusu, editace a mazání kusů.

## Uživatelský příběh

Jako `provozovatel FLIPCORE` chci `zapsat kus, který právě koupil`, abych `měl
odpověď na otázku, co ve skladu mám a za kolik jsem to platil`.

## Uživatelské rozhodnutí v této iteraci

Zatím co chybí

- **Nový typ komponenty do katalogu.** Formulář umožňuje vybrat jen existující
  katalogovou komponentu. Co když provozovatel koupí něco, co v katalogu není, musí
  dnes nejdřív ručně upravit seed. Toto je omezení, které bude nutné dořešit — viz
  [Známé omezení](#známá-omezení).
- **Vymazání a oprava zapsaného kusu.** Chybně zapsaný výkup nelze opravit jinak než
  přímou opravou databáze.

## Scénáře

| # | Jako kdo     | Situace                                          | Očekávaný výsledek |
| - | ------------ | ------------------------------------------------ | ------------------- |
| 1 | Provozovatel | Otevře `/sklad` a vyplní typ komponenty, prodejce, výkupní cenu a datum | Kus se uloží se stavem `vykoupeno`, zobrazí se v tabulce skladu a v přehledu investované hodnoty |
| 2 | Provozovatel | Vybere existujícího prodejce                     | Kus se přiřadí k němu, nový prodejce nevzniká |
| 3 | Provozovatel | Zvolí „nový prodejce" a vyplní název a typ       | Prodejce vznikne a použije se i pro další výkupy |
| 4 | Provozovatel | Zadá výkupní cenu s desetinnou čárkou nebo mezerami (`1 600,50`) | Cena se uloží jako `160050` haléřů |
| 5 | Provozovatel | Zadá zápornou, nulovou nebo nečíselnou cenu        | Formulář to odmítne, chyba se zobrazí u políčka, **nic se neuloží** |
| 6 | Provozovatel | Zadá datum v budoucnu                            | Formulář to odmítne |
| 7 | Provozovatel | Odešle prázdný formulář                          | Chyby u jednotlivých polí, ne celá stránka spadne |
| 8 | Provozovatel | Přidá kus a hned odešle formulář znovu           | Uživatel nezablokuje tlačítko, dva kusy se neuloží zdvojeně |
| 9 | Provozovatel | Pracuje s prázdnou databází                      | Formulář nabízí i prázdný seznam prodejců, jde založit první kus |

## Datový dopad

- Nové tabulky: žádné. `kus` a `seller` už existují z [003](003-kus-a-persistence.md).
- Změny schématu: žádné, migrace není potřeba.
- Nové sloupce: žádné.
- Nová ID: kus i nový prodejce dostávají ID generované na serveru, ne z klienta.

## API/změny v kódu

- `src/lib/domain/vykup.ts` — schémata Zod a čistá převodní logika z `FormData` na
  doménové hodnoty. Bez importu databáze, proto se to testuje bez serveru a jde to
  použít i na klientě.
- `src/server/actions/vykup.ts` — `zapsatVykup`, serverová akce. Volá repozitář,
  zapisuje v transakci a po zápisu volá `revalidatePath`.
- `src/components/formular-vykupu.tsx` — klientská komponenta s `useActionState`,
  zobrazuje chyby u jednotlivých polí a stav `pending`.
- `src/app/(app)/sklad/page.tsx` — panel s formulářem nad seznamem kusů.
- `src/server/repo/index.ts` — `zalozitVykup`, jediná nová zápisová funkce v
  repozitáři; spolu s novým prodejcem běží v jedné transakci.

## UI

Formulář v panelu nad tabulkou skladu. Pole:

| Pole            | Typ             | Poznámka |
| --------------- | --------------- | -------- |
| Komponenta      | výběr           | Z katalogu `component`, seskupeno podle kategorie |
| Prodejce        | výběr           | Existující prodejci + volba „nový prodejce" |
| Název prodejce  | text            | Zobrazí se, jen když je zvolen nový prodejce |
| Typ prodejce    | výběr           | Bazar / firma / jednotlivec |
| Výkupní cena    | text            | Zadává se v korunách, ukládá v haléřích |
| Datum výkupu    | datum           | Česko, dnes až do minulosti |

Po úspěšném uložení zůstane formulář prázdný a připravený na další výkup — bazar jich
za den zaznamená víc. Chyby se vracejí do UI jako návratová hodnota akce, nikoli jako
vyhozená výjimka, aby rozbitý formulář nespadl celou stránkou.

## Vývojářské poznámky

- **Cena se zadává v korunách, ukládá v haléřích.** Převod musí snést české zadávání:
  desetinnou čárku, mezery jako oddělovač tisíců i obojí naráz. Záporná čísla, nula,
  tři desetinná místa i nečíselný text jsou chyba.
- **Klient neposílá ID kusu ani cenu z katalogu.** Server si prodejce ověří sám:
  pokud ID neexistuje, výkup se odmítne. Cena kusu se odvozuje z katalogu až na
  serveru.
- **Nový prodejce a kus vznikají v jedné transakci.** Jedno bez druhého by zanechalo
  v databázi odkaz na nic.
- Serverová akce ověří všechna pole **znovu**, i když má klient HTML `required` a
  `max`; klientská validace je pohodlí, ne záruka.

## Testy

| Úroveň      | Co se testuje                                                                 | Kde |
| ----------- | ----------------------------------------------------------------------------- | --- |
| Unit        | převod ceny včetně českého formátu, odmítnutí neplatných hodnot, volba existujícího a nového prodejce, datum v budoucnu | `src/lib/domain/vykup.test.ts` |
| Integrace   | zápis do skutečné SQLite, nový prodejce v téže transakci, odmítnutí neexistujícího prodejce i komponenty, různá ID, serverová akce včetně revalidace | `src/server/repo/vykup.test.ts` |
| E2E / ruční | prázdná DB, špatná cena, chybějící políčko, dva rychlé odeslání              | Prázdná DB a naplněná DB ověřeny v `pnpm dev`; odeslání formuláře v prohlížeči nebylo v tomto prostředí možné, protože není dostupný prohlížeč — chybí ověření reakce UI na skutečný kliknutí |

## Bezpečnost a soukromí

- Autorizace: stále žádná, aplikace je jednoprovzorová. Jakmile vznikne přihlášení,
  serverová akce **musí** začít kontrolou relace — jinak by si mohl kdokoli výkup
  zapsat. Je to věc, na kterou nesmí zapomenout další iterace s přihlášením.
- Validace vstupů: Zod na serveru i stejná schémata na klientu.
- Osobní údaje: zapisuje se jen název a typ prodejce, žádné kontakty. Název může
  obsahovat jméno fyzické osoby — je to obchodní údaj, proto se ukládá do cizí tabulky
  `seller`, ne do textu kusu.
- SQL injekce: dotazy jdou přes Drizzle parametry, hodnoty se neskládají do řetězce.
- Tajné proměnně: žádné nové.

## Výkonnost

Zápis je jeden INSERT a případně druhý, oba v jedné transakci, proti indexovaným
sloupcím. Přehled skladu se po zápisu přepočítává celý — nad jedním bazarovým skladem
jde o zanedbatelnou cenu, stránkování přijde až s veřejným katalogem.

## Analytika/telemetrie

Nic se nesbírá.

## Známé omezení

- **Nelze zapsat novou katalogovou komponentu.** Při výkupu zboží, které v katalogu
  není, je provozovatel zablokován. Nejde to vyřešit výběrem zadní možnosti — je to
  chybějící funkce.
- **Nelze výkup opravit ani smazat.** Chyba v zápisu vyžaduje zásah do databáze.
- Jeden kus má vždy jednoho prodejce a jednu výkupní cenu. Pokud se cena při výkupu
  sjednotí až později, není kam to zapsat.
- `Kus` zatím nemá umístění ve skladu, takže nelze říct, kde přesně kus leží.

## Následné kroky

- I3 — zápis zásahu a hodnocení kusu, přechod do stavu `ohodnoceno`.
- Zápis nové katalogové komponenty, pokud se potvrdí jako potřeba z reálného provozu.

## Checklist před mergem

- [x] Dokument vytvořen z této šablony, název ve tvaru `NNN-kebab-nazev.md`
- [x] Sekce `Datový dopad` a `API/změny v kódu` odpovídají skutečnosti
- [x] Status a Datum odpovídají skutečnému stavu
- [x] `docs/README.md` obsahuje řádek s tímto dokumentem
- [x] `docs/architektura.md` aktualizovaný
- [x] `ROADMAP.md` aktualizovaný
- [x] `pnpm check` prochází
- [x] Patička `Poslední aktualizace: YYYY-MM-DD` odpovídá dnešnímu datu

Poslední aktualizace: 2026-09-29
