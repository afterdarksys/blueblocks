# BlueBlocks Healthcare Blockchain - Build System
# ==============================================

.PHONY: all build test clean lint fmt vet coverage install dev-deps \
        docker docker-build docker-push docker-compose-up docker-compose-down \
        network-devnet network-testnet network-mainnet \
        release release-snapshot help

# Version info
VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT  ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
DATE    ?= $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")

# Build settings
GOOS    ?= $(shell go env GOOS)
GOARCH  ?= $(shell go env GOARCH)
LDFLAGS := -ldflags "-X github.com/blueblocks/preapproved-implementations/lib/version.Version=$(VERSION) \
                     -X github.com/blueblocks/preapproved-implementations/lib/version.Commit=$(COMMIT) \
                     -X github.com/blueblocks/preapproved-implementations/lib/version.Date=$(DATE)"

# Directories
BIN_DIR     := ./bin
CMD_DIR     := ./cmd
LIB_DIR     := ./lib
DIST_DIR    := ./dist
COVERAGE_DIR := ./coverage

# Binaries to build
BINARIES := bblks bblks-validator bblks-treasury blueblocks-miner discovery-service afterblock afterwallet

# Docker settings
DOCKER_REGISTRY ?= ghcr.io/afterdarksys
DOCKER_IMAGE    := blueblocks
DOCKER_TAG      ?= $(VERSION)

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m # No Color

# ==============================================================================
# DEFAULT TARGET
# ==============================================================================

all: build

# ==============================================================================
# BUILD TARGETS
# ==============================================================================

## build: Build all binaries
build: $(addprefix $(BIN_DIR)/, $(BINARIES))
	@echo "$(GREEN)Build complete!$(NC)"

$(BIN_DIR)/%: $(CMD_DIR)/%
	@echo "$(YELLOW)Building $*...$(NC)"
	@mkdir -p $(BIN_DIR)
	@go build $(LDFLAGS) -o $@ ./$<

## build-all: Build for all supported platforms
build-all:
	@echo "$(YELLOW)Building for all platforms...$(NC)"
	@mkdir -p $(DIST_DIR)
	@GOOS=linux GOARCH=amd64 go build $(LDFLAGS) -o $(DIST_DIR)/bblks-linux-amd64 ./cmd/bblks
	@GOOS=linux GOARCH=arm64 go build $(LDFLAGS) -o $(DIST_DIR)/bblks-linux-arm64 ./cmd/bblks
	@GOOS=darwin GOARCH=amd64 go build $(LDFLAGS) -o $(DIST_DIR)/bblks-darwin-amd64 ./cmd/bblks
	@GOOS=darwin GOARCH=arm64 go build $(LDFLAGS) -o $(DIST_DIR)/bblks-darwin-arm64 ./cmd/bblks
	@GOOS=windows GOARCH=amd64 go build $(LDFLAGS) -o $(DIST_DIR)/bblks-windows-amd64.exe ./cmd/bblks
	@echo "$(GREEN)Cross-platform build complete!$(NC)"

## install: Install binaries to GOPATH/bin
install:
	@echo "$(YELLOW)Installing binaries...$(NC)"
	@go install $(LDFLAGS) ./cmd/bblks
	@go install $(LDFLAGS) ./cmd/bblks-validator
	@go install $(LDFLAGS) ./cmd/bblks-treasury
	@echo "$(GREEN)Installation complete!$(NC)"

# ==============================================================================
# TEST TARGETS
# ==============================================================================

## test: Run all tests
test:
	@echo "$(YELLOW)Running tests...$(NC)"
	@go test -race -v ./...

## test-short: Run tests without race detector (faster)
test-short:
	@echo "$(YELLOW)Running tests (short mode)...$(NC)"
	@go test -v ./...

## test-unit: Run unit tests only
test-unit:
	@echo "$(YELLOW)Running unit tests...$(NC)"
	@go test -v -short ./lib/...

## test-integration: Run integration tests
test-integration:
	@echo "$(YELLOW)Running integration tests...$(NC)"
	@go test -v -tags=integration ./tests/integration/...

## coverage: Generate test coverage report
coverage:
	@echo "$(YELLOW)Generating coverage report...$(NC)"
	@mkdir -p $(COVERAGE_DIR)
	@go test -coverprofile=$(COVERAGE_DIR)/coverage.out -covermode=atomic ./...
	@go tool cover -html=$(COVERAGE_DIR)/coverage.out -o $(COVERAGE_DIR)/coverage.html
	@go tool cover -func=$(COVERAGE_DIR)/coverage.out | tail -1
	@echo "$(GREEN)Coverage report: $(COVERAGE_DIR)/coverage.html$(NC)"

## benchmark: Run benchmarks
benchmark:
	@echo "$(YELLOW)Running benchmarks...$(NC)"
	@go test -bench=. -benchmem ./...

# ==============================================================================
# CODE QUALITY TARGETS
# ==============================================================================

## lint: Run linter
lint:
	@echo "$(YELLOW)Running linter...$(NC)"
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run ./...; \
	else \
		echo "$(RED)golangci-lint not installed. Run: make dev-deps$(NC)"; \
		exit 1; \
	fi

## fmt: Format code
fmt:
	@echo "$(YELLOW)Formatting code...$(NC)"
	@go fmt ./...
	@echo "$(GREEN)Code formatted!$(NC)"

## vet: Run go vet
vet:
	@echo "$(YELLOW)Running go vet...$(NC)"
	@go vet ./...

## check: Run all code quality checks
check: fmt vet lint test
	@echo "$(GREEN)All checks passed!$(NC)"

# ==============================================================================
# DOCKER TARGETS
# ==============================================================================

## docker-build: Build Docker image
docker-build:
	@echo "$(YELLOW)Building Docker image...$(NC)"
	@docker build -t $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(DOCKER_TAG) .
	@docker tag $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(DOCKER_TAG) $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):latest
	@echo "$(GREEN)Docker image built: $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(DOCKER_TAG)$(NC)"

## docker-push: Push Docker image to registry
docker-push: docker-build
	@echo "$(YELLOW)Pushing Docker image...$(NC)"
	@docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(DOCKER_TAG)
	@docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):latest
	@echo "$(GREEN)Docker image pushed!$(NC)"

## docker-compose-up: Start local development environment
docker-compose-up:
	@echo "$(YELLOW)Starting development environment...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)Development environment started!$(NC)"
	@echo "  Node RPC:    http://localhost:8080"
	@echo "  Explorer:    http://localhost:3000"
	@echo "  Prometheus:  http://localhost:9090"
	@echo "  Grafana:     http://localhost:3001"

## docker-compose-down: Stop local development environment
docker-compose-down:
	@echo "$(YELLOW)Stopping development environment...$(NC)"
	@docker-compose down
	@echo "$(GREEN)Development environment stopped!$(NC)"

## docker-compose-logs: View logs from development environment
docker-compose-logs:
	@docker-compose logs -f

# ==============================================================================
# NETWORK BOOTSTRAP TARGETS
# ==============================================================================

## network-devnet: Bootstrap a local development network
network-devnet:
	@echo "$(YELLOW)Bootstrapping devnet...$(NC)"
	@./scripts/bootstrap-network.sh devnet
	@echo "$(GREEN)Devnet is ready!$(NC)"

## network-testnet: Bootstrap testnet validators
network-testnet:
	@echo "$(YELLOW)Bootstrapping testnet...$(NC)"
	@./scripts/bootstrap-network.sh testnet
	@echo "$(GREEN)Testnet bootstrap complete!$(NC)"

## network-mainnet: Bootstrap mainnet (requires confirmation)
network-mainnet:
	@echo "$(RED)WARNING: You are about to bootstrap MAINNET$(NC)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ]
	@./scripts/bootstrap-network.sh mainnet
	@echo "$(GREEN)Mainnet bootstrap complete!$(NC)"

# ==============================================================================
# RELEASE TARGETS
# ==============================================================================

## release: Create a new release (requires VERSION)
release:
	@echo "$(YELLOW)Creating release $(VERSION)...$(NC)"
	@git tag -a v$(VERSION) -m "Release v$(VERSION)"
	@git push origin v$(VERSION)
	@echo "$(GREEN)Release v$(VERSION) created!$(NC)"

## release-snapshot: Create a snapshot release (no tag)
release-snapshot: build-all
	@echo "$(YELLOW)Creating snapshot release...$(NC)"
	@mkdir -p $(DIST_DIR)
	@cd $(DIST_DIR) && for f in bblks-*; do \
		if [ -f "$$f" ]; then \
			tar -czvf "$$f.tar.gz" "$$f"; \
		fi \
	done
	@echo "$(GREEN)Snapshot release created in $(DIST_DIR)$(NC)"

# ==============================================================================
# DEVELOPMENT TARGETS
# ==============================================================================

## dev-deps: Install development dependencies
dev-deps:
	@echo "$(YELLOW)Installing development dependencies...$(NC)"
	@go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	@go install github.com/goreleaser/goreleaser@latest
	@echo "$(GREEN)Development dependencies installed!$(NC)"

## generate: Run go generate
generate:
	@echo "$(YELLOW)Running go generate...$(NC)"
	@go generate ./...

## mod-tidy: Tidy go modules
mod-tidy:
	@echo "$(YELLOW)Tidying go modules...$(NC)"
	@go mod tidy

## mod-download: Download go modules
mod-download:
	@echo "$(YELLOW)Downloading go modules...$(NC)"
	@go mod download

# ==============================================================================
# CLEANUP TARGETS
# ==============================================================================

## clean: Clean build artifacts
clean:
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	@rm -rf $(BIN_DIR)
	@rm -rf $(DIST_DIR)
	@rm -rf $(COVERAGE_DIR)
	@go clean -cache
	@echo "$(GREEN)Clean complete!$(NC)"

## clean-all: Clean everything including dependencies
clean-all: clean
	@echo "$(YELLOW)Cleaning all...$(NC)"
	@go clean -modcache
	@echo "$(GREEN)Full clean complete!$(NC)"

# ==============================================================================
# DATABASE TARGETS
# ==============================================================================

## db-init: Initialize database
db-init:
	@echo "$(YELLOW)Initializing database...$(NC)"
	@./scripts/db-init.sh
	@echo "$(GREEN)Database initialized!$(NC)"

## db-migrate: Run database migrations
db-migrate:
	@echo "$(YELLOW)Running database migrations...$(NC)"
	@./scripts/db-migrate.sh up
	@echo "$(GREEN)Migrations complete!$(NC)"

## db-rollback: Rollback last database migration
db-rollback:
	@echo "$(YELLOW)Rolling back last migration...$(NC)"
	@./scripts/db-migrate.sh down 1
	@echo "$(GREEN)Rollback complete!$(NC)"

# ==============================================================================
# HELP TARGET
# ==============================================================================

## help: Show this help message
help:
	@echo ""
	@echo "$(GREEN)BlueBlocks Healthcare Blockchain$(NC)"
	@echo "=================================="
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "$(YELLOW)Build Targets:$(NC)"
	@grep -E '^## ' Makefile | grep -E 'build|install' | sed 's/## /  /' | sed 's/: /\t/'
	@echo ""
	@echo "$(YELLOW)Test Targets:$(NC)"
	@grep -E '^## ' Makefile | grep -E 'test|coverage|benchmark' | sed 's/## /  /' | sed 's/: /\t/'
	@echo ""
	@echo "$(YELLOW)Code Quality:$(NC)"
	@grep -E '^## ' Makefile | grep -E 'lint|fmt|vet|check' | sed 's/## /  /' | sed 's/: /\t/'
	@echo ""
	@echo "$(YELLOW)Docker:$(NC)"
	@grep -E '^## ' Makefile | grep -E 'docker' | sed 's/## /  /' | sed 's/: /\t/'
	@echo ""
	@echo "$(YELLOW)Network:$(NC)"
	@grep -E '^## ' Makefile | grep -E 'network' | sed 's/## /  /' | sed 's/: /\t/'
	@echo ""
	@echo "$(YELLOW)Release:$(NC)"
	@grep -E '^## ' Makefile | grep -E 'release' | sed 's/## /  /' | sed 's/: /\t/'
	@echo ""
	@echo "$(YELLOW)Other:$(NC)"
	@grep -E '^## ' Makefile | grep -E 'clean|dev-deps|generate|mod|db|help' | sed 's/## /  /' | sed 's/: /\t/'
	@echo ""
