# Příjemka dílu

**Účel:** Záznam jednoho dílu převzatého z bazaru, inzeráty nebo od bazarového prodejce — podklad pro skladování, opravu i výpočet marže.

**Jak vyplnit:**

- Zkopíruj tento soubor do kopie s názvem ve tvaru `prijemka-<ID_dilu>.md` a vyplňuj pouze kopii; šablona zůstává prázdná.
- `<ID_dilu>` je interní identifikátor dílu (např. `CPU-____`), který se používá i v testovacím protokolu a ve skladových záznamech.
- `<____>` nahraď skutečnou hodnotou; pole, která u daného dílu neplatí, označ `n/a`, nevyplňuj domýšlenými údaji.
- `**Zdroj:**` ponech v kopii beze změny jako odkaz na pravidla.

## Základní údaje

| Pole | Hodnota |
| --- | --- |
| Datum příjmu | `<YYYY-MM-DD>` |
| ID dílu | `<____>` |
| Typ dílu | `<CPU / GPU / RAM / disk / MB / zdroj / chlazení / jiný>` |
| Model (název a verze) | `<____>` |
| Sériové číslo | `<____>` |
| Dodavatel / prodávající | `<jméno nebo obchodní název>` |
| Odkaz na inzerát | `<URL>` |
| Kanál prodeje | `<bazar / inzerce.cz / Bazoš / Facebook Marketplace / jiný>` |

## Stav a cena

| Pole | Hodnota |
| --- | --- |
| Stav | `<výchozí / výborný / dobrý / vadný>` |
| Pořizovací cena | `<____ Kč>` |
| Datum předání do skladu | `<YYYY-MM-DD>` |

## OEM klíč k OS

| Pole | Hodnota |
| --- | --- |
| Přišel klíč k OS | `<ano / ne / neví>` |
| Jak byl ověřen | `<popis ověření nebo n/a>` |

## Přibalené / přítomné

| Položka | Přítomno | Poznámka |
| --- | --- | --- |
| Termopasta | `<ano / ne>` | `<____>` |
| Chlazení | `<ano / ne>` | `<____>` |
| Napájecí adaptér / kabel | `<ano / ne>` | `<____>` |
| Originální obal / jádro | `<ano / ne>` | `<____>` |
| Zbylé příslušenství | `<ano / ne>` | `<____>` |

## Zaznamenané vady

- Vada 1: `<popis — kde, jak je patrné>`
- Vada 2: `<popis>`
- Funkční závada při zapnutí / testu: `<popis nebo neprokázáno>`

## Fotodokumentace

- Počet fotografií: `<____>`
- Co je na fotografiích: `<celé díly, detail štítku, sériové číslo, viditelné vady, přibalené příslušenství>`
- Umístění souborů: `< cesta / odkaz >`

## Rozhodnutí

- [ ] Do skladu
- [ ] Do opravy
- [ ] Do elektronického odpadu

Zdůvodnění rozhodnutí: `<____>`

## Podpis

- Přijal: `<jméno>` — `<YYYY-MM-DD>`
- Podpis: `____`

**Zdroj:** [Příjemka](../docs/20-prijem-a-sklad/21-prijemka.md)
