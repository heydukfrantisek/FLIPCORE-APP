# Obchodní model

**Účel:** Popisuje, komu FLIPCORE prodává, odkud pochází příjem, která čísla se sledují týdně a proč je sortiment rozdělený právě na tři tiere.

## Cílové segmenty

Sortiment tvoří tři segmenty a každý z nich má jinou kupní sílu, jiné použití a jiné
otázky. Tier odpovídá segmentu — podrobné pravidlo je v
[40-tier-definice.md](40-tiery/40-tier-definice.md), vzorové sestavy v
[44-referencni-sestavy.md](40-tiery/44-referencni-sestavy.md).

| Segment | Tier | Typická kupní síla | Hlavní použití |
| --- | --- | --- | --- |
| Kancelář, škola, stážista, senior | `LOW` | Nejnižší — hledá co nejlevnější funkční počítač | Office, e-mail, prohlížeč, videohovory |
| Hráč 1080p, univerzální domácí počítač | `MID` | Střední — hledá hratelnou sestavu bez přehánění | Hraní ve 1080p / 60 fps, domácí použití |
| Hráč 1440p, práce s videem a 3D | `HIGH` | Nejvyšší z cílové skupiny — hledá výkon na pár let | 1440p, střih videa, 3D modelování |

### a) Kancelář, škola, stážista, senior — `LOW`

- **Kdo to je:** Malá firma, úřad, škola, domácí kancelář nebo člověk v penzi, který
  potřebuje počítač na práci s dokumenty. Kupuje sebe nebo dítěti, často poprvé.
- **Co od sestavy potřebuje:** Aby se všechno otevřelo a nepadalo. Kancelář, e-mail,
  prohlížeč, videohovory, tisk. Bez her, bez Windows.
- **Na co se ptá:** Jestli je rychlý, kolik má paměti, jestli se k němu dá připojit
  tiskárna, a hlavně **kolik stojí a jestli je vůbec potřeba nový**. Často se ptá
  i, jestli je to srovnatelné s novým počítačem stejné ceny.
- **Čím se liší:** Nejhůře odpovídá na technické dotazy — model procesoru a
  grafické karty mu nic neříká, a právě na něj může bazarový prodejce narazit
  nejvíc. Potřebuje srozumitelný laický název, viditelný stav a jasné sdělení, že
  systém si řeší sám.
- **Prodejní důsledek:** Nejnižší vstupní cena, která nákupníka přesvědčí, a jasné
  sdělení, že systém si řeší sám — jinak se ptá na Windows a cena se hned posune.

### b) Hráč 1080p, univerzální domácí počítač — `MID`

- **Kdo to je:** Student, začínající hráč nebo člověk, který koupí „počítač na
  hraní a když něco, tak i do práce". Nejpočetnější segment.
- **Co od sestavy potřebuje:** Starší a esports tituly, GTA V, Valorant, CS2 na
  střední nastavení ve 1080p. Vedle toho běžné domácí použití.
- **Na co se ptá:** Kolik snímků v sekundě dostanu, jestli zvládne i to, co vyjde
  zítra, kolik má paměti a jestli se to dá rozšířit. Ptá se na model grafické karty
  výrazně častěji než na procesor.
- **Čím se liší:** Očekává, že sestava bude „herní", a má vlastní představu o tom,
  co herní znamená. Je citlivý na přehnané sliby a přesněji než `LOW` kontroluje
  model karty. Na systém se ptá méně často než kancelářský zákazník — často počítá
  s tím, že Windows si nainstaluje sám.
- **Prodejní důsledek:** Rozhoduje grafická karta, proto do MIDu patří karty,
  které zvedají herní výkon o celý tier oproti kancelářské sestavě.

### c) Hráč 1440p a práce s videem / 3D — `HIGH`

- **Kdo to je:** Vážnější hráč, který hraje na 1440p a chce pár let klid, nebo člověk,
  který stříhá video, dělá 3D modelování nebo pracuje s renderem.
- **Co od sestavy potřebuje:** 1440p hraní, střih videa, práce s 3D. Dostatek paměti,
  rychlý disk a zdroj, který to všechno utáhne. Windows 11 nativně tam, kde to
  platforma umožňuje — Ryzen 5000+ a Intel 10.–14. gen; Intel 9. generace fTPM
  nemá a potřebuje samostatný modul TPM 2.0. Tady se OS objevuje jako součást
  poptávky, ne jako překážka. Přesná hranice je v
  [40-tier-definice.md](40-tiery/40-tier-definice.md).
- **Na co se ptá:** Kolik jader a s jakou frekvencí, kolik paměti, jestli sedí v
  NVMe, kolik má wattů zdroj a **zda se to dá dále rozšířit**. Ptá se i na platformu,
  protože chce vědět, zda bude moderní i za tři roky.
- **Čím se liší:** Nejcitlivější na výkon a nejméně citlivý na cenu v poměru k
  výkonu. Už ví, co hledá, a umí si porovnat parametry. Očekává, že dostane
  nejdelší záruku a nejméně výmluv, protože bazarový stav u této ceny nevnímá
  jako zásadní problém.
- **Prodejní důsledek:** Nejvyšší marže na kus, protože na této úrovni je rozdíl mezi
  výkonem a cenou nejmenší a zákazník navíc platí za delší záruku.

## Zdroje příjmů a ekonomika jednotky

Jednotkou je sestava — počítá se marže na jednu sestavu, ne na kus sortimentu nebo
na měsíc.

| Otázka | Odpověď |
| --- | --- |
| Odkud příjem? | Prodej sestavy koncovému zákazníkovi (B2C). |
| Jaká je jednotka? | Jedna sestava. Marže se počítá z jednotky. |
| Co do jednotky vstupuje? | Pořizovací ceny dílů, práce, rezerva na reklamaci, ostatní náklady (doprava, poplatky platformy). |
| Co k jednotce náleží? | Cílová prodejní cena sestavy včetně záruky dle tieru. |

Model je jednoduchý a záměrný: **jeden výrobek, jeden kanál prodeje, jeden způsob
výpočtu zisku**. Příjem dělíme v jediné jednotce — sestavě — a marži počítáme
každý kus zvlášť, aby se dálo říct, které sklady a které tiere marži přinášejí
([71-kalkulace-marze.md](70-finance/71-kalkulace-marze.md)).

Důležitý rozdíl: **marže se počítá z jednotky, ale tok hotovosti (cash flow) je omezen
rychlostí obratu.** Marže může být na kus kladná a přesto v podniku nezbývá na další
nákup, protože jednotka leží ve skladu příliš dlouho nebo se nákup musel zaplatit
v hotovosti předem. Rozhoduje tedy nejen výška marže, ale i **doba obratu** — čas od
nákupu do prodeje ([72-cashflow.md](70-finance/72-cashflow.md)).

Hlavní příjem má jediný kanál: prodej sestavy koncovému zákazníkovi. Není tu
pronájem, servisní zakázka ani B2B. **Výjimkou je prodej jednotlivého dílu nebo
kusu mimo sortiment tierů** — funkční díl, který neprošel jen jako součást
sestavy, nebo hotová sestava, která nesplňuje minimum žádného tieru, jde
koncovému zákazníkovi jako samostatný kus. To je mimo hlavní činnost a nesmí se
to plést s prodejem sestav podle tieru: marže se u takového kusu nepočítá podle
tieru. Viz
[71-kalkulace-marze.md](70-finance/71-kalkulace-marze.md),
[61-prodejni-kanaly.md](60-prodej/61-prodejni-kanaly.md) a
[00-uvod-a-glosar.md](00-uvod-a-glosar.md).

## Sledované ukazatele

Ukazatele se měří týdně a vyhodnocují v
[81-weekni-report.md](80-reporting/81-weekni-report.md). Slouží k tomu, aby se
rozhodovalo podle čísel, ne podle dojmu — a aby se zjistilo, jestli se daří nakupovat
levněji, skládat rychleji a prodávat dráž.

| Ukazatel | Co znamená | Proč se sleduje |
| --- | --- | --- |
| Marže na kus v Kč | Rozdíl cílové prodejní ceny a nákladů na jednu sestavu | Zjistí, jestli je sortiment vůbec ziskový. |
| Marže na kus v % | Totéž vyjádřené procentem k prodejní ceně | Odliší levný `LOW` od drahého `HIGH` — v korunách může vypadat jinak než v procentech. |
| Průměrná doba obratu | Průměrný čas od nákupu po prodej, ve dnech | Určuje, jak rychle se hotovost vrací do dalšího nákupu ([72-cashflow.md](70-finance/72-cashflow.md)). |
| Podíl kusů v jednotlivých tierech | Kolik kusů spadá do `LOW`, `MID` a `HIGH` | Ukáže skutečný mix sortimentu a jestli plán odpovídá tomu, co nakupujeme. |
| Podíl reklamací | Reklamace na kusy prodané za dané období | Záruka a reklamace jsou nákladovou položkou — podíl reklamací přímo tlačí na výši rezervy. |
| Počet odmítnutých nákupů | Kolik kusů nebo nabídek jsme odmítli | Jde o ušetřený čas a peníze. Vysoký počet odmítnutých u levného zboží znamená, že kanál nebo filtř cena neodpovídá. |
| Výtěžnost čištění | Podíl dílů po čištění, které se použijí proti odpadu | Jde o výnos z každého rozebraného kusu. Rozhoduje, jestli se nákup celé sestavy vůbec vyplatí. |

TODO: doplnit cílové hodnoty ukazatelů (minimální marže v Kč i v %, cílová doba obratu,
povolený podíl reklamací) — zdroj: první tři měsíce evidence v Google Sheets a
zasedávání podle [81-weekni-report.md](80-reporting/81-weekni-report.md).

## Proč tři tiere a ne jedna

Jedna univerzální sestava by uspokojila jen prostředního zákazníka. Rozdělení na tři
tiery plní tři různé úkoly najednou:

- **`LOW` — vstupní cena a odbyt.** Nejnižší cena, kterou můžeme nabídnout, a zároveň
  odbyt pro levné díly, které do dražší sestavy nevejdou — často výraznější rozdíl
  než u součástek běžně nakupovaných nově. Když cena neklesá pod určitou hranici,
  nejsme pro nejchudší zákazníky relevantní vůbec.
- **`MID` — objem.** Nejpočetnější vrstva: hráčské a univerzální domácí sestavy se
  prodávají opakovaně, ale tyhle kusy mají přibližně nejnižší marži na kus.
- **`HIGH` — nejvyšší marže na kus.** Konkurence zde neporovnává jen cenu, ale
  konfiguraci. Dostat kombinaci, která v bazaru není k dostání za běžné ceny, umožní
  prodat i nad rámec cen, které by jinak dávaly smysl. Tato vrstva nese nejdelší
  záruku, a proto i největší rezervu na reklamaci.

Cenové pásmo je orientační: **odhad z trhu (říjen 2026), ne náš ceník a ne smluvní
údaj** — definitivní hodnoty patří do [43-cenove-pasmo.md](40-tiery/43-cenove-pasmo.md):

| Pásmo | Orientační rozmezí (odhad, říjen 2026) | Tier |
| --- | --- | --- |
| Kancelářské repasované sestavy | do přibližně 10 000 Kč | `LOW` |
| Herní základ | přibližně 13 000–20 000 Kč | `MID` |
| Výkonější sestavy | přibližně 20 000–30 000 Kč a výše | `HIGH` |

Rozhraní tierů je důsledek rozdílné kupní síly: levná sestava musí být levná opravdu,
jinak si ji kancelářský zákazník koupí raději novou. Výkonnější sestava naopak
kupuje nové zboží jen při výrazně vyšší ceně — a tady je prostor pro nejvyšší marži.

TODO: doplnit vlastní cenové pásmo a minimální marži podle tieru z reálných nákupů a
prodejů — zdroj: evidence nákupů v Google Sheets a
[43-cenove-pasmo.md](40-tiery/43-cenove-pasmo.md).

## Konkurence a pozicioning

Na českém trhu bazarových sestav působí eshopy a velké bazardy, které prodávají
sestavy typicky se zárukou 12–24 měsíců a s Windows 11 Pro. Příklady, u kterých je
třeba předpoklad ověřit: compraidder, bestcomp, HelloComp.

**Předpoklad k ověření, ne závěr:** konkurence prodává větší záruku a systém
v balíku. FLIPCORE se od ní liší cenou u `LOW` a `MID` a kratší, ale jasnou zárukou
(3 / 6 / 12 měsíců podle tieru). Není to výhoda na všechny — je to jiné místo na
trhu: kupující, kterému záruka 12 měsíců u konkurence vyhovuje, nemusí na FLIPCORE
přijít, a naopak.

Poloha FLIPCORE na trhu:

| | FLIPCORE | Bazarové e-shopy |
| --- | --- | --- |
| Záruka | 3 / 6 / 12 měsíců podle tieru, vlastní silou | zpravidla 12–24 měsíců |
| Operační systém | převedený OEM klíč, nebo prodej bez OS | často Windows 11 Pro v ceně |
| Sortiment | desktop tower ve třech známých tierech | široký, i mimo bazarový původ |
| Cena u `LOW` a `MID` | cílíme pod běžnou bazarovou cenou | zpravidla vyšší |
| Cena u `HIGH` | cílíme na konfiguraci, ne na nejnižší cenu | srovnává se kus po kusu |

Největší rozdíl je v tom, že FLIPCORE prodává jen to, co sám složil a otestoval:
každý kus má známou historii dílů, vlastní výsledky testů a sjednané sériové číslo.

TODO: ověřit u konkrétních konkurenčních e-shopů aktuální záruku, obsah balíku a
cenové pásmo jejich sestav ve stejných tierech a doplnit sem — zdroj: veřejné
inzeráty a ceníky těchto e-shopů, porovnání provést jednou za čtvrtletí.

## Procesní diagram

Čtecí pořadí obchodního modelu, zjednodušené na přechody mezi bloky:

```text
Poptávka po hotovosti
   -> vyhledání dílů (10-nakup)
        -> prověření inzerátu před cestou (11-due-diligence)
             -> nákup a příjem do skladu (21-prijemka)
                  -> čištění a rozdělení na díly (22-cipovani-a-cisteni)
                       -> testování a evidence (31-testovaci-protokoly)
                            -> tier sestavy + minimum (40-tier-definice)
                                 -> složení sestavy (51-kompatibilita)
                                      -> kalkulace ceny a marže (71-kalkulace-marze)
                                           -> inzerát (62-sablona-inzeratu)
                                                -> prodej B2C (61-prodejni-kanaly)
                                                     -> předání a záruka (64-prodejni-podminky)
                                                          -> reklamace (64-prodejni-podminky)
                                                               -> marže za kus do evidence
                                                                    -> týdenní report (81-weekni-report)
                                                                         -> zpět do nákupu (10-nakup)
```

Finanční větev, která běží paralelně od nákupu: pořizovací cena se zaznamená při
příjmu, cash flow se spravuje průběžně a marže se uzavře až prodejem
([72-cashflow.md](70-finance/72-cashflow.md)). Uzavřená marže je jediné číslo, které
se propíše do týdenního reportu a zpět do dalšího nákupního rozhodnutí.

## Související dokumenty

- [00-uvod-a-glosar.md](00-uvod-a-glosar.md) — pojmy: tier, marže, doba obratu, rezerva na reklamaci
- [40-tier-definice.md](40-tiery/40-tier-definice.md) — jak se tier přiřazuje a co z něj plyne
- [43-cenove-pasmo.md](40-tiery/43-cenove-pasmo.md) — cílová cena a minimální marže per tier
- [71-kalkulace-marze.md](70-finance/71-kalkulace-marze.md) — výpočet marže z jednotky
- [72-cashflow.md](70-finance/72-cashflow.md) — hotovost, doba obratu, rezervy
- [81-weekni-report.md](80-reporting/81-weekni-report.md) — vyhodnocení ukazatelů
- [61-prodejni-kanaly.md](60-prodej/61-prodejni-kanaly.md) — kde a jak se prodává
