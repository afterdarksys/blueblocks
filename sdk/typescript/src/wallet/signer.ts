/**
 * Transaction Signer
 * Signs transactions for submission to the blockchain
 */

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import type { Wallet } from './wallet';
import type { CallRequest, DeployRequest } from '../core/types';

/**
 * Signed transaction ready for submission
 */
export interface SignedTransaction {
  /** Original transaction data */
  transaction: CallRequest | DeployRequest;
  /** Transaction hash */
  hash: string;
  /** Signature over the transaction hash */
  signature: string;
  /** Signer's public key */
  public_key: string;
  /** Transaction type */
  type: 'call' | 'deploy';
}

/**
 * Transaction signer that uses a wallet to sign transactions
 */
export class TransactionSigner {
  private readonly wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  /**
   * Sign a contract call transaction
   */
  async signCall(request: CallRequest): Promise<SignedTransaction> {
    // Create canonical transaction representation
    const txData = {
      type: 'call',
      contract_address: request.contract_address,
      function: request.function,
      args: request.args,
      sender: request.sender,
      gas_limit: request.gas_limit,
      value: request.value.toString(),
    };

    return this.signTransaction(txData, request, 'call');
  }

  /**
   * Sign a contract deployment transaction
   */
  async signDeploy(request: DeployRequest): Promise<SignedTransaction> {
    // Create canonical transaction representation
    const txData = {
      type: 'deploy',
      code: request.code,
      sender: request.sender,
      gas_limit: request.gas_limit,
      init_args: request.init_args,
    };

    return this.signTransaction(txData, request, 'deploy');
  }

  private async signTransaction<T extends CallRequest | DeployRequest>(
    txData: Record<string, unknown>,
    originalRequest: T,
    type: 'call' | 'deploy'
  ): Promise<SignedTransaction> {
    // Hash the transaction data
    const txJson = JSON.stringify(txData, sortKeys);
    const txBytes = new TextEncoder().encode(txJson);
    const txHash = bytesToHex(sha256(txBytes));

    // Sign the hash
    const signature = await this.wallet.sign(txBytes);

    return {
      transaction: originalRequest,
      hash: txHash,
      signature,
      public_key: this.wallet.publicKey,
      type,
    };
  }

  /**
   * Get the wallet address
   */
  get address(): string {
    return this.wallet.address;
  }

  /**
   * Get the wallet's public key
   */
  get publicKey(): string {
    return this.wallet.publicKey;
  }
}

/**
 * JSON replacer that sorts object keys for canonical representation
 */
function sortKeys(_key: string, value: unknown): unknown {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const sorted: Record<string, unknown> = {};
    for (const k of Object.keys(value).sort()) {
      sorted[k] = (value as Record<string, unknown>)[k];
    }
    return sorted;
  }
  return value;
}

/**
 * Verify a signed transaction
 */
export async function verifySignedTransaction(
  signedTx: SignedTransaction
): Promise<boolean> {
  // Recreate the transaction data that was signed
  const txData = signedTx.type === 'call'
    ? {
        type: 'call',
        contract_address: (signedTx.transaction as CallRequest).contract_address,
        function: (signedTx.transaction as CallRequest).function,
        args: (signedTx.transaction as CallRequest).args,
        sender: (signedTx.transaction as CallRequest).sender,
        gas_limit: (signedTx.transaction as CallRequest).gas_limit,
        value: (signedTx.transaction as CallRequest).value.toString(),
      }
    : {
        type: 'deploy',
        code: (signedTx.transaction as DeployRequest).code,
        sender: (signedTx.transaction as DeployRequest).sender,
        gas_limit: (signedTx.transaction as DeployRequest).gas_limit,
        init_args: (signedTx.transaction as DeployRequest).init_args,
      };

  const txJson = JSON.stringify(txData, sortKeys);
  const txBytes = new TextEncoder().encode(txJson);

  // Import verifySignature from wallet module
  const { verifySignature } = await import('./wallet');

  return verifySignature(txBytes, signedTx.signature, signedTx.public_key);
}
