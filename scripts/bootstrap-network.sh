#!/bin/bash
# BlueBlocks Network Bootstrap Script
# ====================================
# Usage: ./bootstrap-network.sh <network> [options]
#   network: devnet | testnet | mainnet

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
NETWORK="${1:-devnet}"
DATA_DIR="${PROJECT_ROOT}/data/${NETWORK}"
CONFIG_DIR="${PROJECT_ROOT}/config"
KEYS_DIR="${DATA_DIR}/keys"

# Network-specific settings
declare -A NETWORK_SETTINGS
NETWORK_SETTINGS[devnet_validators]=1
NETWORK_SETTINGS[devnet_block_time]=1
NETWORK_SETTINGS[devnet_difficulty]=1
NETWORK_SETTINGS[devnet_prefund]=1000000000

NETWORK_SETTINGS[testnet_validators]=4
NETWORK_SETTINGS[testnet_block_time]=5
NETWORK_SETTINGS[testnet_difficulty]=4
NETWORK_SETTINGS[testnet_prefund]=100000000

NETWORK_SETTINGS[mainnet_validators]=7
NETWORK_SETTINGS[mainnet_block_time]=10
NETWORK_SETTINGS[mainnet_difficulty]=6
NETWORK_SETTINGS[mainnet_prefund]=0

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

log_step() {
    echo -e "${CYAN}==>${NC} $1"
}

print_banner() {
    echo ""
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║     BlueBlocks Network Bootstrap                     ║"
    echo "║     Network: ${NETWORK}                                       ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo ""
}

check_prerequisites() {
    log_step "Checking prerequisites..."

    # Check for required binaries
    local required_bins=("bblks" "bblks-validator" "openssl")
    for bin in "${required_bins[@]}"; do
        if ! command -v "$bin" &> /dev/null; then
            if [ "$bin" = "bblks" ] || [ "$bin" = "bblks-validator" ]; then
                log_warn "$bin not found in PATH, attempting to build..."
                cd "$PROJECT_ROOT"
                make build
                export PATH="$PROJECT_ROOT/bin:$PATH"
            else
                log_error "$bin is required but not installed"
            fi
        fi
    done

    log_info "All prerequisites satisfied"
}

create_directories() {
    log_step "Creating directory structure..."

    mkdir -p "$DATA_DIR"/{blocks,state,contracts,logs}
    mkdir -p "$KEYS_DIR"
    mkdir -p "$CONFIG_DIR"

    log_info "Directories created at $DATA_DIR"
}

generate_validator_keys() {
    local num_validators=${NETWORK_SETTINGS[${NETWORK}_validators]}
    log_step "Generating $num_validators validator key(s)..."

    local validators_json="["

    for i in $(seq 1 $num_validators); do
        local key_file="$KEYS_DIR/validator_${i}.json"

        if [ -f "$key_file" ]; then
            log_warn "Validator $i key already exists, skipping"
        else
            log_info "Generating validator $i keypair..."

            # Generate Ed25519 keypair
            bblks wallet create --output "$key_file" 2>/dev/null || {
                # Fallback: generate manually
                openssl genpkey -algorithm ED25519 -out "$KEYS_DIR/validator_${i}.pem" 2>/dev/null
                openssl pkey -in "$KEYS_DIR/validator_${i}.pem" -pubout -out "$KEYS_DIR/validator_${i}.pub" 2>/dev/null

                # Create JSON format
                local priv_hex=$(openssl pkey -in "$KEYS_DIR/validator_${i}.pem" -text -noout 2>/dev/null | grep -A5 "priv:" | tail -4 | tr -d ' \n:')
                local pub_hex=$(openssl pkey -pubin -in "$KEYS_DIR/validator_${i}.pub" -text -noout 2>/dev/null | grep -A3 "pub:" | tail -2 | tr -d ' \n:')

                cat > "$key_file" << EOF
{
    "validator_id": "validator_${i}",
    "public_key": "${pub_hex}",
    "private_key": "${priv_hex}",
    "address": "bb1validator${i}$(echo -n "$pub_hex" | shasum -a 256 | cut -c1-32)"
}
EOF
            }
        fi

        # Read the address from the key file
        local address=$(jq -r '.address // .Address // "unknown"' "$key_file" 2>/dev/null || echo "bb1validator$i")

        if [ $i -gt 1 ]; then
            validators_json+=","
        fi
        validators_json+="{\"address\":\"$address\",\"power\":100,\"name\":\"Validator $i\"}"
    done

    validators_json+="]"
    echo "$validators_json" > "$DATA_DIR/validators.json"

    log_info "Validator keys generated"
}

generate_genesis() {
    log_step "Generating genesis block..."

    local genesis_file="$DATA_DIR/genesis.json"
    local block_time=${NETWORK_SETTINGS[${NETWORK}_block_time]}
    local difficulty=${NETWORK_SETTINGS[${NETWORK}_difficulty]}
    local prefund=${NETWORK_SETTINGS[${NETWORK}_prefund]}

    # Read validators
    local validators=$(cat "$DATA_DIR/validators.json")

    # Treasury address (first validator or dedicated)
    local treasury_address=$(echo "$validators" | jq -r '.[0].address')

    # Pre-funded accounts for devnet/testnet
    local prefunded_accounts="[]"
    if [ "$prefund" -gt 0 ]; then
        prefunded_accounts="[
            {\"address\": \"$treasury_address\", \"balance\": $prefund},
            {\"address\": \"bb1devaccount1\", \"balance\": 10000000},
            {\"address\": \"bb1devaccount2\", \"balance\": 10000000},
            {\"address\": \"bb1testfaucet\", \"balance\": 100000000}
        ]"
    fi

    cat > "$genesis_file" << EOF
{
    "network": "$NETWORK",
    "chain_id": "blueblocks-${NETWORK}",
    "genesis_time": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "consensus": {
        "type": "tendermint",
        "block_time_seconds": $block_time,
        "max_block_size": 1048576,
        "max_tx_per_block": 1000
    },
    "mining": {
        "enabled": true,
        "difficulty": $difficulty,
        "block_reward": 50,
        "halving_interval": 210000
    },
    "validators": $validators,
    "accounts": $prefunded_accounts,
    "treasury": {
        "address": "$treasury_address",
        "initial_supply": 1000000000,
        "max_supply": 10000000000
    },
    "healthcare": {
        "hipaa_compliant": true,
        "phi_encryption": "AES-256-GCM",
        "audit_retention_days": 2555
    },
    "app_state": {
        "contracts": [],
        "health_records": []
    }
}
EOF

    log_info "Genesis block created: $genesis_file"
}

generate_config() {
    log_step "Generating node configuration..."

    local config_file="$CONFIG_DIR/${NETWORK}.yaml"
    local block_time=${NETWORK_SETTINGS[${NETWORK}_block_time]}

    cat > "$config_file" << EOF
# BlueBlocks Node Configuration
# Network: $NETWORK
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

network: $NETWORK
chain_id: blueblocks-${NETWORK}

# Node settings
node:
  data_dir: $DATA_DIR
  log_level: info
  log_format: json

# RPC settings
rpc:
  enabled: true
  host: 0.0.0.0
  port: 8080
  cors_allowed_origins:
    - "*"
  max_connections: 100
  timeout: 30s

# P2P settings
p2p:
  enabled: true
  host: 0.0.0.0
  port: 26656
  max_peers: 50
  seeds: []
  persistent_peers: []

# Consensus settings
consensus:
  block_time: ${block_time}s
  timeout_propose: 3s
  timeout_prevote: 1s
  timeout_precommit: 1s
  timeout_commit: ${block_time}s

# Mining settings
mining:
  enabled: $([ "$NETWORK" = "devnet" ] && echo "true" || echo "false")
  workers: 2
  coinbase: ""

# Database settings
database:
  backend: leveldb
  path: \${data_dir}/db

# Metrics settings
metrics:
  enabled: true
  prometheus_port: 9090

# Healthcare settings
healthcare:
  hipaa_audit: true
  phi_encryption: true
  audit_log_path: \${data_dir}/logs/hipaa_audit.log
EOF

    log_info "Configuration created: $config_file"
}

generate_systemd_service() {
    log_step "Generating systemd service files..."

    local service_file="$PROJECT_ROOT/systemd/blueblocks-node@.service"
    mkdir -p "$PROJECT_ROOT/systemd"

    cat > "$service_file" << EOF
[Unit]
Description=BlueBlocks Healthcare Blockchain Node (%i)
Documentation=https://github.com/afterdarksys/blueblocks
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=blueblocks
Group=blueblocks
ExecStart=/usr/local/bin/bblks server start \\
    --config=/etc/blueblocks/%i.yaml \\
    --data-dir=/var/lib/blueblocks/%i
ExecReload=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=5
LimitNOFILE=65535

# Security settings
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
ReadWritePaths=/var/lib/blueblocks/%i /var/log/blueblocks

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=blueblocks-%i

[Install]
WantedBy=multi-user.target
EOF

    log_info "Systemd service created: $service_file"
}

print_summary() {
    echo ""
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║     Network Bootstrap Complete!                      ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo ""
    echo -e "${GREEN}Network:${NC} $NETWORK"
    echo -e "${GREEN}Data Directory:${NC} $DATA_DIR"
    echo -e "${GREEN}Genesis File:${NC} $DATA_DIR/genesis.json"
    echo -e "${GREEN}Config File:${NC} $CONFIG_DIR/${NETWORK}.yaml"
    echo -e "${GREEN}Validators:${NC} ${NETWORK_SETTINGS[${NETWORK}_validators]}"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo ""

    case "$NETWORK" in
        devnet)
            echo "  1. Start the node:"
            echo "     make docker-compose-up"
            echo "     # or"
            echo "     bblks server start --config config/${NETWORK}.yaml"
            echo ""
            echo "  2. Check node status:"
            echo "     curl http://localhost:8080/health"
            echo ""
            echo "  3. Start mining:"
            echo "     bblks mining start"
            ;;
        testnet)
            echo "  1. Distribute validator keys to validator operators"
            echo "     Keys are in: $KEYS_DIR/"
            echo ""
            echo "  2. Each validator should start with:"
            echo "     bblks-validator --key validator_N.json --config config/${NETWORK}.yaml"
            echo ""
            echo "  3. Configure DNS/discovery for peer connections"
            ;;
        mainnet)
            echo "  ${RED}MAINNET BOOTSTRAP - HANDLE WITH CARE${NC}"
            echo ""
            echo "  1. Securely distribute validator keys"
            echo "  2. Configure hardware security modules (HSMs)"
            echo "  3. Set up monitoring and alerting"
            echo "  4. Review DISASTER_RECOVERY.md"
            echo "  5. Coordinate validator launch"
            ;;
    esac

    echo ""
}

# Main execution
main() {
    # Validate network
    case "$NETWORK" in
        devnet|testnet|mainnet)
            ;;
        *)
            log_error "Invalid network: $NETWORK. Must be devnet, testnet, or mainnet"
            ;;
    esac

    print_banner
    check_prerequisites
    create_directories
    generate_validator_keys
    generate_genesis
    generate_config
    generate_systemd_service
    print_summary
}

# Run main
main "$@"
