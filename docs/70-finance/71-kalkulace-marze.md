# Kalkulace ceny a marže sestavy

**Účel:** Postup, jak z reálných pořizovacích cen a skutečných rezerv vypočítat
cílovou prodejní cenu jedné sestavy.

Související: minimální marže per tier `../40-tiery/43-cenove-pasmo.md`,
maximální nákupní ceny `../10-nakup/12-max-ceny.md`, doba obratu a peněžní
tok `72-cashflow.md`, týdenní evidence `../80-reporting/81-weekni-report.md`,
testovací protokoly `../30-testovani-a-evidence/31-testovaci-protokoly.md`.

## Základní vzorec

```text
cílová prodejní cena = (součet pořizovacích cen dílů
                       + pořizovací hodnota OEM klíče
                       + náklady na práci a čisticí materiál)
                      × (1 + marže)
                      + rezerva na reklamaci
                      + rezerva na vadné díly
```

Marže se počítá **nad náklady**, ne z prodejní ceny. Základ pro marži je součet
všech nákladů na kus, takže marže v Kč je `náklady × marže`. Kdyby se marže
počítala z prodejní ceny, musel by se procentní vztah řešit zpětně a marže by
bila různá podle toho, jestli je do ní zahrnuta i záruční rezerva.

Rezervy se přičítají až **po** vynásobení marží, protože nejsou součástí
obchodní marže — jsou to náklady, které nesou riziko.

Minimální marže je rozhoduta v
[43-cenove-pasmo.md](../40-tiery/43-cenove-pasmo.md): `LOW` 30 %, `MID` 25 %,
`HIGH` 20 %. To je **výchozí hodnota k potvrzení z reálných prodejů**, ne
dohoda. Po naplnění evidence se přepočítá.

## Co patří do nákladů

| Položka | Započítává se? | Poznámka |
| --- | --- | --- |
| Pořizovací cena dílu | Ano | Z evidence nákupu, ne odhadu. Limit je v `../10-nakup/12-max-ceny.md` |
| Doprava za nákup | Ano | Rozpočítat na kus. U nákupu z jedné aukce na více kusů je levnější kus |
| Čisticí materiál a spotřebované díly | Ano | Termopasta, větráky, kabely, šroubky, antistatické pásky, stříbro na pastice |
| Elektřina a čas | Ano | Čas na čištění, testy a sestavení; elektřina při zkouškách a předávání. Hodnota času je odhad, ale musí být zapsaná, jinak marže vypadá vyšší, než je |
| Prokazatelné poplatky prodejního kanálu | Ano | Jen co je skutečně účtováno, například Aukro. Poplatky se liší kanál od kanálu i v čase, proto se neodhadují — TODO: ověřit aktuální poplatky — zdroj: aktuální ceník daného prodejního kanálu |
| Pořizovací hodnota OEM klíče k OS | Ano, když je součástí sestavy | Klíč se započítává vždy, jakmile je součástí toho, co zákazník kupuje — tedy typicky v `MID` a `HIGH`, v `LOW` zpravidla ne. Který tier OS vůbec dovolí, je v `../40-tiery/40-tier-definice.md` |
| Přepravné při prodeji | Záleží | Je-li hrazeno zákazníkem, nezapočítává se. Pokud hradíme my, je to náklad a patří do výše uvedeného součtu |
| Reklamace | Ne přímo, ale jako rezerva | Počítá se zvlášť jako rezerva na reklamaci, viz níže |

## Rezerva na reklamace

Rezerva se neodhaduje jako procento. Vypočítá se z reálných dat:

```text
rezerva na reklamaci na kus = (počet reklamací × průměrný náklad na reklamaci)
                             / počet prodaných kusů
```

Počet reklamací se vztahuje ke stejnému období jako počet prodaných kusů, jinak
vyjde nesmysl. Průměrný náklad na reklamaci zahrnuje i výměnu dílu, práci,
dopravu tam a zpět a čas.

Záruka je součástí tohoto vztahu:

| Tier | Záruka | Vliv na rezervu |
| --- | --- | --- |
| `LOW` | 3 M | Kratší okno, ale nejmenší marže v korunách. Reklamace je vzhledem k marži významná a může ji sníst; proto 30 % marže a rezerva nesmí být vypuštěna |
| `MID` | 6 M | Střední okno i objem prodejů, rezerva se vyrovná přes rozsáhlý počet kusů |
| `HIGH` | 12 M | Nejdelší okno a největší riziko v korunách. Vůči marži 20 % na velkém zisku je ale marginální |

U `LOW` tedy nesmí vyjít rezerva podhodnocená jen proto, že záruka je nejkratší.
Krátká záruka zmenšuje pravděpodobnost, dlouhá ji prodlužuje — do vztahu však
patří vždy se skutečným počtem reklamací a skutečným nákladem na ně.

TODO: doplnit výši rezervy v Kč na kus pro jednotlivé tiery — zdroj: tabulka
Reklamace v Google Sheets, vlastní statistika reklamací (počet reklamací a
náklad na reklamaci na prodaný kus, zvlášť pro `LOW`, `MID` a `HIGH`).

## Neúspěšné komponenty

| Situace | Možnost | Kdy se to vyplatí |
| --- | --- | --- |
| Test neprošel | Rozmontování na díly | Vždy. I zdroj napájení nebo základní deska se rozmontují; prodejné díly jdou zpět do skladu |
| Test neprošel | Odpad (elektronický odpad) | Až když z dílu není co rozmontovat a není odvoz ani uložení do odpadu nic |
| Test neprošel | Prodej jednotlivého dílu | Jen u funkčního dílu, který neprošel jen jako součást sestavy (například vadný procesor se dá použít do jiné základní desky) |
| Test prošel s výhradou | Prodej jednotlivého dílu | Když je dílo použitelný a vada je deklarovatelná zákazníkovi |
| Test prošel s výhradou | Rozmontování na díly | Když je vada kosmetická, ale zákazník by ji u krytu nebo pastice nechtěl |
| Vadný po čištění | Oprava | Když je oprava rychlá a náklad na ni je menší než hodnota rezervovaného kusu |
| Vadný po čištění | Rozmontování na díly | Když se rozpadla součást, kterou jde použít jinde |
| Vadný po čištění | Odpad | Když je dílu odepsaný kus ztracený |

Rozhodnutí musí být zapsané do evidence dílů, jinak se ztracený kus přiúčtuje
marži sestavy, která ho neplatila.

## Vzorová kalkulace

Tato tabulka je **přímo strukturou jednoho listu v Google Sheets**: jeden list =
jedna sestava. Jeden řádek = jedna položka, sloupec s vzorcem. Prázdné
placeholders se doplní při skládání, ne odhadem.

| Položka | Pořizovací cena | Poznámka |
| --- | --- | --- |
| CPU | — | Z evidence nákupu |
| GPU | — | Z evidence nákupu |
| Základní deska | — | Z evidence nákupu |
| Paměť | — | Z evidence nákupu |
| Disk | — | Z evidence nákupu |
| Zdroj napájení | — | Z evidence nákupu |
| Skříň | — | Z evidence nákupu |
| Chlazení a větráky | — | Z evidence nákupu, případně spotřebované |
| OEM klíč k OS | — | Vždy, když je součástí sestavy — typicky v `MID` a `HIGH`, v `LOW` zpravidla ne; dle `../40-tiery/40-tier-definice.md` |
| Čisticí materiál a spotřebované díly | — | Termopasta, stříbro, kabely |
| Čas a elektřina | — | Odhad hodnoty práce, zapsaný do evidence |
| Doprava za nákup | — | Rozpočítaná na kus |
| Poplatky prodejního kanálu | — | Jen prokazatelné, dle kanálu |
| **Mezisoučet nákladů** | — | Součet řádků výše |
| **Marže v Kč** | — | `mezisoučet × marže` dle tieru |
| **Marže v %** | — | Dle minimální marže v `../40-tiery/43-cenove-pasmo.md` |
| **Rezerva na reklamaci** | — | Z výpočtu v části výše |
| **Rezerva na vadné díly** | — | TODO: způsob výpočtu — zdroj: vlastní statistika odpisů |
| **Cílová prodejní cena** | — | `((mezisoučet) × (1 + marže)) + rezervy` |

Prázdné buňky znamenají, že hodnota zatím neexistuje. Nedoplňují se odhadem —
bez údaje zůstává buňka prázdná a sestava se neprodá.

## Časté chyby

- [ ] Koupí se slevný díl, který jde mimo tier a zvedne nejnižší spec sestavy.
      Pak sestava vypadá jako `HIGH`, ale marže je `LOW`. Řešení je limit v
      `../10-nakup/12-max-ceny.md` a kontrola tieru podle
      `../40-tiery/40-tier-definice.md`.
- [ ] Rezerva na reklamaci se zapomene. Bez ní se marže vypočítá jen z dílů a
      první reklamace znamená záporný výsledek. Viz část Rezerva na reklamace.
- [ ] Elektřina a čas se nezapočítají. Marže pak vypadá vyšší, než je, a
      nákup dalšího kusu tuto chybu zopakuje.
- [ ] Marže se utratí dřív, než se prodají všechny nakoupené díly. Nerozprodaný
      sklad je peníze vázané, ne marže. Viz `72-cashflow.md`.
- [ ] Sestava se prodá pod cílovou cenu z [43-cenove-pasmo.md](../40-tiery/43-cenove-pasmo.md),
      aby se „ušetřila doba" — zlevnění není doba, ale marže.

## Vztah k ostatním dokumentům

| Oblast | Dokument |
| --- | --- |
| Minimální marže per tier, záruka, pásmo | `../40-tiery/43-cenove-pasmo.md` |
| Maximální nákupní ceny dílů | `../10-nakup/12-max-ceny.md` |
| Nákupní cena a zařazení do evidence | `../20-prijem-a-sklad/21-prijemka.md` |
| Výsledek testů, základ pro verdikt o dílu | `../30-testovani-a-evidence/31-testovaci-protokoly.md` |
| Doba obratu skladu a doba utratení marže | `72-cashflow.md` |
| Zápis prodejní ceny a marže do evidence | `../80-reporting/81-weekni-report.md` |

TODO: doplnit výši rezervy na vadné díly — zdroj: vlastní evidence odpisů a
likvidace v `../20-prijem-a-sklad/21-prijemka.md`.
TODO: doplnit průměrný náklad na reklamaci podle typu reklamace — zdroj: tabulka
Reklamace v Google Sheets.
TODO: ověřit, že vypočtená cena leží v pásmu daného tieru — zdroj: reálné
prodejní ceny z tabulky Sestavy v Google Sheets.
