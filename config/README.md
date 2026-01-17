# Configuration Files

**IMPORTANT**: Never commit sensitive configuration files to git!

## File Structure

```
config/
├── README.md                    # This file
├── coinbase.example.json        # Example Coinbase config (safe to commit)
├── coinbase.json                # REAL Coinbase addresses (NEVER commit)
├── treasury.example.json        # Example treasury config (safe to commit)
└── treasury.json                # REAL treasury config (NEVER commit)
```

## Setup Instructions

### 1. Coinbase Configuration

```bash
# Copy example
cp coinbase.example.json coinbase.json

# Edit with real addresses
nano coinbase.json
```

Update with your actual Coinbase deposit addresses:

```json
{
  "usdc_address": "0xYourRealCoinbaseUSDCAddress",
  "eth_address": "0xYourRealCoinbaseETHAddress"
}
```

### 2. Treasury Configuration

```bash
# Copy example
cp treasury.example.json treasury.json

# Edit with real values
nano treasury.json
```

Update with your configuration:

```json
{
  "ethereum_rpc": "https://mainnet.infura.io/v3/YOUR_REAL_API_KEY",
  "token_sale_contract": "0xYourDeployedTokenSaleContract",
  "blueblocks_rpc": "http://localhost:8080",
  "treasury_key_path": "./keys/treasury.json"
}
```

## Security Checklist

Before deploying:

- [ ] Verified coinbase.json is in .gitignore
- [ ] Verified treasury.json is in .gitignore
- [ ] Confirmed real addresses are NOT in example files
- [ ] Tested with testnet first (Goerli)
- [ ] Backed up all key files securely
- [ ] Set proper file permissions (chmod 600 *.json)
- [ ] Audited smart contract code
- [ ] Set up monitoring/alerts

## Deployment

### Testnet (Goerli)

```bash
# Use Goerli addresses for testing
echo '{
  "usdc_address": "0xTestGoerliAddress1",
  "eth_address": "0xTestGoerliAddress2"
}' > coinbase.json

# Deploy to Goerli
npx hardhat run scripts/deploy.js --network goerli
```

### Mainnet

```bash
# Use REAL Coinbase addresses
# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Verify on Etherscan
npx hardhat verify --network mainnet <CONTRACT_ADDRESS>
```

## Environment Variables

Alternative to config files (more secure for production):

```bash
export COINBASE_USDC_ADDRESS="0x..."
export COINBASE_ETH_ADDRESS="0x..."
export ETHEREUM_RPC="https://mainnet.infura.io/v3/..."
export TOKEN_SALE_CONTRACT="0x..."
```

## Backup Strategy

```bash
# Backup all sensitive files
tar -czf blueblocks-backup-$(date +%Y%m%d).tar.gz \
  config/coinbase.json \
  config/treasury.json \
  keys/

# Store encrypted backup in secure location
gpg --encrypt --recipient you@example.com blueblocks-backup-*.tar.gz
```
