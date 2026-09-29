const ZAKLADNI =
  "h-9 w-9 rounded-md text-zinc-500 dark:text-zinc-400";

export type IkonaNazev = "nastenka" | "sklad" | "finance" | "sestavy" | "nastaveni";

export function Ikona({ nazev, className = "" }: { nazev: IkonaNazev; className?: string }) {
  const tridy = `${ZAKLADNI} ${className}`;

  switch (nazev) {
    case "nastenka":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={tridy} aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "sklad":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={tridy} aria-hidden="true">
          <path d="M3 8h18v12H3z" />
          <path d="M3 8l2-4h14l2 4" />
          <path d="M10 12h4" />
        </svg>
      );
    case "finance":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={tridy} aria-hidden="true">
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
          <path d="M16 13h3" />
        </svg>
      );
    case "sestavy":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={tridy} aria-hidden="true">
          <rect x="7" y="7" width="10" height="10" rx="1.5" />
          <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
        </svg>
      );
    case "nastaveni":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={tridy} aria-hidden="true">
          <path d="M4 7h6M14 7h6M4 17h10M18 17h2M4 12h2M10 12h10" />
          <circle cx="12" cy="7" r="2" />
          <circle cx="8" cy="12" r="2" />
          <circle cx="16" cy="17" r="2" />
        </svg>
      );
  }
}
