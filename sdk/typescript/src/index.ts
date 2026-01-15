/**
 * BlueBlocks SDK
 *
 * Official TypeScript/JavaScript SDK for the BlueBlocks Global Health Network.
 *
 * @packageDocumentation
 */

// Core exports
export * from './core';

// Wallet exports
export * from './wallet';

// Re-export commonly used types at the top level for convenience
export type {
  // Core types
  Context,
  Event,
  CallResult,
  DeployRequest,
  DeployResponse,
  CallRequest,
  CallResponse,
  Account,
  Block,
  Transaction,
  Contract,
  ContractABI,
  NetworkConfig,
  GasEstimate,
  // Wallet types
  Keypair,
  StoredKey,
  SignedTransaction,
} from './core';
