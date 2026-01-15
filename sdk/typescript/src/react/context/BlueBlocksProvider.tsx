/**
 * BlueBlocks React Context Provider
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { BlueBlocksClient, NetworkConfig, Networks } from '../../core';
import { Wallet, Keystore, getKeystore } from '../../wallet';

/**
 * BlueBlocks context state
 */
export interface BlueBlocksState {
  /** SDK client for RPC calls */
  client: BlueBlocksClient;
  /** Current network configuration */
  network: NetworkConfig;
  /** Keystore for wallet management */
  keystore: Keystore;
  /** Currently connected wallet (if any) */
  wallet: Wallet | null;
  /** Whether a wallet is connected */
  isConnected: boolean;
  /** Whether the provider is initializing */
  isLoading: boolean;
  /** Connection error (if any) */
  error: Error | null;
}

/**
 * BlueBlocks context actions
 */
export interface BlueBlocksActions {
  /** Connect a wallet */
  connect: (login: string, password: string) => Promise<void>;
  /** Disconnect the current wallet */
  disconnect: () => void;
  /** Create a new wallet */
  createWallet: (login: string, password: string) => Promise<Wallet>;
  /** Import a wallet from private key */
  importWallet: (login: string, password: string, privateKey: string) => Promise<Wallet>;
  /** Switch to a different network */
  switchNetwork: (network: NetworkConfig | string) => void;
}

export type BlueBlocksContextValue = BlueBlocksState & BlueBlocksActions;

const BlueBlocksContext = createContext<BlueBlocksContextValue | null>(null);

/**
 * Provider props
 */
export interface BlueBlocksProviderProps {
  /** Initial network (default: 'local') */
  network?: NetworkConfig | string;
  /** Auto-connect to last used wallet */
  autoConnect?: boolean;
  /** Children components */
  children: React.ReactNode;
}

/**
 * BlueBlocks Provider Component
 *
 * @example
 * ```tsx
 * import { BlueBlocksProvider, Networks } from '@blueblocks/sdk/react';
 *
 * function App() {
 *   return (
 *     <BlueBlocksProvider network={Networks.testnet}>
 *       <MyApp />
 *     </BlueBlocksProvider>
 *   );
 * }
 * ```
 */
export function BlueBlocksProvider({
  network: initialNetwork = 'local',
  autoConnect = false,
  children,
}: BlueBlocksProviderProps) {
  // Resolve network config
  const resolveNetwork = useCallback((net: NetworkConfig | string): NetworkConfig => {
    if (typeof net === 'string') {
      const config = Networks[net];
      if (!config) {
        throw new Error(`Unknown network: ${net}`);
      }
      return config;
    }
    return net;
  }, []);

  const [network, setNetwork] = useState<NetworkConfig>(() => resolveNetwork(initialNetwork));
  const [client, setClient] = useState<BlueBlocksClient>(() => new BlueBlocksClient(network));
  const [keystore] = useState<Keystore>(() => getKeystore());
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize keystore
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await keystore.init();

        // Auto-connect if enabled
        if (autoConnect) {
          const lastLogin = localStorage.getItem('blueblocks:lastLogin');
          const lastPassword = sessionStorage.getItem('blueblocks:sessionKey');

          if (lastLogin && lastPassword) {
            try {
              const w = await keystore.unlockWallet(lastLogin, lastPassword);
              if (mounted) setWallet(w);
            } catch {
              // Ignore auto-connect failures
            }
          }
        }

        if (mounted) setIsLoading(false);
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [keystore, autoConnect]);

  // Connect wallet
  const connect = useCallback(async (login: string, password: string) => {
    setError(null);
    try {
      const w = await keystore.unlockWallet(login, password);
      setWallet(w);

      // Remember for auto-connect (password only in session)
      localStorage.setItem('blueblocks:lastLogin', login);
      sessionStorage.setItem('blueblocks:sessionKey', password);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [keystore]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    if (wallet) {
      // Find login for this wallet and lock it
      keystore.lockAll();
      setWallet(null);

      // Clear auto-connect data
      localStorage.removeItem('blueblocks:lastLogin');
      sessionStorage.removeItem('blueblocks:sessionKey');
    }
  }, [wallet, keystore]);

  // Create wallet
  const createWallet = useCallback(async (login: string, password: string): Promise<Wallet> => {
    setError(null);
    try {
      const w = await keystore.createWallet(login, password);
      setWallet(w);

      localStorage.setItem('blueblocks:lastLogin', login);
      sessionStorage.setItem('blueblocks:sessionKey', password);

      return w;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [keystore]);

  // Import wallet
  const importWallet = useCallback(async (
    login: string,
    password: string,
    privateKey: string
  ): Promise<Wallet> => {
    setError(null);
    try {
      const w = await keystore.importWallet(login, password, privateKey);
      setWallet(w);

      localStorage.setItem('blueblocks:lastLogin', login);
      sessionStorage.setItem('blueblocks:sessionKey', password);

      return w;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [keystore]);

  // Switch network
  const switchNetwork = useCallback((net: NetworkConfig | string) => {
    const newNetwork = resolveNetwork(net);
    setNetwork(newNetwork);
    setClient(new BlueBlocksClient(newNetwork));
  }, [resolveNetwork]);

  // Memoize context value
  const contextValue = useMemo<BlueBlocksContextValue>(() => ({
    client,
    network,
    keystore,
    wallet,
    isConnected: wallet !== null,
    isLoading,
    error,
    connect,
    disconnect,
    createWallet,
    importWallet,
    switchNetwork,
  }), [
    client,
    network,
    keystore,
    wallet,
    isLoading,
    error,
    connect,
    disconnect,
    createWallet,
    importWallet,
    switchNetwork,
  ]);

  return (
    <BlueBlocksContext.Provider value={contextValue}>
      {children}
    </BlueBlocksContext.Provider>
  );
}

/**
 * Hook to access BlueBlocks context
 */
export function useBlueBlocks(): BlueBlocksContextValue {
  const context = useContext(BlueBlocksContext);
  if (!context) {
    throw new Error('useBlueBlocks must be used within a BlueBlocksProvider');
  }
  return context;
}

/**
 * Hook to access just the client
 */
export function useClient(): BlueBlocksClient {
  const { client } = useBlueBlocks();
  return client;
}

/**
 * Hook to check connection status
 */
export function useConnection(): {
  isConnected: boolean;
  wallet: Wallet | null;
  address: string | null;
} {
  const { isConnected, wallet } = useBlueBlocks();
  return {
    isConnected,
    wallet,
    address: wallet?.address ?? null,
  };
}
