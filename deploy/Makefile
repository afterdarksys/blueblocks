# BlueBlocks Deployment Makefile
# Simplifies common deployment operations

.PHONY: help devnet testnet build clean logs status

SHELL := /bin/bash
DOCKER_COMPOSE := docker compose

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

help: ## Show this help
	@echo ""
	@echo "BlueBlocks Deployment Commands"
	@echo "=============================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(BLUE)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ============================================
# BUILD COMMANDS
# ============================================

build: ## Build all Docker images
	@echo -e "$(BLUE)Building all Docker images...$(NC)"
	cd .. && $(DOCKER_COMPOSE) -f deploy/docker/docker-compose.devnet.yml build --parallel
	cd .. && $(DOCKER_COMPOSE) -f deploy/docker/docker-compose.testnet.yml build --parallel
	@echo -e "$(GREEN)Build complete!$(NC)"

build-devnet: ## Build DevNet images only
	@echo -e "$(BLUE)Building DevNet images...$(NC)"
	cd .. && $(DOCKER_COMPOSE) -f deploy/docker/docker-compose.devnet.yml build --parallel

build-testnet: ## Build TestNet images only
	@echo -e "$(BLUE)Building TestNet images...$(NC)"
	cd .. && $(DOCKER_COMPOSE) -f deploy/docker/docker-compose.testnet.yml build --parallel

build-explorer: ## Build Block Explorer images
	@echo -e "$(BLUE)Building Block Explorer...$(NC)"
	cd ../explorer && npm install && npm run build

# ============================================
# DEVNET COMMANDS
# ============================================

devnet: devnet-start ## Start DevNet (alias)

devnet-start: ## Start DevNet
	@echo -e "$(BLUE)Starting DevNet...$(NC)"
	./scripts/deploy-devnet.sh start

devnet-stop: ## Stop DevNet
	@echo -e "$(YELLOW)Stopping DevNet...$(NC)"
	./scripts/deploy-devnet.sh stop

devnet-restart: ## Restart DevNet
	./scripts/deploy-devnet.sh restart

devnet-status: ## Show DevNet status
	./scripts/deploy-devnet.sh status

devnet-logs: ## Show DevNet logs
	./scripts/deploy-devnet.sh logs

devnet-destroy: ## Destroy DevNet and all data
	./scripts/deploy-devnet.sh destroy

# ============================================
# TESTNET COMMANDS
# ============================================

testnet: testnet-start ## Start TestNet (alias)

testnet-start: ## Start TestNet
	@echo -e "$(BLUE)Starting TestNet...$(NC)"
	./scripts/deploy-testnet.sh start

testnet-start-full: ## Start TestNet with monitoring & treasury
	MONITORING_ENABLED=true TREASURY_ENABLED=true ./scripts/deploy-testnet.sh start

testnet-stop: ## Stop TestNet
	@echo -e "$(YELLOW)Stopping TestNet...$(NC)"
	./scripts/deploy-testnet.sh stop

testnet-restart: ## Restart TestNet
	./scripts/deploy-testnet.sh restart

testnet-status: ## Show TestNet status
	./scripts/deploy-testnet.sh status

testnet-health: ## Run TestNet health check
	./scripts/deploy-testnet.sh health

testnet-logs: ## Show TestNet logs
	./scripts/deploy-testnet.sh logs

testnet-destroy: ## Destroy TestNet and all data
	./scripts/deploy-testnet.sh destroy

# ============================================
# EXPLORER COMMANDS
# ============================================

explorer-start: ## Start Block Explorer (requires running network)
	@echo -e "$(BLUE)Starting Block Explorer...$(NC)"
	cd ../explorer && npm run dev

explorer-build: ## Build Block Explorer for production
	cd ../explorer && npm run build

# ============================================
# DATABASE COMMANDS
# ============================================

db-shell-devnet: ## Open PostgreSQL shell (DevNet)
	docker exec -it blueblocks-devnet-node psql -U blueblocks -d blueblocks_indexer

db-shell-testnet: ## Open PostgreSQL shell (TestNet)
	docker exec -it blueblocks-testnet-timescaledb psql -U blueblocks -d blueblocks_indexer

db-migrate: ## Run database migrations
	@echo -e "$(BLUE)Running database migrations...$(NC)"
	docker exec -i blueblocks-testnet-timescaledb psql -U blueblocks -d blueblocks_indexer < configs/testnet/init-db.sql

# ============================================
# UTILITY COMMANDS
# ============================================

clean: ## Clean up Docker resources
	@echo -e "$(YELLOW)Cleaning up Docker resources...$(NC)"
	docker system prune -f
	docker volume prune -f

clean-all: ## Clean everything including images
	@echo -e "$(YELLOW)Cleaning all Docker resources...$(NC)"
	docker system prune -af
	docker volume prune -f

logs-node: ## Show node logs (use NETWORK=devnet|testnet)
	@NETWORK=$${NETWORK:-devnet}; \
	if [ "$$NETWORK" = "devnet" ]; then \
		$(DOCKER_COMPOSE) -f docker/docker-compose.devnet.yml logs -f node; \
	else \
		$(DOCKER_COMPOSE) -f docker/docker-compose.testnet.yml logs -f node-1 node-2 node-3; \
	fi

logs-validator: ## Show validator logs (use NETWORK=devnet|testnet)
	@NETWORK=$${NETWORK:-devnet}; \
	if [ "$$NETWORK" = "devnet" ]; then \
		$(DOCKER_COMPOSE) -f docker/docker-compose.devnet.yml logs -f validator; \
	else \
		$(DOCKER_COMPOSE) -f docker/docker-compose.testnet.yml logs -f validator-1 validator-2 validator-3; \
	fi

logs-miner: ## Show miner logs (use NETWORK=devnet|testnet)
	@NETWORK=$${NETWORK:-devnet}; \
	if [ "$$NETWORK" = "devnet" ]; then \
		$(DOCKER_COMPOSE) -f docker/docker-compose.devnet.yml logs -f miner; \
	else \
		$(DOCKER_COMPOSE) -f docker/docker-compose.testnet.yml logs -f miner-1 miner-2; \
	fi

# ============================================
# TESTING COMMANDS
# ============================================

test-api: ## Test API endpoints
	@echo -e "$(BLUE)Testing API endpoints...$(NC)"
	@echo "Health check:"
	@curl -s http://localhost:8080/health | jq . || echo "Failed"
	@echo ""
	@echo "Node info:"
	@curl -s http://localhost:8080/node/info | jq . || echo "Failed"
	@echo ""
	@echo "Supply:"
	@curl -s http://localhost:8080/supply | jq . || echo "Failed"

test-faucet: ## Request tokens from faucet (use ADDR=<address>)
	@if [ -z "$(ADDR)" ]; then \
		echo "Usage: make test-faucet ADDR=bb..."; \
		exit 1; \
	fi
	@echo -e "$(BLUE)Requesting tokens from faucet...$(NC)"
	curl -X POST http://localhost:8080/faucet -H "Content-Type: application/json" \
		-d '{"address":"$(ADDR)"}' | jq .

# ============================================
# MONITORING COMMANDS
# ============================================

monitoring-start: ## Start monitoring stack
	@echo -e "$(BLUE)Starting monitoring...$(NC)"
	cd .. && $(DOCKER_COMPOSE) -f deploy/docker/docker-compose.testnet.yml --profile monitoring up -d prometheus grafana

monitoring-stop: ## Stop monitoring stack
	cd .. && $(DOCKER_COMPOSE) -f deploy/docker/docker-compose.testnet.yml --profile monitoring stop prometheus grafana

# ============================================
# SETUP COMMANDS
# ============================================

setup: ## Initial setup (create configs from examples)
	@echo -e "$(BLUE)Setting up configuration files...$(NC)"
	@if [ ! -f configs/devnet/.env ]; then \
		cp configs/devnet/.env.example configs/devnet/.env; \
		echo "Created configs/devnet/.env"; \
	fi
	@if [ ! -f configs/testnet/.env ]; then \
		cp configs/testnet/.env.example configs/testnet/.env; \
		echo "Created configs/testnet/.env"; \
	fi
	@echo -e "$(GREEN)Setup complete! Please edit .env files with your configuration.$(NC)"

# Default target
.DEFAULT_GOAL := help
