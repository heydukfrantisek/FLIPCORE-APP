# Testovací protokoly

**Účel:** Co se na každé sestavě kontroluje při testu a podle jakých pravidel se rozhodne, že prošla — včetně zápisu výsledku do evidence.

Související: čištění před testem `../20-prijem-a-sklad/22-cipovani-a-cisteni.md`, tier podle CPU
`../40-tiery/41-cpu-tabulka.md`, limity platformy pro OS `../40-tiery/40-tier-definice.md`,
nákupní pasti, které test odhaluje `../10-nakup/13-pasti-a-podvody.md`, šablona záznamu
[`../../templates/test-protokol.md`](../../templates/test-protokol.md).

## Zásady

**Testuje se vždy kompletní sestava, ne jednotlivé díly zvlášť.** Díl může být
v izolaci naprosto v pořádku a v sestavě přesto selhat — jiný takt, jiná
napájecí větev, jiný chladič, jiná základní deska. Test jednoho dílu mimo sestavu
proto nic neprokazuje. Výjimkou je kontrola na místě u prodávajícího a díl
připravený do sestavy: tam se ověřuje, že vůbec funguje a že odpovídá
inzerátu, a zbytek se rozhodne až v celé sestavě podle tohoto dokumentu.

Každý díl musí být ve sestavě, ve které půjde k zákazníkovi. Test sestavy s
náhradním dílem nebo s dílem „navíc" neplatí — neprokazuje nic o tom, co se
prodeje.

**Výsledek testu je jeden ze tří:**

| Výsledek | Kdy | Co znamená pro prodej |
| --- | --- | --- |
| Prošel | Sestava splnila všechna kritéria tohoto dokumentu | Jde do prodeje |
| Prošel s výhradou | Sestava funguje, ale má zjištěný nedostatek, který zákazníka omezí, a který je popsatelný a předvídatelný | Jde do prodeje **jen** s výhradou napsanou v inzerátu |
| Neprošel | Sestava nesplnila kritérium, je v ní vada nebo je nebezpečná | Nejde do prodeje |

Výsledek se píše ke každé komponentě zvlášť i k sestavě jako celku. Sestava
celkově neprošla, když neprošla kterákoli komponenta; jediná výhrada na
sestavě se přenáší jako výhrada do inzerátu.

**Výhrada** je stav, kdy sestava běží a je použitelná, ale něco neodpovídá
očekávání: snížený takt nebo výkon, menší kapacita, nepodporovaná funkce,
nosnost, opotřebení, kosmetická vada. Výhrada není výslovit „vada" — zákazník
musí dostat věci, které se dozví, koupí a umí s ní žít.

**Výhrada musí být napsaná v prodejním inzerátu.** Konkrétně, ne obecně.
Výhrada „méně paměti, než kolik uvádí inzerát" patří do inzerátu; formulace
„sestava běží v pořádku" ne. Výhrada, která v inzerátu není, se stane
reklamací. Pokud výhradu umíme odstranit (výměna modulu, přepaste, doplnění
slotu), neodstraní se tím, že se o ní neřekne, ale tím, že se vada odstraní a
sestava se znovu otestuje. Výhradu, kterou odstranit neumíme, v inzerátu uvést
a zohlednit v ceně.

**Výhrada nesmí být v rozporu s tím, co jde zjistit vlastním testem** — pokud
sestava neprošla, není to výhrada. Výhrada je stav, kdy sestava funguje; každá
vada, která se při testu projeví, je neprošel.

**Co zapsat kam.** Protokol o každém testu se vyplní ze šablony
[`../../templates/test-protokol.md`](../../templates/test-protokol.md) jako kopie
podle `ID sestavy`, aby šly dohledat spolu s příjemkou. Výsledek se zapíše také
do tabulky Testy v Google Sheets — tam patří výsledky, datum a ID sestavy,
nikoli pravidla.

## Test CPU

Test běží v sestavě s chladičem a pastou, jak bude ve finále. Teplota se odečítá
pod otevřeným víkem skříně a průběh testu se zapisuje do protokolu.

Co se sleduje:

- **Zahájení testu** — zda sestava vůbec nabootuje a test se spustí bez
  ručního zásahu. Sestava, která se musí opakovaně restartovat, než test
  najede, neprošla.
- **Stabilita při dlouhém zatížení** — test běží dostatečně dlouho, aby se
  projevila chyba, která se objeví až po zahřátí. Předčasný pád, restart,
  BSOD nebo zamrznutí je neprošel, pokud se neopakuje.
- **Teploty pod zatížením** a jejich chování: teplota nesmí růst po odeznění
  zatížení a nesmí dosáhnout mezní hodnoty vypnutí, jinak se nepřehřívá.
  Druhým kritériem je, že teplota pod zatížením zůstává v obvyklém rozmezí
  stejného kusu v porovnání s referenční sestavou stejného tieru
  (`../40-tiery/44-referencni-sestavy.md`).
- **Nepřehřívá se** — nesmí dojít k throttlingu, kdy výkon pod zátěží
  klesá kvůli teplotě. Pokud takt při zahřátí klesne a výkon s ním, jde o
  neprošel; pokud výkon zůstává, je to výhrada a musí být popsána.
- **Počet jader a vláken proti očekávání** — údaj z inzerátu se porovná s tím,
  co systém skutečně vidí a s tabulkou CPU v `../40-tiery/41-cpu-tabulka.md`.
  Rozdíl je buď podvod v inzerátu, nebo vadný kus.
- **Zda neskočí takt** — pod zatížením má takt držet hodnotu blízkou jmenovité
  nebo použít deklarovaný boost. Trvalý pokles pod jmenovitý takt za provozu je
  výhrada; takt, který kolísá sem a tam a jinak se drží, je výhrada; situace,
  kdy se jádro vyřadí z provozu, je neprošel.

TODO: <doba zátěžového testu CPU, po které se teplota ustálí a test je možné
považovat za průkazný> — zdroj: pozorování vlastních kusů při testech na skladě.

TODO: <mezní teplota CPU pod zatížením, při níž už sestava není vhodná k
prodeji> — zdroj: specifikace výrobce (Tjmax / teplotní vypnutí) a pozorování
vlastních kusů.

Součástí testu je vizuální kontrola těchto známých pastí
(`../10-nakup/13-pasti-a-podvody.md`):

- **Vypájená pasta** — pasta chybí, je suchá, vypálená, zatímlá nebo roztažená
  do okolí. Vypálená pasta je neprošel, opotřebovaná suchá pasta je výhrada
  s prověřeným důsledkem.
- **Nedosedící kryt chladiče** — chladič musí sedět rovně a nedotýkat se boků
  patice. Nedosedící kryt je neprošel: opravit ho nelze a taková sestava jde
  k zákazníkovi s horkým procesorem.

## Test RAM

Testuje se všechna osazená paměť, všechny sloty a všechny režimy, v jakých
paměť pracuje. Samostatná paměť, která projde v testeru, při osazení do
konkrétní desky a konkrétního CPU nemusí pracovat.

- **Test všech slotů** — postupně se osadí každý slot, který je na desce
  dostupný, i ten, ve kterém paměť nebyla. Prázdný slot, který při osazení
  paměť odmítne nebo s ní dělá problém, je zjištěný nedostatek desky a musí
  být uveden. Nejdřív se testuje každý modul sám ve všech dostupných
  slotech, pak se testuje osazení více moduly najednou — chyba se často
  objeví až v kombinaci.
- **Test rychlosti** — deklarovaná rychlost modulu proti rychlosti, kterou
  modul v této sestavě skutečně naběhne. Modul běžící pomaleji, než
  deklaruje, je výhrada; pokud sestava běží v režimu, který deklarovanou
  rychlost vůbec nepodporuje, je to výhrada a musí být v inzerátu.
- **Chyby při zápisu** — paměť se neopravuje, každá chyba při zápisu znamená
  vadný modul. Neprozrazená chyba paměti se projeví jako BSOD, pád aplikace,
  restart, artefakt v obraze nebo zkazený soubor; jakákoli chyba při zápisu
  je neprošel.
- **Projevení nestability** — hledá se BSOD, pád aplikace, restart nebo
  zamrznutí, artefakty v obraze, zkazené soubory, nesmyslné hodnoty v
  systému. Nestabilní paměť se v klidu tváří dobře, proto se test pouští
  opakovaně a v různých režimech.
- **Správné osazení ve všech slotech** — paměť musí sedět v západkách, jít
  vyjmout a znovu vložit, být v páru dle manuálu desky a mít přitom správné
  pořadí barevného kódování.
- **Dvojkanálový běh** — zapnutý a opravdu zapnutý, ne jen vypsaný v BIOSu. V BIOSu
  se ověří, že oba kanály jsou osazené a běží; v systému se ověří, že
  systém skutečně vidí dvojkanálové uspořádání a ne jednokanálové.
  Jednokanálový provoz bez vědomí zákazníka je výhrada, která musí být v
  inzerátu.

TODO: <doba a počet opakování testu paměti, při kterých je výsledek
směrodatný> — zdroj: pozorování vlastních kusů, u kterých se chyba paměti
projevila až po delší době.

TODO: <hranice, od níž je pokles taktu nebo propustnosti paměti už
výhrada, která se musí napsat do inzerátu> — zdroj: specifikace výrobce paměti
a pozorování vlastních kusů.

U starších páscích počítej s problémem lepených zubů. Modul, který byl
přelepen nebo měnil zuby, se může v jiné sestavě nebo v jiném slotu chovat jinak
než v té, ve které byl testován. Lepené zuby proto nejsou kosmetická vada:
pokud se při testu objeví, zapisuje se to jako výhrada, kus se znovu testuje po
vložení do jiného slotu.

## Test GPU

Test běží v sestavě a v rozlišení, ve kterém bude hráno. Snímek obrazovky během
testu se uloží do fotodokumentace v [`../../templates/test-protokol.md`](../../templates/test-protokol.md),
protože artefakty v obraze se na výstupu testu často neprojeví.

Co se sleduje:

- **Zahájení** — karta se v systému vyhodnotí správně, má správnou kapacitu
  paměti a správný režim, do testu se dostane bez ručního zásahu.
- **Stabilita v největším zatížení** — test v nejvyšším nastavení, ne v
  polovičním. Předčasný reset, pád, černá obrazovka nebo zhasnutí ventilátorů
  je neprošel.
- **Teploty** — teplota nesmí růst po odeznění zatížení a nesmí dosáhnout mezní
  hodnoty vypnutí, jinak se nepřehřívá. Teplota pod zátěží se porovná s
  referenční sestavou stejného tieru (`../40-tiery/44-referencni-sestavy.md`).
- **Zda nevypadá** — padá grafika, černá obrazovka, artefakty, blikání,
  ztráta signálu, nebere vstup. Každý záchyt se musí objevit znovu, jinak je
  výhrada.
- **Zda se nepřepíná** — pokud se karta sama přepíná mezi režimy, vypíná nebo
  shazuje ovladač, je neprošel.
- **Poškozené ventilátory** — lopatky se dotýkají rámečku, ventilátor drhne,
  chrastí, má zablokované nebo ulomené lopatky, neotáčí nebo má výraznou
  vůli. Poškozený ventilátor při zátěži znamená neprošel, protože chlazení
  pak neodvádí teplo.

Vizuální kontrola výkonu karty (`../10-nakup/13-pasti-a-podvody.md`):

- **Vyboulená pasta** — pasta je vyboulená, popraskaná nebo vyschnutá, mezi
  pastou a čipem je mezera. Vyboulená pasta je neprošel a nepomáhá přepastování:
  dá se poznat, až je pozdě, u zákazníka.
- **Vyhořelý jeden čip** — černá, popálená nebo odloupaná plocha na čipu nebo
  na ladičkách, zápach při zapnutí, karta padlá nebo nepřenášející se ven ze
  slotu. Vadný čip je neprošel.
- **Zásah zadního panelu** — zkosená, zvedlá nebo vyražená koncovka, poškozený
  šroub, slot, který kartu drží jen silou. Zásah zadního panelu je neprošel.

Díl, který v této sestavě prošel, se před nasazením do jiné sestavy znovu
netestuje jako samostatný — platí pravidlo z `Zásad`: rozhoduje výsledek celé
sestavy.

TODO: <mezní teplota GPU pod zátěží, při níž už karta není vhodná k prodeji> —
zdroj: specifikace výrobce (max. teplota jádra) a pozorování vlastních kusů.

TODO: <doba zátěžového testu GPU, po které je výsledek v nejvyšším nastavení
směrodatný> — zdroj: pozorování vlastních kusů.

## Test SSD a HDD

U každého disku se zapisuje výrobce, model, kapacita, rozhraní a sériové čísko
a porovnávají se s tím, co bylo přislíbeno v inzerátu a co je na štítku.

- **SMART hodnoty** — čtou se celé, ne jen první. Rozhodující jsou položky
  související s opotřebením: přemapované (reallocated) sektory, čekající (pending)
  sektory, neopravitelné chyby čtení a celkové zápasy disku. Vadných sektorů
  nesmí být ani jeden, chyby čtení nesmí narůstat během testu.
- **Kapacita proti očekávání** — jde o nejčastější podvod v inzerátu. Kapacita
  v systému, uvedená kapacita na štítku a kapacita z inzerátu musí souhlasit.
  Záměna menšího disku za větší, nebo jiného rozhraní (NVMe proti SATA)
  s uvedenou stejnou kapacitou, je důvod odmítnutí kusu, ne výhrada. Viz
  `../10-nakup/13-pasti-a-podvody.md`.
- **Rychlost** — sekvenční i náhodný zápis a čtení proti tomu, co deklaruje
  typ disku. Bazarový disk běžící výrazně pod úrovní stejného modelu nového
  kusu je výhrada, pokud je funkční; pokud je zároveň nestabilní, je
  neprošel.
- **Zdraví** — test čtení a zápisu po celý objem, opakovaně, aby se projevily
  chyby, které se objeví až po delší době. Kontrola systému disku, zda
  nepřipojuje jen část kapacity, zda se nepřepíná do ochranného režimu a zda
  se nepřehřívá.
- **U bazarových disků je výrazně napadané riziko** — ložisko, které bylo
  dlouho v serveru nebo v notebooku, se může projevit až týdny po převzetí.
  Proto se u bazarového disku počítá s tím, že výsledek testu v den
  převzetí platí jen pro ten den.

**Disk může být v pořádku a přesto silně stárnout. Hodnotí se obojí.**
Výsledek testu a výsledek opotřebení jsou dvě různé věci:

| Co se hodnotí | Výsledek | Důsledek |
| --- | --- | --- |
| Funkčnost — testy čtení a zápisu, SMART bez chyb | prošel / neprošel | rozhodne o tom, jestli disk vůbec funguje |
| Opotřebení — celkové hodiny napájení, počet zápasů, stav ložiska, opotřebení materiálu zapsané výrobcem | v pořádku / silně stárnoucí | rozhodne o tom, jak moc mu zbývá |

Disk, který všechny testy projde a zároveň vykazuje silné stárnutí, je
**prošel s výhradou**, pokud se výhrada dá zákazníkovi napsat a dát mu na to
vědomí.

TODO: <hodnota opotřebení, od níž se disk považuje za silně stárnoucí a jde o
výhradu> — zdroj: specifikace výrobce (vypsaná životnost disku v procentech) a
pozorování vlastních kusů.

TODO: <počet hodin napájení a počet zápasů, od kterých je stáří bazarového
disku podezřelé> — zdroj: pozorování vlastních nákupů a údaje výrobce.

TODO: <doba testu čtení a zápisu, po které je disk prohlášen za funkční> —
zdroj: pozorování vlastních kusů; u bazarových disků s podezřením na opotřebené
ložisko rozhoduje stav SMART, ne délka testu.

## Test základní desky

- **Start do BIOSu a jeho projetí** — sestava do BIOSu vůbec naběhne,
  nastavení se dá projít celé, uložit a načíst zpět. Chyba při ukládání
  nastavení, reset BIOSu nebo nemožnost se v něm pohybovat je neprošel.
  Zároveň se v BIOSu ověří, že jsou vidět všechny osazené komponenty.
- **Funkce všech slotů a portů** — vyjde se každý slot DIMM, každý slot PCIe
  (i nepoužitý, alespoň zjištění, že existuje a sedí), každý port na zadním
  panelu, každý interní konektor, USB, audio a síť. Port, který se nehlásí nebo
  přerušuje, je neprošel; port, který je fyzicky zablokovaný nebo vyražený,
  je výhrada.
- **Kondenzátory** — hledají se vyboulené hliníkové válce, promáčknutá tělesa a
  stopy vytéklého elektrolytu, hlavně u CPU, kolem DIMM a PCIe slotů
  (`../10-nakup/13-pasti-a-podvody.md`). Jediný vyboulený kondenzátor je
  neprošel — deska se v této sestavě prodávat nebude a oprava se u nás
  nedělá.
- **Obložení a hrazení** — zkontroluje se, že na desce nic chybí: sloty,
  které by tam být měly, kryty, pachytky, jumpery, záložní deska, I/O panel.
  Krácená sestává je neprošel a kus se odmítá už při nákupu.
- **Napájecí konektory** — ATX 24pin a EPS 8pin (u CPU) sedí, nejsou
  promáčknuté, ohnuté nebo uvolněné. Zoxidovaný nebo uvolněný konektor je
  neprošel.
- **Verze BIOSu** — zjistí se a zapíše, jestli je starší než aktuální verze
  výrobce. Starý BIOS není sám o sobě důvod k neprodeji, ale musí být
  zapsaný a zvážený při ceně.
- **Secure Boot, TPM 2.0 a start z USB** — podle
  `../40-tiery/40-tier-definice.md` se ověří, jestli platforma Secure Boot
  podporuje a jestli má TPM 2.0 nebo fTPM. Výsledek určuje, jestli jde
  sestava prodat s ověřeným převedeným OEM klíčem, nebo bez OS — a je to
  rozhodnutí zaznamenané do protokolu. Originální klíč se s bazarovým kusem
  nikdy neprodává. Ověří se také start z USB, aby šla na této desce udělat čistá
  instalace systému u zákazníka.

## Test napájecího zdroje

- **Příkon a účinnost** — změří se příkon sestavy v klidu a pod zátěží,
  porovná se s jmenovitým výkonem zdroje a s tím, co je u sestavy
  potřeba. Účinnost se hodnotí jako průběh v celém rozsahu zatížení, ne
  jen jmenovitý údaj na štítku.
- **Větrák** — otáčí se plynule, neskřípe, nereaguje na teplotní cykly
  poskakáním, nevykazuje znaky opotřebovaného ložiska.
- **Fakturační údaje na štítku** — model, příkon, napětí a certifikační
  značky se přepíšou do protokolu. Kontrola, že jde o reálný kus, který
  souhlasí s tím, co se o něm uvádí; zkontroluje se i sériové číslo proti
  původnímu.
- **Zda se nepřepětí** — napětí na jednotlivých větvích nesmí kolísat mimo
  rozsah, který výrobce deklaruje. Přepětí nebo prudké kolísání je neprošel,
  i když sestava funguje.
- **Poddimenzovaný zdroj pro HIGH sestavy** — pozná se podle
  `../50-sestavovani/51-kompatibilita.md`, kde je u každé reference uvedena
  potřebná rezerva. Poddimenzovaný zdroj se pozná ve dvou věcech: při startu
  nebo největším zatížení dochází k restartu či vypnutí, nebo zdroj v zátěži
  vypadá (cviká se, klape, jeho větrák se zastaví). Poddimenzovaný zdroj
  v HIGH je neprošel, i když se sestava v běžném použití chová dobře — zákazník
  si ho rozvine a spadne to na něm.
- **Vnější baterii nepoužívat.** Externí napájecí adaptér s baterií se
  pod zátěží vůbec nezkouší. Vyboulené články mohou dýmat a adaptér vzít s
  sebou (`../10-nakup/13-pasti-a-podvody.md`). Používá se výhradně napájecí
  zdroj nebo adaptér bez baterie.

TODO: <příkon naměřený v klidu a pod zátěží pro jednotlivé tiery, podle
kterého se rozhodne, že zdroj není poddimenzovaný> — zdroj: měření vlastních
sestav.

TODO: <povolené kolísání napětí na větvích> — zdroj: specifikace výrobce
napájecího zdroje.

## Test chlazení

- **Zda se chladič drží po očíštění** — chladič sedí rovně, nedosedí, nedotýká
  se boků patice, po utření pasty je plocha čistá a pasta nesmí být
  roztažená do okolí chladiče. Chladič, který po očíštění pořád nedosedí,
  je neprošel a do sestavy se neosazuje — chladič se vymění a sestava se
  znovu otestuje.
- **Ventilátory** — musí být tiché a nesmí vykazovat vibrace. Posuzuje se
  zvuk i vibrace rukou na rámečku a hlášený optický otáčkoměr (kolísání
  otáček během volnoběhu znamená opotřebované ložisko). Chrastění, drhnutí,
  lopatky v rámečku nebo neotáčející se ventilátor je výhrada, pokud jde
  opravit výměnou ventilátoru, jinak neprošel.
- **AIO** — voda se nerozpojává. Ověří se, že hadičky nedotékají, v plášti
  čerpadla a hadiček není vlhkost, kondenzát ani zákal, spoje neprotékají a
  chladič se nepotápí. Při jakémkoli podezření na únik se sestava vypne a
  nesmí dál do prodeje, i když test prošel — viz
  `../20-prijem-a-sklad/22-cipovani-a-cisteni.md`.

## Test před prodejem

Těsně před předáním zákazníkovi se ověří znovu to, co se může změnit během
skladování, přesunu a údržby. Prodejní test je krátký a cílený na nejčastější
důvod reklamace, ne opakování celého testovacího postupu.

Při skladování a manipulaci podle `../20-prijem-a-sklad/23-skladovani.md` se
může poškodit nebo projevit:

- **Zapnutí a chod sestavy** — sestava vůbec startuje, neshazuje se při
  startu, BIOS se načte a všechno je připojené.
- **Teploty v klidu a pod zátěží** — krátká zátěž, porovnání proti výsledku
  v původním protokolu. Výrazný rozdíl znamená, že se něco změnilo.
- **Paměť** — rychlý test paměti, protože chyby RAM se objeví až za měsíce.
- **Disk** — připojení a stav SMART proti původnímu záznamu; zkontroluje se,
  že se nepřehřívá a data jsou čitelná.
- **Vizuální kontrola** — znovu kondenzátory a pasty (chyba při montáži nebo
  při údržbě se pozná hůř než výkonová odchylka), těsnění a spojky, ventilátory
  a jejich upevnění, kryty skříně, připojené kably.
- **AIO** — suché hadičky, žádný zákal nebo vlhkost.
- **Fotodokumentace** — finální snímek běhu sestavy a stav před předáním jde
  do [`../../templates/test-protokol.md`](../../templates/test-protokol.md)
  a do tabulky Testy v Google Sheets.

Zjištěná vada při prodejním testu je hodnocena stejně jako při vstupním testu —
`prošel / prošel s výhradou / neprošel`. Vada zjištěná těsně před předáním
vede k sestavení zpátky, ne k úpravě inzerátu.

## Související dokumenty

- [21. Příjem dílů do evidence](../20-prijem-a-sklad/21-prijemka.md)
- [22. Čištění a údržba](../20-prijem-a-sklad/22-cipovani-a-cisteni.md)
- [23. Skladování](../20-prijem-a-sklad/23-skladovani.md)
- [`../10-nakup/13-pasti-a-podvody.md`](../10-nakup/13-pasti-a-podvody.md)
- [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md)
- [`../40-tiery/44-referencni-sestavy.md`](../40-tiery/44-referencni-sestavy.md)
- [`../50-sestavovani/51-kompatibilita.md`](../50-sestavovani/51-kompatibilita.md)
- [`../../templates/test-protokol.md`](../../templates/test-protokol.md)
