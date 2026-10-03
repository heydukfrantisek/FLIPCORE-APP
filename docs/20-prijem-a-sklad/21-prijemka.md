# Příjem dílů do evidence

**Účel:** Jednoznačně převzít každý nakoupený díl do evidence, přiřadit mu trvalé
ID a rozhodnout, jestli jde do skladu, do opravy, nebo do elektronického odpadu.

Předchozím krokem je
[nákup a prověření inzerátu](../10-nakup/12-max-ceny.md), následujícím krokem je
[čištění](22-cipovani-a-cisteni.md).

## ID systém dílů

### Formát ID

Každý díl, který prošel příjemkou, má **jedno ID**, které se nikdy nemění:

```text
TYP-MODEL-RRMM-PORADI
```

Příklad: `CPU-I56500-2411-001` = CPU, model i5-6500, listopad 2024,
první takový kus.

| Část ID | Význam | Pravidlo |
| --- | --- | --- |
| `TYP` | druh dílu | Předepsaná předpona z tabulky níže, vždy velkými písmeny |
| `MODEL` | modelové označení | Jen znaky `A`–`Z` a `0`–`9`, bez mezer, pomlček a diakritiky |
| `RRMM` | rok a měsíc | Dvouciferný rok + dvouciferný měsíc, např. `2411` = listopad 2024 |
| `PORADI` | pořadové číslo | Tři číslice od `001`, doplňují se směrem vzhůru |

### Předpony typu

| Předpona | Díl |
| --- | --- |
| `CPU` | procesor |
| `GPU` | grafická karta |
| `MB` | základní deska |
| `RAM` | paměťový modul |
| `SSD` | disk SSD (i NVMe) |
| `HDD` | mechanický disk |
| `PSU` | napájecí zdroj |
| `COOL` | chladič CPU včetně ventilátoru |
| `FAN` | samostatný ventilátor skříně |
| `CASE` | skříň |
| `OSK` | klíč k operačnímu systému (viz níže) |

Seznam předpson je uzavřený. Nový druh dílu se nepřidává libovolně — doplní se
jednou do tohoto dokumentu a od té doby se používá všude stejně.

TODO: seznam předpson potvrdit po prvním měsíci provozu — zdroj: tabulka Sklad
v Google Sheets, sloupec typ.

### Normalizace modelu

Modelové označení se přepisuje z **přesného označení na dílku**, ne z
marketingového názvu v inzerátu.

| Označení na dílku | `MODEL` v ID |
| --- | --- |
| `Intel Core i5-6500` | `I56500` |
| `Core i7-7700K` | `I77700K` |
| `AMD Ryzen 5 3600` | `R53600` |
| `Radeon RX 580 2048SP` | `RX580` |
| `Samsung MZ7LN512HMJP` | `MZ7LN512` |
| `Corsair Vengeance LPX 16 GB` | `16GB` nebo výrobkový kód |

- `MODEL` se zkracuje na nejvýše 12 znaků, aby ID zůstalo čitelné. Zkrácený
  model se musí objevit i v digitální evidenci v plném znění.
- Zkrácením může vzniknout shoda se starším ID. V takovém případě se
  `PORADI` zvýší o jedna a ID zůstane jednočíselné.
- V|ID nejsou žádné diakritické znaky, mezery ani oddělovače navíc. ID se píše
  velkými písmeny, aby bylo čitelné i na papírové etiketě.

### Pravidla přidělování

1. ID se přiděluje **při příjmu**, ne při objednávce, ne při prodeji a ne až
   při sestavení.
2. ID se **nikdy nemění**. Změna stavu, přesun do opravy, čištění nebo
   reklamace ID nemění.
3. ID se **nikdy nepoužívá znovu**, ani po odpisu dítěte. Pokud vyjde, že ID už
   v minulosti existovalo, použije se další pořadové číslo.
4. Jeden fyzický kus = jedno ID. Dvě základní desky ze stejného rozebraného
   počítače jsou dva různé kusy se dvěma ID.
5. Díl bez ID **neexistuje** — nepoužije se ve sestavě, neprodá se ani neodečte.
6. Klíč k OS má vlastní ID (`OSK`) a je evidován odděleně od hardware, aby
   bylo dohledatelné, ke které sestavě byl přiřazen.

### Kde se ID zapisuje

| Kde | Jak |
| --- | --- |
| Digitální evidence | sloupec `ID dílu` v tabulce Sklad |
| Papírová evidence | vyplněný formulář `../../templates/prijemka.md` |
| Fyzický díl | trvalým psacím prostředkem (fix, olejová fix), **nepáraně a nevypalovaně** |
| Obal / sáček | samolepka s ID, pokud ID nelze na díl vepsat |
| Fotografie | ID je součástí názvu souboru (viz níže) |

ID se **nezapisuje** na CPU, GPU, SSD, RAM, chladič ani na plášť zdroje, kde by
zápis mohl poškodit povrch, vodivé plochy nebo výrobní značení. U těchto dílů
se ID píše na obal nebo antistatický sáček. Na velké ploché díly (skříň, přední
panel zdroje, bok skříně) se ID vepsat smí.

## Přijímací kontrolní seznam

Vyplňuje se po každém převzetí, ať už jde o jeden kus z inzerátu, nebo o
celý rozebraný počítač. Při větším odběru (třeba deset kusů jednoho modelu) se
seznam vyplní pro každý kus zvlášť — kontrolní seznam pro celý odběr není
dostatečná evidence.

### Zdroj a doklad

- [ ] Zapsáno, odkud byl díl nakoupen (bazar, inzerce.cz, Bazoš, Facebook
      Marketplace, jiný bazarista) — jméno, datum, odkaz nebo číslo dokladu.
- [ ] Zapsána nákupní cena za kus.
- [ ] Nákupní cena porovnána s maximální cenou pro daný model a stav
      ([`12-max-ceny.md`](../10-nakup/12-max-ceny.md)); při překročení
      nákup zaznamenán s odůvodněním.

### Identifikace a ID

- [ ] Přečteno přesné modelové označení zadáním na dílku (ne marketingový
      název z inzerátu).
- [ ] Přiděleno ID ve formátu `TYP-MODEL-RRMM-PORADI`.
- [ ] ID zapsáno do digitální evidence i na papírový formulář
      ([`../../templates/prijemka.md`](../../templates/prijemka.md)).
- [ ] ID vepsáno na díl, nebo na jeho obal či sáček.

### Vizuální kontrola

- [ ] Celkový pohled na díl vyfotografován.
- [ ] Zkontrolováno mechanické poškození: praskliny, ohnuté patičky, ulomené
      závity, uvolněné nebo chybějící součástky uvnitř obalu.
- [ ] Zkontrolováno, zda na dílku nejsou stopy po pájení (bílé až černé
      zbytky), zateklé chladiče nebo mechanické praskliny.
- [ ] Zkontrolována koroze — zelené nánosy na měděných kontaktech, rez, bílé
      soli na plášti. Nález koroze se zaznamená do stavu a do poznámky.
- [ ] Zkontrolován příslušenství, co přišlo s kusem (kabely, montážní materiál,
      záruční poukázka, originální krabice).

### Ověření modelu proti tier tabulkám

- [ ] U procesoru ověřen model v
      [`41-cpu-tabulka.md`](../40-tiery/41-cpu-tabulka.md) a zapsán tier.
- [ ] U grafické karty ověřen model v
      [`42-gpu-tabulka.md`](../40-tiery/42-gpu-tabulka.md) a zapsán tier.
- [ ] U modelu, který v tabulkách není: zapsáno, že nebyl nalezen, a zvolen
      pachovka k ověření před použitím v sestavě.
- [ ] Zapsáno rozhodnutí, zda díl vůbec připadá v úvahu pro tier, do kterého
      plánujeme skládat ([`44-referencni-sestavy.md`](../40-tiery/44-referencni-sestavy.md)).
- [ ] Zkontrolována použitelnost v sestavě: socket a patičky procesoru, typ
      paměti, rozhraní karty, formát disku, rozměr chladiče, výkon a rozměr
      zdroje ([`51-kompatibilita.md`](../50-sestavovani/51-kompatibilita.md)).

### Stav dílu

- [ ] Přidělen štítek stavu dle tabulky níže (výchozí / výborný / dobrý /
      vadný).
- [ ] Zaznamenáno sériové číslo, výrobní kód nebo servisní štítek, pokud je
      čitelný.
- [ ] U karty zaznamenána kapacita paměti, pokud ji lze určit bez rozebrání
      (například z přelepení nebo z nastavení).
- [ ] U klíče k OS zaznamenána přesná hodnota klíče (viz oddíl dále).
- [ ] Zapsáno, zda díl je příslušenství náhradní (bez funkce v běžném provozu),
      nebo opravený kus.

### Klíč k operačnímu systému

- [ ] Zaznamenáno, zda přišel OEM klíč k OS, **ať už ano, nebo ne**. Chybějící
      klíč se zapisuje výslovně jako „bez OS", nevyplňuje se prázdné pole.
- [ ] U přítomného klíče zapsáno, ke kterému bazarovému počítači patřil a od
      koho byl převeden.
- [ ] Zapsán stav ověření klíče: `ověřen` (viz níže), `neověřen`, `nelze
      ověřit`.
- [ ] Klíč není vypsán do fotografií, které se použijí v inzerátu.

**Jak se OEM klíč ověřuje:**

| Stav | Podmínka | Co se stane |
| --- | --- | --- |
| `ověřen` | Klíč má platné razítko výrobce, lze určit výrobce a typ licence (OEM) a instalace proběhla bez výzvy k nuluové aktivaci | Klíč se může převést na cílovou sestavu |
| `neověřen` | Klíč existuje, ale nešlo určit výrobce nebo typ licence | Prodej **bez OS** |
| `nelze ověřit` | Klíč je nečitelný, odříznutý, nebo chybí razítko výrobce | Prodej **bez OS** |

TODO: konkrétní postup ověření OEM klíče — kde a jak se určí výrobce, typ
licence a původ klíče — zdroj: doporučený postup výrobce pro ověření OEM klíče.

Nejistota se řeší vždy směrem k prodeji bez OS. OEM licence z bazarového
počítače je přenositelná a na cílovou sestavu se převádí, ale jen když jde o
ověřitelný originální klíč. Neprodává se neoriginální ani vygenerovaný klíč a
nepoužívá se obcházení TPM — to je rozhodnutí, ne volba na místě.

Sestavy LOW se prodávají bez Windows. U sestav MID se Windows prodávají jen
výjimkou, a to s převedeným OEM klíčem z bazarového kusu; jinak se prodává bez
OS. U HIGH záleží na CPU, viz
[`40-tier-definice.md`](../40-tiery/40-tier-definice.md). Klíč se vždy eviduje
s uvedením původu a způsobu ověření, i když se nakonec nepřevede.

### Rozhodnutí o přijetí

- [ ] Zapsáno jedno rozhodnutí: **jde do skladu** / **jde do opravy** /
      **jde do elektronického odpadu**.
- [ ] U rozhodnutí „do opravy" zapsána závada a kdo opravu provádí.
- [ ] U rozhodnutí „do elektronického odpadu" zapsán důvod a způsob odevzdání,
      aby šlo dokladovat recyklaci.
- [ ] Zapsáno, zda se stav potvrdí až testováním (viz
      [`31-testovaci-protokoly.md`](../30-testovani-a-evidence/31-testovaci-protokoly.md))
      — štítek z příjmu je předběžný.

TODO: doplnit peněžní hranici, nad kterou už oprava nemá smysl a díl jde
rovnou do elektronického odpadu — zdroj: kalkulace marže a reálné záznamy
o opravách.

## Štítky stavu

### Význam stavů

| Stav | Co přesně znamená | Typický příklad |
| --- | --- | --- |
| **Výchozí** | Běžný bazarový stav: díl je funkční, má použitelné kosmetické stopy, funguje všechno, co má fungovat. Výchozí stav pro většinu přijatých kusů. | Skříň s odřeným bokem, GPU s prasklinou v plastu, ale hraničně funkční |
| **Výborný** | Funkční a kosmeticky bez znatelných stop; vzhledem jako výrazně málo používaný kus | Komponenty z málo používané sestavy, bílá skříň bez odřenin |
| **Dobrý** | Funkční, ale s výraznými kosmetickými vadami, opravený kus, nebo kus bez původního příslušenství. Cenově nižší než výchozí, ale plně použitelný do sestavy. | Ventilátor s vrzoucím ložiskem po výměně, chladič s odřenou patičkou |
| **Vadný** | Díl nelze použít v sestavě v dané podobě. Jde do opravy nebo do elektronického odpadu. **Neprodává se.** | Nespustí se, má vadné jádro, vodu v kolektoru |

Stav se zapisuje do evidence vždy jedním ze čtyř slov, bez dalších hodnot.

### Kdy se díl označí za vadný

Díl se označí za vadný, jakmile se při příjmu nebo při testu potvrdí některé
z těchto skutečností:

| Oblast | Příznak vadného dílu |
| --- | --- |
| Základní deska | Zkratované napájení, zapájené kontakty, ohnutý slot, prasklé diody v okolí, stopa po neodborném pájení |
| Procesor | Kresby na víčku, ohnuté nebo ulomené hroty, zelená koroze na kontaktu, nerozpoznává se |
| Grafická karta | Voda v chladicím systému, prasklá trubka heatpipe, ohnuté napájení, vrzoucí ventilátor, zčernané chladicí žebrování |
| Paměť | Vadný zub lepené pásce, spálený čip, zelené nánosy na zlatých kontaktech |
| Disk SSD / NVMe | Rozbitý konektor, vyražený kryt, chyba v tabulce samoopravy dat, ohnutá zástrčka M.2 |
| Mechanický disk | Pískání při otáčení, „kliknutí" při roztočení, poškozený povrch ploten |
| Zdroj | Zteklé nebo vypuklé kondenzátory, vypálený spínač, zápach, otevřené víčko |
| Chladič | Prasklé lopatky, ulomená patička, vyražený potah, rozlepený ventilátor |
| Skříň | Roztržený plech, uvolněný panel, zničené tlačítko, nedovřené dvířka |
| Baterie (notebooková, z UPS) | Nafouknutí, „holubíček", vyteklý elektrolyt, promáčknutý obal |

Opačná strana: pokud díl prošel kontrolou bez nálezu, jde do stavu podle
skutečného vzhledu a funkčnosti — tedy **výchozí**, **výborný** nebo **dobrý**.
Stav „vadný" neslouží jako útočiště pro díl, který se prostě nechtěl rozebírat.

### Přechody mezi stavy

- **Výchozí → Vadný** je možný kdykoliv, typicky až po testu. Díl se přeznačí a
  jde do opravy nebo do odpadu; ID zůstává stejné.
- **Dobrý → Výborný** a naopak nejsou možné. Stav odráží vzhled při příjmu,
  ne to, co se s dílem dělo dál.
- Opravený díl má stav podle výsledku opravy: pokud byl vadný a opravou se
  vrátil do použitelného stavu, má stav **dobrý** a v poznámce je zapsáno, co
  bylo opraveno a kdy. Zpět do „výchozí" se nepromění, protože stopa po opravě
  zůstává.
- Stav se mění pouze zápisem do evidence, s datumem a stručným odůvodněním.

## Fotodokumentace

### Co fotit

| Snímek | Co je na něm | Proč |
| --- | --- | --- |
| 1. Celkový pohled | Díl nebo celý počítač shora a z boku | Doklad, co přišlo |
| 2. Sériové číslo | Detail razítka, sériového čísla nebo výrobního kódu, čitelné, bez odrazu světla | Jednoznačné dohledání dílu |
| 3. Stav | Rysky, odřeniny, skvrny, zažloutlé těsnění, praskliny, zteklé kondenzátory | Zdůvodnění stavu a záruky |
| 4. Kontakty a zadní strana | Patičky, sloty, napájecí konektory, viditelné znečištění nebo koroze | Rozhodnutí o použití v sestavě |
| 5. Příslušenství | Co přišlo s kusem: kabely, montážní materiál, poukázka | Nárok na součásti, záruka výrobce |
| 6. Ověření modelu | Detail modelového označení (pokud není čitelné na snímku 2) | Základ pro tier |

Pravidla:

- Snímek musí být **ostrý a čitelný**. Nečitelná fotografie sériového čísla
  neplní účel.
- Fotí se vlastní světlo, bez blesku telefonu (odraz na fólii a plášti).
- Fotí se **všechny vady**, ne jen jednu. Jedna hezká fotografie vedle pěti
  špatných není důkaz.
- Při převzetí celého počítače se kromě jednotlivých dílů vyfotí i celek
  včetně všech stran.

### Pojmenování souborů

Název souboru musí obsahovat ID, jinak se fotografie nedá spárovat s dílkem:

```text
<ID>_<RRRRMMDD>_<POZICIONI>_<POPIS>.jpg
```

Příklad: `CPU-I56500-2411-001_20241103_01_seriove-cislo.jpg`

| Část | Co znamená |
| --- | --- |
| `<ID>` | ID dílu, přesně jak je v evidenci |
| `<RRRRMMDD>` | Datum fotografie, čtyřciferný rok |
| `<POZICIONI>` | Pořadí snímku, dvě číslice od `01` |
| `<POPIS>` | Co je na snímku, malými písmeny, s pomlčkami, bez diakritiky |

### Ukládání

- Fotky jednoho dílu jsou v jedné složce pojmenované podle ID.
- Složky jsou řazené podle měsíce příjmu, ve formátu `RRRR-MM`.
- Fotky patří k příjemce v tabulce Sklad jako odkaz na složku
  ([`32-evidence-komponent.md`](../30-testovani-a-evidence/32-evidence-komponent.md)).
- Fotografie s vadou dítěte se archivují i po odevzdání do elektronického
  odpadu — doklad, proč díl neprodal.

## Závěrečná kontrola před odchodem od stolu

- [ ] Digitální evidence i papírový formulář mají shodné ID.
- [ ] Stav, model, sériové číslo, nákupní cena a umístění jsou vyplněné.
- [ ] Rozhodnutí (sklad / oprava / odpad) je zapsané, ne jen domluvené.
- [ ] Fotky nahrány, pojmenované podle ID a přiřazené k dílu.
- [ ] Papírová evidence je podepsaná a uložená na určeném místě.

## Související dokumenty

- [22. Čipování a čištění](22-cipovani-a-cisteni.md)
- [23. Skladování a životnost skladovaných dílů](23-skladovani.md)
- Šablona: [`../../templates/prijemka.md`](../../templates/prijemka.md)
- [`../40-tiery/41-cpu-tabulka.md`](../40-tiery/41-cpu-tabulka.md)
- [`../40-tiery/42-gpu-tabulka.md`](../40-tiery/42-gpu-tabulka.md)
- [`../30-testovani-a-evidence/31-testovaci-protokoly.md`](../30-testovani-a-evidence/31-testovaci-protokoly.md)
