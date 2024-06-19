// const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
//   currency: "USD",
//   style: "currency",
//   minimumFractionDigits: 0,
// });

// export function formatCurrency(amount: number) {
//   return CURRENCY_FORMATTER.format(amount);
// }

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "USD", notation = "compact" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}
