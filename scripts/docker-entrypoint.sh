#!/bin/bash
# BlueBlocks Docker Entrypoint Script
# ====================================

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default values
BLUEBLOCKS_DATA_DIR="${BLUEBLOCKS_DATA_DIR:-/app/data}"
BLUEBLOCKS_CONFIG_DIR="${BLUEBLOCKS_CONFIG_DIR:-/app/config}"
BLUEBLOCKS_KEYS_DIR="${BLUEBLOCKS_KEYS_DIR:-/app/keys}"
BLUEBLOCKS_NETWORK="${BLUEBLOCKS_NETWORK:-devnet}"

# Initialize data directories
init_directories() {
    log_info "Initializing directories..."
    mkdir -p "${BLUEBLOCKS_DATA_DIR}"
    mkdir -p "${BLUEBLOCKS_CONFIG_DIR}"
    mkdir -p "${BLUEBLOCKS_KEYS_DIR}"
    mkdir -p "${BLUEBLOCKS_DATA_DIR}/blocks"
    mkdir -p "${BLUEBLOCKS_DATA_DIR}/state"
    mkdir -p "${BLUEBLOCKS_DATA_DIR}/contracts"
}

# Initialize genesis if not exists
init_genesis() {
    GENESIS_FILE="${BLUEBLOCKS_DATA_DIR}/genesis.json"

    if [ ! -f "${GENESIS_FILE}" ]; then
        log_info "Initializing genesis for ${BLUEBLOCKS_NETWORK}..."

        case "${BLUEBLOCKS_NETWORK}" in
            mainnet)
                cp "${BLUEBLOCKS_CONFIG_DIR}/genesis.mainnet.json" "${GENESIS_FILE}" 2>/dev/null || \
                    log_warn "No mainnet genesis found, using default"
                ;;
            testnet)
                cp "${BLUEBLOCKS_CONFIG_DIR}/genesis.testnet.json" "${GENESIS_FILE}" 2>/dev/null || \
                    log_warn "No testnet genesis found, using default"
                ;;
            devnet|*)
                # Generate devnet genesis with pre-funded accounts
                if command -v bblks &> /dev/null; then
                    bblks genesis init --network devnet --output "${GENESIS_FILE}" 2>/dev/null || \
                        log_warn "Failed to generate genesis, node will create default"
                fi
                ;;
        esac
    else
        log_info "Genesis file exists, skipping initialization"
    fi
}

# Initialize keypair if not exists
init_keypair() {
    KEYPAIR_FILE="${BLUEBLOCKS_KEYS_DIR}/node.json"

    if [ ! -f "${KEYPAIR_FILE}" ]; then
        log_info "Generating node keypair..."
        if command -v bblks &> /dev/null; then
            bblks wallet create --output "${KEYPAIR_FILE}" 2>/dev/null || \
                log_warn "Failed to generate keypair, node will create default"
        fi
    else
        log_info "Node keypair exists, skipping generation"
    fi
}

# Wait for dependencies
wait_for_deps() {
    if [ -n "${POSTGRES_HOST}" ]; then
        log_info "Waiting for PostgreSQL..."
        while ! nc -z "${POSTGRES_HOST}" "${POSTGRES_PORT:-5432}"; do
            sleep 1
        done
        log_info "PostgreSQL is available"
    fi

    if [ -n "${REDIS_HOST}" ]; then
        log_info "Waiting for Redis..."
        while ! nc -z "${REDIS_HOST}" "${REDIS_PORT:-6379}"; do
            sleep 1
        done
        log_info "Redis is available"
    fi
}

# Print startup banner
print_banner() {
    echo ""
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║                                                      ║"
    echo "║     ██████╗ ██╗     ██╗   ██╗███████╗               ║"
    echo "║     ██╔══██╗██║     ██║   ██║██╔════╝               ║"
    echo "║     ██████╔╝██║     ██║   ██║█████╗                 ║"
    echo "║     ██╔══██╗██║     ██║   ██║██╔══╝                 ║"
    echo "║     ██████╔╝███████╗╚██████╔╝███████╗               ║"
    echo "║     ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝               ║"
    echo "║                                                      ║"
    echo "║          BLUEBLOCKS HEALTHCARE BLOCKCHAIN            ║"
    echo "║                                                      ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo ""
    log_info "Network:    ${BLUEBLOCKS_NETWORK}"
    log_info "Data Dir:   ${BLUEBLOCKS_DATA_DIR}"
    log_info "Config Dir: ${BLUEBLOCKS_CONFIG_DIR}"
    log_info "Keys Dir:   ${BLUEBLOCKS_KEYS_DIR}"
    echo ""
}

# Main entrypoint
main() {
    print_banner
    init_directories
    init_genesis
    init_keypair
    wait_for_deps

    log_info "Starting BlueBlocks..."
    log_info "Command: $@"
    echo ""

    # Execute the command
    exec "$@"
}

# Run main with all arguments
main "$@"
