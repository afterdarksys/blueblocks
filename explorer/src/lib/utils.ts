// Utility functions for the explorer

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Address formatting
export function shortenAddress(address: string, chars = 6): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function shortenHash(hash: string, chars = 8): string {
  if (!hash) return '';
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

// Number formatting
export function formatNumber(num: number | string, decimals = 2): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';

  if (n >= 1e12) return `${(n / 1e12).toFixed(decimals)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(decimals)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(decimals)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(decimals)}K`;

  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

// BBT formatting (8 decimal places, like satoshis)
export function formatBBT(amount: string | number, decimals = 8): string {
  const n = typeof amount === 'string' ? BigInt(amount) : BigInt(Math.floor(amount));
  const divisor = BigInt(10 ** 8);
  const whole = n / divisor;
  const fraction = n % divisor;

  const fractionStr = fraction.toString().padStart(8, '0').slice(0, decimals);
  const trimmedFraction = fractionStr.replace(/0+$/, '');

  if (trimmedFraction) {
    return `${whole.toLocaleString()}.${trimmedFraction}`;
  }
  return whole.toLocaleString();
}

// Gas formatting
export function formatGas(gas: number): string {
  return gas.toLocaleString();
}

// Time formatting
export function formatTimeAgo(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatDateTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return format(date, 'MMM d, yyyy HH:mm:ss');
}

export function formatDate(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return format(date, 'MMM d, yyyy');
}

// Size formatting
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Transaction type labels
export function getTxTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    transfer: 'Transfer',
    contract_deploy: 'Contract Deploy',
    contract_call: 'Contract Call',
    validator_register: 'Validator Registration',
    validator_stake: 'Stake',
    validator_unstake: 'Unstake',
    health_record_create: 'Health Record',
    health_record_update: 'Record Update',
    health_record_share: 'Record Share',
  };
  return labels[type] || type;
}

// Status colors
export function getStatusColor(status: string): string {
  switch (status) {
    case 'success':
    case 'active':
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'failed':
    case 'jailed':
      return 'text-red-600 bg-red-100';
    case 'pending':
    case 'processing':
    case 'unbonding':
      return 'text-yellow-600 bg-yellow-100';
    case 'inactive':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Validator type colors
export function getValidatorTypeColor(type: string): string {
  switch (type) {
    case 'healthcare':
      return 'text-health-600 bg-health-100';
    case 'treasury':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-blueblocks-600 bg-blueblocks-100';
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Detect address type
export function getAddressType(address: string): 'account' | 'contract' | 'validator' {
  if (address.startsWith('bbval')) return 'validator';
  if (address.startsWith('bbcon')) return 'contract';
  return 'account';
}

// Search query detection
export function detectSearchType(
  query: string
): 'block' | 'transaction' | 'address' | 'unknown' {
  // Block height (numeric)
  if (/^\d+$/.test(query)) return 'block';

  // Transaction hash (64 hex chars)
  if (/^[0-9a-fA-F]{64}$/.test(query)) return 'transaction';

  // Address (starts with bb)
  if (/^bb[a-zA-Z0-9]{40,}$/.test(query)) return 'address';

  return 'unknown';
}
