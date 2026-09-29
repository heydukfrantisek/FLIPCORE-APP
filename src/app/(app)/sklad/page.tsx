import { FiltrSkladu } from "@/components/filtr-skladu";
import { NadpisStranky } from "@/components/nadpis-stranky";
import { Panel, PanelBody, PanelHeader } from "@/components/panel";
import { StatKarta } from "@/components/stat-karta";
import { Tabulka, TabulkaBunka, TabulkaHlavicka, TabulkaRadek } from "@/components/tabulka";
import { formatCurrency, formatPercent } from "@/lib/format";
import { STUPEN_POPIS } from "@/lib/domain/slovnik";
import { getSklad } from "@/server/repo";

export const metadata = {
  title: "Sklad | FLIPCORE",
};

export default function SkladPage() {
  const { zaznamy, prehled } = getSklad();

  return (
    <>
      <NadpisStranky
        nadpis="Sklad"
        popis="Kusy ve skladu včetně výkupní ceny, prodejní ceny a stavového hodnocení."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatKarta
          nazev="Kusy celkem"
          hodnota={`${prehled.kusuCelkem}`}
          popis={`${prehled.kusuVystavenych} vystaveno k prodeji`}
        />
        <StatKarta
          nazev="Investováno"
          hodnota={formatCurrency(prehled.investovano)}
          popis="Součet výkupních cen všech kusů ve skladu"
        />
        <StatKarta
          nazev="Hodnota vystaveného zboží"
          hodnota={formatCurrency(prehled.hodnotaVystaveno)}
          popis="Prodejní cena kusů připravených k prodeji"
          odstin="success"
        />
        <StatKarta
          nazev="Marže"
          hodnota={formatCurrency(prehled.marze)}
          popis={`${formatPercent(prehled.marzeProcenta)} vůči výkupu`}
          odstin="success"
        />
      </div>

      <Panel>
        <PanelHeader
          titulek="Rozpis podle hodnocení"
          popis="Počet vystavených kusů v jednotlivých stupních hodnocení"
        />
        <PanelBody className="p-0">
          <Tabulka>
            <TabulkaHlavicka>
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Stupeň</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Význam</th>
                <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Kusy</th>
              </tr>
            </TabulkaHlavicka>
            <tbody>
              {prehled.podleStavu.map((radek) => (
                <TabulkaRadek key={radek.stupen}>
                  <TabulkaBunka hlavni>{radek.stupen}</TabulkaBunka>
                  <TabulkaBunka>{STUPEN_POPIS[radek.stupen]}</TabulkaBunka>
                  <TabulkaBunka className="text-right">{radek.kusu}</TabulkaBunka>
                </TabulkaRadek>
              ))}
            </tbody>
          </Tabulka>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader
          titulek="Kusy v katalogu"
          popis="Filtr běží v prohlížeči, data pocházejí ze serveru"
        />
        <PanelBody>
          <FiltrSkladu zaznamy={zaznamy} />
        </PanelBody>
      </Panel>
    </>
  );
}
