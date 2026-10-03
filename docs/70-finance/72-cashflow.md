# Přítok a odtok peněz

**Účel:** Popsat, jak se peníze v podniku pohybují, proč u bazarového zboží trvá
doba obratu tak dlouho a kolik peněz musí být v rezervě, aby šlo nakupovat dál.

Související: kalkulace ceny a marže `71-kalkulace-marze.md`, skladování
`../20-prijem-a-sklad/23-skladovani.md`, maximální nákupní ceny
`../10-nakup/12-max-ceny.md`, evidence komponent
`../30-testovani-a-evidence/32-evidence-komponent.md`, týdenní report
`../80-reporting/81-weekni-report.md`.

## Definice doby obratu

Doba obratu je doba od zaplacení dílů po okamžik, kdy dojde k inkasu peněz za
hotovou sestavu. Měří se ve dnech a počítá se od platby dodavateli nebo
prodejci na aukci, ne od okamžiku, kdy sestava vyjde z dílny.

U bazarového zboží je tato doba dlouhá, protože mezi platbou a inkasem leží
více kroků, z nichž žádný nejde urychlit penězi:

| Krok | Co dělá | Proč prodlužuje dobu obratu |
| --- | --- | --- |
| Dojezd a prohlídka | Ujetí na místo, vyjímání dílů, kontrola funkčnosti na místě | Trvá hodiny až půl dne a nejde zkrátit |
| Dovoz | Převoz dílů do dílny | Podle vzdálenosti hodiny, u rozsáhlého nákupu více |
| Čištění | Rozdemontování, mytí, odstranění oxidů a zápachu, znovu složení | U každého kusu zvlášť, nejde omezit na minimum bez rizika reklamace |
| Testování | Zkouška dílů i sestavené sestavy, zápis výsledků | Test musí proběhnout včetně zápisu do evidence |
| Sestavení | Výběr dílů podle tieru, složení, povrchová úprava | Termopasta, kabely, chlazení, kabely do úhlu |
| Čekání na kupce | Sestava stojí v nabídce, než ji někdo koupí | Nejdelší a nejméně předvídatelná část |
| Vyjednávání o slevě | Zákazník žádá slevu, čekáme na odpověď | Protahuje se i o dny, marže tím jen klesá |

Závěr: u FLIPCORE rozhoduje **rychlost obratu víc než výška marže na kus**.
Sestava s menší marží, ale prodaná do týdne, uvolní peníze na další nákup
dřív než sestava s velkou marží, která čeká dva měsíce.

```text
doba obratu (dny) = den inkasa za sestavu − den zaplacení dílů
```

## Proč to ohrožuje fungování

Když se nakupuje rychleji, než prodává, přítok peněz za prodej nestačí
pokrýt odtok za nákup. Nastává tohle:

- **Peníze vázané ve skladu.** Nakoupené díly jsou majetek, ale ne peníze.
  Dokud nejsou prodané, za ně nelze platit další nákup. Viz
  [`../20-prijem-a-sklad/23-skladovani.md`](../20-prijem-a-sklad/23-skladovani.md).
- **Neschopnost koupit další vlnu.** Rezerva je vázaná v neprodaných kusech,
  takže na další aukci není co platit. Špatné cenové příležitosti se propadnou
  a konkurence je koupí levněji.
- **Prodej pod cenou, aby se peníze vrátily.** Tlak na rychlé utrpení marže
  končí slevou pro zákazníka. Zlevnění není úspora doby obratu, ale prohra na
  marži — viz [`71-kalkulace-marze.md`](71-kalkulace-marze.md).
- **Rezerva na reklamaci se počítá z prodaného.** Když se prodává pomalu,
  reklamace se stihnou přičíst dřív, než dojde k inkasu.

## Jak velkou rezervu držet

Rezerva na nákup je odvozená od skladu, ne od obratu. Postup výpočtu:

```text
potřebná rezerva na nákup = průměrný počet kusů ve skladě
                            × průměrná pořizovací cena jednoho kusu
```

- **Průměrný počet kusů ve skladě** — kolik kusů (nedokončených i hotových)
  bývá v průměru ve skladu. Brát maximum za poslední měsíc znamená rezervu
  nadhodnocenou, průměr posledních několika týdnů je realističtější.
- **Průměrná pořizovací cena kusu** — součet pořizovacích cen dílů na jednu
  sestavu včetně dopravy a spotřebovaného materiálu, ne jen cena samotného
  dílu. Z evidence nákupu, ne odhadu.

Rezerva musí pokrýt i případ, že prodej na pár týdnů zastaví a bazarový
prodejce nebo aukční platforma odmítne prodloužit termín. Rezerva bez
rezervního místa v ní je v pořádku v jednom směru a chybí ve druhém — drží se
na účtu, ne v bednách s nedokončenou sestavou.

| Položka | Hodnota | Kde doplnit |
| --- | --- | --- |
| Průměrný počet kusů ve skladě | — | Evidence skladu, `../20-prijem-a-sklad/23-skladovani.md` |
| Průměrná pořizovací cena kusu | — | Evidence nákupu, `../30-testovani-a-evidence/32-evidence-komponent.md` |
| Potřebná rezerva v Kč | — | Součin obou řádků výše |

TODO: doplnit průměrný počet kusů ve skladě — zdroj: evidence skladu, průměr
týdenních počtů kusů ve skladu.
TODO: doplnit průměrnou pořizovací cenu jednoho kusu v Kč — zdroj: evidence
nákupu, součet pořizovacích cen dílů na sestavu včetně dopravy.
TODO: doplnit výši rezervy v Kč a datum, ke kterému platí — zdroj: výpočet
z obou údajů výše, zkontrolovat proti zůstatku na účtě.

## Záporný přítok

Přítok je součet peněz, které do podniku přišly (prodej sestavy, prodej
jednotlivého dílu). Odtok je součet peněz, které odešly (nákup dílů,
doprava, čisticí materiál, prodejní kanál, reklamace). Rozdíl za období je
záporný přítok, pokud odtok převýší přítok.

- **Kdy vzniká normálně:** v den nákupu. Jedna platba za vlnu dílů je odtok,
  inkaso za sestavu přijde až o týdny později. Záporný přítok v den nákupu je
  běžná věc, ne problém.
- **Kdy je normální i po týdnech:** během pomalého prodeje, pokud rezerva
  vydrží dobu obratu vypočtenou výše.
- **Kdy je varování:** přítok je záporný dvě po sobě jdoucí vlny nákupu bez
  mezitím prodané sestavy, nebo odtok za nákup převýší zůstatek na účtě.
  Pak už nejde o dobu obratu, ale o nákup, na který nejsou peníze.
- **Kdy je chyba evidence:** záporný přítok jen proto, že se nezapsal prodej
  nebo se nezapočetla marže. Nejdřív zkontrolovat zápis prodejní ceny, pak
  jednat.

## Pracovní kapitál versus zisk

Zisk na papíře neznamená peníze na účtu. Marže se vypočítá v okamžiku
sestavení sestavy, ale peníze za ni existují až po zaplacení zákazníkem.

| Okamžik | Co existuje | Co neexistuje |
| --- | --- | --- |
| Sestava složená a otestovaná | Marže v kalkulaci | Peníze na účtu |
| Sestava prodaná a zaplacená | Peníze na účtu, omezené částkou po odečtení prodejních nákladů | Zisk za celý nákup, protože část dílů leží dál ve skladu |
| Zaplacené všechny nakoupené díly | Celý zisk z této vlny | — |

Marže se nesmí utrácet, dokud nejsou zaplacené všechny nakoupené díly. Když se
marže jedné sestavy použije na nákup další, ale v druhé vlně je polovina
dílů neprodaná, marže vypočtená neexistuje — v účetnictví se sice objeví,
provoz ale nemá čím zaplatit. Výpočet ceny a jednotlivé položky marže jsou
v [`71-kalkulace-marze.md`](71-kalkulace-marze.md).

## Co sledovat každý týden

Tyto čtyři ukazatele se přebírají do
[`../80-reporting/81-weekni-report.md`](../80-reporting/81-weekni-report.md),
kde se vyplňují z evidence skladu a evidence prodeje.

| Ukazatel | Kdy je hodnota špatná |
| --- | --- |
| Průměrná doba obratu | Delší než cílová doba obratu; roste dva týdny po sobě. Viz `01-obchodni-model.md` |
| Počet kusů ve skladě | Růst oproti předchozímu týdnu bez odpovídajícího růstu prodeje; překročí kapacitu skladu z `../20-prijem-a-sklad/23-skladovani.md` |
| Hodnota skladu v Kč | Převýší vypočtenou potřebnou rezervu; blíží se zůstatku na účtě |
| Počet kusů čekajících víc než měsíc | Jakýkoliv kus čeká déle než měsíc; podíl těchto kusů roste |

Nápojový limit na nákup je v [`../10-nakup/12-max-ceny.md`](../10-nakup/12-max-ceny.md)
a rozhodnutí o dílu musí být doložené v
[`../30-testovani-a-evidence/32-evidence-komponent.md`](../30-testovani-a-evidence/32-evidence-komponent.md).

TODO: doplnit cílovou průměrnou dobu obratu ve dnech — zdroj: `01-obchodni-model.md`
a vlastní statistika prodaných sestav.
TODO: doplnit limit počtu kusů ve skladě — zdroj: fyzická kapacita skladu
z `../20-prijem-a-sklad/23-skladovani.md`.

## Vztah k ostatním dokumentům

| Oblast | Dokument |
| --- | --- |
| Výpočet prodejní ceny a marže na kus | `71-kalkulace-marze.md` |
| Evidence kusů ve skladu a doba stání | `../20-prijem-a-sklad/23-skladovani.md` |
| Limit nákupní ceny dílu a nápojový limit | `../10-nakup/12-max-ceny.md` |
| Záznam stavu dílu a výsledků testů | `../30-testovani-a-evidence/32-evidence-komponent.md` |
| Týdenní vyplnění ukazatelů | `../80-reporting/81-weekni-report.md` |

TODO: doplnit cílovou dobu obratu a toleranci odchylky — zdroj: vlastní
statistika prodejů z evidence prodeje v Google Sheets.
