# Rozpočet a bod zvratu

**Účel:** Spočítat, kolik kusů sestav se musí prodat, aby se vrátily pořizovací
náklady dílů, čisticí materiál, poplatky prodejního kanálu a rezerva na
reklamace, a stanovit startovní rozpočet, který jako jednorázový náklad vstupuje
do tohoto výpočtu.

**Obsah tohoto dokumentu není daňové ani právní poradenství. Je to pouze seznam
otázek, které je nutné ověřit s účetním či daňovým poradcem nebo s příslušným
úřadem. Žádná odpověď zde uvedená není platné čtení zákona a před jakýmkoli
výdajem nebo prodejem je potřeba potvrzení odborníkem.**

Související: kalkulace ceny a marže `71-kalkulace-marze.md`, peněžní tok a doba
utratení marže `72-cashflow.md`, skladování `../20-prijem-a-sklad/23-skladovani.md`,
prodejní kanály a jejich poplatky `../60-prodej/61-prodejni-kanaly.md`, maximální
nákupní ceny `../10-nakup/12-max-ceny.md`, zápis výsledků do evidence
`../80-reporting/81-weekni-report.md`.

## Bod zvratu

Bod zvratu je počet kusů, při kterém se příjem z prodeje rovná celkovým nákladům.
Pod touto hranicí se podnik do peněz nepropírá — prodané kusy jen kryjí to, co
bylo na nákup, čištění, kanál a reklamace vynaloženo.

### Postup výpočtu

1. **Nakoupenou dávku.** Z evidence nákupu vyber dávku `N` dílů, kterou se chystáš
   rozebrat a poskládat. Každý díl má pořizovací cenu z evidence, ne odhad;
   limity jsou v `../10-nakup/12-max-ceny.md`.
2. **Součet pořizovacích nákladů dílů.** Sečti pořizovací ceny všech dílů v dávce.
   Současně sečti dopravu za nákup.
3. **Přičti čisticí materiál a spotřebované díly na kus.** Termopasta, stříbro na
   pastice, šroubky, kabely, větráky, antistatické pásky. Viz
   `../20-prijem-a-sklad/22-cipovani-a-cisteni.md`.
4. **Přičti prokazatelné poplatky prodejního kanálu.** Jen to, co je skutečně
   účtováno, dle kanálu v `../60-prodej/61-prodejni-kanaly.md`. U přímého prodeje
   je poplatek jiný než u prodeje přes aukci; do bodu zvratu se nikdy nezadává
   odhad.
5. **Přičti čas a elektřinu na kus.** Z evidence, ne odhad. Čas na rozebrání,
   čištění, test a sestavení; elektřina při zkouškách.
6. **Urči cílovou prodejní cenu** podle vzorce v
   [71-kalkulace-marze.md](71-kalkulace-marze.md). Minimální marže je rozhoduta
   tam: `LOW` 30 %, `MID` 25 %, `HIGH` 20 %. Protože marže je počítaná nad
   náklady, vychází marže v Kč jako `mezisoučet nákladů × marže v %`.
7. **Přičti rezervu na reklamaci** dle vztahu v
   [71-kalkulace-marze.md](71-kalkulace-marze.md). Rezerva se přičítá po marži,
   protože není součástí obchodní marže, ale nákladem na riziko.
8. **Přičti jednorázové náklady** — startovní rozpočet z části
   [Startovní rozpočet](#startovní-rozpočet). Ty se nekupují na kus, ale vstupují
   do výpočtu jednou.
9. **Vypočítej bod zvratu** vzorcem níže a zaokrouhli nahoru na celý kus. Kus,
   který neprodáš, pokryje jen část nákladů.

### Vzorec

```text
náklady na kus včetně rezervy = pořizovací náklady dílů (na kus)
                             + doprava + čisticí materiál
                             + prokazatelné poplatky kanálu
                             + čas a elektřina
                             + rezerva na reklamaci (na kus)

celkové náklady dávky = N × (náklady na kus včetně rezervy)
                        + jednorázové náklady (startovní rozpočet)

příjem z prodaného kusu = cílová prodejní cena včetně rezerv

bod zvratu v kusech = ⌈celkové náklady dávky / příjem z prodaného kusu⌉
```

Kontrolní varianta přes marži, která musí dát stejný řád:

```text
marže na kus v Kč = (mezisoučet nákladů) × marže v %
bod zvratu = ⌈jednorázové náklady / (marže na kus + rezerva na kus)⌉ + N
```

Když obě varianty dávají různá čísla, je chyba ve vstupech, ne ve vzorci —
typicky chybí doprava, čas, nebo rezerva.

Bod zvratu se počítá pro každý tier zvlášť. `LOW` má nejvyšší marži v % (30 %),
`HIGH` nejnižší (20 %), ale `HIGH` má v Kč největší marži. Nejnižší bod zvratu
tedy nemusí být u nejnižšího marže v procentech a rozhoduje výsledek
vypočtený z konkrétní sestavy, nikoli procento.

Bod zvratu je dolní mez, ne cíl. Jaký prodejní objem plánuješ nad ním, je
obchodní rozhodnutí a zapisuje se do týdenní evidence
`../80-reporting/81-weekni-report.md`.

TODO: doplnit průměrný součet pořizovacích nákladů dílů na jednu sestavu —
zdroj: evidence nákupu `../20-prijem-a-sklad/21-prijemka.md`.
TODO: doplnit výši rezervy na reklamaci v Kč na kus — zdroj: tabulka Reklamace
v Google Sheets.
TODO: doplnit skutečné procentní poplatky jednotlivých prodejních kanálů —
zdroj: vyúčtování a poplatkový sazebník daného kanálu.
TODO: doplnit průměrnou dobu prodeje sestavy v kusech a dnech — zdroj: tabulka
Sestavy v Google Sheets, sloupec datum prodeje.

## Bod zvratu při zpožděném prodeji

Když se prodej protáhne o měsíc, marže z prodaných kusů se nezmění, ale náklady
zůstanou. Výpočet se posune v čase, ne ve vzorci: v tu chvíli visí ve skladě kusy,
za které je zaplaceno, ale marže z nich ještě nevznikla.

### Co se stane při prodloužení o jeden měsíc

```text
kusy ve skladě = rychlost prodeje (kusů za měsíc) × 1

peníze vázané navíc = součet pořizovacích cen kusů, které se neprodaly

navýšení jednorázové rezervy = součet pořizovacích cen nákupů za jeden měsíc
```

Rozdíl je zásadní: kus ve skladu není ztráta, ale nedokončený prodej. Rezerva
ale musí ten měsíc vydržet, protože koupení další dávky se zastaví a oběžné
peníze zamrznou v neprodaných dílech. Peněžní tok a doba, po kterou marže
přežije, jsou v [72-cashflow.md](72-cashflow.md); ukládání kusů a zásady
inventury popisuje `../20-prijem-a-sklad/23-skladovani.md`.

### Kdy rezerva přestane stačit

Rezerva na jeden měsíc prodloužení pokrývá jen nákup. Pokud prodej visí dva
měsíce, musí rezerva pokrýt dva nákupní cykly, jinak se musí nákup zastavit —
a to je jiný typ škody: bez nákupu nejsou díly na další sestavy, i když
marže na prodeji je zdravá. Rozhoduje tedy rychlost prodeje, ne velikost dávky:
větší dávka prodlouží dobu obratu a násobí vázané peníze.

Prodloužení se pozná ve týdenní evidenci `../80-reporting/81-weekni-report.md`,
kde se porovnává plánovaný a skutečný počet prodaných kusů v týdnu.

TODO: doplnit měsíční rychlost prodeje v kusech — zdroj: týdenní evidence
`../80-reporting/81-weekni-report.md`, přepočtená na měsíc.
TODO: doplnit výši rezervy v Kč pokrývající jeden nákupní cyklus — zdroj:
vlastní evidence nákupů a objem nákupu za měsíc.
TODO: doplnit skutečnou dobu obratu skladu v měsících — zdroj: data z
`../20-prijem-a-sklad/23-skladovani.md`.

## Startovní rozpočet

Startovní rozpočet jsou výdaje, které vzniknou jednou, ne na kus. V bodu zvratu
se započítávají jako jediný součet do jednorázových nákladů. Způsob rozkladu
peněz doby obratu je v [72-cashflow.md](72-cashflow.md).

| Položka | Proč je potřeba | Částka |
| --- | --- | --- |
| Nástroje na rozebrání PC | Šroubováky, pinzeta, odvíječ šroubů pastice, nůžky na pásky, háček na šroubky. Bez nich se skříň nerozebere a zbytek zůstane nedělaný díl — TODO: doplnit — zdroj: ceník běžného nářadí v e-shopu nebo ceník opravného servisu | |
| Antistatický štětec a stlačený vzduch | Čištění bez elektrostatického výboje, který by zničil CMOS čip a paměť. Rozdíl mezi fungujícím a spáleným kusem je celá marže — TODO: doplnit — zdroj: ceník čisticího materiálu | |
| Čisticí materiál | Izopropyl, vatové tyčky, jemné štětky do ventilátorů, utěrky, rozpouštědlo na zbytky pastice. Spotřebuje se na každý kus a musí se dokupovat průběžně — TODO: doplnit — zdroj: spotřeba z evidence čištění | |
| Termopasta | Každá sestava s CPU potřebuje pastovou podložku. Bez ní se procesor přehřívá a reklamace se neřeší — TODO: doplnit — zdroj: spotřeba na kus × cena tuby | |
| Nářadí na montáž | Montážní stojan, ESD podložka, křížové a rovné nástroje, stahovací pásky a tkanice na kabely, lepidlo na konektory. Montáž bez stojanu se rozpadá po prvním převozu — TODO: doplnit — zdroj: ceník nářadí a spotřebného materiálu | |
| Obaly a obaly na převoz | Kartonové krabice, výplň, fólie, lepicí páska, visačky s označením obsahu a stavem. Poškozená sestava při převozu je reklamace, kterou musí pokrýt rezerva — TODO: doplnit — zdroj: zkušenost z prvních dodávek a ceník obalů | |
| Startovací zásoba dílů | Aby prodej nečekal na nákup a aby se dal první kus složit hned. Obsah musí odpovídat nejprodávanějším sestavám a limitům v `../10-nakup/12-max-ceny.md` — TODO: doplnit — zdroj: seznam nejprodávanějších dílů z evidence | |
| Případná výbava na záložní zdroj pro testy | Druhý zdroj napájení nebo tester zdrojů, aby šlo sestavu otestovat bez sítě a bez rizika shoření jediného kusu. Rozhodnutí padne až podle prvních výsledků testů — TODO: doplnit — zdroj: výsledky testů a měření z `../30-testovani-a-evidence/` | |
| **Celkem** | Součet řádků výše. Tato částka vstupuje do bodu zvratu jako jednorázový náklad | |

Sloupec částka je záměrně prázdný. Doplní se reálnou nabídkovou cenou, ne
odhadem; bez údaje zůstává buňka prázdná a bod zvratu se v tomto řádku
nepočítá.

TODO: doplnit celkovou výši startovního rozpočtu — zdroj: součet doplněných
řádků tabulky.

## Osobní versus provozní náklad

Rozpad dílů je levný, ale stojí čas a místo. Rozhodující není, jestli je věc
„potřebná", ale jestli se opakuje a jestli je chyba drahá. Nástroj, který se
dotkne jednoho kusu jednou, je osobní. Nástroj, který se dotkne stovky kusů nebo
rozhodne o tom, zda kus vůbec odejde zákazníkovi, patří do nákladů podniku.

### Osobní náklad

Co stačí jednomu člověku doma, bez zvláštního místa a bez cizí pomoci:

- běžné šroubováky, pinzeta a nůžky na pásky
- antistatický štětec, stlačený vzduch, vatové tyčky, utěrky
- jedna tuba termopasty, lepidlo na konektory, stahovací pásky
- pevný stůl a podložka, na kterou sestava položí dole
- obyčejná krabice a výplň na jednu zásilku

Tímto vybavením je možné první kus rozebrat, vyčistit a složit. Bod zvratu se
v tomto případě počítá s jednorázovými náklady rovnými ceně tohoto vybavení,
protože další sestavy už stojí jen materiál a čas.

### Provozní náklad

Co už patří do nákladů podniku, protože práce běží opakovaně:

- vyhrazené místo s ESD podložkou, nejlépe mimo obývaný prostor, kde se pracuje
  s jinou elektronikou a kde dítě či zvíře může do sestavy sáhnout
- montážní stojan, jinak se sestava při každém převozu rozpadá znovu
- druhý zdroj napájení nebo tester zdrojů — bez nich se testuje jen jeden kus
  najednou a chyba ve zdroji znamená zničení testované sestavy
- tester procesoru a RAM, pokud se má rozhodovat o verdiktu u jednotlivých dílů
  před složením do sestavy
- regál a označení skladu, aby se díl, který se nepoužil, našel a mohl vrátit do
  výpočtu marže
- pracovní místo na balení a převoz, kde se sestava dá zabalit a zkontrolovat
- pomocník, pokud se rozbor bazarové dávky nedá stihnout vlastníma rukama:
  u hromadného nákupu je právě pomocník tím, co udrží dobu obratu
- doprava na nákup a z předání, pokud není zajištěna jinak

### Rozhodovací test

Pro každou položku startovního rozpočtu, která je na hranici, se odpoví na
pět otázek. Tři „ano" znamenají provozní náklad:

- [ ] Používá se opakovaně, ne jednou?
- [ ] Chyba při použití je dražší než cena nástroje?
- [ ] Musí být k dispozici, i když zrovna nepracuji?
- [ ] Potřebuje místo, elektřinu nebo odvoz?
- [ ] Vyžaduje práci víc než jednoho člověka?

TODO: doplnit skutečnou výši jednorázových nákladů rozdělených na osobní a
provozní — zdroj: doplněná tabulka Startovní rozpočet.

## Daně a účetnictví — k ověření s účetním

**Obsah této části není daňové ani právní poradenství. Je to pouze seznam
otázek, které je nutné ověřit s účetním či daňovým poradcem nebo s příslušným
úřadem. Žádná odpověď zde uvedená není platné čtení zákona a před jakýmkoli
výdajem nebo prodejem je potřeba potvrzení odborníkem.**

Odpověďi se doplní po konzultaci. Dokud není odpověď a její zdroj zapsaný,
zůstává bod neuzavřený.

- [ ] Registrace živnosti: je činnost (nákup bazarových dílů, čištění, testování,
      sestavení a prodej sestav) živností volnou, řemeslnou nebo koncesovanou?
      Které činnosti je nutné evidovat zvlášť?
- [ ] Daňový doklad: co musí být na dokladu o prodeji, aby splňoval nároky
      živnostenské evidence, a v jaké podobě ho lze vystavit (papírově,
      elektronicky)?
- [ ] IČO a DPH: kdy je identifikační číslo při živnosti povinné a kdy je užitečné
      ho mít? Kdy vzniká povinnost registrace k DPH u tohoto typu prodeje?
- [ ] Evidence příjmů z podnikání: jak má evidence příjmů vypadat, v jaké
      podobě a na jak dlouho se uchovává?
- [ ] Doklady k nákupům: stačí účtenka, nebo je nutná faktura, aby byl výdaj
      uznán? Jak postupovat u nákupu platbou kartou a u nákupu za hotov?
- [ ] Hmotný majetek: od jaké pořizovací ceny a při jaké době použitelnosti je
      nástroj či tester zařazovan do evidence hmotného majetku pro účetní?
      Stačí evidence na papíře, nebo je nutná karta?
- [ ] Datum obratu: kdy se podle skutečných pravidel zdaňují přijaté faktury
      (datum splatnosti, datum úhrady, datum vystavení) a kdy u platby kartou
      či hotově?
- [ ] Odpočet DPH: lze u nákupu na fakturu odpočítat DPH jako OSVČ, a za jakých
      podmínek? Co naopak odpočítat nejde?
- [ ] Zjednodušené účtování v ČR pro živnostnickou činnost: je pro tuto činnost
      vhodná daňová evidence, paušální výdaj, nebo paušální daň? Jaké meze to má
      a kdy je lze přechod změnit?
- [ ] Elektronická evidence pro účetní: jak má evidence vypadat, aby ji účetní
      převzal bez dotazů a bez dohlaďování?
- [ ] Daňové doklady u plateb: co je dokladem u platby převodem a co u platby
      hotově, včetně limitu hotovostních plateb a zápisu do evidence?

TODO: doplnit datum konzultace, jméno účetního či poradce a jeho odpovědi k
jednotlivým bodům — zdroj: písemný podklad nebo e-mail od účetního či daňového
poradce.
TODO: doplnit rozhodnutí o způsobu vedení evidence a zdaňování — zdroj: po
konzultaci, zapsané v tomto dokumentu.

## Kalkulační listina jako doklad

Kalkulační listina je doklad. Musí být dostupná k prokázání příjmů a výdajů
v každém okamžiku, kdy je o nich rozhodováno — ne jen v den, kdy se sestava
prodala. Bez ní se dá prodej a výdaj prokázat jedině tvrzením.

Kalkulační listina musí být dostupná:

- k prokázání příjmů z prodeje sestavy,
- k prokázání výdajů za nákup dílů, čisticí materiál a obaly,
- k vypořádání reklamace, kdy je potřeba doložit vstupní cenu a práci,
- účetní nebo daňovému poradci, když je požádán o ověření výsledku.

Vazba na doklady z [71-kalkulace-marze.md](71-kalkulace-marze.md): kalkulační
listina je zápis výsledku, doklady jsou doklad o tom, odkud se výsledek vzal.
Jedno bez druhého se nedokáže ověřit.

TODO: doplnit dobu, po kterou je nutné kalkulační listiny uchovávat — zdroj:
účetní či daňový poradce, ve vazbě na dobu, po kterou lze prokazovat příjmy
a výdaje.
TODO: doplnit místo uložení kalkulačních listin (list, složka, evidence) a způsob
přístupu — zdroj: vlastní evidence, tabulka Sestavy v Google Sheets.
