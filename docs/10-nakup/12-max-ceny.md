# Maximální nákupní ceny

**Účel:** Tabulka, která říká, kolik smíme za jednotlivý díl zaplatit, aby marže zůstala kladná.

Tento dokument je **rámec**, ne ceník. Reálné číselné hodnoty zatím nejsou doplněné — tabulky jsou
předepsané strukturou s označenými TODOs. Doplní se z reálných nákupů, ne odhadem.

Související: `10-kanaly.md`, `11-due-diligence.md`, `13-pasti-a-podvody.md`,
cílová prodejní cena a minimální marže `../40-tiery/43-cenove-pasmo.md`.

## Vztah k prodejní ceně

```text
maximální nákupní cena sestavy = cílová prodejní cena − marže − ostatní náklady sestavy
```

| Položka | Vysvětlení | Kde je stanovena |
| --- | --- | --- |
| Cílová prodejní cena | Cena, za kterou chceme sestavu v Bazoši nebo na Aukru prodat, podle tieru | `../40-tiery/43-cenove-pasmo.md` |
| Marže | Absolutní rezerva mezi prodejní a nákupní cenou. Cílová výše marže je stanovena pro LOW, MID a HIGH zvlášť | `../40-tiery/43-cenove-pasmo.md` |
| Ostatní náklady sestavy | Zdroj, chladič, základní deska, paměť, disk, skříň, pasiva a spoje, doprava, likvidace, čištění, provozní spotřeba reklamací, poplatky prodejního kanálu, dovoz originálních náhradních dílů | Kumulativně: evidence `../20-prijem-a-sklad/21-prijemka.md`, kalkulace v `../40-tiery/43-cenove-pasmo.md` |

Přepočet na jednotlivé díly:

```text
maximální nákupní cena dílu = maximální nákupní cena sestavy − součet ostatních dílů a nákladů sestavy
```

Tedy: koupíme-li procesor nad limit, musí být zbytek sestavy levnější, jinak marže nevyjde. Při skládání
sestavy postupujeme od zbytkového rozpočtu, ne od ceny dílu.

**Maximální nákupní cena je strop, ne cílová cena.** Průměrná nákupní cena má být pod limitem, jinak se
marže odpaří a nezbude nic na reklamaci.

## Varianty stavu

| Stav | Definice | Kdy smí do prodejné sestavy |
| --- | --- | --- |
| Výborný stav | Kompletní, funkční, bez vizuálních a funkčních vad, ideálně s původním příslušenstvím a dokladem | Všechny tiery |
| Dobrý stav | Funkční, s kosmetickou vadou (rysky, odbarvení, chybějící kryt, chybějící originální příslušenství, chybějící krabice) | Všechny tiery, vadný díl se zákazníkovi deklaruje |
| S vadou | Funkční nedostatek: vyboulená baterie adaptéru, degradovaný kondenzátor, mrtvý sektor, zvýšená teplota, poškrápaná pastice, chybějící port | Viz omezení níže |

### Omezení nákupu dílů s vadou

| Komponenta | Nákup s vadou |
| --- | --- |
| Zdroj napájení | **Zakázáno vždy.** Jediný zdroj napájení, který může zabít celou sestavu. |
| Základní deska | Jen jako zdroj dílů, ne do prodejné sestavy. Padlá záložní deska se neprodává. |
| Procesor | Jen jako zdroj dílů, ne do prodejné sestavy. |
| Grafická karta | Jen při zjevně kosmetické vadě (rysky, chybějící kryt). Zahřívání, vydutí pastic, vadný adaptér = ne. |
| Disk | Jen mimo systémovou pozici, a to při ověřeném SMART. Do systému disk s chybou nesmí. |
| Paměť | Jen při ověřeném projití zkoušky bez chyb. |
| Chlazení | Jen při fungujících ventilátorech a tuhém uchycení. |
| Skříň | Ano — kosmetické vady jsou běžné a většinou neviditelné po sestavení. |

Sleva za stav je odvozena od reálných nákupů, ne z odhadu:
TODO: doplnit poměr nákupních cen mezi stavy (výborný : dobrý : s vadou) — zdroj: vlastní nákupy
zaznamenané v `../20-prijem-a-sklad/21-prijemka.md`, stav dílu a nákupní cena v tabulce Sklad.

## Tabulky maximálních nákupních cen

Sloupce jsou ve všech tabulkách stejné. Hodnoty se doplní jako částka v Kč.

| Sloupec | Význam |
| --- | --- |
| Komponenta | Co kupujeme |
| Cílový tier | Tier sestavy, do které díl zapadá (`../40-tiery/41-cpu-tabulka.md`, `../40-tiery/42-gpu-tabulka.md`) |
| Výborný stav | Nejvyšší přípustná nákupní cena |
| Dobrý stav | Nejvyšší přípustná cena s kosmetickou vadou |
| S vadou | Nejvyšší přípustná cena s funkčním nedostatkem |
| Poznámka | Podmínka, za kterých je cena přípustná |

### Procesor (CPU)

| Komponenta | Cílový tier | Výborný stav | Dobrý stav | S vadou | Poznámka |
| --- | --- | --- | --- | --- | --- |
| CPU | LOW | TODO: doplnit | TODO: doplnit | Zakázáno do prodejné sestavy | Model dle `../40-tiery/41-cpu-tabulka.md` |
| CPU | MID | TODO: doplnit | TODO: doplnit | Zakázáno do prodejné sestavy | — |
| CPU | HIGH | TODO: doplnit | TODO: doplnit | Zakázáno do prodejné sestavy | Intel 9.–14. generace nebo Ryzen 5000/7000; výše `MIMO ROZSAH` |

### Grafická karta (GPU)

| Komponenta | Cílový tier | Výborný stav | Dobrý stav | S vadou | Poznámka |
| --- | --- | --- | --- | --- | --- |
| GPU | LOW (integrovaná) | TODO: doplnit | TODO: doplnit | Zakázáno | Intel HD/UHD v CPU; zdroj z bazarové sestavy, ne samostatný nákup |
| GPU | LOW (samostatná) | TODO: doplnit | TODO: doplnit | Zakázáno | GT 1030 (GDDR5/GDDR6), RX 550, HD 5770/6670 |
| GPU | MID | TODO: doplnit | TODO: doplnit | Kosmetická vada jen | GTX 1050 Ti/1060/1650/1660, RX 470/570/580 (i 2048SP)/590 |
| GPU | HIGH | TODO: doplnit | TODO: doplnit | Kosmetická vada jen | RTX 2060/3060/4060, RX 6600/6700 XT/6750 XT/7600, GTX 1080/1080 Ti |

**Sjednocené hranice GPU.** Dvě hranice jsou rozhodnuté a v tomto dokumentu se nesmí vykládat jinak:

| Karta | Tier | Proč | Zdroj rozhodnutí |
| --- | --- | --- | --- |
| GTX 1080 a GTX 1080 Ti | `HIGH` | Výkonově přesahují nejsilnější `MID` kartu (GTX 1660) a v bazaru stojí méně než RX 6600. V `MID` sestavě by byla zbytečně drahá, proto se neprodává v `MID` | `../40-tiery/42-gpu-tabulka.md` |
| RX 590 | `MID` | Na hranici, ale proti RTX 2060 a RX 6600 ještě nedosáhne | `../40-tiery/42-gpu-tabulka.md` |

- [ ] Karta, pro kterou chci doplnit limit, je dohledatelná v `../40-tiery/42-gpu-tabulka.md`.
- [ ] Karta mimo tabulku se do sortimentu nekupuje, i kdyby vyšla levně (viz `../40-tiery/40-tier-definice.md`).
- [ ] Při posunu karty mezi tiery je upraven zároveň tento dokument, `../40-tiery/43-cenove-pasmo.md` a `../40-tiery/44-referencni-sestavy.md`.

### Základní deska (MB)

| Komponenta | Cílový tier | Výborný stav | Dobrý stav | S vadou | Poznámka |
| --- | --- | --- | --- | --- | --- |
| MB | LOW | TODO: doplnit | TODO: doplnit | Jen jako zdroj dílů | Socket musí sedět s CPU |
| MB | MID | TODO: doplnit | TODO: doplnit | Jen jako zdroj dílů | Pozor na verzi BIOSu pro dané CPU |
| MB | HIGH | TODO: doplnit | TODO: doplnit | Jen jako zdroj dílů | Preferovat s funkcí fTPM pro Windows 11; u Intel 9. generace fTPM chybí, řeší se modulem TPM 2.0 (`../40-tiery/40-tier-definice.md`) |

### Paměť (RAM)

| Komponenta | Cílový tier | Výborný stav | Dobrý stav | S vadou | Poznámka |
| --- | --- | --- | --- | --- | --- |
| RAM | LOW | TODO: doplnit | TODO: doplnit | Zakázáno | Minimum 8 GB |
| RAM | MID | TODO: doplnit | TODO: doplnit | Zakázáno | Minimum 16 GB |
| RAM | HIGH | TODO: doplnit | TODO: doplnit | Zakázáno | Minimum 32 GB, vždy po dvojicích |

### Disk (SSD a HDD)

| Komponenta | Cílový tier | Výborný stav | Dobrý stav | S vadou | Poznámka |
| --- | --- | --- | --- | --- | --- |
| SSD (SATA) | LOW | TODO: doplnit | TODO: doplnit | Jen mimo systém | Minimum 240 GB |
| SSD (SATA) | MID | TODO: doplnit | TODO: doplnit | Jen mimo systém | Minimum 480 GB |
| SSD (M.2 NVMe) | HIGH | TODO: doplnit | TODO: doplnit | Jen mimo systém | Minimum 1 TB, NVMe, ne M.2 SATA |
| HDD | LOW a MID | TODO: doplnit | TODO: doplnit | Jen při ověřeném SMART | Úložný disk pro data, ne systémový |

### Zdroj napájení (PSU)

| Komponenta | Cílový tier | Výborný stav | Dobrý stav | S vadou | Poznámka |
| --- | --- | --- | --- | --- | --- |
| PSU | LOW | TODO: doplnit | TODO: doplnit | Zakázáno | Původní k dané sestavě |
| PSU | MID | TODO: doplnit | TODO: doplnit | Zakázáno | Původní k dané sestavě |
| PSU | HIGH | TODO: doplnit | TODO: doplnit | Zakázáno | 550–750 W, původní k dané sestavě |

### Skříň (case)

| Komponenta | Cílový tier | Výborný stav | Dobrý stav | S vadou | Poznámka |
| --- | --- | --- | --- | --- | --- |
| Skříň | LOW | TODO: doplnit | TODO: doplnit | TODO: doplnit | Rozměr dle CPU a chladiče |
| Skříň | MID | TODO: doplnit | TODO: doplnit | TODO: doplnit | Rozměr dle GPU a chladiče |
| Skříň | HIGH | TODO: doplnit | TODO: doplnit | TODO: doplnit | Průchod vzduchu a délka prostoru pro GPU |

### Chlazení (CPU chladič a ventilátory)

| Komponenta | Cílový tier | Výborný stav | Dobrý stav | S vadou | Poznámka |
| --- | --- | --- | --- | --- | --- |
| Chlazení CPU | LOW | TODO: doplnit | TODO: doplnit | Zakázáno | Kompatibilita s paticí |
| Chlazení CPU | MID | TODO: doplnit | TODO: doplnit | Zakázáno | Kompatibilita s paticí |
| Chlazení CPU | HIGH | TODO: doplnit | TODO: doplnit | Zakázáno | Chlazení v BOX setu nebo samostatně |

## Formát řádku (příklad bez hodnot)

Ukázka jak má řádek vypadat po doplnění. Čísla jsou záměrně prázdná.

```markdown
| CPU | HIGH | <částka> Kč | <částka> Kč | zakázáno | z původní sestavy, ne z výkupu |
```

```markdown
| GPU | MID | <částka> Kč | <částka> Kč | kosmetická vada jen | včetně originálního napájecího adaptéru |
```

## Jak tabulku doplnit

1. Pro každý řádek vybrat v Bazoši a na Aukru 5–10 aktuálních inzerátů na srovnatelný kus ve srovnatelném stavu.
2. Zapsat cenu každého inzerátu a vzít **robustní minimum** — nejnižší reálnou cenu, ne průměr.
   Kůčový kus má být dostupný opakovaně, jinak cena není udržitelná.
3. Hodnotu pro stav „výborný" převzít z toho výsledku. Hodnotu pro „dobrý" a „s vadou" odvodit z poměru
   stavů, který se doplní z vlastních nákupů.
4. Zapsat datum a odkaz na inzerát, ze kterého hodnota pochází, aby šlo hodnotu přezkoumat.
5. Po každém nákupu hodnotu přepočítat: pokud se trh posunul, tabulka se neopravuje odhadem.

TODO: doplnit procentní slevu bazarových kusů proti novému zboží — zdroj: porovnání inzerátů na Bazoši
a Aukru s aktuálními cenami v obchodech.
TODO: doplní průměrnou dobu obratu skladu pro jednotlivé tiery, podle ní se rozhoduje, zda je daný limit
nákupu vůbere — zdroj: tabulka Sestavy v Google Sheets, sloupec s datem nákupu a prodeje.
TODO: doplnit ostatní náklady sestavy na jednotlivé tiery (čas práce, doprava, likvidace, prodejní poplatky)
— zdroj: vlastní evidence v `../20-prijem-a-sklad/21-prijemka.md` a prodejní podmínky `60-prodej/64-prodejni-podminky.md`.

## Vztah k ostatním dokumentům

| Oblast | Dokument |
| --- | --- |
| Cílová prodejní cena a minimální marže per tier | `../40-tiery/43-cenove-pasmo.md` |
| Tier podle modelu CPU | `../40-tiery/41-cpu-tabulka.md` |
| Tier podle modelu GPU | `../40-tiery/42-gpu-tabulka.md` |
| Sestavy jako celek | `../40-tiery/44-referencni-sestavy.md` |
| Zápis nákupu, nákupní cena, dodavatel | `../20-prijem-a-sklad/21-prijemka.md` |
| Ověření před nákupem | `11-due-diligence.md` |
| Podvody, které limit ceny zjevně porušují | `13-pasti-a-podvody.md` |

**Upozornění:** ceny v tomto dokumentu jsou orientační odhady, ne smluvní údaje. Do doplnění tabulek
se nesmí psát tržní data z hlavy ani z externích zdrojů bez uvedení odkazu.
