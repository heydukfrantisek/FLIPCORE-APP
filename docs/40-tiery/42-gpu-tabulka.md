# Tabulka GPU — model a tier

**Účel:** Převádí model grafické karty na tier a říká, zda karta stojí za to v bazaru vůbec nakupovat.

Pravidla tieru jsou v [40-tier-definice.md](40-tier-definice.md). Rozhodující vztah
je pro sestavu jediný a platí i pro GPU: **tier sestavy =
max(tier(CPU), tier(GPU))**. GPU není o nic rozhodující než CPU — přebírá tier
jen tehdy, když je silnější.

Tabulka je **referenční** — model, který tu chybí, do sortimentu nekupuj, dokud
ho nedoplníš.

**Tier se určuje modelem, ne generací.** „8. generace" u GeForce neexistuje jako
tierový údaj — NVIDIA řady 10/20/30/40 nejsou návazností na Intel generace a
mají jinou logiku. Hodnotí se konkrétní model.

Sloupce:

- **Rozhraní / rozměr** — běžné rozměry a napájení pro kontrolu při skládání
  ([51-kompatibilita.md](../50-sestavovani/51-kompatibilita.md)).
- **Tier** — `LOW`, `MID`, `HIGH`, nebo `MIMO ROZSAH`.
- **Zdůvodnění** — proč právě tento tier.

## Tier LOW

| Model | Rozhraní / rozměr | Tier | Zdůvodnění |
| --- | --- | --- | --- |
| Intel HD Graphics 2000 / 3000 / 4000 / 4600 (Sandy Bridge, Ivy Bridge) | PCIe x16 (sdílený), integrovaná | `LOW` | IGPU pro kancelář, e-mail a přehrávání videa; v bazaru je součástí desky, kupuje se jako celý počítač. |
| Intel HD Graphics 5000 / 520 (Broadwell, Skylake) | PCIe x16 (sdílený), integrovaná | `LOW` | Přímý video výstup a trochu víc výkonu pro přehrávání 4K videa, stále bez herního výkonu. |
| Intel UHD Graphics 530 / 630 (Kaby Lake, Coffee Lake) | PCIe x16 (sdílený), integrovaná | `LOW` | Nejlepší z běžných IGPU pro kancelář a video; s nimi se `LOW` sestava prodává jako hotová věc s výstupem na monitor. |
| NVIDIA GeForce GT 1030 (GDDR5, GDDR6 i DDR4) | PCIe x16, dvouslotová, bez napájecího kabelu | `LOW` | Nejslabší samostatná karta, která má ještě smysl: druhý monitor, video a lehké hry. Zařazení `LOW`, ne `MID`, protože 1080p/60 fps v titulech pro `MID` nezvládne. Varianta DDR4 je stejný model, tedy také `LOW`, ale kupuje se jen jako levnější náhrada, pokud je cenou výrazně pod GDDR5. |
| AMD Radeon RX 550 (2 GB / 4 GB) | PCIe x16, dvouslotová, bez napájecího kabelu | `LOW` | Obdoba GT 1030 s větší pamětí; v bazaru levná a spolehlivá, herní výkon ale zůstává na úrovni kancelářské sestavy s videem. Obě varianty paměti (2 GB i 4 GB) jsou `LOW`. |
| AMD Radeon HD 5770 / 6670 | PCIe x16, dvouslotová, napájení 6 pin | `LOW` | Stará DirectX 11 karta; hratelná jen ve starých titulech. Kupuje se jako levné přehrávání a náhradní díl, ne jako herní karta. |

## Tier MID

| Model | Rozhraní / rozměr | Tier | Zdůvodnění |
| --- | --- | --- | --- |
| NVIDIA GeForce GTX 1050 Ti (4 GB / 6 GB) | PCIe x16, dvouslotová, bez napájecího kabelu | `MID` | Slabší zástupce řady 1000; vhodný pro starší a esports tituly, GTA V na střední nastavení. |
| NVIDIA GeForce GTX 1060 (6 GB) | PCIe x16, dvouslotová, napájení 6 pin | `MID` | Nejvyšší model řady 1000 a nejčastější bazarová herní karta pro `MID`; 1080p/60 fps v titulech uvedených pro `MID`. |
| NVIDIA GeForce GTX 1650 (GDDR5 / GDDR6) | PCIe x16, dvouslotová, u GDDR6 verze napájení 6 pin | `MID` | Nejslabší Turing; hratelný na 1080p, ale u těžších titulů na nízké nastavení. |
| NVIDIA GeForce GTX 1660 (6 GB) | PCIe x16, dvouslotová, napájení 6 pin | `MID` | Nejvyšší model řady 1000, který se v bazaru prodává jako „střední třída"; hranice mezi `MID` a `HIGH` leží už na kartách řady RTX 2000. |
| AMD Radeon RX 470 (2 GB / 4 GB) | PCIe x16, dvouslotová, napájení 6 pin | `MID` | Nejslabší bazarová karta pro 1080p hraní; v bazaru dostupná prakticky všude, ale 2 GB verze je pro novější hry málo. |
| AMD Radeon RX 570 | PCIe x16, dvouslotová, napájení 6 pin | `MID` | Zpravidla levnější než RX 580 se srovnatelným výkonem; standardní volba pro `MID` sestavu. |
| AMD Radeon RX 580 (2048SP i běžná) | PCIe x16, dvouslotová, napájení 6 pin | `MID` | Nejprodávanější bazarová karta na českém trhu; 2048SP je výkonově mezi RX 570 a GT 1660, obě verze patří do `MID`. |
| AMD Radeon RX 590 | PCIe x16, dvouslotová, napájení 6 pin | `MID` | Nejrychlejší karta řady RX 500; na hranici `MID`, ale proti RTX 2060 nebo RX 6600 stále nedosáhne, proto zůstává `MID`. |

## Tier HIGH

| Model | Rozhraní / rozměr | Tier | Zdůvodnění |
| --- | --- | --- | --- |
| NVIDIA GeForce RTX 2060 | PCIe x16, dvouslotová, napájení 8 pin | `HIGH` | Nejslabší RTX; hranice sortimentu vzhůru. S výkonným CPU dává 1080p/1440p hraní, ale s 6 GB paměti je pro budoucí tituly těsná. |
| NVIDIA GeForce RTX 2060 SUPER / 2070 SUPER | PCIe x16, dvouslotová, napájení 8 pin | `HIGH` | Výkonově mezi RTX 2060 a RX 6700 XT; v bazaru vzácnější, proto nejsou v referenčních sestavách. |
| NVIDIA GeForce RTX 3060 (12 GB) | PCIe x16, dvouslotová až trojslotová, napájení 8 pin | `HIGH` | Nejžádanější karta pro `HIGH` — 12 GB paměti a dostačující výkon na 1440p. |
| NVIDIA GeForce RTX 3060 Ti | PCIe x16, dvouslotová, napájení 8 pin | `HIGH` | Výkonově nad RTX 3060, menší spotřeba; v kombinaci s Ryzen 3600 ale nevytváří dostatečnou rezervu pro 1440p/60 fps, proto do `HIGH` patří jen s výkonnějším CPU. |
| NVIDIA GeForce RTX 4060 | PCIe x16, dvouslotová, napájení 8 pin | `HIGH` | Nejnovější bazarově dostupná karta sortimentu; nejúspornější z uvedených HIGH karet, hodí se do sestav s i5-12400. |
| AMD Radeon RX 6600 (8 GB) | PCIe x16, dvouslotová, napájené 1x 8 pin | `HIGH` | Slabší z řady RX 6000, ale 8 GB paměti a nízká spotřeba; nejlevnější karta pro `HIGH` sestavy a bazarový základ 1440p. |
| AMD Radeon RX 6700 XT | PCIe x16, dvouslotová, napájení 1x 8 pin | `HIGH` | Výkonnější než RX 6600 a levnější než RTX 3060 Ti; bazarový základ výkonnějších `HIGH` sestav. |
| AMD Radeon RX 6750 XT | PCIe x16, dvouslotová, napájení 1x 8 pin | `HIGH` | Nejvyšší běžná karta řady RX 6000 v našem sortimentu; v bazaru občasně, před nákupem ověř stav a původ. |
| AMD Radeon RX 7600 | PCIe x16, dvouslotová, napájení 1x 8 pin | `HIGH` | Nejnovější bazarová karta AMD v sortimentu; hranice sortimentu vzhůru. |
| NVIDIA GeForce GTX 1080 / 1080 Ti | PCIe x16, dvou- až trojslotová, napájení 6 pin / 8 pin | `HIGH` | Pascal přesahuje nejsilnější kartu `MID` (GTX 1660) a je v bazaru dostupný levně — proto `HIGH`, ne `MID`. V `MID` sestavě by byla zbytečně drahá a v `HIGH` zbytečně pomalá pro 1440p/60 fps v novějších titulech; hraniční případ. |

## MIMO ROZSAH

| Model | Rozhraní / rozměr | Tier | Zdůvodnění |
| --- | --- | --- | --- |
| NVIDIA GeForce GT 730 / GT 740, AMD Radeon HD 6450 / 7770 | PCIe x16, jedno- až dvouslotové | `MIMO ROZSAH` | Nemají výkon ani pro `LOW`; hrají jen starší kancelářské hry a v bazaru se prodávají za cenu, za kterou se koupí lepší IGPU v celé sestavě. |
| NVIDIA GeForce RTX 3070 / 3080 / 3090 / 40 řada vyšší, AMD Radeon RX 6800 a vyšší | PCIe x16, dvou- až čtyřslotové, napájení 2x/3x 8 pin | `MIMO ROZSAH` | Výkonnější než `HIGH`; marže a ceny nad `HIGH` se nepočítají, ale až toto je horní hranice sortimentu, kde se to ještě obchodně zvládne. |
| Notebookové karty, OEM grafiky z bazarových notebooků | různé | `MIMO ROZSAH` | Sortiment je pouze desktop tower; karta vyjmutá z notebooku není smluvně použitelný díl pro naši sestavu. |

## Jak s tabulkou pracovat

1. Před nákupem najdi **konkrétní model** včetně varianty paměti (2 GB / 4 GB,
   GDDR5 / GDDR6, 2048SP). V bazaru to rozhoduje mezi `MID` a `MIMO ROZSAH`.
2. U karty bez napájecího kabelu ověř, že zdroj v sestavě má rezervu — minimum
   `HIGH` je 550–750 W, viz [40-tier-definice.md](40-tier-definice.md).
3. Řádek bez tieru nebo bez zdůvodnění je chyba — doplň ho dřív, než se podle
   něj rozhoduješ o koupi.
4. Karta mimo tabulku se do sortimentu nekupuje. Když narazíš na výjimku, která
   sem patří, doplň řádek a poznamenej odkud.
5. Při posunu karty mezi tiery uprav zároveň
   [44-referencni-sestavy.md](44-referencni-sestavy.md) a
   [43-cenove-pasmo.md](43-cenove-pasmo.md).

TODO: doplnit reálné nákupní ceny a množství kusů na skladě — zdroj: tabulka Sklad
v Google Sheets po prvním nákupním cyklu.

TODO: doplnit spotřebu jednotlivých karet ve wattech — zdroj: oficiální specifikace
výrobce k danému modelu. Spotřeba se použije do volby zdroje podle
[51-kompatibilita.md](../50-sestavovani/51-kompatibilita.md).
