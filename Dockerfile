# BlueBlocks Healthcare Blockchain - Multi-stage Docker Build
# ===========================================================
# This Dockerfile creates a minimal, secure container for running
# BlueBlocks blockchain nodes.

# Build stage
FROM golang:1.22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git make ca-certificates tzdata

# Set working directory
WORKDIR /build

# Copy go mod files first (better caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build arguments for version info
ARG VERSION=dev
ARG COMMIT=unknown
ARG DATE=unknown

# Build all binaries
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags "-X github.com/blueblocks/preapproved-implementations/lib/version.Version=${VERSION} \
              -X github.com/blueblocks/preapproved-implementations/lib/version.Commit=${COMMIT} \
              -X github.com/blueblocks/preapproved-implementations/lib/version.Date=${DATE} \
              -w -s" \
    -o /build/bin/bblks ./cmd/bblks

RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags "-w -s" \
    -o /build/bin/bblks-validator ./cmd/bblks-validator

RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags "-w -s" \
    -o /build/bin/bblks-treasury ./cmd/bblks-treasury

RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags "-w -s" \
    -o /build/bin/blueblocks-miner ./cmd/blueblocks-miner

RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags "-w -s" \
    -o /build/bin/discovery-service ./cmd/discovery-service

# Runtime stage - minimal image
FROM alpine:3.19 AS runtime

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata curl jq bash

# Create non-root user for security
RUN addgroup -g 1000 blueblocks && \
    adduser -u 1000 -G blueblocks -s /bin/bash -D blueblocks

# Create necessary directories
RUN mkdir -p /app/data /app/config /app/logs /app/keys && \
    chown -R blueblocks:blueblocks /app

# Copy binaries from builder
COPY --from=builder /build/bin/* /usr/local/bin/

# Copy default configurations
COPY --chown=blueblocks:blueblocks config/*.example.* /app/config/

# Copy entrypoint script
COPY --chown=blueblocks:blueblocks scripts/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set working directory
WORKDIR /app

# Switch to non-root user
USER blueblocks

# Environment variables
ENV BLUEBLOCKS_DATA_DIR=/app/data \
    BLUEBLOCKS_CONFIG_DIR=/app/config \
    BLUEBLOCKS_LOG_DIR=/app/logs \
    BLUEBLOCKS_KEYS_DIR=/app/keys \
    BLUEBLOCKS_NETWORK=devnet \
    BLUEBLOCKS_RPC_PORT=8080 \
    BLUEBLOCKS_P2P_PORT=26656 \
    BLUEBLOCKS_METRICS_PORT=9090

# Expose ports
# 8080 - HTTP RPC API
# 26656 - P2P network
# 26657 - Tendermint RPC (if using consensus)
# 9090 - Prometheus metrics
EXPOSE 8080 26656 26657 9090

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${BLUEBLOCKS_RPC_PORT}/health || exit 1

# Volumes for persistent data
VOLUME ["/app/data", "/app/keys", "/app/logs"]

# Default entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command (can be overridden)
CMD ["bblks", "server", "start"]
