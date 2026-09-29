const menaFormatter = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  maximumFractionDigits: 2,
});

const cisloFormatter = new Intl.NumberFormat("cs-CZ", {
  maximumFractionDigits: 0,
});

const desetinneFormatter = new Intl.NumberFormat("cs-CZ", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const datumFormatter = new Intl.DateTimeFormat("cs-CZ", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatCurrency(amountInCents: number): string {
  return menaFormatter.format(amountInCents / 100);
}

export function formatNumber(value: number): string {
  return cisloFormatter.format(value);
}

/** Procenta včetně jednoho desetinného místa, například `23,5 %`. */
export function formatPercent(value: number): string {
  return `${desetinneFormatter.format(value)} %`;
}

export function formatDate(isoDate: string): string {
  return datumFormatter.format(new Date(isoDate));
}
