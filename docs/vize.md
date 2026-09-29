# Vize produktu

> Tento dokument odpovídá na otázku "proč FLIPCORE existuje a pro koho". Technický návrh je v [architektuře](architektura.md), konkrétní funkce v [dokumentech funkce](funkce/). Cíle a priority v časovém pořadí drží [ROADMAP.md](../ROADMAP.md).

## Problém

Kdo dnes kupuje použitou výpočetní techniku, čelí třem problémům:

1. **Nedostatek důvěry.** Bazarový kus má neznámou historii. Kupující neví, zda byl opravovaný, zda prošel testem, co přesně bylo vyměněno a v jakém je skutečném stavu. Prodávající naopak nemá jak doložit, že kus je v pořádku.
2. **Nejistota ohledně konečné ceny.** Sestavení celého počítače z secondhandu vyžaduje desítky dílčích rozhodnutí. Běžný zájemce o PC nezná, které komponenty k sobě patří, a dostává různé, často rozporné odhady ceny.
3. **Čas a know-how.** Ačkoli repas a testování je dostupné, vyžaduje znalosti, nástroje a čas, které laik nemá.

FLIPCORE řeší všechny tři: spojuje vyhledávání bazarových kusů, standardizovaný proces repasu a stavového hodnocení a sestavení hotového počítače z kusů, které jsou reálně v katalogu.

## Koho řešíme

| Typ uživatele            | Co potřebuje                                                                 | Co v tom dostane                                                       |
| ------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Běžný zájemce o PC       | Hotový počítač bez znalostí, za jasnou cenu                                 | Sestavený počítač v jedné ze tří cenových kategorií, každý díl s dokladem |
| Hráč / pařič            | Výkon za rozumnou cenu, jistota, že to bude fungovat                       | Kategorie Střední a Premium, stavové hodnocení herních komponent        |
| IT nadšenec             | Přístup ke skutečným parametrům a historii kusu                             | Detailní údaje o stavu, důkazy z testů, rozpadové informace            |
| Bazar / prodejce         | Odpovědnost za prodávaný kus a důvěryhodný prodej                           | Standardizovaný proces repasu a stavového hodnocení, které může doložit |

Bazar / prodejce je v tomto modelu rovnocenným účastníkem, ne pouhým dodavatelem dat.

## Tři pilíře

1. **Bazarový marketplace** — vyhledávání a nákup otestovaných počítačových komponent z druhé handy.
2. **Repas a stavové hodnocení** — ověření stavu, čištění, testování a ohodnocení kusu, aby jeho stav byl doložitelný a ne jen deklarovaný.
3. **Sestavení PC** — výběr konfigurace v jedné ze tří cenových kategorií z kusů reálně dostupných v katalogu.

## Cenové kategorie

Tři kategorie jsou jednoznačně odlišené výběrem výkonové třídy a cílového scénáře použití. U každé platí, že lze sestavit pouze z kusů aktuálně v katalogu a s dokladem o stavu.

| Kategorie | Scénář použití | Cílový výkon | Typické limity | Co musí být doloženo |
| --- | --- | --- | --- | --- |
| **Základ** | Kancelářské práce, prohlížení, škola | Základní kancelářské a školní úlohy | Herní tituly nejsou cílem | Funkčnost každé komponenty a kompatibilita sestavy |
| **Střední** | Běžné hraní v nižším rozlišení, práce s grafikou | Herní a grafický střední výkon | Nastavení detailů a ray tracingu mimo cílem | Výkonové testy výpočetních komponent |
| **Premium** | Náročné hraní, vyšší rozlišení, editace | Vysoký výkon | Cena roste rychle, dostupnost kusů je omezená | Výkonové testy a dlouhodobější zátěž |

Pravidla výběru:

- Kategorii určuje výsledný výkon sestavy, nikoliv jednotlivá nejvyšší částka v katalogu. Katalogový kus může být použit v libovolné kategorii, pokud sestavě vyhovuje.
- Sestava musí být vzájemně kompatibilní a jako celek otestovaná.
- Pokud není v katalogu dostatek vhodných kusů pro danou kategorii, sestava se v této kategorii nenabídne; nabídne se pouze kategorie, která je skutečně pokrytá dostupnými kusy.
- Cenové hranice kategorií nejsou v tomto dokumentu zadány a stanoví se jako samostatné obchodní rozhodnutí (viz [otevřené otázky](#otevřené-otázky)).

## Co do produktu nepatří

- Zboží zásadně jiného typu než počítačové komponenty (mobily, domácí spotřebiče, počítačové celky mimo sestavovanou konfiguraci).
- Zboží neověřené, u něhož neproběhl alespoň minimální vstupní test, aniž by bylo v katalogu výslovně označeno jako neověřené s odpovídající nápovědou. Výchozí stav je vždy ověřený kus.
- Financování, pojištění, záruční a servisní služby nad rámec transparentního stavu kusu.
- Poradenství a odhady cen mimo samotnou nabídku sestavy.
- Vlastní výroba součástek nebo neoriginální náhradní díly. Repas znamená údržbu a ověření originálního kusu, ne výrobu náhradních komponent.

## Principy

1. **Transparentnost stavu kusu.** Každé tvrzení o stavu komponenty musí být buď doložitelné, nebo výslovně označené jako nedoložené.
2. **Důvěryhodnost bazarového zboží.** Historie repasu je součástí hodnoty kusu, ne jeho překážka. Zakryté nebo smazané informace o opravě snižují důvěryhodnost.
3. **Jednoznačné ceny.** Cena je uvedena u sestavy, u cenové kategorie a u jednotlivého kusu. Cena nesmí být odvozována uživatelem až v košíku.
4. **Doklad místo slibů.** Vlastnost, kterou nelze doložit, se v katalogu neuvádí jako výhoda.
5. **Jasná hranice stavu.** Stavová hodnocení mají pevně danou stupnici s definovanými požadavky pro každý stupeň, viz [dokument funkce repasu](funkce/001-repas-a-stavove-hodnoceni.md).

## Otevřené otázky

Tyto otázky nejsou rozhodnuté a je potřeba je vyřešit před implementací dotčených částí:

- Jaké konkrétní finanční hranice odpovídají kategoriím Základ / Střední / Premium?
- Je stavové hodnocení jednotné pro všechny druhy komponent, nebo existují výjimky (například u disků nebo displejů)?
- Kdo je autoritou pro přidělení stavového hodnocení a může být hodnocení kupujícím potvrzeno nebo zpochybněno?
- Jak dlouho platí doložený stav v čase a kdy je nutné kus znovu otestovat?

Poslední aktualizace: 2026-09-29
