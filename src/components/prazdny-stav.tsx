export function PrazdnyStav({
  titulek,
  popis,
  akce,
}: {
  titulek: string;
  popis: string;
  akce?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{titulek}</p>
      <p className="max-w-sm text-xs text-zinc-500 dark:text-zinc-400">{popis}</p>
      {akce}
    </div>
  );
}
