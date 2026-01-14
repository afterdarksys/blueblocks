# AfterBlock Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  AfterBlock Layer-1 Blockchain               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐            ┌─────────────────────┐    │
│  │   Tendermint     │   ABCI     │   Python VM Layer   │    │
│  │   Consensus      │◄──────────►│   (Starlark-go)     │    │
│  │   Engine         │            │                     │    │
│  └──────────────────┘            └─────────────────────┘    │
│         ▲                                  │                 │
│         │                                  ▼                 │
│         │                        ┌─────────────────────┐    │
│         │                        │  Smart Contract VM  │    │
│         │                        │  - Gas Metering     │    │
│         │                        │  - Sandboxing       │    │
│         │                        │  - Determinism      │    │
│         │                        │  - State Machine    │    │
│         │                        └─────────────────────┘    │
│         │                                  │                 │
│         ▼                                  ▼                 │
│  ┌───────────────────────────────────────────────────┐      │
│  │          Blockchain State Storage                 │      │
│  │  - Account Balances                               │      │
│  │  - Smart Contract Code & State                    │      │
│  │  - IPFS CIDs & Metadata                           │      │
│  │  - Validator Set                                  │      │
│  └───────────────────────────────────────────────────┘      │
│                           │                                  │
│                           ▼                                  │
│                 ┌──────────────────┐                         │
│                 │  IPFS Interface  │                         │
│                 │  - Encryption    │                         │
│                 │  - Upload/Fetch  │                         │
│                 └──────────────────┘                         │
└─────────────────────────│────────────────────────────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │   IPFS Network         │
              │   (go-ipfs)            │
              │   - Encrypted Files    │
              │   - Content Addressing │
              └────────────────────────┘
```

## Component Details

### 1. Consensus Layer (Tendermint)

**Responsibilities:**
- Block proposal and voting
- Byzantine Fault Tolerance (tolerates up to 1/3 malicious nodes)
- Validator set management
- Block finalization and commitment

**Key Features:**
- Proof of Stake consensus
- Instant finality
- 2/3 majority voting
- Built-in staking and slashing

**Communication:**
- ABCI interface to application layer
- P2P networking via libp2p
- Block and transaction propagation

### 2. Application Layer (Cosmos SDK)

**Responsibilities:**
- Transaction processing
- State management
- Module system (auth, bank, staking, etc.)
- ABCI implementation

**Key Modules:**
- **Auth**: Account management, signatures
- **Bank**: Token transfers, balances
- **Staking**: Validator staking, delegation
- **Gov**: On-chain governance
- **Custom Modules**: Python VM, IPFS interface

### 3. Python Smart Contract VM

**Design Options:**

#### Option A: Starlark-go (Recommended)
```
Advantages:
+ Native Go implementation (no CGO)
+ Deterministic by design
+ Built-in sandboxing
+ Parallel execution (no GIL)
+ Production-ready (used by Bazel, Buck)

Disadvantages:
- Limited Python subset
- Smaller standard library
- Learning curve for Python developers
```

#### Option B: Embedded CPython
```
Advantages:
+ Full Python language support
+ Rich ecosystem and libraries
+ Familiar to Python developers

Disadvantages:
- Global Interpreter Lock (GIL) limits parallelism
- Non-deterministic behaviors require mitigation
- Security sandboxing more complex
- Performance overhead
```

**VM Components:**
- **Interpreter**: Starlark-go or embedded CPython
- **Gas Metering**: Track computational resources per basic block
- **Sandbox**: Restrict filesystem, network, system calls
- **State Interface**: Access blockchain state (accounts, storage)
- **Built-in Functions**: Blockchain-specific APIs

### 4. Gas Metering System

**Purpose:**
- Prevent infinite loops and DoS attacks
- Meter computational resources
- Ensure fairness in resource allocation

**Implementation:**
- Gas costs defined per operation type
- Metering at basic block level (more efficient)
- Deterministic gas consumption across all nodes
- Gas limits per transaction and per block

**Gas Cost Examples:**
```
- Basic arithmetic: 1 gas
- Storage read: 200 gas
- Storage write: 5000 gas
- Memory allocation: 3 gas per byte
- Function call: 10 gas
- IPFS upload: 1000 gas + size-based cost
```

### 5. State Management

**State Structure:**
```
State Tree (Merkle IAVL Tree)
├── Accounts
│   ├── Address → Balance, Nonce, Code Hash
│   └── Storage → Contract Storage (key-value)
├── Smart Contracts
│   ├── Contract Code
│   └── Contract State
├── IPFS Mappings
│   ├── CID → Owner, Permissions, Encryption Info
│   └── Access Control Lists
└── System State
    ├── Validator Set
    ├── Staking Info
    └── Governance Proposals
```

**Features:**
- Merkle proof verification
- State snapshots for fast sync
- Pruning for disk space management
- State versioning for queries

### 6. IPFS Integration Layer

**Architecture:**

```
Smart Contract
      ↓
File Upload Request + Data
      ↓
1. Encrypt file (AES-256)
2. Generate encryption key
3. Upload to IPFS → CID
4. Store CID + metadata on-chain
5. Return CID to user
```

**Components:**

**Encryption Module:**
- Algorithm: AES-256-GCM
- Key Management: User-controlled or HSM
- Metadata: Encryption algorithm, key derivation info

**IPFS Client:**
- go-ipfs library integration
- Private or public IPFS network
- Pin management for data persistence

**Access Control:**
- Smart contract-based permissions
- Key sharing and revocation
- Time-based access grants

**On-Chain Storage:**
```go
type IPFSFile struct {
    CID              string
    Owner            Address
    EncryptionInfo   EncryptionMetadata
    Permissions      []Permission
    Size             uint64
    Timestamp        int64
}
```

### 7. Transaction Flow

**Transaction Lifecycle:**

1. **User submits transaction**
   - Sign transaction with private key
   - Broadcast to network

2. **Mempool validation**
   - Check signature validity
   - Verify nonce and balance
   - Check gas limits

3. **Block proposal**
   - Validator proposes block with transactions
   - Broadcast proposal to network

4. **Consensus**
   - Validators vote on proposal
   - 2/3 majority required for commit

5. **Execution** (ABCI)
   - BeginBlock: Initialize block execution
   - DeliverTx: Execute each transaction
     - Run smart contract in VM
     - Apply state changes
     - Charge gas fees
   - EndBlock: Finalize block execution
   - Commit: Persist state changes

6. **Finalization**
   - Block added to chain
   - State root updated
   - Events emitted

## Network Architecture

### Node Types

**1. Validator Nodes**
- Participate in consensus
- Propose and vote on blocks
- Require staked tokens
- Earn block rewards

**2. Full Nodes**
- Store complete blockchain history
- Validate all blocks and transactions
- Serve data to light clients
- Do not participate in consensus

**3. Light Clients**
- Store only block headers
- Verify Merkle proofs
- Query full nodes for data
- Minimal resource requirements

### Network Topology

```
Internet
    │
    ├── RPC Endpoints (JSON-RPC, REST)
    │
    ├── P2P Network (libp2p)
    │   ├── Validator Nodes
    │   ├── Full Nodes
    │   └── Seed Nodes
    │
    └── IPFS Network
        ├── IPFS Nodes
        └── IPFS Gateways
```

## Security Architecture

### Threat Model

**Consensus Attacks:**
- Byzantine validators (mitigated by BFT + staking)
- Long-range attacks (checkpointing)
- Validator censorship (slashing penalties)

**Smart Contract Attacks:**
- Reentrancy (call depth limits)
- Integer overflow (safe math)
- DoS (gas limits)
- Unauthorized access (permissions)

**Storage Attacks:**
- Data availability (IPFS pinning incentives)
- Data tampering (content addressing + encryption)
- Privacy leaks (mandatory encryption)

### Defense Mechanisms

1. **Sandboxing**: VM isolation, resource limits
2. **Gas Metering**: Economic DoS prevention
3. **Encryption**: Privacy protection for IPFS data
4. **Staking & Slashing**: Economic security for validators
5. **Code Auditing**: Smart contract verification tools
6. **Rate Limiting**: Network-level protection

## Scalability Considerations

### Current Design
- ~1000-5000 TPS (depending on transaction complexity)
- Block time: 5-7 seconds
- Block size: ~2MB
- Instant finality

### Future Optimizations
- State sharding
- Parallel transaction execution
- Layer-2 solutions (rollups)
- Off-chain computation with on-chain verification

## Interoperability

### IBC (Inter-Blockchain Communication)
- Native support via Cosmos SDK
- Connect to Cosmos ecosystem
- Cross-chain asset transfers

### Bridge Protocols
- Ethereum bridge (for EVM compatibility)
- Bitcoin bridge (for BTC integration)
- Custom bridges for other chains

## Development Tools

### For Smart Contract Developers
- Python SDK for contract development
- Testing framework (unit tests, integration tests)
- Local blockchain simulator
- Debugging tools with gas profiling

### For Node Operators
- CLI for node management
- Monitoring dashboards
- Validator key management
- Backup and recovery tools

### For DApp Developers
- JavaScript/TypeScript SDK
- Python client library
- REST and WebSocket APIs
- GraphQL query interface
