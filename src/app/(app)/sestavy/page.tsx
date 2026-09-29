import { Badge } from "@/components/badge";
import { NadpisStranky } from "@/components/nadpis-stranky";
import { Panel, PanelBody, PanelHeader } from "@/components/panel";
import { PrazdnyStav } from "@/components/prazdny-stav";
import { Tabulka, TabulkaBunka, TabulkaHlavicka, TabulkaRadek } from "@/components/tabulka";
import { formatCurrency, formatNumber } from "@/lib/format";
import { KATEGORIE_POPIS, KATEGORIE_SESTAVY_POPIS, KATEGORIE_SESTAVY_POPIS_ROZVINUTA } from "@/lib/domain/slovnik";
import { porovnatSRozpoctem } from "@/lib/domain/sestavy";
import { getNastaveni, getSestavy } from "@/server/repo";

export const metadata = {
  title: "Sestavy | FLIPCORE",
};

export default function SestavyPage() {
  const sestavy = getSestavy();
  const nastaveni = getNastaveni();

  return (
    <>
      <NadpisStranky
        nadpis="Sestavy"
        popis="Konfigurace složené z kusů v katalogu, které se vzájemně nesmí překážet v socketu, paměti, rozměrech ani napájení."
      />

      {sestavy.length === 0 ? (
        <Panel>
          <PrazdnyStav
            titulek="Zatím žádná sestava"
            popis="Sestavy vzniknou v konfigurátoru, až bude v katalogu dostatek dílů."
          />
        </Panel>
      ) : (
        sestavy.map((sestava) => {
          const rozpoctet = nastaveni.rozpoctyKategorii[sestava.kategorie];
          const porovnani = porovnatSRozpoctem(sestava.zhodnoceni.celkemCena, rozpoctet);

          return (
            <Panel key={sestava.id}>
              <PanelHeader
                titulek={sestava.nazev}
                popis={KATEGORIE_SESTAVY_POPIS_ROZVINUTA[sestava.kategorie]}
                akce={
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge odstin={sestava.zhodnoceni.kompatibilni ? "success" : "danger"}>
                      {sestava.zhodnoceni.kompatibilni ? "Kompatibilní" : "Nesoulad"}
                    </Badge>
                    <Badge odstin={porovnani.vRozpoctu ? "info" : "warning"}>
                      {KATEGORIE_SESTAVY_POPIS[sestava.kategorie]} ·{" "}
                      {porovnani.vRozpoctu
                        ? `v rozpočtu ${formatCurrency(porovnani.rozdil)}`
                        : `překročeno o ${formatCurrency(-porovnani.rozdil)}`}
                    </Badge>
                  </div>
                }
              />

              <PanelBody className="flex flex-col gap-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{sestava.popis}</p>

                <div className="grid gap-3 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Cena sestavy</p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(sestava.zhodnoceni.celkemCena)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Odhadovaná spotřeba</p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatNumber(sestava.zhodnoceni.spotrebaW)} W
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Doporučený zdroj</p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatNumber(sestava.zhodnoceni.doporucenyVykonZdrojeW)} W
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Rozpočet kategorie</p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(rozpoctet)}
                    </p>
                  </div>
                </div>

                {sestava.zhodnoceni.problemy.length > 0 ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      Co je potřeba opravit
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700 dark:text-red-300">
                      {sestava.zhodnoceni.problemy.map((problem) => (
                        <li key={problem}>{problem}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <Tabulka>
                  <TabulkaHlavicka>
                    <tr>
                      <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Pozice</th>
                      <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Komponenta</th>
                      <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Cena</th>
                    </tr>
                  </TabulkaHlavicka>
                  <tbody>
                    {sestava.polozky.map((polozka) => (
                      <TabulkaRadek key={polozka.id}>
                        <TabulkaBunka>{KATEGORIE_POPIS[polozka.pozice]}</TabulkaBunka>
                        <TabulkaBunka hlavni>
                          {polozka.nazev}
                          {polozka.listingId ? null : (
                            <span className="block text-xs font-normal text-amber-600 dark:text-amber-400">
                              kus zatím není v katalogu
                            </span>
                          )}
                        </TabulkaBunka>
                        <TabulkaBunka className="text-right">
                          {formatCurrency(polozka.cenaSnapshot)}
                        </TabulkaBunka>
                      </TabulkaRadek>
                    ))}
                  </tbody>
                </Tabulka>
              </PanelBody>
            </Panel>
          );
        })
      )}
    </>
  );
}
