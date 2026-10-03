# Nákupní kanály

**Účel:** Pravidla, výhody a limity nákupu desktopových dílů na bazaru, Bazoši a Facebook Marketplace.

## Jak používat tento dokument

Tento dokument rozhoduje **kde hledáme a na jakých podmínkách kupujeme**. Co kupujeme, určuje tier
(`../40-tiery/41-cpu-tabulka.md`, `../40-tiery/42-gpu-tabulka.md`), za kolik smíme koupit
(`12-max-ceny.md`), jak inzerát vyhodnotíme před cestou (`11-due-diligence.md`) a na co si dáváme
pozor při jednání (`13-pasti-a-podvody.md`).

## Pravidla platná pro všechny kanály

| # | Pravidlo |
| --- | --- |
| 1 | Kupujeme **pouze desktop tower**. Notebooky, AIO, Mini-PC, konzole a B2B prodej jsou mimo sortiment. |
| 2 | Cílový tier určuje model CPU a model GPU, ne generace a ne údaj v inzerátu. Křížová kontrola: `../40-tiery/41-cpu-tabulka.md`, `../40-tiery/42-gpu-tabulka.md`. |
| 3 | Sestava musí splnit minimum tieru (RAM, disk, u HIGH i zdroj). Vzory skládání: `../40-tiery/44-referencni-sestavy.md`. |
| 4 | Cena se porovná s maximální nákupní cenou v `12-max-ceny.md`, ta se odvozuje z cílové prodejní ceny v `../40-tiery/43-cenove-pasmo.md`. |
| 5 | Každý nákup má vlastní ID a zapisuje se do evidence při příjmu: `../20-prijem-a-sklad/21-prijemka.md`. |
| 6 | Ověření na místě jde podle `../30-testovani-a-evidence/31-testovaci-protokoly.md`. Bez testu na místě se sestava nerozšiřuje o další nákupy. |
| 7 | **Nikdy** neplatíme přes odkaz nebo formulář zaslaný v chatu či e-mailu, **nikdy** neplatíme předplatnou, dárkovým poukazem ani zálohu v kryptoměně. Viz `13-pasti-a-podvody.md`. |
| 8 | Licence k OS se **převádí**, nevyrábí: jen ověřitelný OEM klíč z bazarového PC, nebo prodej bez OS. Nikdy neoriginální klíč, nikdy bypass TPM. |
| 9 | Záruka dle tieru: LOW 3 M, MID 6 M, HIGH 12 M. Nákupní kanál a jeho záruky nesmějí náš výrobní záruční podmínky podkopat. |
| 10 | Ceny a marže v dokumentech jsou orientační odhady, ne smluvní údaje. Doplní se z reálných nákupů. |

## Bazar a Aukro

Bazar znamená obchodní podnik nebo velký prodejce, Aukro je platforma, kde bazarista vystavuje zboží
a běžně využívá ochrannou platbu protismluvou.

### Výhody

- Ochrana protismluvou: peníze se uvolní až po potvrzení zboží příjemcem, protismluva je důkazní podklad.
- Jasná smluvní strana — bazar, ne anonymní soukromník. Reklamaci řeší platforma a bazar.
- Větší šance na originální příslušenství (ventilátory, krabice, záruční listy běžně v balíku).
- U bazarů s vlastním servisem lze občas reklamaci předat přímo jim.
- Výrazně méně rizika podvodu než u soukromého prodejce, protože existuje doklad a dohledatelný subjekt.

### Nevýhody

- Výdej trvá: bazar čeká na úhradu, na odsouhlasení a na předání zboží dopravci. Objednávka může viset víc dní.
- Poplatky: Aukro si účtuje poplatek za vystavení inzerátu a další poplatek z prodejní ceny. Do kalkulace marže
  se započítává vždy, i u nákupu.
- Ceny jsou nejvyšší z kanálů; u bazarových sestav je běžná marže bazaristy nad rámec našeho zisku.
- Balík často obsahuje **jiné zboží navíc** — set, sestavu, nebo jen jednotlivé díly. Co přesně je v ceně, je nutné
  vyjednat předem, jinak hrozí sporná reklamace.
- Výběr je omezený na to, co bazar v okamžiku má. Rezervace neexistuje, kdo dřív přijde, má díl.

### Typická rizika

| Riziko | Pozor na |
| --- | --- |
| Reklamace bude směrována na bazar, ne na původního vlastníka | Bazarista mohl koupit vybavení z jiného zdroje. Do protokolu zaznamenat sériové číslo a stav. |
| Zboží neodpovídá popisu | Srovnat obsah balíku s objednávkou na místě, až pak potvrdit převzetí. |
| Chybí sériové číslo na faktuře | Bez odsouhlaseného sériového čísla nelze později prokázat, o jaký kus šlo. |
| Zdržení výdeje | Objednávku považovat za nesloženou, dokud zboží není fakticky převzato. |
| Bazarista posílá odkaz na platbu | Platba jde přes platformu, ne přes odkaz zaslaný v chatu. |

### Co vyjednat předem

- [ ] Přesný seznam dílů v balíku, ideálně i sériové číslo každého hlavního dílu.
- [ ] Odsouhlasit seznam sériových čísel na faktuře nebo v objednávce — slouží jako důkazní podklad pro případnou reklamaci.
- [ ] Co balík obsahuje navíc a co je jen příslušenství.
- [ ] Výkonnostní třídy jednotlivých kusů, pokud je bazarista uvádí (například výrobce paměti).
- [ ] Zda bazar poskytuje vlastní záruku bazaristy a na co se vztahuje.
- [ ] Zda jde o jednotlivý kus, nebo o výkup bazaru (u výkupu počítat s větším objemem vadných kusů).

## inzerce.cz a Bazoš

Prodej ze soukromí, rychlá dohoda bez prostředníka. Bazoš je inzerátní plocha, inzerce.cz převážně
komerční plocha s kontaktem přes telefon či e-mail.

### Výhody

- Nejnižší vstupní cena — soukromník prodává, co měl doma, bez marže bazaristy.
- Rychlá jednání: dohoda i předání bývají během téhož dne nebo týdne.
- Bazoš má vyhledávání podle klíčových slov a filtrů, takže se dá průběžně hlídat konkrétní modely.
- Sortiment bývá nejrůznější — od jednoho dílu po celé sestavy.

### Nevýhody

- Bez garance platformy: konkurence tipuje cenu, neprodlužuje záruku a neřeší spor.
- Nutnost osobní setkání, dojezdy a strávený čas; hodnota času cestuje není v marži započtena.
- Kontakt mimo platformu (z telefonu do jiných aplikací) mění pravidla hry i možnost nahlášení podvodu.
- Prodej „na dálku" bez možnosti testu je v této síti běžný. Viz `13-pasti-a-podvody.md`.

### Typická rizika

| Riziko | Pozor na |
| --- | --- |
| Podvod platebním odkazem nebo předplatnou | Nikdy neplatíme z chatu; platba v hotovosti při setkání, jinak přes platformu. |
| Vymyšlená konfigurace v inzerátu | Konfiguraci ověřujeme fyzicky, podle `11-due-diligence.md`. |
| Hotová sestava v inzerátu | Bývá to konkurence, ne zdroj dílů — obvykle jen dotahují trh. Někdy je to levný zdroj jednotlivých dílů v bazarovém balíku, to je potřeba posoudit jednotlivě. |
| Výkup bazaru v inzerátu | Objem kusů, skoro všechny „válečné", často bez příslušenství a bez fotek jednotlivých dílů. |
| Rychlé tempo reakce a „výborný stav" v textu | Slova a fotky nejsou argument. Rozhoduje test na místě. |
| Odmítnutí místa nebo otázky na konkrétní test | Znamení, že něco skrývá. |

### Co vyjednat předem

- [ ] Kde a kdy přesně bude setkání (veřejné, dobře osvětlené místo, ve všední den ve dne).
- [ ] Zda prodávající umožní úplný rozebrání sestavy a zapnutí všech komponent.
- [ ] Zda má původní faktury, záruční listy, krabice — bez nich jde jen o doslovný výrok.
- [ ] Zda součástí je originální napájecí adaptér GPU, případně baterie (viz `13-pasti-a-podvody.md`).
- [ ] Zda a v jakém stavu jsou všechny komponenty, ne jen ta, která je na fotce.
- [ ] Rukopis (psaná sjednaná cena) a předání dokladu o zaplacení.

## Facebook Marketplace

Primárně lokální kanál s osobním setkáním, hodně přes skupiny a profily bazarů.

### Výhody

- Nejrychlejší dohoda a nejlevnější způsob přístupu k lokálním bazarovým kusům.
- Setkání v okolí, krátká doba odezvy, možnost rychlého odmítnutí bez cestování.
- Skupiny a profily bazarů fungují jako předfiltrovaný zdroj — často i výkupy.

### Nevýhody

- Nejvyšší riziko podvodu ze všech kanálů: malá kontrola profilu a velká pravděpodobnost neoprávněného prodeje
  cizího majetku.
- Setkání v izolovaném místě (garáž, sklep, okrajové parkoviště) nebo při nočním předání zvyšuje riziko.
- Nízká vymahatelnost — u profilu bez identifikace je reklamace prakticky nemožná.
- Častá komunikace mimo platformu (messenger, telefon, e-mail), kde se těžko dohledá historie.

### Co vyjednat předem

- [ ] Zda prodávající souhlasí s osobním setkáním na veřejném místě ve všední den ve dne.
- [ ] Zda je deklarovaný model a stav shodný s tím, co prodávající tvrdí o sobě (jméno, město, doba členství).
- [ ] Zda umožní otevření krabice a úplnou kontrolu dílů.
- [ ] Zda má k dispozici originální příslušenství a zda je ochotný je ukázat.
- [ ] Zda přijímá pouze hotovost při setkání, případně předem dané podmínky (viz pravidlo 7 výše).

### Pozor na rychlost a profil

- [ ] Profil ověřený u důvěryhodných nákupních skupin, ne jen „lajky" a „doporučení od známých".
- [ ] Rychlá, předem připravená odpověď bez otázek o stav je varov signál.
- [ ] Nabídka pod cenou trhu + naléhavost (dnes, jen dnes, pouze přímým převodem) = téměř vždy podvod.
- [ ] Označení „prodejce bazaru" bez firmy s IČO = bazarový profil, ne bazarista.

## Odkazy na ostatní části nákupního bloku

| Oblast | Dokument |
| --- | --- |
| Vyhodnocení inzerátu před cestou | `11-due-diligence.md` |
| Maximální nákupní ceny | `12-max-ceny.md` |
| Podvody a pasti | `13-pasti-a-podvody.md` |
| Cílová prodejní cena a marže | `../40-tiery/43-cenove-pasmo.md` |
| Tier CPU a GPU | `../40-tiery/41-cpu-tabulka.md`, `../40-tiery/42-gpu-tabulka.md` |
| Referenční sestavy | `../40-tiery/44-referencni-sestavy.md` |
| Evidence nákupu | `../20-prijem-a-sklad/21-prijemka.md` |
| Testovací protokoly | `../30-testovani-a-evidence/31-testovaci-protokoly.md` |

## Srovnání kanálů

| Kritérium | Bazar / Aukro | inzerce.cz / Bazoš | Facebook Marketplace |
| --- | --- | --- | --- |
| Záruce formálně | Záruka bazaristy, řeší se přes platformu | Bez garance | Bez garance |
| Podvodnické riziko | Nízké | Střední až vysoké | Vysoké |
| Ochrana platby | Protismluva | Jen přes bezpečnou platbu v aplikaci platformy, jinak žádná ochrana | Neexistuje |
| Doba do převzetí | Delší (čekání na výdej) | Krátká | Nejrychlejší |
| Náklady navíc | Poplatky Aukra | Doba a cesta | Doba a cesta |
| Nejvhodnější pro | Jednotlivé díly s důkazní hodnotou a ověřeným původem | Levné díly a celé sestavy k rozebrání | Levné a rychle dostupné kusy v okolí |

## Podle coho kanál vybrat

| Co hledáme | První kanál | Druhý kanál |
| --- | --- | --- |
| Jednotlivý citlivý díl (CPU, GPU, zdroj) | Bazar / Aukro | Bazoš s důkladným prověřením |
| Celá sestava k rozebrání za nejnižší cenu | Bazoš | Facebook Marketplace |
| Kompletní sestava s důkazní zárukou a dokladem | Bazar / Aukro | — |
| Výkup bazaru pro dávku dílů | Facebook Marketplace (skupiny) | Bazoš (inzertáty s výkupem) |
| Chybějící specifický model | Bazoš s hlídáním klíčových slov | Facebook Marketplace (skupiny) |

TODO: doplnit výsledky vlastního srovnání kanálů po prvních nákupech (průměrná sleva proti Bazoši, podíl
zmetnutých nabídek, podíl skutečných nákupů) — zdroj: vlastní evidence nákupů `../20-prijem-a-sklad/21-prijemka.md`
a tabulka Sklad v Google Sheets.
