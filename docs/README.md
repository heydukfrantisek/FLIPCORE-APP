# Dokumentace FLIPCORE

Index dokumentace a závazná pravidla, jak s ní pracovat. Tento dokument je jediným místem, kde se rozhoduje, **co se dokumentuje a kdy**. Obsah samotných dokumentů zde neopakujeme — sem se jen odkazujeme.

Obsah dokumentace:

- [Vize produktu](vize.md) — proč produkt existuje, pro koho, tři pilíře, cenové kategorie, co do produktu nepatří.
- [Architektura](architektura.md) — vrstvy a struktura adresářů, klíčová rozhodnutí, datový model, routy, persistence, bezpečnost.
- [Dokumenty funkce](funkce/) — jeden dokument na jednu funkci, vždy podle [šablony](funkce/_template.md).
- [ADR](adr/README.md) — záznamy nevratných architektonických rozhodnutí.
- [ROADMAP.md](../ROADMAP.md) — pořadí a rozsah prací, definice hotovosti. Zdroj pravdy o tom, **co se dělá a v jakém pořadí**.

Odkazy mimo `docs/` vedou do kořene repozitáře: [kořenové README](../README.md), [ROADMAP](../ROADMAP.md), [CONTRIBUTING](../CONTRIBUTING.md), [AGENTS.md](../AGENTS.md).

## Mapa dokumentace

| Soubor                                     | Co obsahuje                                                                                                    | Kdy se aktualizuje                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [docs/README.md](README.md)               | Index, mapa, procesní pravidla, konvence, životní cyklus dokumentace                                             | Při přidání nebo odebrání dokumentu a při změně pravidel                                 |
| [docs/vize.md](vize.md)                   | Problém, uživatelské typy, tři pilíře, cenové kategorie, co do produktu nepatří, principy, otevřené otázky      | Při změně cílů produktu, uživatelských typů, pravidel kategorií nebo principů         |
| [docs/architektura.md](architektura.md)   | Vrstvy, struktura adresářů, rozhodnutí, datový model, routy, persistence, bezpečnost a env proměnné             | Při vzniku nové entity, vrstvy, routy, bezpečnostního požadavku nebo při přijetí nového ADR |
| [docs/funkce/_template.md](funkce/_template.md) | Šablona, ze které vzniká každý dokument funkce                                                              | Při změně požadovaných sekcí šablony (změna proběhne i pro budoucí dokumenty)        |
| [docs/funkce/NNN-nazev.md](funkce/)      | Konkrétní funkce: zadání, scénáře, datový dopad, testy, omezení, checklist                                   | Průběžně během implementace a při každé věcné změně chování funkce                      |
| [docs/adr/README.md](adr/README.md)       | Vysvětlení ADR, šablona, index rozhodnutí, záznam základního stacku                                            | Při každém novém nevratném rozhodnutí a při nahrazení rozhodnutí                           |
| [ROADMAP.md](../ROADMAP.md)               | Fáze, priority, definice hotovosti, otevřené otázky, mimo rozsah                                                | Při přidání nebo dokončení položky, při změně fáze nebo priority                        |

Konkrétní číslované dokumenty funkce:

| Dokument                                        | Oblast          | Status  |
| ----------------------------------------------- | --------------- | ------- |
| [000-zalozeni-projektu](funkce/000-zalozeni-projektu.md) | infrastruktura | V produkci |
| [001-repas-a-stavove-hodnoceni](funkce/001-repas-a-stavove-hodnoceni.md) | repas | Plánováno |
| [002-zakladni-sablona-aplikace](funkce/002-zakladni-sablona-aplikace.md) | infrastruktura | Náhled |
| [003-kus-a-persistence](funkce/003-kus-a-persistence.md) | infrastruktura | Rozpracováno |
| [004-evidence-vykupu](funkce/004-evidence-vykupu.md) | sklad | Rozpracováno |

## Jak dokumentaci aktualizovat

Tato část je závazná. Dokumentace není bonus navíc — bez ní nelze změnu považovat za hotovou.

### Kdo

Dokumentaci píše **autor změny**, tedy ten, kdo píše kód. Reviewer zkontroluje, že dokumentace odpovídá změně, a vrátí PR, pokud ne. Nikdo nedokumentuje cizí změnu "zpětně, až bude čas".

### Co musí vzniknout při každé nové funkci

Pro každou **novou funkci** (nová uživatelsky viditelná schopnost, nová obrazovka, nový serverový endpoint, nová datová entita) vzniknou **tři záznamy**:

| Co | Kde | Kdy |
| --- | --- | --- |
| 1. Dokument funkce `docs/funkce/NNN-kebab-nazev.md` | kopie [šablony](funkce/_template.md) | **Před psaním kódu** — zadání, scénáře a datový dopad se rozhodují před implementací, ne po ní |
| 2. Záznam v [ROADMAP.md](../ROADMAP.md) | existující nebo nová položka fáze | **Před spojením PR** |
| 3. Aktualizace [architektury](architektura.md) a případné [ADR](adr/README.md) | jen dotčené oddíly | **Před spojením PR** |

Doplňkově, pokud změna něco znamená pro širší kontext:

- změna produktu (cíl, pravidla, kategorie): upravit [vizi](vize.md),
- vznik nového dokumentu funkce nebo ADR: doplnit **mapu dokumentace výše**,
- změna pravidel, jak se dokumentuje: upravit tento dokument.

K číslování a názvům: dokumenty funkce se číslují průběžně (`000`, `001`, `002`), název je `kebab-case.md` bez diakritiky, a číslo se nepřiděluje, dokud není jasné, že funkce bude součástí repozitáře. O vytvoření souboru rozhoduje autor změny, o krácení nerozhoduje nikdo.

### Kdy

Dokumentace vzniká **průběžně**, ne až na konci:

| Bod procesu                | Co se děje                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| Vytvoření issue / feature flagu | Položka v [ROADMAP](../ROADMAP.md) je přidána a je u ní uveden odkaz na plánovaný dokument funkce |
| Před implementací        | Dokument funkce existuje a části Zadání, Scénáře, Datový dopad a API jsou vyplněné         |
| Během implementace       | Průběžná aktualizace dokumentu, stejně jako průběžná aktualizace testů                      |
| Před spojením PR          | Checklist z [šablony](funkce/_template.md) projit a odškrtnut                               |
| Po spojení PR             | Datum v dokumentu a status se přepíšou na skutečný stav, doba trvání odstraní                |

Dokument, který se mění, se neopravuje "někdy potom": pokud se chování funkce změní, změní se v tom samém PR i její dokument.

### Checklist před spojením PR

Každá změna, která mění chování aplikace, projde těmito body:

- [ ] Dokument funkce existuje a odpovídá skutečnému stavu (ne plánu)
- [ ] Sekce Datový dopad a API/změny v kódu odpovídají kódu v repu
- [ ] Status a Datum jsou aktuální
- [ ] `ROADMAP.md` je aktualizovaný
- [ ] `docs/architektura.md` je aktualizovaný, pokud vznikla entita, vrstva, routa nebo bezpečnostní požadavek
- [ ] Je zapsáno [ADR](adr/README.md), pokud změna je nevratné rozhodnutí
- [ ] Mapa dokumentace výše obsahuje nový dokument
- [ ] `pnpm check` prochází
- [ ] Patička `Poslední aktualizace:` odpovídá dnešnímu datu

Pravidla pro reviewera: bez odškrtnutého checklistu a bez odpovídajícího dokumentu se PR nebere jako hotový. Chybějící dokumentace je důvod k vrátit PR, ne k poznámce.

## Konvence

**Jazyk.** Všechna dokumentace je v češtině, včetně názvů sekcí a popisů polí. Technické názvy, názvy entit, příkazy, cesty a kód zůstávají v angličtině. Dokumenty nejsou překladem kódu do vět, popisují rozhodnutí a chování.

**Názvy souborů.** `kebab-case.md`, bez diakritiky a bez mezer (`repas-a-stavove-hodnoceni.md`, ne `repas-a-stavové-hodnocení.md`). Diakritika v názvech souborů způsobuje problémy v URL, odkazech a na různých souborových systémech.

**Pomlčky v názvu sekce se v textu neřeší.** Diakritika jsou správně uvnitř dokumentu.

**Struktura dokumentu.** Každý dokument začíná nadpisem úrovně 1 a stručnou úvodní větou, komu je určen. Každý dokument končí řádkem `Poslední aktualizace: YYYY-MM-DD`, kde je datum poslední věcné změny obsahu, ne datum vytvoření souboru. Každý dokument obsahuje odkazy na související dokumenty, ať je čtenář nemusí hledat.

**Kam co patří.**

| Informace                               | Patří do                                            | Nepatroží do                                             |
| --------------------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| Proč produkt existuje, pro koho, pravidla kategorií | [vize.md](vize.md)                                 | `architektura.md`, dokumenty funkce                        |
| Co je mimo rozsah                       | [vize.md](vize.md) (produktově) nebo `ROADMAP.md` | `architektura.md`                                         |
| Struktura kódu, vrstvy, aliasy, stack   | [architektura.md](architektura.md)                  | `README.md` v kořeni, který je jen stručný přehled        |
| Datové entity a vztahy                 | [architektura.md](architektura.md)                  | dokumenty funkce (ty jen odkazují)                        |
| Bezpečnost a env proměnné               | [architektura.md](architektura.md)                  | jednotlivé funkce (ty jen uvádějí požadavek)              |
| Routy a URL                             | [architektura.md](architektura.md)                  | `ROADMAP.md`                                              |
| Chování konkrétní funkce, scénáře, testy | [funkce/NNN-nazev.md](funkce/)                    | `architektura.md`                                         |
| Nevratné rozhodnutí a jeho důvod       | [adr/](adr/README.md)                               | `architektura.md` (ten jen shrnuje a odkazuje)             |
| Pořadí a priority práce                 | [ROADMAP.md](../ROADMAP.md)                         | `docs/` (jen odkaz)                                       |
| Příkazy, skripty, start projektu        | [kořenové README](../README.md), [CONTRIBUTING](../CONTRIBUTING.md) | `docs/`                                       |

**Zákaz duplicit.** Informace má jediné místo, ostatní na ni odkazují. Konkrétně:

- Definice polí entit jsou v [architektuře](architektura.md). Dokument funkce uvádí, **co** se mění, a odkáže na architekturu. Nevypisuje se definice celé entity.
- Pravidla cenových kategorií jsou ve [vizi](vize.md). `architektura.md` je nepopisuje, jen na ně odkazuje.
- `ROADMAP.md` je jediným seznamem priorit. `docs/` ho nekopíruje.
- Důvod technického rozhodnutí je v [ADR](adr/README.md). `architektura.md` uvádí jen stručný souhrn.
- Kopie informace vám dá dva místa, která se při změně rozjedou. Pokud nejde vyhnout duplicitě, starší kopii zrušte, než ji označíte jako zastaralou.

**Pravidlo aktualizace `docs/architektura.md` vs. `docs/funkce/`.** Rozdíl je, komu informace slouží:

- Do `docs/architektura.md` jde to, co **platí pro celý systém** a co potřebuje znát kdokoli, kdo do projektu přichází: nová vrstva, nový adresář, nová entita, nový typ routy, změna bezpečnostního požadavku, přijaté ADR.
- Do `docs/funkce/NNN-nazev.md` jde to, co **platí pro jednu funkci**: co dělá, pro koho, jaké má scénáře, testy, známé omezení a co s ní souvisí jako dopad.

Test pravidla: když by o tomto rozhodoval někdo mimo danou funkci, patří to do architektury. Když by to zajímalo jen toho, kdo tu funkci vyvíjí, patří to do dokumentu funkce. Architektura se při tom nepřepisuje kromě případu, když funkce skutečně přidá entitu, vrstvu, routu nebo bezpečnostní požadavek.

**Další pravidla.**

- Žádné HTML v markdownu, žádné emoji. Markdown je prostý text, který se má číst i v terminálu.
- V textu se neduplikují kódové ukázky, které se mění s kódem. Místo toho se uvede cesta k souboru.
- Neznámé informace se nevymýšlí. Chybějící rozhodnutí se zapíše jako otevřená otázka, a to na konci příslušného dokumentu.
- Dokument, který už neplatí, se nechává v historii s označením `Zastaralé` a odkazem na to, kdo jej nahradil. Mazání ztrácí důvod.

## Životní cyklus dokumentace

Dokumentace postupuje spolu s funkčí, ne až za ní.

| Fáze                         | Vstup                              | Dokumentační výstup                                                                 |
| ---------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| 1. Zadání / issue / flag      | Nápad, požadavek, chyba            | Položka v [ROADMAP](../ROADMAP.md). Je-li téma nové, vznikne plánovaný `Návrh` v [vizi](vize.md) nebo nová entita v konceptuálním modelu v [architektuře](architektura.md) |
| 2. Návrh                     | Rozhodnutí o rozsahu funkce        | Dokument funkce vznikne jako kopie [šablony](funkce/_template.md) se stavem `Návrh`, vyplněné Zadání, Scénáře, Datový dopad, API a Otevřené otázky |
| 3. Rozhodnutí                | Nevratné/volitelné otázky          | [ADR](adr/README.md) s kontextem, rozhodnutím a důsledky; proběhlé rozhodnutí se promítne do [architektury](architektura.md) a odstraní se z otevřených otázek |
| 4. Implementace              | Schválený návrh                   | Průběžná aktualizace dokumentu funkce, stejně jako testů. Status přechází na `Rozpracováno` |
| 5. Náhled a testování        | Funkce za feature flagem nebo na náhledové větvi | Doplnění sekcí Testy, Vývojářské poznámky a Známé omezení podle skutečnosti |
| 6. Sloučení PR               | Checklist průchozí                 | Odškrtnutý checklist, aktualizovaný `ROADMAP.md`, aktualizovaná mapa v tomto dokumentu, nová patička s dnešním datem |
| 7. Produkce                  | Merge                             | Status `V produkci`, datum poslední věcné změny. Žádné další papíry, pokud se chování nemění |
| 8. Změna a zpětná vazba      | Úprava, oprava, úbytek používání   | Změna proběhne podle bodu 6. Pokud se mění cíl nebo pravidla produktu, upraví se [vize](vize.md); pokud se mění technický systém, [architektura](architektura.md) |
| 9. Užitečnost                | Funkce dlouho nepoužívaná          | Status `Zastaralé`, dokument zůstane dohledatelný s odkazem na následující řešení |

Zvláštní případ: pokud změna není novou funkcí, ale jen opravou, úpravou textu nebo refaktoringem bez vlivu na chování, nový dokument nevzniká. Aktualizuje se pouze existující dokument, pokud se mění zaznamenané chování, a vždy se aktualizuje patička s datem.

Poslední aktualizace: 2026-09-29
