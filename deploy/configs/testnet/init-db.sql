-- BlueBlocks Indexer Database Schema
-- TimescaleDB initialization script

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- ============================================
-- BLOCKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blocks (
    height BIGINT PRIMARY KEY,
    hash VARCHAR(64) NOT NULL UNIQUE,
    prev_hash VARCHAR(64),
    timestamp TIMESTAMPTZ NOT NULL,
    proposer VARCHAR(64),
    num_txs INTEGER DEFAULT 0,
    total_gas BIGINT DEFAULT 0,
    block_reward BIGINT DEFAULT 0,
    size_bytes INTEGER DEFAULT 0,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('blocks', 'timestamp', if_not_exists => TRUE);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blocks_height ON blocks(height DESC);
CREATE INDEX IF NOT EXISTS idx_blocks_hash ON blocks(hash);
CREATE INDEX IF NOT EXISTS idx_blocks_proposer ON blocks(proposer);
CREATE INDEX IF NOT EXISTS idx_blocks_timestamp ON blocks(timestamp DESC);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    hash VARCHAR(64) PRIMARY KEY,
    block_height BIGINT NOT NULL REFERENCES blocks(height),
    block_hash VARCHAR(64) NOT NULL,
    tx_index INTEGER NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    from_address VARCHAR(64) NOT NULL,
    to_address VARCHAR(64),
    value NUMERIC(78, 0) DEFAULT 0,
    gas_limit BIGINT DEFAULT 0,
    gas_used BIGINT DEFAULT 0,
    gas_price BIGINT DEFAULT 0,
    nonce BIGINT DEFAULT 0,
    tx_type VARCHAR(32) NOT NULL,
    status VARCHAR(16) NOT NULL,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to hypertable
SELECT create_hypertable('transactions', 'timestamp', if_not_exists => TRUE);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_txs_block_height ON transactions(block_height DESC);
CREATE INDEX IF NOT EXISTS idx_txs_from ON transactions(from_address);
CREATE INDEX IF NOT EXISTS idx_txs_to ON transactions(to_address);
CREATE INDEX IF NOT EXISTS idx_txs_timestamp ON transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_txs_type ON transactions(tx_type);
CREATE INDEX IF NOT EXISTS idx_txs_status ON transactions(status);

-- ============================================
-- ACCOUNTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
    address VARCHAR(64) PRIMARY KEY,
    balance NUMERIC(78, 0) DEFAULT 0,
    nonce BIGINT DEFAULT 0,
    account_type VARCHAR(32) DEFAULT 'standard',
    label VARCHAR(255),
    is_contract BOOLEAN DEFAULT FALSE,
    contract_code_hash VARCHAR(64),
    first_seen_block BIGINT,
    last_active_block BIGINT,
    tx_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_accounts_balance ON accounts(balance DESC);
CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_accounts_is_contract ON accounts(is_contract);

-- ============================================
-- CONTRACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contracts (
    address VARCHAR(64) PRIMARY KEY,
    creator VARCHAR(64) NOT NULL,
    creation_tx VARCHAR(64) NOT NULL,
    creation_block BIGINT NOT NULL,
    code_hash VARCHAR(64) NOT NULL,
    code TEXT,
    abi JSONB,
    name VARCHAR(255),
    contract_type VARCHAR(32),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contracts_creator ON contracts(creator);
CREATE INDEX IF NOT EXISTS idx_contracts_type ON contracts(contract_type);

-- ============================================
-- VALIDATORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS validators (
    address VARCHAR(64) PRIMARY KEY,
    pub_key VARCHAR(128),
    moniker VARCHAR(255),
    validator_type VARCHAR(32) NOT NULL,
    stake NUMERIC(78, 0) DEFAULT 0,
    commission_rate DECIMAL(5, 4) DEFAULT 0.1,
    status VARCHAR(32) DEFAULT 'active',
    jailed BOOLEAN DEFAULT FALSE,
    jail_until TIMESTAMPTZ,
    blocks_proposed INTEGER DEFAULT 0,
    blocks_signed INTEGER DEFAULT 0,
    uptime_percentage DECIMAL(5, 2) DEFAULT 100.0,
    npi_number VARCHAR(20),
    registered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_validators_status ON validators(status);
CREATE INDEX IF NOT EXISTS idx_validators_stake ON validators(stake DESC);
CREATE INDEX IF NOT EXISTS idx_validators_type ON validators(validator_type);

-- ============================================
-- EVENTS TABLE (Contract Events/Logs)
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL,
    tx_hash VARCHAR(64) NOT NULL,
    block_height BIGINT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    contract_address VARCHAR(64) NOT NULL,
    event_name VARCHAR(255),
    event_signature VARCHAR(64),
    topics JSONB,
    data JSONB,
    log_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, timestamp)
);

-- Convert to hypertable
SELECT create_hypertable('events', 'timestamp', if_not_exists => TRUE);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_tx ON events(tx_hash);
CREATE INDEX IF NOT EXISTS idx_events_contract ON events(contract_address);
CREATE INDEX IF NOT EXISTS idx_events_name ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp DESC);

-- ============================================
-- HEALTH RECORDS (HIPAA-compliant metadata only)
-- ============================================
CREATE TABLE IF NOT EXISTS health_records (
    record_id VARCHAR(64) PRIMARY KEY,
    patient_address VARCHAR(64) NOT NULL,
    provider_address VARCHAR(64),
    record_type VARCHAR(64) NOT NULL,
    ipfs_hash VARCHAR(64),
    encrypted BOOLEAN DEFAULT TRUE,
    created_block BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ,
    revoked BOOLEAN DEFAULT FALSE,
    metadata JSONB
);

-- Indexes (no PHI in indexes)
CREATE INDEX IF NOT EXISTS idx_health_patient ON health_records(patient_address);
CREATE INDEX IF NOT EXISTS idx_health_provider ON health_records(provider_address);
CREATE INDEX IF NOT EXISTS idx_health_type ON health_records(record_type);

-- ============================================
-- TREASURY TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS treasury_transactions (
    id BIGSERIAL PRIMARY KEY,
    eth_tx_hash VARCHAR(66) NOT NULL UNIQUE,
    bb_tx_hash VARCHAR(64),
    from_eth_address VARCHAR(42) NOT NULL,
    to_bb_address VARCHAR(64) NOT NULL,
    usdc_amount NUMERIC(78, 6) NOT NULL,
    bbt_amount NUMERIC(78, 0) NOT NULL,
    exchange_rate DECIMAL(18, 8) NOT NULL,
    status VARCHAR(32) NOT NULL,
    eth_block BIGINT NOT NULL,
    bb_block BIGINT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_treasury_eth_tx ON treasury_transactions(eth_tx_hash);
CREATE INDEX IF NOT EXISTS idx_treasury_bb_tx ON treasury_transactions(bb_tx_hash);
CREATE INDEX IF NOT EXISTS idx_treasury_status ON treasury_transactions(status);

-- ============================================
-- NETWORK STATS (Aggregated)
-- ============================================
CREATE TABLE IF NOT EXISTS network_stats (
    timestamp TIMESTAMPTZ NOT NULL,
    total_blocks BIGINT,
    total_txs BIGINT,
    total_accounts BIGINT,
    total_contracts BIGINT,
    total_validators INTEGER,
    active_validators INTEGER,
    total_stake NUMERIC(78, 0),
    circulating_supply NUMERIC(78, 0),
    avg_block_time_ms INTEGER,
    avg_gas_price BIGINT,
    tps_1h DECIMAL(10, 2),
    PRIMARY KEY (timestamp)
);

-- Convert to hypertable
SELECT create_hypertable('network_stats', 'timestamp', if_not_exists => TRUE);

-- ============================================
-- CONTINUOUS AGGREGATES
-- ============================================

-- Hourly block stats
CREATE MATERIALIZED VIEW IF NOT EXISTS hourly_block_stats
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', timestamp) AS bucket,
    COUNT(*) AS block_count,
    SUM(num_txs) AS tx_count,
    SUM(total_gas) AS total_gas,
    AVG(size_bytes) AS avg_block_size
FROM blocks
GROUP BY bucket
WITH NO DATA;

-- Refresh policy
SELECT add_continuous_aggregate_policy('hourly_block_stats',
    start_offset => INTERVAL '1 day',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour',
    if_not_exists => TRUE
);

-- Daily transaction stats
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_tx_stats
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', timestamp) AS bucket,
    tx_type,
    COUNT(*) AS tx_count,
    SUM(value) AS total_value,
    SUM(gas_used) AS total_gas,
    AVG(gas_price) AS avg_gas_price
FROM transactions
GROUP BY bucket, tx_type
WITH NO DATA;

-- Refresh policy
SELECT add_continuous_aggregate_policy('daily_tx_stats',
    start_offset => INTERVAL '7 days',
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

-- ============================================
-- RETENTION POLICIES
-- ============================================

-- Keep detailed events for 90 days
SELECT add_retention_policy('events', INTERVAL '90 days', if_not_exists => TRUE);

-- Keep network stats for 1 year
SELECT add_retention_policy('network_stats', INTERVAL '365 days', if_not_exists => TRUE);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get account balance at a specific block
CREATE OR REPLACE FUNCTION get_balance_at_block(
    p_address VARCHAR(64),
    p_block_height BIGINT
) RETURNS NUMERIC AS $$
DECLARE
    v_balance NUMERIC;
BEGIN
    SELECT COALESCE(
        (SELECT balance FROM accounts WHERE address = p_address),
        0
    ) INTO v_balance;

    RETURN v_balance;
END;
$$ LANGUAGE plpgsql;

-- Function to update account stats
CREATE OR REPLACE FUNCTION update_account_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update sender
    UPDATE accounts
    SET
        tx_count = tx_count + 1,
        last_active_block = NEW.block_height,
        updated_at = NOW()
    WHERE address = NEW.from_address;

    -- Update receiver if exists
    IF NEW.to_address IS NOT NULL THEN
        UPDATE accounts
        SET
            tx_count = tx_count + 1,
            last_active_block = NEW.block_height,
            updated_at = NOW()
        WHERE address = NEW.to_address;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for account stats
DROP TRIGGER IF EXISTS trg_update_account_stats ON transactions;
CREATE TRIGGER trg_update_account_stats
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_account_stats();

-- ============================================
-- GRANTS
-- ============================================

-- Create read-only role for explorer
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'explorer_readonly') THEN
        CREATE ROLE explorer_readonly;
    END IF;
END
$$;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO explorer_readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO explorer_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO explorer_readonly;
