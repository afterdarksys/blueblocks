/**
 * useBalance Hook
 * Account balance tracking with auto-refresh
 */

import { useState, useEffect, useCallback } from 'react';
import { useBlueBlocks } from '../context/BlueBlocksProvider';
import { formatBBT } from '../../core/constants';

/**
 * Balance hook options
 */
export interface UseBalanceOptions {
  /** Address to check balance for (defaults to connected wallet) */
  address?: string;
  /** Auto-refresh interval in ms (0 to disable, default: 10000) */
  refreshInterval?: number;
  /** Format balance for display */
  format?: boolean;
  /** Decimal places for formatting (default: 4) */
  decimals?: number;
}

/**
 * Balance hook result
 */
export interface UseBalanceResult {
  /** Raw balance in smallest unit (wei) */
  balance: bigint | null;
  /** Formatted balance string (if format=true) */
  formatted: string | null;
  /** Address being queried */
  address: string | null;
  /** Whether balance is loading */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Manually refresh balance */
  refresh: () => Promise<void>;
}

/**
 * Hook to track account balance
 *
 * @example
 * ```tsx
 * function BalanceDisplay() {
 *   const { formatted, isLoading } = useBalance({ format: true });
 *
 *   if (isLoading) return <span>Loading...</span>;
 *
 *   return <span>{formatted} BBT</span>;
 * }
 * ```
 */
export function useBalance(options: UseBalanceOptions = {}): UseBalanceResult {
  const { client, wallet } = useBlueBlocks();

  const {
    address: addressOverride,
    refreshInterval = 10000,
    format = false,
    decimals = 4,
  } = options;

  const address = addressOverride ?? wallet?.address ?? null;

  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    if (!address) {
      setBalance(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const bal = await client.getBalance(address);
      setBalance(bal);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [client, address]);

  // Initial fetch
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0 || !address) return;

    const interval = setInterval(fetchBalance, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchBalance, refreshInterval, address]);

  // Format balance
  const formatted = balance !== null && format
    ? formatBBT(balance, decimals)
    : null;

  return {
    balance,
    formatted,
    address,
    isLoading,
    error,
    refresh: fetchBalance,
  };
}

/**
 * Hook to track multiple account balances
 *
 * @example
 * ```tsx
 * function MultiBalance() {
 *   const { balances } = useBalances(['0x1234...', '0x5678...']);
 *
 *   return (
 *     <ul>
 *       {Object.entries(balances).map(([addr, bal]) => (
 *         <li key={addr}>{addr}: {formatBBT(bal)} BBT</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useBalances(
  addresses: string[],
  options: Omit<UseBalanceOptions, 'address'> = {}
): {
  balances: Record<string, bigint>;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
} {
  const { client } = useBlueBlocks();
  const { refreshInterval = 10000 } = options;

  const [balances, setBalances] = useState<Record<string, bigint>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalances = useCallback(async () => {
    if (addresses.length === 0) {
      setBalances({});
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results: Record<string, bigint> = {};

      // Fetch in parallel
      await Promise.all(
        addresses.map(async (addr) => {
          try {
            results[addr] = await client.getBalance(addr);
          } catch {
            results[addr] = 0n;
          }
        })
      );

      setBalances(results);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [client, addresses]);

  // Initial fetch
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0 || addresses.length === 0) return;

    const interval = setInterval(fetchBalances, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchBalances, refreshInterval, addresses.length]);

  return {
    balances,
    isLoading,
    error,
    refresh: fetchBalances,
  };
}
