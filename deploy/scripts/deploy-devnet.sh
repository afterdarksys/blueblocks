#!/bin/bash
# BlueBlocks DevNet Deployment Script
# Deploys a local development network for testing

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$DEPLOY_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NETWORK="devnet"
COMPOSE_FILE="$DEPLOY_DIR/docker/docker-compose.devnet.yml"
ENV_FILE="$DEPLOY_DIR/configs/devnet/.env"
ENV_EXAMPLE="$DEPLOY_DIR/configs/devnet/.env.example"

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
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                                                          ║"
    echo "║           BlueBlocks DevNet Deployment                   ║"
    echo "║                                                          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_dependencies() {
    log_info "Checking dependencies..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi

    log_success "All dependencies satisfied"
}

setup_env() {
    log_info "Setting up environment..."

    if [[ ! -f "$ENV_FILE" ]]; then
        if [[ -f "$ENV_EXAMPLE" ]]; then
            cp "$ENV_EXAMPLE" "$ENV_FILE"
            log_info "Created .env file from example. Please review and update if needed."
        else
            log_warn "No .env.example found. Using default configuration."
        fi
    else
        log_info "Using existing .env file"
    fi
}

build_images() {
    log_info "Building Docker images..."

    cd "$PROJECT_ROOT"

    docker compose -f "$COMPOSE_FILE" build --parallel

    log_success "Docker images built successfully"
}

start_network() {
    log_info "Starting DevNet..."

    cd "$PROJECT_ROOT"

    # Start services
    docker compose -f "$COMPOSE_FILE" up -d

    log_info "Waiting for services to be healthy..."
    sleep 10

    # Check health
    local retries=30
    local count=0
    while [[ $count -lt $retries ]]; do
        if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
            log_success "DevNet is healthy!"
            break
        fi
        count=$((count + 1))
        echo -n "."
        sleep 2
    done

    if [[ $count -eq $retries ]]; then
        log_error "DevNet failed to become healthy. Check logs with: docker compose -f $COMPOSE_FILE logs"
        exit 1
    fi

    echo ""
}

stop_network() {
    log_info "Stopping DevNet..."

    cd "$PROJECT_ROOT"
    docker compose -f "$COMPOSE_FILE" down

    log_success "DevNet stopped"
}

destroy_network() {
    log_warn "This will destroy all DevNet data. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "Destroying DevNet..."

        cd "$PROJECT_ROOT"
        docker compose -f "$COMPOSE_FILE" down -v --remove-orphans

        log_success "DevNet destroyed"
    else
        log_info "Aborted"
    fi
}

show_status() {
    log_info "DevNet Status:"
    echo ""

    cd "$PROJECT_ROOT"
    docker compose -f "$COMPOSE_FILE" ps

    echo ""
    log_info "Endpoints:"
    echo "  Node API:     http://localhost:8080"
    echo "  Validator:    http://localhost:7777"
    echo "  Health Check: http://localhost:8080/health"
    echo ""

    # Show node info if available
    if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
        log_info "Node Health:"
        curl -s http://localhost:8080/health | jq . 2>/dev/null || curl -s http://localhost:8080/health
        echo ""
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

print_usage() {
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  start       Start the DevNet"
    echo "  stop        Stop the DevNet"
    echo "  restart     Restart the DevNet"
    echo "  status      Show DevNet status"
    echo "  logs [svc]  Show logs (optionally for specific service)"
    echo "  build       Build Docker images"
    echo "  destroy     Destroy DevNet and all data"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start              # Start DevNet"
    echo "  $0 logs node          # Show node logs"
    echo "  $0 status             # Check status"
}

# Main
print_banner

case "${1:-help}" in
    start)
        check_dependencies
        setup_env
        build_images
        start_network
        show_status
        ;;
    stop)
        stop_network
        ;;
    restart)
        stop_network
        start_network
        show_status
        ;;
    status)
        show_status
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
