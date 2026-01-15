/**
 * BlueBlocks Wallet Implementation
 * Ed25519 key management with AES-256-GCM encryption
 */

import * as ed25519 from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import { sha256 } from '@noble/hashes/sha256';
import { gcm } from '@noble/ciphers/aes';
import { randomBytes } from '@noble/ciphers/webcrypto';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import {
  InvalidPrivateKeyError,
  InvalidSignatureError,
  InvalidPasswordError,
} from '../core/errors';
import { Crypto, Address } from '../core/constants';

// Configure ed25519 to use sha512
ed25519.etc.sha512Sync = (...m) => sha512(ed25519.etc.concatBytes(...m));

/**
 * Keypair containing public and private keys
 */
export interface Keypair {
  /** Public key (32 bytes) */
  publicKey: Uint8Array;
  /** Private key (64 bytes - seed + public key) */
  privateKey: Uint8Array;
}

/**
 * Stored key format (matches Go lib/wallet/wallet.go)
 */
export interface StoredKey {
  /** Login identifier */
  login: string;
  /** Base64-encoded public key */
  public_key: string;
  /** Encrypted private key data (if encrypted) */
  encrypted?: {
    /** Base64-encoded nonce */
    nonce: string;
    /** Base64-encoded ciphertext */
    ciphertext: string;
    /** Base64-encoded salt for key derivation */
    salt: string;
  };
}

/**
 * Wallet instance for signing transactions
 */
export class Wallet {
  private readonly keypair: Keypair;
  private readonly _address: string;

  private constructor(keypair: Keypair) {
    this.keypair = keypair;
    this._address = deriveAddress(keypair.publicKey);
  }

  /**
   * Create a new random wallet
   */
  static create(): Wallet {
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKey = ed25519.getPublicKey(privateKey);

    // Ed25519 private key is seed (32 bytes) + public key (32 bytes) = 64 bytes
    const fullPrivateKey = new Uint8Array(64);
    fullPrivateKey.set(privateKey, 0);
    fullPrivateKey.set(publicKey, 32);

    return new Wallet({ publicKey, privateKey: fullPrivateKey });
  }

  /**
   * Create wallet from private key (hex string or bytes)
   */
  static fromPrivateKey(privateKey: string | Uint8Array): Wallet {
    let keyBytes: Uint8Array;

    if (typeof privateKey === 'string') {
      // Remove 0x prefix if present
      const hex = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
      keyBytes = hexToBytes(hex);
    } else {
      keyBytes = privateKey;
    }

    // Handle both 32-byte seed and 64-byte full key
    let seed: Uint8Array;
    if (keyBytes.length === 32) {
      seed = keyBytes;
    } else if (keyBytes.length === 64) {
      seed = keyBytes.slice(0, 32);
    } else {
      throw new InvalidPrivateKeyError();
    }

    const publicKey = ed25519.getPublicKey(seed);
    const fullPrivateKey = new Uint8Array(64);
    fullPrivateKey.set(seed, 0);
    fullPrivateKey.set(publicKey, 32);

    return new Wallet({ publicKey, privateKey: fullPrivateKey });
  }

  /**
   * Load wallet from stored key format
   */
  static fromStoredKey(stored: StoredKey, password?: string): Wallet {
    if (stored.encrypted) {
      if (!password) {
        throw new InvalidPasswordError();
      }

      // Decode encrypted data
      const nonce = base64ToBytes(stored.encrypted.nonce);
      const ciphertext = base64ToBytes(stored.encrypted.ciphertext);
      const salt = base64ToBytes(stored.encrypted.salt);

      // Derive key using Argon2id (simplified - in browser use argon2-browser)
      // For now, use PBKDF2 as a fallback that works in all environments
      const key = deriveKeyPBKDF2(password, salt);

      // Decrypt private key
      const aes = gcm(key, nonce);
      const privateKey = aes.decrypt(ciphertext);

      return Wallet.fromPrivateKey(privateKey);
    }

    // Unencrypted - just decode public key and derive
    throw new Error('Unencrypted stored keys not supported. Private key required.');
  }

  /**
   * Get wallet address
   */
  get address(): string {
    return this._address;
  }

  /**
   * Get public key as hex string
   */
  get publicKey(): string {
    return bytesToHex(this.keypair.publicKey);
  }

  /**
   * Get private key as hex string (be careful with this!)
   */
  get privateKey(): string {
    return bytesToHex(this.keypair.privateKey);
  }

  /**
   * Get public key as bytes
   */
  get publicKeyBytes(): Uint8Array {
    return this.keypair.publicKey;
  }

  /**
   * Get private key as bytes (be careful with this!)
   */
  get privateKeyBytes(): Uint8Array {
    return this.keypair.privateKey;
  }

  /**
   * Sign a message
   * @param message - Message to sign (string or bytes)
   * @returns Signature as hex string
   */
  async sign(message: string | Uint8Array): Promise<string> {
    const msgBytes = typeof message === 'string'
      ? new TextEncoder().encode(message)
      : message;

    // Use the 32-byte seed for signing
    const seed = this.keypair.privateKey.slice(0, 32);
    const signature = await ed25519.signAsync(msgBytes, seed);

    return bytesToHex(signature);
  }

  /**
   * Sign a message synchronously
   */
  signSync(message: string | Uint8Array): string {
    const msgBytes = typeof message === 'string'
      ? new TextEncoder().encode(message)
      : message;

    const seed = this.keypair.privateKey.slice(0, 32);
    const signature = ed25519.sign(msgBytes, seed);

    return bytesToHex(signature);
  }

  /**
   * Verify a signature
   * @param message - Original message
   * @param signature - Signature to verify (hex string)
   * @returns true if valid
   */
  async verify(message: string | Uint8Array, signature: string): Promise<boolean> {
    const msgBytes = typeof message === 'string'
      ? new TextEncoder().encode(message)
      : message;

    const sigBytes = hexToBytes(signature.startsWith('0x') ? signature.slice(2) : signature);

    try {
      return await ed25519.verifyAsync(sigBytes, msgBytes, this.keypair.publicKey);
    } catch {
      return false;
    }
  }

  /**
   * Verify a signature synchronously
   */
  verifySync(message: string | Uint8Array, signature: string): boolean {
    const msgBytes = typeof message === 'string'
      ? new TextEncoder().encode(message)
      : message;

    const sigBytes = hexToBytes(signature.startsWith('0x') ? signature.slice(2) : signature);

    try {
      return ed25519.verify(sigBytes, msgBytes, this.keypair.publicKey);
    } catch {
      return false;
    }
  }

  /**
   * Export wallet to stored key format
   * @param login - Login identifier
   * @param password - Password for encryption (optional but recommended)
   */
  toStoredKey(login: string, password?: string): StoredKey {
    const publicKeyB64 = bytesToBase64(this.keypair.publicKey);

    if (!password) {
      // Not recommended - return without encryption
      return {
        login,
        public_key: publicKeyB64,
      };
    }

    // Generate salt and derive key
    const salt = randomBytes(Crypto.ARGON2_SALT_LENGTH);
    const key = deriveKeyPBKDF2(password, salt);

    // Generate nonce and encrypt
    const nonce = randomBytes(Crypto.AES_NONCE_LENGTH);
    const aes = gcm(key, nonce);
    const ciphertext = aes.encrypt(this.keypair.privateKey);

    return {
      login,
      public_key: publicKeyB64,
      encrypted: {
        nonce: bytesToBase64(nonce),
        ciphertext: bytesToBase64(ciphertext),
        salt: bytesToBase64(salt),
      },
    };
  }
}

/**
 * Derive address from public key
 * Address = first 20 bytes of SHA256(publicKey), hex encoded
 */
export function deriveAddress(publicKey: Uint8Array): string {
  const hash = sha256(publicKey);
  const addressBytes = hash.slice(0, Crypto.ADDRESS_BYTES);
  return Address.PREFIX + bytesToHex(addressBytes);
}

/**
 * Verify a signature with a public key
 */
export async function verifySignature(
  message: string | Uint8Array,
  signature: string,
  publicKey: string | Uint8Array
): Promise<boolean> {
  const msgBytes = typeof message === 'string'
    ? new TextEncoder().encode(message)
    : message;

  const sigBytes = hexToBytes(
    typeof signature === 'string' && signature.startsWith('0x')
      ? signature.slice(2)
      : signature as string
  );

  const pubKeyBytes = typeof publicKey === 'string'
    ? hexToBytes(publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey)
    : publicKey;

  try {
    return await ed25519.verifyAsync(sigBytes, msgBytes, pubKeyBytes);
  } catch {
    return false;
  }
}

/**
 * Validate an address format
 */
export function isValidAddress(address: string): boolean {
  if (!address.startsWith(Address.PREFIX)) {
    return false;
  }
  const hex = address.slice(2);
  if (hex.length !== Address.LENGTH) {
    return false;
  }
  return /^[0-9a-fA-F]+$/.test(hex);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Derive encryption key using PBKDF2
 * Note: In production, use Argon2id via argon2-browser package
 */
function deriveKeyPBKDF2(password: string, salt: Uint8Array): Uint8Array {
  // Simple PBKDF2-like derivation using SHA-256
  // This is a simplified version - in production use proper PBKDF2 or Argon2id
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);

  let key = new Uint8Array([...passwordBytes, ...salt]);
  for (let i = 0; i < 100000; i++) {
    key = sha256(key);
  }

  return key;
}

/**
 * Convert bytes to base64
 */
function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  // Browser environment
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
}

/**
 * Convert base64 to bytes
 */
function base64ToBytes(base64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  // Browser environment
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
