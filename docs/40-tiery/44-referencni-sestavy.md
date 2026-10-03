# Referenční sestavy — vzor skládání na každý tier

**Účel:** Ukazuje, jak má hotová sestava na každý tier vypadat, aby splnila minimum tieru a dala smysl daný prodejní label.

Seznam je **vzor**, ne seznam ke koupi. Konkrétní kus vybírá se podle
[12-max-ceny.md](../10-nakup/12-max-ceny.md) a dostupnosti na
[Bazoši, v bazaru a na Facebook Marketplace](../10-nakup/10-kanaly.md).

Pravidla tieru jsou v [40-tier-definice.md](40-tier-definice.md). Každá sestava
musí splnit minimum z tohoto dokumentu, jinak na daný tier nepatří.

Ceny u sestav jsou záměrně prázdné — dokud nejsou reálné nákupní ceny,
kalkulace marže je vymyšlená
([71-kalkulace-marze.md](../70-finance/71-kalkulace-marze.md)).

## Jak s referenční sestavou pracovat

1. Zkopíruj si tabulku komponent jako předlohu.
2. Nahraď každou položku skutečným kusem ze skladu, který má vlastní ID.
3. Zkontroluj kompatibilitu podle
   [51-kompatibilita.md](../50-sestavovani/51-kompatibilita.md) — socket, typ
   paměti, verze BIOSu, výkon zdroje.
4. Spočítej náklady a marži podle
   [43-cenove-pasmo.md](43-cenove-pasmo.md). Marže pod minimem daného tieru znamená,
   že sestava není skládat.
5. Otestuj podle
   [31-testovaci-protokoly.md](../30-testovani-a-evidence/31-testovaci-protokoly.md).
6. Zapiš sestavu do evidence sestavy a do listu Sklad.

Zkontrolovat musíš u každé sestavy, že sedí všechna tato pravidla:

- [ ] Socket CPU sedí se socketem desky.
- [ ] Generace a typ paměti sedí s deskou (DDR3 / DDR4 / DDR5).
- [ ] Sestava splňuje minimum tieru (RAM, disk, u `HIGH` i zdroj).
- [ ] Napájení GPU a příkon sestavy sedí do výkonu zdroje.
- [ ] Chlazení stačí na CPU podle jeho TDP.
- [ ] Karta se vejde do skříně — u dvouslotových karet počítej s místem na
      přívod vzduchu.
- [ ] Stopy po testu, teploty a výsledky jsou zapsané v evidenci.

---

## `LOW` — KANCELÁŘSKÁ

Office, e-mail, prohlížeč, videohovory, Office 365. **Prodává se bez Windows.**

Minimum: 8 GB RAM, SSD 240 GB.

### `LOW-1` — Intel 4. generace (nejlevnější bazarová opce)

| Položka | Komponenta | Proč právě tohle |
| --- | --- | --- |
| CPU | Intel Core i5-4570 (LGA 1150) | Pět jader a Turbo 3,3 GHz; kancelářské úlohy i více oken prohlížeče bez potíží, v bazaru nejlevnější použitelný procesor |
| GPU | Intel HD Graphics 4600 (iGPU v CPU) | Stačí na jeden monitor a video; karta se neprodává, zákazník ji nepotřebuje |
| MB | LGA 1150, čipset H81 nebo B85 (např. ASRock H81M, MSI B85M) | Levné a v bazaru hojné; oba čipsety mají 2 sloty DIMM a SATA III pro SSD |
| RAM | 8 GB DDR3 (2x4 GB) dvoukanálově | Splňuje minimum; dvoukanálový běh je pro kancelářský souběžný provoz příjemný |
| Disk | SSD 240 GB SATA III | Splňuje minimum. SATA III, ne NVMe — u `LOW` je rychlost systému důležitější než kapacita |
| Zdroj | 250 W | Pro i5-4570 s iGPU stačí s rezervou; bazarové 250 W zdroje jsou nejlevnější a obvykle v dobrém stavu |
| Skříň | Kancelářská micro-ATX bedýnka s předním panelem | Malý rozměr do kanceláře; nepoužívej velký tower, zbytečně zvedá hmotnost zásilky |
| Chlazení | Originální chladič z výrobního balení Intel | Vyhovuje; nový chladič v `LOW` není potřeba a zbytečně zvyšuje náklady |

OS: Intel 4. generace nemá TPM 2.0 → **bez OS**. Záruka 3 M.

### `LOW-2` — AMD AM4 (nejmenší spotřeba)

| Položka | Komponenta | Proč právě tohle |
| --- | --- | --- |
| CPU | AMD Athlon 3200G (AM4) | APU s integrovanou grafikou — stačí na kancelář a video, má nízkou spotřebu |
| GPU | Integrovaná Radeon Vega 3 v CPU; samostatná grafická karta není potřeba | Součást Athlonu 3200G; na kancelář, video a jeden monitor stačí, karta se neprodává |
| MB | AM4, čipset A320 nebo B450 (např. Gigabyte B450M DS3H) | B450 umí 8 GB i 16 GB a levnější A320 umí jen 2 sloty; pro `LOW` s jedním modulem stačí obojí |
| RAM | 8 GB DDR4 (1x8 GB nebo 2x4 GB) | Splňuje minimum; u této platformy 1x8 GB stačí a nechá slot na pozdější doplnění |
| Disk | SSD 240 GB SATA III | Splňuje minimum |
| Zdroj | 300 W | IGPU nezatěžuje zdroj; 300 W je levný a nad hranicí potřeby |
| Skříň | Micro-ATX bedýnka | Kancelářské umístění |
| Chlazení | Originální chladič AMD z výrobního balení (Wraith Stealth) | Vyhovuje; AMD klade důraz na součásti v balení |

OS: Ryzen 3000 nemá fTPM → **bez OS**. Záruka 3 M.

### `LOW-3` — Intel 6. generace s levnou kartou

| Položka | Komponenta | Proč právě tohle |
| --- | --- | --- |
| CPU | Intel Core i3-6100 (LGA 1151) | Dvě jádra s hyperthreadingem; v `LOW` sestavě dostačující, slabší než i5-4570, proto levnější |
| GPU | NVIDIA GeForce GT 1030 GDDR5 (bez napájecího kabelu) | Jediný důvod mít v `LOW` samostatnou kartu: druhý monitor nebo video; v tabulce je `LOW`, ne `MID` |
| MB | LGA 1151, čipset H110 nebo B250 | I3-6100 nepotřebuje dražší čipset; H110 i B250 mají SATA III pro SSD |
| RAM | 8 GB DDR4 | Splňuje minimum |
| Disk | SSD 240 GB SATA III | Splňuje minimum |
| Zdroj | 350 W | GT 1030 bez napájecího kabelu potřebuje rezervu, 300 W by byl na samé hranici |
| Skříň | Micro-ATX bedýnka | Kancelářské umístění |
| Chlazení | Originální chladič z výrobního balení Intel | Vyhovuje |

OS: 6. generace nemá TPM 2.0 → **bez OS**. Záruka 3 M.

---

## `MID` — HERNÍ

1080p hraní na starší a esports tituly, GTA V, Valorant, CS2 na střední nastavení.
Univerzální domácí PC.

Minimum: 16 GB RAM, SSD 480 GB. Prodává se **bez OS**, s OEM klíčem od bazaristy,
nebo — na 8. generaci — s modulem TPM 2.0.

### `MID-1` — Intel 8. generace, jediná cesta k Windows 11 v `MID`

| Položka | Komponenta | Proč právě tohle |
| --- | --- | --- |
| CPU | Intel Core i5-8600 (LGA 1151) | Šest jader Coffee Lake; v bazaru nejčastější `MID` procesor a nejstabilnější 1080p/60 fps v titulech `MID` |
| GPU | NVIDIA GeForce GTX 1650 (6 GB) | Nejslabší Turing, ale hratelný na 1080p; levnější než 1660 a v této sestavě dostačující |
| MB | LGA 1151, čipset B250 nebo H270 (např. MSI B250M Mortar, Gigabyte H270M-DS3V) | Oba mají 4 sloty DIMM a SATA III; B250 bývá v bazaru levnější |
| RAM | 16 GB DDR4 (2x8 GB) | Splňuje minimum; dva moduly kvůli dvoukanálovému běhu |
| Disk | SSD 480 GB SATA III | Splňuje minimum |
| Zdroj | 400 – 450 W | GTX 1650 s variantou GDDR5 bez napájecího kabelu vystačí; na GDDR6 verzi počítej s 6 pin |
| Skříň | Micro-ATX bedýnka s předním intake | Do obývacího pokoje, ne na kancelářský stůl |
| Chlazení | Originální chladič z výrobního balení Intel | i5-8600 vystačí s originálním chladičem ve skříni s dostatečným průchodem vzduchu |

OS: 8. generace typicky nemá TPM 2.0. Buď **bez OS**, nebo **s modulem TPM 2.0**
(cena stovky Kč) a ověřeným OEM klíčem. Záruka 6 M.

### `MID-2` — AMD Zen 2, nejlepší výkon za korunu

| Položka | Komponenta | Proč právě tohle |
| --- | --- | --- |
| CPU | AMD Ryzen 5 3600 (AM4) | Šest jader Zen 2; v hrách převyšuje Intel 6.–8. generaci stejné ceny, proto nejlepší herní základ v `MID` |
| GPU | AMD Radeon RX 580 2048SP (8 GB) | Nejprodávanější bazarová karta na českém trhu; levná a v bazaru dostupná prakticky všude |
| MB | AM4, čipset B450 nebo B550 (např. Gigabyte B450M DS3H, MSI B550M Pro-VDH) | B450 stačí pro Ryzen 3600; B550 má výhodnější ceny na bazaru i silnější napájecí fázi |
| RAM | 16 GB DDR4 (2x8 GB) | Splňuje minimum |
| Disk | SSD 480 GB SATA III | Splňuje minimum. NVMe zde nepřinese zákazníkovi viditelný rozdíl |
| Zdroj | 500 W | RX 580 má 6 pin a reálně žere víc, než hlásí bazarové inzeráty; 450 W je pod hranicí |
| Skříň | Micro-ATX bedýnka s předním intake | Sesterská karta potřebuje chlazení, nepropojovat ji bez volného místa |
| Chlazení | Originální Wraith Stealth v balení | Ryzen 5 3600 je v balení; nový chladič zbytečně zvyšuje náklady |

OS: Ryzen 3000 nemá fTPM → **bez OS** (nebo OEM klíč převedený od bazaristy).
Záruka 6 M.

### `MID-3` — Intel 7. generace, nejlevnější plnohodnotná `MID`

| Položka | Komponenta | Proč právě tohle |
| --- | --- | --- |
| CPU | Intel Core i7-7700 (LGA 1151) | Nejvychovanější 7. generace; osm jader se využije při práci s více programy, v hrách je to rezerva |
| GPU | NVIDIA GeForce GTX 1060 (6 GB) | Nejvyšší model řady 1000 a nejčastější bazarová karta pro `MID`; 6 GB je nutnost pro současné tituly |
| MB | LGA 1151, čipset H270 nebo Z270 (např. Gigabyte H270M-DS3V) | H110/B250 nepodporuje plné možnosti 7. generace, ale na hraní nejsou potřeba; H270 je v bazaru běžný |
| RAM | 16 GB DDR4 (2x8 GB) | Splňuje minimum |
| Disk | SSD 480 GB SATA III | Splňuje minimum |
| Zdroj | 500 W | GTX 1060 má 6 pin a v `MID` sestavě počítej s plným využitím karty |
| Skříň | Micro-ATX bedýnka s předním intake | Do obývacího pokoje |
| Chlazení | Originální chladič z výrobního balení Intel | i7-7700 vystačí s originálním chladičem; v zavřené kancelářské skříni ale pozor na teploty |

OS: 7. generace nemá TPM 2.0 → **bez OS**. Záruka 6 M.

---

## `HIGH` — VÝKONNÁ

Práce s videem a 3D, herní a pracovní úlohy vyžadující vyšší výkon, budoucí-proof.
`1440p` se píše do inzerátu až po vlastním měření.

Windows 11 je u `HIGH` možné, ale **není automaticky součástí každého kusu** —
rozhoduje CPU: Ryzen 5000+ a Intel 10.–14. gen mají fTPM či PTT zabudované,
Intel 9. generace potřebuje samostatný modul TPM 2.0.

Minimum: 32 GB RAM, NVMe 1 TB, zdroj 550–750 W.

### `HIGH-1` — Ryzen 5000 s fTPM, cesta do `HIGH` s Windows 11 bez zásahu

| Položka | Komponenta | Proč právě tohle |
| --- | --- | --- |
| CPU | AMD Ryzen 5 5600 (AM4) | Zen 3, šest jader: Ryzen 5 s fTPM, tedy Windows 11 bez zásahu; v bazaru běžně zastoupený `HIGH` procesor |
| GPU | NVIDIA GeForce RTX 3060 (12 GB) | Nejžádanější karta pro `HIGH`; 12 GB paměti a výkon na 1440p |
| MB | AM4, čipset B550 (např. MSI B550M Pro-VDH, Gigabyte B550M DS3H) | B550 podporuje PCIe 4.0 pro NVMe a Ryzen 5000; navíc pořizovací cena nízká |
| RAM | 32 GB DDR4 (2x16 GB) | Splňuje minimum; dva moduly kvůli dvoukanálovému běhu |
| Disk | NVMe 1 TB (PCIe 3.0 stačí) | Splňuje minimum; NVMe je v tomto bodě skutečně poznat na startu a v práci s videem |
| Zdroj | 550 W | Splňuje minimum `HIGH`; RTX 3060 má 8 pin a 550 W má rezervu |
| Skříň | ATX bedýnka s předním intake a průduchem pro délku karty | Sestava má hmotnost i rozměr, do malé kancelářské skříně se nevejde |
| Chlazení | Chladič z výrobního balení nebo věžový chladič třetího výrobce | Zen 3 v balení stačí; věžový chladič jen pokud chceš odstup od montáže |

OS: fTPM zabudovaný → **Windows 11 nativně**. Záruka 12 M.

### `HIGH-2` — Ryzen 5000, výkon za méně než RTX 3060

| Položka | Komponenta | Proč právě tohle |
| --- | --- | --- |
| CPU | AMD Ryzen 7 5800X (AM4) | Zen 3, osm jader; výrazně lepší v práci s videem než 5600, v hrách rozdíl malý — dovolí osadit levnější kartu |
| GPU | AMD Radeon RX 6600 (8 GB) | Nejlevnější karta pro `HIGH`; 8 GB paměti a nízká spotřeba — s Ryzen 7 5800X dává 1440p bez utrácení marže |
| MB | AM4, čipset B550 | Stejné zdůvodnění jako `HIGH-1`; B550 zvládne NVMe i Ryzen 5000 |
| RAM | 32 GB DDR4 (2x16 GB) | Splňuje minimum |
| Disk | NVMe 1 TB (PCIe 3.0 stačí) | Splňuje minimum |
| Zdroj | 550 W | Splňuje minimum; RX 6600 má nízkou spotřebu, 550 W je rezerva |
| Skříň | ATX bedýnka s předním intake | Sestava má hmotnost i rozměr |
| Chlazení | Věžový chladič třetího výrobce nebo chladič z výrobního balení | 5800X se prodává s použitelným chladičem v balení; před vystavením přesto zkontroluj teploty podle [31-testovaci-protokoly.md](../30-testovani-a-evidence/31-testovaci-protokoly.md) |

OS: fTPM zabudovaný → **Windows 11 nativně**. Záruka 12 M.

### `HIGH-3` — Intel 12. generace, nejnovejší plocha v sortimentu

| Položka | Komponenta | Proč právě tohle |
| --- | --- | --- |
| CPU | Intel Core i5-12400 (LGA 1700) | Alder Lake, šest jader; nejnižší Core i5, který podporuje Windows 11 bez zásahu |
| GPU | NVIDIA GeForce RTX 4060 (8 GB) | Nejúspornější karta sortimentu; do této sestavy se vejde i do menší skříně |
| MB | LGA 1700, čipset B660 nebo H610 (např. MSI PRO B660M-A, Gigabyte H610M K) | Alder Lake nepotřebuje drahý čipset; H610 stačí, pokud neplánuješ přetaktovat |
| RAM | 32 GB DDR5 (2x16 GB) | Splňuje minimum. Pozor: DDR5, ne DDR4 — s DDR4 deska nenabootuje, viz [51-kompatibilita.md](../50-sestavovani/51-kompatibilita.md) |
| Disk | NVMe 1 TB | Splňuje minimum; Alder Lake má i čtvrtou generaci PCIe, ale rozdíl proti PCIe 3.0 v této sestavě neprocítíš |
| Zdroj | 550 W | Splňuje minimum; RTX 4060 má nízkou spotřebu |
| Skříň | ATX bedýnka s předním intake | Sestava má hmotnost i rozměr |
| Chlazení | Chladič z výrobního balení | Alder Lake se v balení prodává s použitelným chladičem |

OS: TPM 2.0 podporováno → **Windows 11 nativně**. Záruka 12 M.

---

## Hranice sortimentu

| Uvažované rozšíření | Proč ne | Kde se to řeší |
| --- | --- | --- |
| GPU výkonnější než `HIGH` (RTX 3070 a výše, RX 6800 a výše) | Výpočet marže nad `HIGH` není v plánu; odhady cen do řádu | `MIMO ROZSAH` v [42-gpu-tabulka.md](42-gpu-tabulka.md) |
| CPU novější než Intel 14. generace a Ryzen 7000 | Totéž | `MIMO ROZSAH` v [41-cpu-tabulka.md](41-cpu-tabulka.md) |
| Windows 11 v `LOW` a `MID` bez TPM 2.0 | Nikdy neoriginální klíč, nikdy bypass TPM | [40-tier-definice.md](40-tier-definice.md) |
| B2B prodej, pronájem, servisní zakázky | Sortiment je pouze desktop tower a pouze B2C | [01-obchodni-model.md](../01-obchodni-model.md) |
| Notebooky, AIO, Mini-PC, konzole | Totéž | [00-uvod-a-glosar.md](../00-uvod-a-glosar.md) |

TODO: doplnit ceny všech komponent u všech devíti sestav — zdroj: tabulka Sklad v
Google Sheets s nákupními cenami jednotlivých kusů.

TODO: doplnit výsledné prodejní ceny a marže u všech devíti sestav — zdroj:
tabulka Sestavy v Google Sheets po prvním prodeji. Do té doby je
[43-cenove-pasmo.md](43-cenove-pasmo.md) odhad.

TODO: ověřit, zda RX 6600 s Ryzen 7 5800X drží v `HIGH` sestavě cílové pásmo
18 000 – 30 000 Kč — zdroj: kalkulace marže podle
[71-kalkulace-marze.md](../70-finance/71-kalkulace-marze.md) na skutečném
nákupu.
