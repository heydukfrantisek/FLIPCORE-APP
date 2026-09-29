# FLIPCOREAPP — Roadmap

FLIPCORE je SaaS platforma pro nákup, servis a sestavování počítačových komponent z druhé
ruky. Prodejcem může být bazar, firma s přebytečným zbožím nebo jednotlivec.

Tři pilíře:

1. **Marketplace** — vyhledávání a nákup otestovaných bazarových komponent podle typu,
   socketu, stavu a ceny.
2. **Repas** — proces ověření, čištění, výměny, testování a ohodnocení stavu komponenty
   s evidovanou historií (kdo, kdy, co vyměnil a jak výsledek dopadl).
3. **PC build** — konfigurátor, který z aktuálně dostupných bazarových kusů složí
   kompatibilní sestavu, spočítá cenu a dá ji do košíku.

Cílené prostředí pro MVP: Česká republika, české ceny (CZK), české UI.

## Definice hotovosti (Definition of Done)

Platí pro každou položku v tomto roadmapu. Bod je hotový, když je splněno **všechno**:

- [ ] Funkčně implementováno a dostupné v UI včetně prázdného stavu, načítání a chyby.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` a `pnpm build` procházejí (totéž, co CI).
- [ ] Klientská logika má Vitest testy vedle souboru (`*.test.ts`), vrstva dat má testy na
      pravidla (validace, výpočty, filtrování).
- [ ] Žádné `any`, veřejné typy vystavené přes sdílené typy v `src/lib`.
- [ ] Data se načítají přes serverové komponenty/route handlery, klientový stav nešíří
      duplicitní pravidla byznomu.
- [ ] Prázdný stav, chybový stav a stav během čekání mají smysluplnou českou hlášku.
- [ ] Chování popsáno v `docs/` (a URL je v `ROADMAP.md`/README aktuální).
- [ ] Žádné tajné klíče v repozitáři; `.env.example` obsahuje jen názvy proměnných.
- [ ] Průchodzkou projde ruční odzkus v `pnpm dev` a je zapsán, kdo a kdy odzkoušel.

## Fáze 0 — Základ projektu a domény

Cíl: zprovoznit datový model a přihlášení tak, aby na něj navázaly další fáze. Velikost: **L**.
Obsahuje entity `User`, `Component`, `Listing`, `ConditionGrade`, `RepairTicket`, `Build`,
`BuildItem`.

### Data

- [ ] Zvolit ORM a databázi; rozhodnutí zapiš do `docs/` (viz otevřené otázky).
- [ ] Schéma a migrace pro `User`, `Component`, `Listing`, `ConditionGrade`, `RepairTicket`,
      `Build`, `BuildItem`.
- [ ] `Component` jako katalogová entita (výrobce, model, kategorie: CPU/GPU/RAM/SSD/HDD/
      MB/PSU/VGA/chladič) s normalizovanými atributy pro filtrování.
- [ ] `Listing` jako nabídka konkrétního kusu: odkaz na `Component`, stav, cena, dostupnost,
      prodejce, umístění.
- [ ] `ConditionGrade` jako oddělená tabulka hodnocení s verzí škály (viz Fáze 1).
- [ ] `RepairTicket` s krocemi procesu, výsledkem a vazbou na `Listing`.
- [ ] `Build` a `BuildItem` s vazbou na konkrétní nabídku; `BuildItem` nese i roli
      (např. `gpu`, `cooler`).
- [ ] Peněžní částky jako celé desetinné číslo v haléřích (CZK), žádné `float` penízy.
- [ ] Ceny, názvy a filtry jako řetězce s pevným kódování a uložené v `utf8` (diakritika
      v názvech zboží jsou běžné).

### Auth

- [ ] Přihlášení/registrace e-mailem a přihlášení přes externí poskytovatele identity.
- [ ] Role: `customer`, `seller`, `admin`; role je uložená u uživatele a kontrolovaná na serveru.
- [ ] Session management, odhlasení, reset hesla.
- [ ] Prázdná stavu: nepřihlášený uživatel vidí katalog, ale košík a objednávku vyžadují účet.

### UI

- [ ] App shell: hlavička s navigací (Katalog, Repas, PC build, Účet), patička s právními
      texty.
- [ ] Responzivní rozvržení pro desktop a mobilní prohlížeč.
- [ ] Formátovací utility v `src/lib/format.ts` (cena, datum, stav) pokryté testy.

### Testy a dokumentace

- [ ] Testy na validaci schématu a na mapování řádků DB na entity.
- [ ] `docs/` popisuje datový model (ER popis + seznam polí).
- [ ] `docs/` popisuje auth model a role.

### Mimo rozsah této fáze

Platba, objednávky, nákupní košík, import od prodejců, notifikace.

## Fáze 1 — Repas a stavové hodnocení komponent

Cíl: mít jednotný proces a škálu, podle níž je kus označen jako použitý v katalogu. Velikost: **M**.

### Data

- [ ] Škála `ConditionGrade` (viz níže) s verzí a možností rozšíření bez mazání historie.
- [ ] `RepairTicket` jako workflow: `received` → `diagnostics` → `repair` → `testing` →
      `grading` → `done`, s přechody omezenými podle role.
- [ ] Evidence testů na ticketu: krok, výsledek (`pass`/`fail`), poznámka, čas, autor.
- [ ] Checklist kroků per typ komponenty (např. CPU = funkční test + teplotní zátěž).

### UI

- [ ] Detail ticketu se stavovým průběhem a historií změn.
- [ ] Formulář pro zapsání kroku a testu, viditelný jen příslušné roli.
- [ ] Šipka/legenda škály stavu (barevné značení A–D + vysvětlivka) dostupná i mimo admin.
- [ ] Přehled otevřených ticketů s filtrováním podle stavu a typu komponenty.

### Testy a dokumentace

- [ ] Testy na přechody mezi stavy ticketu (včetně zakázaných).
- [ ] `docs/` popisuje škálu stavů a procesní checklisty.

### Mimo rozsah této fáze

Automatické benchmarky, reporty prodejců, sjednocení s externími systémy bazarů.

## Fáze 2 — Marketplace: katalog, filtry, detail, vyhledávání

Cíl: uživatel dojde z vyhledávání ke konkrétní nabídce. Velikost: **L**.

### Data

- [ ] Fulltextové vyhledávání nad názvem a výrobcem.
- [ ] Facetové filtry: kategorie, socket, generace, stav (`ConditionGrade`), cena (rozsah),
      dostupnost, prodejce.
- [ ] Řazení: relevanci, cena vzestupně/sestupně, nejnovější.

### UI

- [ ] Stránka katalogu s filtry synchronizovanými do URL (sdílení a uložení hledání).
- [ ] Karta nabídky: název, stav, cena, prodejce, zásobnost kusu.
- [ ] Detail nabídky: specifikace, stav a jeho historie, fotografie, prodejce, poznámka repasu.
- [ ] Prázdný stav: žádná shoda — nabídka úpravy filtrů.

### Testy a dokumentace

- [ ] Testy logiky filtrů a řazení nad datovou vrstvou.
- [ ] `docs/` popisuje katalog, filtry a URL parametry.

### Mimo rozsah této fáze

Košík, objednávky, srovnávání více nabídek v jedné kartě.

## Fáze 3 — Nákup: košík, objednávka, platba, stavy objednávky

Cíl: uživatel si může vybrané kusy koupit. Velikost: **L**.

### Data

- [ ] `Order` a `OrderItem` navázané na konkrétní `Listing` (rezervace skladové zásoby při vložení
      do košíku).
- [ ] Stavový model objednávky: `created` → `paid` → `packed` → `shipped` → `delivered`
      (+ `cancelled`, `refunded`) s historií přechodů.
- [ ] Idempotence platby a webhooků, aby se neúčtovalo dvakrát.

### UI

- [ ] Košík: úprav množství, odebrání, přehled cen, upozornění když kus mezitím zmizel.
- [ ] Checkout: souhrn, adresa, způsob dodání, souhlas se smluvními podmínkami.
- [ ] Detail objednávky pro zákazníka s aktuálním stavem a historií.
- [ ] Bezpečné přesměrování na platební providera a návrat po platbě.

### Testy a dokumentace

- [ ] Testy na stavy objednávky a na idempotenci platby.
- [ ] `docs/` popisuje objednávkový proces a stavy.

### Mimo rozsah této fáze

Vratky a reklamace (právně viz otevřené otázky), dělené objednávky na více prodejců.

## Fáze 4 — PC build konfigurátor

Cíl: sestavit kompatibilní sestavu z reálně dostupných nabídek v jedné ze tří cenových
kategorií a dostat ji do košíku. Velikost: **L**.

### Data

- [ ] Pravidla kompatibility: socket CPU ↔ MB, typ paměti (DDR4/DDR5) ↔ MB, formát
      disku ↔ MB, výkon a rozměr zdroje, sloty pro karty a chlazení, TDP vs. chladič.
- [ ] Řízení dostupnosti: do sestavy lze dát jen kusy, které jsou v katalogu a nedokončily
      prodej.
- [ ] Výpočet ceny sestavy (součet nabídek + volitelné položky typu montáž později) a
      srovnání s referenční částkou kategorie.
- [ ] Uložení a sdílení sestavy: uložená sestava dostane veřejný odkaz.

### UI

- [ ] Výběr kategorie (Základ / Střední / Premium) jako vstup do konfigurátoru.
- [ ] Rozpracovaný návrh sestavy: slot (CPU, MB, RAM, disk, GPU, PSU, chladič, case) →
      nabídky, u každé cenu a stav.
- [ ] Označení nekompatibilních kombinací s konkrétním vysvětlením („DDR5 paměti do
      desky s DDR4 sloty"), ne jen červená hláška.
- [ ] Doporučení náhradní nabídky, pokud vybraný kus vypadne ze skladu.
- [ ] Přidání celé sestavy do košíku jako jednoho kroku.

### Testy a dokumentace

- [ ] Testy kompatibility jako čisté funkce nad vstupem (bez DB) — tabulkové testy všech párů
      CPU/MB, MB/RAM, PSU/požadavky.
- [ ] Testy výpočtu ceny sestavy a hraničních případů (prázdný slot, duplicitní role).
- [ ] `docs/` popisuje model kompatibility a výpočet ceny.

### Mimo rozsah této fáze

Automatický výběr sám bez volby uživatele, porovnání výkonu s novými kusy, benchmarky.

## Fáze 5 — Prodejci a bazary

Cíl: bazar nebo jednotlivec si založí účet, spravuje nabídky a hromadně vloží zboží.
Velikost: **L**.

### Data

- [ ] Profil prodejce: veřejné údaje, způsob předání (osobně / odesílka), podmínky prodejce.
- [ ] Stav nabídky: `draft` → `active` → `reserved` → `sold` / `inactive`, s historií.
- [ ] Hromadný import z CSV (mapování sloupců na atributy komponenty) s reportem chyb.
- [ ] Pravidla pro nábor bazarů: uzavřený nábor, nebo otevřená registrace prodejců.

### UI

- [ ] Dashboard prodejce: přehled nabídek, stavů a výnosů.
- [ ] Formulář nabídky s validací proti existujícímu `Component` (duplicitní zboží).
- [ ] Průvodce importem CSV s náhledem a stažením reportu chyb.
- [ ] Administrace: schvalování prodejců, zásah do stavu nabídek.

### Testy a dokumentace

- [ ] Testy na import CSV (mapování sloupců, chybné řádky, duplicity).
- [ ] `docs/` popisuje onboarding prodejce a formát CSV.

### Mimo rozsah této fáze

Vlastní sklad FLIPCORE, automatický dovoz dat od bazarů, faktury pro prodejce (viz otázky).

## Fáze 6 — Růst: hodnocení, notifikace, slevy, reporting

Cíl: udržet uživatele a zvýšit objem objednávek. Velikost: **L**.

### Funkce

- [ ] Hodnocení prodejce po objednávce (1–5 + text), zobrazované v detailu prodejce.
- [ ] Notifikace: potvrzení objednávky, změna stavu objednávky, nová nabídka od sledovaného
      prodejce (e-mail, kanál jednotlivě dle volby).
- [ ] Slevy a akční ceny: časově omezená sleva na nabídku, kód slevy, prahová sleva na
      objednávku.
- [ ] Reporting pro interní použití: neprodané kusy, stárnutí skladu prodejců, marže.
- [ ] Uložené hledání a upozornění na nové kusy odpovídající filtru.
- [ ] Referral / pozvánky uživatelů (až po ověření základního fungování).

### Testy a dokumentace

- [ ] Testy na výpočet slev a na pravidla notifikací.
- [ ] `docs/` aktualizováno o nové funkce.

## Prioritizace (MoSCoW)

| Značka | Význam | Rozsah |
| ------ | ------ | ------ |
| **M** (Must) | Bez toho není MVP použitelné | Fáze 0–2 celé, košík + základ objednávky ve Fázi 3, jádro kompatibility ve Fázi 4 |
| **S** (Should) | Výrazně zvyšuje hodnotu, snadno navazuje | Repas checklisty, vyhledávání podle socketu, sestavení sestavy do košíku, CSV import |
| **C** (Could) | Příjemné, až bude stabilní základ | Uložené sestavy s veřejným odkazem, slevy, notifikace, reporting |
| **W** (Won't) | V této iteraci neuvažujeme | Viz „Mimo rozsah (MVP)“ |

Rozpad jednotlivých bodů: **M** — datový model, auth, registrace/odhlasení, role, katalog
s filtrováním a vyhledáváním, detail nabídky, škála stavů, ticket procesu, košík, vytvoření
objednávky, základní stavy objednávky, tři cenové kategorie sestavy, kontrola kompatibility
CPU/MB/RAM/disk/PSU/chlazení, výpočet ceny. **S** — prodecké profily, formulář nabídky,
CSV import, hodnocení, notifikace o změně stavu objednávky. **C** — slevy, reporting,
upozornění na nové kusy, referral. **W** — marketplace pro jiné kategorie, mobilní aplikace,
půjčování, vlastní sklad, montáž na klíč.

## Tři cenové kategorie (pracovní návrh k potvrzení)

- **Základ (Economy)** — co nejvyšší výkon za nejnižší cenu; typicky starší generace procesoru,
  čtyřjádrové/šestijádrové CPU, méně výkonné ale dostačující GPU, 16 GB RAM, SSD.
  Konfigurátor v této kategorii nenabízí sestavy nad rozpočet daný pro tuto kategorii.
- **Střední (Standard)** — vyvážený poměr výkon/ceny; modernější vícejádrový procesor,
  výkonnější GPU, 32 GB RAM, rychlejší SSD. Referenční rozpočet odvozený z předchozí
  kategorie.
- **Premium** — maximum výkonu dostupného z bazarových dílů; top generace procesoru a GPU,
  velká kapacita RAM, rychlý NVMe SSD a dostatečný výkonový zdroj.

Omezení, která platí pro všechny tři kategorie: sestava se skládá výhradně z kusů
aktuálně dostupných v katalogu FLIPCORE, je vzájemně kompatibilní a její cena se počítá
z reálných cen těchto kusů. Konkrétní číselné rozpočty kategorií jsou otevřená otázka —
závisí na reálných datech z katalogu, protože u bazarového zboží nejsou ceny stabilní.

## Otevřené otázky a nejistoty

Rozhodnutí vlastní: **produkt** (scop a priority), **právník** (odpovědnost a smluvní
stránky), **tech** (architektura a integrace). U každé je uvedeno, kdo rozhoduje.

1. **Model prodeje bazarů** — je FLIPCORE jen lead generation, výkupní platforma
   (FLIPCORE vlastní zboží), marketplace více prodejců, nebo kombinace? (produkt + právník;
   bez odpovědi se mění datový model, odpovědnost i výpočet marže)
2. **Odpovědnost za stav zboží** — kdo ručí za nesrovnalost mezi uváděným stavem a skutečností,
   jak dlouhá je záruka a reklamační lhůta, zda je možné vyloučit odpovědnost (právník)
3. **Platební provider** — kdo je obchodník s platební bránou, zda se platí přes marketplace
   s vypořádáním prodejcům, nebo napřímo (produkt + právník)
4. **Dodávka a skladování** — zda se zboží posílá přímo od bazaru, zda má FLIPCORE sklad,
   a kdo nese riziko poškození (produkt + právník)
5. **Výkupní ceny a marže** — jak se počítá výkupní cena proti prodejní, kdo nese riziko
   neprodeje (produkt)
6. **Scope MVP** — omezení na ČR, jedna měna, jen osobní doručení a základní doprava, a zda se
   do MVP vůbec vejde nákup (produkt)
7. **Repas interní nebo u prodejce** — kdo provádí fyzické čištění a testování, je-li to
   vůbec součást platformy, nebo jen evidence od prodejce (produkt)
8. **Databáze a ORM** — výběr ORM a DB, hosting, zálohy (tech)
9. **Verzování škály stavů** — jestli se škála stavu smí měnit v čase a jak řešit starší
   nabídky, aby zůstaly konzistentní (produkt)
10. **Zdroj dat o komponentách** — zda se katalog komponent (výrobce, model, socket) spravuje
    ručně, nebo se generuje z externího zdroje (tech)
11. **Identita a profil uživatele** — co je povinné zveřejnění a co zůstane soukromé, souhlasy,
    retence údajů (právník)
12. **Vztah PC buildu k repasu** — má být sestava vždy složena z repasovaných kusů, nebo i
    z kusů jen otestovaných bez zásahu (produkt)
13. **Pravidla pro více prodejce v jedné objednávce** — jedna objednávka na prodejce, nebo
    společná objednávka s rozdělením platby (produkt)
14. **Cenové rozpočty kategorií** — číselné hranice kategorií Základ/Střední/Premium a způsob
    jejich průběžného přehodnocování (produkt)

## Mimo rozsah (MVP)

Toto do MVP **nepatří** a je to vědomé rozhodnutí, ne opomenutí:

- Vlastní sklad a logistika FLIPCORE (pokud se nevyřeší otázka 4 jinak).
- Montáž počítače na klíč a servis u zákazníka.
- Půjčování nebo pronájem hardwaru.
- Srovnání bazarových kusů s novým zbožím v ceníku a benchmarky výkonu.
- Nativní mobilní aplikace (jen responzivní web).
- Marketplace pro jiné kategorie než PC komponenty (konzole, telefony, kola…).
- B2B/API pro bazyry, pokročilý ERP import, automatický dovoz feedů.
- Věrnostní program, kupóny třetích stran, doprava vlastní kurýrní službou.
- Aukce a nabídkové systémy — cena je fixní.
- Recenze jednotlivých komponent (rekuence v detailu) — hodnocení je až ve Fázi 6.
- Mezinárodní trhy a jiné měny než CZK.

## Legenda

- `[ ]` — nehotovo, `[x]` — hotovo (a splňuje Definici hotovosti).
- `**M**` Must / `**S**` Should / `**C**` Could / `**W**` Won't — priorita podle MoSCoW.
- Velikost fáze: **S** (do 1–2 týdnů), **M** (do 1 měsíce), **L** (delší) — odhad pro
  malý tým, reálné termíny se stanoví až po rozhodnutí otevřených otázek.
