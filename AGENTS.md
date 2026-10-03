# AGENTS.md

## Co tohle za repo

- **Není to softwarový projekt.** Dokumentační repo pro podnik FLIPCORE. Není tu žádný build, žádný balíček, žádný zdrojový kód aplikace.
- **Nezakládej aplikaci.** Chybí `package.json`, `pyproject.toml` i jiný manifest. Úloha „přidej skladovou evidenci" znamená tabulku v Google Sheets nebo Markdown, ne kód. Software až když Sheets přestane stačit.
- Dokumenty jsou české. Odpovědi, commit messages i dokumenty patří do češtiny. Výjimka: `LOW` / `MID` / `HIGH` jako technický label.

## Kde co je

- `docs/` — dokumentace po číselkovaných blocích: `00-uvod-a-glosar.md`, `01-obchodni-model.md`, `10-nakup`, `20-prijem-a-sklad`, `30-testovani-a-evidence`, `40-tiery`, `50-sestavovani`, `60-prodej`, `70-finance`, `80-reporting`
- `templates/` — šablony k vyplnění (příjemka, test-protokol, inzerát, reklamace, odmítnutí nákupu)
- **Číslovka určuje pořadí čtení a `README.md` na ni odkazuje.** Při přidávání souboru ji zachovej.
- Relativní odkazy: z kořene `README.md` ukazují `docs/...`; z `docs/00` a `docs/01` jde o jednu úroveň (`10-nakup/10-kanaly.md`, `../templates/...`); z bloků dvě úrovně (`../40-tiery/41-cpu-tabulka.md`, `../../templates/inzerat.md`). **Zkontroluj hloubku, jinak odkaz vede jinam** — poznáš to až podle mrtvých odkazů v CI.

## Podmínky, které nejsou v kódu

Toto jsou **obchodní rozhodnutí**, ne implementace. Nedohaduj jinak:

- **tier sestavy = max(tier(CPU), tier(GPU))**. Celeron s RTX 3060 je herní sestava, ne kancelářská.
- **Tier se určuje modelem, ne generací.** U AMD nejsou „4./5. generace" — existují Ryzen 1000–9000. Ryzen 5 5600 je výkonově Intel 11. generace, ne Intel 5. generace.
- **Intel 4.–7. gen nemá TPM 2.0** → Windows 11 oficiálně nepodporován. **Intel 8. gen řešitelné modulem. Intel 9. gen fTPM nemá.** AMD Ryzen 5000+ má fTPM nativně. Proto HIGH **neznamená automaticky Windows 11 nativně**.
- **LOW a MID se prodávají bez Windows.** Windows 10 skončil 14. 10. 2025, ESU do 12. 10. 2027 je jen odklad.
- **Licence k OS se převádí, nevyrábí.** Jen ověřitelný OEM klíč z bazarového PC, nebo prodej bez OS. Nikdy neoriginální klíč, nikdy bypass TPM.
- **Prodej je jen B2C. Sortiment je jen desktop tower.** Žádné B2B, notebooky, AIO, Mini-PC, konzole, pronájem, servisní zakázky.
- **Záruka dle tieru:** LOW 3 M / MID 6 M / HIGH 12 M, reklamace vlastní silou.
- **Prodejní label nesmí být silnější než sestava.** Sestava je HIGH, když má silný CPU *nebo* silnou GPU — to neznamená, že hraje na 1440p. Do titulku inzerátu se `1440p` píše jen po vlastním ověření.
- Ceny v `docs/40-tiery/43-cenove-pasmo.md` a `docs/10-nakup/12-max-ceny.md` jsou **orientační odhady**, ne smluvní údaje. Minimální marže LOW 30 % / MID 25 % / HIGH 20 % je rozhodnutí k potvrzení z reálných prodejů. Necituj je jako aktuální tržní data.

## Ověření změn

Není tu testovací sada. Jediné co se spouští je lint dokumentace v `.github/workflows/blank.yml` — **název souboru je `blank.yml`, ale už to není GitHub starter šablona**, job se jmenuje `lint` a používá markdownlint a kontrolu odkazů. Nepředpokládej z názvu souboru, že je to placeholder; otevři ho a podívej se.

Ruční kontrola, když CI nejde nebo neexistuje:

1. Odkazy v `README.md` vedou na existující soubory.
2. Nový dokument má číslovku odpovídající bloku.
3. Změna tieru se propíše současně do `docs/40-tiery/41-cpu-tabulka.md` **i** `docs/40-tiery/44-referencni-sestavy.md` — jinak zůstanou v rozporu.
4. Každý nový řádek v tier tabulkách má uvedené **zdůvodnění**, ne jen hodnotu.

## Pasti repozitáře

- Kořenový `.gitignore` **chrání prakticky nic** — pokud přidáš Node toolchain pro markdownlint, musíš doplnit `node_modules/`.
- `.kilo/.gitignore` není konfigurace projektu, je to runtime stav Kilo (ignoruje `node_modules`, `package.json`, lockfiley, `agent-manager.json`). **Není to manifest a není zdroj pravdy pro repo.**
- Nebuduj „dummy aplikaci", aby něco fungovalo. Prázdno je záměr.
- Nevymýšlej ceny, benchmarky, výkonnostní čísla ani lhůty. Chybí-li údaj, napiš do dokumentu `TODO: <co doplnit> — zdroj: <kde zjistit>`.
- Právní a daňové pasáže v `docs/60-prodej/64-prodejni-podminky.md` a `docs/70-finance/73-rozpocet-a-break-even.md` jsou **kontrolní seznamy k ověření s odborníkem**, ne stanovisko. Nepřidávej do nich vlastní právní závěry.
