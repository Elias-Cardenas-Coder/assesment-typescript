export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function formatCurrency(
  value: number,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(value);
}
