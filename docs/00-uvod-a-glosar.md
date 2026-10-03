# Úvod a glosář

**Účel:** Uvádí do projektu FLIPCORE, vymezuje, co do něj patří a co ne, vysvětluje organizaci dokumentace a průběh procesu od nákupu po prodej a shromažďuje pojmy používané v celé dokumentaci.

## Co je FLIPCORE

FLIPCORE je malý podnik, který nakupuje bazarové desktopové počítače a jednotlivé
komponenty na bazaru, na inzerce.cz a Bazoši a na Facebook Marketplace. Kupujeme
hlavně celé sestavy k rozebrání, protože z jednoho kusu vznikne zpravidla víc dílů do
víc sestav. Koupené věci vyčistíme, otestujeme podle
[31-testovaci-protokoly.md](30-testovani-a-evidence/31-testovaci-protokoly.md) a
roztřídíme je na díly, které se použijí, a na odpad. Z použitých dílů pak skládáme
desktopové tower sestavy ve třech výkonových tierech — `LOW`, `MID` a `HIGH` — a
prodáváme je koncovým zákazníkům s vlastní zárukou. Zisk vzniká z rozdílu mezi
cílovou prodejní cenou sestavy a součtem pořizovacích cen dílů, práce a rezervy na
reklamaci.

## Rozsah a hranice projektu

Hranice jsou záměrné, ne překážka. U každé věci, kterou neděláme, je důvod — a když
se nějaká hranice časem zruší, změní se zde, ne jen v příslušném procesním
dokumentu.

### Co se dělá

| Oblast | Rozsah |
| --- | --- |
| Sortiment | Pouze desktop tower sestava. |
| Nákup | Bazar, inzerce.cz, Bazoš, Facebook Marketplace. |
| Zpracování | Čištění, testování, rozdělení na díly, skládání sestav. |
| Prodej | Výhradně B2C — koncoví zákazníci, osobní předání nebo výdej zásilkou. |
| Výkonové třídy | `LOW` (3 M záruka), `MID` (6 M), `HIGH` (12 M). |
| Horní hranice výkonu | Intel Core 9.–14. generace a AMD Ryzen 5000 / 7000. |
| OS | Ověřitelný OEM klíč převedený z bazarového PC, nebo prodej bez OS. |

### Co se nedělá a proč

| Co | Proč ne |
| --- | --- |
| Notebooky, AIO, Mini-PC, konzole | Jiný sortiment, jiná logistika, jiná záruka. Řeší je jiný obchodník. |
| B2B prodej | Jiný zákazník, jiný papírový provoz, jiná marže. FLIPCORE je B2C. |
| Pronájmy a servisní zakázky | Vyžadují trvalou dostupnost a dlouhodobou péči o kus. FLIPCORE prodává jednotlivé kusy a uvolňuje kapacitu. |
| Originální klíč k Windows, bypass TPM, cracknutý systém | Licence se převádí z bazarového kusu, nevyrábí se. Viz [OEM klíč](#glosář). |
| Reprezentace zákazníka jinými značkami | Sestava je složena z dílů různých výrobců a není originální sestava žádné z nich. |
| Herní konzole a příslušenství k nim | Mimo sortiment. |
| Nákup výrobků nových v maloobchodu | Bazarový nákup je základ modelu; maloobchod by znamenal jinou marži i jiný sortiment. |

Prodejní kanály a jejich pravidla jsou popsaná v
[61-prodejni-kanaly.md](60-prodej/61-prodejni-kanaly.md).

## Jak je dokumentace organizovaná

Dokumentace je rozdělená do bloků podle toho, v jakém pořadí se v podniku reálně
pracuje. Číslovka v názvu bloku znamená **pořadí čtení**, ne důležitost. Na
dokumentaci odkazuje README v kořeni repa.

| Blok | Obsah | Klíčové dokumenty |
| --- | --- | --- |
| `10-nakup` | Kde a za jakých podmínek komponenty kupujeme. | [10-kanaly.md](10-nakup/10-kanaly.md), [11-due-diligence.md](10-nakup/11-due-diligence.md) |
| `20-prijem-a-sklad` | Převzetí, ocírování, čištění a evidence dílů ve skladu. | [21-prijemka.md](20-prijem-a-sklad/21-prijemka.md), [22-cipovani-a-cisteni.md](20-prijem-a-sklad/22-cipovani-a-cisteni.md) |
| `30-testovani-a-evidence` | Jak se ověřuje funkčnost a jak se zapisují výsledky testů. | [31-testovaci-protokoly.md](30-testovani-a-evidence/31-testovaci-protokoly.md) |
| `40-tiery` | Přiřazení tieru, tabulky CPU a GPU, cenové pásmo, referenční sestavy. | [40-tier-definice.md](40-tiery/40-tier-definice.md), [43-cenove-pasmo.md](40-tiery/43-cenove-pasmo.md), [44-referencni-sestavy.md](40-tiery/44-referencni-sestavy.md) |
| `50-sestavovani` | Kompatibilita dílů a samotné skládání sestav. | [51-kompatibilita.md](50-sestavovani/51-kompatibilita.md) |
| `60-prodej` | Prodejní kanály, text inzerátu, podmínky prodeje a záruka. | [61-prodejni-kanaly.md](60-prodej/61-prodejni-kanaly.md), [62-sablona-inzeratu.md](60-prodej/62-sablona-inzeratu.md), [64-prodejni-podminky.md](60-prodej/64-prodejni-podminky.md) |
| `70-finance` | Kalkulace ceny a marže, cash flow, hotovostní a rezervní pravidla. | [71-kalkulace-marze.md](70-finance/71-kalkulace-marze.md), [72-cashflow.md](70-finance/72-cashflow.md) |
| `80-reporting` | Týdenní a měsíční vyhodnocení. | [81-weekni-report.md](80-reporting/81-weekni-report.md) |
| `templates/` | Šablony formulářů, které se kopírují a vyplňují. | [prijemka.md](../templates/prijemka.md), [inzerat.md](../templates/inzerat.md), [test-protokol.md](../templates/test-protokol.md) |

Tento úvod stojí mimo číslované bloky, protože platí pro všechny.

## Markdown v repu versus živá evidence v Google Sheets

Rozdělení je záměrné a nesmí se míchat. Markdown popisuje **proces a pravidla**,
tabulky v Google Sheets jsou **živá evidence**, která se mění denně.

| Kde | Co patří | Proč |
| --- | --- | --- |
| Markdown v repu | Pravidla, postupy, seznamy, tier definice, glosář, šablony textů | Markdown je v gitu a má historii změn — vidíš, kdo, kdy a proč pravidlo změnil. Text je stabilní a čte se ho bez externího nástroje. |
| Google Sheets — živá evidence | Seznam nákupů, sklad dílů, prodeje, výsledky testů, marže za kus, týdenní čísla | Tabulková data se mění denně. Do gitu nepatří — žádná kontrola verzí, jen chaos v historii. List je přístupný odkazem odkudkoli, na telefonu i z domova. |

Pravidlo přenosu: **Změní se pravidlo → Markdown. Přibyl kus, cena nebo výsledek
testu → tabulka.** Když se v tabulce objeví nový sloupec, který vyžaduje nové pravidlo,
pravidlo se dopíše do Markdownu. Když se v Markdownu objeví konkrétní hodnota, která se
mění, hodnota patří do tabulky a v dokumentu zůstane jen odkaz na ni.

## Živý proces od nákupu po prodej

Čtrnáct kroků od prvního inzerátu po reklamaci. U každého kroku je dokument, ve
kterém je postup popsaný podrobně.

1. **Vyhledání a prověření před cestou (due diligence).**
   Hledáme na bazaru, inzerce.cz / Bazoši a Facebook Marketplace. Každý inzerát
   ohodnotíme, než se za ním vydáme.
   → [10-kanaly.md](10-nakup/10-kanaly.md), [11-due-diligence.md](10-nakup/11-due-diligence.md)
2. **Dojezd a kontrola na místě.**
   Rozebrání, zapnutí všech komponent, kontrola stavu a originality příslušenství.
   Co nesplní test, nekupujeme.
   → [31-testovaci-protokoly.md](30-testovani-a-evidence/31-testovaci-protokoly.md)
3. **Nákup a příjem do skladu.**
   Převzetí, zaplacení podle kanálu, zápis dílu nebo sestavy do evidence s
   pořizovací cenou a sériovým číslem.
   → [21-prijemka.md](20-prijem-a-sklad/21-prijemka.md),
   [templates/prijemka.md](../templates/prijemka.md)
4. **Čištění.**
   Prach, pasta, kontrola chlazení, vizuální doklad o stavu. Odsud se kus vrací do
   testování.
   → [22-cipovani-a-cisteni.md](20-prijem-a-sklad/22-cipovani-a-cisteni.md)
5. **Testování a evidence výsledků.**
   Každý díl má výsledek testu a stav (`výborný`, `dobrý`, `vadný`).
   → [31-testovaci-protokoly.md](30-testovani-a-evidence/31-testovaci-protokoly.md)
6. **Rozhodnutí o sestavení.**
   Rozdělíme díly na ty, které jdou do sestavy, a na odpad. Vytvořené ID dílu se
   opět zaznamená do evidence.
   → [22-cipovani-a-cisteni.md](20-prijem-a-sklad/22-cipovani-a-cisteni.md),
   [21-prijemka.md](20-prijem-a-sklad/21-prijemka.md)
7. **Určení tieru sestavy.**
   Modely CPU a GPU najdeme v tabulkách, vezmeme maximum a ověříme minimální
   specifikaci tieru.
   → [40-tier-definice.md](40-tiery/40-tier-definice.md),
   [41-cpu-tabulka.md](40-tiery/41-cpu-tabulka.md),
   [42-gpu-tabulka.md](40-tiery/42-gpu-tabulka.md)
8. **Složení sestavy.**
   Ověření kompatibility, osazení, test po složení.
   → [51-kompatibilita.md](50-sestavovani/51-kompatibilita.md)
9. **Kalkulace ceny a marže.**
   Pořizovací ceny dílů + práce + rezerva na reklamaci proti cílové prodejní ceně
   podle tieru.
   → [43-cenove-pasmo.md](40-tiery/43-cenove-pasmo.md),
   [71-kalkulace-marze.md](70-finance/71-kalkulace-marze.md)
10. **Inzerát a zveřejnění.**
    Text podle šablony, laický název, otevřené informace o bazarovém stavu, záruce a
    OS. Fotky konkrétního kusu.
    → [62-sablona-inzeratu.md](60-prodej/62-sablona-inzeratu.md),
    [templates/inzerat.md](../templates/inzerat.md)
11. **Prodej a předání.**
    Domluva, případné osobní vyzkoušení na místě, předání kusu a sjednaného
    sériového čísla.
    → [61-prodejni-kanaly.md](60-prodej/61-prodejni-kanaly.md)
12. **Záruka.**
    Záruka běží dle tieru: `LOW` 3 M, `MID` 6 M, `HIGH` 12 M. Reklamace řešíme
    vlastní silou.
    → [64-prodejni-podminky.md](60-prodej/64-prodejni-podminky.md)
13. **Reklamace.**
    Příjem reklamace, zjištění příčiny, oprava vlastní silou nebo úprava ceny. Vše
    se zapíše do evidence, aby se stejná vada neopakovala.
    → [64-prodejni-podminky.md](60-prodej/64-prodejni-podminky.md),
    [72-cashflow.md](70-finance/72-cashflow.md)
14. **Uzavření a vyhodnocení.**
    Marže za kus se zapíše do evidence, týden se vyhodnotí v týdenním reportu.
    → [81-weekni-report.md](80-reporting/81-weekni-report.md),
    [44-referencni-sestavy.md](40-tiery/44-referencni-sestavy.md)

Body 7 a 14 jsou řídicí, ne pracovní — 7 rozhoduje o ceně a záruce, 14 rozhoduje,
kam posunout nákup příště.

## Glosář

Pojmy jsou v abecedním pořadí podle českého abecedního řazení (číslice před písmeny,
česká písmena s diakritikou podle abecedy). Odkazy vede na dokument, kde je pojem
použitý v plném pravidle.

| Pojem | Význam |
| --- | --- |
| AIO chlazení | Vodní chlazení dodané jako hotový celek — čerpadlo, nádržka a hadice už spojené. V bazaru se kupuje kompletně, ale pozor na stav hadic, těsnění a čerpadla; kapání po čištění znamená výměnu, ne jen dolití pasty. |
| AM | Patice procesorů AMD. `AM4` osazuje Ryzen 1000–5000 a vyžaduje DDR4, `AM5` osazuje Ryzen 5000 / 7000 a vyžaduje DDR5. `AM4` a `AM5` nejsou zaměnitelné. Viz [51-kompatibilita.md](50-sestavovani/51-kompatibilita.md). |
| B2B | Prodej jiným podnikám nebo organizacím. FLIPCORE **neprodává B2B** — mimo sortiment. |
| B2C | Prodej koncovým zákazníkům. Jediný prodejní segment FLIPCORE. Zákazník je fyzická osoba, která si počítač používá sama. |
| bazarové zboží | Zboží z předchozího použití, ne nové. Může nést viditelné stopy opotřebení — to se zákazníkovi oznamuje otevřeně a nesmí se skrýt. Označení „nový" nebo „nepoužívaný" u bazarového kusu je podezřelé, viz řádek `nepoužívaný` disk níže. |
| bod zvratu | Počet prodaných sestav, při kterém tržby pokryjí všechny náklady včetně pořizovacích cen dílů a rezervy na reklamaci. Rozdíl od marže: marže je kladná už od první sestavy, ale bez hotovosti na další nákup se podnik nerozjede. Viz [72-cashflow.md](70-finance/72-cashflow.md). |
| cílová prodejní cena | Cena, za kterou chceme sestavu prodat. Z ní se odvozuje maximální nákupní cena dílů a minimální marže pro daný tier. Viz [43-cenove-pasmo.md](40-tiery/43-cenove-pasmo.md). |
| CPU | Procesor. Jeden ze dvou dílů, které určují tier sestavy — rozhoduje v kancelářských úlohách a při střihu videa. |
| DDR4 | Generace operační paměti. Pasuje do starších platnic a na `AM4`. **Není kompatibilní s DDR5** — viz [51-kompatibilita.md](50-sestavovani/51-kompatibilita.md). |
| DDR5 | Generace operační paměti. Pasuje na `AM5` a `LGA1700`. **Není kompatibilní s DDR4** — viz [51-kompatibilita.md](50-sestavovani/51-kompatibilita.md). |
| díl | Jedna jednotlivá součást (procesor, grafická karta, základní deska, paměť, disk, zdroj, chlazení, skříň) vedená samostatně v evidenci s vlastním ID, stavem a pořizovací cenou. Zápis vede [templates/prijemka.md](../templates/prijemka.md). |
| doba obratu | Doba od převzetí zboží do prodeje sestavy. Určuje, jak rychle se peníze vrátí do dalšího nákupu — proto je jedním z týdenních ukazatelů. Viz [72-cashflow.md](70-finance/72-cashflow.md). |
| ESU | Rozšířené bezpečnostní aktualizace (Extended Security Updates) pro Windows 10. Prodlužují bezpečnostní aktualizace, **nejde o licenci ani o řešení podpory Windows 11** — je to odklad. Viz [40-tier-definice.md](40-tiery/40-tier-definice.md). |
| fTPM | TPM 2.0 zabudovaný do procesoru (u Intelu PTT). Není potřeba samostatný modul, Windows 11 fungují nativně. Je součástí Ryzen 5000 / 7000 a Intel Core 10. a novější generace. |
| GPU | Grafická karta. Druhý díl, který určuje tier sestavy — rozhoduje ve hrách a v 3D práci. |
| HDD | Klasický magnetický pevný disk. Do prodejné sestavy se nepoužívá, sortiment je na SSD a NVMe. |
| HIGH | Nejvyšší výkonový tier: hráč 1440p, práce s videem a 3D, budoucí-proof. Minimum 32 GB RAM, NVMe 1 TB, zdroj 550–750 W. Windows 11 nativně možný. Záruka 12 měsíců. Sahá na Intel Core 9.–14. generaci a Ryzen 5000 / 7000. Viz [40-tier-definice.md](40-tiery/40-tier-definice.md). |
| LGA | Patice procesorů Intel. Rozhoduje, jaký procesor lze osadit, a u novějších platnic i jakou paměť deska podporuje. Přesné označení patice pro konkrétní modely se ověřuje v [51-kompatibilita.md](50-sestavovani/51-kompatibilita.md). |
| LOW | Nejnižší výkonový tier: kancelář, škola, stážista, senior. Minimum 8 GB RAM a SSD 240 GB. Windows se neprodává. Záruka 3 měsíce. Viz [40-tier-definice.md](40-tiery/40-tier-definice.md). |
| marže | Rozdíl cílové prodejní ceny a nákladů na kus (pořizovací ceny dílů, práce, rezerva na reklamaci). Vyjádří se v korunách i v procentech a počítá se z jedné sestavy. Viz [71-kalkulace-marze.md](70-finance/71-kalkulace-marze.md). |
| MB | Základní deska (motherboard). Rozhoduje o kompatibilitě CPU, paměti a disků — často omezuje, kam až lze výkon sestavy posunout. Viz [51-kompatibilita.md](50-sestavovani/51-kompatibilita.md). |
| MID | Prostřední výkonový tier: hráč 1080p / 60 fps, univerzální domácí počítač. Minimum 16 GB RAM a SSD 480 GB. Záruka 6 měsíců. Viz [40-tier-definice.md](40-tiery/40-tier-definice.md). |
| minimální specifikace | Podmínky, které musí sestava splnit, aby se směla prodat na daný tier (RAM, disk, u `HIGH` i zdroj). Větší než minimum je vždy v pořádku; nesplněné minimum lze někdy doplnit koupeným dílem, jindy sestava na ten tier nepatří. Viz [40-tier-definice.md](40-tiery/40-tier-definice.md). |
| „nepoužívaný" disk | Prohlášení prodejce, že disk nikdo nepoužíval. U bazarového kusu je podezřelé: jakýkoli systém, který v počítači běžel, zanechává na disku stopu. Takové tvrzení ber jako prohlášení, ne jako fakt, a jako podvod. Zjisti to kontrolou stavu disku a údajů o jeho využití. Viz [13-pasti-a-podvody.md](10-nakup/13-pasti-a-podvody.md). |
| NVMe | Disk připojený přímo do sběrnice PCIe, bez tradičního mezilehlého adaptéru. Nejvyšší rychlost z disků v sortimentu — minimum pro `HIGH` je NVMe 1 TB. |
| OEM klíč | Klíč k Windows převedený z bazarového počítače. Je to **jediná přípustná forma licence k OS** v FLIPCORE a musí být ověřitelná. Nikdy originální klíč, nikdy obcházení TPM. Zapisuje se do [templates/prijemka.md](../templates/prijemka.md). |
| odpis | Vyřazení dílu ze skladu evidence, protože nemá další využití — je vadný, nekompatibilní, nebo mimo sortiment. Zmenší hodnotu skladu a ušetřené díly se nezapočítávají do tržeb. Účetní odpis dlouhodobého majetku je jiný pojem, tuto evidenci nevede. |
| pořizovací cena | Cena, za kterou jsme díl koupili, včetně poplatků platformy a dopravy. Vstup do kalkulace marže. Zapisuje se do [templates/prijemka.md](../templates/prijemka.md). |
| proběhlý kus | Kus, u kterého se při testování potvrdila závada. Nepřipadá do sestavy — jde do opravy nebo na odpis. Přesný postup v [31-testovaci-protokoly.md](30-testovani-a-evidence/31-testovaci-protokoly.md). |
| protiúčet | Protinabídka v jednání o ceně, zpravidla nižší než cena v inzerátu. Smí být jen tehdy, když výsledná cena nepřekročí maximální nákupní cenu pro daný model. Viz [10-kanaly.md](10-nakup/10-kanaly.md). |
| PSU | Zdroj napájení. U `HIGH` je povinné minimum 550–750 W podle sestavy; u `LOW` a `MID` se řídí výkonem sestavy. |
| RAM | Operační paměť. Rozhoduje, kolik aplikací a dat se vejde najednou. Minimum: 8 GB (`LOW`), 16 GB (`MID`), 32 GB (`HIGH`). |
| rezerva na reklamaci | Část ceny ponechaná na pokrytí reklamací řešených vlastní silou. Větší pro `HIGH`, protože má nejdelší záruku. Výši stanovuje [71-kalkulace-marze.md](70-finance/71-kalkulace-marze.md). TODO: doplnit výši rezervy v procentech podle tieru — zdroj: vlastní evidence reklamací a zasedávání týdenního reportu v [81-weekni-report.md](80-reporting/81-weekni-report.md). |
| Secure Boot | Bezpečnostní mechanismus Windows, který povolí spustit jen podepsanou spouštěcí část. Patří mezi požadavky Windows 11 a je důvodem, proč se systém na starší platformě nainstaluje jen přes podporovanou cestu, ne obcházením. |
| sestava | Hotová desktop tower sestava složená z dílů ve skladu, určená k prodeji jako jeden celek. Má vlastní ID, tier, specifikaci a stav. Záruka se vztahuje k sestavě jako celku. |
| socket | Patice procesoru na základní desce. Určuje, který procesor lze osadit a jakou paměť deska podporuje. Viz [51-kompatibilita.md](50-sestavovani/51-kompatibilita.md). |
| SSD | Disk s flashovou pamětí. Minimum sortimentu: SSD 240 GB pro `LOW`, SSD 480 GB pro `MID`. |
| termopasta | Pasta mezi procesorem a chladičem, která odvádí teplo. V bazaru bývá vyschlá a znovu se doplní vlastní. Chybějící pasta není kosmetická vada — bez ní se procesor přehřívá a může se poškodit. Viz [22-cipovani-a-cisteni.md](20-prijem-a-sklad/22-cipovani-a-cisteni.md). |
| tier | Výkonová třída sestavy — `LOW`, `MID` nebo `HIGH`. Určuje záruku, cenové pásmo a pravidla pro OS. Je to **interní označení**: zákazník ho nezná, v inzerátu se používá laický název. Viz [40-tier-definice.md](40-tiery/40-tier-definice.md). |
| tier sestavy | Výsledné přiřazení sestavy podle vzorce **max(tier(CPU), tier(GPU))** a po ověření minimální specifikace tieru. Rozhoduje silnější z obou dílů, ne generace a ne rok výroby. U AMD nejsou generace jako u Intelu — tier se určuje z modelu (Ryzen 1000–9000). Viz [40-tier-definice.md](40-tiery/40-tier-definice.md). |
| TPM 2.0 | Bezpečnostní čip, který Windows 11 vyžadují. Intel Core 4.–9. generace ho v procesoru nemá — proto se u nich prodává bez OS, případně se řeší samostatným modulem. Nikdy se neobchází. Viz [40-tier-definice.md](40-tiery/40-tier-definice.md). |
| Windows 10 / Windows 11 | Podpora systémů rozhoduje, zda se sestava smí prodat s operačním systémem. Windows 10 skončila 14. 10. 2025, `ESU` ji prodlužuje do 12. 10. 2027 — to je odklad, ne řešení. Windows 11 vyžaduje `TPM 2.0` nebo `fTPM`. V `LOW` se Windows neprodává vůbec. Viz [40-tier-definice.md](40-tiery/40-tier-definice.md). |

## Související dokumenty

- [01-obchodni-model.md](01-obchodni-model.md) — cílové segmenty, jednotka economics a sledované ukazatele
- [40-tier-definice.md](40-tiery/40-tier-definice.md) — pravidla tieru, na která tento úvod odkazuje
- [10-kanaly.md](10-nakup/10-kanaly.md) — pravidla nákupu, na která odkazují hranice projektu
