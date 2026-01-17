#!/bin/bash
# BlueBlocks TestNet Deployment Script
# Deploys a multi-node test network

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$DEPLOY_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
NETWORK="testnet"
COMPOSE_FILE="$DEPLOY_DIR/docker/docker-compose.testnet.yml"
ENV_FILE="$DEPLOY_DIR/configs/testnet/.env"
ENV_EXAMPLE="$DEPLOY_DIR/configs/testnet/.env.example"

# Optional profiles
MONITORING_ENABLED="${MONITORING_ENABLED:-false}"
TREASURY_ENABLED="${TREASURY_ENABLED:-false}"

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                                                          ║"
    echo "║           BlueBlocks TestNet Deployment                  ║"
    echo "║                                                          ║"
    echo "║  Multi-node test network with validators & indexer       ║"
    echo "║                                                          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_dependencies() {
    log_info "Checking dependencies..."

    local missing=()

    if ! command -v docker &> /dev/null; then
        missing+=("docker")
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        missing+=("docker-compose")
    fi

    if ! command -v jq &> /dev/null; then
        log_warn "jq is not installed. Some status output may be limited."
    fi

    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing dependencies: ${missing[*]}"
        exit 1
    fi

    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi

    # Check available resources
    local mem_gb=$(docker info --format '{{.MemTotal}}' | awk '{print int($1/1024/1024/1024)}')
    if [[ $mem_gb -lt 4 ]]; then
        log_warn "Docker has less than 4GB RAM allocated. TestNet may experience issues."
    fi

    log_success "All dependencies satisfied"
}

setup_env() {
    log_info "Setting up environment..."

    if [[ ! -f "$ENV_FILE" ]]; then
        if [[ -f "$ENV_EXAMPLE" ]]; then
            cp "$ENV_EXAMPLE" "$ENV_FILE"
            log_warn "Created .env file from example."
            log_warn "Please review $ENV_FILE and update sensitive values!"
            echo ""
            echo "Required configuration:"
            echo "  - TESTNET_DB_PASSWORD: Database password"
            echo "  - TESTNET_GRAFANA_PASSWORD: Grafana admin password (if monitoring enabled)"
            echo "  - TESTNET_ETH_RPC: Ethereum RPC URL (if treasury enabled)"
            echo ""
            read -p "Press Enter to continue or Ctrl+C to abort..."
        else
            log_error "No .env.example found. Cannot continue."
            exit 1
        fi
    else
        log_info "Using existing .env file"
    fi

    # Source env file
    set -a
    source "$ENV_FILE"
    set +a
}

generate_validator_keys() {
    log_info "Generating validator keys..."

    local keys_dir="$DEPLOY_DIR/configs/testnet/keys"
    mkdir -p "$keys_dir"

    # Check if keys already exist
    if [[ -f "$keys_dir/validator-1.json" ]]; then
        log_info "Validator keys already exist. Skipping generation."
        return
    fi

    # Generate keys using the CLI tool if available
    if [[ -x "$PROJECT_ROOT/preapproved-implementations/bin/bblks" ]]; then
        for i in 1 2 3; do
            "$PROJECT_ROOT/preapproved-implementations/bin/bblks" wallet create \
                --output "$keys_dir/validator-$i.json" \
                --label "TestNet Validator $i" 2>/dev/null || true
        done
        log_success "Validator keys generated"
    else
        log_warn "bblks CLI not found. Validator keys will be auto-generated on first start."
    fi
}

build_images() {
    log_info "Building Docker images..."

    cd "$PROJECT_ROOT"

    docker compose -f "$COMPOSE_FILE" build --parallel

    log_success "Docker images built successfully"
}

start_network() {
    local profiles=""

    if [[ "$MONITORING_ENABLED" == "true" ]]; then
        profiles="$profiles --profile monitoring"
        log_info "Monitoring enabled (Prometheus + Grafana)"
    fi

    if [[ "$TREASURY_ENABLED" == "true" ]]; then
        profiles="$profiles --profile treasury"
        log_info "Treasury bridge enabled"
    fi

    log_info "Starting TestNet..."

    cd "$PROJECT_ROOT"

    # Start core services first
    docker compose -f "$COMPOSE_FILE" up -d node-1

    log_info "Waiting for seed node to be healthy..."
    wait_for_health "http://localhost:8080/health" 60

    # Start remaining services
    docker compose -f "$COMPOSE_FILE" $profiles up -d

    log_info "Waiting for all services to be healthy..."
    sleep 15

    # Verify all nodes
    local nodes=("8080" "8081" "8082")
    for port in "${nodes[@]}"; do
        if curl -sf "http://localhost:$port/health" > /dev/null 2>&1; then
            log_success "Node on port $port is healthy"
        else
            log_warn "Node on port $port may still be starting..."
        fi
    done

    log_success "TestNet started successfully!"
}

wait_for_health() {
    local url="$1"
    local timeout="${2:-30}"
    local count=0

    while [[ $count -lt $timeout ]]; do
        if curl -sf "$url" > /dev/null 2>&1; then
            return 0
        fi
        count=$((count + 1))
        echo -n "."
        sleep 1
    done

    echo ""
    return 1
}

stop_network() {
    log_info "Stopping TestNet..."

    cd "$PROJECT_ROOT"
    docker compose -f "$COMPOSE_FILE" --profile monitoring --profile treasury down

    log_success "TestNet stopped"
}

destroy_network() {
    log_warn "This will destroy ALL TestNet data including:"
    echo "  - Blockchain state"
    echo "  - Validator keys"
    echo "  - Database"
    echo "  - Monitoring data"
    echo ""
    log_warn "Are you sure? Type 'destroy' to confirm:"
    read -r response

    if [[ "$response" == "destroy" ]]; then
        log_info "Destroying TestNet..."

        cd "$PROJECT_ROOT"
        docker compose -f "$COMPOSE_FILE" --profile monitoring --profile treasury down -v --remove-orphans

        # Remove generated keys
        rm -rf "$DEPLOY_DIR/configs/testnet/keys"

        log_success "TestNet destroyed"
    else
        log_info "Aborted"
    fi
}

show_status() {
    echo ""
    log_info "TestNet Status:"
    echo ""

    cd "$PROJECT_ROOT"
    docker compose -f "$COMPOSE_FILE" --profile monitoring --profile treasury ps

    echo ""
    log_info "Endpoints:"
    echo ""
    echo "  Nodes:"
    echo "    Node 1:          http://localhost:8080"
    echo "    Node 2:          http://localhost:8081"
    echo "    Node 3:          http://localhost:8082"
    echo ""
    echo "  Validators:"
    echo "    Validator 1:     http://localhost:7777"
    echo "    Validator 2:     http://localhost:7778"
    echo "    Validator 3:     http://localhost:7779"
    echo "    Healthcare Val:  http://localhost:7780"
    echo ""
    echo "  Database:"
    echo "    TimescaleDB:     localhost:5432"
    echo ""

    if [[ "$MONITORING_ENABLED" == "true" ]]; then
        echo "  Monitoring:"
        echo "    Prometheus:      http://localhost:9090"
        echo "    Grafana:         http://localhost:3000"
        echo ""
    fi

    # Network stats
    echo ""
    log_info "Network Stats:"
    if curl -sf http://localhost:8080/stats > /dev/null 2>&1; then
        curl -s http://localhost:8080/stats | jq . 2>/dev/null || curl -s http://localhost:8080/stats
    else
        echo "  Node API not responding"
    fi
    echo ""

    # Validator status
    log_info "Validators:"
    if curl -sf http://localhost:8080/validators > /dev/null 2>&1; then
        curl -s http://localhost:8080/validators | jq '.validators[] | {address, type, status, stake}' 2>/dev/null || \
            curl -s http://localhost:8080/validators
    else
        echo "  Validator API not responding"
    fi
}

show_logs() {
    local service="${1:-}"

    cd "$PROJECT_ROOT"

    if [[ -n "$service" ]]; then
        docker compose -f "$COMPOSE_FILE" logs -f "$service"
    else
        docker compose -f "$COMPOSE_FILE" logs -f
    fi
}

run_health_check() {
    log_info "Running comprehensive health check..."
    echo ""

    local all_healthy=true

    # Check nodes
    local nodes=("node-1:8080" "node-2:8081" "node-3:8082")
    for node in "${nodes[@]}"; do
        local name="${node%:*}"
        local port="${node#*:}"
        if curl -sf "http://localhost:$port/health" > /dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} $name is healthy"
        else
            echo -e "  ${RED}✗${NC} $name is unhealthy"
            all_healthy=false
        fi
    done

    # Check validators
    local validators=("7777" "7778" "7779" "7780")
    for port in "${validators[@]}"; do
        if curl -sf "http://localhost:$port/status" > /dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} Validator on $port is healthy"
        else
            echo -e "  ${YELLOW}?${NC} Validator on $port status unknown"
        fi
    done

    # Check database
    if docker compose -f "$COMPOSE_FILE" exec -T timescaledb pg_isready -U blueblocks > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} TimescaleDB is healthy"
    else
        echo -e "  ${RED}✗${NC} TimescaleDB is unhealthy"
        all_healthy=false
    fi

    echo ""
    if $all_healthy; then
        log_success "All core services are healthy"
    else
        log_warn "Some services are unhealthy. Check logs for details."
    fi
}

print_usage() {
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  start         Start the TestNet"
    echo "  stop          Stop the TestNet"
    echo "  restart       Restart the TestNet"
    echo "  status        Show TestNet status and endpoints"
    echo "  health        Run comprehensive health check"
    echo "  logs [svc]    Show logs (optionally for specific service)"
    echo "  build         Build Docker images"
    echo "  destroy       Destroy TestNet and all data"
    echo "  help          Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  MONITORING_ENABLED=true   Enable Prometheus & Grafana"
    echo "  TREASURY_ENABLED=true     Enable Ethereum treasury bridge"
    echo ""
    echo "Examples:"
    echo "  $0 start                          # Start basic TestNet"
    echo "  MONITORING_ENABLED=true $0 start  # Start with monitoring"
    echo "  $0 logs node-1                    # Show node-1 logs"
    echo "  $0 status                         # Check status"
}

# Main
print_banner

case "${1:-help}" in
    start)
        check_dependencies
        setup_env
        generate_validator_keys
        build_images
        start_network
        show_status
        ;;
    stop)
        stop_network
        ;;
    restart)
        stop_network
        setup_env
        start_network
        show_status
        ;;
    status)
        show_status
        ;;
    health)
        run_health_check
        ;;
    logs)
        show_logs "${2:-}"
        ;;
    build)
        check_dependencies
        build_images
        ;;
    destroy)
        destroy_network
        ;;
    help|--help|-h)
        print_usage
        ;;
    *)
        log_error "Unknown command: $1"
        print_usage
        exit 1
        ;;
esac
