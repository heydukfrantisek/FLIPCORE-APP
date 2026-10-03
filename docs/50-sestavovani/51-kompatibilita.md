# Kompatibilita a skládání sestav

**Účel:** Shrnuje, které komponenty se k sobě dávají dohromady, které ne a podle čeho se to pozná dřív, než se sestava rozjede.

Sestavy skládáme podle [44-referencni-sestavy.md](../40-tiery/44-referencni-sestavy.md),
minimum tieru určuje [40-tier-definice.md](../40-tiery/40-tier-definice.md). Každý
převzatý kus zapisujeme do evidence podle
[21-prijemka.md](../20-prijem-a-sklad/21-prijemka.md) a po složení
otestujeme podle [31-testovaci-protokoly.md](../30-testovani-a-evidence/31-testovaci-protokoly.md)
na tiskárni [test-protokol.md](../../templates/test-protokol.md).

Záměny, které prodávající v bazaru nejčastěji zatajují, jsou popsané v
[13-pasti-a-podvody.md](../10-nakup/13-pasti-a-podvody.md).

## Socket a patka procesoru

Socket na základní desce a patka na procesoru musí být **stejný typ**. Shodné
názvy vypadají jako jistota, ale nejsou: LGA 1150 a LGA 1151 mají stejný
rozměr i stejný počet pinových hrotů, přesto se liší zámkem (rytím) na
zadní straně socketu a klíčem na patce, takže se patka jedné generace do
socketu druhé vložit nedá a stejně tak naopak. Stejně blízké jsou AM4 a AM5.
Přítomnost hrotů na jedné a zásuvek na druhé straně je jen orientační znamení,
ne záruka kompatibility.

**Zlatá značka na rohu patky** (trojúhelník v rohu) musí sedět na stejný
trojúhelník vyznačený v rohu socketu. Značka určuje orientaci, ne typ.
Bez ní patka nesedne a nesmí se do socketu vkládat násilím — zahnuté hroty
socketu znamenají zničenou desku. Stejné pravidlo platí pro značku na
straně pásku a na chladiči.

U bazarových kusů se přidávají dvě rizika:

- **Vypájená pasta** — na patce chybí, je vyschlá nebo naopak vytlačená ven.
  Při přesunu patky z jedné sestavy do druhé se pasta většinou smaže a zůstane
  na jednom z povrchů, i když to není na první pohled vidět.
- **Ohebné hroty** — zásuvkové (pin) patky jsou napnuté, zahnuté nebo
  chybějící. Chybějící hrot se při vložení do socketu ohne, ale socket se tím
  už nikdy neopraví.

Kontrola patky patří do příjmu kusu podle
[21-prijemka.md](../20-prijem-a-sklad/21-prijemka.md) a do
[13-pasti-a-podvody.md](../10-nakup/13-pasti-a-podvody.md).

TODO: doplnit tabulku podporovaných socketů pro jednotlivé čipsety z našeho
sortimentu — zdroj: specifikace výrobce k dané základní desce.

TODO: doplnit, kterým nástrojem a v jakém úhlu se pastu vymění, aby hroty
zůstaly nepoškozené — zdroj: doporučení výrobce chladiče a pasty.

## Typ paměti

DDR4 a DDR5 nejsou záměnné. Nejenže se liší zubací zlomena v těle modulu, takže
modul fyzicky nepasuje do slotu, ale liší se i elektricky — jiné napětí,
jiný sběrný řadič, jiné pořadí zapnutí modulů. Stejně tak se nekompatibilní
starší generace mezi sebou: deska určuje, které typy paměti vůbec umí, a
zpracuje vždy jen svou vlastní.

Sestava se skládá z dílů různých kusů prakticky vždy. Modul z jiné
sestavy proto může být jiného typu, jiné kapacity i jiného výrobce. Kombinovat
lze jen moduly stejného typu, které deska podporuje. U smíšených kapacit se
říadič řídí pravidlem výrobce desky a může běž v režimu nižšího výkonu nebo
s omezenou rychlostí.

**Starší bazarové desky často potřebují aktualizaci BIOSu**, aby novější
procesor vůbec poznaly — deska s něj starou verzí BIOSu se s novým procesorem
nemusí rozjet vůbec a nerozsvítí se ani diagnostika. Aktualizace se dělá
před vložením nového procesoru, přes starší procesor, který deska podporuje,
protože flashování probíhá v režimu, kde se kladou minimální požadavky na
procesor. Bez původního BIOSu z výroky je zákaz nereálný, viz
[13-pasti-a-podvody.md](../10-nakup/13-pasti-a-podvody.md).

TODO: doplnit minimální verzi BIOSu pro každou desku a procesor, které
přicházejí do sortimentu — zdroj: výrobce základní desky, seznam podporovaných
procesorů a changelog BIOSu.

TODO: doplnit podporované typy paměti a jejich nejvyšší podporované
rychlosti pro jednotlivé čipsety — zdroj: specifikace výrobce k dané desce.

## Formát disku

Existují tři běžné varianty, které se v bazarových sestavách pletou:

| Varianta | Rozhraní | Rozměr | Kabel |
| --- | --- | --- | --- |
| M.2 NVMe | PCIe přes M.2 slot | malý, na šířku | žádný |
| M.2 SATA | SATA přes M.2 slot | malý, na šířku | žádný |
| 2,5 palce SATA | SATA | krabice 2,5 palce | datový + napájecí |

**M.2 slot není totéž co NVMe.** Stejný tvar modulu, jiná signalizace. Slot
na desce může umět jen SATA, jen PCIe, nebo obě. Modul NVMe v slotu, který
umí jen SATA, se vůbec nerozpozná; opačně se SATA modul ve slotu PCIe
vůbec nedosadí, protože má jiné klíčování. Rozhoduje zadní strana slotu a
specifikace desky, ne vzhled modulu.

Chyták při nákupu: v inzerátu bývá uvedeno „SSD 256 GB" a ve skutečnosti jde
o **M.2 SATA**, tedy úložiště s rychlostí SATA, ačkoliv typicky sedí ve slotu,
který deska chápe jako NVMe. Zákazníkovi to pak nesplní to, co od tieru
slibujeme (minimum pro `HIGH` je NVMe, viz
[40-tier-definice.md](../40-tiery/40-tier-definice.md)). Rozlišení patří do
[13-pasti-a-podvody.md](../10-nakup/13-pasti-a-podvody.md).

Ověření: faktorem na štítek modelu, přes systém typ úložiště a jeho
rychlost, případně podle
[31-testovaci-protokoly.md](../30-testovani-a-evidence/31-testovaci-protokoly.md).

TODO: doplnit, které z našich desek mají slot M.2 a zda umí NVMe, SATA nebo
obojí — zdroj: specifikace výrobce k dané základní desce.

TODO: doplnit, u kterých disků vychází spotřeba a rychlost mimo naše
tiery — zdroj: údaje výrobce disku a záznamy z testů.

## Napájecí zdroj

Wattáž zdroje se volí podle tieru a podle toho, jakou kartu a procesor
sestava obsahuje, a musí být větší než součet příkonů. Zbytek je rezerva na
špičky, na stárnutí a na to, že údaje v katalozích bývají zaokrouhlené dolů.
Minimální hodnoty pro jednotlivé tiery jsou v
[40-tier-definice.md](../40-tiery/40-tier-definice.md) a ukázkové sestavy v
[44-referencni-sestavy.md](../40-tiery/44-referencni-sestavy.md).

Konektory pro napájení karty se v generacích měnily a **počet kolíků na
konektoru je jeho typ** — stejný tvar, jiný počet pinů. Kabel ze staršího
zdroje se do novějšího slotu karty nezasune ani silou a karta se
nepozná. Zpětně lze použít přechod, ale zbytečně snižuje rezervu a přidává
bod selhání, proto raději zdroj s odpovídající generací konektoru. Zdroj bez
potřebného napájecího kabelu u karty je důvod sestavu nedokončit, viz
[44-referencni-sestavy.md](../40-tiery/44-referencni-sestavy.md).

**Co se stane při poddimenzování:** zdroj se při trvalém přetížení nejprve
projeví vypnutím sebe, případně systému, nebo vypnutím ochrany a restartu
za provozu. Při kratším přetížení se mohou objevit pády, artefakty v obraze
nebo chybová hlášení. Nejhorší varianta je tichá: napětí kolísá, ventilátor
křive naskakuje a sestava se při delší zátěži sype bez jakékoli hlášky.

**Kdy to není zpozorovatelné hned:** sestava po zapnutí nabootuje a
prohlížeč nebo kancelářské aplikace běží bez problémů, protože v klidu je
příkon malý. Poddimenzování se projeví až při zátěži — hraní, render, kopírování
velkých souborů. Kdybychom to neověřili zátěžovým testem podle
[31-testovaci-protokoly.md](../30-testovani-a-evidence/31-testovaci-protokoly.md)
a neodečetli příkon, zákazník na to narazí první. Proto je zátěžový test
součástí odevzdání, ne volitelné dokončení.

TODO: doplnit doporučené a minimální wattáže pro jednotlivé tiery a
referenční sestavy — zdroj: specifikace výrobce zdroje a výpočet příkonu
sestavy.

TODO: doplnit mapování generací napájecích konektorů k jednotlivým GPU
v našem sortimentu — zdroj: specifikace výrobce karty.

## Chlazení

Chladič musí odvádět teplo procesoru, ale nesmí se dotknout ničeho jiného.
Tři kontroly před montáží:

- **Výška chladiče vůči bedýnce.** Věžový chladič a věž AIO mají
  výškový limit, který určuje výrobce bedýnky. Chladič, který se dovnitř
  nevejde, může mít kryt nastavený níž, ale pak nesmí přesahovat ani
  boční panel a nesmí bránit krytu. U bazarových bedýnek je časté, že
  deklarovaný limit neodpovídá skutečnosti po přidání pantů a mřížky.
- **Zápasná past.** Když chladič přesahuje zásuvkovou socket past, tlačí
  na ni a zvedá celou věž. Přítlačná síla pak nepřipadá na procesor, ale na
  ohebné hroty pasty, které se odírají. Řešení je posunout věž směrem k
  zadnímu panelu, pokud to zadní panel dovoluje, nebo chladič vyměnit.
- **Socket a upevnění.** Chladič musí být určen pro daný socket, jinak
  se upevňovací otvory neshodují. U AMD platí, že chladič pro AM4 sedí i na
  AM5, v opačném směru nikoli — montážní otvory se mezi platformami měnily.

**Rozměry ventilátorů** musí sedět na kryt, který je v dané bedýnce
opravdu osazený, a jejich tloušťka se musí vejít do mezery, kterou v bedýnce
v skutečnosti je, ne v jakou bývá v katalogu. Ventilátor navíc musí
přivádět vzduch přes lamely chladiče, ne do něj stranicemi.

**U AIO je navíc délka hadic a místo na radiátor.** Hadice musí dosáhnout
od patky k místu radiátoru bez tahu, a to místo musí být volné — u horních
slotů se často musí sáhnout na výšku bočního panelu, u předních do
předního panelu, který je u řady malých bedýnek už obsazený. Kompaktní AIO
se vejde jinam než plná velikost.

Neosazení chladiče z původní sestavy a použití jiného bez kontroly je
nejčastější zdroj přehřevu u bazarových kusů, viz
[13-pasti-a-podvody.md](../10-nakup/13-pasti-a-podvody.md).

TODO: doplnit výškové limity chladičů pro naše bedýnky a rozměry dostupných
radiátorů — zdroj: specifikace výrobce bedýnky a chladiče.

TODO: doplnit, které chladiče jsou vhodné pro které procesory v našich
tierech — zdroj: specifikace výrobce chladiče a údaje o tepelném výkonu
procesoru.

## Sloty pro paměť

Bazarové základní desky mívají dva nebo čtyři sloty pro paměť. Dva sloty
jsou typické pro nejlevnější kancelářské a micro-ATX desky; na `HIGH` a u
herních kusů se počítá se čtyřmi. Se dvěma sloty nelze dosáhnout dvoukanálového
běhu, pokud v nich nejsou dvojice zrcadlových modulů, a při plnění jedním
modulem se druhý slot nechává volný pro pozdější doplnění.

**Plný DIMM může bránit chlazení CPU.** Věžový chladič u patky sedí
přes konečky DIMMů a zabraňuje jim se do slotu vložit. Řešení je obvykle
dát poslední DIMM jinam, než aby se vzdával dvoukanálového běhu, nebo
přesunout chladič v případě, že to deska a zadní panel dovolují. U
nízkoprofilových chladičů a box chladičů problém není.

Před koupí je nutné ověřit počet slotů i jejich formát, protože i počet
položek v inzerátu bývá zkreslený, viz
[13-pasti-a-podvody.md](../10-nakup/13-pasti-a-podvody.md).

TODO: doplnit počet slotů pro paměť u konkrétních desek v našem sortimentu —
zdroj: specifikace výrobce k dané základní desce.

TODO: doplnit podporované kapacity na slot a na celou desku — zdroj:
specifikace výrobce k dané základní desce.

## Verze BIOSu a Secure Boot

Starší bazarové desky často Secure Boot vůbec nepodporují a často
neumějí startovat z USB. To má přímý dopad na **instalaci Windows 11**:
bez Secure Boot a bez podpory TPM nelze systém nainstalovat z USB novou cestou,
takže instalace vyžaduje starší už nainstalovaný systém, na kterém se
upgraduje. To je důvod, proč starší platformy prodáváme bez systému
(viz [40-tier-definice.md](../40-tiery/40-tier-definice.md)) a proč Windows 11
nabízíme jen tam, kde je cesta nativní.

Podobně rozhoduje TPM 2.0 — buď zabudovaný v procesoru, nebo jako samostatný
modul, který se do slotu USB vejde, ale pouze pokud jej firmware vůbec
podporuje.

Verze BIOSu v bazarovém kusu bývá často starší, než výrobce vydal. Starý
BIOS může nejen bránit instalaci systému, ale i špatně hlásit vlastnosti
desky, nebootovat s novým procesorem nebo nemít opravu bezpečnostního
problému. Aktualizaci BIOSu je třeba naplánovat před složením, ne po
reklamaci, a vždy s původním záložním systémem, podle
[44-referencni-sestavy.md](../40-tiery/44-referencni-sestavy.md).

Zapsané dojmy o tom, co kus zvládne, patří do evidence podle
[21-prijemka.md](../20-prijem-a-sklad/21-prijemka.md).

TODO: doplnit podporu Secure Boot, startu z USB a TPM 2.0 pro konkrétní
desky v našem sortimentu — zdroj: specifikace výrobce k dané základní desce.

TODO: doplnit minimální verzi BIOSu pro instalaci Windows 11 na starších
platformách — zdroj: oficiální dokumentace Microsoftu.

## Checklist před složením

- [ ] Socket procesoru sedí se socketem desky, zlatá značka na patce a na
      desce se potkává na stejném rohu.
- [ ] Patka má všechny hroty, pasta není vyschlá ani vytlačená ven, při
      přesunu se přenesla na obě plochy.
- [ ] Moduly paměti jsou typu, který deska podporuje, sedí v příslušných
      slotech a jsou zapláknuty.
- [ ] Slot M.2 na desce umí NVMe, pokud osazujeme NVMe.
- [ ] Typ disku odpovídá tomu, co v inzerátu opravdu bylo, a co tier vyžaduje.
- [ ] Výkon zdroje odpovídá sestavě a má rezervu; napájecí kabel karty sedí
      do slotu bez násilí.
- [ ] Chladič se vejde do bedýnky a nedotýká se patky ani DIMMů; u AIO
      dosáhnou hadice k radiátoru a místo na něj je volné.
- [ ] BIOS desky umí Secure Boot a start z USB, pokud instalujeme Windows 11.
- [ ] Kabely a konektory jsou zapojené správně a všechno je utažené.
- [ ] Po složení proběhl zátěžový test podle
      [31-testovaci-protokoly.md](../30-testovani-a-evidence/31-testovaci-protokoly.md)
      a výsledek je zapsaný na tiskárni
      [test-protokol.md](../../templates/test-protokol.md).
- [ ] Sestava odpovídá tieru podle
      [40-tier-definice.md](../40-tiery/40-tier-definice.md), profil procesoru podle
      [41-cpu-tabulka.md](../40-tiery/41-cpu-tabulka.md) a karty podle
      [42-gpu-tabulka.md](../40-tiery/42-gpu-tabulka.md) a cenově sedí do
      [43-cenove-pasmo.md](../40-tiery/43-cenove-pasmo.md).
- [ ] Marže po složení je nad minimem podle
      [71-kalkulace-marze.md](../70-finance/71-kalkulace-marze.md).
