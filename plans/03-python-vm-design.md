# Python Smart Contract VM Design

## Overview

The Python VM layer is responsible for executing smart contracts in a secure, deterministic, and resource-constrained environment. This document details the design decisions and implementation approach.

## VM Implementation Choice

### Recommended: Starlark-go

**Rationale:**
1. **Determinism**: Built from ground-up for deterministic execution
2. **Security**: Designed for untrusted code execution
3. **Performance**: Native Go implementation, no CGO overhead
4. **Parallelism**: No GIL, threads execute independently
5. **Production-Ready**: Used by Google (Bazel), Facebook (Buck), others

**Repository**: https://github.com/google/starlark-go

### Language Subset

Starlark is a Python dialect with intentional limitations:

**Supported Features:**
- Variables, functions, control flow (if/for/while)
- Lists, dicts, tuples, sets
- String operations
- Lambda expressions
- List comprehensions
- First-class functions
- Recursion (with limits)

**Removed Features:**
- `import` statement (no external modules)
- `class` keyword (use functions and dicts)
- `try/except` (errors halt execution)
- Global mutable state
- Arbitrary code execution (eval/exec)
- File I/O, network access

**Example Smart Contract:**
```python
# Token transfer contract in Starlark

def init(owner):
    """Initialize contract with owner"""
    state.owner = owner
    state.balances = {owner: 1000000}
    state.total_supply = 1000000

def transfer(to, amount):
    """Transfer tokens to another address"""
    sender = ctx.sender

    # Validation
    if amount <= 0:
        fail("Amount must be positive")

    if state.balances.get(sender, 0) < amount:
        fail("Insufficient balance")

    # Update balances
    state.balances[sender] = state.balances.get(sender, 0) - amount
    state.balances[to] = state.balances.get(to, 0) + amount

    # Emit event
    emit("Transfer", sender=sender, to=to, amount=amount)

    return True

def balance_of(address):
    """Query balance of an address"""
    return state.balances.get(address, 0)
```

## VM Architecture

### Component Overview

```
┌─────────────────────────────────────────────┐
│         Smart Contract Transaction          │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│         Transaction Validator               │
│  - Signature verification                   │
│  - Gas limit check                          │
│  - Nonce validation                         │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│          VM Initialization                  │
│  - Create execution context                 │
│  - Load contract code                       │
│  - Initialize gas meter                     │
│  - Setup sandbox environment                │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│       Starlark Interpreter                  │
│  - Parse Python code                        │
│  - Execute bytecode                         │
│  - Track gas consumption                    │
│  - Enforce resource limits                  │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│        Built-in Functions                   │
│  - Blockchain state access                  │
│  - Crypto operations                        │
│  - IPFS operations                          │
│  - Event emission                           │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│       State Modification                    │
│  - Apply state changes                      │
│  - Update storage                           │
│  - Deduct gas fees                          │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│         Result & Events                     │
└─────────────────────────────────────────────┘
```

### Execution Context

Every smart contract execution has access to:

```python
# Context object (read-only)
ctx = {
    'sender': Address,        # Transaction sender
    'origin': Address,        # Original caller (for nested calls)
    'contract': Address,      # Current contract address
    'value': int,            # Tokens sent with transaction
    'block_height': int,     # Current block height
    'block_time': int,       # Block timestamp
    'gas_remaining': int,    # Gas still available
}

# State object (read-write)
state = {
    # Contract-specific persistent storage
    # Automatically persisted after execution
}

# Built-in functions
def emit(event_name, **kwargs):
    """Emit an event for external consumption"""
    pass

def call(contract_address, function, *args, gas_limit=None):
    """Call another smart contract"""
    pass

def create_contract(code, *args):
    """Deploy a new contract"""
    pass

def sha256(data):
    """Compute SHA-256 hash"""
    pass

def verify_signature(message, signature, public_key):
    """Verify cryptographic signature"""
    pass

def ipfs_upload(data, encrypt=True):
    """Upload data to IPFS, returns CID"""
    pass

def ipfs_get(cid):
    """Fetch data from IPFS by CID"""
    pass
```

## Gas Metering

### Gas Cost Model

Gas costs are designed to reflect:
1. Computational complexity
2. State storage costs
3. Network resource usage

**Base Costs:**
```
Operation                Cost (gas)
─────────────────────────────────
Transaction base         21000
Contract creation        32000
Function call           10
Storage read (32 bytes) 200
Storage write (32 bytes)5000
Memory allocation       3 per byte
Hash computation (SHA256) 60
Signature verification  3000
IPFS upload            1000 + size
IPFS download          500 + size
Event emission         375 per event + 375 per topic
```

**Arithmetic Operations:**
```
ADD, SUB, MUL, DIV      3 gas
MOD, EXP                10 gas
Comparison              3 gas
Logic (AND, OR, NOT)    3 gas
```

**Data Structure Operations:**
```
List append             10 gas
List access             3 gas
Dict set                20 gas
Dict get                10 gas
String concatenation    3 gas + length
```

### Gas Metering Implementation

**Approach 1: Instruction-Level Metering**
- Charge gas before each operation
- Most accurate but high overhead
- Used by Ethereum VM

**Approach 2: Basic Block Metering (Recommended)**
- Charge gas at control flow boundaries
- Lower overhead (~10x faster)
- Used by modern VMs (WASM, DTVM)

**Implementation:**
```go
type GasMeter struct {
    limit     uint64
    used      uint64
    blockCost uint64
}

func (gm *GasMeter) ConsumeGas(amount uint64) error {
    gm.used += amount
    if gm.used > gm.limit {
        return ErrOutOfGas
    }
    return nil
}

// Called at start of each basic block
func (gm *GasMeter) ChargeBlock(instructions int) error {
    cost := estimateBlockCost(instructions)
    return gm.ConsumeGas(cost)
}
```

### Gas Limits

**Per-Transaction Limits:**
- User-specified gas limit (max: block gas limit)
- Prevents runaway computation
- Unused gas refunded

**Per-Block Limits:**
- Maximum total gas for all transactions
- Prevents block processing bottlenecks
- Typically 50-100M gas per block

## Sandboxing & Security

### Resource Limits

**Memory:**
- Max 256 MB per contract execution
- Prevents memory exhaustion attacks
- Enforced by Go runtime limits

**Execution Time:**
- Indirect limit via gas
- Fallback timeout: 30 seconds
- Prevents hanging executions

**Call Depth:**
- Maximum 256 nested contract calls
- Prevents stack overflow attacks
- Standard in blockchain VMs

**Storage:**
- Per-contract storage quota
- Charge gas for storage usage
- Pruning mechanism for abandoned contracts

### Restricted Operations

**Filesystem:**
- No file I/O allowed
- All state through `state` object
- IPFS via built-in functions only

**Network:**
- No network access
- Inter-contract calls only via `call()`
- IPFS via controlled interface

**System Calls:**
- No direct system access
- No subprocess spawning
- No environment variable access

**Randomness:**
- No non-deterministic random
- Provide deterministic RNG seeded by block hash
- Users must use external randomness oracles

### Implementation

Starlark-go provides sandboxing by default:
```go
// Create restricted environment
thread := &starlark.Thread{
    Name: "contract",
    Load: nil, // Disable imports
}

// Define allowed built-ins
predeclared := starlark.StringDict{
    "state": stateObject,
    "ctx": contextObject,
    "emit": emitFunc,
    "sha256": sha256Func,
    // ... other safe functions
}

// Execute code with restrictions
globals, err := starlark.ExecFile(thread, "contract.star", source, predeclared)
```

## Determinism

### Critical Requirements

All nodes must compute identical results:
- Same inputs → same outputs
- Same gas consumption
- Same state changes
- Same events emitted

### Determinism Challenges

**1. Floating Point**
```python
# FORBIDDEN: Non-deterministic across architectures
x = 0.1 + 0.2  # May differ in precision

# ALLOWED: Use integer arithmetic
x = (1 + 2) / 10  # Starlark has consistent division
```

**2. Dictionaries**
```python
# Starlark guarantees deterministic iteration order
d = {"a": 1, "b": 2, "c": 3}
for k, v in d.items():
    # Order is consistent across all nodes
    print(k, v)
```

**3. Hash Functions**
```python
# Use deterministic hash functions
h = sha256(data)  # Built-in, deterministic

# FORBIDDEN: Python's hash() is non-deterministic
h = hash(data)  # Different per process
```

**4. Time**
```python
# Use block timestamp (deterministic)
t = ctx.block_time

# FORBIDDEN: System time
import time  # Not available in Starlark
t = time.time()
```

### Testing for Determinism

**Multi-Node Testing:**
- Run same contract on multiple nodes
- Compare state roots
- Verify gas consumption matches
- Automated in CI/CD pipeline

## State Management

### Storage Model

**Key-Value Store:**
```python
# Automatic persistence
state.counter = 42
state.users = {"alice": 100, "bob": 200}
state.data = [1, 2, 3, 4, 5]

# Nested structures
state.config = {
    "admin": "0x123...",
    "settings": {
        "rate": 5,
        "enabled": True
    }
}
```

**Implementation:**
```go
type ContractState struct {
    address Address
    storage map[string][]byte  // Serialized values
}

func (cs *ContractState) Get(key string) (starlark.Value, error) {
    data, exists := cs.storage[key]
    if !exists {
        return starlark.None, nil
    }
    return deserialize(data)
}

func (cs *ContractState) Set(key string, value starlark.Value) error {
    data, err := serialize(value)
    if err != nil {
        return err
    }
    cs.storage[key] = data
    return nil
}
```

### Serialization

**Format: JSON (for simplicity) or MessagePack (for efficiency)**

```python
# Python value -> JSON -> Store
state.config = {"rate": 5}

# Stored as:
# key: "config"
# value: {"rate": 5}  (JSON serialized)
```

**Supported Types:**
- Primitives: int, float, string, bool
- Collections: list, dict, tuple
- Custom: Address type
- Unsupported: functions, modules

## Contract Deployment

### Deployment Process

1. **User submits deployment transaction**
```python
tx = {
    'type': 'create_contract',
    'code': contract_source_code,
    'args': [init_arg1, init_arg2],
    'gas_limit': 5000000
}
```

2. **Blockchain validates code**
- Syntax validation
- Size limits (max 24 KB)
- No malicious patterns

3. **Contract deployed**
- Generate contract address (from creator + nonce)
- Store code on-chain
- Call `init()` function if present
- Assign initial storage

4. **Return contract address**

### Address Generation

```
contract_address = sha256(creator_address + creator_nonce + code_hash)[:20]
```

## Contract Interaction

### Function Calls

**External Calls (from users):**
```python
# User transaction
tx = {
    'to': contract_address,
    'function': 'transfer',
    'args': ['0xrecipient...', 100],
    'value': 0,
    'gas_limit': 100000
}
```

**Internal Calls (contract-to-contract):**
```python
# In contract code
result = call(
    contract_address='0xother...',
    function='get_rate',
    args=[],
    gas_limit=50000
)
```

### Events

**Emission:**
```python
# In contract
emit("Transfer", sender=ctx.sender, to=recipient, amount=amount)
```

**Storage:**
- Events stored in transaction receipts
- Indexed for querying
- Not accessible by contracts
- For off-chain consumption only

**Querying:**
```
GET /api/events?contract=0x123&event=Transfer&from_block=1000
```

## Error Handling

### Contract Errors

```python
# Explicit failures
if amount > balance:
    fail("Insufficient balance")  # Reverts transaction

# Runtime errors
x = 1 / 0  # Division by zero, reverts transaction

# Out of gas
# Automatic revert when gas exhausted
```

### Revert Behavior

**On error:**
1. All state changes reverted
2. Gas consumed up to error point (not refunded)
3. Error message included in receipt
4. Transaction marked as failed

**Error Types:**
- `OutOfGas`: Gas limit exceeded
- `Revert`: Explicit failure (fail())
- `RuntimeError`: Unexpected error (division by zero, etc.)
- `InvalidOperation`: Unauthorized action

## Upgradability

### Immutable Contracts (Default)

- Code cannot be changed after deployment
- Ensures trustlessness
- Standard blockchain practice

### Proxy Pattern (Optional)

For upgradable contracts:
```python
# Proxy contract
def delegate_call(target, function, args):
    """Forward call to implementation contract"""
    return call(state.implementation, function, args)

def upgrade(new_implementation):
    """Upgrade to new implementation"""
    if ctx.sender != state.admin:
        fail("Not authorized")
    state.implementation = new_implementation
```

**Trade-offs:**
- Flexibility vs. trustlessness
- Admin key becomes single point of failure
- Recommendation: Use immutability by default

## Testing Framework

### Unit Testing

```python
# test_token.py
from afterblock_test import TestCase, deploy_contract, call_contract

class TokenTest(TestCase):
    def setUp(self):
        self.contract = deploy_contract(
            'token.star',
            init_args=['Alice']
        )

    def test_transfer(self):
        result = call_contract(
            self.contract,
            'transfer',
            ['Bob', 100],
            sender='Alice'
        )
        self.assertTrue(result)

        balance = call_contract(
            self.contract,
            'balance_of',
            ['Bob']
        )
        self.assertEqual(balance, 100)
```

### Integration Testing

- Test contract interactions
- Test IPFS integration
- Test gas consumption
- Test error handling

### Fuzzing

- Generate random inputs
- Test edge cases
- Discover vulnerabilities
- Automated with Wake or Brownie

## Performance Optimization

### Caching

**Compiled Code:**
- Cache parsed Starlark AST
- Reuse across transactions
- Invalidate on code change

**State Access:**
- Cache frequently accessed state
- Batch state reads/writes
- Reduce storage I/O

### Parallel Execution

**Independent Transactions:**
- Execute in parallel if no state conflicts
- Detect conflicts via read/write sets
- Re-execute conflicting transactions serially

**Implementation:**
```
Block: [tx1, tx2, tx3, tx4]
↓
Analyze dependencies
↓
Parallel Groups:
  Group 1: [tx1, tx3] (no conflicts)
  Group 2: [tx2, tx4] (no conflicts)
↓
Execute groups in parallel
```

### Gas Optimization

**For developers:**
- Minimize storage writes
- Use local variables
- Batch operations
- Avoid redundant computations

**For VM:**
- Optimize hot paths
- JIT compilation (future)
- Hardware acceleration (future)

## Security Auditing

### Static Analysis

**Automated Tools:**
- Syntax validation
- Pattern detection (reentrancy, integer overflow)
- Gas estimation
- Complexity analysis

**Custom Rules:**
```python
# Detect potential issues
def check_reentrancy(ast):
    """Detect reentrancy vulnerabilities"""
    for call in find_external_calls(ast):
        if has_state_change_after(call):
            warn("Potential reentrancy")
```

### Runtime Monitoring

- Gas consumption profiling
- Execution time tracking
- Storage growth monitoring
- Error rate analysis

### Formal Verification (Future)

- Mathematical proofs of correctness
- Verify invariants
- Prove safety properties
- Integration with verification tools
