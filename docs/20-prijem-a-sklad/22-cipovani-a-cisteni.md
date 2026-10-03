# Čištění a údržba

**Účel:** Uvést bazarový počítač do stavu, v jakém se ho dá bezpečně otestovat a
nabídnout zákazníkovi.

Díl nejprve projde
[příjemkou a dostane ID](21-prijemka.md), čištění se zaznamenává jako součást
jeho historie, ne jako nový stav. Podezřelé kusy se před čištěním posuzují
podle [due diligence na nákupu](../10-nakup/11-due-diligence.md).

## Bezpečnost

- **Vypnutí napájení ze zásuvky.** Tlačítko na skříni, tlačítko na PSU i
  „uspaný" počítač neznamenají, že v síti není napětí. Před každým zásahem se
  vytáhne kabel ze zásuvky, na PSU se přepne vypínač na zadní straně do polohy
  off a počítač se nechá bez napájení. Do zásuvky zůstane připojené jen to, co
  je v ní potřeba.
- **Vybíjení kondenzátorů.** I po odpojení napětí zůstává v PSU, v základní
  desce a v napájecích větvích energie v kondenzátorech. Po odpojení se
  počítač nechá ležet a otevře se až po bezpečné prodlevě; s prací se začíná
  teprve po uplynutí níže uvedené doby.
  TODO: doba vybití kondenzátorů před otevřením skříně — zdroj: doporučení
  výrobce PSU / praxe při servisu.
- **ESD.** Vnitřní plochy a antistatické sáčky jsou dotykem neviditelný náboj.
  Před každým dílkem se náboj odvede dotykem na neupravené kovové místo skříně,
  při práci se používá připojený antistatický řemínek, pracovní plocha je
  antistatická podložka. Karty a CPU se nesmějí pokládat na podložku jen tak —
  vždy s řemínkem.
  TODO: zda je řemínek povinný pro všechny pracovníky, nebo jen pro práci na
  drahých dílech — zdroj: vnitřní předpis / rozhodnutí majitele.
- **Hroty pasty.** Zbytky vyschnulé termopasty jsou tvrdé a ostré jako jehlice.
  Nedotýkat se jich prstem, nehtem ani kovovým nástrojem; čistí se papírovou
  utěrkou, vatovou tyčinkou nebo pinzetou. Při úplném rozmontování
  chladiče je nutná ochrana prstů.
- **Rozpouštědla a ochrana očí.** Izopropylalkohol je hořlavý a odpařuje se.
  Pracuje se v dobře větrané místnosti, mimo otevřený oheň, svačování či
  elektrické topení. Při stříkání rozpouštědla do těžko přístupných míst se
  používá ochrana zraku — kapalina ve formě kapek může být nebezpečná.
- **Rotující části.** Ventilátory se mohou rozběhnout nebo po odpojení ještě
  zůstanou točit. Prsty se nedávají do lopat a mezi lopatky, drží se vždy za
  rámeček.
- **Předchozí úprava.** Nejdřív se vyřadí případné cizí díly, šrouby a náhradní
  součástky, které nepatří k tomu, kdo sestavu prodává.

## Co se čistí

| Oblast | Co se dělá | Poznámka |
| --- | --- | --- |
| Skříň a filtry | Otřít plášť, horní a zadní plochu, dno; prachové filtry vyprat a nechat vyschnout | Filtry vyjímat ven ze skříně — jinak voda při mytí zatéká dovnitř |
| Vnitřek skříně | Vyfoukat a otřít prach ze dna, stěn, za zadní deskou, kolem PSU a kolem jednotlivých zařízení | Nejvíce prachu bývá na dně a v rohu za PSU; stojí za to rozdat dno skříně a prohlédnout spodní plech |
| Chladič CPU a jeho ventilátor | Sundat ventilátor, vyčistit lamely i plochu paty, protáhnout řadu mezi lamelami | Nejprve odpojit napájení ventilátoru; lamely čistit měkkým štětcem, ne nožem |
| Ventilátory skříně | Sundat, vyčistit lopatky, rámeček a zadní stranu, zkontrolovat volnoběh volně rukou | Držet za rámeček; ulpělá ložiska s roztočení rozdávají |
| GPU včetně ladiček | Vyčistit lamely a fan na kartě, otřít zadní stranu, koncovky a kryt | Kartu držet za kryt/chladič, nikdy za lopatky; nevytahovat horkou z běhu, horký chladič dočistit až po vychladnutí |
| Vodní chlazení AIO | Čistí se jen vnější plášť čerpadla, hadice a vnější část radiátoru | **Vodu nerozpojovat.** Otevřený okruh znamená výtok vody, zkazení chladiče a zkrat na desce |
| Termopasta | Setřít zbytky staré pasty z pětky CPU i z plochy chladiče před sestavením | Pastu nerozšiřujeme do vnitřku chladiče a neopatřujeme jí piny, anténu ani plášť |

**Varování k vodnímu chlazení:** u AIO i u vlastních okruhů se voda
nerozpojuje vůbec. Stačí rozpojení hadičky nebo víčka a z výměníku vyteče
kapalina, která skončí na základní desce. Chladič se proto u AIO čistí
pouze zvenku — otřením pláště, vyfoukáním radiátoru a opatrým čištěním
vnějších stran hadiček. K vnitřnímu okruhu se sahá jen při výměně celé
sestavy chlazení, a to podle postupu výrobce konkrétní jednotky.

## Co se nesmí dělat

- Stlačený vzduch bez úpravy — plný tlak v pneumatickém tlaku strhá
  ventilátory z osiček, roztočí je bezpečně a vytlačí pastu i prach dál dovnitř
  skříně.
- Vysavač s iontovým efektem — statická elektřina přeskakuje přes chladiče a
  zničí elektroniku na desce.
- Kapaliny dovnitř — voda pod chladičem CPU znamená zkrat, většinou konec
  základní desky i celé sestavy.
- Rozpouštědla na plášty a tiskové hlavy — plasty, barvy a lepidla reagují s
  rozpouštědlem, povrch se rozpouští, matní nebo deformuje.
- Stříkat rozpouštědlo z výšky nebo příliš vlhké — kapalina stéká dovnitř a
  zůstává tam, kde nevidíme.
- Čistit mokrýma nebo neosušenýma rukama, při zapnutém a napájeném počítači —
  zbytky vlhkosti na deskách a kondenzace vedou ke zkratu.

## Chemie a pomůcky

Používá se tři pořadí. Jde zlehka do těžka: vždy se začíná suchým
čištěním, kapalina se použije až tam, kde suchá metoda nestačí.

### 1. Stlačený vzduch a antistatický štětec

Standardní úprava většiny prachu. Používá se **upravený tlak** (regulátor
nebo snížený výdej), ideálně i s odlučovačem vlhkosti a filtrem oleje — jinak
se dovnitř dostane voda nebo olej. Směr foukat vždy ven z průdu, ne do něj.
Antistatický štětec je na drobné nečistoty, které stlačený vzduch nesmetl.

Čemu se vyhnout: kompresi z balení, vzduchu z kompresoru bez úpravy, tlaku
nastavenému na maximum.

### 2. Izopropylalkohol

Ředěný izopropylalkohol na vatové tyčince, vatě nebo papírové utěrce, případně
pumpičkou do uzavřené lahvičky. Používá se na těžko dostupná místa, kde suchý
štětec nic nesmetl: konektory a sloty, závity šroubů, plochu paty CPU, lopatky
a těžiště ventilátorů, viditelné části napájecího zdroje, vnější strany
chladiče, plocha pod chladičem.

Čemu se vyhnout: plášťům skříně, barevným a lakovaným plochám, tiskovým
hlavám, gumě, lepidlům, obrazovkám a displejům, povrchu zapnuté tiskárny,
kabelům s měkkou izolací a čemu, co přijde do styku s potravinami.

### 3. Voda s detergentem

Slabý roztok vody s kapkou kuchyňského detergentu na chladiče a ventilátory,
které jde snímoct a rozpustit. Používá se na lamely chladiče CPU, na vnější
strany radiátoru a na rámečky ventilátorů, když je prach mastný a lepivý.
Po očištění se vše důkladně vypláchnout a nechat vyschnout.

Čemu se vyhnout: vnitřku skříně, základní desce, kartám, napájecímu zdroji,
čelnímu panelu, tlačítkám a konektorům. U chladiče s měděnou patou se voda
nedostává na patu, protože na ní zůstává vysušená pasta (viz níže).

### Pomůcky na stole

- [ ] křížový a magnetický šroubovák, malý šroubovák na vrut s hlavicí
- [ ] antistatický řemínek s kabelem a podložka
- [ ] antistatický štětec a stlačený vzduch s regulátorem
- [ ] vatové tyčinky, papírové utěrky, pinzeta
- [ ] izopropylalkohol, voda s detergentem, lahvička na rozpouštědlo
- [ ] uzavírací sáčky na vyjmuté díly, štítek s ID dílu
- [ ] ochrana zraku
- [ ] vysavač s měkkým nástavcem pro prach z vnitřku skříně

TODO: seznam nákupního vybavení a jeho dodavatel — zdroj: skladový seznam
na skladě a ceník nářadí.

## Checklist čištění sestavy

- [ ] Kabel PSU vytažený ze zásuvky, vypínač na PSU v poloze off.
- [ ] Počkáno na bezpečné vybíjení kondenzátorů, teprve pak otevřena skříň.
- [ ] Připojený antistatický řemínek, položená podložka.
- [ ] Vyjmuty všechny karty a paměti, uloženy do označených sáčků podle ID.
- [ ] Sundány a vyprány prachové filtry, filtry nechat vyschnout celé.
- [ ] Otřen plášť a vnější plochy skříně.
- [ ] Vyfoukán vnitřek skříně, dno a rohy za PSU.
- [ ] Vyčištěny lamely a plocha paty chladiče CPU, případně i samotná pata
      podle stavu pasty.
- [ ] Vyčištěn a vizuálně zkontrolován ventilátor chladiče CPU a všechny
      ventilátory skříně.
- [ ] Vyčištěny ladičky a fan GPU, otřena zadní strana a koncovky.
- [ ] AIO očištěno pouze zvenku, okruh vody neotevřen.
- [ ] Termopasta setřena z pětky CPU i z plochy chladiče.
- [ ] Použité kapaliny mimo skříň, všechno vysušené a suché.
- [ ] Vizuální kontrola: žádné promáčknuté konektory, odřené plochy, uvolněné
      šrouby, povolené kabely.
- [ ] Sestava zapnutá a vyzkoušená podle
      [testovacího protokolu](../30-testovani-a-evidence/31-testovaci-protokoly.md).
- [ ] Čištění zapsáno k ID dílu, stav dle
      [příjemky](21-prijemka.md) nemá jiné „stav po čištění" — stav zůstává
      ten z příjmu.
- [ ] Sestava je vzhledem k
      [referenční sestavě daného tieru](../40-tiery/44-referencni-sestavy.md)
      použitelná k prodeji B2C.

TODO: co zapsat do evidence jako doklad čištění (datum + kdo), a zda se to
jí potvrzuje fotografií — zdroj: sloupce tabulky Sklad / papírový formulář.

## Kdy jde o zvláštní zakázku

Standardní SOP neplatí a čištění se řeší zvlášť, u konkrétního kusu, jinak než
u běžné sestavy. Vždy se zapíše, proč šlo o zvláštní případ.

### Vodní chlazení

AIO i vlastní okruh se čistí jen zvenku. **Rozpojení vody je zakázané**, pokud
díl nemá výměnu chlazení výslovně naplánovanou. U jednotek, které se dají
rozebrat, se použije postup výrobce konkrétní jednotky — jinak se riskuje
zaplavení desky, zkazení chladiče a smrt sestavy.

Hlídat: těsnění a stav hadiček (ztvrdlé, prasklé, protékající), zákal
kapaliny, kondenzát na hadičkách, korozi na připojeních a zápach
zuhlého místa. Kapalina z chlazení je toxická — nesmí se dostat do očí ani do
případného otvoru v pytli s díly.

### Zaplněné radiátory

Chladič vodnice s usazeninami nebo se zeleným zákalem se nečistí
mechanicky ani kartáčem přes lamely — lamely se zalomí, chladič ztratí
průtok a výměník se zkroutí. Rozhoduje se mezi výměnou celého chladiče,
chemickým propláchnutím v určeném roztoku nebo odmítnutím dílu. Který
postup je povolený a v jakém roztoku, musí být doplněné — bez tohoto údaje
se takový kus nečistí vůbec.

TODO: povolené rozpouštědlo a postup pro zaplněné radiátory, případně zákaz —
zdroj: servisní dokumentace používaných AIO a rozhodnutí majitele.

### Chladič s měděnou patou

Měděná pata nesmí přijít do styku s rozpouštědlem, vodou, pískem ani
abrazivem. Případná koroze se neodstrenuje a nebrousí — měď nesmí dostat
poškrábanou patu, protože odstraněná vrstva znamená korozi dál, případně
průtok dovnitř chladiče. Řeší se výměnou chladiče za nový. Cu paty se nikdy
nečistí pastou.

### Silně zoxidovaná deska

Viditelná zelená koroze, zatečený plochý kondenzátor nebo plíseň znamená
problém, který čištění neřeší. Koroze může být pod krytem nebo uvnitř
vrstvy desky — čistěním se zjemní jen to, co je vidět. Taková deska jde do
opravy nebo do elektronického odpadu, ne do čištění a ne do sestavy.
Před jakýmkoli pokusem o očištění se rozhodne, zda vada není jen kosmetická.

## Související dokumenty

- [21. Příjem dílů do evidence](21-prijemka.md)
- [`../10-nakup/11-due-diligence.md`](../10-nakup/11-due-diligence.md)
- [`../30-testovani-a-evidence/31-testovaci-protokoly.md`](../30-testovani-a-evidence/31-testovaci-protokoly.md)
- [`../40-tiery/44-referencni-sestavy.md`](../40-tiery/44-referencni-sestavy.md)
