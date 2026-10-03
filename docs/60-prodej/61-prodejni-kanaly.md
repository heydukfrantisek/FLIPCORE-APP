# Prodejní kanály

**Účel:** Rozhoduje, kde a na jakých podmínkách prodáváme hotové sestavy koncovým zákazníkům.

Prodej je **pouze B2C** — koncoví zákazníci. Žádné B2B, žádné velkoobchodní výkupy,
žádné pronájmy ani servisní zakázky.

Nákupní kanály (`../10-nakup/10-kanaly.md`) a prodejní kanály se jmenují stejně, ale
pracují opačně: při **nákupu** bazarový prodejce prodává zboží nám, při **prodeji**
jsme bazarovým prodejcem my a bazar stojí mezi námi a kupcem.

## Jaké prodejní kanály jsou v úvaze

### Aukro — prodáváme jako bazarový prodejce

Vystavujeme zboží jako bazarový prodejce, běžně s ochrannou platbou protismluvou.

Výhody:

- Protismluva: peníze se uvolní až po potvrzení převzetí kupujícím.
- Bazar jako jasná smluvní strana — dohledatelný subjekt, ne anonymní soukromník.
- Důkazní záznam objednávky se sériovým číslem, když ho odsouhlasíme na faktuře.
- Nejnižší riziko podvodu ze všech uvažovaných kanálů.

Nevýhody:

- Poplatky za vystavení a z prodejní ceny — vstupují do kalkulace marže
  (`../70-finance/71-kalkulace-marze.md`).
- Delší výdej: čeká se na úhradu, odsouhlasení a předání dopravci.
- Kontakt a jednání se zákazníkem jsou zastarčené, rychlost není prioritou.

Co to znamená pro nás:

- **Reklamace jdou přes bazar, ne přímo k zákazníkovi.** Reklamaci přijímáme my,
  vyřizujeme ji s bazardomluvnou a předáváme bazaru — s dokumentací, ne telefonem.
  Šablona: [`../../templates/reklamace.md`](../../templates/reklamace.md).
- Reklamace prodlouží dobu výdeje peněz a zatíží provozní čas.
- Musíme mít připravenou vlastní záruční podmínku dle tieru (LOW 3 M, MID 6 M,
  HIGH 12 M, viz [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md)).
- Sériové číslo a ID sestavy musí být odsouhlasené **písemně na faktuře** — bez toho
  reklamaci nevyřídíme.

Co to znamená pro zákazníka:

- Kupuje s protismluvou, takže peníze jsou chráněné do potvrzení.
- Řeší se s bazardomluvnou, ne s námi přímo — reklamace je pomalejší.
- Musí odsouhlasit a potvrdit převzetí, jinak zboží zůstává v protektorátu.

### inzerce.cz / Bazoš

Prodej ze soukromí, bez prostředníka, rychlá dohoda.

Výhody:

- Rychlá smlouva: dohoda i předání bývají během téhož dne nebo týdne.
- Žádná ochranná platba, žádný prostředník — méně byrokracie.
- Dosah na hledající konkrétní model podle klíčových slov a filtrů.

Nevýhody a rizika:

- Bez garance platformy: konkurence tipuje cenu, spor neřeší nikdo.
- Kontakt mimo platformu (z platformy do jiné aplikace) mění pravidla hry i možnost
  nahlášení podvodu.
- Nutnost osobního setkání — veřejné místo, ve dne; dojezdy a čas jdou do marže.

Nutnost předem odsouhlasit na faktuře: **seznam sériových čísel komponent sestavy**.
Bez písemného dokladu se při sporu neprokáže, o jaký kus šlo. Toto je stejný
důkazní požadavek jako u nákupu, jen teď ho odsouhlasuje **zákazník s námi**, ne my
s bazarovým prodejcem.

### Facebook Marketplace

Lokální kanál s osobním setkáním.

Výhody:

- Nejrychlejší a nejlevnější přístup k místnímu zákazníkovi.
- Krátká odezva, setkání v okolí, rychlé odmítnutí bez cestování.

Nevýhody a rizika:

- **Nejvyšší podíl podvodů ze všech kanálů** — malá kontrola profilu, prodána cizí věc.
- Nízká vymahatelnost: u profilu bez identifikace je reklamace prakticky nemožná.
- Setkání v garáži, sklepě nebo na okrajovém parkovišti zvyšuje riziko — pouze veřejné
  místo ve dne.

### Vlastní e-shop nebo výdejní místo

Možná budoucí varianta — **prozatím neuvažováno**, mimo rozsah této dokumentace.

## Kanály — tabulka porovnání

| Kanál | Výhody | Nevýhody | Typická rizika | Co je nutné vyjednat předem | Prokazatelné náklady |
| --- | --- | --- | --- | --- | --- |
| Aukro (bazarový prodejce) | Protismluva, jasná smluvní strana, důkazní záznam | Poplatky, delší výdej, zastaralá komunikace | Reklamace vrací do provozního času; spor řeší bazar, ne důkazy | Sériové číslo a ID sestavy odsouhlasené **písemně na faktuře**; obsah balíku; záruční podmínka dle tieru | `TODO: doplnit poplatek za vystavení inzerátu a procentní poplatek z prodejní ceny prodejní tarif — zdroj: aktuální ceník Aukra` |
| inzerce.cz / Bazoš | Rychlá smlouva, žádný prostředník, dosah na model | Bez garance platformy, nutné osobní setkání | Spor neřeší nikdo; kontakt mimo platformu; směrování do jiných aplikací | Seznam sériových čísel komponent odsouhlasený **písemně na faktuře**; místo a čas setkání; prodejní podmínky | `TODO: doplnit poplatky za zvýšení inzerátu a případné procentní poplatky — zdroj: aktuální ceník Bazoše / inzerce.cz` |
| Facebook Marketplace | Nejrychlejší, nejlevnější, lokální zákazník | Bez ochrany platby, nízká vymahatelnost | **Nejvyšší podíl podvodů**, prodej cizího majetku, nebezpečné místo setkání | Místo a čas setkání; předem odsouhlasená sjednaná cena a forma platby | `TODO: doplnit, zda a kolik účtuje samotná plocha (předpoklad: bez poplatku) — zdroj: aktuální podmínky a ceník Marketplace` |
| Vlastní e-shop / výdejní místo | Prozatím neuvažováno | Prozatím neuvažováno | Prozatím neuvažováno | Prozatím neuvažováno | Prozatím neuvažováno |

Prokazatelné náklady se započítávají do marže vždy, i když jsou malé nebo údaj není
přesný — viz [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md).
Poplatky **nákupních** kanálů jsou popsané v
[`../10-nakup/10-kanaly.md`](../10-nakup/10-kanaly.md) a platí pro jinou stranu
smluvního vztahu: u nákupu bazarový prodejce prodává zboží nám a jeho marže je součástí
pořizovací ceny; u prodeje jako bazarový prodejce prodáváme zboží my, bazar stojí
mezi námi a kupcem a jeho poplatky odečítáme od našeho výnosu.

## Výběr kanálu podle tieru

**Pracovní předpoklad k ověření**, ne závěr. Ověří se z reálných prodejů a doplní se
do evidence sestav.

| Tier | Primární kanály | Proč |
| --- | --- | --- |
| `LOW` | Bazoš, Facebook Marketplace | Kupující kancelářské sestavy hledají tam, kde se bazarové PC zároveň nakupují. Rychlé setkání a nízká cena rozhodují víc než záruka — a `LOW` má záruku jen 3 M. |
| `MID` | Bazoš, Facebook Marketplace | Stejný prostor, důraz na setkání a možnost vyzkoušet. Záruka 6 M se v této síti běžně neřeší a není důvodem k dražšímu kanálu. |
| `HIGH` | Aukro, a dál tam, kde se prodává s delší garancí | U `HIGH` (12 M, vyšší cena, více součástí k předání) začíná dávat smysl protismluva a dohledatelný prodejce. |

Rozhodující je, že v LOW a MID prodáváme **do stejného prostoru, odkud nakupujeme** —
tam je i bazarový prodejce jako konkurence. Konkurence v prostoru, kde se nakupuje,
zní nevýhodně, ale je to i místo, kde zákazník na bazarové PC hledá.

## Před odevzdáním zákazníkovi

- [ ] Sestava je vyčištěná (viz [`../20-prijem-a-sklad/22-cipovani-a-cisteni.md`](../20-prijem-a-sklad/22-cipovani-a-cisteni.md)).
- [ ] Test protokol vyplněn a uložen (viz [`../30-testovani-a-evidence/31-testovaci-protokoly.md`](../30-testovani-a-evidence/31-testovaci-protokoly.md)).
- [ ] Fotografie pořízeny podle [`../../templates/inzerat.md`](../../templates/inzerat.md).
- [ ] ID sestavy a její komponent zapsáno do evidence (viz [`../30-testovani-a-evidence/32-evidence-komponent.md`](../30-testovani-a-evidence/32-evidence-komponent.md)).
- [ ] Cílová cena odpovídá kalkulaci v [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md) a nepřekračuje minimum marže dle [`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md).
- [ ] Záruka stanovená dle tieru: LOW 3 M, MID 6 M, HIGH 12 M.
- [ ] Sériové číslo odsouhlaseno písemně u bazarového prodeje.
- [ ] Prodejní podmínky předány zákazníkovi ([`64-prodejni-podminky.md`](64-prodejni-podminky.md)).

## Platba a předání

### Způsoby platby

| Způsob | Kdy použít | Co vyžaduje |
| --- | --- | --- |
| Převod | U dálkového prodeje a u vyšších částek | Výrok o platbě předem, doklad o přijaté platbě |
| Hotově | Lokální setkání na veřejném místě, celá částka při předání | Písemný doklad o přijetí částky, podle [`../10-nakup/10-kanaly.md`](../10-nakup/10-kanaly.md) |
| Dobírka | Jen když dopravce dobírku skutečně umí a zákazník ji vyžádá | Vyšší riziko, že zákazník zboží nepřevezme — ztráta je na naší straně |

Dobírka není preferovaný způsob. Kde je to možné, používá se převod nebo hotovost při
setkání. Za dobírku se neúčtuje nic, dokud se neprokáže konkrétní ztráta — viz
[`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md).

### Co je nutné zaznamenat

- Datum a způsob platby.
- Zaplacená částka a sjednaná cena před předáním.
- Datum a místo předání, jméno kupujícího.
- Odsouhlasené sériové číslo sestavy a stav, ve kterém byla sestava předána.
- Zda a kdy byl předán doklad o zaplacení a prodejní podmínky.

### Evidence prodeje

Prodej se eviduje do tabulky **Sestavy** v Google Sheets — stejná tabulka jako záznam
sestavy a její komponent, viz
[`../30-testovani-a-evidence/32-evidence-komponent.md`](../30-testovani-a-evidence/32-evidence-komponent.md).
Prodejní kanál se zapíše jako vstup pro poplatek kanálu do nákladů. Bez zápisu prodeje
nejsou reálná data pro výpočet rezervy na reklamaci a pro dobu obratu v
[`../70-finance/72-cashflow.md`](../70-finance/72-cashflow.md).

## Související dokumenty

| Oblast | Dokument |
| --- | --- |
| Nákupní kanály (opačná role v obchodu) | [`../10-nakup/10-kanaly.md`](../10-nakup/10-kanaly.md) |
| Kalkulace ceny a marže, prodejní poplatky | [`../70-finance/71-kalkulace-marze.md`](../70-finance/71-kalkulace-marze.md) |
| Doba obratu a peněžní tok | [`../70-finance/72-cashflow.md`](../70-finance/72-cashflow.md) |
| Evidence sestavy a prodeje | [`../30-testovani-a-evidence/32-evidence-komponent.md`](../30-testovani-a-evidence/32-evidence-komponent.md) |
| Definicie tieru a záruky | [`../40-tiery/40-tier-definice.md`](../40-tiery/40-tier-definice.md) |
| Cílová cena a minimální marže | [`../40-tiery/43-cenove-pasmo.md`](../40-tiery/43-cenove-pasmo.md) |
| Šablona inzerátu | [`../../templates/inzerat.md`](../../templates/inzerat.md) |
| Šablona reklamace | [`../../templates/reklamace.md`](../../templates/reklamace.md) |

TODO: doplnit podíl prodejů podle kanálu a průměrnou dobu od inzerátu do předání po
prvních prodejích — zdroj: tabulka Sestavy v Google Sheets.
