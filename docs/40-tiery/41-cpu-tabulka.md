# Tabulka CPU — model a tier

**Účel:** Převádí model procesoru na tier a na informaci, zda na něm běží Windows 11.

Pravidla tieru jsou v [40-tier-definice.md](40-tier-definice.md). Tato tabulka je
**referenční** — model, který tu chybí, do sortimentu nekupuj, dokud ho
nedoplníš.

**Tier se určuje modelem, ne generací.** U AMD žádné generace neexistují —
existují řady Ryzen 1000 / 2000 / 3000 / 5000 / 7000 / 9000. Označení
„4. generace" u AMD je chyba. U Intelu je generace pouze orientační zkratka:
Core i5-7500 (7. generace) je v tabulce `MID`, ale výkonem je slabší než Ryzen 5
5600 (`HIGH`, rok 2020).

Sloupce:

- **Socket** — pro kontrolu kompatibility při skládání
  ([51-kompatibilita.md](../50-sestavovani/51-kompatibilita.md)).
- **Tier** — `LOW`, `MID`, `HIGH`, nebo `MIMO ROZSAH`.
- **Windows 11** — stav TPM 2.0 / fTPM. Pravidla v
  [40-tier-definice.md](40-tier-definice.md).
- **Zdůvodnění** — proč právě tento tier.

## Tier LOW

| Model | Socket | Tier | Windows 11 | Zdůvodnění |
| --- | --- | --- | --- | --- |
| Intel Core 2 Duo / Core 2 Quad | LGA 775 | `LOW` | Ne — nemá TPM 2.0 | Dvou- až čtyřjádrový procesor pro kancelářské úlohy, e-mail a prohlížeč; do MID nestačí, ale v bazaru je nejlevnější zdroj DDR2/DDR3 a levných PCIe karet. |
| Intel Pentium, Intel Celeron | LGA 775, LGA 1150 (dle modelu) | `LOW` | Ne — nemá TPM 2.0 | Slouží jako **levný zdroj dílů** (deska, chladič, RAM) a jako úsporné jádro kancelářské sestavy; bazarové kusy mají často odečtené kontakty na CPU, proto před nákupem ověř piny. |
| AMD Athlon 64 X2 | AM2 | `LOW` | Ne — nemá TPM 2.0 | Dvoujádrový procesor pro kancelářské úlohy; platforma AM2 je mimo bazarový trh, kupuje se jen jako náhradní díl. |
| AMD FX-4300 | AM3+ | `LOW` | Ne — nemá TPM 2.0 | Nejslabší z řady FX (čtyři jádra na nízké frekvenci); v kanceláři dostačuje, ale s výkonnou GPU by vytvářel úzké hrdlo. |
| AMD FX-6300 | AM3+ | `LOW` | Ne — nemá TPM 2.0 | O něco rychlejší než FX-4300, ale pořád pod úrovní, z níž začíná `MID`; herní 1080p/60 fps v titulech pro `MID` nezvládne. |
| AMD Athlon 3000G | AM4 | `LOW` | Ne — Ryzen 3000 nemá fTPM | APU s integrovanou grafikou stačí na kancelář, Office a přehrávání videa; chybějící fTPM znemožňuje podporovaný Windows. |
| AMD Athlon 3200G | AM4 | `LOW` | Ne — Ryzen 3000 nemá fTPM | Rychlejší jádro než 3000G, stále ale řada Ryzen 3000 bez fTPM, tedy `LOW` a prodej bez OS. |
| AMD Ryzen 3 1200 | AM4 | `LOW` | Ne — Ryzen 1000 nemá fTPM | Čtyři jádra Zen pro kancelář a lehké domácí úlohy, výrazně lepší než Athlon; slabší než Ryzen 5 1600, který už patří do `MID`. |
| Intel Core i3 gen 4–6 (i3-4130, i3-6100) | LGA 1150 (i3-4130), LGA 1151 (i3-6100) | `LOW` | Ne — 4. a 6. generace nemá TPM 2.0 | Dvě jádra s hyperthreadingem stačí na kancelář, ale jako základ `MID` sestavy chybí rezerva pro CS2 a Valorant. Značka i3 je v `LOW` v generacích 4–6, od 7. generace už nestačí. |
| Intel Core i5 gen 4–5 (i5-4570, i5-3470, i5-2400) | LGA 1150 (i5-4570, i5-3470), LGA 1155 (i5-2400) | `LOW` | Ne — 4. a 5. generace nemá TPM 2.0 | i3 a i5 jsou tu rozdělené **podle generace, ne podle značky**: i3 je dvoujádrový a na kancelářské úlohy stačí, i5 gen 4–5 je čtyřjádrový (i5-2400 dvoujádrový s hyperthreadingem) a je nejlevnější použitelný kancelářský procesor, proto v `LOW`. Od 6. generace (Skylake, i5-6500) začíná `MID`. |

## Tier MID

| Model | Socket | Tier | Windows 11 | Zdůvodnění |
| --- | --- | --- | --- | --- |
| Intel Core i5-6500 / i5-6600 / i5-6600K | LGA 1151 | `MID` | Ne — 6. generace nemá TPM 2.0 | Nejstarší bod `MID`: Skylake se šesti jádry (i5-6500 se čtyřmi), s GPU `MID` hraje GTA V a starší tituly na 1080p/60 fps. Od 6. generace začíná `MID`, i5 gen 4–5 zůstává `LOW`. |
| Intel Core i5-7500 / i5-7500K | LGA 1151 | `MID` | Ne — 7. generace nemá TPM 2.0 | Čtyři jádra Skylake s vysokým taktem; stačí na střední nastavení v Valorant a CS2 s GPU `MID`. |
| Intel Core i5-8400 / i5-8500 | LGA 1151 | `MID` | Jen s modulem TPM 2.0 | Coffee Lake se šesti jádry přesahuje 6. generaci; fTPM chybí, takže Windows 11 vyžaduje samostatný modul (cena stovky Kč). |
| Intel Core i5-8600 / i5-8600K | LGA 1151 | `MID` | Jen s modulem TPM 2.0 | Nejvyšší výkon 8. generace v tabulce; s GPU `MID` dává nejstabilnější 1080p/60 fps a je jedinou cestou, jak v `MID` prodat kus s Windows 11. |
| Intel Core i7-7700 | LGA 1151 | `MID` | Ne — 7. generace nemá TPM 2.0 | Nejvyšší Core i7 7. generace; jako základ `MID` dostačuje, osm jader se ale využije spíš při práci než v hrách. |
| AMD Ryzen 5 1600 | AM4 | `MID` | Ne — Ryzen 1000 nemá fTPM | Zen první generace; šest jader, ale nízké IPC znamená, že v hrách je výrazně slabší než Intel 6. generace. Nejlevnější herní základ v tabulce, hraniční zařazení. |
| AMD Ryzen 5 2600 | AM4 | `MID` | Ne — Ryzen 2000 nemá fTPM | Zen+ s vyšším taktem než 1600; pořád bez fTPM, tedy `MID` a prodej bez OS. |
| AMD Ryzen 5 3600 | AM4 | `MID` | Ne — Ryzen 3000 nemá fTPM | Zen 2, šest jader s podstatně vyšším IPC; v hrách převyšuje Intel 6.–8. generaci, ale kvůli chybějícímu fTPM zůstává `MID`, ne `HIGH`. |
| AMD Ryzen 5 4500 | AM4 | `MID` | Ne — Ryzen 4000 nemá fTPM | Zen 2 s šesti jádry, výkonově na úrovni Ryzen 5 3600; v bazaru jeden z nejlevnějších šestijádrových kusů, ale bez fTPM, tedy `MID` a prodej bez OS. |
| AMD Ryzen 7 1700 | AM4 | `MID` | Ne — Ryzen 1000 nemá fTPM | Osm jader pro práci s více úlohami a střih; herní výkon odpovídá slabším procesorům `MID`. |
| AMD Ryzen 7 2700X | AM4 | `MID` | Ne — Ryzen 2000 nemá fTPM | Nejrychlejší Ryzen 2000; s GPU `MID` dosáhne 1080p/60 fps, ale v bazaru je drahý a vyplatí se, jen pokud se využije i k práci. |
| AMD FX-8300 | AM3+ | `MID` | Ne — nemá TPM 2.0 | Nejslabší osmé jádro FX; s GPU `MID` hraje starší a esports tituly na 1080p/60 fps, ale proti Intel 6. generaci zaostává. Platforma AM3+ je mimo trh. |
| AMD FX-9700 | AM3+ | `MID` | Ne — nemá TPM 2.0 | Nejrychlejší FX s baleným chladičem; herní výkon mezi Intel 6. generací a Ryzen 5 1600. Platforma AM3+ je mimo trh. |

## Tier HIGH

| Model | Socket | Tier | Windows 11 | Zdůvodnění |
| --- | --- | --- | --- | --- |
| Intel Core i5-9400 | LGA 1151 | `HIGH` | Ne nativně — nutný TPM 2.0 modul | Nejslabší 9. generace, s GPU `HIGH` už zvládne 1440p; fTPM ale chybí, takže Windows 11 jen s modulem. |
| Intel Core i7-9700 | LGA 1151 | `HIGH` | Ne nativně — nutný TPM 2.0 modul | Osm jader 9. generace pro střih videa a práci s více programy; fTPM chybí, Windows 11 jen s modulem. |
| Intel Core i5-10400 | LGA 1200 | `HIGH` | TODO: ověřit PTT na kusu — zdroj: `msinfo32` a `tpm.msc` | Nejlevnější cesta do `HIGH` na Intelu; přítomnost firmware TPM je u Comet Lake kusově proměnlivá, proto ověř před zařazením. |
| Intel Core i5-12400 | LGA 1700 | `HIGH` | Ano — nativně | Alder Lake, šest jader; nejnižší Core i5 v tabulce, který podporuje Windows 11 bez zásahu. |
| Intel Core i5-13400 | LGA 1700 | `HIGH` | Ano — nativně | Raptor Lake; dobrý poměr výkonu a ceny v `HIGH`, osvědčená volba pro RTX 3060 a RX 6600. |
| Intel Core i5-14400 | LGA 1700 | `HIGH` | Ano — nativně | Nejnovější uvedený Core i5; v `HIGH` použitelný tam, kde se dá pořídit v rozumné ceně. |
| Intel Core i7-11700 | LGA 1200 | `HIGH` | Ano — nativně | Rocket Lake, osm jader; zaměřený na práci s videem a 3D, kde má rezervu nad `MID`. |
| Intel Core i7-12700 | LGA 1700 | `HIGH` | Ano — nativně | Alder Lake s hybridními jádry; výrazný náskok v práci s videem, v hrách záleží víc na GPU. |
| Intel Core i7-14700 | LGA 1700 | `HIGH` | Ano — nativně | Nejvychovanější Core i7 v tabulce a horní hranice sortimentu; smysl jen tam, kde klient opravdu potřebuje maximum. |
| AMD Ryzen 5 5600 | AM4 | `HIGH` | Ano — nativně | Zen 3, šest jader: Ryzen 5 s fTPM, tedy Windows 11 bez zásahu; s GPU `HIGH` dává 1440p. |
| AMD Ryzen 5 5500 | AM4 | `HIGH` | Ano — nativně | Zen 3 s šesti jádry a fTPM; stejná architektura jako Ryzen 5 5600, ale levnější kus, takže v bazaru běžnější volba pro `HIGH` sestavy s levnější kartou typu RX 6600. |
| AMD Ryzen 5 5700X | AM4 | `HIGH` | Ano — nativně | Zen 3 s šesti jádry, vyšší takt než 5500 a 5600; v bazaru nejčastější volba v `HIGH` sestavách s RTX 3060 a RX 6600 — vyvážená cena a výkon. |
| AMD Ryzen 7 5800X | AM4 | `HIGH` | Ano — nativně | Zen 3 osm jader pro práci s videem; v balení použitelný chladič, což snižuje náklad na chlazení sestavy. |
| AMD Ryzen 5 7600 | AM5 | `HIGH` | Ano — nativně | Zen 4, šest jader; platforma AM5 jede DDR5, tedy vyšší pořizovací náklad, ale delší životnost. |
| AMD Ryzen 5 7500F | AM5 | `HIGH` | Ano — nativně | Zen 4 bez integrované grafiky: nejlevnější vstup do AM5; GPU je v `HIGH` nutná tak jako tak. |
| AMD Ryzen 7 7700X | AM5 | `HIGH` | Ano — nativně | Zen 4 osm jader; náskok v práci s videem je výrazný, herní rozdíl proti 7600 menší. |
| AMD Ryzen 7 7800X3D | AM5 | `HIGH` | Ano — nativně | Zen 4 s 3D V-Cache: nejvyšší herní výkon v tabulce, nejnižší pracovní výkon z Ryzen 7000. |

## MIMO ROZSAH

| Model | Socket | Tier | Windows 11 | Zdůvodnění |
| --- | --- | --- | --- | --- |
| Intel Pentium 4, Celeron do 2 GHz, obyčejné Slot 1 procesory | různé | `MIMO ROZSAH` | Ne | Už nesplňují ani minimum `LOW` (8 GB RAM se k nim nedostane a bazarový výtěžek je záporný); prodávat pouze jako jednotlivé náhradní díly. |
| AMD Athlon XP, Turion | Socket A | `MIMO ROZSAH` | Ne | Předchůdci Athlon 64 X2; pomalé, hlučné a bez smyslu v sortimentu. |
| Intel Core gen 15 a vyšší, AMD Ryzen 8000 / 9000 | LGA 1700 a novější, AM5 a novější | `MIMO ROZSAH` | Ano | `HIGH` je horní hranice sortimentu (Intel 9.–14. generace + Ryzen 5000/7000); výkonnější modely se nezařazují a marže se pro ně nepočítá. |

## Jak s tabulkou pracovat

1. Před nákupem najdi **konkrétní model**, ne rodinu. „i5" bez generace a bez
   přípony (např. i5-4570 vs i5-12400) je pro tier neplatný údaj.
2. Řádek bez tieru nebo bez zdůvodnění je chyba — doplň ho dřív, než se podle
   něj rozhoduješ o koupi.
3. Modely mimo tabulku se do sortimentu nekupuj. Pokud v bazaru narazíš na
   výjimku, která sem patří, doplň řádek a poznamenej, odkud.
4. Když se model přesune mezi tierech, uprav **zároveň**
   [44-referencni-sestavy.md](44-referencni-sestavy.md) a
   [43-cenove-pasmo.md](43-cenove-pasmo.md) — jinak zůstanou v rozporu.
5. U CPU bez fTPM se neprodává Windows 11; rozhodnutí zapiš do evidence podle
   [31-testovaci-protokoly.md](../30-testovani-a-evidence/31-testovaci-protokoly.md).

TODO: doplnit reálné nákupní ceny a zásobnost jednotlivých modelů — zdroj: tabulka
Sklad v Google Sheets po prvním nákupním cyklu.
