# Šablona prodejního inzerátu

**Účel:** Vysvětluje, proč je text inzerátu složený právě takhle — a které jeho části
jsou závazné pravidlo, ne volba formulace.

Inzerát se vyplňuje jako kopie `inzerat-<ID sestavy>.md` podle
[`../../templates/inzerat.md`](../../templates/inzerat.md). Tento dokument jsou
pravidla pro toho, kdo inzerát píše; zákazník ho nečte.

## Titulek a první řádky

Titulek musí být čitelný laikovi. `LOW`, `MID` a `HIGH` jsou vnitřní označení —
zákazníkovi neříkají nic a hledá podle toho, co s počítačem chce dělat: psát,
koukat na video, nebo hrát. Titulek proto zní jako to, co zákazník kupuje, a tier
se objeví až v technických údajích.

Doporučené znění:

| Tier | Prodejní označení | Titulek | Co titulek slibuje |
| --- | --- | --- | --- |
| `LOW` | KANCELÁŘSKÁ | `Kancelářský počítač FLIPCORE` | kancelářské úlohy, e-mail, prohlížeč, videohovory |
| `MID` | HERNÍ | `Herní počítač FLIPCORE 1080p` | hraní ve 1080p na starší a soutěžní tituly |
| `HIGH` | VÝKONNÁ | `Výkonný počítač FLIPCORE` | výkon pro hraní a práci s videem; rozlišení se doplní jen ověřené |

Mapování na tiery vychází z dvojího pojmenování v
[`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md): v inzerátu
je názvem laické prodejní označení, technický tier je jen doplněk v detailu.
Laické označení se nesmí použít, pokud sestava danou vlastnost reálně nesplňuje —
a platí to i pro `HIGH`, viz
[Pozor: označení nesmí být silnější než sestava](#pozor-označení-nesmí-být-silnější-než-sestava).

Dvě volitelné varianty ze šablony:

- kancelářská — `Kancelářský počítač FLIPCORE — tichý, úsporný`,
- herní — `Herní počítač FLIPCORE — hraní ve 1080p`.

Obě jsou v pořádku, protože neobsahují nic, co by sestava neuměla. Značka
`FLIPCORE` v titulku zůstává — je to jméno, podle kterého zákazník hledá.

**První řádky** (hlavička, ve výpisu inzerátů nejsou vidět jiné) jsou tři a plní
tři různé úkoly:

1. co to je a odkud jsou díly,
2. k čemu to slouží a co není součástí,
3. záruka a možnost vyzkoušení.

Záměna pořadí je běžná chyba: když je záruka až ve čtvrtém řádku, zákazník ji
nečte a reklamuje ji jako podmínku, která nikde nebyla.

## Pozor: označení nesmí být silnější než sestava

Toto je nejdůležitější pravidlo celého inzerátu.

**Tier sestavy je maximum z tieru procesoru a tieru grafické karty** —
`max(CPU, GPU)`, viz [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md).
Sestava má tedy `HIGH` proto, že má silný procesor **nebo** silnou grafickou kartu,
ne proto, že má silné obě. **To neznamená, že hraje na 1440p.**

Příklad: **Core i7-12700 + GT 1030** — procesor je v tabulce `HIGH`, grafická karta
je `LOW`, maximum je `HIGH`. Sestava tedy má výkonový tier `HIGH`, ale 1440p na ní
nezahraje, protože hry táhne grafická karta. Stejně to platí opačně: silná grafická
karta s pomalým procesorem hraní omezí naopak.

Pravidla:

- **Nikdy nepíš do titulku rozlišení, které nebylo ověřeno vlastním měřením.**
  Řádek `Výkonný počítač FLIPCORE 1440p` není v šabloně — šablona i tento text
  předpokládají, že se rozlišení doplní jen u kusu, kde 1440p bylo skutečně změřeno,
  ne automaticky u každé sestavy `HIGH`. Bez měření se použije `Výkonný počítač
  FLIPCORE`.
- Rozlišení se uvádí jen tam, kde máme vlastní měření zapsané v test protokolu.
  Cizí testy a čísla z internetu sem nepatří.
- U hraničních kombinací se volí buď **formulace bez rozlišení** — `Herní počítač
  FLIPCORE`, `Výkonný počítač FLIPCORE` — nebo **výslovně „vhodné pro hraní ve
  1080p“**, pokud to sestava reálně umí.
- Slibuje se **úkol** („kancelář, videohovory, hraní ve 1080p“), nikoli počet
  snímků za sekundu. Číselný výkon se píše jen tam, kde je vlastní měření.
- Slabší složka se v textu přizná a jmenuje se její důsledek: u slabšího procesoru
  se píše, že herní výkon omezí; u slabší grafické karty, že hraní bude omezeno na
  nižší rozlišení. Klient to musí slyšet před koupí, ne po ní.
- U sestav, kde CPU a GPU odstávají o dva tiery nebo více, se sestava vůbec
  nedodává — to není volba formulace, ale rozhodnutí o sortimentu
  ([`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md), Hraniční případy).

## Specifikace

Tabulka je jediný přesný zdroj konfigurace. Základní znění:

| Položka | Model | Stav | Poznámka |
| --- | --- | --- | --- |
| Procesor | `<přesné označení>` | `<výborný / dobrý>` | `<co zákazníka omezuje>` |
| Grafická karta | `<přesné označení>` | `<výborný / dobrý>` | `<co zákazníka omezuje>` |
| Základní deska | `<přesné označení>` | `<výborný / dobrý>` | `<počet slotů, verze BIOSu>` |
| Paměť | `<model>` | `<výborný / dobrý>` | `<celkem GB, počet modulů, jedno- nebo dvoukanálově>` |
| Disk | `<výrobce, model>` | `<výborný / dobrý>` | `<typ, kapacita, rozhraní>` |
| Zdroj | `<přesné označení>` | `<výborný / dobrý>` | `<jmenovitý výkon>` |
| Chlazení | `<model>` | `<výborný / dobrý>` | `<vyměněný ventilátor, hluk>` |
| Skříň | `<model>` | `<dobrý>` | `<viditelné stopy opotřebení>` |
| Klávesnice / myš | `<přiloženo / nepřiloženo>` | `<výborný / dobrý>` | `<značky>` |

Pravidla k tabulce:

- **Model je přesné modelové označení z dílku**, ne marketingový název z původního
  bazarového inzerátu — podle
  [`../30-testovani-a-evidence/32-evidence-komponent.md`](../30-testovani-a-evidence/32-evidence-komponent.md).
- **Stav musí odpovídat výsledku testu.** Stav z příjmu je předběžný a změnit ho
  může až test; do prodeje jde jen stav, který test potvrdil
  ([`../30-testovani-a-evidence/31-testovaci-protokoly.md`](../30-testovani-a-evidence/31-testovaci-protokoly.md)).
- **Poznámka není volitelná a není kosmetická.** Patří sem každá výhrada: snížený
  takt, jednokanálová paměť, pomalý bazarový disk, vyměněný ventilátor. Výhrada se
  píše konkrétně — výhrada, která v inzerátu není, je reklamace.
- U každé komponenty se uvádí stav i výhrada. „Výborný“ bez poznámky znamená, že
  daná komponenta prošla bez nálezu.
- **Paměť** se neuvádí souhrnně: celková kapacita, počet modulů a jejich
  kapacity jednotlivě, a jestli běží dvoukanálově. Jednokanálový provoz je výhrada a
  musí být v inzerátu uveden.
- **Disk** se uvádí jako výrobce, model, kapacita a rozhraní. Kapacita v systému,
  na štítku a v inzerátu musí souhlasit.
- **Chlazení a větráky** se rozlišují na původní a vyměněné — zákazník chce vědět,
  k čemu je kus poctivě použitelný.
- **Klávesnice a myš** se píší `přiloženo / nepřiloženo`. Co není přiloženo, se
  nedoplňuje a nedůvěřuje.

## Co musí být v inzerátu

- [ ] Přesná konfigurace včetně kapacit a počtu modulů paměti.
- [ ] Stav každé komponenty — u každého řádku tabulky, ne u sestavy jako celku.
- [ ] Známé vady a výhrady, napsané konkrétně, ne obecně.
- [ ] Délka záruky dle tieru: `LOW` 3 M, `MID` 6 M, `HIGH` 12 M.
- [ ] Označení **bazarové zboží** s odkazem na stav jednotlivých dílů a s tím, že
      jevné znaky opotřebení nejsou závadou.
- [ ] Výslovné uvedení, že se sestava **prodává bez Windows a bez operačního
      systému**, a proč. U `LOW` a `MID` je to povinné vždy; u `HIGH` dle
      rozhodnutí o systému. Důvod se vysvětluje platformou podle
      [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md):

  | Platforma | Proč |
  | --- | --- |
  | Intel Core 4.–7. generace | nemá TPM 2.0 → Windows 11 se nainstalovat nedá, prodává se bez systému |
  | Intel Core 8. generace | TPM 2.0 chybí, řešitelné **samostatným modulem**, který se musí osadit na desku |
  | Intel Core 9. generace | fTPM chybí, řešitelné **samostatným modulem**, stejně jako 8. generace |
  | Intel Core 10.–14. generace | Windows 11 **nativně**, bez TPM modulu; u 10. generace je nutné ověřit PTT u konkrétního modelu |
  | AMD Ryzen 3000 a 4000 | fTPM chybí → Windows 11 se nainstalovat přímo nedá |
  | AMD Ryzen 5000 a novější | fTPM zabudovaný, Windows 11 jde nainstalovat přímo |

  Systém se u `HIGH` neposuzuje podle grafické karty, ale podle procesoru — sestava
  s výkonnou kartou a s procesorem bez TPM 2.0 se prodává bez systému.

- [ ] Možnost osobního vyzkoušení na místě — kde a po domluvě termínu.
- [ ] Sériové číslo k odsouhlasení: u bazarového prodeje sériové číslo hlavní
      komponenty na faktuře, u přímého prodeje seznam sériových čísel komponent —
      v obou případech **odsouhlasené písemně před platbou**.

Tyto body jsou závazné. Vypustit se nedají — proto je šablona kopírovaná do
každé nové nabídky a neupravuje se.

TODO: doplnit výši záruční rezervy v korunách na jednotlivé tiery — zdroj: tabulka
Reklamace v Google Sheets, průměrný náklad na reklamaci podle tieru
(popsáno v [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md)).

## Co do inzerátu nepatří

Každý bod má důvod a důvod je věcný, ne estetický.

- [ ] **Nerealizované přísliby výkonu a hratnosti** (např. „zvládne všechny nové
      hry na maximální nastavení“) — nelze zaručit, vede to k reklamaci a ke ztrátě
      důvěry.
- [ ] **Srovnávání s konkurencí a s bazarovými kusy** — není ověřitelné a není to
      informace pro zákazníka. Týká se to i hlavičky inzerátu.
- [ ] **Vytváření dojmu, že jde o nové zboží** — sestava je z bazarových dílů a
      stav se uvádí otevřeně, jinak je podvod na zákazníkovi.
- [ ] **Fotografie cizích sestav nebo generická grafika** — zákazník musí vidět
      konkrétní kus, který dostane.
- [ ] **Zavádějivé uvedení „testováno“ bez odkazu na test protokol** — doklad o
      testu je v protokolu, ne ve slovníku. Kde je odkaz na protokol, tam je „otestováno“.
- [ ] **Sliby doživotnosti** („vydrží vám to navěč“) — garantovat lze jen smluvní
      záruku dle tieru, a to na funkci sestavy, ne na životnost každého dílu.
- [ ] **Uvádění neexistující záruky výrobce** — záruka výrobce na bazarový kus
      neplatí. Co dáváme, je záruka FLIPCORE dle tieru; jiná tvrzení o záruce jsou
      nepravdivá.
- [ ] **Vnitřní tier v titulku** (`LOW`, `MID`, `HIGH`) — zákazníkovi nic neříká a
      patří do technických údajů.
- [ ] **Srovnávací testy a výkonnostní čísla z internetu** — nejsou z tohoto kusu;
      do inzerátu patří vlastní měření.
- [ ] **Pořizovací ceny dílů, marže a vnitřní kalkulace** — interní údaj, zákazníkovi
      nepatří.
- [ ] **Údaje o předchozím majiteli a dodavateli** — nejsou informace pro zákazníka
      a zbytečně otevírají cestu ke sporu.

## Fotografie

Fotografie je doklad, ne ozdoba. Požadované snímky jedné sestavy:

1. celá sestava zvenku, zavřená skříň;
2. otevřená skříň — pohled na všechny komponenty;
3. detail každé hlavní komponenty: procesor, grafická karta, základní deska, disk, zdroj;
4. detail sériového čísla hlavní komponenty;
5. **každá zaznamenaná vada zvlášť** — jedna hezká fotografie vedle pěti špatných není důkaz;
6. snímek výstupu testu, pokud ho test protokol obsahuje.

Podmínky snímání:

- **Rovné světlo.** Žádné ostré stíny, odrazy ani protisvětlo — jinak na snímku není
  čitelné, co tam je.
- **Jednotné pozadí.** Stejná podložka a stejný úhel pro všechny snímky jedné sestavy,
  aby šly porovnat a poznat.
- **Viditelné závěrečné značky** — stav, v jakém sestava jde k zákazníkovi: zavřená
  a připojená skříň, utěsnění, zapnuté napájení, kabely ve správném osazení.

Snímky se pořizují jako součást fotodokumentace
([`../30-testovani-a-evidence/32-evidence-komponent.md`](../30-testovani-a-evidence/32-evidence-komponent.md)),
pojmenovávají se podle vzoru `SET-<RRMM>-<PORADI>_<RRRRMMDD>_<POZICIONI>_<POPIS>.jpg`
a odkaz na složku jde do evidence sestavy. Vada zjištěná při testu před prodejem
se vyfotografuje a zapíše do protokolu.

TODO: doplnit dobu uchování fotografií u prodaných kusů — zdroj: smluvní záruka dle
tieru a lhůta pro předložení reklamace, spolu s
[`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md).

## Cena

Cena se do inzerátu **nepodkládá odhadem**. Nejdřív musí existovat kalkulace:

```text
cílová prodejní cena = (součet pořizovacích cen dílů + práce a materiál)
                       × (1 + marže) + rezerva na reklamaci + rezerva na vadné díly
```

Postup je v [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md),
cílové pásmo a minimální marže v
[`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md). Marže se počítá
nad náklady, minimálně `LOW` 30 %, `MID` 25 %, `HIGH` 20 %. **Jde o výchozí hodnotu
k potvrzení z reálných prodejů, ne o naměřený fakt** — do té doby se nesmí prezentovat
jako ověřená hodnota.

Co z toho plyne pro tento dokument: **žádné ceny se nedoplňují odhadem a žádná
vymyšlená čísla se do ukázky nepíšou.** Dokud kalkulace pro konkrétní sestavu
neexistuje, zůstává položka `TODO`. Hotová čísla patří do kopie inzerátu a do
evidence sestavy, ne do tohoto dokumentu.

Pravidla:

- Cena leží v pásmu daného tieru a nepřekračuje jeho horní hranici.
- Cena je nižší než rozebraný bazarový kus stejné konfigurace — jinak zákazník nemá
  důvod kupovat hotovou sestavu s testy a zárukou.
- Sleva pod cílovou cenu, aby se „ušetřila doba“, není dohoda: zlevnění není doba,
  ale marže.
- Do inzerátu se **nepřenáší** pořizovací ceny dílů, marže ani rezervy — patří do
  výpočtu, ne do textu pro zákazníka.
- Po prodeji se doplní skutečná prodejní cena do evidence; ta zpřesní pásmo příštího
  nákupu.

TODO: doplnit aktuální číselné hodnoty cílových pásem — zdroj: tabulka Sestavy v
Google Sheets po prvních prodejích, dle postupu v
[`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md).

TODO: doplnit výši rezervy na reklamaci a výši rezervy na vadné díly v Kč na kus —
zdroj: tabulka Reklamace v Google Sheets a evidence odpisů.

## Před zveřejněním

Protokol faktu a kalkulaci marže:

- [ ] `ID sestavy` v inzerátu odpovídá záznamu v evidence sestavy.
- [ ] Každá položka tabulky specifikací má stav odpovídající výsledku testu té
      komponenty v
      [`../30-testovani-a-evidence/31-testovaci-protokoly.md`](../30-testovani-a-evidence/31-testovaci-protokoly.md).
- [ ] Výsledek sestavy je `prošel` nebo `prošel s výhradou`. Při `neprošel` se
      sestava nezveřejňuje vůbec.
- [ ] Každá výhrada z test protokolu je v inzerátu napsaná — ne jen ta, která je
      nepříjemná.
- [ ] Žádné číslo v inzerátu se neshoduje s protokolem: kapacity, počet modulů
      paměti, počet jader, sériové číslo.
- [ ] Titulek ani hlavička neobsahují označení silnější, než sestava reálně umí —
      zkontrolováno proti
      [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md).
- [ ] Záruka v textu odpovídá tieru (3 / 6 / 12 M) a je předána zákazníkovi
      spolu s [`64-prodejni-podminky.md`](64-prodejni-podminky.md).
- [ ] Uvedeno prodání bez operačního systému, kde to daná platforma vyžaduje.
- [ ] Cena je překontrolována proti kalkulaci marže
      ([`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md))
      — neopsaná marže z hlavy, ne jen pásmo.
- [ ] Do ceny jsou započtené poplatky zvoleného prodejního kanálu a rezervy.
- [ ] Cena leží v pásmu tieru podle
      [`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md) a je nižší
      než bazarový kus stejné konfigurace.
- [ ] Do evidence sestavy jsou zapsány náklady, marže a prodejní cena.
- [ ] Fotografie jsou pořízené podle [oddílu Fotografie](#fotografie) a odkaz na
      ně je v evidence.
- [ ] Kanál, kontaktní údaje a způsob platby odpovídají
      [`61-prodejni-kanaly.md`](61-prodejni-kanaly.md).

## Související dokumenty

| Oblast | Dokument |
| --- | --- |
| Vyplňovaná šablona, jejíž pravidla tento text vysvětluje | [`../../templates/inzerat.md`](../../templates/inzerat.md) |
| Tier, prodejní označení, dvojí pojmenování, záruka, TPM a fTPM | [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md) |
| Cílové pásmo a minimální marže podle tieru | [`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md) |
| Výpočet nákladů, ceny a marže | [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md) |
| Co se zkouší, výsledek testu a výhrada | [`../30-testovani-a-evidence/31-testovaci-protokoly.md`](../30-testovani-a-evidence/31-testovaci-protokoly.md) |
| Záznam sestavy a fotodokumentace | [`../30-testovani-a-evidence/32-evidence-komponent.md`](../30-testovani-a-evidence/32-evidence-komponent.md) |
| Prodejní kanály, platba, předání zákazníkovi | [`61-prodejni-kanaly.md`](61-prodejni-kanaly.md) |
| Záruka a prodejní podmínky předané zákazníkovi | [`64-prodejni-podminky.md`](64-prodejni-podminky.md) |
