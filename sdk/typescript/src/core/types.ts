/**
 * BlueBlocks SDK Core Types
 * These mirror the Go types from lib/vm/vm.go and lib/chain/chain.go
 */

// ============================================================================
// VM Types (from lib/vm/vm.go)
// ============================================================================

/**
 * Execution context provided to smart contracts
 */
export interface Context {
  /** Address of the transaction sender */
  sender: string;
  /** Address of the contract being called */
  contract: string;
  /** Value (in BBT smallest unit) transferred with the call */
  value: bigint;
  /** Current block height */
  block_height: number;
  /** Current block timestamp (Unix seconds) */
  block_time: number;
}

/**
 * Event emitted by a smart contract
 */
export interface Event {
  /** Event name */
  name: string;
  /** Event fields/data */
  fields: Record<string, unknown>;
}

/**
 * Result of a smart contract call
 */
export interface CallResult {
  /** Return value from the contract function */
  return_value: unknown;
  /** Events emitted during execution */
  events: Event[];
  /** Gas consumed by the execution */
  gas_used: number;
}

// ============================================================================
// Chain Types (from lib/chain/chain.go)
// ============================================================================

/**
 * Request to deploy a smart contract
 */
export interface DeployRequest {
  /** Address of the deployer */
  sender: string;
  /** Contract source code (Starlark) */
  code: string;
  /** Maximum gas to use for deployment */
  gas_limit: number;
  /** Arguments to pass to the init() function */
  init_args: unknown[];
}

/**
 * Response from contract deployment
 */
export interface DeployResponse {
  /** Address of the deployed contract */
  contract_address: string;
}

/**
 * Request to call a smart contract function
 */
export interface CallRequest {
  /** Address of the contract to call */
  contract_address: string;
  /** Name of the function to call */
  function: string;
  /** Arguments to pass to the function */
  args: unknown[];
  /** Address of the caller */
  sender: string;
  /** Maximum gas to use */
  gas_limit: number;
  /** Value (in BBT smallest unit) to transfer */
  value: bigint;
}

/**
 * Response from a contract call
 */
export interface CallResponse {
  /** Result of the contract execution */
  result: CallResult;
}

// ============================================================================
// Account Types (from lib/accounts/accounts.go)
// ============================================================================

/**
 * Blockchain account
 */
export interface Account {
  /** Account address */
  address: string;
  /** Account balance in BBT smallest unit */
  balance: bigint;
  /** Transaction nonce (for replay protection) */
  nonce: number;
  /** Unix timestamp of account creation */
  created: number;
  /** Unix timestamp of last update */
  last_updated: number;
}

// ============================================================================
// Genesis Types (from lib/genesis/genesis.go)
// ============================================================================

/**
 * Genesis block metadata
 */
export interface GenesisMetadata {
  /** Chain identifier */
  chain_id: string;
  /** Genesis block hash */
  genesis_hash: string;
  /** Genesis block height (always 0) */
  height: number;
  /** Genesis creation timestamp */
  created_at: number;
  /** Node public key */
  node_pubkey: string;
  /** Signature of the genesis block */
  signature: string;
}

// ============================================================================
// Transaction Types
// ============================================================================

export type TransactionType = 'deploy' | 'call' | 'transfer' | 'reward';
export type TransactionStatus = 'pending' | 'success' | 'failed';

/**
 * Blockchain transaction
 */
export interface Transaction {
  /** Transaction hash/ID */
  id: string;
  /** Transaction type */
  type: TransactionType;
  /** Sender address */
  from: string;
  /** Recipient address (for transfers) */
  to?: string;
  /** Contract address (for deploy/call) */
  contract_address?: string;
  /** Function name (for calls) */
  function?: string;
  /** Function arguments */
  args?: unknown[];
  /** Value transferred */
  value: bigint;
  /** Gas limit */
  gas_limit: number;
  /** Gas used */
  gas_used: number;
  /** Transaction status */
  status: TransactionStatus;
  /** Error message (if failed) */
  error?: string;
  /** Block height */
  block_height: number;
  /** Block timestamp */
  timestamp: number;
  /** Events emitted */
  events?: Event[];
}

// ============================================================================
// Block Types
// ============================================================================

/**
 * Blockchain block
 */
export interface Block {
  /** Block height */
  height: number;
  /** Block hash */
  hash: string;
  /** Previous block hash */
  previous_hash: string;
  /** Merkle root of transactions */
  merkle_root?: string;
  /** Block timestamp (Unix seconds) */
  timestamp: number;
  /** Mining difficulty */
  difficulty: number;
  /** Mining nonce */
  nonce: string;
  /** Miner address */
  miner: string;
  /** Block reward in BBT smallest unit */
  reward: bigint;
  /** Total gas used in block */
  gas_used: number;
  /** Number of transactions */
  transaction_count: number;
}

// ============================================================================
// Contract Types
// ============================================================================

/**
 * Contract ABI function definition
 */
export interface ABIFunction {
  /** Function name */
  name: string;
  /** Function type: 'function', 'constructor', or 'view' */
  type: 'function' | 'constructor' | 'view';
  /** Input parameters */
  inputs: ABIParameter[];
  /** Output parameters */
  outputs: ABIParameter[];
  /** Whether function mutates state */
  mutates: boolean;
  /** Estimated gas (optional hint) */
  gas_hint?: number;
}

/**
 * Contract ABI event definition
 */
export interface ABIEvent {
  /** Event name */
  name: string;
  /** Event fields */
  fields: ABIParameter[];
}

/**
 * ABI parameter definition
 */
export interface ABIParameter {
  /** Parameter name */
  name: string;
  /** Parameter type: 'string', 'int', 'bool', 'list', 'dict' */
  type: 'string' | 'int' | 'bool' | 'list' | 'dict' | 'bytes' | 'address';
}

/**
 * Contract ABI (Application Binary Interface)
 */
export interface ContractABI {
  /** Contract name */
  name: string;
  /** ABI version */
  version: string;
  /** Contract functions */
  functions: ABIFunction[];
  /** Contract events */
  events: ABIEvent[];
  /** State variables (optional) */
  state?: ABIParameter[];
}

/**
 * Deployed contract information
 */
export interface Contract {
  /** Contract address */
  address: string;
  /** Creator address */
  creator: string;
  /** Creation transaction ID */
  creation_tx: string;
  /** Creation block height */
  creation_block: number;
  /** Contract source code */
  code: string;
  /** Code hash */
  code_hash: string;
  /** Contract ABI (if available) */
  abi?: ContractABI;
  /** Contract name (if available) */
  name?: string;
  /** Whether source is verified */
  is_verified: boolean;
}

// ============================================================================
// Network Types
// ============================================================================

/**
 * Network configuration
 */
export interface NetworkConfig {
  /** Network name */
  name: string;
  /** Chain ID */
  chain_id: string;
  /** RPC endpoint URL */
  rpc_url: string;
  /** WebSocket endpoint URL (optional) */
  ws_url?: string;
  /** Block explorer URL (optional) */
  explorer_url?: string;
}

/**
 * Predefined networks
 */
export const Networks: Record<string, NetworkConfig> = {
  mainnet: {
    name: 'BlueBlocks Mainnet',
    chain_id: 'blueblocks-mainnet',
    rpc_url: 'https://rpc.blueblocks.health',
    ws_url: 'wss://ws.blueblocks.health',
    explorer_url: 'https://explorer.blueblocks.health',
  },
  testnet: {
    name: 'BlueBlocks Testnet',
    chain_id: 'blueblocks-testnet',
    rpc_url: 'https://testnet-rpc.blueblocks.health',
    ws_url: 'wss://testnet-ws.blueblocks.health',
    explorer_url: 'https://testnet.blueblocks.health',
  },
  local: {
    name: 'Local Development',
    chain_id: 'blueblocks-local',
    rpc_url: 'http://localhost:8080',
    ws_url: 'ws://localhost:8080/ws',
  },
};

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Number of items to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Cursor for cursor-based pagination */
  cursor?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  /** Items in this page */
  items: T[];
  /** Total count (if available) */
  total?: number;
  /** Whether more items exist */
  has_more: boolean;
  /** Cursor for next page */
  next_cursor?: string;
}

/**
 * Gas estimation result
 */
export interface GasEstimate {
  /** Estimated gas usage */
  gas_estimate: number;
  /** Recommended gas limit (with safety margin) */
  gas_limit: number;
  /** Estimated cost in BBT */
  cost_estimate: bigint;
}
