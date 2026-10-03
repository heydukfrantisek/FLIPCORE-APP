# Prodejní podmínky a reklamační řád

**Účel:** Fixuje, jak se sestava prodává (bazarové / použité zboží), jak se evidují známé
vady, jak dlouhá je záruka, kdy a jak se řeší reklamace a co zákazník dostane při předání.

> **Tento dokument není právní poradenství a není právně vymykací text.** Jde o
> **kontrolní seznam bodů k ověření s právníkem** — každá níže uvedená položka má
> projít právní kontrolou předtím, než se začne používat v inzerátech a při předání.
> Žádná lhůta, částka ani právní údaj uvedený níže není autoritativní, dokud ho
> právník nepotvrdí.

Prodej je **pouze B2C** — koncoví zákazníci.

## Jako co se zboží prodává

Sestava se prodává jako **bazarové / použité zboží**, ne jako zboží nové.

Pro každou prodejní sestavu musí být písemně doloženo:

- [ ] výslovně uvedená míra opotřebení (kategorie stavu — viz TODO níže),
- [ ] seznam známých vad, které zboží v okamžiku prodeje má,
- [ ] co z písemného seznamu bylo při testování zjištěno a co nebylo vůbec ověřeno.

**Proč to musí být v inzerátu i při předání:**

- Inzerát je první informace, kterou zákazník dostane. Bez uvedení míry opotřebení
  a známých vad vzniká rozpor mezi nabídkou a dodaným zbožím — a ten je podkladem pro
  stížnost i reklamaci.
- Zákazník musí vědět, **co kupuje**, jinak si myslí, že kupuje počítač z obchodu.
- Uvedení v inzerátu **nezakládá** povinnost informovat znovu při předání — proto to musí
  být i v písemném dokladu o prodeji.
- Bez písemného záznamu stavu nemáme jak prokázat, že o vadě věděl a byla mu
  oznámena.

Vazby a šablony:

- Inzerát: [`62-sablona-inzeratu.md`](62-sablona-inzeratu.md) — pravidla psaní textu.
- Šablona inzerátu: [`../../templates/inzerat.md`](../../templates/inzerat.md).
- Ceníšť a prodejní označení: [`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md).

TODO: definice jednotlivých kategorií stavu a opotřebení a jejich laické popisy v inzerátu —
zdroj: právník + vlastní fotodokumentace.

## Známé vady a výhrady

Vada zjištěná při testování se nezahlazuje a nemaže — **zaznamená se jako výhrada**
a jako výhrada se i prodá.

Postup záznamu:

1. **Zaznamenat do test protokolu** s přesným popisem příznaku, krokem, na kterém byl
   zjištěn, a s odkazem na fotodokumentaci:
   [`../30-testovani-a-evidence/31-testovaci-protokoly.md`](../30-testovani-a-evidence/31-testovaci-protokoly.md),
   šablona [`../../templates/test-protokol.md`](../../templates/test-protokol.md).
2. **Zapsat do evidence komponent** jako výhradu k danému ID sestavy:
   [`../30-testovani-a-evidence/32-evidence-komponent.md`](../30-testovani-a-evidence/32-evidence-komponent.md).
3. **Uvést v inzerátu** konkrétně, ne obecně. „Má drobné škrábance na víku“ je použitelné;
   „bazarové zboží“ jako samotné upozornění nestačí.
4. **Předat písemně při předání** — zákazník se seznámí s výhradou a podepíše/odsouhlasí,
   že byla zaznamenána a byla mu předána.

Co musí výhrada obsahovat:

- [ ] co přesně je vadné nebo opotřebované,
- [ ] zda vadný díl je součástí sestavy, nebo je vyřazen a nahrazen náhradou,
- [ ] zda vada brání použití, omezuje ho, nebo je jen kosmetická,
- [ ] zda má na cenu vliv (viz
  [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md)).

Pravidlo: **výhrada nesmí být formulována jako „vše v pořádku kromě drobností“.**
Zákazník se řídí přesným textem; obecná formulace se později vymyká jeho pochopení
a je zdrojem sporů.

TODO: minimální rozsah písemného vyjádření výhrady a formulace pro případ, že zákazník
s výhradou nesouhlasí — zdroj: právník.

## Záruka

**Rozhodnutí — záruka dle tieru:**

| Tier | Záruční doba | Prodejní označení |
| --- | --- | --- |
| `LOW` | 3 M | bazarové / použité zboží |
| `MID` | 6 M | bazarové / použité zboží |
| `HIGH` | 12 M | bazarové / použité zboží |

Podklady: definice tierů [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md),
zabalení ceny do marže [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md).

Kontrolní body k ověření s právníkem:

- [ ] **Zkrácená smluvní záruční doba u bazarového zboží je v českém právu dovolená**
      (ustanovení § 1702 občanského zákoníku umožňuje smluvně sjednat kratší záruku
      u zboží, které neodpovídá zásadám běžně přijatým podmínkám — je nutné potvrdit
      přesné znění a aktuální účinnost).
- [ ] **Zkrácení záruky automaticky nevylučuje právo spotřebitele reklamovat zboží,
      které neodpovídá smlouvě** (rozpor s nabídkou, skrytá vada, inzerát uvedl něco jiného).
      Zkrácená záruka je lhůta pro záruční opravu, **ne** limit reklamace z nesouladu
      se smlouvou — toto je nutné potvrdit a případně konzultovat s právníkem.
- [ ] Zda a v jakém rozsahu lze u bazarového zboží výhrady vyloučit odpovědnost za
      nesoulad se smlouvou a zda to vylučuje práva spotřebitele — zdroj: právník.
- [ ] **Zda a kdy je smluvně uzavřená záruka vyloučena / nepřenositelná**
      (pokud je sestava prodána dál) — zdroj: právník.
- [ ] Zda dopadá na odpovědnost za výrobky — **doporučeno zvážit pojištění odpovědnosti
      za výrobky**, protože reklamovaná vada se může ukázat jako výrobní nebo konstrukční
      problém původního výrobce, ne jako běžné opotřebení. Zdroj: právník + pojišťovna.
- [ ] Kdo a v jaké lhůtě reklamaci přijímá a vyřizuje — TODO: zdroj: právník.

Praktická pravidla:

- Záruka se sází **od data prodeje**, ne od data sestavení nebo testování.
- Záruka se vždy **zaznamenává písemně** — v dokladu o prodeji a v inzerátu.
- Výhrady se k záruce zaznamenávají odděleně, ne jako součást záručních podmínek.

TODO: přesná formulace záručních podmínek do textu dokladu o prodeji a jejich délka
platnosti — zdroj: právník.

## Bezpečnost Windows

Tato část musí být v inzerátu uvedena **výslovně**. Bez ní budou stížnosti.

Rozhodnutí: **sestavy tieru `LOW` a `MID` se prodávají bez Windows.**

| Procesor | TPM 2.0 | Prodej Windows 11 |
| --- | --- | --- |
| Intel 4.–7. generace | nemá TPM 2.0 | oficiálně nepodporováno → **neprodáváme** |
| Intel 8. generace | řešitelné samostatným modulem TPM | řešitelné, ale zvlášť ošetřit v inzerátu |
| Intel 9. generace | fTPM **nemá**, řešitelné samostatným modulem TPM | řešitelné modulem, ale zvlášť ošetřit v inzerátu |
| Intel 10.–14. generace | fTPM nativně (u 10. generace ověřit PTT konkrétního modelu) | podporováno |
| AMD Ryzen 3000 a 4000 | fTPM **chybí** | není podporováno nativně |
| AMD Ryzen 5000 a novější | fTPM nativně | podporováno |

O systému rozhoduje **procesor, ne grafická karta**: `HIGH` sestava s výkonnou kartou
a s procesorem bez TPM 2.0 se prodává bez systému. `HIGH` tedy neznamená „Windows 11
nativně v každém kusu“ — záleží na generaci procesoru.

Podklady: tier definice [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md),
testovací protokoly [`../30-testovani-a-evidence/31-testovaci-protokoly.md`](../30-testovani-a-evidence/31-testovaci-protokoly.md).

Co je nutné uvést v inzerátu výslovně:

- [ ] že `LOW` a `MID` se prodávají **bez operačního systému**,
- [ ] zda je Windows možné doinstalovat a za jakých podmínek (verze, kompatibilita),
- [ ] že **Windows 10 skončil 14. 10. 2025** a prodloužení (ESU) do **12. 10. 2027**
      je **odklad**, ne řešení — zákazník po tomto datu bude bez podpory,
- [ ] že u Intel 4.–7. gen. Windows 11 oficiálně nepodporuje.

Kontrolní body k ověření:

- [ ] Aktuální znění požadavku Microsoftu na TPM 2.0 a Secure Boot pro Windows 11
      a výjimky pro 8. generaci Intel; **9. generace fTPM nemá** a řeší se stejně
      jako 8. generace, tedy samostatným modulem TPM 2.0.
- [ ] Zda lze u `HIGH` Windows 11 prodávat s OEM klíčem — viz
      [Licence k OS](#licence-k-os).
- [ ] Zda u prodeje bez OS řešíme reklamaci „nevydalo se to tak, jak jste slíbili“ —
      zdroj: právník.

**Nikdy se neprodává systém, u kterého není dohledatelný platný licenční klíč** —
viz následující oddíl.

TODO: přesná formulace věty o Windows v inzerátu pro každý tier a pro 8. a 9. generaci
Intel s modulem TPM (9. generace fTPM nemá, řeší se stejně jako 8. generace) — zdroj:
právník + Microsoft dokumentace.

## Licence k OS

Rozhodnutí:

- Prodává se **výhradně ověřitelný OEM klíč převedený z bazarového PC**.
- Pokud takový klíč není k dispozici, **OS se neprodává vůbec** — sestava se prodává
  bez systému a zákazník si řeší vlastní licenci.

**Nikdy se neinstaluje neoriginální klíč. Nikdy se nepoužívá bypass TPM.**
Neoriginální klíč nebo obcházení TPM vede k tomu, že prodané zboží nelze
opravně přezkoumat, a nejde ho v důsledku ani prodat — a zakládá nárok na reklamaci
z nesouladu se smlouvou, protože inzerát tvrdil, že je systém v pořádku.

Co se eviduje:

- [ ] odkud klíč pochází (ID sestavy / příjemky, ze které byl převeden) — vazba na
      [`../20-prijem-a-sklad/21-prijemka.md`](../20-prijem-a-sklad/21-prijemka.md),
- [ ] typ klíče (OEM / ESD / Retail) a případná vazba na hardware,
- [ ] **jak byl klíč ověřen** a kdy (datum, kdo),
- [ ] výsledek ověření — klíč je funkční / neověřený / nefunkční,
- [ ] zda je klíč při prodeji převeden na zákazníka a zda je přenos přípustný —
      TODO: zdroj: právník + licenční podmínky výrobce.

Neověřený klíč se neprodává. Klíč, který neprošel ověřením, se vrací do
[`../20-prijem-a-sklad/21-prijemka.md`](../20-prijem-a-sklad/21-prijemka.md)
jako nález a nezůstává u sestavy.

## Reklamace — postup

Očíslované kroky:

1. **Zákazník nahlásí závadu.** Přijít může přes bazarový kanál nebo přímý kontakt —
   podle toho se pokračuje krokem 6.
2. **Ověří se ID sestavy a datum prodeje.** Bez shody se reklamace nevyřizuje.
   Hledá se v dokladu o prodeji, v reklamaci odsouhlasené na faktuře a v evidenci
   sestav.
3. **Ověří se sériové číslo** a shoda s faktuře — viz
   [`../20-prijem-a-sklad/21-prijemka.md`](../20-prijem-a-sklad/21-prijemka.md).
4. **Zjistí se, zda jde o záruční opravu**, nebo o nesoulad zboží se smlouvou. Rozhoduje,
   zda je závada zahrnutá záruční dobou dle tieru a zda je v seznamu výhrad.
5. **Rozhodne se mezi opravou, výměnou a vrácením peněz.** Výběr se zapíše s odůvodněním;
   součástí rozhodnutí je i posouzení, zda se vrací peněz v plné výši, zčásti, nebo
   vůbec — TODO: zdroj: právník.
6. **Reklamace se vyřídí** — v opravě, výměně nebo refundaci. Komunikace s bazardomluvnou
   jde písemně, ne telefonem.
7. **Zapíše se do tabulky Reklamace v Google Sheets** — ID sestavy, datum prodeje,
   datum nahlášení, popis závady, zvolené řešení, výsledek.
8. **Vyhodnotí se, zda příčina souvisí s nákupem** — tedy zda je chyba nová, nebo
   následek bazarového stavu. Výsledek jde do statistik a do týdenního reportu.

Šablona: [`../../templates/reklamace.md`](../../templates/reklamace.md).
Reporting: [`../80-reporting/81-weekni-report.md`](../80-reporting/81-weekni-report.md).

Kontrolní body k ověření:

- [ ] Lhůta pro nahlášení záruční vady a lhůta pro vyřízení reklamace —
      TODO: zdroj: právník.
- [ ] Kdo nese náklady na dopravu a na opravu v záruce a v reklamaci z nesouladu
      se smlouvou — TODO: zdroj: právník.
- [ ] Jak se reklamace vypořádává spotřebitel v bazarovém kanálu bezprostředně po
      dodání a v záruční době — zdroj: právník a podmínky bazaru.
- [ ] Zda a kdy je možné odmítnout reklamaci z důvodu výhrady, která byla zákazníkovi
      oznámena — zdroj: právník.
- [ ] Evidence a uchovávání reklamací — TODO: zdroj: právník.

## Reklamace v bazarovém kanálu

V kanálech s prostředníkem (`61-prodejni-kanaly.md`) **jsme prodávající bazarový prodejce,
ne přímý smluvní partner zákazníka smlouvou o opravě** — smluvní stranou ohledně
reklamace je bazar.

Postup se tím mění:

- Reklamaci přijímáme **my**, vyřizujeme ji s bazardomluvnou a předáváme bazaru —
  vždy písemně, s dokumentací.
- Zákazník se na nás obrací nepřímo: **nejprve musí reklamaci oznámit bazaru**, jinak
  ji bazar odmítne přijmout.
- **Kontakt s bazardomluvnou nesmí být telefonický** — telefonický hovor není důkaz
  pro bazar a reklamace se jím nezrychlí.
- Reklamace **prodlužuje dobu výdeje peněz** (protismluva zůstává nedokončená) a
  zatíží provozní čas.

Doby a lhůty:

| Krok | Kdo | Doba |
| --- | --- | --- |
| nahlášení závady | zákazník → bazar | TODO: zdroj: právník + podmínky bazaru |
| předání reklamace bazaru | my | TODO: zdroj: právník + podmínky bazaru |
| reakce bazaru | bazar | TODO: zdroj: právník + podmínky bazaru |
| vyřízení opravy | my | TODO: zdroj: právník |
| vypořádání prodeje | bazar | TODO: zdroj: právník + podmínky bazaru |

**Reálná očekávání:** celý proces v bazarovém kanálu je výrazně pomalejší než při
přímém prodeji. Zákazníka je nutné na toto upozornit **před koupí**, ideálně v inzerátu.

Odkaz: [`61-prodejni-kanaly.md`](61-prodejni-kanaly.md).

## Co zákazník musí dostat při předání

Předání není dokončené, dokud zákazník nemá všechno z tohoto seznamu.

- [ ] **Doklad o prodeji** s:
  - [ ] ID sestavy,
  - [ ] seznamem komponent sestavy,
  - [ ] datem prodeje,
  - [ ] délkou záruky (dle tieru).
- [ ] **Seznam známých vad a výhrad** — písemně, konkrétně, ne obecně.
- [ ] **Písemné odsouhlasení stavu bazarového zboží** — zákazník potvrzuje, že byl
      seznámen s mírou opotřebení a se známými vadami.
- [ ] **Sériové číslo** — písemně a odsouhlasené zákazníkem.
- [ ] **Kontakt pro reklamaci** — kdo reklamaci přijímá a jak (kanál, e-mail, telefon).
- [ ] Informace o tom, **co sestava neobsahuje** (typicky OS u `LOW` a `MID`) —
      aby zákazník nezjistil až při prvním spuštění, že systém není.
- [ ] U bazarového kanálu navíc **instrukce, že reklamaci oznamuje bazaru**, ne přímo nám.

Předání se zaznamená jako hotové až po podpisu/odsouhlasení všech bodů výše.
Bez toho nemáme doklad o tom, že zákazník věděl, co kupuje.

TODO: podoba dokladu o prodeji a způsob odsouhlasení (podpis, e-mail, potvrzení
v bazarovém kanálu) — zdroj: právník.
