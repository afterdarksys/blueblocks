// BlueBlocks Explorer Types

export interface Block {
  height: number;
  hash: string;
  prevHash: string;
  timestamp: string;
  proposer: string;
  numTxs: number;
  totalGas: number;
  blockReward: number;
  sizeBytes: number;
}

export interface Transaction {
  hash: string;
  blockHeight: number;
  blockHash: string;
  txIndex: number;
  timestamp: string;
  from: string;
  to: string | null;
  value: string;
  gasLimit: number;
  gasUsed: number;
  gasPrice: number;
  nonce: number;
  type: TransactionType;
  status: TransactionStatus;
  data?: Record<string, unknown>;
}

export type TransactionType =
  | 'transfer'
  | 'contract_deploy'
  | 'contract_call'
  | 'validator_register'
  | 'validator_stake'
  | 'validator_unstake'
  | 'health_record_create'
  | 'health_record_update'
  | 'health_record_share';

export type TransactionStatus = 'success' | 'failed' | 'pending';

export interface Account {
  address: string;
  balance: string;
  nonce: number;
  accountType: AccountType;
  label?: string;
  isContract: boolean;
  contractCodeHash?: string;
  txCount: number;
  firstSeenBlock?: number;
  lastActiveBlock?: number;
}

export type AccountType =
  | 'standard'
  | 'treasury'
  | 'faucet'
  | 'reserve'
  | 'developer'
  | 'validator'
  | 'healthcare';

export interface Contract {
  address: string;
  creator: string;
  creationTx: string;
  creationBlock: number;
  codeHash: string;
  code?: string;
  abi?: ContractABI;
  name?: string;
  contractType?: string;
  verified: boolean;
}

export interface ContractABI {
  functions: ContractFunction[];
  events: ContractEvent[];
}

export interface ContractFunction {
  name: string;
  inputs: ContractParam[];
  outputs: ContractParam[];
  stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
}

export interface ContractEvent {
  name: string;
  inputs: ContractParam[];
}

export interface ContractParam {
  name: string;
  type: string;
}

export interface Validator {
  address: string;
  pubKey: string;
  moniker: string;
  validatorType: ValidatorType;
  stake: string;
  commissionRate: number;
  status: ValidatorStatus;
  jailed: boolean;
  jailUntil?: string;
  blocksProposed: number;
  blocksSigned: number;
  uptimePercentage: number;
  npiNumber?: string;
  registeredAt: string;
}

export type ValidatorType = 'standard' | 'healthcare' | 'treasury';
export type ValidatorStatus = 'active' | 'inactive' | 'jailed' | 'unbonding';

export interface NetworkStats {
  chainId: string;
  latestBlockHeight: number;
  latestBlockTime: string;
  totalBlocks: number;
  totalTxs: number;
  totalAccounts: number;
  totalContracts: number;
  totalValidators: number;
  activeValidators: number;
  totalStake: string;
  circulatingSupply: string;
  avgBlockTimeMs: number;
  avgGasPrice: number;
  tps1h: number;
}

export interface HealthRecord {
  recordId: string;
  patientAddress: string;
  providerAddress?: string;
  recordType: string;
  ipfsHash?: string;
  encrypted: boolean;
  createdBlock: number;
  createdAt: string;
  expiresAt?: string;
  revoked: boolean;
}

export interface TreasuryTransaction {
  id: number;
  ethTxHash: string;
  bbTxHash?: string;
  fromEthAddress: string;
  toBbAddress: string;
  usdcAmount: string;
  bbtAmount: string;
  exchangeRate: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  ethBlock: number;
  bbBlock?: number;
  processedAt?: string;
}

export interface SearchResult {
  type: 'block' | 'transaction' | 'account' | 'contract' | 'validator';
  value: string;
  label: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
