# AfterBlock - Layer-1 Blockchain Project Overview

## Project Vision

AfterBlock is a custom Layer-1 blockchain written in Go with Python as its smart contract scripting language, featuring Byzantine Fault Tolerant consensus and encrypted IPFS file storage.

## Core Features

1. **Smart Contracts** - Python-based smart contract execution environment
2. **Consensus Algorithm** - Tendermint BFT (Proof of Stake)
3. **Encrypted File Storage** - IPFS integration with encryption-at-rest
4. **Go Implementation** - High-performance blockchain core written in Go

## Technology Stack

### Blockchain Core
- **Language**: Go
- **Framework**: Cosmos SDK
- **Consensus**: Tendermint/CometBFT
- **Interface**: ABCI (Application Blockchain Interface)

### Smart Contract Layer
- **Language**: Python (via Starlark or embedded CPython)
- **Execution**: Sandboxed VM with gas metering
- **Features**: Deterministic execution, resource limits

### Storage Layer
- **Distributed Storage**: IPFS (go-ipfs)
- **Encryption**: AES-256 (encrypt-before-upload)
- **On-Chain**: CIDs and metadata stored on blockchain

## Key Differentiators

1. **Python Smart Contracts** - Developer-friendly scripting language
2. **Built-in Encrypted Storage** - Native IPFS integration with encryption
3. **BFT Consensus** - Instant finality, no probabilistic confirmation
4. **Modular Architecture** - Built on battle-tested Cosmos SDK

## Target Use Cases

- Decentralized applications requiring file storage
- Privacy-focused applications with encrypted data
- Python developer ecosystem
- Applications requiring instant finality

## Project Status

**Phase**: Planning & Research
**Next Steps**: Architecture design and proof-of-concept implementation
