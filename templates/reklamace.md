# Reklamace zákazníka

**Účel:** Záznam reklamace na prodanou sestavu — co bylo potřeba opravit, kdo závadu vyřizoval, jak to bylo vyřešeno a jak moc to stálo.

**Jak vyplnit:**

- Zkopíruj šablonu do kopie `reklamace-<ID_sestavy>-<YYYY-MM-DD>.md` a vyplňuj pouze kopii.
- `ID sestavy` musí být stejné jako u testovacího protokolu; dohledej tak i původní příjemku dílů.
- Výsledek a příčinu doplň až podle skutečného vyřešení; neuzavírej reklamaci domýšlenou příčinou.
- Dopad na marži doplň podle kalkulace marže.

## Základní údaje

| Pole | Hodnota |
| --- | --- |
| Datum otevření reklamace | `<YYYY-MM-DD>` |
| ID sestavy | `<____>` |
| Tier sestavy | `<LOW / MID / HIGH>` |
| Délka smluvní záruky | `<3 / 6 / 12>` měsíců |
| Datum nákupu | `<YYYY-MM-DD>` |
| Datum reklamace | `<YYYY-MM-DD>` |
| Záruční doba ještě platná | `<ano / ne — uplynula>` |
| Jde o záruční opravu | `<ano / ne>` |

## Zákazník

| Pole | Hodnota |
| --- | --- |
| Jméno | `<____>` |
| Kontakt | `<telefon / e-mail>` |
| Preferovaný způsob komunikace | `<telefon / e-mail / zpráva>` |

## Popis závady

- Závada hlášená zákazníkem (jeho slovy): `<____>`
- Kdy se projevila: `<při otevření / po __ dnech / při zátěži>` — `<____>`
- Jak byla ověřena po převzetí: `<např. vlastní test, pátrání po chybách>` — `<____>`
- Fotky / video závady: `< cesta / odkaz >`

## Způsob vyřízení

| Položka | Hodnota |
| --- | --- |
| Kdo závadu vyřizuje | `<interně / bazar / výrobce>` |
| Bazar / výrobce — kdo a kdy | `< název, kontakt, datum >` |
| Termín opravy | `<YYYY-MM-DD>` |

## Použité díly

| Díl | Model | Zdroj | Stav | Náklad |
| --- | --- | --- | --- | --- |
| `<např. zdroj>` | `<____>` | `<bazar / sklad / výrobce>` | `<výborný / dobrý>` | `<____ Kč>` |
| `<např. RAM>` | `<____>` | `<bazar / sklad / výrobce>` | `<výborný / dobrý>` | `<____ Kč>` |
| `<____>` | `<____>` | `<____>` | `<____>` | `<____ Kč>` |

## Náklad na opravu

| Položka | Hodnota |
| --- | --- |
| Náklad na díly | `<____ Kč>` |
| Náklad na práci / dopravu | `<____ Kč>` |
| Celkem náklad na opravu | `<____ Kč>` |
| Náklad hradil | `<FLIPCORE / zákazník>` |

## Výsledek

- [ ] Opraveno
- [ ] Vráceno peníze
- [ ] Vyměněno
- [ ] Odmítnuto

Popis výsledku: `<co bylo uděláno, co dostal zákazník>`

Datum vyřešení: `<YYYY-MM-DD>`

## Příčina a zpětné poučení

| Pole | Hodnota |
| --- | --- |
| Příčina závady | `<např. vadný kus z bazaru / chyba při montáži / přehlédnutí při testu / jiný vliv>` |
| Byla příčina odstraněna v nákupním procesu? | `<ano / ne / částečně>` |
| Jak byla odstraněna (nebo proč ne) | `<např. kontrola při příjemce, test před nasazením do prodeje, výměna z bazaru>` |

Dopad na marži: `<zapsáno do kalkulace marže nebo bez dopadu>`

Odkaz na kalkulaci marže: [Kalkulace marže](../docs/70-finance/71-kalkulace-marze.md)

## Podpisy

- Reklamaci přijal: `<jméno>` — `<YYYY-MM-DD>`
- Vyřizoval: `<jméno>` — `<YYYY-MM-DD>`

**Zdroj:** [Prodejní podmínky](../docs/60-prodej/64-prodejni-podminky.md)
