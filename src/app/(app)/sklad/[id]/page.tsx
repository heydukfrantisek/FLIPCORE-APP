import { notFound } from "next/navigation";

import { Badge, type Odstin } from "@/components/badge";
import { FormularOhodnoceni } from "@/components/formular-ohodnoceni";
import { FormularTestu } from "@/components/formular-testu";
import { FormularZasahu } from "@/components/formular-zasahu";
import { NadpisStranky } from "@/components/nadpis-stranky";
import { Panel, PanelBody, PanelHeader } from "@/components/panel";
import { PrazdnyStav } from "@/components/prazdny-stav";
import { Tabulka, TabulkaBunka, TabulkaHlavicka, TabulkaRadek } from "@/components/tabulka";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  KATEGORIE_POPIS,
  PRODEJCE_POPIS,
  STAV_KUSU_POPIS,
  STUPEN_POPIS,
  TEST_POPIS,
  TYP_TESTU_POPIS,
  ZASAH_POPIS,
} from "@/lib/domain/slovnik";
import type { StavKusu, StupenStavu, TestEvidence } from "@/lib/domain/types";
import { getKusZDetailem } from "@/server/repo";

export const metadata = {
  title: "Detail kusu | FLIPCORE",
};

/**
 * Next 16 předává `params` jako promise, takže se musí `await`-nout. Bez toho
 * by build skončil chybou typu a hodnota by nebyla čitelná.
 */
export default async function DetailKusuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const zaznam = getKusZDetailem(id);

  if (!zaznam) {
    notFound();
  }

  const { kus, component, prodejce, odvozeni, zasahy, testy, historieHodnoceni } = zaznam;
  const zapsaneOhodnoceni = zaznam.stupen;
  // Kus, který je v katalogu nebo už prodaný, se zpět do repasi nevrací —
  // formuláře se proto vůbec nekreslí. Kontrola je i na straně akce; tady je
  // jen pohodlí pro provozovatele.
  const mimoRepas = VETY_ZAVERCE[kus.stav] !== undefined;
  const vetaZaverce = VETY_ZAVERCE[kus.stav];
  const bezDukazu = zasahy.length === 0 && testy.length === 0;

  return (
    <>
      <NadpisStranky
        nadpis={`${component.vyrobce} ${component.model}`}
        popis="Repas, důkazy a stavové hodnocení kusu. Hodnocení se odvozuje z důkazů, nejde je zvolit ručně."
      />

      <Panel>
        <PanelHeader titulek="Identifikace kusu" popis="Základní údaje z evidence výkupu" />
        <PanelBody>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Polozka popisek="Komponenta" hodnota={`${component.vyrobce} ${component.model}`} />
            <Polozka popisek="Kategorie" hodnota={KATEGORIE_POPIS[component.kategorie]} />
            <Polozka
              popisek="Prodejce"
              hodnota={`${prodejce.nazev} (${PRODEJCE_POPIS[prodejce.typ]})`}
            />
            <Polozka popisek="Stav kusu" hodnota={STAV_KUSU_POPIS[kus.stav]} />
            <Polozka popisek="Výkupní cena" hodnota={formatCurrency(kus.nakupniCena)} />
            <Polozka popisek="Datum výkupu" hodnota={formatDate(kus.datumVykupu)} />
          </dl>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader
          titulek="Stavové hodnocení"
          popis="Stupeň se odvozuje z důkazů na kusu — ne volí se ručně"
        />
        <PanelBody className="flex flex-col gap-4">
          {odvozeni.stupen === null ? (
            <>
              <p className="text-sm text-zinc-900 dark:text-zinc-50">{odvozeni.duvod}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Kus zatím nemá stupeň. Doplňte zásah nebo test podle toho, co odvození
                vyžaduje, a stupeň se objeví sám.
              </p>
            </>
          ) : (
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <p className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {odvozeni.stupen}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{odvozeni.duvod}</p>
            </div>
          )}

          {odvozeni.stupen !== null ? (
            <ul className="flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <li>
                {zapsaneOhodnoceni ? (
                  <>
                    Zapsané hodnocení:{" "}
                    <a
                      href="#historie-hodnoceni"
                      className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:text-zinc-50 dark:hover:text-zinc-300 dark:focus-visible:outline-zinc-50"
                    >
                      stupeň {zapsaneOhodnoceni.stupen} ze dne{" "}
                      {formatDate(zapsaneOhodnoceni.zhodnocenoKdy)}
                    </a>
                  </>
                ) : (
                  "Zapsané hodnocení zatím není — stupeň je jen odvozený z důkazů."
                )}
              </li>
              <li>
                {testy.length > 0 ? (
                  <>
                    Poslední test: {testy[0].nazevTestu} dne {formatDate(testy[0].provedenoKdy)}.
                  </>
                ) : (
                  "Poslední test: zatím žádný — datum posledního důkazu tak nelze ukázat."
                )}
              </li>
            </ul>
          ) : null}

          {!mimoRepas ? <FormularOhodnoceni kusId={kus.id} odvozeni={odvozeni} /> : null}
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader
          titulek="Důkazy"
          popis="Zapsané testy, ze kterých stupeň vychází. Novější nahoře."
        />
        {testy.length === 0 ? (
          <PrazdnyStav
            titulek="Zatím žádné testy"
            popis="Důkaz o stavu kusu vznikne prvním zapsaným testem níže."
          />
        ) : (
          <PanelBody className="p-0">
            {/* Na úzkém displeji je tabulka příliš široká, proto se nahrazuje
                jednosloupcovým seznamem se stejnými údaji. */}
            <ul className="divide-y divide-zinc-200 sm:hidden dark:divide-zinc-800">
              {testy.map((test) => (
                <li key={test.id} className="flex flex-col gap-1 px-5 py-4">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {test.nazevTestu}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {TYP_TESTU_POPIS[test.typTestu]} · {formatDate(test.provedenoKdy)}
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    <Badge odstin={odstinVysledku(test.vysledek)}>
                      {TEST_POPIS[test.vysledek]}
                    </Badge>
                    {test.typTestu === "vizualni" ? (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {test.nalezenaVada ? "Vada zjištěna" : "bez vady"}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            <div className="hidden sm:block">
              <Tabulka>
                <TabulkaHlavicka>
                  <tr>
                    <Hlavicka>Test</Hlavicka>
                    <Hlavicka>Typ testu</Hlavicka>
                    <Hlavicka>Výsledek</Hlavicka>
                    <Hlavicka>Nalezena vada</Hlavicka>
                    <Hlavicka>Datum</Hlavicka>
                  </tr>
                </TabulkaHlavicka>
                <tbody>
                  {testy.map((test) => (
                    <TabulkaRadek key={test.id}>
                      <TabulkaBunka hlavni>{test.nazevTestu}</TabulkaBunka>
                      <TabulkaBunka>{TYP_TESTU_POPIS[test.typTestu]}</TabulkaBunka>
                      <TabulkaBunka>
                        <Badge odstin={odstinVysledku(test.vysledek)}>
                          {TEST_POPIS[test.vysledek]}
                        </Badge>
                      </TabulkaBunka>
                      {/* Příznak vady má význam jen u vizuální kontroly; u ostatních
                          typů by jeho zobrazení klamalo. */}
                      <TabulkaBunka>
                        {test.typTestu === "vizualni" ? (
                          test.nalezenaVada ? "Vada zjištěna" : "bez vady"
                        ) : (
                          "—"
                        )}
                      </TabulkaBunka>
                      <TabulkaBunka>{formatDate(test.provedenoKdy)}</TabulkaBunka>
                    </TabulkaRadek>
                  ))}
                </tbody>
              </Tabulka>
            </div>
          </PanelBody>
        )}
      </Panel>

      <Panel>
        <PanelHeader
          titulek="Historie zásahů"
          popis="Co se s kusem dělalo. Novější zásah nahoře."
        />
        {zasahy.length === 0 ? (
          <PrazdnyStav
            titulek="Zatím žádné zásahy"
            popis="První zásah na kusu se zapíše níže a přesune kus do stavu „V repasu“."
          />
        ) : (
          <PanelBody className="p-0">
            {/* Jednosloupcový náhled na úzkém displeji, viz tabulka důkazů. */}
            <ul className="divide-y divide-zinc-200 sm:hidden dark:divide-zinc-800">
              {zasahy.map((zasah) => (
                <li key={zasah.id} className="flex flex-col gap-1 px-5 py-4">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {ZASAH_POPIS[zasah.typZasahu]} · {formatDate(zasah.provedenoKdy)}
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">
                    {zasah.popis}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Měnil se díl: {zasah.nahradniDil ? "ano" : "ne"} · Náklady{" "}
                    {formatCurrency(zasah.naklady)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="hidden sm:block">
              <Tabulka>
                <TabulkaHlavicka>
                  <tr>
                    <Hlavicka>Typ zásahu</Hlavicka>
                    <Hlavicka>Popis</Hlavicka>
                    <Hlavicka>Měnil se díl</Hlavicka>
                    <Hlavicka className="text-right">Náklady</Hlavicka>
                    <Hlavicka>Datum</Hlavicka>
                  </tr>
                </TabulkaHlavicka>
                <tbody>
                  {zasahy.map((zasah) => (
                    <TabulkaRadek key={zasah.id}>
                      <TabulkaBunka hlavni>{ZASAH_POPIS[zasah.typZasahu]}</TabulkaBunka>
                      <TabulkaBunka>{zasah.popis}</TabulkaBunka>
                      <TabulkaBunka>{zasah.nahradniDil ? "ano" : "ne"}</TabulkaBunka>
                      <TabulkaBunka className="text-right">
                        {formatCurrency(zasah.naklady)}
                      </TabulkaBunka>
                      <TabulkaBunka>{formatDate(zasah.provedenoKdy)}</TabulkaBunka>
                    </TabulkaRadek>
                  ))}
                </tbody>
              </Tabulka>
            </div>
          </PanelBody>
        )}
      </Panel>

      <Panel>
        <PanelHeader
          titulek="Historie hodnocení"
          popis="Oprava chybného stupně je nový záznam — původní zůstává dohledatelný"
        />
        {historieHodnoceni.length === 0 ? (
          <PrazdnyStav
            titulek="Zatím žádné hodnocení"
            popis="Stupeň se zapíše, až z důkazů nějaký vyplýne."
          />
        ) : (
          <PanelBody className="p-0">
            {/* Kotva, na kterou míří zmínka o zapsaném hodnocení výše. */}
            <div id="historie-hodnoceni" className="p-5">
              <ul className="flex flex-col gap-3">
                {historieHodnoceni.map((hodnoceni) => (
                  <li key={hodnoceni.id} className="flex flex-wrap items-baseline gap-x-3">
                    <Badge odstin={odstinStupu(hodnoceni.stupen)}>{hodnoceni.stupen}</Badge>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {hodnoceni.popis}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatDate(hodnoceni.zhodnocenoKdy)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </PanelBody>
        )}
      </Panel>

      <Panel>
        <PanelHeader titulek="Legenda stupňů" />
        <PanelBody className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2">
            {(Object.keys(STUPEN_POPIS) as StupenStavu[]).map((stupen) => (
              <li key={stupen} className="flex flex-wrap items-baseline gap-x-3">
                {/* Textová popiska je vedle písmene — barva ani písmeno samy
                    o sobě stupeň nevysvětlí. */}
                <Badge odstin={odstinStupu(stupen)}>{stupen}</Badge>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {STUPEN_POPIS[stupen].replace(`${stupen} — `, "")}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Stupeň se odvozuje z důkazů — z zásahů a testů na kusu. Nedá se zvolit
            ručně a nelze ho zapsat bez důkazů, které by ho odůvodňovaly.
          </p>
        </PanelBody>
      </Panel>

      {mimoRepas && vetaZaverce ? (
        <Panel>
          <PanelHeader titulek="Zápis do Repasu je uzavřen" />
          <PanelBody>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{vetaZaverce}</p>
          </PanelBody>
        </Panel>
      ) : (
        <>
          <Panel>
            <PanelHeader
              titulek="Zapsat zásah"
              popis="Co jste na kusu udělali. První zásah přesune kus do stavu „V repasu“."
            />
            <PanelBody>
              {bezDukazu ? (
                <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
                  Kus zatím nemá žádný důkaz. Začněte zásahem nebo testem — bez nich
                  stupeň neodvodíme a nikdo by ho nevymyslel.
                </p>
              ) : null}
              <FormularZasahu kusId={kus.id} />
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader
              titulek="Zapsat test"
              popis="Výsledek testu jako důkaz o stavu kusu"
            />
            <PanelBody>
              <FormularTestu kusId={kus.id} />
            </PanelBody>
          </Panel>
        </>
      )}
    </>
  );
}

/** Věta, která se zobrazí místo formulářů, když kus už nepatří do Repasu. */
const VETY_ZAVERCE: Partial<Record<StavKusu, string>> = {
  vystaveno: "Kus je vystavený a zpět do Repasu se nevrací.",
  rezervovano: "Kus je rezervovaný a zpět do Repasu se nevrací.",
  prodano: "Kus je prodaný a zpět do Repasu se nevrací.",
};

function Polozka({ popisek, hodnota }: { popisek: string; hodnota: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{popisek}</dt>
      <dd className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{hodnota}</dd>
    </div>
  );
}

function Hlavicka({
  children,
  className = "text-left",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`px-5 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 ${className}`}
    >
      {children}
    </th>
  );
}

function odstinStupu(stupen: StupenStavu): Odstin {
  switch (stupen) {
    case "A":
      return "success";
    case "B":
      return "info";
    case "C":
      return "warning";
    case "D":
      return "danger";
  }
}

function odstinVysledku(vysledek: TestEvidence["vysledek"]): Odstin {
  switch (vysledek) {
    case "prosel":
      return "success";
    case "casti":
      return "warning";
    case "selhal":
      return "danger";
  }
}
