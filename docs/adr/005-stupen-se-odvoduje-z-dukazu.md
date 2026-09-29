# ADR 005: Stupeň A–D se odvozuje z důkazů, nedá se zvolit ručně

- Status: Přijato
- Datum: 2026-09-29
- Dotýká se: domény, zápisu dat, UI, bezpečnosti
- Navazující dokl.: [dokument funkce 005](../funkce/005-repas-a-ohodnoceni.md), [dokument funkce 001](../funkce/001-repas-a-stavove-hodnoceni.md), [ADR 002](002-sqlite-a-drizzle-pro-ukazkove-funkce.md)

## Kontext

Dokument funkce 001 zavádí škálu stavového hodnocení `A`–`D` a říká, že každý stupeň
musí mít důkaz. Neříká však, **kdo ten stupeň přiděluje** a podle jakého pravidla.
Bez toho se při implementaci I3 nabízela přirozená cesta: na detailu kusu udělat
formulář s výběrem ze čtyř hodnot, tlačítkem „zapsat" a repovrstvu, která dostane
hodnotu a uloží ji. Cesta je o hodinu kratší a vypadá přesně podle zadání
„zaznamenat stavové hodnocení".

Je ale v rozporu s tím, proč škála vůbec vznikla. Účelem stavového hodnocení je
nahradit odhad úsudkem opřeným o záznamy. Hodnocení, které zvolí člověk z nabídky
čtyř písmen, je odhad, jen zapsaný do tabulky — a navíc je jediným místem v celé
datové vrstvě, kde by klient mohl podvrhnout hodnotu, kterou pak nelze dohledat.
U cen má aplikace podobné pravidlo už od I2: cenu sice zadává provozovatel, ale
server ji znovu ověřuje a ukládá sám. Hodnocení je ale jiná veličina — provozovatel
není autoritou, je zapisovatel.

Druhý problém je definice „důkazu". Dva programátoři implementující „stupeň z
důkazů" přirozeně napíšou různá pravidla: jeden bude počítat všechny testy na
kusu, druhý jen ty od posledního zásahu; jeden nechá selhání přepsat pozdějším
průchodem, druhý ne. Výsledek — dvě aplikace se stejnými daty a různými písmeny u
stejného kusu. To je přesně ta třída vady, kterou škála měla odstranit.

## Rozhodnutí

**Stupeň je výstup čisté funkce `odvodStupne(doklady)` nad zásahy a testy kusu,
nikoli volba provozovatele.** Platí to na všech vrstvách a je to součást kontraktu,
ne doporučení:

- **Žádný formulář nemá pole pro stupeň.** Ani formulář zásahu, ani formulář testu,
  ani samostatné potvrzení hodnocení.
- **Žádná serverová akce stupeň z `FormData` nečte.** `ohodnotitKus` má
  `FormData` jen proto, že `useActionState` vyžaduje třetí parametr; hodnotu
  zahazuje (`void _formulare`) a stupeň si spočítá sama nad důkazy načtenými
  repozitářem. Klientem poslaný stupeň se nesmí použít ani jako podmínka.
- **Pravidla žijí jednou, v `src/lib/domain/repas.ts`.** Repozitář stupeň
  neodvozuje ani nepočítá — dostane hotové `stupen` + `duvod` a zapíší je. Druhá
  implementace pravidel je chyba, i kdyby dávala stejný výsledek.

**Čerstvé důkazy.** Hodnotí se důkazy od posledního zásahu kusu včetně jeho data:

- `posledniZasah` = nejpozdější `provedenoKdy` mezi zásahy kusu.
- Test je čerstvý, pokud `Date.parse(test.provedenoKdy) >= Date.parse(posledniZasah)`.
  Test se stejným datem jako zásah už čerstvý je.
- Kus **bez zásahu** nemá `posledniZasah` a všechny jeho testy jsou čerstvé.
- Zásahy se jako čerstvé ani staré neposuzují. Pravidlo 2 pracuje s tím, že zásah
  na kusu existuje vůbec.

Důvod: zásah je záznam, který původní stav přepsal. Hodnocení platí ke konkrétnímu
okamžiku, ne ke kusu obecně — a starý test by jinak kryl nový zásah.

**Pevné pořadí pěti pravidel. První splněné vyhrává**, pořadí se nesmí prohodit
ani přeskočit:

| # | Podmínka na čerstvé důkazy                | Výsledný stupeň |
| - | ---------------------------------------- | -------------- |
| 1 | Existuje test s `vysledek: "selhal"` (libovolného typu) | `D` |
| 2 | Existuje zásah na kusu a **ne** existuje čerstvý test `profil` + `prosel` | `C` |
| 3 | Existuje čerstvý test `profil` + `prosel` a existuje čerstvý test `vizualni` s `nalezenaVada: true` | `B` |
| 4 | Existuje čerstvý test `profil` + `prosel` a existuje čerstvý test `vizualni` s `nalezenaVada: false` | `A` |
| 5 | Jinak                                   | žádný stupeň    |

Selhání je první proto, že se nesmí přebodovat lepším testem: profil prošel, ale
funkční selhal, kus není funkční a výsledek je `D`. `A` a `B` vyžadují profilový
test **a** vizuální kontrolu, `C` zásah, `D` zápis o selhání — žádná kombinace
důkazů nedá stupeň bez svědectví. `VysledekTestu: "casti"` nespouští pravidlo 1
(částečný průchod není selhání) a není `prosel`, takže `A` ani `B` neudělá.

Pravidlo 5 není chyba ani odhad. Kus **zůstává ve stavu `v_repasu`** a `duvod`
říká, co doplnit. `odvodStupne` vrací `duvod` vždy, i když stupeň vznikne — jde do
`popis` hodnocení, protože hodnocení musí být čitelné bez znalosti pravidel.

**Hodnocení je vazba 1:N a oprava stupně je nový řádek.** Aktuální stupeň je
hodnocení s nejpozdějším `zhodnocenoKdy`; starý zůstává dohledatelný.
`UPDATE` nad `condition_grade` je v této funkci zakázaná operace. Důvod:
chybně udělený stupeň musí být opravitelný bez ztráty informace, že byl někdy
udělen — a to je přesně to, co bazar potřebuje, když se na stupeň ptá kupující.

## Důsledky

- **Jednotná škála pro všechny kategorie, žádné výjimky.** Výjimka by vyžadovala
  definovat požadované testy pro každou kategorii zvlášť, a to je práce, která se
  musí odložit, dokud nevznikne reálný seznam testů z provozu. Vymýšlení důkazů
  pro každou kategorii by bylo odhadem, ne evidencí, a škála by pak nebyla
  doložitelná. Seznam povinných testů pro kategorii se může doplnit později, ale
  nesmí přijít jako výjimka ze škály.
- **Bez zásahu jde `A` nebo `B` získat jen z profilového testu a vizuální
  kontroly.** Kus `vykoupeno`, na kterém nikdo nepracoval, nemá jak mít stupeň —
  to je zamýšlené, ne chybějící krok.
- **Žádný stupeň tak nevznikne jen u kusu bez zásahu a bez čerstvého profilového
  průchodu.** U kusu, kde zásah je, pravidlo 2 odvodí nejméně `C`; u kusu bez
  zásahu musí projít čerstvý profilový test, jinak spadne na pravidlo 5.
- **`nalezenaVada` a `nahradniDil` jsou měření, ne úsudek.** `nalezenaVada` je
  jediný způsob, jak se kosmetická vada dostane do logiky, a je smysluplné jen u
  typu `vizualni` — mimo něj je to chyba (`superRefine`), ne varování, protože by
  pravidla 3 a 4 potichu změnila. `nahradniDil` nese informaci, **co** bylo
  vyměněno; u typu `vymena` s `nahradniDil: false` je rozpor a validace ho odmítne.
- **Formulář pro potvrzení není formulářem pro zadání.** `formular-ohodnoceni.tsx`
  zobrazí, co se uloží, a tlačítko je neaktivní, dokud z důkazů stupeň neplyne.
  Chybějící důkaz je chybějící důkaz — doplnit ho musí zásah nebo test.
- **Autorizace je dluh, ne rozhodnutí.** V této iteraci je aplikace
  jednoprovazorová, takže autorizace žádná není; hodnocení uděluje provozovatel
  FLIPCORE a kupující ho může zpochybnit až s veřejným katalogem. Při zavedení
  přihlášení **musí každá akce v `src/server/actions/repas.ts` začít kontrolou
  relace a ověřením role** — stejně jako `src/server/actions/vykup.ts`. Kdyby se
  stupeň dával zvolit, kontrola role by nestačila, protože by musela chránit
  hodnotu místo výpočtu.
- **Co zůstává otevřené:** časová platnost hodnocení (dnes žádná — datum posledního
  testu je informace pro provozovatele, ne podmínka platnosti), ukládání příloh
  důkazů, seznam povinných testů pro konkrétní kategorii.
- **Co přímo vyplývá z kódu:** `src/lib/domain/repas.ts` (`odvodStupne`,
  `VysledekOhodnoceni`, `DokladyKusu`), žádný vstupní pole pro stupeň v
  `src/components/formular-{zasahu,testu,ohodnoceni}.tsx`, stavová rozhraní
  `StavFormulareZasahu` / `StavFormulareTestu` / `StavFormulareOhodnoceni` bez
  hodnoty `stupen` na vstupu, zákaz `UPDATE` v `zapsatOhodnoceni`.

## Zamítnuté alternativy

- **Ruční výběr stupně z rozbalovacího seznamu.** Nejrychlejší k implementaci a
  přesně to, čemu má škála zabránit: dává do tabulky odhad bez důkazu, dává
  provozovateli možnost zapsat `A` kusu, který nikdo netestoval, a dává klientovi
  hodnotu, kterou jde podvrhnout. Zamítnuto.
- **Ruční stupeň jako výchozí s odvozeným jen jako varování.** Zdánlivě
  kompromisní: provozovatel může přepsat, když má lepší znalost. Ve skutečnosti by
  zpravilo pravidlo 1 neplatným — selhání by se dalo přepsat na `A`, protože
  „provozovatel víc" by nebyl důkaz. Zamítnuto.
- **Časová platnost hodnocení** (stupeň po určité době zhasne, kus se vrací do
  repasu). Přirozená myšlenka, ale v bazarovém oběhu je opakovaný test dražší než
  samotný stupeň a bez znalosti skutečného stavu skladu by automatická expirace jen
  množila zásahy na kusy, které nikdo nechce prodávat. Nejdřív je potřeba vidět,
  jestli vůbec stárnou. Zamítnuto **pro tuto iteraci** jako podmínka platnosti;
  datum posledního testu se zobrazuje v detailu kusu jako informace. Otázka zůstává
  otevřená.
- **Workflow zásahu** (`received → diagnostics → repair → testing → grading →
  done` z [ROADMAP](../../ROADMAP.md)). Vnitřní aplikace má jednoho provozovatele,
  který nemusí hlídat, v jaké fázi práce je. Zavedení přinese až více lidí
  v aplikaci nebo více pracovišť; do té doby by to byl stav navíc, který by nikdo
  nečetl. Zamítnuto pro I3, `RepairTicket` zůstává prostý záznam historie.
- **Speciální pravidla pro kategorie komponent.** U každé kategorie by bylo nutné
  vymyslet, které testy jsou povinné, a škála by se rozdělila na výjimky, které by
  se později může ukázat, že nejsou potřeba. Zamítnuto: škála zůstává jednotná a
  seznam důkazů pro kategorii přijde až z reálného provozu.

Poslední aktualizace: 2026-09-29
