# Evidence komponent

**Účel:** Říká, co se zapisuje o každém nakoupeném dílu a každé sestavě, jak se
záznamy propojují v Google Sheets a proč bez trvalého ID nejsou dohledatelné.

ID systém dílů je navržený v
[`../20-prijem-a-sklad/21-prijemka.md`](../20-prijem-a-sklad/21-prijemka.md) —
tady se nevymýšlí, jen se zapisuje. Výsledky testů mají vlastní postup v
[`31-testovaci-protokoly.md`](31-testovaci-protokoly.md), kam se z evidence
odkazuje.

## Základní záznam

Jeden řádek = jeden fyzický díl = jedno ID. Zapisuje se na papírovou příjemku
([`../../templates/prijemka.md`](../../templates/prijemka.md)) a do tabulky
**Sklad** v Google Sheets.

| Pole | Obsah | Kdo vyplňuje | Kdy |
| --- | --- | --- | --- |
| ID dílu | Trvalý jednočíselný identifikátor ve formátu `TYP-MODEL-RRMM-PORADI` (ukázka formátu: `CPU-I56500-2411-001`) | Ten, kdo díl převzal | Při převzetí, před odchodem od stolu |
| Typ | Předpona ze zavřeného seznamu (`CPU`, `GPU`, `MB`, `RAM`, `SSD`, `HDD`, `PSU`, `COOL`, `FAN`, `CASE`, `OSK`) | Přijímající | Při příjmu |
| Model | Přesné modelové označení z dílku v plném znění, ne marketingový název z inzerátu | Přijímající | Při příjmu |
| Sériové číslo | Sériové číslo, výrobní nebo servisní štítek, pokud je čitelný; nečitelné se zapisuje výslovně, ne prázdnou buňkou | Přijímající | Při příjmu, dřív než se kus uloží |
| Stav | `výchozí` / `výborný` / `dobrý` / `vadný`; štítek z příjmu je předběžný, test ho může změnit | Přijímající, opravuje testující | Při příjmu; změna až po testu, s důvodem |
| Tier | `LOW` / `MID` / `HIGH` dle referenční tabulky typu dílu; model mimo tabulku se zapíše jako nenalezený, ne odhadem | Přijímající | Při příjmu |
| Pořizovací cena | Cena skutečně zaplacená za tento jeden kus, bez dopravy a bez práce | Přijímající | Ihned po převzetí, dřív než se zapíše do Sheets |
| Dodavatel a odkaz na inzerát | Kdo kus prodal (jméno, obchodní název, profil) a odkaz na inzerát nebo číslo dokladu | Přijímající | Při příjmu |
| Kanál | `bazar` / `inzerce.cz` / `Bazoš` / `Facebook Marketplace` / jiný; vstup pro poplatek kanálu do nákladů | Přijímající | Při příjmu |
| Datum nákupu | Den, kdy byl kus převzat a zaplacen | Přijímající | Při příjmu |
| Umístění ve skladě | Kde kus fyzicky leží, dle systému z [`../20-prijem-a-sklad/23-skladovani.md`](../20-prijem-a-sklad/23-skladovani.md) | Ten, kdo kus uloží | Hned po uložení a při každém přesunu |
| Datum odpisu | Den, kdy byl kus odsouzen do opravy nebo do elektronického odpadu; do té doby prázdné | Ten, kdo o odpisu rozhodne | Při odpisu |
| Odkaz na příjemku | Odkaz na vyplněnou kopii šablony [`../../templates/prijemka.md`](../../templates/prijemka.md) pro tento kus | Přijímající | Při příjmu |
| Odkaz na test | Odkaz na test-protokol, ve kterém byl kus otestován; prázdný, dokud test neproběhne | Testující | Po dokončení testu |

Pravidla k tabulce:

- ID se nikdy nemění a nikdy se nepoužije znovu. Změna stavu, přesun do opravy
  i odpis ID nechávají být.
- Dva kusy ze stejného rozebraného počítače jsou dva řádky se dvěma ID.
- Prázdná buňka není dohledatelný údaj. Buď je hodnota známá a je tam, nebo je
  výslovně napsané, že jí není.

## Záznam sestavy

Jeden řádek = jedna sestava. Tier se počítá podle
[`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md), ceny a
marže podle
[`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md).

| Pole | Obsah | Kdo vyplňuje | Kdy |
| --- | --- | --- | --- |
| ID sestavy | Trvalý identifikátor sestavy ve stejném tvaru jako ID dílu, s vlastní předponou; návrh formátu `SET-<RRMM>-<PORADI>` (ukázka formátu: `SET-2411-007`) | Ten, kdo sestavu skládá | Při založení záznamu, před montáží |
| Tier | `LOW` / `MID` / `HIGH` jako maximum z CPU a GPU dle [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md) | Ten, kdo sestavu skládá | Po rozhodnutí o konfiguraci, před cenou |
| Seznam dílů po ID | ID všech dílů ve sestavě, oddělená středníkem, opsaná ze Skladu, ne z paměti | Ten, kdo sestavu skládá | Při každé změně složení |
| Celkové náklady | Součet pořizovacích cen dílů, dopravy, čisticího materiálu, času a poplatků kanálu dle [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md) | Ten, kdo sestavu skládá | Před stanovením ceny |
| Cílová prodejní cena | Náklady × marže dle tieru plus rezervy; musí ležet v pásmu dle [`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md) | Ten, kdo sestavu skládá | Před nasazením na sklad |
| Marže | Marže v Kč a v procentech; marže se počítá nad náklady, ne z prodejní ceny | Ten, kdo sestavu skládá | Při výpočtu ceny, průběžně při změně nákladů |
| Stav sestavy | `ve výstavbě` / `na skladě` / `prodáno` / `reklamace` | Ten, kdo sestavu skládá, pak ten, kdo ji prodá | Při každé změně |
| Datum sestavení | Den, kdy byla sestava složená a rozebraná | Ten, kdo sestavu skládá | Po montáži a kontrole |
| Odkaz na test-protokol | Odkaz na vyplněnou kopii [`../../templates/test-protokol.md`](../../templates/test-protokol.md) pro tuto sestavu | Testující | Po testu, před cenou |
| Odkaz na inzerát | Odkaz na zveřejněnou nabídku; u prodané sestavy i datum zveřejnění | Ten, kdo inzerát zveřejní | Při zveřejnění, před odevzdáním zákazníkovi |

Seznam dílů je jediné místo, kde se sestava skládá z kusů. Když se uvolní,
nahradí, nebo vyřadí jediný díl, mění se tenhle sloupec — ne jeho pořizovací
cena v tabulce Sklad.

TODO: doplnit předponu `SET` do tabulky předpson v
[`../20-prijem-a-sklad/21-prijemka.md`](../20-prijem-a-sklad/21-prijemka.md) —
zdroj: rozhodnutí o finálním formátu ID sestavy a kontrola, že s ním nesouhlasí
žádný jiný dokument ani šablona.

## Google Sheets — čtyři tabulky

Evidence běží v Google Sheets, protože se mění denně a potřebuje filtrovat a
sčítat; procesy a pravidla jsou naopak v Markdownu, kde je u nich důležitá
historie změn.

### Sklad

Jeden řádek = jeden fyzický díl. Sloupce v tomto pořadí:

| Sloupec | Co slouží |
| --- | --- |
| `ID dílu` | Klíč tabulky, jednočíselný a trvalý; podle něj se vše dohledává |
| `Typ` | Předpona ze seznamu; slouží k filtru „kolik máme kusů daného typu" |
| `Model` | Plné označení z dílku; podle něj se hledá další kus stejného modelu |
| `Sériové číslo` | Jednoznačné dohledání kusu u bazaristy i při reklamaci |
| `Stav` | `výchozí` / `výborný` / `dobrý` / `vadný`; určuje, zda kus smí do sestavy |
| `Tier` | `LOW` / `MID` / `HIGH` dle referenční tabulky typu |
| `Pořizovací cena` | Vstup do nákladů sestavy dle [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md) |
| `Kanál` | Zdroj nákupu; podle něj se počítá poplatek prodejního kanálu do nákladů |
| `Dodavatel` | Kdo kus prodal; podle sloupce se vyhodnocuje dodavatel |
| `Odkaz na inzerát` | Zpětný dohled na nabídku, která byla skutečně zveřejněna |
| `Datum nákupu` | Vstup pro dobu obratu skladu |
| `Umístění ve skladě` | Fyzické místo kusu dle [`../20-prijem-a-sklad/23-skladovani.md`](../20-prijem-a-sklad/23-skladovani.md) |
| `Datum odpisu` | Prázdné, dokud kus není odsouzen; vstup pro rezervu na vadné díly |
| `ID sestavy` | Cizí klíč na tabulku Sestavy; prázdné, dokud kus leží ve skladě |
| `Odkaz na příjemku` | Odkaz na vyplněnou kopii [`../../templates/prijemka.md`](../../templates/prijemka.md) |
| `Odkaz na test` | Odkaz na test-protokol, ve kterém byl kus otestován |
| `Fotky` | Odkaz na složku fotografií kusu |
| `Stav klíče OS` | Jen u řádků `OSK`: `ověřen` / `neověřen` / `nelze ověřit`; u ostatních prázdné |
| `Způsob ověření klíče` | Jak byl klíč ověřen, případně proč ne; u chybějícího klíče `n/a` |
| `Bazarový počítač klíče` | Označení počítače, ze kterého klíč pochází; dohled při přenosu na jinou sestavu |

### Sestavy

Jeden řádek = jedna sestava. Sloupce v tomto pořadí:

| Sloupec | Co slouží |
| --- | --- |
| `ID sestavy` | Klíč tabulky, na který odkazují ostatní tři tabulky |
| `Datum sestavení` | Vstup pro dobu obratu a pro doklad, co bylo v kusu |
| `Tier` | `LOW` / `MID` / `HIGH` dle [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md) |
| `Prodejní label` | Laický název z inzerátu (`KANCELÁŘSKÁ` / `HERNÍ` / `VÝKONNÁ`); odpovídá slabší složce, ne vždy tieru |
| `Díly (ID)` | ID dílů ze Skladu, ze kterých sestava vznikla |
| `Celkové náklady` | Součet dle [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md) |
| `Cílová prodejní cena` | Výstup kalkulace, před zveřejněním nabídky |
| `Marže Kč` | `náklady × marže`; marže se počítá nad náklady |
| `Marže %` | Procentní hodnota dle minimální marže v [`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md) |
| `Rezerva na reklamaci` | Vstup do ceny; výpočet ze skutečných reklamací dle [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md) |
| `Stav sestavy` | `ve výstavbě` / `na skladě` / `prodáno` / `reklamace` |
| `Prodejní kanál` | Kde sestava šla do prodeje; vstup pro poplatky kanálu |
| `Datum prodeje` | Prázdné do prodeje; k určení platnosti záruky |
| `Skutečná prodejní cena` | Doplní se po prodeji; zpřesní pásmo a marži dalších nákupů |
| `Odkaz na test-protokol` | Odkaz na kopii [`../../templates/test-protokol.md`](../../templates/test-protokol.md) |
| `Odkaz na inzerát` | Odkaz na zveřejněnou nabídku |
| `Odkaz na reklamaci` | Cizí klíč na tabulku Reklamace; prázdné, dokud reklamace není |

### Testy

Jeden řádek = jeden provedený test jednoho kusu. Sloupce v tomto pořadí:

| Sloupec | Co slouží |
| --- | --- |
| `ID sestavy` | Cizí klíč na tabulku Sestavy; prázdné u testu kusu mimo sestavu |
| `ID dílu` | Cizí klíč na tabulku Sklad; vyplní se u samostatného testu kusu |
| `Datum testu` | Kdy test proběhl, pro dohled výsledku v čase |
| `Test` | Co se testovalo, v názvu programu nebo postupu |
| `Výsledek` | `prošel` / `neprošel` / `výhrada`; základ pro verdikt o dílu |
| `Naměřené hodnoty` | Teploty a další hodnoty, výhradně z vlastního měření |
| `Testoval` | Kdo test provedl |
| `Poznámka` | Výhrada, chybové záznamy, podmínky měření |
| `Odkaz na fotky` | Odkaz na snímky nebo video běhu testu |
| `Odkaz na test-protokol` | Odkaz na kopii [`../../templates/test-protokol.md`](../../templates/test-protokol.md) |

### Reklamace

Jeden řádek = jedna reklamace. Sloupce v tomto pořadí:

| Sloupec | Co slouží |
| --- | --- |
| `ID sestavy` | Cizí klíč na tabulku Sestavy; bez něj reklamaci nelze dohledat ani uzavřít |
| `Tier sestavy` | Přebraný ze Sestav; určuje délku záruky a rezervu |
| `Zákazník` | Jméno a kontakt pro vyřízení reklamace |
| `Datum prodeje` | Přebrané ze Sestav; k určení, jestli záruka ještě platí |
| `Datum reklamace` | Kdy reklamace přišla |
| `Záruka platná` | `ano` / `ne`; určuje, kdo náklad hradí |
| `Závada` | Co hlásil zákazník, jeho vlastními slovy |
| `Příčina` | Vadný kus z nákupu / chyba při montáži / přehlédnutí při testu / jiný vliv |
| `Vadný díl (ID)` | Cizí klíč na tabulku Sklad; který kus z prodané sestavy je příčinou |
| `Dodavatel vadného dílu` | Přebraný ze Skladu; slouží k vyhodnocení dodavatele |
| `Řešení` | Co se udělalo a co dostal zákazník |
| `Náklad Kč` | Náklad opravy; vstup do rezervy v [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md) |
| `Datum vyřešení` | Kdy byla reklamace uzavřena |
| `Odkaz na šablonu reklamace` | Odkaz na kopii [`../../templates/reklamace.md`](../../templates/reklamace.md) |

### Vazba mezi tabulkami

Tabulky jsou propojené cizími klíči, ne překlepem do vzorce:

| Odkaz | Význam |
| --- | --- |
| `Sklad.ID sestavy` → `Sestavy.ID sestavy` | Díl je složený v této sestavě; prázdné znamená, že kus leží ve skladě |
| `Sestavy.Díly (ID)` → `Sklad.ID dílu` | Opačný pohled: z jakých kusů sestava vznikla |
| `Testy.ID sestavy` → `Sestavy.ID sestavy` | Test patří k této sestavě |
| `Testy.ID dílu` → `Sklad.ID dílu` | Test proběhl na tomto kusu |
| `Reklamace.ID sestavy` → `Sestavy.ID sestavy` | Reklamovaná sestava |
| `Reklamace.Vadný díl (ID)` → `Sklad.ID dílu` | Přes který kus se reklamace vrací do nákupu |
| `Sestavy.Odkaz na reklamaci` → `Reklamace.ID sestavy` | Zpětný dohled z prodeje na reklamaci |

Obě strany zápisu musí souhlasit: díl, který je ve sloupci `Díly (ID)` sestavy,
má mít vyplněné `ID sestavy` ve Skladu a být zapsaný v jednom seznamu. Když se
to rozejde, evidence neříká, kde kus je.

Ceny a marže se nepočítají z hlavy — postup je v
[`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md).
Umístění kusu se nevede volně, ale dle
[`../20-prijem-a-sklad/23-skladovani.md`](../20-prijem-a-sklad/23-skladovani.md).
Souhrn z těchto tabulek do týdenního reportu je popsán v
[`../80-reporting/81-weekni-report.md`](../80-reporting/81-weekni-report.md).

TODO: doplnit odkaz na založený soubor Google Sheets s tabulkami Sklad, Sestavy,
Testy a Reklamace — zdroj: soubor sdílený pro FLIPCORE.
TODO: doplnit pořadí sloupců pro filtry a kontroly nad tabulkami — zdroj: první
měsíc používání, podle toho, které filtry a souhrny se opravdu dělají.

## Fotodokumentace

Fotografie jsou doklad, ne ozdoba. Pravidla jsou v
[`../20-prijem-a-sklad/21-prijemka.md`](../20-prijem-a-sklad/21-prijemka.md);
tady je shrnutí.

### Co fotit při příjmu

| Snímek | Proč |
| --- | --- |
| Celkový pohled na díl nebo počítač | Doklad, co přišlo |
| Sériové číslo, ostrý snímek razítka | Jednoznačné dohledání kusu u bazaristy i při reklamaci |
| Stav dílu — rysky, odřeniny, praskliny, zteklé kondenzátory | Zdůvodnění stavu a záruky |
| Vady — všechny, ne jen ta nejlepší | Jedna hezká fotografie vedle pěti špatných není důkaz |
| Kontakty, zadní strana, příslušenství | Rozhodnutí o použití v sestavě a nárok na součásti |

### Pojmenování a umístění

- Název souboru: `<ID>_<RRRRMMDD>_<POZICIONI>_<POPIS>.jpg` (ukázka formátu:
  `CPU-I56500-2411-001_20241103_01_seriove-cislo.jpg`).
- Bez ID v názvu se fotografie nedá spárovat s dílkem, takže se vždy ID píše.
- Fotky jednoho dílu leží v jedné složce pojmenované podle ID, složky jsou
  řazené podle měsíce příjmu ve formátu `RRRR-MM`.
- Odkaz na složku jde do tabulky Sklad, sloupec `Fotky`.
- Fotografie vadného dílu se archivují i po odevzdání do elektronického odpadu —
  doklad, proč díl neprodal.

### Jak dlouho držet

TODO: stanovit dobu uchování fotografií u prodaných kusů a dobu uchování po
reklamaci — zdroj: zákaznická záruka podle tieru a lhůta do předložení
reklamace, obojí z [`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md).

## Proč ID vůbec potřebujeme

| Důvod | Co to vyřeší |
| --- | --- |
| Dohledat, kde kus skončil, když se něco rozsype | ID funguje jako adresa kusu ve všech čtyřech tabulkách |
| Prokázat, co bylo v sestavě v okamžiku prodeje | Seznam dílů po ID je neměnný záznam, ne vzpomínka |
| Zpětně zjistit, který dodavatel prodává vadné kusy | Reklamace vede přes vadný díl na jeho řádek ve Skladu, kde je dodavatel |
| Doložit stav pro reklamaci | Stav, vady a fotky ze skladu říkají, jestli závada byla při prodeji |

Bez těchto čtyř bodů se z evidence stane hromada papíru: kusy zmizí, marže
nevyjde, reklamace se řeší odhadem.

## Checklist evidence

Vyplňuje se pro každý nový kus a po každém sestavení sestavy.

- [ ] ID přiděleno podle formátu z
      [`../20-prijem-a-sklad/21-prijemka.md`](../20-prijem-a-sklad/21-prijemka.md)
      a vepsáno na díl nebo na jeho obal.
- [ ] Stav zapsán.
- [ ] Sériové číslo opsáno.
- [ ] OEM klíč k OS zaznamenán i v případě, že nepřišel, a to i se způsobem
      ověření.
- [ ] Fotky pořízeny.
- [ ] Příjemka vyplněna.
- [ ] Sestava zapsána s odkazem na ID dílů.
- [ ] Test protokol vyplněn.

## Související dokumenty

- [`21-prijemka.md`](../20-prijem-a-sklad/21-prijemka.md) — ID systém dílů,
  stavy, příjímací seznam
- [`23-skladovani.md`](../20-prijem-a-sklad/23-skladovani.md) — kde kus fyzicky
  leží
- [`31-testovaci-protokoly.md`](31-testovaci-protokoly.md) — jak test probíhá a
  co se z něj zapisuje do evidence
- [`40-tier-definice.md`](../40-tiery/40-tier-definice.md) — tier sestavy a
  prodejní label
- [`43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md) — cílové pásmo a
  minimální marže
- [`71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md) — výpočet
  nákladů, ceny a marže
- [`81-weekni-report.md`](../80-reporting/81-weekni-report.md) — co se ze Sheets
  reportuje
- Šablony: [`../../templates/prijemka.md`](../../templates/prijemka.md),
  [`../../templates/test-protokol.md`](../../templates/test-protokol.md),
  [`../../templates/reklamace.md`](../../templates/reklamace.md)
