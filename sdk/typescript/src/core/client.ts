/**
 * BlueBlocks HTTP Client
 * Handles communication with BlueBlocks nodes
 */

import {
  NetworkError,
  ConnectionError,
  TimeoutError,
  parseAPIError,
} from './errors';
import type {
  NetworkConfig,
  DeployRequest,
  DeployResponse,
  CallRequest,
  CallResponse,
  Account,
  Block,
  Transaction,
  Contract,
  GenesisMetadata,
  GasEstimate,
  PaginationParams,
  PaginatedResponse,
} from './types';
import { Networks } from './types';

/**
 * Client configuration options
 */
export interface ClientOptions {
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Custom headers to include in requests */
  headers?: Record<string, string>;
  /** Retry failed requests (default: 3) */
  retries?: number;
  /** Retry delay in milliseconds (default: 1000) */
  retryDelay?: number;
}

const DEFAULT_OPTIONS: Required<ClientOptions> = {
  timeout: 30000,
  headers: {},
  retries: 3,
  retryDelay: 1000,
};

/**
 * BlueBlocks HTTP Client
 *
 * @example
 * ```typescript
 * import { BlueBlocksClient, Networks } from '@blueblocks/sdk';
 *
 * const client = new BlueBlocksClient(Networks.testnet);
 *
 * // Deploy a contract
 * const { contract_address } = await client.deployContract({
 *   sender: 'alice',
 *   code: 'def hello(): return "Hello, World!"',
 *   gas_limit: 500000,
 *   init_args: [],
 * });
 *
 * // Call the contract
 * const result = await client.callContract({
 *   contract_address,
 *   function: 'hello',
 *   args: [],
 *   sender: 'alice',
 *   gas_limit: 100000,
 *   value: 0n,
 * });
 * ```
 */
export class BlueBlocksClient {
  private readonly baseUrl: string;
  private readonly options: Required<ClientOptions>;
  private readonly network: NetworkConfig;

  constructor(network: NetworkConfig | string, options: ClientOptions = {}) {
    // Accept either a NetworkConfig object or a network name string
    if (typeof network === 'string') {
      const config = Networks[network];
      if (!config) {
        throw new Error(`Unknown network: ${network}. Use 'mainnet', 'testnet', or 'local'.`);
      }
      this.network = config;
    } else {
      this.network = network;
    }

    this.baseUrl = this.network.rpc_url.replace(/\/$/, ''); // Remove trailing slash
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  // ===========================================================================
  // Core HTTP Methods
  // ===========================================================================

  /**
   * Make an HTTP request to the node
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.options.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...this.options.headers,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Parse response
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw parseAPIError({
            status: response.status,
            error: data.error || data.message || response.statusText,
            code: data.code,
            details: data.details,
          });
        }

        return data as T;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) or abort
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new TimeoutError(this.options.timeout);
          }
          if (error instanceof NetworkError && error.statusCode && error.statusCode < 500) {
            throw error;
          }
        }

        // Retry on network errors
        if (attempt < this.options.retries) {
          await this.delay(this.options.retryDelay * (attempt + 1));
          continue;
        }

        // Check if it's a connection error
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new ConnectionError(url, error);
        }

        throw error;
      }
    }

    throw lastError || new Error('Request failed');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ===========================================================================
  // Health & Genesis
  // ===========================================================================

  /**
   * Check if the node is healthy
   */
  async health(): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>('GET', '/health');
  }

  /**
   * Get genesis block metadata
   */
  async getGenesisMetadata(): Promise<GenesisMetadata> {
    return this.request<GenesisMetadata>('GET', '/genesis/metadata');
  }

  // ===========================================================================
  // Contracts
  // ===========================================================================

  /**
   * Deploy a smart contract
   */
  async deployContract(request: DeployRequest): Promise<DeployResponse> {
    return this.request<DeployResponse>('POST', '/contracts/deploy', request);
  }

  /**
   * Call a smart contract function
   */
  async callContract(request: CallRequest): Promise<CallResponse> {
    // Convert bigint to string for JSON serialization
    const payload = {
      ...request,
      value: Number(request.value),
    };
    return this.request<CallResponse>('POST', '/contracts/call', payload);
  }

  /**
   * Simulate a contract call without committing state changes
   * Useful for gas estimation and read-only queries
   */
  async simulateCall(request: CallRequest): Promise<CallResponse> {
    const payload = {
      ...request,
      value: Number(request.value),
      simulate: true,
    };
    return this.request<CallResponse>('POST', '/contracts/simulate', payload);
  }

  /**
   * Get contract information
   */
  async getContract(address: string): Promise<Contract> {
    return this.request<Contract>('GET', `/contracts/${address}`);
  }

  /**
   * Get contract state
   */
  async getContractState(address: string): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('GET', `/contracts/${address}/state`);
  }

  /**
   * Estimate gas for a contract call
   */
  async estimateGas(request: Omit<CallRequest, 'gas_limit'>): Promise<GasEstimate> {
    const payload = {
      ...request,
      value: Number(request.value),
    };
    return this.request<GasEstimate>('POST', '/contracts/estimate-gas', payload);
  }

  // ===========================================================================
  // Accounts
  // ===========================================================================

  /**
   * Get account information
   */
  async getAccount(address: string): Promise<Account> {
    const data = await this.request<{
      address: string;
      balance: string | number;
      nonce: number;
      created: number;
      last_updated: number;
    }>('GET', `/accounts/${address}`);

    return {
      ...data,
      balance: BigInt(data.balance),
    };
  }

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<bigint> {
    const account = await this.getAccount(address);
    return account.balance;
  }

  /**
   * Get account nonce
   */
  async getNonce(address: string): Promise<number> {
    const account = await this.getAccount(address);
    return account.nonce;
  }

  // ===========================================================================
  // Blocks
  // ===========================================================================

  /**
   * Get block by height or hash
   */
  async getBlock(heightOrHash: number | string): Promise<Block> {
    const data = await this.request<{
      height: number;
      hash: string;
      previous_hash: string;
      merkle_root?: string;
      timestamp: number;
      difficulty: number;
      nonce: string;
      miner: string;
      reward: string | number;
      gas_used: number;
      transaction_count: number;
    }>('GET', `/blocks/${heightOrHash}`);

    return {
      ...data,
      reward: BigInt(data.reward),
    };
  }

  /**
   * Get the latest block
   */
  async getLatestBlock(): Promise<Block> {
    return this.getBlock('latest');
  }

  /**
   * Get current block height
   */
  async getBlockHeight(): Promise<number> {
    const block = await this.getLatestBlock();
    return block.height;
  }

  /**
   * List blocks with pagination
   */
  async listBlocks(params?: PaginationParams): Promise<PaginatedResponse<Block>> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    const response = await this.request<{
      items: Array<{
        height: number;
        hash: string;
        previous_hash: string;
        merkle_root?: string;
        timestamp: number;
        difficulty: number;
        nonce: string;
        miner: string;
        reward: string | number;
        gas_used: number;
        transaction_count: number;
      }>;
      total?: number;
      has_more: boolean;
      next_cursor?: string;
    }>('GET', `/blocks?${query}`);

    return {
      items: response.items.map((b) => ({
        ...b,
        reward: BigInt(b.reward),
      })),
      total: response.total,
      has_more: response.has_more,
      next_cursor: response.next_cursor,
    };
  }

  // ===========================================================================
  // Transactions
  // ===========================================================================

  /**
   * Get transaction by ID
   */
  async getTransaction(txId: string): Promise<Transaction> {
    const data = await this.request<{
      id: string;
      type: 'deploy' | 'call' | 'transfer' | 'reward';
      from: string;
      to?: string;
      contract_address?: string;
      function?: string;
      args?: unknown[];
      value: string | number;
      gas_limit: number;
      gas_used: number;
      status: 'pending' | 'success' | 'failed';
      error?: string;
      block_height: number;
      timestamp: number;
      events?: Array<{ name: string; fields: Record<string, unknown> }>;
    }>('GET', `/transactions/${txId}`);

    return {
      ...data,
      value: BigInt(data.value),
    };
  }

  /**
   * List transactions with filtering
   */
  async listTransactions(
    filter?: {
      address?: string;
      contract_address?: string;
      type?: 'deploy' | 'call' | 'transfer' | 'reward';
    } & PaginationParams
  ): Promise<PaginatedResponse<Transaction>> {
    const query = new URLSearchParams();
    if (filter?.address) query.set('address', filter.address);
    if (filter?.contract_address) query.set('contract_address', filter.contract_address);
    if (filter?.type) query.set('type', filter.type);
    if (filter?.limit) query.set('limit', filter.limit.toString());
    if (filter?.offset) query.set('offset', filter.offset.toString());

    const response = await this.request<{
      items: Array<{
        id: string;
        type: 'deploy' | 'call' | 'transfer' | 'reward';
        from: string;
        to?: string;
        contract_address?: string;
        function?: string;
        args?: unknown[];
        value: string | number;
        gas_limit: number;
        gas_used: number;
        status: 'pending' | 'success' | 'failed';
        error?: string;
        block_height: number;
        timestamp: number;
        events?: Array<{ name: string; fields: Record<string, unknown> }>;
      }>;
      total?: number;
      has_more: boolean;
      next_cursor?: string;
    }>('GET', `/transactions?${query}`);

    return {
      items: response.items.map((tx) => ({
        ...tx,
        value: BigInt(tx.value),
      })),
      total: response.total,
      has_more: response.has_more,
      next_cursor: response.next_cursor,
    };
  }

  // ===========================================================================
  // Network Info
  // ===========================================================================

  /**
   * Get network configuration
   */
  getNetwork(): NetworkConfig {
    return this.network;
  }

  /**
   * Get chain ID
   */
  getChainId(): string {
    return this.network.chain_id;
  }

  /**
   * Get RPC URL
   */
  getRpcUrl(): string {
    return this.baseUrl;
  }
}

/**
 * Create a client for a specific network
 */
export function createClient(
  network: NetworkConfig | string,
  options?: ClientOptions
): BlueBlocksClient {
  return new BlueBlocksClient(network, options);
}
