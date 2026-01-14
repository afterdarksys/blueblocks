# IPFS Integration & Encrypted Storage

## Overview

AfterBlock integrates IPFS (InterPlanetary File System) for decentralized file storage with built-in encryption. This design ensures privacy, data availability, and immutability while leveraging blockchain for access control and metadata management.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────┐
│            Smart Contract Layer                 │
│  - Access Control                               │
│  - Metadata Management                          │
│  - CID Registry                                 │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│         IPFS Integration Module (Go)            │
│  ┌──────────────────────────────────────────┐  │
│  │  Encryption Layer                        │  │
│  │  - AES-256-GCM                           │  │
│  │  - Key Derivation (HKDF)                │  │
│  │  - Metadata Management                   │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │  IPFS Client (go-ipfs)                  │  │
│  │  - Content Upload/Download              │  │
│  │  - Pinning Management                   │  │
│  │  - DHT Queries                          │  │
│  └──────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│              IPFS Network                       │
│  - Distributed Hash Table (DHT)                │
│  - Content Addressing (CID)                    │
│  - Peer-to-Peer File Transfer                  │
└─────────────────────────────────────────────────┘
```

## IPFS Fundamentals

### Content Addressing

**Traditional (location-based):**
```
https://server.com/file.pdf
```

**IPFS (content-based):**
```
QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
```

**Benefits:**
- Immutability: Content changes → new CID
- Deduplication: Same content → same CID
- Verifiability: Hash proves authenticity
- Decentralization: Fetch from any peer

### Content Identifiers (CIDs)

**Structure:**
```
<version><codec><multihash>

Example:
QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
│    │
│    └─ SHA-256 hash of content
└────── CIDv0 (SHA-256 by default)

bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
│     │      │
│     │      └─ SHA-256 hash
│     └──────── Codec (dag-pb, raw, etc.)
└──────────────── CIDv1
```

### File Storage

**Small Files (< 256 KB):**
```
File → Add to IPFS → Single Block → CID
```

**Large Files (> 256 KB):**
```
File → Split into Chunks (256 KB each)
     → Create Merkle DAG
     → Root CID

Example:
File (1 MB)
├── Chunk 1 (256 KB) → CID1
├── Chunk 2 (256 KB) → CID2
├── Chunk 3 (256 KB) → CID3
└── Chunk 4 (256 KB) → CID4
    └── Root → CID (points to all chunks)
```

## Encryption Layer

### Encryption Requirements

**Why Encrypt?**
- IPFS data is public by default
- Anyone with CID can download content
- Privacy requires encryption before upload

**When to Encrypt:**
- Personal data (user files, documents)
- Sensitive business data
- Private smart contract data
- Healthcare, financial records

**When Not to Encrypt:**
- Public assets (images, logos)
- Open data (documentation)
- Shared resources (libraries)

### Encryption Scheme

**Algorithm: AES-256-GCM**

**Benefits:**
- Industry standard
- Authenticated encryption (prevents tampering)
- Fast hardware acceleration
- NIST approved

**Parameters:**
```
Key Size: 256 bits (32 bytes)
Nonce/IV: 96 bits (12 bytes), random per file
Tag Size: 128 bits (16 bytes), for authentication
```

### Key Management Strategies

#### Option 1: User-Controlled Keys (Default)

**Flow:**
```
1. User generates encryption key (client-side)
2. Encrypt file with key
3. Upload to IPFS → CID
4. Store CID on-chain (no key stored)
5. User manages key (backup, recovery)
```

**Advantages:**
- Maximum privacy (blockchain never sees key)
- User has full control
- No trust required

**Disadvantages:**
- Key loss = data loss
- User responsible for key backup
- No key recovery mechanism

**Implementation:**
```python
# In smart contract
def upload_file_user_key(encrypted_data):
    """Upload pre-encrypted file"""
    # User encrypted client-side
    cid = ipfs_upload(encrypted_data, encrypt=False)

    state.files[ctx.sender].append({
        'cid': cid,
        'encryption': 'user-controlled',
        'timestamp': ctx.block_time
    })

    return cid
```

#### Option 2: Key Derivation from Blockchain Identity

**Flow:**
```
1. Derive key from user's private key + file identifier
2. Deterministic: same inputs → same key
3. Encrypt file with derived key
4. Upload to IPFS → CID
5. Store CID on-chain
6. User can re-derive key anytime
```

**Key Derivation:**
```python
key = HKDF(
    user_private_key,  # Master secret
    salt=cid,          # Unique per file
    info="afterblock-ipfs-v1"
)
```

**Advantages:**
- No key storage needed
- Key recovery via private key
- Deterministic

**Disadvantages:**
- Key compromise if private key leaked
- Sharing requires key transmission

#### Option 3: Shared Key with Access Control

**Flow:**
```
1. Contract generates encryption key
2. Encrypt file with key
3. Upload to IPFS → CID
4. Encrypt key with each authorized user's public key
5. Store encrypted keys on-chain
```

**Example:**
```python
# Contract generates key
file_key = random_bytes(32)

# Encrypt file
encrypted_data = aes_encrypt(file_key, file_data)
cid = ipfs_upload(encrypted_data, encrypt=False)

# Encrypt key for each user
for user in authorized_users:
    encrypted_key = rsa_encrypt(user.public_key, file_key)
    state.access[cid][user] = encrypted_key
```

**Advantages:**
- Easy sharing and revocation
- Fine-grained access control
- User doesn't manage keys

**Disadvantages:**
- Contract must manage keys (attack surface)
- Storage cost for encrypted keys
- Performance overhead

### Encryption Implementation

**Go Implementation:**
```go
package ipfs

import (
    "crypto/aes"
    "crypto/cipher"
    "crypto/rand"
    "io"
)

type EncryptionMetadata struct {
    Algorithm string
    KeyDerivation string
    Nonce []byte
    Tag []byte
}

func EncryptFile(plaintext []byte, key []byte) ([]byte, EncryptionMetadata, error) {
    // Create AES cipher
    block, err := aes.NewCipher(key)
    if err != nil {
        return nil, EncryptionMetadata{}, err
    }

    // Create GCM mode
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return nil, EncryptionMetadata{}, err
    }

    // Generate random nonce
    nonce := make([]byte, gcm.NonceSize())
    if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
        return nil, EncryptionMetadata{}, err
    }

    // Encrypt and authenticate
    ciphertext := gcm.Seal(nil, nonce, plaintext, nil)

    metadata := EncryptionMetadata{
        Algorithm: "AES-256-GCM",
        KeyDerivation: "HKDF-SHA256",
        Nonce: nonce,
    }

    return ciphertext, metadata, nil
}

func DecryptFile(ciphertext []byte, key []byte, metadata EncryptionMetadata) ([]byte, error) {
    // Create AES cipher
    block, err := aes.NewCipher(key)
    if err != nil {
        return nil, err
    }

    // Create GCM mode
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return nil, err
    }

    // Decrypt and verify
    plaintext, err := gcm.Open(nil, metadata.Nonce, ciphertext, nil)
    if err != nil {
        return nil, err
    }

    return plaintext, nil
}
```

## IPFS Integration

### go-ipfs Client

**Installation:**
```go
import (
    ipfs "github.com/ipfs/go-ipfs-api"
)
```

**Initialization:**
```go
// Connect to local IPFS node
shell := ipfs.NewShell("localhost:5001")

// Or connect to remote node
shell := ipfs.NewShell("https://ipfs.example.com:5001")
```

### File Upload

**Flow:**
```
1. Receive file data
2. Encrypt file
3. Upload to IPFS
4. Pin content (prevent garbage collection)
5. Return CID
```

**Implementation:**
```go
func UploadFile(data []byte, encrypt bool) (string, error) {
    var uploadData []byte
    var metadata EncryptionMetadata

    if encrypt {
        key := generateKey()
        encrypted, meta, err := EncryptFile(data, key)
        if err != nil {
            return "", err
        }
        uploadData = encrypted
        metadata = meta
    } else {
        uploadData = data
    }

    // Upload to IPFS
    cid, err := shell.Add(bytes.NewReader(uploadData))
    if err != nil {
        return "", err
    }

    // Pin content
    err = shell.Pin(cid)
    if err != nil {
        return "", err
    }

    // Store metadata on-chain
    storeMetadata(cid, metadata)

    return cid, nil
}
```

### File Download

**Flow:**
```
1. Receive CID
2. Query IPFS for content
3. Verify integrity (CID matches content hash)
4. Decrypt if encrypted
5. Return plaintext
```

**Implementation:**
```go
func DownloadFile(cid string, key []byte) ([]byte, error) {
    // Fetch from IPFS
    reader, err := shell.Cat(cid)
    if err != nil {
        return nil, err
    }
    defer reader.Close()

    ciphertext, err := io.ReadAll(reader)
    if err != nil {
        return nil, err
    }

    // Get metadata
    metadata, err := getMetadata(cid)
    if err != nil {
        return nil, err
    }

    // Decrypt if needed
    if metadata.Algorithm != "" {
        plaintext, err := DecryptFile(ciphertext, key, metadata)
        if err != nil {
            return nil, err
        }
        return plaintext, nil
    }

    return ciphertext, nil
}
```

## Smart Contract Interface

### Python API

**Upload File:**
```python
def upload_document(data, public=False):
    """Upload document to IPFS with encryption"""

    # Encrypt unless public
    cid = ipfs_upload(data, encrypt=not public)

    # Store metadata on-chain
    state.files[ctx.sender].append({
        'cid': cid,
        'public': public,
        'timestamp': ctx.block_time,
        'size': len(data)
    })

    emit("FileUploaded", owner=ctx.sender, cid=cid)
    return cid
```

**Download File:**
```python
def download_document(cid):
    """Download document from IPFS"""

    # Check access
    file_info = find_file(cid)
    if not file_info:
        fail("File not found")

    if not file_info['public'] and file_info['owner'] != ctx.sender:
        if not has_access(cid, ctx.sender):
            fail("Access denied")

    # Fetch from IPFS (decryption handled by VM)
    data = ipfs_get(cid)
    return data
```

**Share File:**
```python
def share_file(cid, recipient):
    """Grant access to encrypted file"""

    # Verify ownership
    file_info = find_file(cid)
    if file_info['owner'] != ctx.sender:
        fail("Not owner")

    # Grant access
    state.access[cid][recipient] = True
    emit("FileShared", cid=cid, owner=ctx.sender, recipient=recipient)
```

**Revoke Access:**
```python
def revoke_access(cid, user):
    """Revoke access to file"""

    file_info = find_file(cid)
    if file_info['owner'] != ctx.sender:
        fail("Not owner")

    state.access[cid].pop(user, None)
    emit("AccessRevoked", cid=cid, owner=ctx.sender, user=user)
```

## On-Chain Metadata

### File Registry

**Structure:**
```python
state.files = {
    'owner_address': [
        {
            'cid': 'QmXxx...',
            'name': 'document.pdf',
            'size': 1024000,
            'mime_type': 'application/pdf',
            'encrypted': True,
            'encryption_scheme': 'AES-256-GCM',
            'timestamp': 1704067200,
            'public': False,
            'tags': ['important', 'legal']
        }
    ]
}

state.access = {
    'cid': {
        'user_address': {
            'granted': 1704067200,
            'expires': None,
            'permissions': ['read']
        }
    }
}
```

### Queries

**List User Files:**
```python
def list_my_files():
    """List all files owned by caller"""
    return state.files.get(ctx.sender, [])
```

**Search Files:**
```python
def search_files(tag):
    """Search files by tag"""
    results = []
    for file in state.files.get(ctx.sender, []):
        if tag in file.get('tags', []):
            results.append(file)
    return results
```

**Check Access:**
```python
def check_access(cid, user):
    """Check if user has access to file"""
    file_info = find_file(cid)

    if file_info['public']:
        return True

    if file_info['owner'] == user:
        return True

    access = state.access.get(cid, {}).get(user)
    if not access:
        return False

    # Check expiration
    if access.get('expires') and access['expires'] < ctx.block_time:
        return False

    return True
```

## Pinning Strategy

### Problem: Garbage Collection

IPFS nodes may unpinned content to free space:
- Content becomes unavailable
- No guarantee of persistence

### Solution: Pinning

**What is Pinning?**
- Mark content as "do not delete"
- Ensures availability
- Required for important data

**Pinning Services:**
1. **Self-hosted**: Run your own IPFS nodes
2. **Pinata**: Commercial pinning service
3. **Web3.Storage**: Free pinning (Filecoin backed)
4. **Filebase**: S3-compatible IPFS storage

### Implementation

**Automatic Pinning:**
```go
func (m *IPFSModule) UploadWithPinning(data []byte) (string, error) {
    // Upload to local node
    cid, err := m.shell.Add(bytes.NewReader(data))
    if err != nil {
        return "", err
    }

    // Pin locally
    err = m.shell.Pin(cid)
    if err != nil {
        return "", err
    }

    // Pin to remote service
    err = m.pinToService(cid)
    if err != nil {
        log.Printf("Remote pinning failed: %v", err)
        // Continue even if remote pinning fails
    }

    return cid, nil
}
```

**Incentivized Pinning (Future):**
```python
# Smart contract for pinning incentives
def request_pinning(cid, reward):
    """Pay nodes to pin content"""

    transfer_tokens(ctx.sender, contract_address, reward)

    state.pin_requests[cid] = {
        'requester': ctx.sender,
        'reward': reward,
        'pinners': []
    }

    emit("PinRequested", cid=cid, reward=reward)
```

## Private IPFS Networks

### Use Case

- Enterprise deployments
- Private data sharing
- Regulatory compliance
- Performance optimization

### Setup

**Swarm Key:**
```
/key/swarm/psk/1.0.0/
/base16/
<64-byte hex key>
```

**Configuration:**
```bash
# Generate swarm key
echo -e "/key/swarm/psk/1.0.0/\n/base16/\n$(openssl rand -hex 32)" > swarm.key

# Configure IPFS node
ipfs init
cp swarm.key ~/.ipfs/
ipfs bootstrap rm --all
ipfs bootstrap add /ip4/<private-node-ip>/tcp/4001/p2p/<peer-id>
```

**Benefits:**
- Content only accessible within network
- Faster retrieval (fewer hops)
- Guaranteed availability (controlled nodes)
- Additional encryption layer

## Performance Optimization

### Chunking Strategy

**Default (256 KB chunks):**
```
Good for: General purpose
```

**Large Chunks (1 MB):**
```
Good for: Large files, sequential access
Reduces: Merkle DAG depth, metadata overhead
```

**Small Chunks (64 KB):**
```
Good for: Deduplication, partial downloads
Increases: Flexibility, sharing efficiency
```

### Caching

**Local Cache:**
```go
type IPFSCache struct {
    cache map[string][]byte
    maxSize int64
    currentSize int64
}

func (c *IPFSCache) Get(cid string) ([]byte, bool) {
    data, exists := c.cache[cid]
    return data, exists
}

func (c *IPFSCache) Put(cid string, data []byte) {
    if c.currentSize + int64(len(data)) > c.maxSize {
        c.evict()
    }
    c.cache[cid] = data
    c.currentSize += int64(len(data))
}
```

### Compression

**Before Encryption:**
```go
// Compress before encrypting
compressed := gzip.Compress(data)
encrypted := Encrypt(compressed, key)
cid := ipfs.Upload(encrypted)

// Savings: 50-90% for text, 10-30% for images
```

## Monitoring & Analytics

### Metrics

**Storage Metrics:**
- Total files uploaded
- Total storage used
- Files per user
- Average file size

**Usage Metrics:**
- Upload frequency
- Download frequency
- Access patterns
- Popular content

**Performance Metrics:**
- Upload latency
- Download latency
- Pinning success rate
- Availability (uptime)

### Implementation

```python
# Track metrics in smart contract
state.metrics = {
    'total_uploads': 0,
    'total_size': 0,
    'total_downloads': 0
}

def upload_with_metrics(data):
    cid = ipfs_upload(data, encrypt=True)

    state.metrics['total_uploads'] += 1
    state.metrics['total_size'] += len(data)

    return cid
```

## Security Considerations

### Threats

**1. Key Leakage**
- Encrypted data exposed if key leaked
- Mitigation: Secure key management, rotation

**2. CID Enumeration**
- Attacker tries random CIDs
- Mitigation: Long CIDs (low probability), rate limiting

**3. Side-Channel Attacks**
- File size leaks information
- Mitigation: Padding, size obfuscation

**4. Man-in-the-Middle**
- Attacker intercepts IPFS traffic
- Mitigation: TLS for IPFS API, QUIC transport

### Best Practices

1. **Always encrypt sensitive data**
2. **Use strong keys (256-bit)**
3. **Rotate keys periodically**
4. **Backup keys securely**
5. **Audit access logs**
6. **Monitor for anomalies**
7. **Use private networks for sensitive data**
8. **Implement rate limiting**

## Future Enhancements

### Filecoin Integration

**Benefits:**
- Guaranteed storage via smart contracts
- Proof of storage (cryptographic proofs)
- Economic incentives for pinning
- Long-term archival

**Implementation:**
```python
def store_on_filecoin(cid, duration, price):
    """Store IPFS content on Filecoin"""
    deal_id = filecoin_create_deal(cid, duration, price)
    state.filecoin_deals[cid] = deal_id
    return deal_id
```

### Content Delivery Network (CDN)

**IPFS Gateways:**
- https://ipfs.io/ipfs/<cid>
- https://gateway.pinata.cloud/ipfs/<cid>
- Caching at edge locations
- Faster retrieval for end users

### Versioning

**File Versions:**
```python
state.files[owner][filename] = {
    'latest': 'QmLatest...',
    'versions': [
        {'cid': 'QmV1...', 'timestamp': 1704067200},
        {'cid': 'QmV2...', 'timestamp': 1704070800},
        {'cid': 'QmV3...', 'timestamp': 1704074400}
    ]
}
```

### Deduplication

**Cross-User Deduplication:**
- Same content → same CID
- Storage savings
- Privacy-preserving (encrypted data still unique)
