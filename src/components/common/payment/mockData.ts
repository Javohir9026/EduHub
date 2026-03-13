export function formatCurrency(amount: number): string {
  return amount.toLocaleString("uz-UZ").replace(/,/g, " ") + " UZS";
}

export function formatMonthName(monthStr: string): string {
  const date = new Date(monthStr);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
