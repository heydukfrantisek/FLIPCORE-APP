import { Badge } from "@/components/badge";
import { NadpisStranky } from "@/components/nadpis-stranky";
import { Panel, PanelBody, PanelHeader } from "@/components/panel";
import { PrazdnyStav } from "@/components/prazdny-stav";
import { StatKarta } from "@/components/stat-karta";
import { Tabulka, TabulkaBunka, TabulkaHlavicka, TabulkaRadek } from "@/components/tabulka";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";
import { KATEGORIE_POPIS, OBJEDNAVKA_POPIS, ZASAH_POPIS } from "@/lib/domain/slovnik";
import { spocitatMarzi, spocitatMarziProcenta } from "@/lib/domain/sklad";
import { getPrehledNastenky } from "@/server/repo";

export const metadata = {
  title: "Nástěnka | FLIPCORE",
};

export default function NastenkaPage() {
  const prehled = getPrehledNastenky();
  const { sklad, finance, sestavy, objednavky, nizsiMarze, posledniZasahy } = prehled;

  return (
    <>
      <NadpisStranky
        nadpis="Nástěnka"
        popis="Přehled skladu, financí a sestav. Zobrazují se data z připojené databáze."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatKarta
          nazev="Kusy ve skladu"
          hodnota={`${sklad.kusuCelkem}`}
          popis={`${sklad.kusuVystavenych} vystaveno k prodeji`}
        />
        <StatKarta
          nazev="Hodnota vystaveného zboží"
          hodnota={formatCurrency(sklad.hodnotaVystaveno)}
          popis={`Investováno ${formatCurrency(sklad.investovano)}`}
          odstin="success"
        />
        <StatKarta
          nazev="Příjmy"
          hodnota={formatCurrency(finance.prijmy)}
          popis={`Výdaje ${formatCurrency(finance.vydaje)}`}
        />
        <StatKarta
          nazev="Sestavy"
          hodnota={`${sestavy.kompatibilnich} / ${sestavy.celkem}`}
          popis={
            sestavy.sProblemem > 0
              ? `${sestavy.sProblemem} s nesouladem, ${sestavy.vRozpoctu} v rozpočtu`
              : `Všechny v rozpočtu (${sestavy.vRozpoctu})`
          }
          odstin={sestavy.sProblemem > 0 ? "warning" : "success"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader titulek="Poslední objednávky" popis="Stavy objednávek k vyřízení" />
          {objednavky.length === 0 ? (
            <PrazdnyStav titulek="Zatím žádné objednávky" popis="Objednávky se tu objeví po prvním prodeji." />
          ) : (
            <Tabulka>
              <TabulkaHlavicka>
                <tr>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Číslo</th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Stav</th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Vytvořeno</th>
                  <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Částka</th>
                </tr>
              </TabulkaHlavicka>
              <tbody>
                {objednavky.map((objednavka) => (
                  <TabulkaRadek key={objednavka.id}>
                    <TabulkaBunka hlavni>{objednavka.cislo}</TabulkaBunka>
                    <TabulkaBunka>
                      <Badge
                        odstin={
                          objednavka.stav === "zrusena"
                            ? "danger"
                            : objednavka.stav === "dodana"
                              ? "success"
                              : "info"
                        }
                      >
                        {OBJEDNAVKA_POPIS[objednavka.stav]}
                      </Badge>
                    </TabulkaBunka>
                    <TabulkaBunka>{formatDate(objednavka.vytvorenoKdy)}</TabulkaBunka>
                    <TabulkaBunka className="text-right" hlavni>
                      {formatCurrency(objednavka.castka)}
                    </TabulkaBunka>
                  </TabulkaRadek>
                ))}
              </tbody>
            </Tabulka>
          )}
        </Panel>

        <Panel>
          <PanelHeader
            titulek="Kusy s nízkou marží"
            popis="Vystavené kusy s marží pod 30 % — kandidáti na přehodnocení ceny"
          />
          {nizsiMarze.length === 0 ? (
            <PrazdnyStav
              titulek="Všechny kusy mají dostatečnou marži"
              popis="Žádný kus nepřipadá pod stanovenou hranici."
            />
          ) : (
            <Tabulka>
              <TabulkaHlavicka>
                <tr>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Komponenta</th>
                  <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Marže</th>
                </tr>
              </TabulkaHlavicka>
              <tbody>
                {nizsiMarze.map((zaznam) => (
                  <TabulkaRadek key={zaznam.kus.id}>
                    <TabulkaBunka hlavni>
                      {zaznam.component.vyrobce} {zaznam.component.model}
                      <span className="block text-xs font-normal text-zinc-400 dark:text-zinc-500">
                        {KATEGORIE_POPIS[zaznam.component.kategorie]}
                      </span>
                    </TabulkaBunka>
                    <TabulkaBunka className="text-right">
                      {formatCurrency(spocitatMarzi(zaznam.kus))}
                      <span className="block text-xs text-amber-600 dark:text-amber-400">
                        {formatPercent(spocitatMarziProcenta(zaznam.kus))}
                      </span>
                    </TabulkaBunka>
                  </TabulkaRadek>
                ))}
              </tbody>
            </Tabulka>
          )}
        </Panel>
      </div>

      <Panel>
        <PanelHeader titulek="Rozpis dostupného skladu" popis="Počet kusů a prodejní hodnota podle kategorie" />
        <PanelBody className="p-0">
          {sklad.podleKategorie.length === 0 ? (
            <PrazdnyStav
              titulek="Sklad je prázdný"
              popis="Jakmile se objeví první kusy, uvidíš tu jejich rozpad."
            />
          ) : (
            <Tabulka>
              <TabulkaHlavicka>
                <tr>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Kategorie</th>
                  <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Kusy</th>
                  <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Hodnota</th>
                </tr>
              </TabulkaHlavicka>
              <tbody>
                {sklad.podleKategorie.map((radek) => (
                  <TabulkaRadek key={radek.kategorie}>
                    <TabulkaBunka hlavni>{KATEGORIE_POPIS[radek.kategorie]}</TabulkaBunka>
                    <TabulkaBunka className="text-right">{radek.kusu}</TabulkaBunka>
                    <TabulkaBunka className="text-right">{formatCurrency(radek.hodnota)}</TabulkaBunka>
                  </TabulkaRadek>
                ))}
              </tbody>
            </Tabulka>
          )}
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader titulek="Poslední zásahy repasu" popis="Historie oprav, čištění a testování" />
        {posledniZasahy.length === 0 ? (
          <PrazdnyStav
            titulek="Zatím žádné zásahy"
            popis="Repas se zde začne zaznamenávat s první vyhodnocenou komponentou."
          />
        ) : (
          <Tabulka>
            <TabulkaHlavicka>
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Kus</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Zásah</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Popis</th>
                <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Náklady</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Datum</th>
              </tr>
            </TabulkaHlavicka>
            <tbody>
                {posledniZasahy.map(({ zasah, zaznam }) => (
                  <TabulkaRadek key={zasah.id}>
                    <TabulkaBunka hlavni>
                      {zaznam
                        ? `${zaznam.component.vyrobce} ${zaznam.component.model}`
                        : `Neznámý kus ${zasah.kusId}`}
                    </TabulkaBunka>
                  <TabulkaBunka>
                    <Badge odstin="info">{ZASAH_POPIS[zasah.typZasahu]}</Badge>
                  </TabulkaBunka>
                  <TabulkaBunka>{zasah.popis}</TabulkaBunka>
                  <TabulkaBunka className="text-right">{formatCurrency(zasah.naklady)}</TabulkaBunka>
                  <TabulkaBunka>{formatDate(zasah.provedenoKdy)}</TabulkaBunka>
                </TabulkaRadek>
              ))}
            </tbody>
          </Tabulka>
        )}
      </Panel>
    </>
  );
}
