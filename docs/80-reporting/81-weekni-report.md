# Týdenní report

**Účel:** Slouží k tomu, aby se každý týden vidělo, jestli podnik vydělává a jestli se v něm nezasekávají peníze.

Související: marže na kus `../70-finance/71-kalkulace-marze.md`, doba obratu
a peněžní tok `../70-finance/72-cashflow.md`, návratnost nákupů
`../70-finance/73-rozpocet-a-break-even.md`, maximální nákupní ceny
`../10-nakup/12-max-ceny.md`, prověření dodavatele `../10-nakup/11-due-diligence.md`,
čištění a testování `../20-prijem-a-sklad/22-cipovani-a-cisteni.md`,
evidence `../30-testovani-a-evidence/32-evidence-komponent.md`, cenové pásmo
a marže podle tieru `../40-tiery/43-cenove-pasmo.md`.

## Účel reportu

Report existuje za jedinou věc: aby bylo na první pohled vidět, jestli podnik
vydělává a jestli se v něm nezasekávají peníze. Vše ostatní jsou jen čísla,
kterými se k té odpovědi dojde.

## Kdy a kde

- Každý pátek, nebo pokud připadá na víkend, hned první pracovní den po víkendu.
- Patnáct minut. Delší zápis znamená, že se někde sbírá data zbytečně.
- Všechno do jednoho listu v Google Sheets, aby se na to nebyl žádný
  samostatný soubor ani papír.
- Podklady se berou z evidence skladu a evidence komponent
  (`../30-testovani-a-evidence/32-evidence-komponent.md`), odmítnuté nákupy
  z [`../../templates/odmitnuti-nakupu.md`](../../templates/odmitnuti-nakupu.md),
  reklamace z [`../../templates/reklamace.md`](../../templates/reklamace.md).

## Sledované ukazatele

Poslední sloupec je pro porovnání proti minulému týdnu. Hodnota se propíše ručně,
aby bylo vidět, kam se hodnota posunula.

**Cílová hodnota je u každého ukazatele zatím `TODO: doplnit po několika
týdnech provozu`.** Do té doby se hodnoty posuzují jen proti předchozímu týdnu
a proti vlastnímu úsudku, žádná čísla zvenku se nepřebírají.

| Ukazatel | Kde se data berou | Co znamená | Kdy je hodnota špatná | Předchozí hodnota |
| --- | --- | --- | --- | --- |
| Marže na kus v Kč | Evidence prodejů, prodejní cena proti nákladům kusu z `../70-finance/71-kalkulace-marze.md` | Kolik korun zůstane po odečtení všech nákladů na kus | Když je nižší než minulý týden nebo než vyjde z kalkulace | `TODO: doplnit po několika týdnech provozu` |
| Marže na kus v procentech | Evidence prodejů, stejné údaje jako u marže v Kč | Marže vyjádřená jako podíl z prodejní ceny, aby se kusy různých tierů daly porovnat | Když klesá dlouhodobě, ne jen při jednom špatném prodeji | `TODO: doplnit po několika týdnech provozu` |
| Průměrná doba obratu: nákup až prodej | Evidence skladu, datum přijetí a datum prodeje u každého kusu | Za jak dlouho se z nákupu stane hotová sestava a peníze na účtu | Když doba roste proti minulému týdnu nebo proti tomu, co předpokládá `../70-finance/72-cashflow.md` | `TODO: doplnit po několika týdnech provozu` |
| Počet kusů čekajících ve skladě | Evidence skladu, všechny kusy se stavem „v oběhu" nebo „při testu" | Kolik kusů teď leží a čeká na prodej | Když roste a prodané kusy nestačí, aby se zásoba stáhla | `TODO: doplnit po několika týdnech provozu` |
| Hodnota skladu v Kč | Evidence skladu, pořizovací hodnota kusů, které nejsou prodané | Kolik peněz leží ve skladě a ještě nevydělalo nic, protože nejsou na účtu | Když roste rychleji než peníze na účtu, nebo když přesáhne to, co je v `../70-finance/73-rozpocet-a-break-even.md` dovoleno | `TODO: doplnit po několika týdnech provozu` |
| Počet kusů čekajících víc než měsíc | Evidence skladu, rozdíl data prodeje a data přijetí | Kolik kusů leží déle než měsíc a peníze v nich jsou zamčené | Když vyjde jakýkoliv kus starý víc než měsíc — znamená to, že buď leží špatně cena, nebo byl nákup chybný | `TODO: doplnit po několika týdnech provozu` |
| Podíl kusů v jednotlivých tierech LOW / MID / HIGH | Evidence skladu a evidence prodejů, tier u každého kusu podle `../40-tiery/43-cenove-pasmo.md` | Jak se zásoba a prodeje rozdělují mezi tři cenové úrovně | Když se v některém tieru hromadí kusy, které se neprodávají | `TODO: doplnit po několika týdnech provozu` |
| Počet reklamací a podíl reklamací na prodaných kusech | Reklamace podle [`../../templates/reklamace.md`](../../templates/reklamace.md), prodané kusy z evidence prodejů | Kolik kusů se vrátilo nebo reklamovalo a jak velkou část prodejů to zabralo | Když podíl roste proti minulému týdnu | `TODO: doplnit po několika týdnech provozu` |
| Počet odmítnutých nákupů | Záznamy odmítnutých nákupů podle [`../../templates/odmitnuti-nakupu.md`](../../templates/odmitnuti-nakupu.md) | Kolik kusů bylo u inzerátu nebo u prohlídky odmítnuto | Sám o sobě není špatně. Je špatné, když hodnota nízká a přitom jsou pořád k dispozici nové inzeráty — znamená to, že se nekupuje dost nebo že se nehodnotí správně | `TODO: doplnit po několika týdnech provozu` |
| Výtěžnost nákupu | Evidence komponent, každý nakoupený díl má stav „v sestavě" nebo „odpad" | Kolik nakoupených dílů skutečně skončilo v sestavě a koliko v odpadu | Když podíl odpadu roste — pak se nakupují špatné kusy nebo se špatně testuje | `TODO: doplnit po několika týdnech provozu` |

## Tři otázky, které si položit

1. Kolik kusů čeká ve skladu a za jak dlouho se průměrně prodají?
2. Který tier se prodává nejlépe a který se vůbec neprodává?
3. Kolik peněz je vázaných ve skladě proti tomu, kolik je na účtu?

## Co s výsledkem

Zápis do reportu je jen první krok. Každý týden se z něj odnese jedno
rozhodnutí:

- **Marže na kus klesá** — zastavit nákup toho typu dílu a zkontrolovat
  nákupní ceny podle `../10-nakup/12-max-ceny.md`.
- **Sklad roste** — omezit nákup na to, co se reálně do měsíce prodá.
- **Rostou reklamace** — vrátit se k `../20-prijem-a-sklad/22-cipovani-a-cisteni.md`
  a `../10-nakup/11-due-diligence.md` a zkusit najít, co se testuje špatně.
- **Rostou kusy čekající víc než měsíc** — mrknout na nákupní ceny a na to,
  zda nejsou kusy prodávané pod cenou, protože se vůbec nepověděla.

## Checklist týdenního reportu

- [ ] Zapsat všechny prodeje z tohoto týdne, ať se nezapomněnou.
- [ ] Zapsat nově přijaté kusy i všechny kusy vyřazené do odpadu.
- [ ] Zapsat, které kusy se prodaly, ke kterému datu přijetí patří.
- [ ] Vypočítat průměrnou dobu obratu.
- [ ] Spočítat, kolik kusů leží ve skladě a kolik z nich čeká víc než měsíc.
- [ ] Přepočítat hodnotu skladu v Kč.
- [ ] Rozdělit kusy a prodeje podle tierů LOW / MID / HIGH.
- [ ] Vybrat reklamace za tento týden a porovnat s počtem prodaných kusů.
- [ ] Zapsat odmítnuté nákupy s důvodem.
- [ ] Zjistit výtěžnost nákupu: v sestavě proti odpadu.
- [ ] Porovnat všechny ukazatele s předchozím týdnem a opsat rozdíl.
- [ ] Odpovědět na tři otázky výše.
- [ ] Zapsat jedno rozhodnutí, které z reportu vyplynulo, a co s ním týden uděláme.
