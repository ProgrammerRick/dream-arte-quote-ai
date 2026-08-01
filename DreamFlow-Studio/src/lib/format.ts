const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const currencyFormatterPrecise = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

const monthLabelFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
});

const monthYearFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

const dayMonthFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

export function formatCurrency(value: number | string, precise = false) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return precise ? currencyFormatterPrecise.format(numeric) : currencyFormatter.format(numeric);
}

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatMonthLabel(date: Date) {
  const label = monthLabelFormatter.format(date).replace(".", "");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatMonthYear(date: Date) {
  const label = monthYearFormatter.format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDayMonth(date: Date) {
  return dayMonthFormatter.format(date).replace(".", "");
}

export function formatPercent(value: number, digits = 0) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function daysUntil(date: Date | string) {
  const target = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
