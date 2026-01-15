/**
 * useContract Hook
 * Smart contract interaction
 */

import { useState, useCallback, useMemo } from 'react';
import { useBlueBlocks } from '../context/BlueBlocksProvider';
import type {
  CallRequest,
  CallResponse,
  DeployRequest,
  DeployResponse,
  Contract,
  ContractABI,
  Event,
  GasEstimate,
} from '../../core/types';
import { Gas } from '../../core/constants';

/**
 * Contract interaction options
 */
export interface ContractOptions {
  /** Contract address (required for calls) */
  address?: string;
  /** Contract ABI for type checking */
  abi?: ContractABI;
  /** Default gas limit */
  gasLimit?: number;
}

/**
 * Contract call options
 */
export interface CallOptions {
  /** Gas limit for this call */
  gasLimit?: number;
  /** Value to send with the call */
  value?: bigint;
  /** Simulate only (don't commit state changes) */
  simulate?: boolean;
}

/**
 * Contract hook result
 */
export interface UseContractResult {
  /** Contract address */
  address: string | null;
  /** Contract information (if fetched) */
  contract: Contract | null;
  /** Whether an operation is in progress */
  isLoading: boolean;
  /** Last error */
  error: Error | null;
  /** Last call result */
  result: CallResponse | null;
  /** Last emitted events */
  events: Event[];
  /** Call a contract function */
  call: (fn: string, args?: unknown[], options?: CallOptions) => Promise<CallResponse>;
  /** Estimate gas for a call */
  estimateGas: (fn: string, args?: unknown[]) => Promise<GasEstimate>;
  /** Deploy a new contract */
  deploy: (code: string, initArgs?: unknown[], gasLimit?: number) => Promise<DeployResponse>;
  /** Fetch contract info */
  fetchContract: () => Promise<Contract>;
  /** Get contract state */
  getState: () => Promise<Record<string, unknown>>;
  /** Reset error state */
  resetError: () => void;
}

/**
 * Hook for smart contract interaction
 *
 * @example
 * ```tsx
 * function ContractUI() {
 *   const { call, result, isLoading, error } = useContract({
 *     address: '0x1234...',
 *   });
 *
 *   const handleClick = async () => {
 *     try {
 *       await call('increment', []);
 *       console.log('Success!');
 *     } catch (err) {
 *       console.error('Failed:', err);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleClick} disabled={isLoading}>
 *         Increment
 *       </button>
 *       {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
 *       {error && <div className="error">{error.message}</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useContract(options: ContractOptions = {}): UseContractResult {
  const { client, wallet } = useBlueBlocks();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<CallResponse | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  const address = options.address ?? null;
  const defaultGasLimit = options.gasLimit ?? Gas.DEFAULT_CALL_LIMIT;

  // Extract events from last result
  const events = useMemo(() => {
    return result?.result.events ?? [];
  }, [result]);

  // Call contract function
  const call = useCallback(async (
    fn: string,
    args: unknown[] = [],
    callOptions: CallOptions = {}
  ): Promise<CallResponse> => {
    if (!address) {
      throw new Error('Contract address not set');
    }
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: CallRequest = {
        contract_address: address,
        function: fn,
        args,
        sender: wallet.address,
        gas_limit: callOptions.gasLimit ?? defaultGasLimit,
        value: callOptions.value ?? 0n,
      };

      const response = callOptions.simulate
        ? await client.simulateCall(request)
        : await client.callContract(request);

      setResult(response);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, wallet, client, defaultGasLimit]);

  // Estimate gas
  const estimateGas = useCallback(async (
    fn: string,
    args: unknown[] = []
  ): Promise<GasEstimate> => {
    if (!address) {
      throw new Error('Contract address not set');
    }
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      return await client.estimateGas({
        contract_address: address,
        function: fn,
        args,
        sender: wallet.address,
        value: 0n,
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, wallet, client]);

  // Deploy contract
  const deploy = useCallback(async (
    code: string,
    initArgs: unknown[] = [],
    gasLimit: number = Gas.DEFAULT_DEPLOY_LIMIT
  ): Promise<DeployResponse> => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: DeployRequest = {
        sender: wallet.address,
        code,
        gas_limit: gasLimit,
        init_args: initArgs,
      };

      return await client.deployContract(request);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [wallet, client]);

  // Fetch contract info
  const fetchContract = useCallback(async (): Promise<Contract> => {
    if (!address) {
      throw new Error('Contract address not set');
    }

    setIsLoading(true);
    setError(null);

    try {
      const info = await client.getContract(address);
      setContract(info);
      return info;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, client]);

  // Get contract state
  const getState = useCallback(async (): Promise<Record<string, unknown>> => {
    if (!address) {
      throw new Error('Contract address not set');
    }

    setIsLoading(true);
    setError(null);

    try {
      return await client.getContractState(address);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [address, client]);

  // Reset error
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    address,
    contract,
    isLoading,
    error,
    result,
    events,
    call,
    estimateGas,
    deploy,
    fetchContract,
    getState,
    resetError,
  };
}

/**
 * Create a typed contract interface from ABI
 *
 * @example
 * ```tsx
 * const abi = {
 *   functions: [
 *     { name: 'increment', inputs: [], outputs: [{ name: '', type: 'int' }] },
 *     { name: 'get_count', inputs: [], outputs: [{ name: '', type: 'int' }] },
 *   ],
 * };
 *
 * function Counter() {
 *   const contract = useTypedContract('0x1234...', abi);
 *
 *   return (
 *     <button onClick={() => contract.call('increment')}>
 *       Increment
 *     </button>
 *   );
 * }
 * ```
 */
export function useTypedContract(address: string, abi: ContractABI): UseContractResult {
  return useContract({ address, abi });
}
