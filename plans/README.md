# AfterBlock Planning Documents

**Designed by After Dark Systems, LLC and donated to the public domain.**

## Overview

This directory contains comprehensive planning and research documentation for AfterBlock, a Layer-1 blockchain written in Go with Python smart contracts and encrypted IPFS file storage.

## Documents

### [01-project-overview.md](01-project-overview.md)
High-level project vision, goals, and key features. Start here for an introduction to AfterBlock.

**Contents:**
- Project vision and objectives
- Core features (smart contracts, consensus, IPFS)
- Technology stack overview
- Key differentiators
- Target use cases

### [02-architecture.md](02-architecture.md)
Detailed system architecture covering all major components and their interactions.

**Contents:**
- System architecture diagrams
- Component descriptions (Consensus, Application, VM, IPFS)
- Network topology and node types
- Security architecture and threat model
- Scalability considerations
- Development tools ecosystem

### [03-python-vm-design.md](03-python-vm-design.md)
In-depth design of the Python smart contract virtual machine.

**Contents:**
- VM implementation options (Starlark vs. CPython)
- Execution context and built-in functions
- Gas metering system design
- Sandboxing and security mechanisms
- Determinism requirements
- State management and serialization
- Contract deployment and interaction
- Testing framework

### [04-ipfs-integration.md](04-ipfs-integration.md)
Complete guide to IPFS integration with encryption for decentralized file storage.

**Contents:**
- IPFS fundamentals and content addressing
- Encryption layer (AES-256-GCM)
- Key management strategies
- Upload/download implementation
- Smart contract API for IPFS
- On-chain metadata and access control
- Pinning strategies
- Private IPFS networks
- Performance optimization

### [05-implementation-roadmap.md](05-implementation-roadmap.md)
Phased implementation plan from initial setup to mainnet launch.

**Contents:**
- Phase 1: Foundation & Setup
- Phase 2: Python VM Integration
- Phase 3: Gas Metering & Security
- Phase 4: IPFS Integration
- Phase 5: Developer Tools & Testing
- Phase 6: Advanced Features (IBC, Governance)
- Phase 7: Testnet Launch
- Phase 8: Mainnet Launch
- Timeline: 8-9 months to mainnet
- Risk mitigation strategies

### [06-research-sources.md](06-research-sources.md)
Comprehensive bibliography of research sources and references.

**Contents:**
- Cosmos SDK & Tendermint resources
- Python embedding in Go
- Smart contract VM architecture papers
- IPFS and encrypted storage
- Academic papers
- GitHub repositories
- Official documentation links

## Quick Start

1. **New to the project?** Start with [01-project-overview.md](01-project-overview.md)
2. **Want to understand the system?** Read [02-architecture.md](02-architecture.md)
3. **Interested in smart contracts?** Check [03-python-vm-design.md](03-python-vm-design.md)
4. **Looking at storage?** See [04-ipfs-integration.md](04-ipfs-integration.md)
5. **Ready to build?** Follow [05-implementation-roadmap.md](05-implementation-roadmap.md)

## Key Technologies

- **Blockchain Core**: Go, Cosmos SDK, Tendermint/CometBFT
- **Smart Contracts**: Python (Starlark-go)
- **Consensus**: Byzantine Fault Tolerant Proof of Stake
- **Storage**: IPFS with AES-256-GCM encryption
- **Interoperability**: IBC (Inter-Blockchain Communication)

## Project Status

**Current Phase**: Planning & Architecture
**Next Steps**: Begin Phase 1 implementation

## Contributing

These plans are donated to the public domain. Feel free to use, modify, or build upon them for your own blockchain projects.

## License

**Public Domain** - Designed by After Dark Systems, LLC and donated to the public domain.

All planning documents, research, and architectural designs in this directory are released without any copyright restrictions. You are free to use, modify, distribute, and build upon this work without attribution.

## Contact

For questions about the design or implementation, refer to the detailed documentation in each planning file.

---

**Designed by After Dark Systems, LLC**
**Donated to the Public Domain**
