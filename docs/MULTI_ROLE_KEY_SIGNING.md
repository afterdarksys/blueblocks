# Multi-Role Key Signing System for Block Production
## BlueBlocks Medical Blockchain

**Version:** 1.0
**Date:** 2026-01-14
**Status:** Design Specification

---

## Overview

In BlueBlocks, each block is signed by multiple roles to establish:
- **Authentication**: Who created/modified the medical record
- **Authorization**: Which roles approved the action
- **Audit Trail**: Complete chain of custody
- **Non-Repudiation**: Cannot deny involvement

When a block is minted, it can be signed by multiple keys:
- Doctor key
- Nurse key
- Patient key
- Surgeon key
- Resident/Student key
- Practice administrator key
- Legal/Compliance key

Each entity deploying the system generates multiple role-based key pairs stored in JSON files.

---

## Role-Based Key Types

### 1. Network Key (`network_key.json`)
**Purpose**: Infrastructure-level operations
**Use Cases**:
- Validator consensus participation
- Node authentication
- Network-level administrative actions
- Sidechain-to-mainchain communication

**Permissions**:
- Sign blocks as validator
- Participate in consensus voting
- Administrative configuration changes
- Network upgrades and governance

**Key Specification**:
```json
{
  "keyType": "network",
  "userId": "network-admin-001",
  "role": "NETWORK_OPERATOR",
  "algorithm": "ed25519",
  "publicKey": "base64_encoded_public_key",
  "privateKey": "base64_encoded_encrypted_private_key",
  "created": 1704067200,
  "expiresAt": 1735689600,
  "permissions": [
    "VALIDATOR",
    "CONSENSUS",
    "NETWORK_ADMIN"
  ]
}
```

### 2. Physician Key (`physician.json`)
**Purpose**: Licensed medical doctor operations
**Use Cases**:
- Create/modify patient medical records
- Write prescriptions
- Order diagnostic tests
- Perform procedures
- Sign operative notes

**Permissions**:
- CREATE_RECORD
- MODIFY_RECORD
- PRESCRIBE_MEDICATION
- ORDER_LAB
- SIGN_PROCEDURE
- DIAGNOSE

**Key Specification**:
```json
{
  "keyType": "physician",
  "userId": "dr-alice-johnson-md",
  "role": "PHYSICIAN",
  "credentials": {
    "license": "CA-MD-123456",
    "npi": "1234567890",
    "dea": "AJ1234567",
    "specialty": "CARDIOLOGY",
    "boardCertified": true
  },
  "algorithm": "ed25519",
  "publicKey": "base64_encoded_public_key",
  "privateKey": "base64_encoded_encrypted_private_key",
  "created": 1704067200,
  "expiresAt": 1735689600,
  "permissions": [
    "CREATE_RECORD",
    "MODIFY_RECORD",
    "PRESCRIBE_MEDICATION",
    "ORDER_LAB",
    "SIGN_PROCEDURE"
  ]
}
```

### 3. Mid-Level Provider Key (`mnp.json`)
**Purpose**: Nurse Practitioners (NP), Physician Assistants (PA), Clinical Nurse Specialists (CNS)
**Use Cases**:
- Create/modify patient records (within scope)
- Prescribe medications (within scope)
- Order tests
- Provide patient care

**Permissions**:
- CREATE_RECORD (supervised)
- MODIFY_RECORD (supervised)
- PRESCRIBE_MEDICATION (limited formulary)
- ORDER_LAB
- PROVIDE_CARE

**Key Specification**:
```json
{
  "keyType": "mnp",
  "userId": "np-jane-smith",
  "role": "NURSE_PRACTITIONER",
  "credentials": {
    "license": "CA-NP-654321",
    "npi": "9876543210",
    "supervising_physician": "dr-alice-johnson-md",
    "specialty": "FAMILY_MEDICINE"
  },
  "algorithm": "ed25519",
  "publicKey": "base64_encoded_public_key",
  "privateKey": "base64_encoded_encrypted_private_key",
  "created": 1704067200,
  "expiresAt": 1735689600,
  "permissions": [
    "CREATE_RECORD",
    "MODIFY_RECORD",
    "PRESCRIBE_MEDICATION_LIMITED",
    "ORDER_LAB"
  ],
  "supervisedBy": "dr-alice-johnson-md"
}
```

### 4. Practice/Facility Key (`practice.json`)
**Purpose**: Healthcare organization/facility operations
**Use Cases**:
- Administrative functions
- Facility-level authorizations
- Billing and claims
- Quality reporting
- Facility attestations

**Permissions**:
- FACILITY_AUTHORIZATION
- BILLING
- CLAIMS_SUBMISSION
- QUALITY_REPORTING
- ADMINISTRATIVE

**Key Specification**:
```json
{
  "keyType": "practice",
  "userId": "mayo-clinic-cardiology",
  "role": "PRACTICE_ADMINISTRATOR",
  "facility": {
    "name": "Mayo Clinic - Cardiology Department",
    "npi": "1234567890",
    "tin": "12-3456789",
    "address": "200 First St SW, Rochester, MN 55905",
    "accreditation": "JCAHO"
  },
  "algorithm": "ed25519",
  "publicKey": "base64_encoded_public_key",
  "privateKey": "base64_encoded_encrypted_private_key",
  "created": 1704067200,
  "expiresAt": 1735689600,
  "permissions": [
    "FACILITY_AUTHORIZATION",
    "BILLING",
    "CLAIMS_SUBMISSION",
    "ADMINISTRATIVE"
  ],
  "multiSigRequired": true,
  "multiSigThreshold": "2-of-3"
}
```

### 5. Student/Resident Key (`student.json`)
**Purpose**: Medical students, residents, fellows in training
**Use Cases**:
- Create preliminary notes (requires attending co-signature)
- Document patient encounters (supervised)
- Educational access to records
- Research access (with consent)

**Permissions**:
- CREATE_RECORD_SUPERVISED
- VIEW_RECORD_EDUCATIONAL
- DOCUMENT_ENCOUNTER
- RESEARCH_ACCESS (de-identified)

**Key Specification**:
```json
{
  "keyType": "student",
  "userId": "med-student-john-doe",
  "role": "MEDICAL_STUDENT",
  "education": {
    "institution": "Mayo Clinic Alix School of Medicine",
    "level": "MS4",
    "rotation": "CARDIOLOGY",
    "supervisor": "dr-alice-johnson-md",
    "graduationDate": "2026-05-15"
  },
  "algorithm": "ed25519",
  "publicKey": "base64_encoded_public_key",
  "privateKey": "base64_encoded_encrypted_private_key",
  "created": 1704067200,
  "expiresAt": 1735689600,
  "permissions": [
    "CREATE_RECORD_SUPERVISED",
    "VIEW_RECORD_EDUCATIONAL"
  ],
  "requiresCountersignature": true,
  "supervisedBy": "dr-alice-johnson-md"
}
```

### 6. Composite Key (`composite.json`)
**Purpose**: Multi-role or cross-functional operations
**Use Cases**:
- Surgery requiring multiple specialists
- Complex procedures with multiple providers
- Interdisciplinary team decisions
- Quality improvement committees

**Permissions**: Combined permissions of multiple roles

**Key Specification**:
```json
{
  "keyType": "composite",
  "userId": "cardiac-surgery-team-001",
  "role": "COMPOSITE",
  "members": [
    {
      "userId": "dr-surgeon-chief",
      "role": "SURGEON",
      "weight": 1
    },
    {
      "userId": "dr-anesthesiologist",
      "role": "ANESTHESIOLOGIST",
      "weight": 1
    },
    {
      "userId": "nurse-circulating",
      "role": "REGISTERED_NURSE",
      "weight": 1
    }
  ],
  "algorithm": "ed25519",
  "publicKey": "base64_multi_sig_public_key",
  "privateKeyShares": [
    "base64_share_1",
    "base64_share_2",
    "base64_share_3"
  ],
  "created": 1704067200,
  "expiresAt": 1735689600,
  "multiSigThreshold": "3-of-3",
  "permissions": [
    "PERFORM_SURGERY",
    "SURGICAL_DOCUMENTATION"
  ]
}
```

### 7. Legal/Compliance Key (`legal.json`)
**Purpose**: Legal, compliance, and regulatory functions
**Use Cases**:
- Compliance audits
- Legal discovery responses
- Regulatory reporting
- Breach investigations
- Quality assurance reviews

**Permissions**:
- AUDIT_ACCESS (read-only)
- COMPLIANCE_REVIEW
- LEGAL_DISCOVERY
- REGULATORY_REPORTING
- INVESTIGATION

**Key Specification**:
```json
{
  "keyType": "legal",
  "userId": "compliance-officer-001",
  "role": "COMPLIANCE_OFFICER",
  "department": {
    "name": "Legal and Compliance Department",
    "organization": "Mayo Clinic",
    "certifications": ["CHC", "HCCA"]
  },
  "algorithm": "ed25519",
  "publicKey": "base64_encoded_public_key",
  "privateKey": "base64_encoded_encrypted_private_key",
  "created": 1704067200,
  "expiresAt": 1735689600,
  "permissions": [
    "AUDIT_ACCESS",
    "COMPLIANCE_REVIEW",
    "LEGAL_DISCOVERY",
    "REGULATORY_REPORTING"
  ],
  "accessRestrictions": {
    "requiresJustification": true,
    "auditLevel": "DETAILED",
    "notifyPatient": true
  }
}
```

### 8. Compliance Key (`compliance.json`)
**Purpose**: Automated compliance monitoring (separate from legal for separation of duties)
**Use Cases**:
- Automated HIPAA compliance checks
- Access pattern analysis
- Anomaly detection
- Policy enforcement
- Automated reporting

**Permissions**:
- SYSTEM_AUDIT (automated)
- POLICY_ENFORCEMENT
- ANOMALY_DETECTION
- AUTOMATED_REPORTING

**Key Specification**:
```json
{
  "keyType": "compliance",
  "userId": "compliance-automation-system",
  "role": "COMPLIANCE_SYSTEM",
  "systemType": "AUTOMATED",
  "algorithm": "ed25519",
  "publicKey": "base64_encoded_public_key",
  "privateKey": "base64_encoded_encrypted_private_key",
  "created": 1704067200,
  "expiresAt": 1735689600,
  "permissions": [
    "SYSTEM_AUDIT",
    "POLICY_ENFORCEMENT",
    "ANOMALY_DETECTION"
  ],
  "automated": true
}
```

---

## Key File Structure

Each role has TWO JSON files:

### Public Key File (shared, publicly available)
**Filename**: `{role}_public.json`

```json
{
  "keyId": "physician-dr-alice-johnson-001",
  "userId": "dr-alice-johnson-md",
  "role": "PHYSICIAN",
  "algorithm": "ed25519",
  "publicKey": "MCowBQYDK2VwAyEAGb9ECWmEzf6FQbrBZ9w7lshQhqowtrbLDFw4rXAxZuE=",
  "created": 1704067200,
  "expiresAt": 1735689600,
  "revoked": false,
  "permissions": [
    "CREATE_RECORD",
    "MODIFY_RECORD",
    "PRESCRIBE_MEDICATION"
  ],
  "credentials": {
    "license": "CA-MD-123456",
    "npi": "1234567890",
    "specialty": "CARDIOLOGY"
  },
  "did": "did:blueblocks:physician:dr-alice-johnson-md",
  "blockchain": {
    "registeredOn": "hospital-chain",
    "blockHeight": 12345,
    "txHash": "0x7d8a9b3c..."
  }
}
```

### Private Key File (highly secured, encrypted at rest)
**Filename**: `{role}_private.json`

```json
{
  "keyId": "physician-dr-alice-johnson-001",
  "userId": "dr-alice-johnson-md",
  "role": "PHYSICIAN",
  "algorithm": "ed25519",
  "privateKey": {
    "encrypted": true,
    "encryptionAlgorithm": "aes-256-gcm",
    "kdf": "argon2id",
    "kdfParams": {
      "salt": "base64_encoded_salt",
      "iterations": 100000,
      "memory": 65536,
      "parallelism": 4
    },
    "nonce": "base64_encoded_nonce",
    "ciphertext": "base64_encrypted_private_key",
    "authTag": "base64_auth_tag"
  },
  "backup": {
    "shamirShares": 5,
    "shamirThreshold": 3,
    "shareLocations": [
      "personal-backup",
      "trusted-contact-1",
      "trusted-contact-2",
      "healthcare-proxy",
      "legal-guardian"
    ]
  },
  "security": {
    "lastRotated": 1704067200,
    "rotationPolicy": "ANNUAL",
    "requiresBiometric": true,
    "requires2FA": true,
    "deviceBinding": "laptop-macbook-pro-serial-123"
  }
}
```

---

## Block Signing Process

### Multi-Role Block Signature

When a block is created, it contains transactions signed by various roles:

```go
type Block struct {
    // Block metadata
    Height       uint64    `json:"height"`
    Timestamp    int64     `json:"timestamp"`
    PreviousHash string    `json:"previous_hash"`
    Transactions []Transaction `json:"transactions"`

    // Multi-role signatures
    Signatures   []RoleSignature `json:"signatures"`

    // Block hash (computed from above fields)
    Hash         string    `json:"hash"`
}

type RoleSignature struct {
    // Who signed
    UserId       string    `json:"user_id"`
    Role         string    `json:"role"`
    PublicKey    []byte    `json:"public_key"`

    // What they signed
    SignatureType string   `json:"signature_type"`  // VALIDATOR, AUTHOR, WITNESS, APPROVER

    // Cryptographic proof
    Signature    []byte    `json:"signature"`
    Algorithm    string    `json:"algorithm"`

    // Timestamp
    SignedAt     int64     `json:"signed_at"`

    // Context
    Purpose      string    `json:"purpose"`  // "Created medical record", "Witnessed procedure", etc.
}

type Transaction struct {
    TxId         string    `json:"tx_id"`
    Type         string    `json:"type"`  // MEDICAL_RECORD, PRESCRIPTION, LAB_ORDER, etc.
    Payload      interface{} `json:"payload"`

    // Transaction-level signatures
    Signatures   []RoleSignature `json:"signatures"`

    // Gas and nonce
    GasLimit     uint64    `json:"gas_limit"`
    Nonce        uint64    `json:"nonce"`
}
```

### Example: Surgery Record Block

```json
{
  "height": 123456,
  "timestamp": 1704067200,
  "previousHash": "0x7d8a9b3c...",
  "transactions": [
    {
      "txId": "tx_surgery_001",
      "type": "SURGICAL_PROCEDURE",
      "payload": {
        "patientId": "patient-john-doe",
        "procedure": "Coronary Artery Bypass Graft (CABG)",
        "startTime": 1704063600,
        "endTime": 1704074400,
        "outcome": "SUCCESSFUL",
        "complications": "NONE",
        "operativeNote": "ipfs://Qm..."
      },
      "signatures": [
        {
          "userId": "dr-surgeon-chief",
          "role": "SURGEON",
          "publicKey": "MCowBQYDK2VwAyEA...",
          "signatureType": "AUTHOR",
          "signature": "base64_signature_1",
          "algorithm": "ed25519",
          "signedAt": 1704074500,
          "purpose": "Primary surgeon - performed procedure"
        },
        {
          "userId": "dr-anesthesiologist",
          "role": "ANESTHESIOLOGIST",
          "publicKey": "MCowBQYDK2VwAyEA...",
          "signatureType": "WITNESS",
          "signature": "base64_signature_2",
          "algorithm": "ed25519",
          "signedAt": 1704074510,
          "purpose": "Anesthesia provider - witnessed procedure"
        },
        {
          "userId": "nurse-circulating",
          "role": "REGISTERED_NURSE",
          "publicKey": "MCowBQYDK2VwAyEA...",
          "signatureType": "WITNESS",
          "signature": "base64_signature_3",
          "algorithm": "ed25519",
          "signedAt": 1704074515,
          "purpose": "Circulating nurse - documented procedure"
        },
        {
          "userId": "resident-cardio",
          "role": "SURGICAL_RESIDENT",
          "publicKey": "MCowBQYDK2VwAyEA...",
          "signatureType": "ASSISTANT",
          "signature": "base64_signature_4",
          "algorithm": "ed25519",
          "signedAt": 1704074520,
          "purpose": "First assist - participated in procedure"
        }
      ],
      "gasLimit": 1000000,
      "nonce": 42
    }
  ],
  "signatures": [
    {
      "userId": "validator-mayo-clinic-01",
      "role": "VALIDATOR",
      "publicKey": "MCowBQYDK2VwAyEA...",
      "signatureType": "VALIDATOR",
      "signature": "base64_block_signature",
      "algorithm": "ed25519",
      "signedAt": 1704074600,
      "purpose": "Validated and included in block"
    }
  ],
  "hash": "0x9f8e7d6c..."
}
```

---

## Signature Verification Hierarchy

When verifying a medical record, the system checks signatures in order:

```
1. VALIDATOR signatures (block-level)
   ├─ Ensures block is part of consensus
   └─ Proves block finality

2. AUTHOR signatures (transaction-level)
   ├─ Primary creator of the medical record
   └─ Legally responsible for content

3. WITNESS signatures (transaction-level)
   ├─ Corroborating providers
   └─ Establish chain of custody

4. APPROVER signatures (transaction-level)
   ├─ Supervising physician (for residents/students)
   └─ Quality assurance review

5. COMPLIANCE signatures (post-block)
   ├─ Automated compliance checks
   └─ Regulatory attestations
```

---

## Key Generation and Deployment

### Initial System Deployment

When deploying BlueBlocks at a new healthcare facility:

```bash
# 1. Generate all required key pairs
$ afterblock keygen \
    --roles network,physician,mnp,practice,student,composite,legal,compliance \
    --output-dir /secure/keys \
    --encrypt \
    --password-prompt

Generating keys for 8 roles...
✓ network_key.json (validator node key)
✓ physician.json (multiple copies for each doctor)
✓ mnp.json (nurse practitioners, PAs)
✓ practice.json (facility administrator)
✓ student.json (residents, students)
✓ composite.json (surgical teams)
✓ legal.json (compliance officer)
✓ compliance.json (automated system)

All keys encrypted with AES-256-GCM
Private keys require password for decryption
Public keys exported to /secure/keys/public/

# 2. Register public keys on blockchain
$ afterblock register-keys \
    --chain hospital-chain \
    --keys-dir /secure/keys/public \
    --registrar-key /secure/keys/network_key.json

Registering 8 keys on hospital-chain...
✓ network_key registered at block 12345
✓ physician keys registered (12 providers)
✓ mnp keys registered (5 providers)
✓ practice key registered
✓ student keys registered (8 trainees)
✓ composite key registered (3 surgical teams)
✓ legal key registered
✓ compliance key registered

All keys now available in DID registry

# 3. Distribute keys securely
$ afterblock distribute-keys \
    --keys-dir /secure/keys \
    --recipients /secure/recipients.json \
    --method encrypted-email

Distributing private keys...
✓ Dr. Alice Johnson: physician key sent to alice.johnson@mayo.edu
✓ Dr. Bob Smith: physician key sent to bob.smith@mayo.edu
...

Each recipient will receive:
- Encrypted private key file
- Decryption password (sent via separate channel)
- Setup instructions
```

### Per-User Key Provisioning

When a new doctor joins the practice:

```bash
# Generate individual physician key
$ afterblock keygen \
    --role physician \
    --user-id dr-charlie-brown-md \
    --credentials license=CA-MD-789456,npi=1122334455,specialty=NEUROLOGY \
    --output /secure/keys/dr-charlie-brown.json \
    --encrypt

Generated key for dr-charlie-brown-md
Public key: MCowBQYDK2VwAyEA...
DID: did:blueblocks:physician:dr-charlie-brown-md

# Register on blockchain
$ afterblock register-key \
    --chain hospital-chain \
    --key-file /secure/keys/dr-charlie-brown_public.json \
    --registrar-key /secure/keys/practice.json

Registered dr-charlie-brown-md on hospital-chain
Block: 12789
Tx: 0x7d8a9b3c...

# Provision to physician's device
$ afterblock provision-key \
    --key-file /secure/keys/dr-charlie-brown_private.json \
    --device laptop-macbook-serial-456 \
    --bind-biometric \
    --require-2fa

Provisioning key to device...
✓ Key loaded into secure enclave
✓ Biometric authentication enabled (Touch ID)
✓ 2FA enabled (Google Authenticator)
✓ Device binding active (cannot export)

Dr. Brown can now sign transactions on hospital-chain
```

---

## Multi-Signature Workflows

### Scenario: Resident Note Requires Attending Co-Signature

```python
# Smart contract: require_cosignature.star

def create_resident_note(ctx, patient_id, note_content):
    """Resident creates note (requires attending signature)"""

    # Verify resident is authorized
    if ctx.sender_role != "SURGICAL_RESIDENT":
        fail("Only residents can create provisional notes")

    # Get resident's supervising attending
    attending = get_supervisor(ctx.sender)
    if not attending:
        fail("No supervising attending found")

    # Create provisional note
    note_id = generate_note_id()
    state.notes[note_id] = {
        "patient": patient_id,
        "content": note_content,
        "author": ctx.sender,
        "author_role": "SURGICAL_RESIDENT",
        "created_at": ctx.block_time,
        "status": "PENDING_COSIGNATURE",
        "requires_cosignature_from": attending,
        "signatures": [
            {
                "user_id": ctx.sender,
                "role": "SURGICAL_RESIDENT",
                "signature": ctx.signature,
                "signed_at": ctx.block_time,
                "signature_type": "AUTHOR"
            }
        ]
    }

    # Notify attending
    emit("CosignatureRequired",
         note_id=note_id,
         resident=ctx.sender,
         attending=attending)

    return note_id

def cosign_note(ctx, note_id):
    """Attending physician co-signs resident note"""

    note = state.notes.get(note_id)
    if not note:
        fail("Note not found")

    # Verify attending is the required cosigner
    if ctx.sender != note["requires_cosignature_from"]:
        fail("You are not authorized to co-sign this note")

    # Verify attending role
    if ctx.sender_role != "PHYSICIAN":
        fail("Only attending physicians can co-sign")

    # Add attending signature
    note["signatures"].append({
        "user_id": ctx.sender,
        "role": "PHYSICIAN",
        "signature": ctx.signature,
        "signed_at": ctx.block_time,
        "signature_type": "APPROVER"
    })

    # Mark as finalized
    note["status"] = "FINALIZED"
    note["finalized_at"] = ctx.block_time

    # Emit event
    emit("NoteCosigned",
         note_id=note_id,
         attending=ctx.sender)

    return True
```

### Scenario: Surgery Requires Multi-Disciplinary Team Sign-Off

```python
# Smart contract: surgical_procedure.star

def schedule_surgery(ctx, patient_id, procedure_type, team_members):
    """Schedule complex surgery requiring multiple specialists"""

    # Verify primary surgeon
    if ctx.sender_role != "SURGEON":
        fail("Only surgeons can schedule procedures")

    # Create procedure record
    proc_id = generate_procedure_id()
    state.procedures[proc_id] = {
        "patient": patient_id,
        "procedure": procedure_type,
        "primary_surgeon": ctx.sender,
        "team": team_members,  # [anesthesiologist, circulating_nurse, scrub_tech]
        "scheduled_at": ctx.block_time,
        "status": "SCHEDULED",
        "required_signatures": len(team_members) + 1,  # Team + surgeon
        "signatures": []
    }

    # Notify team
    for member in team_members:
        emit("SurgeryScheduled",
             proc_id=proc_id,
             team_member=member)

    return proc_id

def sign_procedure_participation(ctx, proc_id, role):
    """Team member signs to confirm participation"""

    proc = state.procedures.get(proc_id)
    if not proc:
        fail("Procedure not found")

    # Verify user is part of team
    if ctx.sender not in proc["team"] and ctx.sender != proc["primary_surgeon"]:
        fail("You are not part of this surgical team")

    # Check not already signed
    for sig in proc["signatures"]:
        if sig["user_id"] == ctx.sender:
            fail("You have already signed")

    # Add signature
    proc["signatures"].append({
        "user_id": ctx.sender,
        "role": role,
        "signature": ctx.signature,
        "signed_at": ctx.block_time,
        "signature_type": "WITNESS"
    })

    # Check if all signatures collected
    if len(proc["signatures"]) >= proc["required_signatures"]:
        proc["status"] = "READY_TO_PROCEED"
        emit("ProcedureReady", proc_id=proc_id)

    return True
```

---

## Key Rotation and Expiration

All keys have expiration dates and must be rotated:

```bash
# Check key expiration
$ afterblock key-status \
    --user-id dr-alice-johnson-md \
    --chain hospital-chain

Key Status: dr-alice-johnson-md
Role: PHYSICIAN
Created: 2026-01-01
Expires: 2027-01-01
Status: ⚠️  EXPIRING SOON (30 days)
Blocks signed: 12,456
Last used: 2026-12-05

Recommendation: Rotate key before expiration

# Rotate key (generates new key, revokes old)
$ afterblock rotate-key \
    --old-key /secure/keys/dr-alice-johnson.json \
    --output /secure/keys/dr-alice-johnson-2027.json \
    --encrypt

Rotating key for dr-alice-johnson-md...
✓ Generated new key pair
✓ Registered new public key on hospital-chain
✓ Revoked old key (grace period: 7 days)
✓ Updated DID document

Old key will remain valid for 7 days to prevent service disruption
After 7 days, old key cannot sign new transactions
Old signatures remain valid (historical verification)

New key details:
Public key: MCowBQYDK2VwAyEA...
Expires: 2028-01-01
```

---

## Security Considerations

### Private Key Protection

1. **Encryption at Rest**: All private key files encrypted with AES-256-GCM
2. **Password Protection**: Strong password required (Argon2id KDF)
3. **Device Binding**: Keys bound to specific devices (HSM, secure enclave)
4. **Biometric Authentication**: Touch ID / Face ID required for use
5. **2FA Required**: TOTP second factor for sensitive operations

### Key Storage Best Practices

```
Security Tier | Storage Method | Use Case
--------------|----------------|----------
Maximum       | HSM (on-prem)  | Validator keys, facility keys
High          | HSM (cloud)    | Physician keys (large practices)
Medium        | Secure enclave | Physician keys (mobile devices)
Standard      | Encrypted file | Student keys, research access
```

### Audit Requirements

Every key usage is logged:

```json
{
  "auditId": "audit_key_usage_123",
  "keyId": "physician-dr-alice-johnson-001",
  "userId": "dr-alice-johnson-md",
  "role": "PHYSICIAN",
  "action": "SIGN_TRANSACTION",
  "transactionType": "CREATE_MEDICAL_RECORD",
  "patientId": "patient-john-doe",
  "timestamp": 1704067200,
  "sourceIp": "203.0.113.42",
  "deviceId": "laptop-macbook-serial-123",
  "success": true,
  "signature": "base64_signature",
  "blockHeight": 12456,
  "txHash": "0x7d8a9b3c..."
}
```

---

## Implementation Checklist

When deploying multi-role key signing system:

- [ ] Generate all 8 role types for your organization
- [ ] Encrypt all private keys with strong passwords
- [ ] Register all public keys on appropriate blockchain
- [ ] Distribute private keys via secure channels
- [ ] Configure device binding and biometric authentication
- [ ] Set up key rotation policies and calendar
- [ ] Implement co-signature workflows for residents/students
- [ ] Configure multi-sig thresholds for composite keys
- [ ] Enable comprehensive audit logging
- [ ] Train staff on key security best practices
- [ ] Document key recovery procedures
- [ ] Test key revocation and emergency procedures

---

## Next Steps

This multi-role key signing system will be integrated with the sidechain architecture from `SIDECHAIN_ARCHITECTURE.md`.

**When you're ready to continue, we can:**
1. Implement the key generation tool (`afterblock keygen`)
2. Build the key registry smart contracts
3. Create the co-signature workflow system
4. Implement the audit logging for all key usage
5. Build the key management UI for administrators

**Ready to hash out the details when you wake up!**

---

**Status**: Design complete, ready for implementation discussion
**Next Review**: After user feedback
