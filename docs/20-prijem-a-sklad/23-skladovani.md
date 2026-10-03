# Skladování a životnost skladovaných dílů

**Účel:** Popsat, jak se nakoupené díly skladují, aby byly při prodeji stejně
funkční a čisté jako při příjmu, a jak stárnutí ve skladu dopadá na marži.

Každý díl ve skladu má ID z
[příjemky](21-prijemka.md) a je ve stavu podle
[štítků stavu](21-prijemka.md#štítky-stavu). Oba údaje musí být čitelné i na
místě, kde je kus složený. Předchozím krokem je
[čištění a údržba](22-cipovani-a-cisteni.md).

Skladování není jen „odložit do rohu". Je to čas, kdy je peníze v dílu
vázané, takže rozhoduje i
[cashflow](../70-finance/72-cashflow.md) a
[cena dílu v rámci cenového pásma](../40-tiery/43-cenove-pasmo.md).

## Podmínky skladování

- **Sucho.** Voda a vlhký vzduch jsou nejčastější příčina znehodnocení
  bazarových dílů. Vyšší vlhkost zhoršuje pájené spoje, působí na
  elektrolytické kondenzátory a na stopy po zásahu (korozi, zelené nánosy,
  bílé soli). Zásadní je, aby se dovnitř skříňky a do prostoru kolem desek
  nedostala voda ani z venkovní strany stěny.
- **Stálá teplota.** Kolísání teploty vytváří kondenzaci — na studeném dílu se
  v ránu sráží vlhkost z teplého vzduchu. Stálá teplota znamená méně
  cyklů zahřívání a chlazení, u starších desků je mírnější i tepelné
  namáhání kondenzátorů. Přímé slunce a topení přímo u polic jsou zakázané,
  protože vedou k přehřívání a k vyschnutí těsnění.
- **Ochrana před prachem.** Prach vniká do konektorů, do chladičů a pod
  ventilátory. Zvlášť nepříjemné je usazení prachu na plochách, kde se dá
  setřít — ploché kontakty, konektory, zadní strana karty. Uzavřené boxy a
  přikryté police jsou lepší než otevřená police. Prášení snižuje prodejní
  cenu, protože zákazník vidí špinu a kupuje si ještě práci s údržbou.
- **Proti vlhkosti.** Do každého uzavřeného boxu, kde jsou díly s kontakty nebo
  s pástou, patří vysoušecí sáček (silika gel). Sáček se obnovuje vhodným
  sušením a vyměňuje, jakmile ztratí barvu nebo je zřetelně nasáklý — jinak
  přestává vlhkost vytahovat a zůstává jen zdrojem prachu.
- **Oddělení ESD citlivých dílů.** Zvlášť při střídání skladování s
  testováním a sestavováním. Karty, procesory, paměti a disky leží v
  antistatických sáčcích nebo boxech, které jsou nepoškozené a nepřetékají
  jeden do druhého. Základní desky leží vodorovně, ne na hraně. Ochrana
  proti statickému výboji je popsána u
  [čištění](22-cipovani-a-cisteni.md#bezpečnost); sklad ji nesmí obcházet
  tím, že se sáčky otevřou a zase jen „naskládají".

TODO: konkrétní požadavky na skladovou místnost (povolená teplota a vlhkost,
větrání, přístup do místnosti) — zdroj: vnitřní předpis nebo pravidla pronajmu
skladového prostoru.

## Uspořádání

### Zásady

- **Šupláky nebo boxy s popisky.** Oba slouží stejně — boxy jsou přenositelné,
  šupláky jsou levnější na rozsáhlý sklad. Rozhodující je, aby **na každém
  místě visel popisek**, ne jen v hlavě člověka. Popisek nese datum
  poslední kontroly a stav místa.
- **ID viditelné na každém dílu.** Způsob zápisu je dán
  [příjemkou](21-prijemka.md#kde-se-id-zapisuje): přímo na díl tam, kde se to
  nesmí dotknout vodivých ploch, jinak na obal nebo na antistatický sáček.
  Bez čitelného ID se kus nedá dohledat v evidenci a nedá se ani prodat.
- **Evidované umístění.** U každého ID je v evidenci sloupec s umístěním ve
  skladu. Změna místa je zapsaná, jinak se sklad nedá přepočítat a vyměnit.
- **Fotografie skladu** — snímek polic a popisků jako doklad uspořádání,
  pořizuje se při změně rozmístění.

### Rozdělení zón

| Zóna | Co v ní je | Pravidlo |
| --- | --- | --- |
| **V testu** | Kus, který právě někdo zkouší | Označený ID, po testu se vrátí do správné zóny nebo do opravy |
| **Neprošlo** | Vadný nebo neprodatelný kus | Odděleno, aby se nepletl s použitelnými kusy; jde dál do opravy nebo do elektronického odpadu |
| **Připraveno k prodeji** | Prošlé díly a hotové sestavy | Tady už je kus na cestě k zákazníkovi — neuchovává se dlouho |

Dělení na zóny je důležité kvůli reklamací: chybný kus musí být dohledatelný
a musí jít z evidence ven, ne jen do opravy z hlavy.

TODO: přesné umístění zón a jednotné označení (barva štítku, pole na
popisku) — zdroj: zavedený systém štítků / tabulka Sklad.

## Životnost skladovaných dílů a dopad na marži

Níže není uvedena žádná záruka životnosti v rocích ani v měsících. Doby jsou
záměrně jen orientační popisy trendu; reálné meze musí vycházet z reálných
záznamů o skladování a z údajů výrobce konkrétní součástky.

| Díl | Co se s ním při dlouhém skladování děje | Důsledek pro prodej |
| --- | --- | --- |
| Mechanický HDD | Disky v klidu stále dostávají cykly roztočení a zastavení (například při přenosu nebo při nechtěném zapnutí), hlavy se opírají o plotny a ložiska se opotřebovávají. Klesá i jistota čtení ploten — data na disku, kterým nikdo nepíše, mohou být po letech méně čitelná | Disky v klidu zaplněném skladu berou jako rizikovou položku. Budeme muset řešit vadné sektory, případně kus vyřadit a nabídnout SSD. Disk, který dlouho leží bez zapnutí, je vhodné alespoň zkontrolovat dřív, než se dostane do sestavy |
| Notebooková a UPS baterie (Li-Ion) | Kapacita postupně klesá i v nečinnosti — stárne samotný elektrolyt a články, ne jen počet cyklů. Baterie navíc může prasknout, vznětit se nebo se „nafouknout", zvlášť když dlouho leží nabitá nebo vybitá | Proč po čase neprodat: vybitá baterie v notebooku je pro zákazníka méněcenný kus, ale reálná rizika jsou vyšší než sleva — elektrolyt je žíravý a požární. Z nabité baterie, která dlouho stála, nejde spoléhat na kapacitu. Takové baterie vyřazujeme z prodeje a likvidujeme přes sběrný dvůr, ne prodáváme „na baterii navíc" |
| Elektrolytické kondenzátory ve starých deskách | Vyschlé, zateklé nebo vyteklé — typický projev elektrolytického stárnutí, zhoršuje se i u nepoužívaných kusů a hůř v teple a ve vlhku | Zateklý kondenzátor je signál, že deska bude potřebovat zásah a výměnu. Dokud kondenzátor jen „vyschl" a je pod normálem, jde o nejistotu, ne o jistou poruchu — proto se kondenzátory v starých deskách měří před prodejem a vadný kus se zlevňuje nebo vyřazuje. Rozhoduje [stav dílu podle příjemky](21-prijemka.md#kdy-se-díl-označí-za-vadný) |
| Oxidace na kontaktech a pájených bodech | Vlhkost a znečištění způsobují kontaktní odpor: zelené nánosy na pískových zlatých kontaktech, bílé soli na plášti, zčernané anody na pinu chladiče | Přejevuje se to jako „někdy se to resetuje", „funguje to jen po vypnutí a znovu zapnutí", nesmyslný USB klávesnice — reklamace, u kterých je nejtěžší dohledat příčinu. Zelené nánosy na kontaktech jsou v příjmu důvod ke stavu **vadný**. Obyčejné zašednutí konektoru je jiný případ, ne oxid do zlata |
| Lepení zubů na páscích RAM po letech | Léto na straně, kde jsou zuby, tuhne, praská a může odlepit; vzniká vada, která se vyvine až po dlouhé době ležet, i když při příjmu fungovala | Paměť, která při příjmu fungovala, může po skladování přestat. Vadný zub je důvod testovat RAM těsně před prodejem a kus raději vyřadit, než ho prodávat s nadějí, že „se to spraví" |
| Těsnění chladičů a ventilátorů | Guma a lepidla tvrdnou a praskají, chladič začne potékat, ventilátor drží horší než nový | Proteklý chladič nebo mokré stopy na zadní straně CPU bývají u zákazníka překvapením a vedou k reklamaci. Takový kus je opravitelný, ale oprava musí být započtena do kalkulace, jinak se prodá se ztrátou |
| Kabely a přípojky | Lamely a vodiče v starých ohebných částech praskají, kevlarové opletení se protahuje, izolace tvrdne; zástrčky se opotřebují mechanicky | Kabel, který byl na příjemku v pořádku, může po skladování selhat jako první věc při sestavení a zrušit celý prodej. Proto se kabely počítají jako spotřební položka, ne jako příslušenství zdarma |

TODO: vlastní životnostní meze jednotlivých typů dílů (v měsících od
příjemku) a datum, po kterém se díl před prodejem musí otestovat — zdroj:
záznamy o skladování a závadách z evidence, případně údaje výrobce
pro konkrétní modely.

## Co netrvá dlouho a musí se otestovat těsně před prodejem

Poslední zkouška ve skladu není záruka. Vada se mohla vyvinout nebo se mohla
propuknout během skladování, aniž by na ní bylo při příjmu vidět.

Před prodejem se proto znovu ověří:

- **Vadný zub RAM** — zub lepené pásce nemusí být vidět, zlom se objeví až
  při čtení.
- **Kondenzátory a napájení** — běžná kontrola zatečení a chování pod
  zatížením.
- **Disky** — čitelnost dat a stav SMART u obou typů, ne jen u SSD.
- **Ventilátory** — volnoběh a ložiska; zadrhávání se vyvine za týdny.
- **Těsnění chladiče** — suchost plochy a pate CPU po rozebrání při
  sestavení.
- **Kontakty a konektory** — zelené nánosy, zčernělé piny, oxidace, která se
  za měsíce rozšíří.
- **Celkový vizuální stav** — promáčknutí, praskliny, uvězněné těsnění.

Rozsah a výsledky zkoušky se zapisují podle
[testovacích protokolů](../30-testovani-a-evidence/31-testovaci-protokoly.md) a
ukládají k dílu podle
[evidence komponent](../30-testovani-a-evidence/32-evidence-komponent.md).
Kus, který těsně před prodejem neprojde, jde do zóny **neprošlo** a nikdy se
neprodá s poznámkou ve stylu „jen občas". Výsledek poslední zkoušky určuje,
jestli kus splňuje [podmínky pro tier](../40-tiery/40-tier-definice.md).

## Kdy je sklad příliš velký

Sklad není náklad, který je větší lepší. Je příliš velký, když platí některé
z těchto věcí:

- **Sklad přerůstá v účetní prostor a doba obratu zbytečně dlouho stojí
  peníze.** Peníze v díle, který se neprodá, jsou zaměstnané kapitál a marže
  se nepočítá z nákupní ceny, ale z ceny v okamžiku prodeje. Pomáhá to
  vidět [rozpočet a break-even](../70-finance/73-rozpocet-a-break-even.md) a
  [cashflow](../70-finance/72-cashflow.md) — peněz uvázlých ve skladu je
  v obou jako minus.
- **Vzniká riziko ztráty nebo poškození.** Čím víc kusů čeká, tím větší
  riziko, že některý zmizne, promáčkne, zoxiduje, nebo že se při hromadném
  přesunu sáhne do jiného dílu a poškodí ho.
- **Místo se spotřebovává na nejhorší možné kusy.** Nový dobrý kus, který
  přijde, musí jít do skladu. Když je plno, přijde do zóny „v testu" a
  zůstane ležet, místo aby se dal okamžitě sestavit a prodat. Nejlepší místo
  musí patřit nejlepšímu dostupnému kusu, ne tomu, který čeká nejdýl.
- **Udržování skladu není zaplacené.** Čas na popisky, hledání kusů, počítání
  a likvidaci nepřijatých dílů roste s objemem a musí být vidět v kalkulaci
  ceny.

Řešení není „sklad větší“, ale výběr: co se opravdu prodá, co se opravdu
opraví a co jde do elektronického odpadu. Kusy, které neprojdou ani jedním
pokusem, se z evidence vyřadí, aby nezatěžovaly místo ani dobu obratu.

TODO: číselná hranice velikosti skladu (kusů, hodnota na skladě nebo
měsíce obratu) a interval revize skladu — zdroj: cashflow a
[týdenní report](../80-reporting/81-weekni-report.md).

## Checklist skladování

### Při uložení dílu

- [ ] ID dílu čitelné na kuse, nebo na obalu či antistatickém sáčku.
- [ ] Umístění zapsané v evidenci, popisek na místě.
- [ ] Díl je v suchu a čistu, bez prachu a stop po zacházení.
- [ ] V zóně, kam patří: „v testu", „neprošlo" nebo „připraveno k prodeji".
- [ ] U desk, paměti a karet nepřekryté, v antistatickém obalu, s vysoušecím
      sáčkem.
- [ ] Velké ploché díly (skříň, PSU, přední panel) položené tak, aby se
      nedeformovaly.

### Při pravidelné kontrole skladu

- [ ] Sken nebo vizuální procházka všech míst, ne jen zaplněných polic.
- [ ] Zkontrolována vlhkost a stav vysoušecích sáčků — vyměněny ty nasáklé.
- [ ] Zkontrolována viditelná koroze, zelené nánosy na kontaktech, zateklé
      kondenzátory.
- [ ] Zkontrolováno, že na žádné věci není prach, který by šel setřít, a že
      věci nejsou překryté těžšími kusy.
- [ ] Datum poslední kontroly zapsáno na popisku.
- [ ] Nálezy zapsány do evidence, ne jen na papír.

### Těsně před prodejem

- [ ] Díl vytažen ze skladu a znovu zkontrolován vizuálně.
- [ ] Otestováno to, co se během skladování mohlo zhoršit nebo propuknout
      (viz výše).
- [ ] Výsledek zapsán podle
      [testovacího protokolu](../30-testovani-a-evidence/31-testovaci-protokoly.md),
      fotografie k
      [evidenci komponent](../30-testovani-a-evidence/32-evidence-komponent.md).
- [ ] Stav opět odpovídá
      [podmínkám pro daný tier](../40-tiery/40-tier-definice.md) a ceně v
      [cenovém pásmu](../40-tiery/43-cenove-pasmo.md).
- [ ] Neprodaný kus se vrací na svoje místo v evidenci, ne mimo ni.

### Při revizi skladu

- [ ] Spočtena skutečná hodnota a doba obratu skladu.
- [ ] Vyřazeno, co neprojde ani jedním testem, a zapsán důvod.
- [ ] Rozděleno, co se dá prodat, opravit, a co patří do elektronického odpadu.
- [ ] Zapsáno, které místo se uvolnilo pro příjem nového kusu.

TODO: interval a odpovědná osoba pravidelné kontroly skladu — zdroj:
vnitřní předpis / rozhodnutí majitele.

## Související dokumenty

- [21. Příjem dílů do evidence](21-prijemka.md)
- [22. Čipování a čištění](22-cipovani-a-cisteni.md)
- [`../30-testovani-a-evidence/31-testovaci-protokoly.md`](../30-testovani-a-evidence/31-testovaci-protokoly.md)
- [`../30-testovani-a-evidence/32-evidence-komponent.md`](../30-testovani-a-evidence/32-evidence-komponent.md)
- [`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md)
- [`../70-finance/72-cashflow.md`](../70-finance/72-cashflow.md)
- [`../70-finance/73-rozpocet-a-break-even.md`](../70-finance/73-rozpocet-a-break-even.md)
- Šablona: [`../../templates/prijemka.md`](../../templates/prijemka.md)
