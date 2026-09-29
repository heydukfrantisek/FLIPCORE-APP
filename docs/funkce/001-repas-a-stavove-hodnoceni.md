# 001: Repas a stavové hodnocení

| Položka         | Hodnota                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| Status          | Plánováno (návrh)                                                       |
| Vlastník        | Tým FLIPCORE                                                            |
| Datum           | 2026-09-29                                                              |
| Oblast          | repas                                                                   |
| Navazující dokl. | [Vize — princip transparentnosti](../vize.md#principy), [datový model](../architektura.md#datový-model), [ADR](../adr/README.md) |

> Tento dokument je návrh, nikoli popis existujícího kódu. Repozitář dnes obsahuje pouze scaffold (viz [000](000-zalozeni-projektu.md)). Sekce označené jako otevřené otázky je potřeba rozhodnout před implementací.

## Zadání a cíl

Umožnit ohodnotit stav použité počítačové komponenty tak, aby její stav byl **doložitelný**, a aby historie zásahů na kusu zůstala dohledatelná i po změně vlastnictví a opakovaném zveřejnění.

Bez této funkce je stav kusu jen tvrzení prodávajícího, což podle [vize](../vize.md) není přípustné.

Rozsah: stavová škála, evidence testů, záznam zásahů (repas), zobrazení hodnocení v katalogu.

Mimo rozsah (Fáze 1): nákup a platby, sestavování počítačů, automatické získávání testů z hardwaru, veřejné recenze.

## Uživatelský příběhy

- Jako bazar chci kus otestovat a ohodnotit, abych mohl prodat kus, jehož stav je doložitelný, a věděl, co směluji.
- Jako zájemce o koupi chci u každého kusu vidět stupeň stavu a důkazy, abych věděl, co kupuji, a nemusel se spoléhat na popisek.
- Jako IT nadšenec chci vidět, co s kusem bylo děláno a jaké testy prošly, abych si mohl ověřit argumenty prodejce.
- Jako kupující chci zjistit, že dříve opravená součástka je na to vybavená, ne zatajená.

## Návrh stavové škály

Navržena čtyřstupňová škála A až D. Záměrem je, aby stupeň byl **vypočítán z důkazů**, ne zvolen prodávajícím.

| Stupeň | Název           | Definice                                                                        | Minimální důkaz |
| ------ | --------------- | ------------------------------------------------------------------------------- | --------------- |
| **A**  | Jako nový       | Plný výkonový profil odpovídá specifikaci typu komponenty, bez zjevných stop po zásahu | Funkční test celého profilu + vizuální kontrola |
| **B**  | funkční s vadami | Komponenta funguje a plní specifikaci, ale má kosmetickou vadu nebo opotřebení   | Funkční test + popis a fotka vady (u opotřebení popis rozsahu) |
| **C**  | opravená omezená | Komponenta prošla zásahem; funkčnost je ověřena jen v rozsahu, který zásah umožnil, nebo je výkon nižší než specifikace | Záznam zásahu + test + uvedení omezení a zbývající rizika |
| **D**  | neprodejná     | Neprošlo testem, nebo je určeno pouze k recyklaci. Do bazarové nabídky nevstupuje   | Zápis o neúspěchu; uzeleno v katalogu, ne nabízeno |

Pravidla škály:

- Každý stupeň vyžaduje důkaz. Bez důkazu nelze přiřadit žádný stupeň; takový kus nevstupuje do katalogu jako ověřený.
- Stupeň se odvozuje z typu komponenty, protože vybrané parametry se liší (např. u úložiště je podstatná kapacita a read/write, u displeje jas a vadné pixely).
- Hodnocení platí ke konkrétnímu okamžiku. Otázka, po jak dlouhé době je nutné kus přetestovat znovu, je otevřená.
- Stupeň C je jediný, který legitimizuje předchozí zásah: zároveň musí být vidět, **co** bylo vyměněno a **co** zůstalo původní.
- Dílčí selhání testu není možné „přebodovat“ na lepší stupeň kombinací s jiným testem. Souhrn hodnocení je odvozený, ne doplňovaný ručně.

## Scénáře

| # | Jako kdo | Situace                                                        | Očekávaný výsledek |
| - | -------- | ------------------------------------------------------------- | ------------------- |
| 1 | Bazar    | Otestuje funkční kus, test prošel, vizuálně bez vad          | Stupeň A, důkaz uložen, kus lze nabídnout |
| 2 | Bazar    | Kus funguje, ale má promáčknutý kryt                         | Stupeň B, vada popsaná a doložená fotkou |
| 3 | Bazar    | Vyměnil kondenzátor a vyměnil ventilátor                      | Stupeň C, záznam obou zásahů, test prošel jen v ověřeném rozsahu |
| 4 | Bazar    | Test selhal                                                    | Stupeň D, kus se v katalogu neobjeví |
| 5 | Kupující | Otevře detail nabídky                                         | Vidí stupeň, seznam důkazů a záznamy zásahů |
| 6 | Kupující | Chce kus se starým zásahem bez důkazu                        | Takový kus v katalogu není, případně je uveden s výslovným upozorněním |
| 7 | Bazar    | Po zveřejnění opraví chybně uvedený stav                     | Historie zásahů i hodnocení zůstává dohledatelná |

## Datový dopad

Konceptuální entity jsou definované v [architektuře](../architektura.md#datový-model); tento oddíl je záměrně stručný odkaz místo duplicitního výpisu polí.

- Nové entity: `ConditionGrade` (stupeň, hodnotitel, důkazy, čas), `RepairTicket` (zásah na kus), `TestEvidence` (výsledek testu a příloha).
- Změny existujících entit: `Listing` získá vazbu na stavové hodnocení. Vazba je 1:N, aby šlo hodnocení v průběhu času revidovat a zachovat historii.
- Migrace: není, datová vrstva zatím neexistuje.

## API/změny v kódu

Předpokládaný směr, přesné rozhodnutí se může lišit podle zvolené persistence:

- Serverové akce (nebo route handlery) pro vytvoření hodnocení, záznamu zásahu a důkazu; veškeré zápisy jdou ze serveru.
- Čtení hodnocení v detailu nabídky a v seznamu katalogu jako filtrovatelný atribut.
- Výpočet stupně z důkazů v `src/lib/` jako čistá funkce, testovatelná bez databáze.
- Sdílené typy škály v jednom modulu, aby se stupeň nepopisoval na více místech.

## UI

- Detail nabídky: stupeň, souhrn hodnocení, seznam důkazů s výsledkem a časem, historie zásahů.
- Seznam katalogu: stupeň jako filtr a jako značka u položky.
- Formulář pro hodnocení: výběr testu, zadání výsledku a naměřených hodnot, nahrání přílohy, volba stupně odvozená z důkazů.
- Stavy: prázdný stav (hodnocení neproběhlo), načítání, chyba uploadu, chyba uložení.

## Vývojářské poznámky

- Stupeň se nesmí skládat ručně. Kód, který by umožnil přiřadit stupeň jinak než z důkazů, je chyba.
- Přílohy důkazů jsou nedůvěryhodný vstup: omezit typ a velikost, nevykonávat je.
- Při zápisu zásahu se nesmí mazat předchozí záznamy. Oprava záznamu je nový záznam, ne přepsání.

## Testy

| Úroveň     | Co se testuje                                                        | Kde |
| ----------- | -------------------------------------------------------------------- | --- |
| Unit        | Odvození stupně z kombinace důkazů včetně hraničních případů       | `src/lib/` vedle implementace |
| Unit        | Formátování a zobrazení stupně a výsledku testu                      | `src/lib/` |
| Integrace   | Uložení hodnocení, zásahu a důkazu, viditelnost v katalogu           | Testy datové vrstvy |
| Ruční       | Nahrání přílohy důkazu, zobrazení historie na detailu nabídky         | Ručně |

## Bezpečnost a soukromí

- Hodnocení smí vytvořit pouze role provádějící testy; běžný prodejce nemůže stupeň přiřadit sám.
- Chráněné údaje v testech (sériová čísla, uživatelská data z paměti) se do důkazů neukládají.
- Přílohy důkazů se omezí velikostí a typem a neslouží ke skrytí uživatelského obsahu.

## Výkonnost

- Katalog bude filtrován podle stupně, proto je nutné, aby dotaz na stupeň byl indexovaný a šel provést bez načítání všech nabídek do aplikace.
- Přílohy se načítají až na vyžádání detailu, ne v seznamu.

## Analytika/telemetrie

Navrženo měřit podíl nabídek s doloženým stavem a podíl kusů bez hodnocení. Konkrétní události se doplní po rozhodnutí o analytice; do té doby se žádné nesbírají.

## Známé omezení

- Hodnocení je kvalifikovaný odhad založený na provedených testech, ne nezávislé měření laboratoře.
- Škála A až D je hrubá a nezachytí všechny nuance typů komponent; odchylky je potřeba popsat až u konkrétního typu.
- Hodnocení neřeší záruku ani reklamace.

## Otevřené otázky

- Zda může být škála jednotná pro všechny typy komponent, nebo zavést dílčí škály.
- Kdo je autoritou pro přiřazení stupně a zda jej může kupující potvrdit nebo zpochybnit.
- Jak dlouho hodnocení platí a kdy je nutný opakovaný test.
- Které testy jsou povinné pro každý typ komponenty a kdo rozhoduje o jejich seznamu.
- Zda se hodnocení váže na konkrétní kus trvale, nebo na nabídku.

## Následné kroky

- Rozhodnout persistence a zapsat ADR (viz [ADR index](../adr/README.md)).
- Rozhodnout seznam povinných testů pro první typ komponenty.
- Navázat na sestavování počítačů: sestava může obsahovat jen kusy s doloženým stavem.

## Checklist před mergem

- [x] Dokument existuje jako reference budoucí implementace
- [x] Datový dopad odpovídá modelu v `docs/architektura.md`
- [x] Otevřené otázky jsou výslovně uvedené, ne zamaskované
- [ ] Implementace provedena
- [ ] Testy pro odvození stupně doplněny
- [ ] Status aktualizován na `Rozpracováno` nebo `V produkci`
- [x] `ROADMAP.md` odkazuje na tento dokument

Poslední aktualizace: 2026-09-29
