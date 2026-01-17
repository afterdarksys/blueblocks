# BlueBlocks P2P Protocol Specification

## HIPAA-Compliant Secure Healthcare Data Transfer

Version: 1.0.0
Status: Draft

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Security Model](#security-model)
4. [Discovery Service](#discovery-service)
5. [Transport Protocol](#transport-protocol)
6. [Data Transfer Protocol](#data-transfer-protocol)
7. [Encryption Layers](#encryption-layers)
8. [HIPAA Compliance](#hipaa-compliance)
9. [Message Formats](#message-formats)
10. [Error Handling](#error-handling)

---

## 1. Overview

The BlueBlocks P2P Protocol enables secure, decentralized transfer of Protected Health Information (PHI) including:
- Medical records (FHIR R4 format)
- Medical images (DICOM, JPEG, PNG)
- Video (consultations, procedures)
- Lab results and diagnostic data

### Design Principles

1. **Zero-Knowledge Transport**: Relay nodes cannot decrypt or inspect PHI
2. **End-to-End Encryption**: Only authorized parties can decrypt data
3. **Audit Trail**: All access logged immutably on-chain
4. **Patient Control**: Patients own and control access to their data
5. **Regulatory Compliance**: HIPAA, GDPR, HITECH compliant by design

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        BlueBlocks P2P Network                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐     ┌─────────────────────┐     ┌─────────────┐       │
│  │   Patient   │     │  Discovery Service  │     │  Provider   │       │
│  │   Client    │◄───►│    (HTTPS API)      │◄───►│   Client    │       │
│  └──────┬──────┘     └─────────────────────┘     └──────┬──────┘       │
│         │                      │                         │              │
│         │            ┌─────────┴─────────┐               │              │
│         │            │                   │               │              │
│         ▼            ▼                   ▼               ▼              │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │                    Relay Network (P2P Mesh)                  │       │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │       │
│  │  │ Relay 1 │◄►│ Relay 2 │◄►│ Relay 3 │◄►│ Relay N │        │       │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │                   Storage Layer                              │       │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │       │
│  │  │   IPFS      │  │  S3/Blob    │  │  On-Chain   │         │       │
│  │  │  (Encrypted)│  │  (Encrypted)│  │  (Metadata) │         │       │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Components

| Component | Description | Technology |
|-----------|-------------|------------|
| Discovery Service | Central registration & routing | HTTPS REST API |
| Relay Nodes | Encrypted data forwarding | WebSocket/QUIC |
| Client SDK | End-user application library | Go/TypeScript |
| Storage | Encrypted data persistence | IPFS, S3, Blockchain |

---

## 3. Security Model

### Cryptographic Primitives

| Purpose | Algorithm | Key Size | Notes |
|---------|-----------|----------|-------|
| Key Exchange | X25519 (Curve25519) | 256-bit | ECDH for session keys |
| Symmetric Encryption | AES-256-GCM | 256-bit | Authenticated encryption |
| Asymmetric Signing | Ed25519 | 256-bit | Fast signatures |
| Key Derivation | Argon2id | N/A | Memory-hard KDF |
| Hashing | BLAKE3 | 256-bit | Fast cryptographic hash |
| Random | ChaCha20 | N/A | CSPRNG |

### Key Hierarchy

```
Master Key (Patient/Provider)
    │
    ├── Identity Key (Ed25519) ─────► Signing & Authentication
    │
    ├── Encryption Key (X25519) ────► Key Exchange
    │
    └── Data Keys (AES-256)
            │
            ├── Record Key ─────────► Per-record encryption
            ├── Session Key ────────► Per-session encryption
            └── File Key ──────────► Per-file encryption (large files)
```

### Trust Model

1. **Patients**: Hold master keys, control all access
2. **Providers**: Receive delegated access via smart contracts
3. **Relay Nodes**: Zero-knowledge, cannot decrypt data
4. **Discovery Service**: Knows peer metadata, not data content
5. **Validators**: Verify access permissions on-chain

---

## 4. Discovery Service

### HTTPS API Endpoints

Base URL: `https://discovery.blueblocks.xyz/api/v1`

#### Peer Registration

```http
POST /peers/register
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "peer_id": "12D3KooW...",
  "public_key": "ed25519:...",
  "encryption_key": "x25519:...",
  "capabilities": ["patient", "provider", "relay"],
  "endpoints": [
    {
      "protocol": "wss",
      "address": "wss://peer.example.com:443/p2p",
      "priority": 1
    },
    {
      "protocol": "quic",
      "address": "quic://1.2.3.4:4242",
      "priority": 2
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "region": "us-west-2",
    "npi": "1234567890"  // For healthcare providers
  },
  "signature": "..."
}

Response 201:
{
  "status": "registered",
  "peer_id": "12D3KooW...",
  "token": "<session_token>",
  "ttl": 3600,
  "bootstrap_peers": [...]
}
```

#### Heartbeat

```http
POST /peers/{peer_id}/heartbeat
Authorization: Bearer <session_token>
Content-Type: application/json

{
  "timestamp": 1705420800,
  "load": 0.45,
  "connections": 12,
  "bandwidth_available_mbps": 100,
  "signature": "..."
}

Response 200:
{
  "status": "alive",
  "next_heartbeat_ms": 30000,
  "announcements": [...]
}
```

#### Peer Discovery

```http
GET /peers?capability=provider&region=us-west-2&limit=20
Authorization: Bearer <session_token>

Response 200:
{
  "peers": [
    {
      "peer_id": "12D3KooW...",
      "public_key": "ed25519:...",
      "encryption_key": "x25519:...",
      "endpoints": [...],
      "reputation": 0.98,
      "latency_ms": 45,
      "last_seen": "2024-01-16T12:00:00Z"
    }
  ],
  "total": 156,
  "page": 1
}
```

#### Request Relay Route

```http
POST /routes/request
Authorization: Bearer <session_token>
Content-Type: application/json

{
  "source_peer_id": "12D3KooW...",
  "destination_peer_id": "12D3KooX...",
  "data_type": "medical_record",
  "estimated_size_bytes": 1048576,
  "priority": "normal",
  "signature": "..."
}

Response 200:
{
  "route_id": "route_abc123",
  "path": [
    {"peer_id": "relay1", "endpoint": "wss://..."},
    {"peer_id": "relay2", "endpoint": "wss://..."}
  ],
  "session_key_encrypted": "...",  // Encrypted to source
  "ttl_seconds": 300
}
```

---

## 5. Transport Protocol

### Connection Establishment

```
Client A                    Discovery                    Client B
    │                           │                            │
    │──── Register ────────────►│                            │
    │◄─── Session Token ────────│                            │
    │                           │                            │
    │                           │◄──── Register ─────────────│
    │                           │───── Session Token ───────►│
    │                           │                            │
    │──── Request Route ───────►│                            │
    │◄─── Route + Relays ───────│                            │
    │                           │                            │
    │══════ WebSocket/QUIC Connection via Relays ═══════════►│
    │                           │                            │
    │◄════════════ Encrypted Data Channel ═════════════════►│
```

### WebSocket Transport Frame

```
┌────────────────────────────────────────────────────────────┐
│                    P2P Transport Frame                      │
├──────────┬───────────┬─────────────┬───────────────────────┤
│  Header  │  Routing  │   Payload   │   Authentication      │
│ (8 bytes)│ (Variable)│  (Variable) │      (64 bytes)       │
├──────────┼───────────┼─────────────┼───────────────────────┤
│ Version  │ Src Peer  │  Encrypted  │  Ed25519 Signature    │
│ Type     │ Dst Peer  │  Data       │  of Header+Routing    │
│ Length   │ Route ID  │             │  +Payload             │
│ Flags    │ Hop Count │             │                       │
└──────────┴───────────┴─────────────┴───────────────────────┘
```

### Frame Types

| Type | Value | Description |
|------|-------|-------------|
| HANDSHAKE | 0x01 | Key exchange initiation |
| HANDSHAKE_ACK | 0x02 | Key exchange completion |
| DATA | 0x03 | Encrypted data payload |
| DATA_ACK | 0x04 | Data acknowledgment |
| CHUNK | 0x05 | Large file chunk |
| CHUNK_ACK | 0x06 | Chunk acknowledgment |
| PING | 0x07 | Keepalive |
| PONG | 0x08 | Keepalive response |
| CLOSE | 0x09 | Connection termination |
| ERROR | 0x0A | Error notification |

---

## 6. Data Transfer Protocol

### Small Data Transfer (< 1MB)

```
Sender                                              Receiver
   │                                                    │
   │──── HANDSHAKE (ephemeral pubkey) ─────────────────►│
   │◄─── HANDSHAKE_ACK (ephemeral pubkey) ─────────────│
   │                                                    │
   │     [Session key derived via X25519 ECDH]          │
   │                                                    │
   │──── DATA (encrypted payload) ─────────────────────►│
   │◄─── DATA_ACK ─────────────────────────────────────│
   │                                                    │
   │──── CLOSE ────────────────────────────────────────►│
```

### Large File Transfer (> 1MB)

For medical images and video, files are chunked:

```
Sender                                              Receiver
   │                                                    │
   │──── HANDSHAKE ────────────────────────────────────►│
   │◄─── HANDSHAKE_ACK ────────────────────────────────│
   │                                                    │
   │──── DATA (file metadata) ─────────────────────────►│
   │     {                                              │
   │       "file_id": "...",                            │
   │       "filename": "mri_scan.dcm",                  │
   │       "mime_type": "application/dicom",            │
   │       "size_bytes": 52428800,                      │
   │       "chunk_size": 1048576,                       │
   │       "total_chunks": 50,                          │
   │       "hash": "blake3:..."                         │
   │     }                                              │
   │◄─── DATA_ACK ─────────────────────────────────────│
   │                                                    │
   │──── CHUNK[0] (encrypted) ─────────────────────────►│
   │◄─── CHUNK_ACK[0] ─────────────────────────────────│
   │                                                    │
   │──── CHUNK[1] (encrypted) ─────────────────────────►│
   │◄─── CHUNK_ACK[1] ─────────────────────────────────│
   │                                                    │
   │     ... (parallel chunks for speed) ...            │
   │                                                    │
   │──── CHUNK[49] (encrypted) ────────────────────────►│
   │◄─── CHUNK_ACK[49] ────────────────────────────────│
   │                                                    │
   │◄─── DATA_ACK (file complete, hash verified) ──────│
   │                                                    │
   │──── CLOSE ────────────────────────────────────────►│
```

### Chunk Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      Encrypted Chunk                         │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Chunk ID   │   Sequence   │    Data      │   Auth Tag     │
│  (16 bytes)  │  (4 bytes)   │  (Variable)  │   (16 bytes)   │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                                                              │
│  Nonce: chunk_id || sequence (unique per chunk)             │
│  Encryption: AES-256-GCM                                     │
│  Additional Data: file_id || chunk_index                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. Encryption Layers

### Layer 1: Transport Encryption (TLS 1.3)

- All HTTPS/WSS connections use TLS 1.3
- Certificate pinning for discovery service
- Perfect forward secrecy

### Layer 2: Relay Encryption (Onion-style)

Each hop sees only the next destination:

```
┌─────────────────────────────────────────────────────────────┐
│  Original Data                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Encrypt(K_receiver, Data)                           │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │  Encrypt(K_relay2, {next: receiver, data})  │    │    │
│  │  │  ┌─────────────────────────────────────┐    │    │    │
│  │  │  │  Encrypt(K_relay1, {next: relay2})  │    │    │    │
│  │  │  └─────────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Layer 3: Application Encryption (PHI)

Medical data is encrypted before any transport:

```go
type EncryptedHealthRecord struct {
    RecordID      string            `json:"record_id"`
    EncryptedData []byte            `json:"encrypted_data"`  // AES-256-GCM
    Nonce         []byte            `json:"nonce"`           // 12 bytes
    AuthTag       []byte            `json:"auth_tag"`        // 16 bytes
    KeyID         string            `json:"key_id"`          // Reference to data key
    AccessPolicy  AccessPolicy      `json:"access_policy"`   // On-chain reference
    Signature     []byte            `json:"signature"`       // Patient signature
}
```

---

## 8. HIPAA Compliance

### Technical Safeguards Mapping

| HIPAA Requirement | Implementation |
|-------------------|----------------|
| Access Control (§164.312(a)(1)) | Patient-controlled key management, smart contract ACL |
| Audit Controls (§164.312(b)) | Immutable on-chain audit log |
| Integrity (§164.312(c)(1)) | BLAKE3 hashing, Ed25519 signatures |
| Transmission Security (§164.312(e)(1)) | TLS 1.3 + E2E encryption |
| Encryption (§164.312(a)(2)(iv)) | AES-256-GCM at rest and in transit |
| Authentication (§164.312(d)) | Ed25519 signatures, NPI verification |

### Access Control Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contract ACL                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AccessGrant {                                               │
│    record_id:    "rec_abc123"                               │
│    patient:      "bb1234...patient"                         │
│    grantee:      "bb5678...provider"                        │
│    grantee_type: "healthcare_provider"                      │
│    permissions:  ["read", "annotate"]                       │
│    granted_at:   1705420800                                 │
│    expires_at:   1736956800                                 │
│    revoked:      false                                      │
│    purpose:      "ongoing_treatment"                        │
│    npi:          "1234567890"                               │
│  }                                                          │
│                                                              │
│  func check_access(record_id, requester, permission):       │
│    grant = get_grant(record_id, requester)                  │
│    if grant.revoked: return DENIED                          │
│    if grant.expires_at < now(): return EXPIRED              │
│    if permission not in grant.permissions: return DENIED    │
│    log_access(record_id, requester, permission)             │
│    return ALLOWED                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Audit Log Entry

```json
{
  "log_id": "log_xyz789",
  "timestamp": "2024-01-16T12:30:00Z",
  "action": "read",
  "record_id": "rec_abc123",
  "patient_address": "bb1234...patient",
  "accessor_address": "bb5678...provider",
  "accessor_npi": "1234567890",
  "access_reason": "treatment",
  "ip_hash": "sha256:...",  // Hashed for privacy
  "success": true,
  "block_height": 12345,
  "tx_hash": "0x..."
}
```

---

## 9. Message Formats

### Handshake Message

```json
{
  "type": "HANDSHAKE",
  "version": "1.0",
  "sender_peer_id": "12D3KooW...",
  "ephemeral_public_key": "x25519:...",
  "supported_ciphers": ["AES-256-GCM", "ChaCha20-Poly1305"],
  "timestamp": 1705420800,
  "nonce": "random_32_bytes_hex",
  "signature": "ed25519:..."
}
```

### Data Message

```json
{
  "type": "DATA",
  "message_id": "msg_abc123",
  "content_type": "application/fhir+json",
  "payload": "<base64_encrypted_data>",
  "nonce": "<12_bytes_hex>",
  "auth_tag": "<16_bytes_hex>",
  "timestamp": 1705420800,
  "signature": "ed25519:..."
}
```

### Health Record Request

```json
{
  "type": "RECORD_REQUEST",
  "request_id": "req_abc123",
  "record_type": "patient_summary",
  "patient_id": "bb1234...patient",
  "requester_id": "bb5678...provider",
  "access_proof": {
    "grant_tx": "0x...",
    "block_height": 12345,
    "merkle_proof": [...]
  },
  "purpose": "emergency_treatment",
  "timestamp": 1705420800,
  "signature": "ed25519:..."
}
```

---

## 10. Error Handling

### Error Codes

| Code | Name | Description |
|------|------|-------------|
| E001 | PEER_NOT_FOUND | Target peer not registered |
| E002 | ACCESS_DENIED | Insufficient permissions |
| E003 | GRANT_EXPIRED | Access grant has expired |
| E004 | GRANT_REVOKED | Access grant was revoked |
| E005 | INVALID_SIGNATURE | Message signature verification failed |
| E006 | ENCRYPTION_ERROR | Decryption failed |
| E007 | ROUTE_UNAVAILABLE | No route to destination |
| E008 | TIMEOUT | Request timed out |
| E009 | RATE_LIMITED | Too many requests |
| E010 | INVALID_FORMAT | Malformed message |
| E011 | FILE_TOO_LARGE | File exceeds maximum size |
| E012 | CHUNK_MISSING | Missing chunk in transfer |
| E013 | HASH_MISMATCH | File integrity check failed |

### Error Response

```json
{
  "type": "ERROR",
  "error_code": "E002",
  "error_name": "ACCESS_DENIED",
  "message": "No valid access grant found for this record",
  "request_id": "req_abc123",
  "timestamp": 1705420800,
  "details": {
    "record_id": "rec_xyz789",
    "required_permission": "read"
  }
}
```

---

## Appendix A: Constants

```go
const (
    // Timeouts
    HandshakeTimeout    = 10 * time.Second
    TransferTimeout     = 5 * time.Minute
    HeartbeatInterval   = 30 * time.Second
    SessionTTL          = 1 * time.Hour

    // Limits
    MaxMessageSize      = 10 * 1024 * 1024  // 10 MB
    MaxChunkSize        = 1 * 1024 * 1024   // 1 MB
    MaxFileSize         = 5 * 1024 * 1024 * 1024  // 5 GB
    MaxConcurrentChunks = 10

    // Crypto
    NonceSize           = 12
    AuthTagSize         = 16
    KeySize             = 32
    SignatureSize       = 64
)
```

---

## Appendix B: Reference Implementation

See `preapproved-implementations/lib/p2p/` for the Go implementation.

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2024-01-16 | BlueBlocks Team | Initial specification |
