# @blueblocks/sdk

Official TypeScript/JavaScript SDK for the **BlueBlocks Global Health Network** - a decentralized platform for healthcare, disease tracking, medicine supply chain, and health identity management.

## Overview

BlueBlocks is not a cryptocurrency - it's **healthcare infrastructure** built on blockchain technology. The network provides:

- **NFT-based Health IDs** - Portable, sovereign patient identity that you own
- **BBT Governance Token** - Participate in network governance and validation
- **Supply Chain Verification** - Track pharmaceutical and medical supply authenticity
- **Decentralized Health Records** - HIPAA-compliant, patient-controlled medical data

## Installation

```bash
npm install @blueblocks/sdk
# or
yarn add @blueblocks/sdk
# or
pnpm add @blueblocks/sdk
```

For React integration:
```bash
npm install @blueblocks/sdk react
```

## Quick Start

### Basic Usage

```typescript
import { BlueBlocksClient, Networks, Wallet } from '@blueblocks/sdk';

// Connect to testnet
const client = new BlueBlocksClient(Networks.testnet);

// Create a wallet
const wallet = Wallet.create();
console.log('Address:', wallet.address);

// Check balance
const balance = await client.getBalance(wallet.address);
console.log('Balance:', balance);
```

### Deploy a Smart Contract

```typescript
import { BlueBlocksClient, Wallet } from '@blueblocks/sdk';

const client = new BlueBlocksClient('http://localhost:8080');
const wallet = Wallet.create();

// Starlark contract code
const code = `
def init():
    state.counter = 0

def increment():
    state.counter = state.counter + 1
    emit("Incremented", value=state.counter)
    return state.counter

def get_count():
    return state.counter
`;

// Deploy
const { contract_address } = await client.deployContract({
  sender: wallet.address,
  code,
  gas_limit: 500000,
  init_args: [],
});

console.log('Contract deployed at:', contract_address);

// Call the contract
const result = await client.callContract({
  contract_address,
  function: 'increment',
  args: [],
  sender: wallet.address,
  gas_limit: 100000,
  value: 0n,
});

console.log('Counter:', result.result.return_value);
console.log('Events:', result.result.events);
```

### React Integration

```tsx
import { BlueBlocksProvider, useWallet, useContract, Networks } from '@blueblocks/sdk/react';

// Wrap your app with the provider
function App() {
  return (
    <BlueBlocksProvider network={Networks.testnet}>
      <MyHealthApp />
    </BlueBlocksProvider>
  );
}

// Use hooks in your components
function WalletConnect() {
  const { isConnected, address, connect, disconnect, create } = useWallet();

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => create('mylogin', 'secure-password')}>
        Create Wallet
      </button>
      <button onClick={() => connect('mylogin', 'secure-password')}>
        Connect Existing
      </button>
    </div>
  );
}

function HealthRecordContract() {
  const { call, isLoading, result, error } = useContract({
    address: '0x1234567890abcdef...',
  });

  const grantAccess = async (providerAddress: string) => {
    await call('authorize_provider', [providerAddress, Date.now() + 86400000]);
  };

  return (
    <div>
      <button onClick={() => grantAccess('0xprovider...')} disabled={isLoading}>
        Grant Provider Access
      </button>
      {error && <p className="error">{error.message}</p>}
      {result && <p>Access granted!</p>}
    </div>
  );
}
```

## API Reference

### BlueBlocksClient

The main client for interacting with BlueBlocks nodes.

```typescript
const client = new BlueBlocksClient(network, options);
```

**Methods:**

| Method | Description |
|--------|-------------|
| `health()` | Check node health |
| `getGenesisMetadata()` | Get genesis block metadata |
| `deployContract(request)` | Deploy a smart contract |
| `callContract(request)` | Call a contract function |
| `simulateCall(request)` | Simulate a call without committing |
| `getContract(address)` | Get contract information |
| `getContractState(address)` | Get current contract state |
| `estimateGas(request)` | Estimate gas for a call |
| `getAccount(address)` | Get account information |
| `getBalance(address)` | Get account balance |
| `getBlock(heightOrHash)` | Get block by height or hash |
| `getLatestBlock()` | Get the latest block |
| `getTransaction(txId)` | Get transaction by ID |

### Wallet

Ed25519 wallet for signing transactions.

```typescript
// Create new wallet
const wallet = Wallet.create();

// Import from private key
const wallet = Wallet.fromPrivateKey('0x...');

// Sign a message
const signature = await wallet.sign('Hello, BlueBlocks!');

// Verify a signature
const isValid = await wallet.verify('Hello, BlueBlocks!', signature);

// Export for storage (encrypted)
const stored = wallet.toStoredKey('login', 'password');
```

### Keystore (Browser)

Secure wallet storage using IndexedDB.

```typescript
import { getKeystore } from '@blueblocks/sdk';

const keystore = getKeystore();
await keystore.init();

// Create and store a wallet
const wallet = await keystore.createWallet('mylogin', 'password');

// Unlock an existing wallet
const wallet = await keystore.unlockWallet('mylogin', 'password');

// List all wallets
const wallets = await keystore.listWallets();
```

## Networks

Pre-configured networks:

```typescript
import { Networks } from '@blueblocks/sdk';

Networks.mainnet  // Production network
Networks.testnet  // Test network
Networks.local    // Local development (localhost:8080)
```

Custom network:

```typescript
const customNetwork = {
  name: 'My Network',
  chain_id: 'my-chain',
  rpc_url: 'https://my-node.example.com',
  ws_url: 'wss://my-node.example.com/ws',
};
```

## Healthcare-Specific Features

The SDK includes constants and utilities for healthcare applications:

```typescript
import { Healthcare } from '@blueblocks/sdk';

// Validate NPI (National Provider Identifier)
const isValidNPI = Healthcare.NPI_LENGTH === 10;

// Access purposes for HIPAA compliance
Healthcare.AccessPurpose.TREATMENT
Healthcare.AccessPurpose.PAYMENT
Healthcare.AccessPurpose.EMERGENCY

// Data classification levels
Healthcare.DataClassification.HIPAA_PHI
Healthcare.DataClassification.GDPR

// FHIR resource types
Healthcare.FHIRResourceTypes // ['Patient', 'Observation', ...]
```

## Error Handling

The SDK provides typed errors for better error handling:

```typescript
import {
  BlueBlocksError,
  ContractNotFoundError,
  InsufficientBalanceError,
  WalletLockedError,
} from '@blueblocks/sdk';

try {
  await client.callContract(request);
} catch (error) {
  if (error instanceof ContractNotFoundError) {
    console.log('Contract not found at:', error.contractAddress);
  } else if (error instanceof InsufficientBalanceError) {
    console.log('Need:', error.required, 'Have:', error.available);
  } else if (error instanceof WalletLockedError) {
    console.log('Please unlock your wallet first');
  }
}
```

## Contributing

We welcome contributions! See our [contribution guidelines](../../CONTRIBUTING.md).

## License

MIT License - see [LICENSE](../../LICENSE) for details.

---

**BlueBlocks** - Building the future of global health infrastructure.
