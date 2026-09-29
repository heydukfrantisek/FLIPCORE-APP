import { Badge } from "@/components/badge";
import { NadpisStranky } from "@/components/nadpis-stranky";
import { Panel, PanelBody, PanelHeader } from "@/components/panel";
import { PrazdnyStav } from "@/components/prazdny-stav";
import { StatKarta } from "@/components/stat-karta";
import { Tabulka, TabulkaBunka, TabulkaHlavicka, TabulkaRadek } from "@/components/tabulka";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";
import { nazevMesice } from "@/lib/domain/finance";
import { getFinance } from "@/server/repo";

export const metadata = {
  title: "Finance | FLIPCORE",
};

export default function FinancePage() {
  const { transakce, prehled } = getFinance();

  const nejnovejsi = [...transakce].sort(
    (a, b) => Date.parse(b.datum) - Date.parse(a.datum),
  );

  return (
    <>
      <NadpisStranky
        nadpis="Finance"
        popis="Příjmy, výdaje a daňový přehled zaevidovaných pohybů."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatKarta nazev="Příjmy" hodnota={formatCurrency(prehled.prijmy)} odstin="success" />
        <StatKarta nazev="Výdaje" hodnota={formatCurrency(prehled.vydaje)} odstin="danger" />
        <StatKarta
          nazev="Výsledek"
          hodnota={formatCurrency(prehled.vysledek)}
          popis={`${formatPercent(prehled.marzeProcenta)} z příjmů`}
          odstin={prehled.vysledek >= 0 ? "success" : "danger"}
        />
        <StatKarta
          nazev="DPH k odvedení"
          hodnota={formatCurrency(prehled.dph)}
          popis={`Základ ${formatCurrency(prehled.zakladDanoveZakladny)} při ${formatPercent(prehled.dphProcenta)}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader titulek="Výsledek podle měsíce" popis="Příjmy, výdaje a rozdíl" />
          <PanelBody className="p-0">
            {prehled.podleMesice.length === 0 ? (
              <PrazdnyStav
                titulek="Zatím žádné pohyby"
                popis="Po záznamu první transakce se tu objeví měsíční přehled."
              />
            ) : (
              <Tabulka>
                <TabulkaHlavicka>
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Měsíc</th>
                    <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Příjmy</th>
                    <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Výdaje</th>
                    <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Výsledek</th>
                  </tr>
                </TabulkaHlavicka>
                <tbody>
                  {prehled.podleMesice.map((mesic) => (
                    <TabulkaRadek key={mesic.mesic}>
                      <TabulkaBunka hlavni>
                        {nazevMesice(mesic.mesic)}
                        <span className="block text-xs font-normal text-zinc-400 dark:text-zinc-500">
                          {mesic.mesic}
                        </span>
                      </TabulkaBunka>
                      <TabulkaBunka className="text-right">{formatCurrency(mesic.prijmy)}</TabulkaBunka>
                      <TabulkaBunka className="text-right">{formatCurrency(mesic.vydaje)}</TabulkaBunka>
                      <TabulkaBunka
                        className={`text-right font-medium ${mesic.vysledek >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {formatCurrency(mesic.vysledek)}
                      </TabulkaBunka>
                    </TabulkaRadek>
                  ))}
                </tbody>
              </Tabulka>
            )}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader titulek="Pohyby podle kategorie" popis="Součet za všechna období" />
          <PanelBody className="p-0">
            <Tabulka>
              <TabulkaHlavicka>
                <tr>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Kategorie</th>
                  <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Částka</th>
                </tr>
              </TabulkaHlavicka>
              <tbody>
                {prehled.podleKategorie.map((radek) => (
                  <TabulkaRadek key={radek.kategorie}>
                    <TabulkaBunka hlavni>{radek.kategorie}</TabulkaBunka>
                    <TabulkaBunka className="text-right">{formatCurrency(radek.castka)}</TabulkaBunka>
                  </TabulkaRadek>
                ))}
              </tbody>
            </Tabulka>
          </PanelBody>
        </Panel>
      </div>

      <Panel>
        <PanelHeader titulek="Poslední transakce" popis="Chronologicky od nejnovější" />
        {nejnovejsi.length === 0 ? (
          <PrazdnyStav
            titulek="Žádné transakce"
            popis="Zde se zobrazí jednotlivé výkupy, prodeje a náklady."
          />
        ) : (
          <Tabulka>
            <TabulkaHlavicka>
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Datum</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Popis</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Kategorie</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Typ</th>
                <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Částka</th>
              </tr>
            </TabulkaHlavicka>
            <tbody>
              {nejnovejsi.map((transakce) => (
                <TabulkaRadek key={transakce.id}>
                  <TabulkaBunka>{formatDate(transakce.datum)}</TabulkaBunka>
                  <TabulkaBunka hlavni>{transakce.popis}</TabulkaBunka>
                  <TabulkaBunka>{transakce.kategorie}</TabulkaBunka>
                  <TabulkaBunka>
                    <Badge odstin={transakce.typ === "prijem" ? "success" : "danger"}>
                      {transakce.typ === "prijem" ? "Příjem" : "Výdaj"}
                    </Badge>
                  </TabulkaBunka>
                  <TabulkaBunka className="text-right" hlavni>
                    {transakce.typ === "prijem" ? "+" : "−"}
                    {formatCurrency(transakce.castka)}
                  </TabulkaBunka>
                </TabulkaRadek>
              ))}
            </tbody>
          </Tabulka>
        )}
      </Panel>
    </>
  );
}
