# Šablona prodejního inzerátu

**Účel:** Textová šablona prodejního inzerátu B2C — sestavený z ověřené sestavy, s laickým názvem, upřímně o bazarovém stavu a s jasnými údaji o záruce a OS.

**Jak vyplnit:**

- Zkopíruj šablonu do kopie `inzerat-<ID_sestavy>.md` a vyplňuj pouze kopii; do inzerátu zkopíruj až hotové bloky.
- `ID sestavy` a tier dosaď z testovacího protokolu; specifikace a stavy musí odpovídat tomu, co bylo skutečně změřeno.
- Cenu doplň podle cenového pásma pro daný tier, ne odhadem.
- Všechna upozornění (bazarové zboží, prodej bez Windows, záruka) ponech v textu inzerátu — nejsou volitelná.

## Titulek inzerátu

Vyber jednu z variant podle zamýšleného výkonu sestavy:

| Tier | Titulek (laický pojem) |
| --- | --- |
| LOW | `Kancelářský počítač FLIPCORE` |
| MID | `Herní počítač FLIPCORE 1080p` |
| HIGH | `Výkonný počítač FLIPCORE` |
| Varianta pro kancelář / práci s dokumenty | `<např. Kancelářský počítač FLIPCORE — tichý, úsporný>` |
| Varianta pro hraní | `<např. Herní počítač FLIPCORE — hraní ve 1080p>` |

> **Titulek `HIGH` se bez vlastního měření nerozšiřuje o rozlišení.** Sestava může být
> `HIGH` podle `max(tier(CPU), tier(GPU))` — tedy mít silný procesor *nebo* silnou grafickou
> kartu — a přesto na 1440p nezahraje, protože hraní táhne grafická karta. Zápis `1440p`
> se proto doplní **až po vlastním měření** zapsaném v test protokolu; bez něj zůstává
> titulek `Výkonný počítač FLIPCORE`. Viz
> [`../docs/60-prodej/62-sablona-inzeratu.md`](../docs/60-prodej/62-sablona-inzeratu.md).

**Proč laický pojem:** Zákazník hledá počítač podle toho, co s ním chce dělat — psát, koukat na video nebo hrát. Označení `LOW / MID / HIGH` je interní a zákazníka neříká nic. Titulek zní jako to, co zákazník kupuje; tier se uvádí až v detailu inzerátu nebo v komunikaci.

## Hlavička inzerátu (první 2–3 řádky)

Toto se zobrazí v seznamu inzerátů — nejdůležitější je, co prodávám a v jakém stavu:

```text
<např. Herní počítač FLIPCORE 1080p — sestavený z bazarových dílů, plně otestovaný.>
<např. Slouží na hraní ve Full HD a práci s videem. Bez Windows (OS řeší zákazník).>
<např. Záruka FLIPCORE __ měsíců. Možné osobní vyzkoušení na místě.>
```

- Řádek 1 — co to je a odkud jsou díly
- Řádek 2 — k čemu to slouží + co není součástí
- Řádek 3 — záruka a možnost vyzkoušení

## Specifikace

| Položka | Model | Stav | Poznámka |
| --- | --- | --- | --- |
| Procesor | `<____>` | `<výborný / dobrý>` | `<____>` |
| Grafická karta | `<____>` | `<____>` | `<____>` |
| Základní deska | `<____>` | `<____>` | `<____>` |
| Paměť | `<____>` | `<____>` | `<____>` |
| Disk | `<____>` | `<____>` | `<____>` |
| Zdroj | `<____>` | `<____>` | `<____>` |
| Chlazení | `<____>` | `<____>` | `<____>` |
| Skříň | `<____>` | `<____>` | `<____>` |
| Klávesnice / myš | `<přiloženo / nepřiloženo>` | `<____>` | `<____>` |

## Záruka a stav zboží

```text
Záruka FLIPCORE: __ měsíců (tier <LOW / MID / HIGH>).
Jde o bazarové zboží — jednotlivé díly jsou z předchozího použití a mohou nést
viditelné stopy opotřebení. Stav jednotlivých komponent je uveden v tabulce specifikací.
```

Délka smluvní záruky dle tieru:

| Tier | Záruka |
| --- | --- |
| LOW | 3 měsíce |
| MID | 6 měsíců |
| HIGH | 12 měsíců |

Doplň do kopie i toto:

```text
Záruka se vztahuje na funkci sestavy. Zjevné znaky bazarového opotřebení
(skřábnutý kryt, zažloutlý ventilátor, stopy po montáži) nejsou závadou.
```

### Upozornění pro tier LOW a MID (povinné — LOW a MID)

> U inzerátů pro tier **LOW** a **MID** ponech v textu výslovně toto upozornění:

```text
Upozornění: Sestava je složena z bazarových dílů. Odpovídá tieru <LOW / MID>
– je určena pro <kancelářskou práci a běžné úkoly / hraní ve 1080p>,
nikoli pro náročné hraní na nejvyšší nastavení nebo profesionální práci.
Přesné možnosti a omezení vám rád vysvětlím.
```

### Windows (povinné u LOW a MID, u HIGH dle rozhodnutí)

```text
POZOR: Počítač se prodává BEZ Windows a bez operačního systému.
Systém si řeší zákazník sám — instalací Windows nebo Linuxu do vlastního počítače.

Proč: Windows vyžadují licenci a je nutné vybrat správnou edici
(Windows 11 Home / Pro). Tuto část zákazník řeší sám dle svých potřeb.

Ke starším procesorům Intel 4. až 7. generace Windows 11 nepodporuje.
```

> U `HIGH` je toto upozornění **povinné vždy**, pokud sestava Windows 11 neobsahuje —
> systém rozhoduje procesor, ne grafická karta. Obsahuje-li sestava Windows, nahradí se
> blok vědou, že jde o Windows 11 nainstalované a aktivované **ověřeným OEM klíčem
> převedeným z bazarového kusu** (viz
> [`../docs/60-prodej/64-prodejni-podminky.md`](../docs/60-prodej/64-prodejni-podminky.md)).
> **Licence k OS se převádí, nevyrábí** — nikdy neoriginální klíč, nikdy bypass TPM.
>
> **Proč toto upozornění patří do každého inzerátu:**
>
> - Intel 4. a 5. generace nemá **TPM 2.0** → Windows 11 oficiálně nepodporován, nainstalovat se nedá.
> - Intel 6. a 7. generace → **stále bez TPM 2.0**, Windows 11 oficiálně nepodporován.
> - Intel 8. generace → TPM 2.0 typicky chybí; řešitelné **samostatným modulem TPM 2.0**, který se musí fyzicky osadit na desku.
> - Intel 9. generace → fTPM **nemá**; řešitelné **samostatným modulem** stejně jako 8. generace.
> - Intel 10.–14. generace → Windows 11 **nativně**; u 10. generace je nutné ověřit PTT u konkrétního modelu.
> - AMD Ryzen 3000 a 4000 → fTPM **chybí**, Windows 11 není podporováno nativně.
> - AMD Ryzen 5000 a novější → fTPM **zabudovaný**, Windows 11 jde nainstalovat přímo, bez TPM modulu.

## Vyzkoušení a faktura

```text
Možnost osobního vyzkoušení: sestava je k dispozici k osobnímu vyzkoušení na místě
po domluvě termínu (<kontakt / místo>).

Bazarový prodej: na faktuře bude uvedeno předem odsouhlasené sériové číslo
hlavní komponenty (<sériové číslo>), dohodnuté se zákazníkem před platbou.
```

- Osobní vyzkoušení — `<dostupný termín / kde>`
- Sériové číslo na faktuře — `<sériové číslo>`, odsouhlaseno s zákazníkem před platbou: `<ano / ne>`

## Co do inzerátu NEPATŘÍ

Tuto část **nemazat** — je to pravidla, ne text pro zákazníka.

| Nepatří do inzerátu | Proč |
| --- | --- |
| Nerealizované přísliby výkonu (např. „zvládne všechny nové hry na max") | Nelze zaručit; vede k reklamacím a ztrátě důvěry |
| Srovnání s konkurencí a jinými obchody | Není ověřitelné a není to informace pro zákazníka |
| Vytváření dojmu, že je sestava nová | Sestava je z bazarových dílů — stav bazarového zboží se uvádí otevřeně |
| Fotografie cizích sestav nebo generická grafika | Zákazník musí vidět konkrétní kus, který dostane |
| Interní označení tieru v titulku | `LOW/MID/HIGH` zákazníkovi nic neříší |
| Srovnávací benchmarky a výkonnostní čísla z internetu | Nejsou z tohoto kusu; do protokolu patří vlastní měření |
| Ceny pořízení dílů a vnitřní kalkulace | Interní údaj, zákazníkovi nepatří |

## Fotky

Výčet požadovaných snímků (doplnit do kopie):

1. Celá sestava zvenku — zavřená skříň
2. Otevřená skříň — pohled na všechny komponenty
3. Detail každé hlavní komponenty (procesor, grafická karta, základní deska, disk, zdroj)
4. Detail sériového čísla hlavní komponenty
5. Případné vady nebo stopy opotřebení
6. Případně screenshot nebo snímek výstupu testu

- Počet fotografií: `<____>`
- Umístění souborů: `< cesta / odkaz >`

## Cena

| Položka | Hodnota |
| --- | --- |
| Cena sestavy | `<____ Kč>` |
| Základna pro výpočet (náklady dílů + práce) | `<____ Kč>` |
| Odkaz na cenové pásmo | [Cenové pásmo](../docs/40-tiery/43-cenove-pasmo.md) |

> Cenu doplň podle [cenového pásma](../docs/40-tiery/43-cenove-pasmo.md) pro příslušný tier.
> TODO: doplnit aktuální číselné hodnoty cenových pásem — zdroj: `docs/40-tiery/43-cenove-pasmo.md`

## Kontakt a odeslání

- Kanál: `<inzerce.cz / Bazoš / Facebook Marketplace / jiný>`
- Kontakt: `<____>`
- Datum zveřejnění: `<YYYY-MM-DD>`
- Datum stažení / prodeje: `<YYYY-MM-DD>`

**Zdroj:** [Šablona inzerátu](../docs/60-prodej/62-sablona-inzeratu.md)
