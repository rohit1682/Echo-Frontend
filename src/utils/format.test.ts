import {
  formatCurrency,
  compactNumber,
  formatPercent,
  currencySymbol,
  titleCase,
  formatDate,
} from './format';

describe('format utils', () => {
  it('formats currency with the right symbol', () => {
    expect(formatCurrency(1000)).toBe('₹1,000'); // defaults to INR
    expect(formatCurrency(1000, 'INR')).toBe('₹1,000');
    expect(formatCurrency(1000, 'USD')).toBe('$1,000');
  });

  it('adds a sign when requested', () => {
    expect(formatCurrency(500, 'INR', { sign: true })).toBe('+₹500');
    expect(formatCurrency(-500, 'INR')).toBe('-₹500');
  });

  it('formats currency compactly when requested', () => {
    expect(formatCurrency(150000, 'INR', { compact: true })).toBe('₹1.50L');
    expect(formatCurrency(500, 'INR', { compact: true })).toBe('₹500');
  });

  it('compacts large numbers (Indian units)', () => {
    expect(compactNumber(150000)).toBe('1.50L');
    expect(compactNumber(12000000)).toBe('1.20Cr');
    expect(compactNumber(2500)).toBe('2.5K');
    expect(compactNumber(500)).toBe('500');
  });

  it('formats percentages with a sign', () => {
    expect(formatPercent(17.35)).toBe('+17.4%');
    expect(formatPercent(-4)).toBe('-4.0%');
  });

  it('maps currency symbols with a fallback', () => {
    expect(currencySymbol('EUR')).toBe('€');
    expect(currencySymbol('GBP')).toBe('£');
    expect(currencySymbol('JPY')).toBe('JPY ');
  });

  it('title-cases snake/space separated words', () => {
    expect(titleCase('mutual_fund')).toBe('Mutual Fund');
    expect(titleCase('high risk')).toBe('High Risk');
  });

  it('formats dates from strings and Date objects', () => {
    expect(formatDate('2024-04-01')).toMatch(/2024/);
    expect(formatDate(new Date('2024-04-01'))).toMatch(/Apr/);
    expect(formatDate('2024-04-01', { year: undefined })).toMatch(/Apr/);
  });
});
