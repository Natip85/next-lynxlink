export enum DiscountCodeType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

// export function formatPrice(
//   price: number | string,
//   options: {
//     currency?: "USD" | "EUR" | "GBP" | "BDT";
//     notation?: Intl.NumberFormatOptions["notation"];
//   } = {}
// ) {
//   const { currency = "USD", notation = "compact" } = options;

//   const numericPrice = typeof price === "string" ? parseFloat(price) : price;

//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency,
//     notation,
//     maximumFractionDigits: 2,
//   }).format(numericPrice);
// }

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", { style: "percent" });

export function formatDiscountCode({
  discountAmount,
  discountType,
}: {
  discountAmount: number;
  discountType: string;
}) {
  switch (discountType) {
    case DiscountCodeType.PERCENTAGE:
      return PERCENT_FORMATTER.format(discountAmount / 100);
    case DiscountCodeType.FIXED:
      return formatPrice(discountAmount);
    default:
      throw new Error(`Invalid discount code type ${discountType}`);
  }
}

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(date: Date) {
  return DATE_TIME_FORMATTER.format(date);
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

export function formatDate(date: Date) {
  return DATE_FORMATTER.format(date);
}
