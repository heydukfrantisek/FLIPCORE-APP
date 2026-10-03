# Cenové pásmo a minimální marže podle tieru

**Účel:** Říká, za jakou cenu se má sestava prodávat a při jaké marži se má daný kus vůbec skládat.

> **Všechny ceny v tomto dokumentu jsou odhady** z bazarového trhu (říjen 2026)
> a slouží jako pracovní rámec, ne jako údaj, který se smí citovat zákazníkovi.
> Reálné ceny se doplní z prvních prodejů. Marže v tabulce je obchodní rozhodnutí,
> ne tržní údaj.

## Výchozí tržní pozorování (odhad)

Pozorování z českého trhu, na kterých pásmo stojí. Slouží jen jako argument, proč
pásmo vypadá, jak vypadá.

| Pozorování (odhad) | Co z něj plyne pro naše pásmo |
| --- | --- |
| Repasované kancelářské sestavy se v bazarových e-shopech prodávají do ~10 000 Kč | `LOW` musí být výrazně levnější, jinak o něm nemá smysl mluvit zvlášť |
| Herní základ v bazarových inzerátech leží mezi 13 000 a 20 000 Kč (např. Ryzen 5 4500 nebo Ryzen 5 3600 s RX 470, resp. s GTX 1660) | To je `MID`, a musí se prodat levněji než bazarový kus, jinak nemá kdo kupovat |
| Výkonnější sestavy se pohybují od 20 000 do 30 000 a více Kč | To je `HIGH`; jeho dolní hranice nesmí splynout s horní hranicí `MID` |
| Bazoš, odhad: Ryzen 5 3600 s RTX 3060 Ti ~16 000 Kč, Ryzen 5 5500 s RX 6700 XT ~16 000 – 20 000 Kč, Core i5-8600K s GTX 1080 ~11 000 Kč | Odhady pro kontrolu: náš hotový kus s testy a zárukou musí stát méně než bazarový rozebraný, jinak ho zákazník nevezme. Všem třem konfiguracím ale podle `max(CPU, GPU)` vychází `HIGH` — Ryzen 5 3600 je `MID`, ale RTX 3060 Ti i GTX 1080 jsou `HIGH` |
| Repasované sestavy v bazarových e-shopech jdou běžně se zárukou 12–24 M a s Windows 11 Pro | Je to náš cenový rámec. Naše kratší záruky (3/6/12 M) a prodávané bez OS musí být v textu inzerátu jasně vidět, jinak budeme dražší než konkurence |

Odhady výše **nejsou ověřený údaj**. TODO: ověřit a doplnit aktuální bazarové ceny
u desky konkrétních sestav — zdroj: export z Bazoše a z inzerce.cz ke dni odběru,
s uvedeným datem.

## Cílové prodejní pásmo a minimální marže

| Tier | Prodejní label | Cílové pásmo (odhad) | Min. marže | Záruka | Co do pásma patří |
| --- | --- | --- | --- | --- | --- |
| `LOW` | `KANCELÁŘSKÁ` | 3 000 – 8 000 Kč | 30 % | 3 M | Kancelářské sestavy, sestavy s Core i3 gen 4–6 a Core i5 gen 4–5, Ryzen 3 1200, Athlon 3000G/3200G, FX-4300/6300; sestavy s AMD APU nebo iGPU; typicky s GT 1030 nebo RX 550 |
| `MID` | `HERNÍ` | 9 000 – 16 000 Kč | 25 % | 6 M | Core i5/i7 gen 6–8, Ryzen 5 1600/2600/3600/4500, Ryzen 7 1700/2700X, FX-8300/9700 s GPU `MID` (GTX 1050 Ti až 1660, RX 470 až 590) |
| `HIGH` | `VÝKONNÁ` | 18 000 – 30 000 Kč | 20 % | 12 M | Intel gen 9–14 a Ryzen 5000/7000 s GPU `HIGH` (GTX 1080/1080 Ti, RTX 2060, RTX 2060 SUPER, RTX 2070 SUPER, RTX 3060, RTX 3060 Ti, RTX 4060, RX 6600, RX 6700 XT, RX 6750 XT, RX 7600) |

Proč jsou marže různé:

- `LOW` má absolutně nejmenší zisk z kusu. 30 % chrání, aby se skládání a čištění
  neoplatilo vůbec — je lepší kus odmítnout než prodát bez marže.
- `MID` nese hlavní objem. 25 % stále kryje čas na čištění, testy a záruční
  rezervu.
- `HIGH` má velký zisk v korunách i při nejnižším procentu, ale zároveň největší
  riziko reklamace v korunách. 20 % je podíl, který ještě snese záruční rezervu.

Marže se počítá z **celkových nákladů na kus**, ne z nákupní ceny dílů:

```text
náklady = nákupní cena dílů
        + doprava a poštovné
        + čištění a materiál (termopasta, stříbro, lepidlo, barva)
        + čas na testování a sestavení
        + záruční rezerva dle tieru (3 / 6 / 12 M)
        + poplatky prodejního kanálu
        + odpis a riziko vadného dílu
```

Výpočet a co se do nákladů započítává je v
[71-kalkulace-marze.md](../70-finance/71-kalkulace-marze.md).

## Pásmo proti bazarovému trhu — pravidlo

Repasovaná sestava s testy, zárukou a odpovědností musí být **levnější než
rozebraný bazarový kus se stejnou konfigurací**, jinak zákazník nemá důvod
kupovat u nás.

| Sestava | Odhad ceny bazarového rozebraného kusu (odhad) | Mezní cena naše hotové sestavy |
| --- | --- | --- |
| `HIGH`, Core i5-8600K s GTX 1080 | ~11 000 Kč | tuto konfiguraci nekupuj: pásmo `HIGH` začíná na 18 000 Kč, ale bazarový rozebraný kus je levnější. GTX 1080 patří do `HIGH`, ne do `MID`, takže tohle není levný herní základ |
| `HIGH`, Ryzen 5 3600 s RTX 3060 Ti | ~16 000 Kč | 18 000 – 19 000 Kč, tedy u dolní hranice pásma `HIGH`; kupovat jen tehdy, když na kusu vyjde marže nad 20 %, jinak raději výkonnější CPU do `HIGH` sestavy |
| `HIGH`, Ryzen 5 5500 s RX 6700 XT | ~16 000 – 20 000 Kč | pod 16 000 Kč, jinak raději koupit RX 6600 do vlastní `HIGH` sestavy |

Tyto tři řádky jsou **odhady z jednoho pozorování**, ne tržní statistika. Slouží
jako upozornění, že pásmo musí zkontrolovat proti aktuálním inzerátům při každém
nákupu. Konkrétní ceny jsou v [12-max-ceny.md](../10-nakup/12-max-ceny.md).
Všem třem konfiguracím podle `max(CPU, GPU)` připadá `HIGH`, proto se mezní ceny
řídí pásmem `HIGH`, ne `MID`.

## Rozhodovací tabulka při nákupu

| Stav | Akce |
| --- | --- |
| Očekávaná marže nad minimem daného tieru | Kup. |
| Očekávaná marže pod minimem daného tieru, ale nad minimem o tier níž | Kup jen jako sestavu nižšího tieru — dohodni se před nákupem, ne po. |
| Očekávaná marže pod minimem jakéhokoli tieru | Nekup. Napiš odmítnutí podle zásad v [11-due-diligence.md](../10-nakup/11-due-diligence.md). |
| Cena vychází nad horní hranici pásma daného tieru | Nekup tenhle kus. Hledej jiný zdroj nebo jinou konfiguraci. |

## Checklist ceny před zveřejněním

- [ ] Sestava má přiřazený tier podle
      [40-tier-definice.md](40-tier-definice.md).
- [ ] Tier má vlastní záruku (3 / 6 / 12 M) a ta je napsaná do
      [64-prodejni-podminky.md](../60-prodej/64-prodejni-podminky.md).
- [ ] Spočteny celkové náklady včetně záruční rezervy a poplatků kanálu.
- [ ] Marže nad minimem daného tieru.
- [ ] Cena leží v cílovém pásmu daného tieru.
- [ ] Cena je nižší než rozebraný bazarový kus se stejnou konfigurací.
- [ ] U `LOW` a `MID` je v textu inzerátu jasně uvedeno, že se prodává bez OS.
- [ ] U `HIGH` je rozhodnuto, zda se dává Windows 11 (klíč OEM převedený od
      bazaristy, nebo bez OS).
- [ ] Zapsáno do evidence sestavy: tier, náklady, prodejní cena, marže.
- [ ] Po prodeji doplněna skutečná prodejní cena — to zpřesní pásmo příštího
      nákupu.

TODO: doplnit skutečné prodejní ceny a marže z prvních prodejů — zdroj: tabulka
Sestavy v Google Sheets (sloupce celkové náklady, prodejní cena, marže). Po 20
prodejích na tier přepočítat pásmo a minimální marži z reálných dat.

TODO: doplnit výši záruční rezervy v korunách na tier — zdroj: tabulka Reklamace v
Google Sheets, průměrný náklad na reklamaci podle tieru.

TODO: doplnit poplatky prodejních kanálů — zdroj: zúčtování Aukro, Bazoš,
Facebook Marketplace.
