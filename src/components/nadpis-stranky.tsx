export function NadpisStranky({
  nadpis,
  popis,
  akce,
}: {
  nadpis: string;
  popis?: string;
  akce?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {nadpis}
        </h1>
        {popis ? (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{popis}</p>
        ) : null}
      </div>
      {akce}
    </div>
  );
}
