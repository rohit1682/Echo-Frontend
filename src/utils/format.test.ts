import { formatCurrency, compactNumber, formatPercent, currencySymbol, titleCase } from './format';

describe('format utils', () => {
  it('formats currency with the right symbol', () => {
    expect(formatCurrency(1000, 'INR')).toBe('₹1,000');
    expect(formatCurrency(1000, 'USD')).toBe('$1,000');
  });

  it('adds a sign when requested', () => {
    expect(formatCurrency(500, 'INR', { sign: true })).toBe('+₹500');
    expect(formatCurrency(-500, 'INR')).toBe('-₹500');
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
});
