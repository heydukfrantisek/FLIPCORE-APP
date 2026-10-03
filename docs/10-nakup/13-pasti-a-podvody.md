# Pasti a podvody

**Účel:** Přehled podvodů a zavádějících technik, které se na bazarovém hardwaru vyskytují, a konkrétní kontrola, která každou z nich odhalí dřív, než je díl vložen do skladu.

Související: kanály a pravidla dodávání `10-kanaly.md`, ověření před cestou `11-due-diligence.md`,
cenové limity `12-max-ceny.md`, tier podle CPU `../40-tiery/41-cpu-tabulka.md`, zápis do evidence
`../20-prijem-a-sklad/21-prijemka.md`, testovací protokoly `../30-testovani-a-evidence/31-testovaci-protokoly.md`.

## Podvod platebním odkazem nebo předplatnou

Prodávající požádá o platbu předem přes platební odkaz, QR kód nebo „rezervaci" ceny přes marketplace, místo
aby přijel hotovostí nebo převodem na místě.

- [ ] Kontrola z domova: prodávající trvá na platbě předem, odmítá osobní odběr, platbu přes odkaz v SMS
  nebo e-mailu, případně nabízí „rezervaci" přes platformu. Reakce rychlá a ochotná, ale odmítá se
  podívat na sestavu bez přislíbení platby.
- [ ] Neplatit. Přerušit komunikaci, nahlásit inzerát jako podvodný přes odkaz v kanálu podle `10-kanaly.md`.

## „Nepoužívaný" disk, který má být v ložisku starý

Disk se v inzerátu prodává jako nepoužívaný, ale ve skutečnosti dlouho běžel v serveru nebo v notebooku
a má opotřebované ložisko — SMART ukazuje reallocated, pending nebo uncorrectable sektory.

- [ ] Kontrola na místě: přečíst SMART (reallocated sector count, pending sectors, celkové hodiny napájení,
  počet chybných čtení), spustit krátký sebevěr test podle `../30-testovani-a-evidence/31-testovaci-protokoly.md`.
  Vadných sektorů nesmí být ani jedna.
- [ ] Disk s jakýmkoli chybovým SMART odmítnout a nechat za něj vysvětlit. K účelu lze použít starší
  jednotku jen výslovně jako náhradní díl, ne do sestavy na prodej.

## Procesor s vypájenou pastí a nedosedícím chladičem

Past CPU je ohebná a opotřebovaná, nebo chybí; kryt chladiče nedosedá po řádek a teplo se neodvádí
pořádně k passti — CPU pak běží horký a může se přehřívat.

- [ ] Kontrola na místě: past v zásuvce leží v jedné rovině, ne je zahlácená nebo vyražená, kryt chladiče
  sedí rovně a nedotýká se boků patice. Namontovat chladič i bez pasti a odečíst teplotu pod
  krátkou zátěžkou.
- [ ] Vypálenou past povolit jen z opatrnosti, jinak kus odmítnout. Chladič, který nedosedí, není
  opravitelný a taková sestava nepatří do prodeje.

## GPU s vyboulenou pastí

Pasta na GPU je vyboulená, často i s prasklinou — GPU při sebemenším rozdílu teploty ztrácí kontakt
a padá.

- [ ] Kontrola na místě: pohled pod lupou na každou pastu, zkouška stability zátěžkou podle
  `../30-testovani-a-evidence/31-testovaci-protokoly.md`, kontrola, že se GPU během testu nepřehřívá
  a neodpojuje.
- [ ] GPU s vyboulenou pastí odmítnout. Repaste nepomůže, pouze se dá poznat později u zákazníka.

## Sestava se zjevně kradená: krájená sestává, padlá záložní deska

V dílech chybí sloty pro RAM nebo PCIe sloty, které by tam být měly, popraskané otevře chladiče nebo
zadní panel zásuvky, chybí spodní kryt, I/O panel nebo BNC. Větší stopa je padlá záložní deska z hlavní
desky — chybí sloty M.2 nebo PCIe, které byly na místě vyříznuté.

- [ ] Kontrola na místě: porovnat sestavu s referencí v `../40-tiery/44-referencni-sestavy.md`, zkontrolovat
  kompletnost, zrcadlově obrácené sloty, chybějící kryty, poškozené pachytky a základní desku z obou stran.
- [ ] Odmítnout a poznamenat do poznámky v `../20-prijem-a-sklad/21-prijemka.md`. Kradené sestavy se
  do skladu nebere ani za výrazně nižší cenu.

## Přepsané sériové číslo

Sériové číslo dílu nebo sestavy je přepsáno, nebo odpovídá jinému kusu než ten, který je fyzicky
nabízen — záměr je schovat předchozího majitele nebo vytvořit zdánlivou záruku.

- [ ] Kontrola: sériové číslo z etikety a systému se musí shodovat, výrobce ho umí dohledat. Neexistuje
  nebo nesouhlasí, je sériové číslo přepsané.
- [ ] Neplatit a nahlásit prodejce. Kus bez dohledatelného sériového čísla nebereš do evidence,
  protože doklad o původu neexistuje.

## Vymyšlená konfigurace v inzerátu

Inzerát uvádí lepší konfiguraci, než jaká je ve skutečnosti: píše 32 GB RAM a v sestavě je 8 GB,
píše SSD 1 TB a uvnitř je 128 GB. Rozdíl zjistíš až při rozebrání nebo v systému.

- [ ] Kontrola z inzerátu: požádej o fotku obou stran základní desky s osazenými moduly a o fotku disků,
  na níž je vidět štítek s modelem a kapacitou. Z inzerátu projdi údaje, které může ověřit jen kus
  na místě, podle `11-due-diligence.md`.
- [ ] Při rozjezdu ověřit kapacitu RAM a model disků v systému. Konfigurace nižší než inzerát = sestava
  pro jinou cenu, odmítnout a neplatit původní cenu.

## „Vadná" baterie v napájecím adaptéru GPU

Externí napájecí adaptér má vybublý článek baterie, která podle prodávajícího „vadí" nebo „byla vadná".
Stará baterie často dýmí a může adaptér vzít i s sebou.

- [ ] Kontrola na místě: prohlédnout pouzdro, hledat vyboulené články, propáleniny, unikající plyn nebo
  zápach. Adaptér s baterií nikdy nezkoušej pod zátěží, dokud ho nevidíš.
- [ ] Adaptér s baterií odmítnout. Používat výhradně napájecí zdroje a adaptéry z katalogu bez baterií.

## Vyboulené kondenzátory na základní desce

Na základní desce jsou vyboulené kondenzátory — deska přejde do záchranného režimu, nestabilní napětí
a výpadky v provozu, ale na stole vypadá vše v pořádku.

- [ ] Kontrola na místě: při rozebrání prohlédnout kondenzátory u CPU, kolem DIMM a PCIe slotů, hledat
  vyboulené nebo promáčknuté těleso, případně stopu vytéklého elektrolytu.
- [ ] Desku s vyboulenými kondenzátory odmítnout. U jediného vadného kondenzátoru před prodejem neuvažuj
  opravu, odběr dělá opravářské centrum.

## Prodej na dálku bez možnosti testu na místě

Nabídka přijde bez domluvené návštěvy a prodávající tlačí na rychlé poslání dopředu, protože „je zítra
dostupný jiný kupec" a jde o výjimečnou příležitost.

- [ ] Kontrola z domova: prodávající nechce fotky boku disku, nepřijímá otázky na provoz, tlačí na
  okamžité zaplacení nebo na výběr předem. Není čas na dojezd a rozebrání.
- [ ] Neposílat nic. Nabídku bez možnosti ověření na místě odmítnout, i když cena vychází pod
  `12-max-ceny.md`. Nabídku bez prohlídky u kupce vyznačit jako neověřenou a nepsat ji do evidence
  jako ověřený kus.

## Neoriginální Windows klíč nebo klíč k účtu

Windows je aktivován neoriginálním klíčem, případně je koupený účet Microsoft s malware, který přijde
po přihlášení zákazníka.

- [ ] Kontrola na místě: stav aktivace Windows v nastavení, zda jde o OEM klíč navázaný na konkrétní
  základní desku. Klíč k účtu nebo „digitální licenci z restaurace" odmítnout.
- [ ] Neaktivovat Windows cizím klíčem a neprodávat sestavu s takovou aktivací. Klíč k účtu,
  který nemáš k dohledání, do evidence nepiš — jinak se malware dostane k zákazníkovi a pod klíčem
  prodávajícího, ne tvými jménem.

## Podvržené reference nebo prodej přes jiný kanál než domluvený

Prodejce posílá reference, o kterých se dá pochybnout, nebo po domluvě přesměruje komunikaci na jiný
kanál — jiný chat, jiný účet, e-mail nebo telefon. Podmínky se mění a doklady se ztrácejí.

- [ ] Kontrola z domova: reference jsou fotky s watermarkem jiného inzerátu, e-mailová adresa nesouhlasí
  s profilem, po domluvě se vyskytne nové číslo nebo jméno účtu.
- [ ] Zůstat u kanálu dohodnutého podle `10-kanaly.md`, změnu kanálu odmítnout. Změnu jména,
  IČO nebo bankovního účtu proti původní dohodě vůbec neposílat peníze.

## Záměna SSD M.2 proti SATA při stejné kapacitě

Prodejce záměrně zamění SSD 256 GB M.2 NVMe za pomalejší 256 GB SATA 2,5" (nebo naopak) a mluví
o „SSD 256 GB", čímž maskuje rozdíl v rychlosti i ve slotu.

- [ ] Kontrola na místě: faktorem rozlišit rozhraní (NVMe proti SATA), případně na fyzické rozměry,
  a přes systém zjistit typ úložiště a jeho rychlost.
- [ ] Zjistit typ z označení modelu a z fakturačního kódu, ne z popisu „SSD". Záměna je důvod odmítnout
  nabídku, pokud hodnota disku vychází jinak v `../40-tiery/41-cpu-tabulka.md` a `12-max-ceny.md`.

## Inzerát konkurenční hotové sestavy

V inzerátu je tělo počítače jen proto, aby se dobře prodalo — hardware v těle může být vyměněný nebo
komponovaný z jiného kusu, prodejce sám službuje o montáž, nebo jde o cizí sestavu na zakázku.

- [ ] Kontrola z domova: prodejce zároveň nabízí vlastní montáže, případně se označuje jako bazar, ale
  inzerát čísluje sestavy jako „skladem" a láká na cenu katalogové hotové sestavy.
- [ ] Nechovat cizí hotovou sestavu do vlastního prodeje. Koupit jen jednotlivé díly s ověřenou
  konfigurací, kusy zapsat do evidence jako vlastní a sestavit z nich podle `../40-tiery/44-referencni-sestavy.md`.

## Krátká pravidla

- [ ] Nikdy neposílat zálohu předem a neplatit přes platební odkaz, QR kód nebo předplatnou.
- [ ] Ověřovat profil a rychlost reakce prodávajícího, nechat si poslat fotky vnitřku a konkrétních dílů z štítků.
- [ ] Vždy žádat možnost sestavu rozebrat a vyjmout všechny komponenty, než se cokoli zaplatí.
- [ ] Otestovat každý díl podle `../30-testovani-a-evidence/31-testovaci-protokoly.md` před zaplacením, ne po.
- [ ] Při jakémkoli chybovém SMART na disku, vyboulené pastě nebo nedosedícím chladiči kus odmítnout.
- [ ] Nekupovat „neoriginální Windows" ani klíč k účtu, který nemáš pod kontrolou.
- [ ] Nechat všechny doklady a komunikaci v jednom kanálu podle `10-kanaly.md`, změnu účtu nebo IČO odmítnout.
- [ ] Zapsat každý převzatý kus do evidence podle `../20-prijem-a-sklad/21-prijemka.md`, včetně stavu,
  odečtených a zjištěných vad.
