# FLIPCORE — plán dokumentace podniku

## Cíl

Repozitář je greenfield (pouze `.gitignore` + prázdný CI workflow). Vznikne zde **provozní dokumentace podniku FLIPCORE** — nákup bazarových PC komponent (bazar, Bazoš/inzerce.cz, Facebook Marketplace), čištění, testování, složení hotových desktopových sestav a B2C prodej.

Dokumentace je znalostní báze pro provoz, **ne software**. Živá data (evidence skladu, marže, testy, reklamace) patří do Google Sheets.

## Uzavřená rozhodnutí

| Otázka | Rozhodnutí |
|---|---|
| Typ dokumentace | Provozní dokumentace podniku (Markdown v repu) |
| Médium | Markdown + Google Sheets hybrid (procesy v gitu, data v Sheets) |
| Sortiment | Pouze desktop tower |
| Určení tieru | Modelová tabulka, ne „generace" |
| Definice tieru | Podle cílové skupiny |
| HIGH horní hranice | Intel 9.–14. gen + Ryzen 5000/7000 |
| Operační systém | Jen ověřitelný OEM klíč převedený z bazaristy, nebo bez OS |
| Záruka | Dle tieru: LOW 3 M / MID 6 M / HIGH 12 M, reklamace vlastní |
| Prodej | Jen B2C (koncoví zákazníci) |
| Rozsah oblastí | Nákup + DD, čištění + sklad, testy + evidence, cenění + marže, prodej + reklamace, finance |

## Opravené chyby v původním zadání

1. **Překryv 6. generace** (byla v LOW i MID) — odstraněn. „Generace" zůstane jen jako doplňková informace v textu, nikoli jako klíč tieru.
2. **AMD nemá „generace"** — existují Ryzen 1000/2000/3000/5000/7000/9000. Zařazení podle „4./5. gen" u AMD neexistuje a vede k chybným nákupům.
3. **Generace ≠ výkon** — Ryzen 5 5600 (2020) je výkonově srovnatelný s Intel 11. gen, Intel 5. gen je výrazně slabší. Označení „gen" by rozdělilo trh špatně.
4. **Samotné CPU neurčuje tier** — Celeron s RTX 3060 je herní PC, ne kancelářské. Proto:
   **tier sestavy = max(tier(CPU), tier(GPU))**
   a navíc musí splnit minimální specifikaci tieru (RAM, disk, úspornost).

## Model tierů — výchozí kotvy

Kotvy je nutné potvrdit při implementaci; jsou odvozené z cílové skupiny a z cen českého trhu (říjen 2026: kancelářské repasované do ~10 tis. Kč, herní základ 13–20 tis. Kč, výkonější 20–30+ tis. Kč).

### LOW — kancelář, škola, stážista, senior
Office, e-mail, prohlížeč, videohovory, Office 365.
- CPU: Core 2 Duo/Quad a Pentium/Celeron (pouze jako levný zdroj dílů), Athlon 64 X2, FX-4300/6300, Athlon 3000G/3200G, Ryzen 3 1200, **Core i3 gen 4–6, Core i5 gen 4–5**
- GPU: Intel iGPU, GT 1030, RX 550, HD 5770/6670
- Minimum: 8 GB RAM, SSD 240 GB
- OS: **bez Windows** (viz níže) — prodává se jako hardware
- Záruka 3 M

### MID — hráč 1080p/60 fps, univerzální domácí PC
Starší a esports tituly, GTA V, Valorant, CS2 na střední nastavení.
- CPU: **Core i5/i7 gen 6–8** (i5-6600K, i5-7500, i5-8400, i5-8600, i7-7700), **Ryzen 5 1600/2600/3600**, Ryzen 7 1700/2700X, FX-8300/9700
- GPU: GTX 1050 Ti/1060, GTX 1650/1660, RX 470/570/580/590
- Minimum: 16 GB RAM, SSD 480 GB
- OS: jen s TPM 2.0 modulem (gen 8) nebo bez OS
- Záruka 6 M

### HIGH — hráč 1440p, práce s videem/3D, budoucí-proof
- CPU: **Intel gen 9–14** (i5-9400/10400/12400/13400/14400, i7-9700/11700/12700/14700), **Ryzen 5 5000 (5600/5700X), Ryzen 7 5700X/5800X**, Ryzen 5 7000 (7600/7500F), Ryzen 7 7700X/7800X3D
- GPU: RTX 2060/3060/4060, RX 6600/6700 XT/6750 XT/7600
- Minimum: 32 GB RAM, NVMe 1 TB, 550–750 W zdroj
- OS: Windows 11 nativně (TPM 2.0 / fTPM) — jediný tier, kde je výchozí
- Záruka 12 M

### Windows 11 / TPM — rozhodnutí pro LOW a MID
- Intel Core **4.–7. gen**: TPM 2.0 **nemá** → Windows 11 oficiálně nepodporován.
- Intel Core **8. gen**: běžně bez TPM 2.0, řešitelné **samostatným modulem** (cena stovky Kč) — MID.
- AMD **Ryzen 3000/4000**: fTPM chybí.
- AMD **Ryzen 5000+**: fTPM zabudovaný, Windows 11 funguje nativně → HIGH.
- Windows 10 skončil 14. 10. 2025; ESU je prodlouženo do 12. 10. 2027, ale je to odklad, ne řešení.
- **Výslovné pravidlo:** LOW a MID se prodávají jako hardware bez OS, případně s bezplatnou Linux instalací nebo s OEM klíčem od bazaristy. Nikdy se neinstaluje neoriginální klíč ani se nepoužívá bypass TPM.

## Struktura repozitáře

```
README.md                     # vstupní bod, mapa dokumentace, jak začít
docs/
  00-uvod-a-glosar.md         # co je FLIPCORE, scope, pojmy (tier, sestava, díl)
  01-obchodni-model.md        # cílové segmenty, zdroje příjmů, KPI
  10-nakup/
    10-kanaly.md              # bazar, inzerce.cz, Bazoš, FB Marketplace — pravidla a limity
    11-due-diligence.md       # checklist vyhodnocení inzerátu před cestou
    12-max-ceny.md            # tabulka maximálních nákupních cen dle komponenty a stavu
    13-pasti-a-podvody.md     # scam, záložní díly, "nepoužívané" HDD, padlé pasti
  20-prijem-a-sklad/
    21-prijemka.md            # intake checklist a ID systém dílů
    22-cipovani-a-cisteni.md  # SOP čištění (prach, chladiče, termopasta, chemie)
    23-skladovani.md          # vlhkost, ESD, teploty, životnost skladovaných dílů
  30-testovani-a-evidence/
    31-testovaci-protokoly.md # CPU/GPU/RAM/SSD/PSU — co se testuje a jak
    32-evidence-komponent.md  # ID, fotky, seriály, propojení na Sheets
  40-tiery/
    40-tier-definice.md       # pravidlo max(CPU, GPU), minimální spec, hranice
    41-cpu-tabulka.md         # model → tier (referenční tabulka)
    42-gpu-tabulka.md         # model → tier
    43-cenove-pasmo.md        # cílová prodejní cena a min. marže per tier
    44-referencni-sestavy.md  # 3 sestavy na tier jako vzor skládání
  50-sestavovani/
    51-kompatibilita.md       # socket, generace RAM, wattáž zdroje, verze BIOS
  60-prodej/
    61-prodejni-kanaly.md     # Aukro, Bazoš, FB, vlastní e-shop/prodejna
    62-sablona-inzeratu.md    # text, fotografie, co uvést a co nikdy neuvádět
    63-objednavka-a-dovod.md  # rezervace, platba, osobní odevzdání vs. zásilka
    64-prodejni-podminky.md   # reklamační řád, záruka dle tieru, stav "bazarové zboží"
  70-finance/
    71-kalkulace-marze.md     # vzorec, co se započítává do nákladů, min. marže
    72-cashflow.md            # cash flow, doba obratu, financování nákupů
    73-rozpocet-a-break-even.md
  80-reporting/
    81-weekni-report.md       # co sledovat každý týden
templates/
  prijemka.md
  test-protokol.md
  inzerat.md
  reklamace.md
  odmitnuti-nakupu.md
.github/workflows/blank.yml   # GitHub starter šablona → nahradit lintem dokumentace
AGENTS.md                      # instrukce pro agenty (viz úloha 0)
```

## Google Sheets (evidence)

Čtyři tabulky, propojené c foreign key na ID sestavy:

1. **Sklad** — `ID dílu`, typ, model, stav (nový/výborný/dobrý/vadný), tier, nákupní cena, dodavatel/odkaz, datum nákupu, umístění, datum odpisu
2. **Sestavy** — `ID sestavy`, tier, seznam dílů (ID), celkové náklady, prodejní cena, marže %, stav (ve výstavbě / na skladě / prodáno / reklamace)
3. **Testy** — `ID sestavy`, datum, test, výsledek, teploty, poznámka, odkaz na fotky
4. **Reklamace** — `ID sestavy`, zákazník, datum, závada, vyřešení, náklad, příčina (pro zpětnou vazbu do nákupu)

## CI

`.github/workflows/blank.yml` je **GitHub starter šablona** — soubor sice nejmenuje „build", ale job `build` jen volá `echo Hello, world!`. Nic nestaví, netestuje, nelintuje. Nahradit obsah:

- `markdownlint` nad `docs/` a `templates/` (a `README.md`, `AGENTS.md`)
- kontrola interních Markdown linků (aby odkazy mezi dokumenty nebyly mrtvé)
- obě kontroly v jediném jobu; fail = PR nesmí projít
- workflow ponechat na triggery `push`/`pull_request` na `main` + `workflow_dispatch`, jak je v souboru teď

Pozor: kořenový `.gitignore` obsahuje jediný řádek `a`. Nechrání nic. Jestli se pro markdownlint přidá Node toolchain, musí se doplnit `node_modules/` (viz úloha 0).

## Úlohy — pořadí implementace

0. **`AGENTS.md`** — viz samostatná sekce níže. Musí vzniknout jako první, aby další agenti neskládali aplikaci.
1. `README.md` jako vstupní bod + `docs/00-uvod-a-glosar.md` (glosář je nutný, protože „tier" a „sestava" se v bazarové mluvě používají nejednotně)
2. **Tabulky tierů** (`40-*`, `41-*`, `42-*`) — jádro projektu, ostatní dokumenty na ně navazují. Potvrdit kotvy z tohoto plánu.
3. `40-tier-definice.md` s pravidlem `max(CPU, GPU)` a s explicitními hranicemi
4. `43-cenove-pasmo.md` a `44-referencni-sestavy.md` — 3 sestavy na tier
5. Nákupní blok (`10-*`) — pravidla kanálů, DD checklist, tabulka maximálních cen
6. Příjem, čištění, sklad (`20-*`) + `templates/prijemka.md`
7. Testování a evidence (`30-*`) + `templates/test-protokol.md`
8. Kompatibilita a skládání (`50-*`)
9. Prodej a reklamace (`60-*`) + `templates/inzerat.md`, `templates/reklamace.md`
10. Finance (`70-*`) — kalkulace marže založená na reálných nákupních cenách, ne odhadu
11. Reporting (`80-*`)
12. Google Sheets — 4 tabulky se strukturou sloupců popsanou v `docs/`
13. CI: markdownlint + link check

## Úloha 0 — `AGENTS.md` (hotový obsah)

`AGENTS.md` v repu zatím **neexistuje** a není co zlepšovat. Repo prozkoumáno: žádný README, žádný package manifest, žádný `kilo.json`, žádný existující instrukční soubor. Následující text zachycuje jen věci, které by agent bez něj fakticky přehlédl.

```markdown
# AGENTS.md

## Co tohle za repo

**Není to softwarový projekt.** Toto je dokumentační repozitář pro podnik FLIPCORE —
nákup bazarových PC komponent, čištění, testování, složení desktopových sestav a B2C prodej.
Není tu žádný build, žádný balíček, žádný zdrojový kód aplikace.

**Nezakládej aplikaci.** Neexistuje `package.json`, `pyproject.toml` ani jiný manifest.
Pokud úloha zněla „přidej skladovou evidenci", správná odpověď je tabulka v Google Sheets
nebo Markdown, ne kód. Software až když Sheets přestane stačit — to je explicitně mimo rozsah.

Dokumenty jsou psané **česky**. Odpovědi, commit messages i dokumenty patří do češtiny.

## Kde co je

| Cesta | Obsah |
|---|---|
| `docs/` | Provozní dokumentace, rozdělená podle oblastí (`10-nakup`, `20-prijem-a-sklad`, `30-testovani-a-evidence`, `40-tiery`, `50-sestavovani`, `60-prodej`, `70-finance`, `80-reporting`) |
| `templates/` | Šablony dokumentů k vyplnění (příjemka, test-protokol, inzerát, reklamace) |
| `README.md` | Vstupní bod a mapa dokumentace |
| `AGENTS.md` | Tento soubor |

Číslovka v názvu souboru určuje pořadí čtení. `00`–`01` jsou úvod, `10`+ jsou jednotlivé
procesní bloky. Při přidávání dokumentu zachovej číslovku — odkazy v README na ni navazují.

## Podmínky, které nejsou v kódu

Tato pravidla jsou **obchodní rozhodnutí**, ne implementace. Nedohaduj je jinak:

- **Tier = max(tier(CPU), tier(GPU)).** Generace CPU sama o sobě tier neurčuje.
  Celeron s RTX 3060 je herní sestava, ne kancelářská.
- **Tier se určuje modelem, ne generací.** U AMD neexistují „4./5. generace" —
  existují Ryzen 1000–9000. Ryzen 5 5600 je výkonově Intel 11. generace,
  ne Intel 5. generace. Tabulky: `docs/40-tiery/41-cpu-tabulka.md`, `42-gpu-tabulka.md`.
- **LOW a MID se prodávají bez Windows.** Intel 4.–7. gen nemá TPM 2.0, 8. gen řešitelné
  modulem, Ryzen 5000+ má fTPM nativně. Nikdy neinstaluj neoriginální klíč ani bypass TPM.
- **Prodej je B2C.** Sortiment je pouze desktop tower. Žádné notebooky, AIO, Mini-PC, konzole,
  žádný B2B.
- **Záruka dle tieru:** LOW 3 M / MID 6 M / HIGH 12 M, reklamace se vyřizují vlastní silou.
- **Licence k OS se převádí, nevyrábí.** Pouze ověřitelný OEM klíč z bazarového PC, nebo prodej
  bez OS.
- Ceny v `43-cenove-pasmo.md` a `12-max-ceny.md` jsou **orientační odhady**, ne smluvní
  údaje. Doplní se z reálných nákupů. Necituj je jako aktuální tržní data.

## Ověření změn

Není tu testovací sada. Jediné co se dá spustit je lint dokumentace přes GitHub Actions
`.github/workflows/blank.yml`.

Pozor: soubor se jmenuje `blank.yml`, ale je to **GitHub starter šablona** — job `build`
v něm jen volá `echo Hello, world!`. Není to žádný skutečný build. Nepředpokládej z jeho
názvu ani z existence jobu `build`, že repo něco staví. Úloha pro CI je nahradit jeho obsah
markdownlintem a kontrolou interních linků.

Do té doby je jediné ověření změn ruční:

1. Odkazy v `README.md` vedou na existující soubory.
2. Nový dokument má číslovku odpovídající svému bloku.
3. Pokud se mění tier, aktualizuj `41-cpu-tabulka.md` **i** `44-referencni-sestavy.md`
   spolu — jinak zůstanou v rozporu.
4. Každý nový řádek v tier tabulkách má uvedené **zdůvodnění**, ne jen hodnotu.

## Pasti repozitáře

- Kořenový `.gitignore` obsahuje **jediný řádek `a`**. Neignoruje nic. Pokud přidáš Node
  toolchain pro markdownlint, musíš doplnit `node_modules/` — jinak se commitne.
- `.kilo/.gitignore` není konfigurace projektu, je to runtime stav Kilo (ignoruje
  `node_modules`, `package.json`, lockfiley, `agent-manager.json`). **Není to manifest
  a není to zdroj pravdy pro repo.**
- Nebuduj tu „dummy aplikaci", aby „něco fungovalo". Prázdno je záměr.
- Žádné ceny, výkonová čísla ani benchmarky nevymýšlej. Když údaj chybí, napiš do dokumentu
  `TODO` s odkazem na zdroj dat, která doplní.
```

## Validace

- Každý workflow (nákup → čištění → test → složení → prodej) má **checklist, který lze provést jedním člověkem bez znalosti kontextu**. Otestovat na jednom reálném kusu od příjmu po inzerát.
- Každá položka v `41-cpu-tabulka.md` a `42-gpu-tabulka.md` musí mít uvedený tier a **zdůvodnění** — tabulka bez důvodu se po půl roce rozpadne.
- Dry-run marže: na jednom skutečně nakoupeném kusu spočítat náklady proti cílové ceně z `43-cenove-pasmo.md` a porovnat s reálnou prodejní cenou.
- CI projde na PR s dokumentací.

## Rizika a otevřené body

- **Právní rámec**: prodej bazarového zboží B2C spadá pod zákon o spotřebiteli. Krátší smluvní záruka u použitého zboží je dovolena (§ 1702 OZ), ale právo spotřebitele na reklamaci pro nesoulad se smluvou tím není automaticky vyloučeno. **Toto je nutné konzultovat s právníkem/pojišťovnou odpovědnosti za výrobky** a výsledek zapsat do `60-prodejni-podminky.md`. V plánu je to uvedeno jako výslovná poznámka, ne jako právní stanovisko.
- **Ekonomika**: všechny cenové hodnoty v plánu jsou orientační odhady z trhu říjen 2026. `12-max-ceny.md` a `43-cenove-pasmo.md` se musí doplnit o skutečné nákupní a prodejní ceny z prvních nákupů, jinak je marže jen vymyšlená.
- **Tier jako prodejní label**: tier musí být v inzerátu čitelný pro laika („kancelářská / herní / výkonná"), ne jako technický label. `40-tier-definice.md` má obsahovat obě pojmenování.
- **Windows 11 v LOW/MID** je záměrně omezený a zákazníci si budou stěžovat. `60-prodejni-podminky.md` musí obsahovat jasné upozornění, že LOW/MID běží bez podporovaného OS.

## Mimo rozsah

- Jakýkoliv kód / aplikace pro evidenci (dokumentace popisuje Sheets jako zdroj pravdy; software až když Sheets přestane stačit)
- Notebooky, AIO, Mini-PC, konzole
- B2B prodej, pronájem, servisní zakázky
- Ceny a marže pro GPU nad HIGH tier
- Reálná cenová data trhu (doplní se z prvních nákupů)