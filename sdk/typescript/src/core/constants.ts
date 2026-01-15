/**
 * BlueBlocks SDK Constants
 */

/**
 * Gas constants
 */
export const Gas = {
  /** Default gas limit for contract deployment */
  DEFAULT_DEPLOY_LIMIT: 1_000_000,
  /** Default gas limit for contract calls */
  DEFAULT_CALL_LIMIT: 500_000,
  /** Minimum gas limit */
  MIN_LIMIT: 21_000,
  /** Maximum gas limit per transaction */
  MAX_LIMIT: 10_000_000,

  /** Gas costs for common operations (estimates) */
  Costs: {
    /** Basic arithmetic operation */
    ARITHMETIC: 1,
    /** Storage read */
    STORAGE_READ: 200,
    /** Storage write */
    STORAGE_WRITE: 5_000,
    /** Memory allocation (per byte) */
    MEMORY_BYTE: 3,
    /** Function call overhead */
    FUNCTION_CALL: 10,
    /** IPFS upload base cost */
    IPFS_UPLOAD_BASE: 1_000,
    /** IPFS upload per KB */
    IPFS_UPLOAD_PER_KB: 100,
    /** Event emission */
    EVENT_EMIT: 375,
    /** SHA256 hash */
    SHA256: 60,
  },
} as const;

/**
 * Address constants
 */
export const Address = {
  /** Length of addresses in characters (hex) */
  LENGTH: 40,
  /** Prefix for all addresses */
  PREFIX: '0x',
  /** Zero address */
  ZERO: '0x0000000000000000000000000000000000000000',
} as const;

/**
 * Token constants (BBT - BlueBlocks Token)
 */
export const Token = {
  /** Token symbol */
  SYMBOL: 'BBT',
  /** Token name */
  NAME: 'BlueBlocks Token',
  /** Decimal places (smallest unit = 1e-18 BBT) */
  DECIMALS: 18,
  /** Smallest unit name */
  SMALLEST_UNIT: 'wei',
} as const;

/**
 * Contract constants
 */
export const Contract = {
  /** Maximum contract code size (bytes) */
  MAX_CODE_SIZE: 24_576, // 24 KB
  /** Maximum function name length */
  MAX_FUNCTION_NAME: 128,
  /** Maximum number of arguments */
  MAX_ARGS: 32,
  /** Contract address length */
  ADDRESS_LENGTH: 40,
} as const;

/**
 * Cryptography constants
 */
export const Crypto = {
  /** Private key length (bytes) */
  PRIVATE_KEY_LENGTH: 64,
  /** Public key length (bytes) */
  PUBLIC_KEY_LENGTH: 32,
  /** Signature length (bytes) */
  SIGNATURE_LENGTH: 64,
  /** Address derivation: use first N bytes of public key hash */
  ADDRESS_BYTES: 20,
  /** AES key length (bytes) */
  AES_KEY_LENGTH: 32,
  /** AES nonce length (bytes) */
  AES_NONCE_LENGTH: 12,
  /** Argon2 salt length (bytes) */
  ARGON2_SALT_LENGTH: 16,
  /** Argon2 time cost */
  ARGON2_TIME: 1,
  /** Argon2 memory cost (KB) */
  ARGON2_MEMORY: 65536, // 64 MB
  /** Argon2 parallelism */
  ARGON2_PARALLELISM: 4,
} as const;

/**
 * Healthcare-specific constants
 */
export const Healthcare = {
  /** NPI (National Provider Identifier) length */
  NPI_LENGTH: 10,
  /** ICD-10 code pattern */
  ICD10_PATTERN: /^[A-TV-Z][0-9][0-9AB]\.?[0-9A-TV-Z]{0,4}$/,
  /** NDC (National Drug Code) pattern */
  NDC_PATTERN: /^\d{4,5}-\d{3,4}-\d{1,2}$/,
  /** Minimum age for consent (years) */
  MIN_CONSENT_AGE: 18,

  /** Access purpose types */
  AccessPurpose: {
    TREATMENT: 'TREATMENT',
    PAYMENT: 'PAYMENT',
    OPERATIONS: 'OPERATIONS',
    RESEARCH: 'RESEARCH',
    PUBLIC_HEALTH: 'PUBLIC_HEALTH',
    EMERGENCY: 'EMERGENCY',
    WORKERS_COMP: 'WORKERS_COMP',
    LEGAL: 'LEGAL',
  },

  /** Data classification levels */
  DataClassification: {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    NMPI: 'NMPI', // Non-Medical Personal Information
    MPI: 'MPI', // Medical Personal Information
    HIPAA_PHI: 'HIPAA_PHI', // Protected Health Information
    GDPR: 'GDPR',
    HIPAA_GDPR: 'HIPAA_GDPR',
  },

  /** FHIR resource types */
  FHIRResourceTypes: [
    'Patient',
    'Practitioner',
    'Organization',
    'Observation',
    'Condition',
    'Medication',
    'MedicationRequest',
    'Encounter',
    'DiagnosticReport',
    'Immunization',
    'AllergyIntolerance',
    'Procedure',
  ],
} as const;

/**
 * Time constants
 */
export const Time = {
  /** Seconds per minute */
  MINUTE: 60,
  /** Seconds per hour */
  HOUR: 3600,
  /** Seconds per day */
  DAY: 86400,
  /** Seconds per week */
  WEEK: 604800,
  /** Default access grant duration (30 days in seconds) */
  DEFAULT_ACCESS_DURATION: 30 * 86400,
  /** Emergency access duration (4 hours in seconds) */
  EMERGENCY_ACCESS_DURATION: 4 * 3600,
  /** Unbonding period for validators (7 days in seconds) */
  UNBONDING_PERIOD: 7 * 86400,
} as const;

/**
 * Validator constants
 */
export const Validator = {
  /** Minimum stake for standard validator (BBT) */
  MIN_STAKE_STANDARD: 10_000n * 10n ** 18n,
  /** Minimum stake for healthcare validator (BBT) */
  MIN_STAKE_HEALTHCARE: 25_000n * 10n ** 18n,
  /** Minimum stake for treasury validator (BBT) */
  MIN_STAKE_TREASURY: 50_000n * 10n ** 18n,
  /** Minimum uptime percentage */
  MIN_UPTIME: 95,
  /** Maximum slashing events before ban */
  MAX_SLASH_COUNT: 5,

  /** Validator types */
  Types: {
    STANDARD: 'standard',
    HEALTHCARE: 'healthcare',
    TREASURY: 'treasury',
  },

  /** Validator status */
  Status: {
    PENDING: 'pending',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    UNBONDING: 'unbonding',
    SLASHED: 'slashed',
    BANNED: 'banned',
  },
} as const;

/**
 * Format BBT amount for display
 */
export function formatBBT(amount: bigint, decimals = 4): string {
  const divisor = 10n ** BigInt(Token.DECIMALS);
  const whole = amount / divisor;
  const fraction = amount % divisor;

  if (decimals === 0) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(Token.DECIMALS, '0');
  const truncated = fractionStr.slice(0, decimals);

  return `${whole}.${truncated}`;
}

/**
 * Parse BBT amount from string
 */
export function parseBBT(amount: string): bigint {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(Token.DECIMALS, '0').slice(0, Token.DECIMALS);
  return BigInt(whole) * 10n ** BigInt(Token.DECIMALS) + BigInt(paddedFraction);
}
