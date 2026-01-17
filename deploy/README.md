# BlueBlocks Network Deployment

Deploy BlueBlocks testnet and devnet infrastructure for development and testing.

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Make (optional, for convenience commands)
- 4GB+ RAM allocated to Docker

### Deploy DevNet (Local Development)

```bash
# Using Make
cd deploy
make devnet-start

# Or using scripts directly
./scripts/deploy-devnet.sh start
```

DevNet provides:
- Single node at `http://localhost:8080`
- Single validator at `http://localhost:7777`
- Low difficulty mining for fast block production
- Faucet enabled for free test tokens

### Deploy TestNet (Multi-Node)

```bash
# Basic TestNet
make testnet-start

# TestNet with monitoring (Prometheus/Grafana)
MONITORING_ENABLED=true make testnet-start

# TestNet with Ethereum bridge
TREASURY_ENABLED=true make testnet-start

# Full TestNet with all features
MONITORING_ENABLED=true TREASURY_ENABLED=true make testnet-start
```

TestNet provides:
- 3 nodes (ports 8080, 8081, 8082)
- 4 validators (standard + healthcare)
- 2 miners
- TimescaleDB indexer
- Optional Prometheus + Grafana monitoring

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    BlueBlocks TestNet                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│  │ Node 1  │◄►│ Node 2  │◄►│ Node 3  │  Consensus Network      │
│  │  :8080  │  │  :8081  │  │  :8082  │                        │
│  └────┬────┘  └────┬────┘  └────┬────┘                        │
│       │            │            │                              │
│  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────────────┐       │
│  │Validator│  │Validator│  │Validator│  │ Healthcare │        │
│  │    1    │  │    2    │  │    3    │  │ Validator  │        │
│  │  :7777  │  │  :7778  │  │  :7779  │  │   :7780    │        │
│  └─────────┘  └─────────┘  └─────────┘  └────────────┘        │
│                                                                 │
│  ┌─────────┐  ┌─────────┐                                      │
│  │ Miner 1 │  │ Miner 2 │  Block Production                    │
│  └─────────┘  └─────────┘                                      │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ TimescaleDB │  │   Indexer   │  │  Prometheus │            │
│  │    :5432    │  │             │  │    :9090    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────────────┐                                       │
│  │      Grafana        │  Monitoring Dashboard                 │
│  │       :3000         │                                       │
│  └─────────────────────┘                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components

| Component | Description | DevNet | TestNet |
|-----------|-------------|--------|---------|
| Node | HTTP API Server | 1 | 3 |
| Validator | Consensus Participant | 1 | 4 |
| Miner | Block Producer | 1 | 2 |
| Indexer | Block Explorer Backend | - | 1 |
| TimescaleDB | Time-series Database | - | 1 |
| Prometheus | Metrics Collection | - | Optional |
| Grafana | Monitoring Dashboard | - | Optional |
| Treasury | Ethereum Bridge | - | Optional |
| Discovery | P2P Discovery Service | - | Optional |

## Endpoints

### DevNet

| Service | URL |
|---------|-----|
| Node API | http://localhost:8080 |
| Health Check | http://localhost:8080/health |
| Validator | http://localhost:7777 |

### TestNet

| Service | URL |
|---------|-----|
| Node 1 | http://localhost:8080 |
| Node 2 | http://localhost:8081 |
| Node 3 | http://localhost:8082 |
| Validator 1 | http://localhost:7777 |
| Validator 2 | http://localhost:7778 |
| Validator 3 | http://localhost:7779 |
| Healthcare Validator | http://localhost:7780 |
| TimescaleDB | localhost:5432 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

## Configuration

### Environment Variables

Copy the example environment file and customize:

```bash
# DevNet
cp configs/devnet/.env.example configs/devnet/.env

# TestNet
cp configs/testnet/.env.example configs/testnet/.env
```

Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NETWORK` | Network name | devnet/testnet |
| `CHAIN_ID` | Chain identifier | blueblocks-devnet |
| `MINER_DIFFICULTY` | Mining difficulty | 2 (devnet), 4 (testnet) |
| `MINER_WORKERS` | Mining threads | 2 (devnet), 4 (testnet) |
| `TESTNET_DB_PASSWORD` | Database password | (required for testnet) |
| `TESTNET_ETH_RPC` | Ethereum RPC URL | (required for treasury) |

### Genesis Configuration

Genesis files define the initial state:

- `configs/devnet/genesis.json` - DevNet genesis
- `configs/testnet/genesis.json` - TestNet genesis

Key settings:
- Initial accounts and balances
- Genesis validators
- Block reward
- Faucet configuration

## Commands

### Make Targets

```bash
# Build
make build                  # Build all images
make build-devnet          # Build DevNet only
make build-testnet         # Build TestNet only

# DevNet
make devnet-start          # Start DevNet
make devnet-stop           # Stop DevNet
make devnet-restart        # Restart DevNet
make devnet-status         # Show status
make devnet-logs           # View logs
make devnet-destroy        # Destroy all data

# TestNet
make testnet-start         # Start TestNet
make testnet-start-full    # Start with monitoring & treasury
make testnet-stop          # Stop TestNet
make testnet-status        # Show status
make testnet-health        # Run health check
make testnet-logs          # View logs
make testnet-destroy       # Destroy all data

# Utilities
make test-api              # Test API endpoints
make test-faucet ADDR=bb...  # Request faucet tokens
make clean                 # Clean Docker resources
```

### Script Usage

```bash
# DevNet
./scripts/deploy-devnet.sh start
./scripts/deploy-devnet.sh stop
./scripts/deploy-devnet.sh status
./scripts/deploy-devnet.sh logs [service]
./scripts/deploy-devnet.sh destroy

# TestNet
./scripts/deploy-testnet.sh start
./scripts/deploy-testnet.sh stop
./scripts/deploy-testnet.sh status
./scripts/deploy-testnet.sh health
./scripts/deploy-testnet.sh logs [service]
./scripts/deploy-testnet.sh destroy
```

## Block Explorer

The block explorer provides a web UI for viewing blockchain data:

```bash
# Start explorer (requires running network)
cd ../explorer
npm install
npm run dev
```

Access at http://localhost:3000

Features:
- Real-time block updates
- Transaction search
- Account balances
- Validator status
- Contract inspection
- Faucet interface

## API Quick Reference

### Health Check
```bash
curl http://localhost:8080/health
```

### Network Stats
```bash
curl http://localhost:8080/stats
```

### Get Block
```bash
curl http://localhost:8080/blocks/123
```

### Get Transaction
```bash
curl http://localhost:8080/transactions/{hash}
```

### Get Account
```bash
curl http://localhost:8080/accounts/{address}
```

### List Validators
```bash
curl http://localhost:8080/validators
```

### Request Faucet (DevNet/TestNet)
```bash
curl -X POST http://localhost:8080/faucet \
  -H "Content-Type: application/json" \
  -d '{"address":"bb1234..."}'
```

## Monitoring

### Prometheus

Access Prometheus at http://localhost:9090

Key metrics:
- `blueblocks_block_height` - Current block height
- `blueblocks_tx_count` - Transaction count
- `blueblocks_validator_count` - Active validators
- `blueblocks_peer_count` - Connected peers

### Grafana

Access Grafana at http://localhost:3000

Default credentials:
- Username: `admin`
- Password: `admin` (or `TESTNET_GRAFANA_PASSWORD` env var)

Pre-configured dashboards:
- Network Overview
- Validator Performance
- Transaction Metrics

## Troubleshooting

### Nodes not syncing

```bash
# Check node logs
docker compose -f docker/docker-compose.testnet.yml logs node-1

# Verify peer connectivity
curl http://localhost:8080/node/peers
```

### Database connection issues

```bash
# Check TimescaleDB status
docker compose -f docker/docker-compose.testnet.yml exec timescaledb pg_isready -U blueblocks

# View database logs
docker compose -f docker/docker-compose.testnet.yml logs timescaledb
```

### Out of memory

Increase Docker memory allocation to at least 4GB for TestNet.

### Port conflicts

Check if ports are already in use:

```bash
lsof -i :8080
lsof -i :5432
```

## Directory Structure

```
deploy/
├── docker/
│   ├── docker-compose.devnet.yml
│   ├── docker-compose.testnet.yml
│   ├── Dockerfile.node
│   ├── Dockerfile.validator
│   ├── Dockerfile.miner
│   ├── Dockerfile.treasury
│   ├── Dockerfile.indexer
│   └── Dockerfile.discovery
├── configs/
│   ├── devnet/
│   │   ├── .env.example
│   │   └── genesis.json
│   └── testnet/
│       ├── .env.example
│       ├── genesis.json
│       ├── init-db.sql
│       ├── prometheus.yml
│       └── grafana/
├── scripts/
│   ├── deploy-devnet.sh
│   └── deploy-testnet.sh
├── kubernetes/          # Coming soon
├── Makefile
└── README.md
```

## Security Notes

- **DevNet/TestNet are for testing only** - Do not use for production
- Default passwords should be changed in production
- TLS should be enabled for all external endpoints
- Treasury requires proper key management in production
- Healthcare validators require NPI verification in production

## Next Steps

1. Deploy DevNet for local development
2. Write and test smart contracts
3. Test healthcare record workflows
4. Deploy TestNet for integration testing
5. Set up monitoring and alerting
6. Proceed to mainnet deployment
