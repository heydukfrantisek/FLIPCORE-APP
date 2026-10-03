# Tier sestav — definice a pravidla

**Účel:** Určuje, podle čeho se sestavě přiřadí tier, co tier nesnižuje a jak se tier překládá do textu inzerátu.

Tier je interní technické označení sestavy. Zákazník ho nezná — inzerát proto nese
**laický prodejní label** (`KANCELÁŘSKÁ`, `HERNÍ`, `VÝKONNÁ`), viz
[dvojí pojmenování](#dvojí-pojmenování).

## Co tier je

Tier odpovídá jednomu ze tří cílových segmentů a z něj plyne záruka, OS politika
a cenové pásmo:

| Tier | Cílový zákazník | Co od tieru čeká | Záruka |
| --- | --- | --- | --- |
| `LOW` | kancelář, škola, stážista, senior | Office, e-mail, prohlížeč, videohovory, Office 365 | 3 M |
| `MID` | hráč 1080p, univerzální domácí PC | Starší a esports tituly, GTA V, Valorant, CS2 na střední nastavení | 6 M |
| `HIGH` | hráč 1440p, práce s videem a 3D, budoucí-proof | střih videa, 3D modelování, herní a pracovní úlohy vyžadující vyšší výkon (`1440p` až po vlastním měření) | 12 M |

Tier jednotlivých dílů určují referenční tabulky:
[41-cpu-tabulka.md](41-cpu-tabulka.md) a [42-gpu-tabulka.md](42-gpu-tabulka.md).

## Pravidlo 1 — tier sestavy je maximum z CPU a GPU

**tier sestavy = max(tier(CPU), tier(GPU))**:

Samotné CPU tier neurčuje. Samotná GPU tier neurčuje. Rozhoduje silnější z obou
dvou, protože hry a 3D prácu omezuje právě GPU, kancelářské úlohy a střih videa
zase CPU.

Příklad: **Celeron + RTX 3060 = HIGH.** Celeron je v tabulce `LOW`, RTX 3060 je
v tabulce `HIGH`. Maximum je `HIGH`. Sestava není kancelářská jen proto, že má
Celeron — běžela by na něm jen jako hlavní panel a úlohy, které se vám nepovede,
když máte RTX 3060. Důsledek v praxi:

- Záruka 12 M, ne 3 M.
- O OS rozhoduje **tier(CPU)**, ne GPU: TPM 2.0 / fTPM má procesor, ne grafická
  karta. RTX 3060 vám Windows 11 neumožní. V této sestavě je Celeron
  (`LOW`, bez TPM 2.0), takže se prodává **bez OS** — a to bez ohledu na to, že
  výkonový tier je `HIGH`. Viz [OS a TPM](#os-a-tpm--co-tier-dovolí).
- V inzerátu se **musí** uvést, že CPU je slabá složka a u her bude omezovat
  výkon. Viz [62-sablona-inzeratu.md](../60-prodej/62-sablona-inzeratu.md).

Opačný případ je stejně jednoznačný: **Core i7-12700 + GT 1030 = HIGH** podle
výkonového tieru (CPU), ale herní výkon omezuje GT 1030. Viz
[hraniční případy](#hraniční-případy).

## Pravidlo 2 — minimální specifikace tieru

Maximum z CPU a GPU je jen **kandidát**. Sestava se prodává na tier, kterému
splňuje **všechny tři** podmínky současně:

| Tier | RAM | Disk | Zdroj | CPU | GPU |
| --- | --- | --- | --- | --- | --- |
| `LOW` | 8 GB | SSD 240 GB | dle sestavy, viz minimum HIGH níže | tabulka `LOW` | tabulka `LOW` |
| `MID` | 16 GB | SSD 480 GB | dle sestavy, viz minimum HIGH níže | tabulka `MID` | tabulka `MID` |
| `HIGH` | 32 GB | NVMe 1 TB | 550–750 W | tabulka `HIGH` | tabulka `HIGH` |

Pravidla k tomu:

- Sestava, která minimum nesplňuje, se na vyšší tier **neprodává**. Chybějící RAM
  nebo disk se dokoupí ([12-max-ceny.md](../10-nakup/12-max-ceny.md)) — je to
  stok korun oproti ceně celé sestavy.
- Pokud minimum splnit nelze (např. deska má dva sloty a 8 GB, které už nepřidáš),
  sestava se na daný tier neprodává vůbec. Rozhodni podle
  [51-kompatibilita.md](../50-sestavovani/51-kompatibilita.md), jestli se doplní
  jiné díly, nebo sestava skončí jako jednotlivý prodávaný počítač mimo sortiment
  tierů.
- Větší než minimum je vždy v pořádku. Jen samotné minimum (32 GB v `HIGH`) není
  použitelné — `HIGH` minimum ber jako podlahu, ne jako cíl.

## Hraniční případy

### CPU v jednom tieru, GPU ve vyšším

Platí pravidlo 1: vezmi vyšší. Doplň to:

- Minimum vyššího tieru platí pro celou sestavu, ne jen pro GPU.
- Uveď v inzerátu slabší složku. Klient to musí slyšet před koupí, ne po ní.
- Obchodní filtr: rozdíl jednoho tieru mezi CPU a GPU je běžný a sestava se
  prodává. Rozdíl **dvou** tierů (např. Celeron + RTX 3060) je v bazaru prakticky
  nemožný — když se takový kus objeví, je podezřelý nález
  ([13-pasti-a-podvody.md](../10-nakup/13-pasti-a-podvody.md)), ne výhodný nákup.

### CPU ve vyšším tieru, GPU v nižším

Výkonový tier je opět maximum, tedy tier CPU. To ale **není totéž co prodejní
label**:

- **Výkonový tier** (`LOW`/`MID`/`HIGH`) určuje záruku, cenu a marži.
- **Prodejní label** musí odpovídat tomu, co sestava reálně umí, tedy slabší
  složce. i7-12700 s GT 1030 je sestava, která má výkon HIGH, ale ne umí hrat
  na 1440p — v inzerátu nesmí být prezentovaná jako 1440p hráčská.

Pokud je rozdíl dva tiery nebo víc (např. Ryzen 7 5800X + RX 550), sestava se
dodává vůbec — je to neodůvodněné zatížení rozpočtu a budoucí reklamace
([64-prodejni-podminky.md](../60-prodej/64-prodejni-podminky.md)).

### Chybí TPM 2.0 nebo fTPM

Chybějící TPM 2.0 **tier nesnižuje**. Omezuje pouze OS (viz níže). Core i5-9400
zůstává `HIGH`, i když se prodává bez Windows.

### Komponenty mimo tabulky

CPU nebo GPU, které v [41-cpu-tabulka.md](41-cpu-tabulka.md) nebo
[42-gpu-tabulka.md](42-gpu-tabulka.md) nejsou, se do sortimentu nekupují. V
tabulkách je mají řádky s hodnotou `MIMO ROZSAH`.

## Co tier NENÍ

| Tvrzení | Proč je chybné |
| --- | --- |
| „CPU 5. generace = LOW" | Generace je u Intelu jen orientační zkratka a výkon neodvozuje. Intel 5. gen je výrazně slabší než Ryzen 5 5600 (2020), který odpovídá Intel 11. gen. |
| „AMD má 4. a 5. generaci" | U AMD žádné generace neexistují. existují řady Ryzen 1000 / 2000 / 3000 / 5000 / 7000 / 9000. Zařazovat AMD podle Intelových generací vede k chybným nákupům. |
| „Vyšší generace = vyšší tier" | V tabulkách leží Intel i5-7500 (7. gen, `MID`) výkonově pod Ryzen 5 5600. Generace se nesčítá. |
| „Rok výroby určuje tier" | Rok je informace pro nákup, ne pro tier. Dva procesory ze stejného roku mohou být v různých tierech. |
| „Core i5 = MID" | Značka řady neurčuje tier. Core i5-4570 je `LOW`, Core i5-7500 je `MID`, Core i5-12400 je `HIGH`. |
| „Výkonnější CPU udělá z kancelářské sestavy herní" | Ne — GPU hry táhne. Když v kancelářské sestavě chybí výkonná GPU, je to stále kancelářská sestava. |
| „Stav dílu určuje tier" | Stav (`nový`, `výborný`, `dobrý`, `vadný`) je údaj ve skladu ([21-prijemka.md](../20-prijem-a-sklad/21-prijemka.md)). Tier určuje pouze model a výkon. |
| „Střední tier vznikne průměrem CPU a GPU" | Neexistuje průměrování. Buď je CPU silnější (tier CPU), nebo GPU (tier GPU). Nic mezi. |

## Dvojí pojmenování

| Výkonový tier (vnitřní) | Laický prodejní label (inzerát) | Label slibuje | Label nesmí slíbit |
| --- | --- | --- | --- |
| `LOW` | `KANCELÁŘSKÁ` | kancelářské úlohy, e-mail, prohlížeč, videohovory, Office 365 | hraní her, Windows 11 |
| `MID` | `HERNÍ` | 1080p hraní na starší a esports tituly, univerzální domácí PC | 1440p/60 fps, práce s 3D |
| `HIGH` | `VÝKONNÁ` | herní a pracovní úlohy vyžadující vyšší výkon, práce s videem a 3D | fps a rozlišení, která jsme neměřili; `1440p` se píše do inzerátu až po vlastním měření |

Pravidla pro použití:

- V inzerátu je **názvem** laický label. Technický label (`HIGH`) se uvádí jako
  doplněk v technických údajích, nikoli jako název.
- Laický label se nesmí použít, pokud sestava dané vlastnosti reálně nesplňuje.
  Výjimka žádná — sestava s výkonovým tierem `HIGH` a slabou GPU se prodává pod
  labelem podle slabší složky.
- Slibuje se **úkol** („kancelář, Office, videohovory"), nikoli **fps číslo**.
  Číselný výkon se uvádí jen tam, kde máme vlastní měření
  ([31-testovaci-protokoly.md](../30-testovani-a-evidence/31-testovaci-protokoly.md)).

## OS a TPM — co tier dovolí

Rozhodnutí je pevné: **jen ověřitelný OEM klíč převedený z bazarového PC, nebo
prodej bez OS.** Nikdy neoriginální klíč, nikdy bypass TPM.

| Platforma | TPM 2.0 | Výsledek |
| --- | --- | --- |
| Intel Core 4.–7. gen | nemá | Windows 11 oficiálně nepodporován → prodává se bez OS |
| Intel Core 8. gen | typicky bez | řešitelné **samostatným modulem** (cena stovky Kč) → jediná cesta k Windows 11 v `MID` |
| AMD Ryzen 3000 / 4000 | fTPM chybí | Windows 11 oficiálně nepodporován → bez OS |
| AMD Ryzen 5000+ | fTPM zabudovaný | Windows 11 nativně → `HIGH` |
| Intel Core 10.–14. gen | podporováno | Windows 11 nativně → `HIGH`; **u 10. gen je nutné ověřit PTT (firmware TPM) na konkrétním modelu a kusu** — viz TODO níže |

Výjimka k tabulce: **Intel Core 9. generace** (i5-9400, i7-9700) fTPM nemá. Pro
Windows 11 potřebuje samostatný TPM 2.0 modul, stejně jako 8. generace.
TODO: ověřit přítomnost PTT na konkrétním kusu 10. generace (i5-10400) — zdroj:
`msinfo32` a `tpm.msc` na testovaném kusu podle
[31-testovaci-protokoly.md](../30-testovani-a-evidence/31-testovaci-protokoly.md).

Windows 10 skončil 14. 10. 2025. ESU je prodlouženo do 12. 10. 2027 — je to odklad,
ne řešení. Do 12. 10. 2027 se neplánuje žádný prodej se systémem Windows 10.

V `LOW` se Windows neprodává vůbec. V `MID` se prodává bez OS, případně s OEM
klíčem od bazaristy, případně s modulem TPM 2.0 na 8. generaci. V `HIGH` je
Windows 11 nativně výchozí možnost — není ale automaticky součástí každého kusu.
Rozhoduje vždy **CPU**: `HIGH` sestava, jejíž CPU nemá TPM 2.0 ani fTPM (např.
Celeron s RTX 3060), se prodává bez OS.

## Sortiment a prodej

- Pouze **desktop tower**. Notebooky, AIO, Mini-PC a konzole nejsou sortiment.
- Pouze **B2C**. Žádný B2B, žádné pronájmy, žádné servisní zakázky.
- `HIGH` je horní hranice sortimentu: Intel 9.–14. generace + Ryzen 5000/7000.
  Co je výkonnější, se do sortimentu nezařazuje a marže se pro ně nepočítá
  ([71-kalkulace-marze.md](../70-finance/71-kalkulace-marze.md)).

## Checklist přiřazení tieru

Proveď v tomto pořadí, u každé složky najdi řádek v příslušné tabulce:

- [ ] CPU nalezeno v [41-cpu-tabulka.md](41-cpu-tabulka.md), tier opsán.
- [ ] GPU nalezeno v [42-gpu-tabulka.md](42-gpu-tabulka.md), tier opsán.
- [ ] Kandidát tier = maximum z obou hodnot.
- [ ] RAM, disk a zdroj splňují minimum kandidáta.
- [ ] Minimum splněno, nebo je doplnitelné — jinak sestava na tento tier nepatří.
- [ ] OS: TPM 2.0 nebo fTPM ověřeny podle tabulky výše; rozhodnutí zapsáno do
      evidence sestavy.
- [ ] Vybrán prodejní label podle slabší složky, ne podle výkonového tieru.
- [ ] Slib v inzerátu odpovídá labelu.
- [ ] Tier a label zapsány do evidence sestavy a do listu
      [43-cenove-pasmo.md](43-cenove-pasmo.md).

## Související dokumenty

- [41-cpu-tabulka.md](41-cpu-tabulka.md) — modely CPU a jejich tier
- [42-gpu-tabulka.md](42-gpu-tabulka.md) — modely GPU a jejich tier
- [43-cenove-pasmo.md](43-cenove-pasmo.md) — cílová cena a minimální marže per tier
- [44-referencni-sestavy.md](44-referencni-sestavy.md) — vzorové sestavy na každý tier
- [00-uvod-a-glosar.md](../00-uvod-a-glosar.md) — pojmy tier, sestava, díl
