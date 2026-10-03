# Testovací protokol sestavy

**Účel:** Záznam výsledků testů jedné sestavy před nasazením do skladu nebo do prodeje — podklad pro tier, cenu a prodejní rozhodnutí.

**Jak vyplnit:**

- Zkopíruj šablonu do kopie `test-<ID_sestavy>.md` a vyplňuj pouze kopii.
- `ID sestavy` musí být stejné jako u příjemky jednotlivých dílů, aby šly dohledat.
- Naměřené hodnoty (teploty, frekvence, časy testů, počty chyb) **nech prázdné** a doplň až po vlastním měření — žádné odhady ani hodnoty převzaté z cizích zdrojů.
- U každé komponenty zvol jednu možnost: prošel / neprošel / výhrada.

## Základní údaje

| Pole | Hodnota |
| --- | --- |
| ID sestavy | `<____>` |
| Tier sestavy | `<LOW / MID / HIGH>` |
| Datum testu | `<YYYY-MM-DD>` |
| Testoval | `<jméno>` |
| Místo testu | `<____>` |
| Počet testů | `<____>` |

## Složení sestavy

| Komponenta | Model | Stav | Poznámka |
| --- | --- | --- | --- |
| CPU | `<____>` | `<výchozí / výborný / dobrý / vadný>` | `<____>` |
| GPU | `<____>` | `<____>` | `<____>` |
| MB (zákl. deska) | `<____>` | `<____>` | `<____>` |
| RAM | `<____>` | `<____>` | `<____>` |
| Disk | `<____>` | `<____>` | `<____>` |
| Zdroj | `<____>` | `<____>` | `<____>` |

## Výsledky testů per komponenta

| Komponenta | Test | Výsledek | Poznámka |
| --- | --- | --- | --- |
| CPU | `<např. zátěžový test>` | `<prošel / neprošel / výhrada>` | `<____>` |
| GPU | `<např. zátěžový test>` | `<____>` | `<____>` |
| RAM | `<např. test paměti>` | `<____>` | `<____>` |
| Disk | `<např. test čtení/zápisu>` | `<____>` | `<____>` |
| MB | `<např. test portů a PCIe>` | `<____>` | `<____>` |
| Zdroj | `<např. test stability napájení>` | `<____>` | `<____>` |

## Naměřené hodnoty

| Ukazatel | Hodnota | Podmínky měření |
| --- | --- | --- |
| Teplota CPU | `<____ °C>` | `<např. ____ minut zátěže>` |
| Teplota GPU | `<____ °C>` | `<např. ____ minut zátěže>` |
| Teplota ostatních komponent | `<____>` | `<____>` |
| Frekvence / výkon | `<____>` | `<____>` |
| Chybové / nestabilní záznamy | `<____>` | `<____>` |
| Ostatní naměřené hodnoty | `<____>` | `<____>` |

> Čísla doplňuj výhradně z vlastního měření podle testovacího postupu.

## Fotodokumentace

- Odkaz na fotky / video: `< cesta / odkaz >`
- Co je zachyceno: `<snímky běhu testu, teploty, výstup testu, sériová čísla>`

## Závěrečné rozhodnutí

- [ ] V prodej
- [ ] Do opravy
- [ ] Rozmontovat

Zdůvodnění rozhodnutí: `<____>`

## Poznámky

- `<____>`
- `<____>`

**Zdroj:** [Testovací protokoly](../docs/30-testovani-a-evidence/31-testovaci-protokoly.md)
