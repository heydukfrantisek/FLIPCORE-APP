# Prověření inzerátu před cestou

**Účel:** Checklist, podle kterého se rozhodne, jestli za danou nabídku vůbec cestovat, co testovat na místě a kdy odmítnout. Jde o prověření **před cestou**: kapitola A a B se dělá z domova, z inzerátu a fotek, kapitola C je brána, která říká jet nebo nejet.

Tento dokument je prováděný **jedním člověkem bez znalosti kontextu**. Pro každou položku existuje
jasné ano/ne. Neznáme-li odpověď, položka neprošla.

Související: pravidla kanálů `10-kanaly.md`, ceny `12-max-ceny.md`, pasti `13-pasti-a-podvody.md`,
testovací protokoly `../30-testovani-a-evidence/31-testovaci-protokoly.md`, evidence
`../20-prijem-a-sklad/21-prijemka.md`.

## Jak s dokumentem zacházet

1. Kapitola A a B se dělá **z domova, z inzerátu a fotek**, před cestou.
2. Kapitola C je rozhodovací brána: jet / nejet.
3. Kapitola D a E probíhají **na místě**, před zaplacením.
4. Kapitola F je seznam otázek pro prodávajícího.
5. Kapitola G říká, kdy necestovat vůbec a kdy odmítnout okamžitě.
6. Kapitola H uzavírá nákup zápisem do evidence.

---

## A. Text inzerátu — co ověřit z domova

### Základní údaje

- [ ] Model a přesné označení CPU a GPU — ne „Intel i5 4. jiné", ne „herní grafika". Křížová kontrola: `../40-tiery/41-cpu-tabulka.md`, `../40-tiery/42-gpu-tabulka.md`.
- [ ] Obě složky tieru jsou známé a dávají smysl jako dvojice (viz `../40-tiery/44-referencni-sestavy.md`, zda kombinace existuje a odpovídá plánovanému prodeji).
- [ ] Sestava **splňuje minimum tieru** (RAM, typ a kapacita disku, u HIGH i zdroj a NVMe).
- [ ] Není v inzerátu nic, co by nebylo v sortimentu (notebook, AIO, Mini-PC, konzole, kancelářská tiskárna).
- [ ] Uvedená cena je **pod maximální nákupní cenou** v `12-max-ceny.md` pro daný stav dílu a cílový tier.
- [ ] Jsou uvedeny všechny zásadní díly sestavy (viz A dále) — ne jen to, co je na hlavní fotce.

### Sortimentní a technické limity

- [ ] Socket a generace paměti jsou slučitelné a odpovídají plánované sestavě.
- [ ] Zdroj napájení má dostatečný výkon a správný počet konektorů pro plánovanou GPU (u HIGH 550–750 W).
- [ ] Chlazení CPU odpovídá socketu a velikosti sestavy (především u HIGH).
- [ ] Zdroj není součástí balíku jako „k sestavě přidám" bez údaje o výrobci a příkonu.

### Operační systém

- [ ] Je-li nabízen OS, prodávající uvádí, že jde o **OEM klíč převedený z bazarového PC**.
- [ ] Není nabízen žádný neoriginální klíč, klíč k účtu, generátor ani „aktivace do biometrie".
- [ ] Je jasné, že OS pro LOW a MID není podporovaný (viz `../40-tiery/43-cenove-pasmo.md` a prodejní podmínky).
- [ ] Není zmíněna instalace Windows přes bypass TPM. Viz `13-pasti-a-podvody.md`.

### Prodejce

- [ ] Zkušenosti (počet a věk profilu, hodnocení, recenze) odpovídají nabídce.
- [ ] Nabídka není kopie jiného inzerátu s vymyšlenou konfigurací (viz `13-pasti-a-podvody.md`).
- [ ] U bazaru / Aukra je prodávající známý bazarista, ne nově vzniklé jednorázové jméno.
- [ ] U prodeje ze soukromí prodávající uvádí důvod prodeje a odkazuje na jiné inzeráty se stejným sortimentem.

### Cena a výhodnost

- [ ] Cena je porovnaná s [cenovým pásmem](../40-tiery/43-cenove-pasmo.md) a s reálnou kalkulací marže.
- [ ] Cena nezahrnuje canné skryté náklady: dopravu, likvidaci, dovoz originálních náhradních dílů.
- [ ] Nabídka není podezřele levná oproti trhu (levné = riziko, viz `13-pasti-a-podvody.md`).

## B. Fotky — co ověřit ještě před cestou

- [ ] Fotky jsou skutečné, ne převzaté z internetu (nestačí, že sedí).
- [ ] Je vidět celá sestava, ne jen detail jedné věci.
- [ ] Fotky uvnitř skříně: vidět všechny sloty pro disky a stav kabeláže.
- [ ] Je vidět stav chladiče a krytu chladiče CPU (viz `13-pasti-a-podvody.md`, vypájená past).
- [ ] Je vidět, zda grafická karta má vlastní napájecí adaptér a jak vypadá (viz vadná baterie adaptéru).
- [ ] Je vidět základní deska zblízka — kondenzátory, skryté/vyškrábané sériové číslo, kryt boot loaderu.
- [ ] Je vidět přesné označení RAM (model, počet modulů, frekvence).
- [ ] Je vidět přesné označení disku a jeho rozhraní (M.2 vs SATA — pozor na záměnu stejné kapacity).
- [ ] Jsou vidět sériová čísla dílů alespoň částečně — kvůli odsouhlasení na faktuře u bazaru.
- [ ] Chybějící fotka disků, základní desky nebo chladiče = požádat o doplnění před cestou.
- [ ] Fotka „sestavené sestavy v klidu" je podezřelá, pokud na ní není vidět úmyslné otevření skříně a rozebrání.

## C. Brána rozhodnutí před cestou

Všechno musí být splněno. Jediné „ne" nebo jedno „nevím" = nejet.

- [ ] Text inzerátu prošel kapitolou A.
- [ ] Fotky prošly kapitolou B, nebo chybějící fotky doplnil.
- [ ] Cena je pod maximální nákupní cenou v `12-max-ceny.md`.
- [ ] Výhodnost dává smysl i po započtení cesty a času.
- [ ] Místo setkání / výdeje je bezpečné: veřejné, dobře osvětlené, ve všední den ve dne.
- [ ] Je stanoven, kdo s sebou jede (u cennějších kusů nevětšovat).
- [ ] Prodávající souhlasil s úplným rozebráním a testem všech komponent.
- [ ] Termín se vejde do plánu a před setkáním mám připravené `../30-testovani-a-evidence/31-testovaci-protokoly.md`.
- [ ] Rezerva: mám plán B, pokud kus nepřijde nebo selže test.

## D. Co mít s sebou na místě

- [ ] Křížový šroubovák a šroubovák nebo klíč na upevnění grafické karty.
- [ ] Flash disk s testovacími nástroji (SMART u disků, paměťová zkouška, kontrola systému, údaje o procesoru a paměti).
- [ ] Síťový kabel — sestava nemusí mít funkční Wi-Fi nebo LAN.
- [ ] Monitor a vlastní klávesnice s myší pro test, pokud prodávající žádné nemá.
- [ ] Externí napájecí zdroj nebo prodlužovací kabel do zásuvky.
- [ ] Hadřík, vatové tyčinky a případně rozpouštědlo na kontakt.
- [ ] Baterie do telefonu plná, mobilní data jako záloha dopravy.
- [ ] Hotovost na dohodnutou cenu, drobné.
- [ ] Fotka sériových čísel na papíře nebo do seznamu pro zápis do evidence.
- [ ] Kopii checklistu z tohoto dokumentu.

## E. Testy na místě — podle součástí

### Skříň a vizuální stav

- [ ] Šasi, přední panel, nožičky, absence promáčknutí a prasklin.
- [ ] Zavírací mechanismus dvířek, funkční práh dvířek, filtry proti prachu.
- [ ] Rozměry pro plánovaný chladič a délku prostoru pro grafickou kartu.

### Základní deska

- [ ] Sériové číslo čitelné, není vyškrábané ani přelepené.
- [ ] Konektory a sloty nezlomené, sloty PCI Express čisté.
- [ ] Kondenzátory: žádné vyboulené hliníkové válce, žádné stopy vyteklého elektrolytu.
- [ ] Boot loader (BIOS/UEFI) načte se a nehlásí nic podezřelého.
- [ ] Nastavení data a času v UEFI odpovídá skutečnosti.

### Procesor a chlazení

- [ ] Pasti na procesoru jsou rovné, žádná nevyskakovaná past (viz `13-pasti-a-podvody.md`).
- [ ] Počet pastí sedí s paticí na obalu a s paticí na základní desce.
- [ ] Kolečko v krytu chladiče nedosedí (povolená vůle, utržené tlačítko, prasklé závěsy).
- [ ] Chladič sedí rovně, všechny šrouby přítomné, chladič se při montáži nehýbal.
- [ ] Termopasta není vysušená a nekápala jinam.
- [ ] Model procesoru odpovídá údaji v UEFI.

### Paměť

- [ ] Počet modulů a jejich označení odpovídá tomu, co prodávající uvádí.
- [ ] Z Slotu lze přečíst model, kapacitu, výrobce a časování.
- [ ] Paměť projde paměťovou zkoušku bez chyb a bez restartu.
- [ ] Test probíhal v každém slotu, který bude v sestavě obsazen (single-channel kombinace).

### Grafická karta

- [ ] Pastice jsou rovné, na kartě nejsou vyboulené ani ohnuté.
- [ ] Kartu lze vložit a vyjmout bez násilí, slot se nepoškrábe.
- [ ] Chladič karty nedosedí, ventilátory se volně točí, karta se nepřehřívá v rukou.
- [ ] Externí napájecí adaptér má nedefinitivní baterii nebo vyboulené hliníkové válce (viz `13-pasti-a-podvody.md`).
- [ ] Napájecí konektory nejsou ohnuté, kryt slotu nepřetéká.
- [ ] Karta prokázala vlastní výstup obrazu a test v jednom programu, kde se kreslí.
- [ ] Výkonová třída odpovídá plánovanému tieru (`../40-tiery/42-gpu-tabulka.md`).

### Disky

- [ ] SSD a HDD mají viditelný model a kapacitu, interní číslo přečitelné.
- [ ] SSD v M.2 slotu opravdu sedí v M.2 slotu; disk uvedený v textu jako „SSD 480 GB" není SATA disk v 2,5" provedení (viz `13-pasti-a-podvody.md`).
- [ ] SMART: hodnoty **Reallocated Sector Count** a **Pending Sector Count** jsou nulové, celkový počet přepsaných sektorů odpovídá stavu běžného používání.
- [ ] Disk nepřeskakuje, necítí se „poškodený" na prvních a posledních místech.
- [ ] Kapacita po zformátování odpovídá deklarované (u bazarových disků s tím počítáme jen u těch s ověřeným SMART).

### Zdroj napájení

- [ ] Značku a model lze přečíst na štítku, příkon a standardní napětí jsou čitelné.
- [ ] Konektory nejsou zoxidované, hlavní přívodní kabel má nepoškozenou izolaci.
- [ ] Ventilátor se točí bez chyb, uvnitř není vidět zapálený prach ani cizí předmět.
- [ ] Zdroj je původní k tomuto modelu, ne náhradní jiného výrobce (viz `13-pasti-a-podvody.md`).

### Sestava jako celek

- [ ] Sestava se zapne a nabootuje (nabití paměti, vstup do UEFI).
- [ ] Po spuštění se neopakují resety, chyby POST a ukončení napájení.
- [ ] Funguje zobrazení, zvuk, síť a USB.
- [ ] Nabídnuté periferie fungují (klávesnice, myš, monitor) — patří k balíku, nebo ne.
- [ ] Po dvou minutách běhu se nic nepřehřívá, nic nepáří, necváčí klínka.
- [ ] Přesná konfigurace sedí s tím, co prodávající uváděl (viz `13-pasti-a-podvody.md`).
- [ ] Sestava má funkční OS **nebo** je prodávána bez OS — a není nabízen neoriginální klíč.

## F. Otázky pro prodávajícího

Položit dřív, než uvidíme zboží. Nejde o kontrolu prodávajícího, ale o získání informace.

### Původ a stav

- [ ] „Proč prodáváte?" — upozornění na odpověď „výkup jiného bazaru" (viz `10-kanaly.md`).
- [ ] „Jak dlouho jste to měl a v jakém režimu jste to používal?" — hledané slovo: „nepoužívaný" u něčeho, co evidentně bylo v chodu.
- [ ] „Máte původní fakturu, záruční list, krabici?"
- [ ] „Byla sestava někdy rozebírána nebo opravovaná? Kdo na ni sahal?"
- [ ] „Odstala se někdy karta, spadl procesor? Funguje to od té doby stabilně?"
- [ ] „Máte k tomu ještě původní napájecí adaptér karty?"

### Disk a systém

- [ ] „Kolik systémů na disku a kdy byl disk naposledy zkontrolován?"
- [ ] „Můžu si SMART udělat tady?"
- [ ] „Byl disk defragmentován nebo klonován?"
- [ ] „Je Windows originální OEM klíč z tohoto počítače?"

### Konfigurace a doplňky

- [ ] „Kolik má ta sestava RAM a odkud to víte?" — značka a počet modulů musí být čitelné.
- [ ] „Co přesně je v krabici? Je tam všechno, včetně originálních šroubů a kabelů?"
- [ ] „Prodáváte to sám, nebo výkup bazaru? Kolik takových kusů máte?"
- [ ] „Co vám v tom nefunguje a co jste opravoval?"

### Obchod

- [ ] „Je cena smluvená jen na tyto díly, co tady leží?" — co je navíc v balíku.
- [ ] „Vydáte mi k této sjednané ceně písemné potvrzení?" — pro zápis do evidence `../20-prijem-a-sklad/21-prijemka.md`.
- [ ] „Souhlasíte, že si udělám fotky sériových čísel?"

## G. Hranice rozhodnutí

### Okamžitě odmítnout a necestovat

- [ ] V textu nebo zprávě je odkaz na platbu, formulář pro zálohu, dárkový poukaz, předplatná nebo požadavek na platbu do cizího účtu.
- [ ] Nabízí neoriginální Windows klíč, klíč k účtu Microsoft, nebo cokoli, co má být „aktivace do Windows zdarma".
- [ ] Prodejec tlačí na setkání na izolovaném místě, v noci, nebo na předání bez možnosti rozebrání sestavy.
- [ ] Požaduje zálohu před odevzdáním zboží.
- [ ] Konfigurace v inzerátu neodpovídá ani reálné cenové hladině trhu (například 8 GB RAM a Ryzen 7 7800X3D).
- [ ] Prodejce odmítá základní kontrolu: rozebrání, SMART, boot, nebo odmítá poskytnout krabici a příslušenství.
- [ ] Profil vznikl nedávno, má jedinou recenzi se stejným jménem jako autor hodnocení.
- [ ] Jméno, fotky a jiné inzeráty ukazují, že jde o cizí zboží (krájená sestava, skryté sériové číslo).
- [ ] Prodejce vyžaduje převod na „nepřímou platbu“ nebo platbu přes prostředníka, kterého neznáme.
- [ ] Cílový tier z údajů vychází mimo HIGH, ale zboží má být prodáno jako „originál nové" za nováckou cenu.

### Nejet, jen s rezervou

- [ ] Prodejce přizná, že kus „někdy padal" nebo byl opravovaný — není to automaticky vylučující, ale je nutné zvýšit rezervu a testovat víc.
- [ ] Setkání je mimo naši působnost a doba dojezdu je dlouhá — náklad cesty je reálný náklad a musí se promítnout do ceny koupě (`12-max-ceny.md`).
- [ ] Chybí část fotek a prodávající je nechce doplnit — jezdi se jen při dílcích, které i bez fotek uhradí marži.
- [ ] U bazaru nelze získat sériové číslo na faktuře — jezdi se jen při ceně, která pokryje i možnou spornou reklamaci.
- [ ] Nabídka je sice v limitu, ale po testu a se ztrátou na prodeji by šla do minusu.

### Vzorec rozhodnutí

- [ ] Protismluva peníze za kusy, které bychom nekupili? → necestovat.
- [ ] Při kolika vadách dílů by cena klesla pod maximální nákupní cenu z `12-max-ceny.md`? → zapsat si tuto hranici před cestou a držet se jí.
- [ ] Je nákladem cesta směřující spíš do marže než do rizika? → vyhodnotit proti `../40-tiery/43-cenove-pasmo.md`.

## H. Po rozhodnutí

### Během nákupu

- [ ] Fotky všech dílů před zaplacením, včetně sériových čísel.
- [ ] Fotka místa a data — datum a místo součástí evidence.
- [ ] Písemná dohoda o ceně a rozsahu (u soukromého prodeje i krátký zápis do zprávy).

### Po nákupu

- [ ] Převzaté díly okamžitě zapsat do evidence `../20-prijem-a-sklad/21-prijemka.md`.
- [ ] Otestovat podle `../30-testovani-a-evidence/31-testovaci-protokoly.md`, ne podle toho, co „fungovalo u prodávajícího".
- [ ] Výsledek testu zapsat do tabulky Testy v Google Sheets, vadný kus označit v tabulce Sklad.
- [ ] Závěr: kus jde do skladu, jde jako díl do sestavy, nebo se odmítne a zprodá jako vadný.
- [ ] Odmítnutý nákup zapsat se důvodem — zpětná vazba do pravidel kanálů `10-kanaly.md`.
- [ ] Překročí-li závada jiný nakupovaný díl, aktualizovat `13-pasti-a-podvody.md`.

TODO: doplnit po prvních nákupech záznam nejčastějších důvodů odmítnutí a dobu strávenou na jedno setkání —
zdroj: tabulky Sestavy a Testy v Google Sheets, sloupec poznámka a datum.
