# FLIPCORE

Dokumentace podniku FLIPCORE, který nakupuje bazarové PC komponenty, čistí je, testuje a skládá z nich hotové desktopové tower sestavy prodávané koncovým zákazníkům.

## Kde začít

- [docs/00-uvod-a-glosar.md](docs/00-uvod-a-glosar.md) — chceš porozumět, o co jde, a co v dokumentaci znamenají pojmy jako sestava, díl nebo tier.
- [docs/01-obchodni-model.md](docs/01-obchodni-model.md) — chceš pochopit, komu se prodává a jak se počítá marže.
- [docs/40-tiery/40-tier-definice.md](docs/40-tiery/40-tier-definice.md) — chceš vědět, co je LOW, MID a HIGH a podle čeho se sestavě tier přiřadí.
- [docs/70-finance/71-kalkulace-marze.md](docs/70-finance/71-kalkulace-marze.md) — chceš spočítat cenu hotové sestavy.

## Tři tiery v kostce

| Tier | Pro koho | Co musí splňovat | Záruka |
| --- | --- | --- | --- |
| `LOW` | kancelář, škola, stážista | min. 8 GB RAM a SSD 240 GB, prodává se bez Windows | 3 M |
| `MID` | hráč 1080p / 60 fps | min. 16 GB RAM a SSD 480 GB | 6 M |
| `HIGH` | hráč 1440p, práce s videem a 3D | min. 32 GB RAM, NVMe 1 TB, zdroj 550–750 W, Windows 11 nativně | 12 M |

Dvě pravidla, která k tomu patří:

1. **Tier sestavy je maximum z tieru CPU a tieru GPU**, tedy `tier = max(CPU, GPU)`. Samotné CPU ani samotná GPU tier neurčuje — rozhoduje silnější z obou.
2. **Tier se určuje podle konkrétního modelu, nikoli podle generace.** Model se hledá v referenčních tabulkách [41-cpu-tabulka.md](docs/40-tiery/41-cpu-tabulka.md) a [42-gpu-tabulka.md](docs/40-tiery/42-gpu-tabulka.md).

U `HIGH` je důležitá výjimka: Windows 11 nativně není automaticky součástí každého kusu. Intel 9. generace fTPM nemá a potřebuje samostatný modul TPM 2.0, stejně jako Intel 8. generace — podrobnosti v [40-tier-definice.md](docs/40-tiery/40-tier-definice.md).

## Mapa dokumentace

Číslovka v názvu souboru určuje pořadí čtení: od `00` a `01` přes náku a příjem až po prodej a finance.

| Blok | Obsah | Soubory |
| --- | --- | --- |
| Úvod | O co jde, pojmy, obchodní model | [00-uvod-a-glosar.md](docs/00-uvod-a-glosar.md), [01-obchodni-model.md](docs/01-obchodni-model.md) |
| Nákup | Kde nakupujeme, jak prověřujeme kus, kolik maximálně dáme, čeho se vyvarovat | [10-kanaly.md](docs/10-nakup/10-kanaly.md), [11-due-diligence.md](docs/10-nakup/11-due-diligence.md), [12-max-ceny.md](docs/10-nakup/12-max-ceny.md), [13-pasti-a-podvody.md](docs/10-nakup/13-pasti-a-podvody.md) |
| Příjem a sklad | Příjemka s ID, čištění a údržba, skladování | [21-prijemka.md](docs/20-prijem-a-sklad/21-prijemka.md), [22-cipovani-a-cisteni.md](docs/20-prijem-a-sklad/22-cipovani-a-cisteni.md), [23-skladovani.md](docs/20-prijem-a-sklad/23-skladovani.md) |
| Testování a evidence | Jak se testuje, co se zapisuje | [31-testovaci-protokoly.md](docs/30-testovani-a-evidence/31-testovaci-protokoly.md), [32-evidence-komponent.md](docs/30-testovani-a-evidence/32-evidence-komponent.md) |
| Tiery | Definice tieru, tabulky CPU a GPU, cenové pásmo, referenční sestavy | [40-tier-definice.md](docs/40-tiery/40-tier-definice.md), [41-cpu-tabulka.md](docs/40-tiery/41-cpu-tabulka.md), [42-gpu-tabulka.md](docs/40-tiery/42-gpu-tabulka.md), [43-cenove-pasmo.md](docs/40-tiery/43-cenove-pasmo.md), [44-referencni-sestavy.md](docs/40-tiery/44-referencni-sestavy.md) |
| Sestavování | Kompatibilita dílů | [51-kompatibilita.md](docs/50-sestavovani/51-kompatibilita.md) |
| Prodej | Prodejní kanály, šablona inzerátu, prodejní podmínky | [61-prodejni-kanaly.md](docs/60-prodej/61-prodejni-kanaly.md), [62-sablona-inzeratu.md](docs/60-prodej/62-sablona-inzeratu.md), [64-prodejni-podminky.md](docs/60-prodej/64-prodejni-podminky.md) |
| Finance | Kalkulace marže, peněžní tok, rozpočet a bod zvratu | [71-kalkulace-marze.md](docs/70-finance/71-kalkulace-marze.md), [72-cashflow.md](docs/70-finance/72-cashflow.md), [73-rozpocet-a-break-even.md](docs/70-finance/73-rozpocet-a-break-even.md) |
| Reporting | Týdenní report | [81-weekni-report.md](docs/80-reporting/81-weekni-report.md) |
| Šablony | Vyplňované papíry pro příjem, test, inzerát, odmítnutí a reklamaci | [prijemka.md](templates/prijemka.md), [test-protokol.md](templates/test-protokol.md), [inzerat.md](templates/inzerat.md), [odmitnuti-nakupu.md](templates/odmitnuti-nakupu.md), [reklamace.md](templates/reklamace.md) |

## Kde žijí data

Markdown v repu jsou procesy a pravidla: mění se zřídka, a proto mají být dohledatelná v historii změn. Živá evidence — sklad, sestavy, testy, reklamace a marže — je v Google Sheets, protože se mění denně, potřebuje filtrovat a sčítat a do gitu nepatří. Struktura tabulek a vazby mezi nimi jsou popsané v [32-evidence-komponent.md](docs/30-testovani-a-evidence/32-evidence-komponent.md).

## Jazyk

Dokumentace je česká a píše se bez anglicismů, kde existuje český ekvivalent. Označení `LOW`, `MID` a `HIGH` jsou anglické zkratky a zůstávají, protože se používají jako technický label i v evidenci.

Repo je dokumentační a neobsahuje žádný kód; pravidla pro práci v něm jsou v [AGENTS.md](AGENTS.md).
