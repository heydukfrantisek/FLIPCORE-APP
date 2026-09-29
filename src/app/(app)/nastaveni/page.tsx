import { NadpisStranky } from "@/components/nadpis-stranky";
import { Panel, PanelBody, PanelHeader } from "@/components/panel";
import { formatCurrency, formatNumber } from "@/lib/format";
import { KATEGORIE_SESTAVY_POPIS } from "@/lib/domain/slovnik";
import { getNastaveni } from "@/server/repo";

export const metadata = {
  title: "Nastavení | FLIPCORE",
};

/** Pole jsou jen pro čtení: uložení je napojené až na uložiště dat, viz architektura. */
const TRIDY_POLE =
  "w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50";

export default function NastaveniPage() {
  const nastaveni = getNastaveni();

  return (
    <>
      <NadpisStranky
        nadpis="Nastavení"
        popis="Obchod, rozpočty cenových kategorií a daňové sazeb. Hodnoty se zatíčají ze serveru, ukládání bude napojené po výběru uložiště."
      />

      <Panel>
        <PanelHeader titulek="Obchod" popis="Základní údaje zobrazované v aplikaci" />
        <PanelBody className="flex flex-col gap-4">
          <label className="flex max-w-sm flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Název obchodu</span>
            <input className={TRIDY_POLE} value={nastaveni.nazevObchodu} readOnly />
          </label>

          <label className="flex max-w-sm flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Měna</span>
            <input className={TRIDY_POLE} value={nastaveni.mena} readOnly />
          </label>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader
          titulek="Rozpočty cenových kategorií"
          popis="Orientační rozpočty sestav. U bazarového zboží jsou ceny proměnlivé, hodnoty se potvrdí před nasazením."
        />
        <PanelBody className="flex flex-col gap-4">
          {(Object.keys(nastaveni.rozpoctyKategorii) as Array<
            keyof typeof nastaveni.rozpoctyKategorii
          >).map((kategorie) => (
            <label key={kategorie} className="flex max-w-sm flex-col gap-1 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">
                {KATEGORIE_SESTAVY_POPIS[kategorie]}
              </span>
              <input
                className={TRIDY_POLE}
                value={formatCurrency(nastaveni.rozpoctyKategorii[kategorie])}
                readOnly
              />
            </label>
          ))}
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader titulek="Daně a sklad" popis="Sazby používané ve výpočtech" />
        <PanelBody className="flex flex-col gap-4">
          <label className="flex max-w-sm flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">DPH</span>
            <input className={TRIDY_POLE} value={`${formatNumber(nastaveni.dphProcenta)} %`} readOnly />
          </label>

          <label className="flex max-w-sm flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">
              Rezerva kusů nad stavem dostupným k prodeji
            </span>
            <input className={TRIDY_POLE} value={`${formatNumber(nastaveni.skladovaRezerva)} kusy`} readOnly />
          </label>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader titulek="Ještě není napojeno" popis="Co bude potřeba doplnit" />
        <PanelBody>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
            <li>Ukládání nastavení — vyžaduje rozhodnutou persistence.</li>
            <li>Přihlášení a role — kdo může nastavení měnit.</li>
            <li>Historie změn, kdo a kdy hodnotu upravil.</li>
          </ul>
        </PanelBody>
      </Panel>
    </>
  );
}
