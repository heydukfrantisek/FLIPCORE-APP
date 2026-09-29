const formatter = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  maximumFractionDigits: 2,
});

export function formatCurrency(amountInCents: number): string {
  return formatter.format(amountInCents / 100);
}
