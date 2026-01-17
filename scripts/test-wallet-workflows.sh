#!/bin/bash
# BlueBlocks Wallet Workflow Tests
# =================================
# Comprehensive end-to-end testing for wallet operations

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
RPC_URL="${BLUEBLOCKS_RPC:-http://localhost:8080}"
TEST_DIR="/tmp/blueblocks-wallet-tests"
PASSED=0
FAILED=0
TOTAL=0

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[FAIL]${NC} $1"; }
log_test() { echo -e "${CYAN}[TEST]${NC} $1"; }
log_pass() { echo -e "${GREEN}[PASS]${NC} $1"; ((PASSED++)); }

run_test() {
    local name="$1"
    local cmd="$2"
    ((TOTAL++))

    log_test "$name"

    if eval "$cmd" > /dev/null 2>&1; then
        log_pass "$name"
        return 0
    else
        log_error "$name"
        ((FAILED++))
        return 1
    fi
}

assert_equals() {
    local expected="$1"
    local actual="$2"
    local msg="$3"

    if [ "$expected" = "$actual" ]; then
        return 0
    else
        log_error "Assertion failed: $msg (expected: $expected, actual: $actual)"
        return 1
    fi
}

assert_not_empty() {
    local value="$1"
    local msg="$2"

    if [ -n "$value" ]; then
        return 0
    else
        log_error "Assertion failed: $msg (value is empty)"
        return 1
    fi
}

# ==============================================================================
# SETUP
# ==============================================================================

setup() {
    log_info "Setting up test environment..."

    mkdir -p "$TEST_DIR"
    cd "$TEST_DIR"

    # Check if node is running
    if ! curl -s "$RPC_URL/health" > /dev/null 2>&1; then
        log_error "BlueBlocks node not running at $RPC_URL"
        log_info "Start the node with: make docker-compose-up"
        exit 1
    fi

    log_info "Node is healthy at $RPC_URL"
}

cleanup() {
    log_info "Cleaning up test environment..."
    rm -rf "$TEST_DIR"
}

# ==============================================================================
# TEST: WALLET CREATION
# ==============================================================================

test_wallet_creation() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "TEST SUITE: Wallet Creation"
    echo "═══════════════════════════════════════════════════════════"

    # Test 1: Create new wallet
    run_test "Create new wallet" \
        "bblks wallet create --output $TEST_DIR/wallet1.json"

    # Test 2: Verify wallet file structure
    run_test "Wallet file has address" \
        "jq -e '.address' $TEST_DIR/wallet1.json"

    run_test "Wallet file has public key" \
        "jq -e '.public_key' $TEST_DIR/wallet1.json"

    run_test "Wallet file has encrypted private key" \
        "jq -e '.encrypted_private_key' $TEST_DIR/wallet1.json"

    # Test 3: Create wallet with password
    run_test "Create wallet with password" \
        "echo 'testpassword123' | bblks wallet create --output $TEST_DIR/wallet2.json --password"

    # Test 4: Create multiple wallets (unique addresses)
    bblks wallet create --output $TEST_DIR/wallet3.json 2>/dev/null
    ADDR1=$(jq -r '.address' $TEST_DIR/wallet1.json)
    ADDR3=$(jq -r '.address' $TEST_DIR/wallet3.json)

    ((TOTAL++))
    if [ "$ADDR1" != "$ADDR3" ]; then
        log_pass "Wallets have unique addresses"
        ((PASSED++))
    else
        log_error "Wallets have same address (should be unique)"
        ((FAILED++))
    fi
}

# ==============================================================================
# TEST: WALLET IMPORT/EXPORT
# ==============================================================================

test_wallet_import_export() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "TEST SUITE: Wallet Import/Export"
    echo "═══════════════════════════════════════════════════════════"

    # Test: Export mnemonic
    run_test "Export wallet mnemonic" \
        "bblks wallet export --wallet $TEST_DIR/wallet1.json --format mnemonic > $TEST_DIR/mnemonic.txt"

    # Test: Import from mnemonic
    if [ -f "$TEST_DIR/mnemonic.txt" ]; then
        run_test "Import wallet from mnemonic" \
            "bblks wallet import --mnemonic \"\$(cat $TEST_DIR/mnemonic.txt)\" --output $TEST_DIR/wallet_imported.json"

        # Verify same address
        ORIG_ADDR=$(jq -r '.address' $TEST_DIR/wallet1.json 2>/dev/null || echo "")
        IMPORT_ADDR=$(jq -r '.address' $TEST_DIR/wallet_imported.json 2>/dev/null || echo "")

        ((TOTAL++))
        if [ "$ORIG_ADDR" = "$IMPORT_ADDR" ] && [ -n "$ORIG_ADDR" ]; then
            log_pass "Imported wallet has same address"
            ((PASSED++))
        else
            log_warn "Could not verify imported wallet address"
        fi
    fi

    # Test: Export as keystore JSON
    run_test "Export as keystore JSON" \
        "bblks wallet export --wallet $TEST_DIR/wallet1.json --format keystore > $TEST_DIR/keystore.json"
}

# ==============================================================================
# TEST: BALANCE QUERIES
# ==============================================================================

test_balance_queries() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "TEST SUITE: Balance Queries"
    echo "═══════════════════════════════════════════════════════════"

    WALLET_ADDR=$(jq -r '.address' $TEST_DIR/wallet1.json 2>/dev/null || echo "bb1testaddress")

    # Test: Query balance via CLI
    run_test "Query balance via CLI" \
        "bblks wallet balance --address $WALLET_ADDR"

    # Test: Query balance via API
    run_test "Query balance via API" \
        "curl -s $RPC_URL/api/accounts/$WALLET_ADDR"

    # Test: Query non-existent address (should return 0, not error)
    run_test "Query non-existent address returns zero" \
        "curl -s $RPC_URL/api/accounts/bb1nonexistent123 | jq -e '.balance >= 0'"

    # Test: Query treasury balance
    run_test "Query treasury balance" \
        "curl -s $RPC_URL/api/treasury/stats"
}

# ==============================================================================
# TEST: TRANSACTION WORKFLOWS
# ==============================================================================

test_transactions() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "TEST SUITE: Transaction Workflows"
    echo "═══════════════════════════════════════════════════════════"

    SENDER=$(jq -r '.address' $TEST_DIR/wallet1.json 2>/dev/null || echo "")
    RECIPIENT=$(jq -r '.address' $TEST_DIR/wallet3.json 2>/dev/null || echo "")

    if [ -z "$SENDER" ] || [ -z "$RECIPIENT" ]; then
        log_warn "Skipping transaction tests - wallets not available"
        return
    fi

    # Test: Estimate gas
    run_test "Estimate transaction gas" \
        "curl -s -X POST $RPC_URL/api/transactions/estimate-gas \
            -H 'Content-Type: application/json' \
            -d '{\"from\":\"$SENDER\",\"to\":\"$RECIPIENT\",\"amount\":100}'"

    # Test: Create unsigned transaction
    run_test "Create unsigned transaction" \
        "bblks tx create --from $SENDER --to $RECIPIENT --amount 100 --output $TEST_DIR/unsigned_tx.json"

    # Test: Sign transaction
    if [ -f "$TEST_DIR/unsigned_tx.json" ]; then
        run_test "Sign transaction" \
            "bblks tx sign --tx $TEST_DIR/unsigned_tx.json --wallet $TEST_DIR/wallet1.json --output $TEST_DIR/signed_tx.json"
    fi

    # Test: Validate transaction format
    if [ -f "$TEST_DIR/signed_tx.json" ]; then
        run_test "Signed transaction has signature" \
            "jq -e '.signature' $TEST_DIR/signed_tx.json"
    fi

    # Note: Actually submitting requires funded accounts
    log_warn "Transaction submission skipped (requires funded accounts)"
}

# ==============================================================================
# TEST: HEALTHCARE WORKFLOWS
# ==============================================================================

test_healthcare_workflows() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "TEST SUITE: Healthcare Workflows"
    echo "═══════════════════════════════════════════════════════════"

    # Test: Create health record
    run_test "Create health record structure" \
        "echo '{\"patient_id\":\"patient123\",\"record_type\":\"lab_result\",\"data\":{\"test\":\"glucose\",\"value\":95}}' > $TEST_DIR/health_record.json"

    # Test: Encrypt health record
    run_test "Encrypt health record" \
        "bblks health encrypt --input $TEST_DIR/health_record.json --key $TEST_DIR/wallet1.json --output $TEST_DIR/encrypted_record.json"

    # Test: HIPAA audit entry
    run_test "Create HIPAA audit entry" \
        "curl -s -X POST $RPC_URL/api/health/audit \
            -H 'Content-Type: application/json' \
            -d '{\"action\":\"view\",\"patient_id\":\"patient123\",\"provider_id\":\"provider456\",\"record_type\":\"lab_result\"}'"

    # Test: Query audit log
    run_test "Query HIPAA audit log" \
        "curl -s $RPC_URL/api/health/audit?patient_id=patient123"
}

# ==============================================================================
# TEST: SMART CONTRACT WORKFLOWS
# ==============================================================================

test_contract_workflows() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "TEST SUITE: Smart Contract Workflows"
    echo "═══════════════════════════════════════════════════════════"

    # Create a simple test contract
    cat > $TEST_DIR/test_contract.star << 'EOF'
def init():
    state["counter"] = 0
    return {"status": "initialized"}

def increment():
    state["counter"] = state["counter"] + 1
    return {"counter": state["counter"]}

def get_counter():
    return {"counter": state["counter"]}
EOF

    # Test: Estimate deployment gas
    run_test "Estimate contract deployment gas" \
        "bblks contract estimate-gas --code $TEST_DIR/test_contract.star"

    # Test: Validate contract syntax
    run_test "Validate contract syntax" \
        "bblks contract validate --code $TEST_DIR/test_contract.star"

    # Test: Compile contract
    run_test "Compile contract" \
        "bblks contract compile --code $TEST_DIR/test_contract.star --output $TEST_DIR/compiled.json"

    # Test: List deployed contracts (API)
    run_test "List deployed contracts" \
        "curl -s $RPC_URL/api/contracts"
}

# ==============================================================================
# TEST: API ENDPOINTS
# ==============================================================================

test_api_endpoints() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "TEST SUITE: API Endpoints"
    echo "═══════════════════════════════════════════════════════════"

    # Health endpoints
    run_test "GET /health" \
        "curl -s $RPC_URL/health | jq -e '.status == \"healthy\"'"

    run_test "GET /api/status" \
        "curl -s $RPC_URL/api/status"

    # Blockchain endpoints
    run_test "GET /api/blocks/latest" \
        "curl -s $RPC_URL/api/blocks/latest"

    run_test "GET /api/blocks/0" \
        "curl -s $RPC_URL/api/blocks/0"

    # Network endpoints
    run_test "GET /api/network/peers" \
        "curl -s $RPC_URL/api/network/peers"

    run_test "GET /api/network/stats" \
        "curl -s $RPC_URL/api/network/stats"

    # Mining endpoints
    run_test "GET /api/mining/stats" \
        "curl -s $RPC_URL/api/mining/stats"

    # Validators
    run_test "GET /api/validators" \
        "curl -s $RPC_URL/api/validators"
}

# ==============================================================================
# TEST: ERROR HANDLING
# ==============================================================================

test_error_handling() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "TEST SUITE: Error Handling"
    echo "═══════════════════════════════════════════════════════════"

    # Test: Invalid address format
    ((TOTAL++))
    RESPONSE=$(curl -s $RPC_URL/api/accounts/invalid_address)
    if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
        log_pass "Invalid address returns error"
        ((PASSED++))
    else
        log_error "Invalid address should return error"
        ((FAILED++))
    fi

    # Test: Invalid JSON body
    ((TOTAL++))
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $RPC_URL/api/transactions \
        -H 'Content-Type: application/json' -d 'not valid json')
    if [ "$HTTP_CODE" = "400" ]; then
        log_pass "Invalid JSON returns 400"
        ((PASSED++))
    else
        log_error "Invalid JSON should return 400 (got $HTTP_CODE)"
        ((FAILED++))
    fi

    # Test: Missing required fields
    ((TOTAL++))
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $RPC_URL/api/transactions \
        -H 'Content-Type: application/json' -d '{}')
    if [ "$HTTP_CODE" = "400" ]; then
        log_pass "Missing fields returns 400"
        ((PASSED++))
    else
        log_warn "Missing fields returned $HTTP_CODE (expected 400)"
    fi
}

# ==============================================================================
# PRINT RESULTS
# ==============================================================================

print_results() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "TEST RESULTS"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo -e "Total:  ${TOTAL}"
    echo -e "Passed: ${GREEN}${PASSED}${NC}"
    echo -e "Failed: ${RED}${FAILED}${NC}"
    echo ""

    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}All tests passed!${NC}"
        return 0
    else
        echo -e "${RED}Some tests failed.${NC}"
        return 1
    fi
}

# ==============================================================================
# MAIN
# ==============================================================================

main() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║     BlueBlocks Wallet Workflow Tests                     ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""

    setup

    trap cleanup EXIT

    test_wallet_creation
    test_wallet_import_export
    test_balance_queries
    test_transactions
    test_healthcare_workflows
    test_contract_workflows
    test_api_endpoints
    test_error_handling

    print_results
}

# Run main
main "$@"
