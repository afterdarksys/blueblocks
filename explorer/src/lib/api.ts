// BlueBlocks Explorer API Client

import type {
  Block,
  Transaction,
  Account,
  Contract,
  Validator,
  NetworkStats,
  PaginatedResponse,
  SearchResult,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class APIError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(
      error.message || 'API request failed',
      error.code || 'UNKNOWN_ERROR',
      response.status
    );
  }

  return response.json();
}

// Network Stats
export async function getNetworkStats(): Promise<NetworkStats> {
  return fetchAPI<NetworkStats>('/stats');
}

export async function getHealth(): Promise<{ status: string; version: string }> {
  return fetchAPI('/health');
}

// Blocks
export async function getLatestBlocks(limit = 10): Promise<Block[]> {
  return fetchAPI<Block[]>(`/blocks?limit=${limit}`);
}

export async function getBlock(heightOrHash: string | number): Promise<Block> {
  return fetchAPI<Block>(`/blocks/${heightOrHash}`);
}

export async function getBlocks(
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Block>> {
  const offset = (page - 1) * pageSize;
  return fetchAPI<PaginatedResponse<Block>>(
    `/blocks?offset=${offset}&limit=${pageSize}`
  );
}

// Transactions
export async function getLatestTransactions(limit = 10): Promise<Transaction[]> {
  return fetchAPI<Transaction[]>(`/transactions?limit=${limit}`);
}

export async function getTransaction(hash: string): Promise<Transaction> {
  return fetchAPI<Transaction>(`/transactions/${hash}`);
}

export async function getTransactions(
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Transaction>> {
  const offset = (page - 1) * pageSize;
  return fetchAPI<PaginatedResponse<Transaction>>(
    `/transactions?offset=${offset}&limit=${pageSize}`
  );
}

export async function getBlockTransactions(
  blockHeight: number
): Promise<Transaction[]> {
  return fetchAPI<Transaction[]>(`/blocks/${blockHeight}/transactions`);
}

export async function getAccountTransactions(
  address: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Transaction>> {
  const offset = (page - 1) * pageSize;
  return fetchAPI<PaginatedResponse<Transaction>>(
    `/accounts/${address}/transactions?offset=${offset}&limit=${pageSize}`
  );
}

// Accounts
export async function getAccount(address: string): Promise<Account> {
  return fetchAPI<Account>(`/accounts/${address}`);
}

export async function getTopAccounts(limit = 100): Promise<Account[]> {
  return fetchAPI<Account[]>(`/accounts?sort=balance&order=desc&limit=${limit}`);
}

// Contracts
export async function getContract(address: string): Promise<Contract> {
  return fetchAPI<Contract>(`/contracts/${address}`);
}

export async function getContractCode(address: string): Promise<string> {
  const response = await fetchAPI<{ code: string }>(`/contracts/${address}/code`);
  return response.code;
}

export async function getContractState(
  address: string
): Promise<Record<string, unknown>> {
  return fetchAPI<Record<string, unknown>>(`/contracts/${address}/state`);
}

export async function getContracts(
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Contract>> {
  const offset = (page - 1) * pageSize;
  return fetchAPI<PaginatedResponse<Contract>>(
    `/contracts?offset=${offset}&limit=${pageSize}`
  );
}

// Validators
export async function getValidators(): Promise<Validator[]> {
  return fetchAPI<Validator[]>('/validators');
}

export async function getValidator(address: string): Promise<Validator> {
  return fetchAPI<Validator>(`/validators/${address}`);
}

export async function getValidatorLeaderboard(): Promise<Validator[]> {
  return fetchAPI<Validator[]>('/validators/leaderboard');
}

// Supply
export async function getSupply(): Promise<{
  total: string;
  circulating: string;
  staked: string;
  burned: string;
}> {
  return fetchAPI('/supply');
}

// Search
export async function search(query: string): Promise<SearchResult[]> {
  return fetchAPI<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`);
}

// Faucet (DevNet/TestNet only)
export async function requestFaucet(address: string): Promise<{ txHash: string }> {
  return fetchAPI<{ txHash: string }>('/faucet', {
    method: 'POST',
    body: JSON.stringify({ address }),
  });
}

// WebSocket connection for real-time updates
export function createBlockStream(
  onBlock: (block: Block) => void,
  onError?: (error: Error) => void
): () => void {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'block') {
        onBlock(data.block);
      }
    } catch (err) {
      onError?.(err as Error);
    }
  };

  ws.onerror = (event) => {
    onError?.(new Error('WebSocket error'));
  };

  return () => {
    ws.close();
  };
}

// SSE connection for sync stream
export function createSyncStream(
  onBlock: (block: Block) => void,
  fromHeight = 0
): () => void {
  const eventSource = new EventSource(
    `${API_URL}/sync/stream?from=${fromHeight}`
  );

  eventSource.onmessage = (event) => {
    try {
      const block = JSON.parse(event.data);
      onBlock(block);
    } catch (err) {
      console.error('Failed to parse SSE message:', err);
    }
  };

  eventSource.onerror = () => {
    console.error('SSE connection error');
  };

  return () => {
    eventSource.close();
  };
}
