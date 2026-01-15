/**
 * Browser Keystore
 * Secure wallet storage using IndexedDB with encryption
 */

import type { StoredKey } from './wallet';
import { Wallet } from './wallet';
import { WalletLockedError, InvalidPasswordError } from '../core/errors';

const DB_NAME = 'blueblocks-keystore';
const DB_VERSION = 1;
const STORE_NAME = 'wallets';

/**
 * Keystore entry with metadata
 */
export interface KeystoreEntry {
  /** Wallet login/identifier */
  login: string;
  /** Wallet address */
  address: string;
  /** Creation timestamp */
  created_at: number;
  /** Last access timestamp */
  last_accessed: number;
  /** Stored key data */
  stored_key: StoredKey;
}

/**
 * Browser-based keystore using IndexedDB
 */
export class Keystore {
  private db: IDBDatabase | null = null;
  private unlockedWallets: Map<string, Wallet> = new Map();

  /**
   * Initialize the keystore
   */
  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'login' });
          store.createIndex('address', 'address', { unique: true });
          store.createIndex('created_at', 'created_at', { unique: false });
        }
      };
    });
  }

  /**
   * Ensure database is initialized
   */
  private async ensureDb(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Failed to initialize keystore database');
    }
    return this.db;
  }

  /**
   * Create and store a new wallet
   */
  async createWallet(login: string, password: string): Promise<Wallet> {
    const db = await this.ensureDb();

    // Check if login already exists
    const existing = await this.getEntry(login);
    if (existing) {
      throw new Error(`Wallet with login '${login}' already exists`);
    }

    // Create new wallet
    const wallet = Wallet.create();
    const storedKey = wallet.toStoredKey(login, password);

    const entry: KeystoreEntry = {
      login,
      address: wallet.address,
      created_at: Date.now(),
      last_accessed: Date.now(),
      stored_key: storedKey,
    };

    // Store in IndexedDB
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.add(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });

    // Keep wallet unlocked
    this.unlockedWallets.set(login, wallet);

    return wallet;
  }

  /**
   * Import an existing wallet
   */
  async importWallet(
    login: string,
    password: string,
    privateKey: string | Uint8Array
  ): Promise<Wallet> {
    const db = await this.ensureDb();

    // Check if login already exists
    const existing = await this.getEntry(login);
    if (existing) {
      throw new Error(`Wallet with login '${login}' already exists`);
    }

    // Import wallet
    const wallet = Wallet.fromPrivateKey(privateKey);
    const storedKey = wallet.toStoredKey(login, password);

    const entry: KeystoreEntry = {
      login,
      address: wallet.address,
      created_at: Date.now(),
      last_accessed: Date.now(),
      stored_key: storedKey,
    };

    // Store in IndexedDB
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.add(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });

    // Keep wallet unlocked
    this.unlockedWallets.set(login, wallet);

    return wallet;
  }

  /**
   * Unlock a wallet with password
   */
  async unlockWallet(login: string, password: string): Promise<Wallet> {
    // Check if already unlocked
    const existing = this.unlockedWallets.get(login);
    if (existing) {
      return existing;
    }

    // Get stored key
    const entry = await this.getEntry(login);
    if (!entry) {
      throw new Error(`Wallet '${login}' not found`);
    }

    // Decrypt and create wallet
    try {
      const wallet = Wallet.fromStoredKey(entry.stored_key, password);
      this.unlockedWallets.set(login, wallet);

      // Update last accessed
      await this.updateLastAccessed(login);

      return wallet;
    } catch (error) {
      throw new InvalidPasswordError();
    }
  }

  /**
   * Lock a wallet (remove from memory)
   */
  lockWallet(login: string): void {
    this.unlockedWallets.delete(login);
  }

  /**
   * Lock all wallets
   */
  lockAll(): void {
    this.unlockedWallets.clear();
  }

  /**
   * Get an unlocked wallet
   */
  getWallet(login: string): Wallet {
    const wallet = this.unlockedWallets.get(login);
    if (!wallet) {
      throw new WalletLockedError();
    }
    return wallet;
  }

  /**
   * Check if a wallet is unlocked
   */
  isUnlocked(login: string): boolean {
    return this.unlockedWallets.has(login);
  }

  /**
   * List all stored wallets (metadata only)
   */
  async listWallets(): Promise<Array<{ login: string; address: string; created_at: number }>> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entries = request.result as KeystoreEntry[];
        resolve(
          entries.map((e) => ({
            login: e.login,
            address: e.address,
            created_at: e.created_at,
          }))
        );
      };
    });
  }

  /**
   * Get wallet by address
   */
  async getWalletByAddress(address: string): Promise<Wallet | null> {
    const db = await this.ensureDb();

    const entry = await new Promise<KeystoreEntry | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('address');
      const request = index.get(address);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });

    if (!entry) return null;

    // Check if unlocked
    const wallet = this.unlockedWallets.get(entry.login);
    if (wallet) return wallet;

    throw new WalletLockedError();
  }

  /**
   * Delete a wallet
   */
  async deleteWallet(login: string): Promise<void> {
    const db = await this.ensureDb();

    // Remove from memory
    this.unlockedWallets.delete(login);

    // Remove from IndexedDB
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(login);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Change wallet password
   */
  async changePassword(
    login: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    // First, unlock with old password
    const wallet = await this.unlockWallet(login, oldPassword);

    // Re-encrypt with new password
    const storedKey = wallet.toStoredKey(login, newPassword);

    const db = await this.ensureDb();

    // Get existing entry
    const entry = await this.getEntry(login);
    if (!entry) {
      throw new Error(`Wallet '${login}' not found`);
    }

    // Update stored key
    entry.stored_key = storedKey;

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Export wallet (returns private key - be careful!)
   */
  async exportPrivateKey(login: string, password: string): Promise<string> {
    const wallet = await this.unlockWallet(login, password);
    return wallet.privateKey;
  }

  /**
   * Check if keystore has any wallets
   */
  async hasWallets(): Promise<boolean> {
    const wallets = await this.listWallets();
    return wallets.length > 0;
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  private async getEntry(login: string): Promise<KeystoreEntry | null> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(login);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  private async updateLastAccessed(login: string): Promise<void> {
    const db = await this.ensureDb();

    const entry = await this.getEntry(login);
    if (!entry) return;

    entry.last_accessed = Date.now();

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

/**
 * Global keystore instance
 */
let globalKeystore: Keystore | null = null;

/**
 * Get the global keystore instance
 */
export function getKeystore(): Keystore {
  if (!globalKeystore) {
    globalKeystore = new Keystore();
  }
  return globalKeystore;
}
