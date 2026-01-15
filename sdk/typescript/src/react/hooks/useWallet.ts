/**
 * useWallet Hook
 * Wallet connection and management
 */

import { useState, useCallback } from 'react';
import { useBlueBlocks } from '../context/BlueBlocksProvider';
import type { Wallet } from '../../wallet';

/**
 * Wallet state and actions
 */
export interface UseWalletResult {
  /** Currently connected wallet */
  wallet: Wallet | null;
  /** Wallet address (null if not connected) */
  address: string | null;
  /** Whether a wallet is connected */
  isConnected: boolean;
  /** Whether an operation is in progress */
  isLoading: boolean;
  /** Last error */
  error: Error | null;
  /** Connect to an existing wallet */
  connect: (login: string, password: string) => Promise<void>;
  /** Disconnect the wallet */
  disconnect: () => void;
  /** Create a new wallet */
  create: (login: string, password: string) => Promise<Wallet>;
  /** Import wallet from private key */
  import: (login: string, password: string, privateKey: string) => Promise<Wallet>;
  /** Sign a message */
  sign: (message: string | Uint8Array) => Promise<string>;
  /** Verify a signature */
  verify: (message: string | Uint8Array, signature: string) => Promise<boolean>;
}

/**
 * Hook for wallet management
 *
 * @example
 * ```tsx
 * function WalletButton() {
 *   const { isConnected, address, connect, disconnect } = useWallet();
 *
 *   if (isConnected) {
 *     return (
 *       <div>
 *         <span>{address}</span>
 *         <button onClick={disconnect}>Disconnect</button>
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <button onClick={() => connect('mylogin', 'mypassword')}>
 *       Connect Wallet
 *     </button>
 *   );
 * }
 * ```
 */
export function useWallet(): UseWalletResult {
  const {
    wallet,
    isConnected,
    error: contextError,
    connect: contextConnect,
    disconnect: contextDisconnect,
    createWallet,
    importWallet,
  } = useBlueBlocks();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Connect to wallet
  const connect = useCallback(async (login: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await contextConnect(login, password);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [contextConnect]);

  // Disconnect
  const disconnect = useCallback(() => {
    contextDisconnect();
    setError(null);
  }, [contextDisconnect]);

  // Create new wallet
  const create = useCallback(async (login: string, password: string): Promise<Wallet> => {
    setIsLoading(true);
    setError(null);
    try {
      return await createWallet(login, password);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [createWallet]);

  // Import wallet
  const importFn = useCallback(async (
    login: string,
    password: string,
    privateKey: string
  ): Promise<Wallet> => {
    setIsLoading(true);
    setError(null);
    try {
      return await importWallet(login, password, privateKey);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [importWallet]);

  // Sign message
  const sign = useCallback(async (message: string | Uint8Array): Promise<string> => {
    if (!wallet) {
      throw new Error('No wallet connected');
    }
    return wallet.sign(message);
  }, [wallet]);

  // Verify signature
  const verify = useCallback(async (
    message: string | Uint8Array,
    signature: string
  ): Promise<boolean> => {
    if (!wallet) {
      throw new Error('No wallet connected');
    }
    return wallet.verify(message, signature);
  }, [wallet]);

  return {
    wallet,
    address: wallet?.address ?? null,
    isConnected,
    isLoading,
    error: error ?? contextError,
    connect,
    disconnect,
    create,
    import: importFn,
    sign,
    verify,
  };
}
