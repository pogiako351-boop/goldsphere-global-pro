import { currencySymbols } from '@/constants/goldData';

export function formatCurrency(amount: number, currency: string): string {
  const symbol = currencySymbols[currency] || '$';
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}`;
}

export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

export function getTimeAgo(): string {
  const now = new Date();
  const minutes = Math.floor(Math.random() * 5) + 1;
  return `${minutes}m ago`;
}

export function getCurrentTimestamp(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
