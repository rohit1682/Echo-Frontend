/** Formatting helpers for money, percentages and dates (Indian locale default). */

export function formatCurrency(
  amount: number,
  currency = 'INR',
  opts: { compact?: boolean; sign?: boolean } = {},
): string {
  const { compact = false, sign = false } = opts;
  const abs = Math.abs(amount);
  const symbol = currencySymbol(currency);
  let body: string;

  if (compact && abs >= 1000) {
    body = compactNumber(abs);
  } else {
    body = abs.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  const signStr = amount < 0 ? '-' : sign ? '+' : '';
  return `${signStr}${symbol}${body}`;
}

export function compactNumber(n: number): string {
  if (n >= 1_00_00_000) return `${(n / 1_00_00_000).toFixed(2)}Cr`;
  if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(2)}L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}

export function currencySymbol(currency: string): string {
  switch (currency) {
    case 'INR':
      return '₹';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    default:
      return `${currency} `;
  }
}

export function formatPercent(value: number, digits = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatDate(input: string | Date, opts: Intl.DateTimeFormatOptions = {}): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', ...opts });
}

export function titleCase(s: string): string {
  return s
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
