# ADR 001: Aplikace běží na ukázkových datech, dokud nejsou hotové všechny funkce

- Status: Přijato
- Datum: 2026-09-29
- Dotýká se: persistence, datové vrstvy, plánování prací
- Nahrazuje: nic

## Kontext

Aplikace potřebuje data, aby se dala navrhnout a otestovat rozhraní: přehled skladu,
marže, kontrola kompatibility sestav, výpočet DPH. Zároveň není rozhodnuto, jaká databáze
a klient se použijí — to je otevřená otázka v [architektuře](../architektura.md#persistence)
a blokuje i přihlášení, protože relace bez uloženého uživatele nemají kde být.

Dvě možnosti:

1. **Zavést persistence hned**, i když zbytek produktu ještě neexistuje. Vznikne prázdná
   databáze, schéma a vrstva dotazů, kterou budeme stejně přepisovat s každou další
   entitou z [dokumentu funkce](../funkce/_template.md).
2. **Jít dál na ukázkových datech** a persistence zavést až ve chvíli, kdy budou známé
   skutečné dotazy a objemy, které aplikace potřebuje.

Rozhodující okolnost: požadavek vlastníka projektu, že vše zůstává ukázkové, dokud
nebudou fungovat všechny funkce. Persistence by v tomto stavu byla práce, která se dá
udělat, ale výsledek by se hned zase měnil.

## Rozhodnutí

Aplikace běží nad ukázkovými daty v `src/server/repo/data.ts` a persistence se nezavádí,
dokud nejsou hotové všechny plánované funkce a nejsou známé skutečné dotazy a objemy.
Všechny stránky jsou proto read-only a nesmějí nabídnout zápis dat.

Ukázková data jsou vlastní vrstvou repozitáře (`src/server/repo/`), ne volitelnou hodnotou
uvnitř UI. Jakmile bude persistence zvolena, mění se jen `src/server/repo/`; stránky
zůstávají. Ukázkový režim je v uživatelském rozhraní výslovně označen, aby se nezaměnil
za ostrá data.

## Důsledky

- Repozitář může růst po jednotlivých funkcích bez migrací a bez schématu, který se
  hned mění. Každý nový datový model se nejprve projeví jako typ v `src/lib/domain/types.ts`
  a jako testy, ne jako tabulka.
- Chybí všechny funkce závislé na zápisu: uložení nastavení, CRUD nabídek, košík,
  objednávky, zadávání zásahů repasu. **Zápis dat proto nesmí být součástí žádné nové
  funkce, dokud tento ADR neplatí.** Funkce, která potřebuje zápis, se nejprve domluví.
- Není možné ověřit výkon, stránkování ani chování při síťovém selhání. Data jsou
  předrenderovaná staticky.
- Obchodní výpočty jsou oproti skutečné databázi v bezpečné pozici: jsou čisté funkce
  nad celými sadou dat, takže se dají testovat bez serveru a přenesou se do dotazů beze
  změny.
- Toto rozhodnutí je záměrně dočasné a má jasnou podmínku ukončení: persistence se
  zavádí v okamžiku, kdy je hotová první funkce vyžadující zápis a je známý výběr
  databáze. Rozhodnutí se pak nahradí novým ADR, který odkáže na tento.

Poslední aktualizace: 2026-09-29
