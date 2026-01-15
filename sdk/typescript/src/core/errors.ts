/**
 * BlueBlocks SDK Error Types
 */

/**
 * Base error class for all BlueBlocks SDK errors
 */
export class BlueBlocksError extends Error {
  /** Error code for programmatic handling */
  public readonly code: string;
  /** Additional error details */
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'BlueBlocksError';
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlueBlocksError);
    }
  }
}

/**
 * Network/RPC communication errors
 */
export class NetworkError extends BlueBlocksError {
  /** HTTP status code (if applicable) */
  public readonly statusCode?: number;

  constructor(message: string, statusCode?: number, details?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

/**
 * Error connecting to the node
 */
export class ConnectionError extends NetworkError {
  constructor(url: string, cause?: Error) {
    super(`Failed to connect to ${url}`, undefined, { url, cause: cause?.message });
    this.name = 'ConnectionError';
  }
}

/**
 * Request timeout error
 */
export class TimeoutError extends NetworkError {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`, undefined, { timeout });
    this.name = 'TimeoutError';
  }
}

/**
 * Contract execution errors
 */
export class ContractError extends BlueBlocksError {
  /** Contract address */
  public readonly contractAddress?: string;
  /** Function that was called */
  public readonly function?: string;

  constructor(
    message: string,
    code: string,
    contractAddress?: string,
    fn?: string,
    details?: Record<string, unknown>
  ) {
    super(message, code, { ...details, contractAddress, function: fn });
    this.name = 'ContractError';
    this.contractAddress = contractAddress;
    this.function = fn;
  }
}

/**
 * Contract not found at address
 */
export class ContractNotFoundError extends ContractError {
  constructor(address: string) {
    super(`Contract not found at address ${address}`, 'CONTRACT_NOT_FOUND', address);
    this.name = 'ContractNotFoundError';
  }
}

/**
 * Function not found in contract
 */
export class FunctionNotFoundError extends ContractError {
  constructor(address: string, fn: string) {
    super(
      `Function '${fn}' not found in contract ${address}`,
      'FUNCTION_NOT_FOUND',
      address,
      fn
    );
    this.name = 'FunctionNotFoundError';
  }
}

/**
 * Contract execution reverted
 */
export class ExecutionRevertedError extends ContractError {
  /** Revert reason */
  public readonly reason: string;

  constructor(address: string, fn: string, reason: string) {
    super(`Contract execution reverted: ${reason}`, 'EXECUTION_REVERTED', address, fn);
    this.name = 'ExecutionRevertedError';
    this.reason = reason;
  }
}

/**
 * Out of gas error
 */
export class OutOfGasError extends ContractError {
  /** Gas limit that was set */
  public readonly gasLimit: number;
  /** Gas used before running out */
  public readonly gasUsed: number;

  constructor(address: string, fn: string, gasLimit: number, gasUsed: number) {
    super(
      `Out of gas: used ${gasUsed} of ${gasLimit}`,
      'OUT_OF_GAS',
      address,
      fn,
      { gasLimit, gasUsed }
    );
    this.name = 'OutOfGasError';
    this.gasLimit = gasLimit;
    this.gasUsed = gasUsed;
  }
}

/**
 * Transaction errors
 */
export class TransactionError extends BlueBlocksError {
  /** Transaction ID (if available) */
  public readonly txId?: string;

  constructor(message: string, code: string, txId?: string, details?: Record<string, unknown>) {
    super(message, code, { ...details, txId });
    this.name = 'TransactionError';
    this.txId = txId;
  }
}

/**
 * Insufficient balance for transaction
 */
export class InsufficientBalanceError extends TransactionError {
  /** Required balance */
  public readonly required: bigint;
  /** Available balance */
  public readonly available: bigint;

  constructor(required: bigint, available: bigint) {
    super(
      `Insufficient balance: need ${required}, have ${available}`,
      'INSUFFICIENT_BALANCE',
      undefined,
      { required: required.toString(), available: available.toString() }
    );
    this.name = 'InsufficientBalanceError';
    this.required = required;
    this.available = available;
  }
}

/**
 * Invalid nonce error
 */
export class InvalidNonceError extends TransactionError {
  /** Expected nonce */
  public readonly expected: number;
  /** Provided nonce */
  public readonly provided: number;

  constructor(expected: number, provided: number) {
    super(
      `Invalid nonce: expected ${expected}, got ${provided}`,
      'INVALID_NONCE',
      undefined,
      { expected, provided }
    );
    this.name = 'InvalidNonceError';
    this.expected = expected;
    this.provided = provided;
  }
}

/**
 * Transaction not found
 */
export class TransactionNotFoundError extends TransactionError {
  constructor(txId: string) {
    super(`Transaction not found: ${txId}`, 'TX_NOT_FOUND', txId);
    this.name = 'TransactionNotFoundError';
  }
}

/**
 * Wallet/signing errors
 */
export class WalletError extends BlueBlocksError {
  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'WalletError';
  }
}

/**
 * Invalid private key
 */
export class InvalidPrivateKeyError extends WalletError {
  constructor() {
    super('Invalid private key format', 'INVALID_PRIVATE_KEY');
    this.name = 'InvalidPrivateKeyError';
  }
}

/**
 * Invalid signature
 */
export class InvalidSignatureError extends WalletError {
  constructor() {
    super('Invalid signature', 'INVALID_SIGNATURE');
    this.name = 'InvalidSignatureError';
  }
}

/**
 * Wallet locked (password required)
 */
export class WalletLockedError extends WalletError {
  constructor() {
    super('Wallet is locked. Please unlock with password.', 'WALLET_LOCKED');
    this.name = 'WalletLockedError';
  }
}

/**
 * Invalid password
 */
export class InvalidPasswordError extends WalletError {
  constructor() {
    super('Invalid password', 'INVALID_PASSWORD');
    this.name = 'InvalidPasswordError';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends BlueBlocksError {
  /** Field that failed validation */
  public readonly field?: string;

  constructor(message: string, field?: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', { ...details, field });
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Invalid address format
 */
export class InvalidAddressError extends ValidationError {
  constructor(address: string) {
    super(`Invalid address format: ${address}`, 'address', { address });
    this.name = 'InvalidAddressError';
  }
}

/**
 * Invalid contract code
 */
export class InvalidCodeError extends ValidationError {
  constructor(reason: string) {
    super(`Invalid contract code: ${reason}`, 'code', { reason });
    this.name = 'InvalidCodeError';
  }
}

/**
 * Parse API error response into appropriate error type
 */
export function parseAPIError(response: {
  status: number;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
}): BlueBlocksError {
  const { status, error, code, details } = response;

  // Map common error codes to specific error types
  switch (code) {
    case 'CONTRACT_NOT_FOUND':
      return new ContractNotFoundError(details?.address as string || 'unknown');
    case 'FUNCTION_NOT_FOUND':
      return new FunctionNotFoundError(
        details?.address as string || 'unknown',
        details?.function as string || 'unknown'
      );
    case 'INSUFFICIENT_BALANCE':
      return new InsufficientBalanceError(
        BigInt(details?.required as string || '0'),
        BigInt(details?.available as string || '0')
      );
    case 'INVALID_NONCE':
      return new InvalidNonceError(
        details?.expected as number || 0,
        details?.provided as number || 0
      );
    case 'OUT_OF_GAS':
      return new OutOfGasError(
        details?.address as string || 'unknown',
        details?.function as string || 'unknown',
        details?.gasLimit as number || 0,
        details?.gasUsed as number || 0
      );
    default:
      // Fall back to generic errors based on status code
      if (status >= 500) {
        return new NetworkError(error || 'Server error', status, details);
      }
      if (status === 404) {
        return new BlueBlocksError(error || 'Not found', 'NOT_FOUND', details);
      }
      if (status === 400) {
        return new ValidationError(error || 'Bad request', undefined, details);
      }
      return new BlueBlocksError(
        error || 'Unknown error',
        code || 'UNKNOWN_ERROR',
        details
      );
  }
}
