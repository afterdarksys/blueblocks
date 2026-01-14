# BlueBlocks Medical Blockchain - Sidechain Architecture
## Enterprise Healthcare Interoperability Framework

**Version:** 1.0
**Date:** 2026-01-14
**Status:** Design Specification
**Classification:** Confidential

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Sidechain Entity Types](#sidechain-entity-types)
4. [Key Management System](#key-management-system)
5. [Patient-Controlled Access Model](#patient-controlled-access-model)
6. [Cross-Chain Data Transfer](#cross-chain-data-transfer)
7. [Large File Storage System](#large-file-storage-system)
8. [Data Classification Framework](#data-classification-framework)
9. [Non-Repudiation System](#non-repudiation-system)
10. [Security Implementation](#security-implementation)
11. [Technical Specifications](#technical-specifications)
12. [Implementation Roadmap](#implementation-roadmap)
13. [Code Architecture](#code-architecture)

---

## Executive Summary

BlueBlocks implements a **hub-and-spoke sidechain architecture** where:

- **Mainchain (Hub)**: Coordinates identity, cross-chain routing, settlement, and global state
- **Sidechains (Spokes)**: Independent chains for each healthcare entity type
- **Each sidechain** manages its own keys, consensus, validators, and data
- **Patients control** all access to their medical data across all chains
- **Cross-chain transfers** use encrypted channels with cryptographic proof
- **Large files** (images, videos, documents) stored in classified distributed storage
- **Zero-knowledge proofs** enable privacy-preserving access verification

### Key Design Principles

1. **Sovereignty**: Each entity type controls their own chain
2. **Interoperability**: Seamless data transfer with patient consent
3. **Privacy**: End-to-end encryption, minimal data exposure
4. **Compliance**: HIPAA, GDPR, state-specific regulations
5. **Scalability**: Thousands of healthcare facilities supported
6. **Non-Repudiation**: All actions cryptographically proven
7. **Data Classification**: Public, Private, NMPI, MPI, HIPAA, GDPR tiers

---

## Architecture Overview

### Topology: Hub-and-Spoke with Mesh Capability

```
                    ┌─────────────────────────┐
                    │   MAINCHAIN (HUB)       │
                    │  - Identity Registry     │
                    │  - Cross-Chain Routing   │
                    │  - Settlement Layer      │
                    │  - Trust Anchoring       │
                    └───────────┬─────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   IBC Relay Network    │
                    │   (Inter-Blockchain    │
                    │    Communication)      │
                    └───────────┬───────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│  PHARMA CHAIN │      │ HOSPITAL CHAIN│      │  INSURANCE    │
│               │      │               │      │  CHAIN        │
│ - Pfizer      │      │ - Mayo Clinic │      │               │
│ - Moderna     │      │ - Johns Hop.  │      │ - UnitedHlth  │
│ - Merck       │◄────►│ - Cleveland   │◄────►│ - Anthem      │
│               │      │   Clinic      │      │ - Aetna       │
└───────────────┘      └───────────────┘      └───────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│   LAB CHAIN   │      │  CLINIC CHAIN │      │ AMBULATORY    │
│               │      │               │      │ CHAIN         │
│ - Quest Diag. │      │ - Primary Care│      │               │
│ - LabCorp     │◄────►│ - Specialists │◄────►│ - Surgery Ctr │
│ - Regional    │      │ - Urgent Care │      │ - Imaging     │
│   Labs        │      │               │      │ - Dialysis    │
└───────────────┘      └───────────────┘      └───────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│ INTERNATIONAL │      │ 3RD PARTY     │      │  RESEARCH     │
│ NETWORK CHAIN │      │ ACCESS CHAIN  │      │  CHAIN        │
│               │      │               │      │               │
│ - EU Hosps.   │      │ - Legal       │      │ - Clinical    │
│ - Asian Med.  │◄────►│ - Family      │◄────►│   Trials      │
│ - Med Tourism │      │ - Guardians   │      │ - NIH/CDC     │
│               │      │ - Employers   │      │ - Universities│
└───────────────┘      └───────────────┘      └───────────────┘

         Direct P2P connections for emergency transfers ─────►
```

### Key Architectural Features

1. **Mainchain Responsibilities**:
   - Global identity registry (DIDs - Decentralized Identifiers)
   - Cross-chain routing and message relay
   - Settlement and finality for cross-chain transactions
   - Trust root for certificate chains
   - Global audit log aggregation
   - Token/payment settlement

2. **Sidechain Autonomy**:
   - Independent consensus (Tendermint BFT per chain)
   - Own validator set (minimum 4 validators per chain)
   - Custom governance rules
   - Chain-specific smart contracts
   - Local data storage and indexing
   - Independent gas economics

3. **Mesh Capability**:
   - Direct peer-to-peer connections between frequently-interacting chains
   - Emergency bypass of mainchain for urgent care scenarios
   - Load balancing and failover
   - Reduced latency for common workflows

---

## Sidechain Entity Types

### 1. Pharmaceutical/Drug Manufacturer Chain

**Participants**: Pfizer, Moderna, Merck, J&J, generic manufacturers

**Responsibilities**:
- Drug formulary and NDC (National Drug Code) registry
- Clinical trial data and results
- Adverse event reporting (FAERS)
- Drug interaction databases
- Prescription verification
- Supply chain tracking (prevent counterfeits)
- Recalls and safety alerts

**Data Stored**:
- Drug specifications (composition, dosage, administration)
- Clinical trial protocols and outcomes
- Manufacturing batch records
- Distribution records
- Pricing and rebate information

**Access Model**:
- Providers can query drug information (public data)
- Patients can view their prescribed medications
- Researchers can access de-identified trial data with consent
- Regulators (FDA) have auditor role

**Smart Contracts**:
- `prescriptionVerify()` - Validate prescription legitimacy
- `drugInteractionCheck()` - Check for contraindications
- `trialEnrollment()` - Manage clinical trial participants
- `adverseEventReport()` - Submit adverse reactions

### 2. Hospital Chain

**Participants**: Mayo Clinic, Johns Hopkins, Cleveland Clinic, regional hospitals

**Responsibilities**:
- Inpatient medical records
- Surgical records and operative notes
- Admission/discharge/transfer (ADT) events
- Bed management and capacity
- Emergency department records
- Intensive care unit (ICU) data
- Radiology and imaging coordination

**Data Stored**:
- Patient encounters (admit/discharge summaries)
- Inpatient orders and results
- Nursing notes and vital signs
- Surgical procedures and outcomes
- Discharge instructions and follow-up plans

**Access Model**:
- Attending physicians have full access during admission
- Consulting physicians have limited access (specific consultations)
- Patient can view all records after discharge
- External providers need patient consent
- Emergency override for unconscious patients

**Smart Contracts**:
- `admitPatient()` - Create admission record
- `grantEmergencyAccess()` - Break-glass for emergencies
- `dischargeTransfer()` - Coordinate care transitions
- `consultRequest()` - Request specialist consultation

### 3. Doctors Office / Clinic Chain

**Participants**: Primary care practices, specialist offices, urgent care

**Responsibilities**:
- Ambulatory medical records (EMR)
- Office visit notes (SOAP notes)
- Prescriptions and medication management
- Preventive care tracking (immunizations, screenings)
- Chronic disease management
- Referrals to specialists

**Data Stored**:
- Patient demographics and insurance
- Chief complaint and history of present illness
- Physical exam findings
- Assessment and plan
- Prescriptions and refills
- Patient education materials
- **Encrypted provider lists** - Doctors patient has seen (hidden in encrypted metadata)

**Access Model**:
- Primary care provider is "home base" with broad access
- Specialists see only relevant data (e.g., cardiologist sees cardiac history)
- Patient controls sharing with other providers
- **Doctor visit history encrypted** - Only patient can decrypt list of providers seen

**Smart Contracts**:
- `scheduleAppointment()` - Appointment booking
- `createReferral()` - Send patient to specialist
- `prescribeMedication()` - E-prescribing
- `trackPreventiveCare()` - Immunization tracking

### 4. Laboratory Chain

**Participants**: Quest Diagnostics, LabCorp, hospital labs, reference labs

**Responsibilities**:
- Laboratory test results
- Pathology reports
- Microbiology cultures and sensitivities
- Blood bank and transfusion records
- Genetic testing results
- Reference ranges and interpretations

**Data Stored**:
- Test orders from providers
- Specimen collection and tracking
- Test results with reference ranges
- Critical value alerts
- Quality control data
- Accreditation records

**Access Model**:
- Ordering provider receives results automatically
- Patient can view after provider review period (e.g., 24 hours)
- Other providers need patient consent
- Genetic results require special consent

**Smart Contracts**:
- `orderLab()` - Provider orders test
- `reportResult()` - Lab posts result
- `criticalValueAlert()` - Notify provider of critical result
- `geneticConsent()` - Manage genetic testing consent

### 5. Insurance/Payer Chain

**Participants**: UnitedHealth, Anthem, Aetna, Medicare/Medicaid, self-insured employers

**Responsibilities**:
- Coverage verification and eligibility
- Prior authorization
- Claims adjudication
- Payment processing
- Utilization review
- Risk adjustment and quality metrics

**Data Stored**:
- Member enrollment and benefits
- Claims submitted by providers
- Explanation of benefits (EOB)
- Prior authorization decisions
- Provider network contracts
- Quality measure reporting (HEDIS)

**Access Model**:
- Providers can verify coverage (limited data)
- Patients can view claims and EOB
- Employers can see de-identified utilization
- Auditors can review compliance

**Smart Contracts**:
- `verifyEligibility()` - Check coverage
- `submitClaim()` - Provider submits claim
- `priorAuthRequest()` - Request authorization
- `adjudicateClaim()` - Process payment

### 6. Ambulatory Facility Chain

**Participants**: Ambulatory surgery centers, imaging centers, dialysis centers

**Responsibilities**:
- Outpatient procedures
- Medical imaging (MRI, CT, X-ray, ultrasound)
- Dialysis treatments
- Infusion therapy
- Physical therapy
- Endoscopy and colonoscopy

**Data Stored**:
- Procedure notes
- Anesthesia records
- **Large medical images** (DICOM format, 100MB-1GB per study)
- **Procedural videos** (surgical cameras, endoscopy)
- Recovery room notes
- Discharge instructions

**Access Model**:
- Referring provider receives procedure report
- Imaging studies available to authorized providers
- Patient can download images (with DICOM viewer)
- Emergency providers can access recent images

**Smart Contracts**:
- `scheduleProcedure()` - Outpatient scheduling
- `uploadImaging()` - Store large image files
- `shareImagingStudy()` - Transfer to specialist
- `dialysisTreatment()` - Track treatments

### 7. International Medical Network Chain

**Participants**: EU hospitals, Asian medical centers, medical tourism facilities

**Responsibilities**:
- International care coordination
- Medical tourism records
- Expatriate care
- Remote consultations (telemedicine)
- Translation services
- Currency conversion for payments

**Data Stored**:
- Medical records in multiple languages
- Treatment costs in various currencies
- Travel and accommodation arrangements
- Insurance coverage for international care
- Vaccination records for travelers

**Access Model**:
- Patient initiates cross-border transfer
- Foreign providers need patient consent + need verification
- Emergency care defaults to patient's designated contacts
- GDPR compliance for EU patients

**Smart Contracts**:
- `internationalTransfer()` - Cross-border data sharing
- `currencyConversion()` - Payment settlement
- `translationRequest()` - Medical record translation
- `gdprCompliance()` - Right to erasure, portability

### 8. Third-Party Access Chain

**Participants**: Legal entities, family members, guardians, employers, disability insurers

**Responsibilities**:
- Limited access for legitimate needs
- Legal discovery (subpoenas, court orders)
- Family caregivers (with patient permission)
- Disability determination
- Workers compensation
- Life insurance underwriting (with consent)

**Data Stored**:
- Access grants and revocations
- Purpose of access (treatment, payment, legal)
- Audit trail of all access
- Time-limited permissions
- Scope limitations (specific records only)

**Access Model**:
- **No direct access without patient consent**
- Legal subpoenas require court validation smart contract
- Family members explicitly added by patient
- Employers see only work-related injury data
- All access heavily audited

**Smart Contracts**:
- `grantFamilyAccess()` - Patient adds family member
- `processSubpoena()` - Handle legal requests
- `workersCompAccess()` - Employer injury access
- `revokeAccess()` - Patient terminates permission

### 9. Research Chain

**Participants**: NIH, CDC, universities, clinical trial organizations, biotech

**Responsibilities**:
- De-identified research datasets
- Clinical trial enrollment and tracking
- Public health surveillance
- Epidemiological studies
- Quality improvement initiatives
- Biobank sample tracking

**Data Stored**:
- De-identified patient cohorts
- Aggregated health statistics
- Clinical trial protocols
- Consent for research use
- Sample provenance (biobank)
- Research results and publications

**Access Model**:
- **Completely de-identified data** (HIPAA Safe Harbor method)
- Patients opt-in to research participation
- Institutional Review Board (IRB) approval required
- No re-identification without explicit consent
- Aggregate statistics publicly available

**Smart Contracts**:
- `enrollClinicalTrial()` - Patient enrollment
- `researchConsent()` - Manage research authorizations
- `deidentifyData()` - Generate de-identified dataset
- `publishFindings()` - Link to research publications

---

## Key Management System

### Hierarchical Deterministic (HD) Key Derivation

```
Master Seed (256-bit entropy)
    │
    ├─ Mainchain Identity Key (m/44'/0'/0')
    │   └─ Patient DID Document Signing Key
    │
    ├─ Sidechain Keys (per chain)
    │   ├─ Hospital Chain Key (m/44'/1'/0')
    │   │   ├─ Mayo Clinic Entity Key (m/44'/1'/0'/0)
    │   │   │   ├─ Provider 1 Key (m/44'/1'/0'/0/0)
    │   │   │   ├─ Provider 2 Key (m/44'/1'/0'/0/1)
    │   │   │   └─ Department Keys...
    │   │   ├─ Johns Hopkins Entity Key (m/44'/1'/0'/1)
    │   │   └─ Cleveland Clinic Entity Key (m/44'/1'/0'/2)
    │   │
    │   ├─ Pharma Chain Key (m/44'/2'/0')
    │   ├─ Lab Chain Key (m/44'/3'/0')
    │   └─ ... (other chains)
    │
    ├─ Data Encryption Keys (per patient)
    │   ├─ Patient Master Key (m/44'/100'/0')
    │   │   ├─ Record Encryption Key 1 (m/44'/100'/0'/0)
    │   │   ├─ Record Encryption Key 2 (m/44'/100'/0'/1)
    │   │   └─ File Encryption Keys...
    │   └─ Derived per document/file
    │
    └─ Recovery Keys (Shamir Secret Sharing)
        ├─ Recovery Share 1 (trusted contact)
        ├─ Recovery Share 2 (trusted contact)
        ├─ Recovery Share 3 (trusted contact)
        ├─ Recovery Share 4 (healthcare proxy)
        └─ Recovery Share 5 (legal guardian)
        (3-of-5 threshold to recover master seed)
```

### Key Types and Purposes

#### 1. Patient Identity Keys (Ed25519)
- **Purpose**: Sign transactions, prove identity
- **Storage**: Mobile device secure enclave, hardware wallet
- **Backup**: Encrypted seed phrase (BIP39 mnemonic)
- **Rotation**: Annually or on compromise
- **Algorithm**: Ed25519 (fast, secure, 32-byte keys)

#### 2. Entity/Institutional Keys (Ed25519 or RSA-4096)
- **Purpose**: Organization identity, validator keys
- **Storage**: Hardware Security Module (HSM)
- **Backup**: Offline cold storage in secure facility
- **Rotation**: Bi-annually
- **Multi-sig**: 2-of-3 or 3-of-5 for critical operations

#### 3. Data Encryption Keys (AES-256-GCM)
- **Purpose**: Encrypt medical records, files, images
- **Derivation**: HKDF from patient master key + record ID
- **Storage**: Encrypted with patient public key, stored on-chain
- **Rotation**: Per document (each record has unique key)
- **Algorithm**: AES-256-GCM (authenticated encryption)

#### 4. Transport Encryption Keys (X25519)
- **Purpose**: End-to-end encryption for cross-chain transfers
- **Derivation**: ECDH (Elliptic Curve Diffie-Hellman)
- **Ephemeral**: Generated per session, never reused
- **Perfect Forward Secrecy**: Past sessions unaffected by key compromise

### Key Storage Matrix

| Entity Type | Key Storage | Backup Method | Recovery Time | Cost |
|-------------|-------------|---------------|---------------|------|
| Patient | Mobile secure enclave | Seed phrase (BIP39) | Immediate (self-service) | Free |
| Small Clinic | Software keystore | Encrypted backup file | < 1 hour | $0 |
| Hospital | HSM (on-premise) | Offline HSM backup | < 4 hours | $10K-50K |
| Insurance | HSM (cloud) + on-prem | Geographic redundancy | < 15 min | $50K-200K |
| Pharma | FIPS 140-2 Level 3 HSM | Dual custody backup | < 1 hour | $100K+ |

### Key Ceremony for Validator Onboarding

When a new healthcare entity joins a sidechain as validator:

1. **Key Generation Ceremony** (witnessed by existing validators):
   ```bash
   # Generate validator key on HSM
   $ afterblock validator keygen --hsm /dev/hsm0 --chain hospital-chain

   # Export public key certificate
   $ afterblock validator export-cert --output validator-cert.pem

   # Submit certificate to mainchain for registration
   $ afterblock mainchain register-validator \
       --chain hospital-chain \
       --cert validator-cert.pem \
       --stake 100000 ABT
   ```

2. **Multi-Signature Approval**: Existing validators approve new validator (2/3 majority)

3. **Certificate Anchoring**: Validator certificate anchored to mainchain

4. **Backup Key Escrow**: Backup key shares distributed to trusted validators (Shamir 3-of-5)

5. **Activation**: Validator begins signing blocks after 24-hour waiting period

### Patient Key Recovery (Shamir Secret Sharing)

If patient loses device/seed phrase:

```
Patient loses access
    │
    ├─ Initiate recovery request (identity verification)
    │   └─ Government ID + biometric + security questions
    │
    ├─ Contact trusted recovery contacts (3 of 5 required)
    │   ├─ Contact 1: Spouse (has share 1)
    │   ├─ Contact 2: Adult child (has share 2)
    │   ├─ Contact 3: Healthcare proxy (has share 4)
    │   └─ Recovery shares submitted to smart contract
    │
    ├─ Smart contract validates shares and identity
    │   └─ Requires 3 valid shares + identity verification
    │
    ├─ Time-lock delay (7 days to prevent theft)
    │   └─ Notification sent to all contacts
    │   └─ Patient can cancel if fraudulent
    │
    └─ Master seed reconstructed
        └─ Patient generates new device key
        └─ Old keys revoked on all chains
```

### Key Rotation Strategy

**Automated Rotation Schedule**:
- Patient identity keys: 1 year
- Institutional validator keys: 6 months
- TLS certificates: 90 days (Let's Encrypt)
- API keys: 30 days
- Data encryption keys: Never (unique per record)

**Emergency Rotation** (on compromise):
1. Revoke compromised key immediately
2. Generate new key from HD wallet (next derivation path)
3. Update DID document on mainchain
4. Propagate to all sidechains (via IBC)
5. Re-encrypt affected data with new key
6. Notify all affected parties

### Hardware Security Module Integration

**HSM Providers Supported**:
- **Thales Luna HSM** (on-premise)
- **AWS CloudHSM** (cloud)
- **Azure Dedicated HSM**
- **YubiHSM 2** (USB, for small deployments)
- **Ledger Enterprise** (hardware wallets at scale)

**HSM Operations**:
```go
// Example: Sign transaction with HSM-protected key
func (v *Validator) SignBlock(block *Block) ([]byte, error) {
    // Connect to HSM
    session, err := v.hsm.OpenSession(pkcs11.CKF_SERIAL_SESSION)
    if err != nil {
        return nil, err
    }
    defer session.Close()

    // Load signing key (never leaves HSM)
    privKey, err := session.FindObject(v.keyLabel)
    if err != nil {
        return nil, err
    }

    // Sign block hash
    mechanism := []*pkcs11.Mechanism{pkcs11.NewMechanism(pkcs11.CKM_ECDSA, nil)}
    signature, err := session.Sign(privKey, block.Hash(), mechanism)
    if err != nil {
        return nil, err
    }

    return signature, nil
}
```

---

## Patient-Controlled Access Model

### Opt-In Access Flow

```
┌─────────────────────────────────────────────────────────────┐
│ PATIENT CONSENT MANAGEMENT SYSTEM                           │
└─────────────────────────────────────────────────────────────┘

Step 1: Provider Requests Access
    │
    Provider: "I need to see John Doe's cardiac history"
    │
    ├─ Provider proves identity (DID + signature)
    ├─ Provider states purpose (treatment, consultation, etc.)
    ├─ Provider specifies scope (cardiac records, date range)
    └─ Smart contract creates AccessRequest
        {
          requestId: "req_789xyz",
          requestor: "did:blueblocks:doctor:alice",
          patient: "did:blueblocks:patient:john",
          purpose: "TREATMENT",
          scope: ["cardiac_records", "medications"],
          timestamp: 1704067200,
          status: "PENDING"
        }

Step 2: Patient Notified (multi-channel)
    │
    ├─ Mobile app push notification
    ├─ Email notification
    ├─ SMS text message
    └─ Patient portal alert

Step 3: Need-to-Know Verification (Zero-Knowledge Proof)
    │
    Provider submits proof of need:
    ├─ Appointment scheduled? (from appointment system)
    ├─ Referral exists? (from referring provider)
    ├─ Emergency situation? (override possible)
    ├─ Provider licensed? (query medical board)
    └─ Provider in network? (insurance verification)

    Smart contract validates proofs WITHOUT revealing patient data

Step 4: Patient Reviews and Decides
    │
    Patient sees:
    ├─ Provider name and credentials
    ├─ Purpose of access
    ├─ Specific records requested
    ├─ Duration of access grant
    ├─ Who else has access currently

    Patient actions:
    ├─ APPROVE (with optional restrictions)
    │   ├─ Grant full access requested
    │   ├─ Grant partial access (subset of records)
    │   ├─ Set expiration (30 days default)
    │   └─ Require audit notification
    │
    ├─ DENY (with reason)
    │   └─ Provider notified, can appeal with more justification
    │
    └─ DEFER (request more information)

Step 5: Access Grant Created (if approved)
    │
    Smart contract executes:
    ├─ Encrypt data encryption key with provider's public key
    ├─ Store encrypted key on provider's sidechain
    ├─ Create audit log entry (immutable)
    ├─ Set automatic expiration timer
    └─ Notify provider of approval

    AccessGrant {
      grantId: "grant_456abc",
      patient: "did:blueblocks:patient:john",
      provider: "did:blueblocks:doctor:alice",
      purpose: "TREATMENT",
      scope: ["cardiac_records", "medications"],
      encryptedKey: "base64_encrypted_aes_key",
      grantedAt: 1704067200,
      expiresAt: 1706745600,  // 30 days later
      revokedAt: null,
      accessCount: 0
    }

Step 6: Provider Accesses Data
    │
    Provider's system:
    ├─ Retrieves encrypted data from storage
    ├─ Retrieves encrypted decryption key from grant
    ├─ Decrypts key using provider's private key (HSM)
    ├─ Decrypts medical data
    ├─ Displays in EMR system
    └─ Audit log records access event

    Every access logs:
    {
      accessId: "access_123def",
      grantId: "grant_456abc",
      timestamp: 1704070800,
      ipAddress: "203.0.113.42",
      userAgent: "EMRSoftware/2.1",
      recordsAccessed: ["record_1", "record_2"],
      action: "VIEW"  // VIEW, DOWNLOAD, PRINT
    }

Step 7: Automatic Expiration
    │
    After 30 days (or patient-specified duration):
    ├─ Smart contract revokes grant automatically
    ├─ Provider loses access to decryption key
    ├─ Data remains encrypted in provider's system
    ├─ Patient notified of expiration
    └─ Provider can request renewal (starts at Step 1)

Step 8: Patient Can Revoke Anytime
    │
    Patient initiates revocation:
    ├─ Opens consent management dashboard
    ├─ Selects active grant to revoke
    ├─ Confirms revocation
    └─ Smart contract immediately:
        ├─ Marks grant as revoked
        ├─ Provider's system locks access
        ├─ Audit log records revocation
        └─ Provider notified
```

### Access Purposes (HIPAA-Compliant)

```go
type AccessPurpose string

const (
    // HIPAA-defined purposes
    PurposeTreatment           AccessPurpose = "TREATMENT"            // Active medical care
    PurposePayment             AccessPurpose = "PAYMENT"              // Billing/claims
    PurposeOperations          AccessPurpose = "OPERATIONS"           // Healthcare operations

    // Additional purposes requiring consent
    PurposeResearch            AccessPurpose = "RESEARCH"             // Clinical research
    PurposePublicHealth        AccessPurpose = "PUBLIC_HEALTH"        // Disease reporting
    PurposeMarketing           AccessPurpose = "MARKETING"            // Prohibited without consent
    PurposeLegal               AccessPurpose = "LEGAL"                // Subpoena/court order
    PurposeEmergency           AccessPurpose = "EMERGENCY"            // Life-threatening situation
    PurposeWorkersComp         AccessPurpose = "WORKERS_COMP"         // Work-related injury
    PurposeDisability          AccessPurpose = "DISABILITY"           // Disability determination
    PurposeQualityImprovement  AccessPurpose = "QUALITY_IMPROVEMENT"  // QI initiatives
)
```

### Granular Permission Scopes

```go
type AccessScope struct {
    RecordTypes    []RecordType    // Types of records (labs, imaging, notes)
    DateRange      DateRange       // Time period (last 6 months, all time, etc.)
    Sensitivity    SensitivityLevel // Exclude highly sensitive (mental health, HIV, etc.)
    Actions        []Action        // VIEW, DOWNLOAD, PRINT, MODIFY
    Departments    []string        // Limit to specific departments (cardiology only)
}

type RecordType string

const (
    RecordTypeVisitNotes      RecordType = "VISIT_NOTES"
    RecordTypeLabs            RecordType = "LABS"
    RecordTypeImaging         RecordType = "IMAGING"
    RecordTypeMedications     RecordType = "MEDICATIONS"
    RecordTypeProcedures      RecordType = "PROCEDURES"
    RecordTypeAllergies       RecordType = "ALLERGIES"
    RecordTypeImmunizations   RecordType = "IMMUNIZATIONS"
    RecordTypeVitalSigns      RecordType = "VITAL_SIGNS"
    RecordTypeMentalHealth    RecordType = "MENTAL_HEALTH"     // Extra sensitive
    RecordTypeSubstanceAbuse  RecordType = "SUBSTANCE_ABUSE"    // Extra sensitive
    RecordTypeHIV             RecordType = "HIV"                // Extra sensitive
    RecordTypeGenetic         RecordType = "GENETIC"            // Extra sensitive
    RecordTypeReproductive    RecordType = "REPRODUCTIVE"       // Extra sensitive
)
```

### Zero-Knowledge Proof for Need Verification

Provider proves legitimate need WITHOUT revealing patient information:

```
ZK Proof: "I have a valid appointment with this patient"

Prover (Provider): Dr. Alice wants to prove she has appointment with John Doe
Verifier (Smart Contract): Needs to verify without learning appointment details

1. Commitment Phase:
   Dr. Alice commits to appointment hash:
   commitment = hash(appointment_id || appointment_date || patient_id || nonce)

2. Challenge Phase:
   Smart contract generates random challenge

3. Response Phase:
   Dr. Alice generates proof that:
   - Appointment exists in hospital system
   - Appointment date is within 7 days (past or future)
   - Patient John Doe is the subject
   - Dr. Alice is the scheduled provider

   WITHOUT revealing:
   - Actual appointment date
   - Reason for visit
   - Other appointments
   - Any other patient data

4. Verification Phase:
   Smart contract verifies proof cryptographically
   - If valid: Need-to-know established, proceed to patient consent
   - If invalid: Access request denied automatically
```

**Benefits**:
- Patient privacy preserved during verification
- No sensitive data exposed to smart contract
- Prevents fraudulent access requests
- Compliant with privacy regulations

### Emergency Access (Break-Glass)

For unconscious/incapacitated patients:

```
Emergency Access Protocol:

1. Provider declares emergency (life-threatening situation)
2. Provider signs emergency attestation with timestamp
3. Smart contract grants TEMPORARY access (4 hours)
4. Immediate alert sent to:
   - Patient's emergency contacts
   - Patient's primary care provider
   - Hospital compliance officer
   - Mainchain audit system
5. Provider must submit justification within 24 hours
6. Compliance review within 7 days
7. If unjustified:
   - Provider sanctioned
   - Access revoked
   - Incident reported to licensing board
   - Potential HIPAA violation fine
```

### Patient Consent Dashboard

Patient mobile app / web portal shows:

```
╔══════════════════════════════════════════════════════════════╗
║  MY MEDICAL DATA ACCESS                                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Active Access Grants (3)                                    ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ Dr. Alice Johnson (Cardiologist)                       │ ║
║  │ Purpose: Treatment                                     │ ║
║  │ Access: Cardiac records, medications                   │ ║
║  │ Granted: Jan 1, 2026                                   │ ║
║  │ Expires: Jan 31, 2026 (28 days remaining)             │ ║
║  │ Last accessed: Jan 10, 2026 (3 times)                 │ ║
║  │ [VIEW AUDIT LOG] [REVOKE ACCESS]                       │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  Pending Requests (1)                                        ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ Quest Diagnostics Lab                                  │ ║
║  │ Purpose: Lab testing for Dr. Johnson                   │ ║
║  │ Requested: Lab results, specimen info                  │ ║
║  │ Requested: Jan 12, 2026                                │ ║
║  │ [APPROVE] [DENY] [REQUEST MORE INFO]                   │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  Recent Access Activity (Last 30 days)                       ║
║  • Jan 10: Dr. Alice Johnson viewed cardiac records         ║
║  • Jan 8: CVS Pharmacy filled prescription                  ║
║  • Jan 5: Dr. Alice Johnson viewed lab results              ║
║  • Jan 3: Quest Diagnostics uploaded lab results            ║
║  [VIEW FULL AUDIT LOG]                                       ║
║                                                              ║
║  My Data Summary                                             ║
║  • 47 medical records across 3 healthcare systems            ║
║  • 12 providers have accessed my data (lifetime)             ║
║  • 234 MB of data (including 5 imaging studies)              ║
║  [DOWNLOAD MY DATA] [DELETE ACCOUNT]                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Cross-Chain Data Transfer

### Transfer Protocol: Encrypted IBC (Inter-Blockchain Communication)

When patient wants to send data from one chain to another:

```
Example: Transfer MRI scan from Ambulatory Imaging Center to Specialist

Step 1: Patient Initiates Transfer
    │
    Patient action in mobile app:
    ├─ "Share my recent MRI with Dr. Smith (Neurosurgeon)"
    ├─ Select source: Ambulatory Chain (Imaging Center MRI)
    ├─ Select destination: Clinic Chain (Dr. Smith)
    ├─ Select data: MRI scan from Dec 15, 2025
    └─ Confirm transfer

Step 2: Retrieve Source Data
    │
    Patient's device:
    ├─ Connects to Ambulatory Chain
    ├─ Authenticates with patient private key
    ├─ Retrieves encrypted MRI file CID from blockchain state
    ├─ Retrieves encrypted data from IPFS storage
    ├─ Decrypts with patient's master key
    └─ MRI file now in memory (still encrypted to patient)

Step 3: Encrypt for Recipient
    │
    Encryption handshake:
    ├─ Lookup Dr. Smith's public key from DID registry
    ├─ Generate ephemeral ECDH key pair for this transfer
    ├─ Derive shared secret: shared = ECDH(ephemeral_priv, dr_smith_pub)
    ├─ Derive encryption key: key = HKDF(shared, "blueblocks-transfer")
    ├─ Re-encrypt MRI file with new key (AES-256-GCM)
    │   └─ Includes: file hash, patient signature, timestamp
    └─ Encrypt transfer metadata separately

Step 4: Submit Cross-Chain Transfer Transaction
    │
    Transaction submitted to Mainchain:
    TransferRequest {
        transferId: "xfer_abc123",
        from: {
            chain: "ambulatory-chain",
            entity: "imaging-center-01",
            recordId: "mri_20251215_johndoe"
        },
        to: {
            chain: "clinic-chain",
            entity: "neurosurgery-group",
            providerId: "dr-smith-md"
        },
        patient: "did:blueblocks:patient:john",
        dataHash: "sha256:abcd1234...",  // Hash of encrypted data
        encryptedFileCID: "Qm...",        // IPFS CID of encrypted file
        encryptedKey: "...",              // Transfer key encrypted to recipient
        signature: "...",                 // Patient's signature
        timestamp: 1704067200,
        expiresAt: 1704153600             // 24 hours to claim
    }

Step 5: Mainchain Validates and Routes
    │
    Mainchain smart contract:
    ├─ Verify patient signature (authentication)
    ├─ Verify source chain has record (query via IBC)
    ├─ Verify recipient exists on destination chain
    ├─ Verify recipient is authorized provider
    ├─ Create escrow for atomic transfer
    └─ Emit TransferInitiated event

Step 6: IBC Relay Propagates
    │
    IBC relayer network:
    ├─ Monitors mainchain for TransferInitiated events
    ├─ Relayer picks up transfer request
    ├─ Validates cryptographic proofs
    ├─ Submits packet to destination chain
    └─ Two-phase commit begins

Step 7: Destination Chain Receives
    │
    Clinic Chain smart contract:
    ├─ Receives IBC packet from mainchain
    ├─ Validates packet proofs (light client verification)
    ├─ Verifies Dr. Smith is registered provider
    ├─ Creates pending transfer record
    └─ Notifies Dr. Smith of incoming data

Step 8: Recipient Claims Transfer
    │
    Dr. Smith's EMR system:
    ├─ Detects pending transfer notification
    ├─ Retrieves encrypted file from IPFS (using CID)
    ├─ Retrieves encrypted transfer key from blockchain
    ├─ Decrypts transfer key with Dr. Smith's private key (HSM)
    ├─ Decrypts MRI file with transfer key
    ├─ Validates file hash matches metadata
    ├─ Validates patient signature (non-repudiation)
    ├─ Imports into EMR as external record
    └─ Acknowledges receipt to destination chain

Step 9: Two-Phase Commit Completion
    │
    Destination chain:
    ├─ Records successful receipt
    ├─ Sends acknowledgment via IBC to mainchain

    Mainchain:
    ├─ Receives acknowledgment
    ├─ Finalizes transfer (removes escrow)
    ├─ Records completion in global audit log
    ├─ Notifies patient of successful transfer

    Source chain (optional):
    ├─ Receives completion notification
    ├─ Updates record metadata (shared with Dr. Smith)
    └─ Does NOT delete source data (maintain complete history)

Step 10: Audit Logging
    │
    Immutable audit entries created:

    Mainchain audit log:
    {
        transferId: "xfer_abc123",
        patient: "did:blueblocks:patient:john",
        sourceChain: "ambulatory-chain",
        destChain: "clinic-chain",
        dataType: "IMAGING_MRI",
        dataSize: 547834992,  // 522 MB
        initiatedAt: 1704067200,
        completedAt: 1704067245,  // 45 seconds
        status: "COMPLETED"
    }

    Patient's personal audit log:
    {
        action: "TRANSFER_INITIATED",
        from: "Imaging Center A",
        to: "Dr. Sarah Smith, Neurosurgery",
        recordType: "MRI Brain",
        timestamp: 1704067200
    }

    Dr. Smith's audit log (on clinic chain):
    {
        action: "DATA_RECEIVED",
        patient: "John Doe (MRN: 123456)",
        source: "Imaging Center A",
        recordType: "MRI Brain",
        fileSize: 547834992,
        receivedAt: 1704067245,
        receivedBy: "dr.smith@neurosurgery.example"
    }
```

### Direct P2P Emergency Transfer

For urgent care (bypass mainchain for speed):

```
Emergency Transfer (unconscious patient, ambulance to ER)

1. Paramedic scans patient QR code (emergency access token)
2. Direct connection established to patient's primary care chain
3. Authorized emergency data bundle retrieved:
   - Allergies
   - Current medications
   - Recent vital signs
   - Emergency contacts
   - Advanced directives (DNR, etc.)
4. Bundle encrypted with hospital ER public key
5. Transmitted via secure websocket (mTLS)
6. Hospital ER receives and decrypts
7. Data available before patient arrives
8. Retroactive audit log sync when mainchain available

Total time: < 5 seconds (vs. 30-60 seconds via mainchain)
```

### Atomic Cross-Chain Transactions

For complex workflows requiring coordination:

```
Example: Surgery Requiring Pre-Auth + Payment + Records Transfer

Atomic Transaction (all succeed or all fail):

1. Hospital Chain: Create surgery scheduling record
2. Insurance Chain: Submit prior authorization request
3. Clinic Chain: Transfer patient surgical history
4. Lab Chain: Transfer recent lab results
5. Pharmacy Chain: Verify medication reconciliation
6. Insurance Chain: Confirm coverage and payment guarantee
7. Hospital Chain: Finalize surgery schedule

If ANY step fails:
- All chains roll back to previous state
- Patient notified of failure reason
- Workflow can be retried after resolving issue

Implementation: Two-Phase Commit Protocol
- Phase 1 (Prepare): All chains tentatively execute
- Phase 2 (Commit): If all succeeded, finalize; else rollback
```

### Data Format Standardization

All transferred data uses FHIR R5 (Fast Healthcare Interoperability Resources):

```json
{
  "resourceType": "ImagingStudy",
  "id": "mri-20251215-johndoe",
  "status": "available",
  "subject": {
    "reference": "Patient/did:blueblocks:patient:john"
  },
  "started": "2025-12-15T14:30:00Z",
  "modality": [{
    "system": "http://dicom.nema.org/resources/ontology/DCM",
    "code": "MR",
    "display": "Magnetic Resonance"
  }],
  "numberOfSeries": 4,
  "numberOfInstances": 342,
  "series": [{
    "uid": "1.2.840.113619.2.408.4100027.123456",
    "number": 1,
    "modality": {
      "system": "http://dicom.nema.org/resources/ontology/DCM",
      "code": "MR"
    },
    "description": "T1 MPRAGE sagittal",
    "numberOfInstances": 176,
    "bodySite": {
      "system": "http://snomed.info/sct",
      "code": "12738006",
      "display": "Brain structure"
    },
    "instance": [{
      "uid": "1.2.840.113619.2.408.4100027.123456.1",
      "sopClass": {
        "system": "urn:ietf:rfc:3986",
        "code": "urn:oid:1.2.840.10008.5.1.4.1.1.4"
      },
      "number": 1,
      "title": "Slice 1",
      "content": [{
        "url": "ipfs://Qm.../slice001.dcm",
        "size": 524288,
        "hash": "sha256:abcd1234..."
      }]
    }]
  }],
  "extension": [{
    "url": "http://blueblocks.io/encryption",
    "valueString": "aes-256-gcm",
    "valueReference": {
      "reference": "#encryption-key-cid"
    }
  }]
}
```

---

## Large File Storage System

### Storage Architecture for Medical Images and Videos

Medical imaging files are HUGE:
- X-ray: 10-50 MB
- CT scan: 100-300 MB (hundreds of slices)
- MRI: 200-500 MB (thousands of slices)
- Ultrasound video: 50-200 MB
- Surgical video: 1-10 GB (hours of footage)
- Whole-slide pathology: 2-5 GB (gigapixel images)

**Challenge**: Cannot store on blockchain (too expensive, too slow)

**Solution**: Hybrid on-chain + off-chain storage

```
┌─────────────────────────────────────────────────────────────┐
│  HYBRID STORAGE ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ON-CHAIN (Blockchain State)                                │
│  - File metadata (size, type, hash)                         │
│  - IPFS Content ID (CID)                                     │
│  - Encryption key (encrypted to patient)                     │
│  - Access control list                                       │
│  - Audit trail                                               │
│  Cost: ~$0.01 per record                                     │
│  Size: ~1 KB per record                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  OFF-CHAIN (Distributed File Storage)                       │
│  - Encrypted file content                                    │
│  - IPFS for content-addressed storage                        │
│  - Filecoin for incentivized persistence                     │
│  - Pinning services for availability                         │
│  - CDN for fast retrieval                                    │
│  Cost: ~$0.01 per GB per month                               │
│  Size: Unlimited                                             │
└─────────────────────────────────────────────────────────────┘
```

### File Upload Flow

```
Step 1: Prepare File (Client-Side)
    │
    Doctor uploads MRI scan:
    ├─ Original file: brain_mri_study_123.zip (487 MB)
    │   └─ Contains 342 DICOM files + metadata
    │
    ├─ Compress (if not already):
    │   $ tar -cjf study_123.tar.bz2 brain_mri_study_123/
    │   Result: study_123.tar.bz2 (312 MB, 36% reduction)
    │
    ├─ Compute hash (for integrity):
    │   $ sha256sum study_123.tar.bz2
    │   Result: 7d8a... (64 hex characters)
    │
    ├─ Generate encryption key (AES-256):
    │   key = randomBytes(32)
    │   nonce = randomBytes(12)  // for GCM
    │
    ├─ Encrypt file (AES-256-GCM):
    │   encrypted = aes256gcm_encrypt(study_123.tar.bz2, key, nonce)
    │   Result: study_123.encrypted (312 MB, same size + 16 byte auth tag)
    │
    └─ Base64 encode (optional, for text-safe transmission):
        $ base64 study_123.encrypted > study_123.encrypted.b64
        Result: study_123.encrypted.b64 (416 MB, 33% larger)

        NOTE: Base64 encoding NOT required for binary protocols
        Use base64 only if transmitting via JSON/text protocol

Step 2: Upload to IPFS Storage
    │
    Client uploads encrypted file:
    ├─ Connect to IPFS node (hospital's local node)
    ├─ Add file to IPFS:
    │   $ ipfs add study_123.encrypted
    │   Result: CID = QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX
    │
    ├─ File is chunked (256 KB chunks) and distributed
    ├─ Content-addressed: same file always produces same CID
    ├─ Deduplicated: if file already exists, reuses existing chunks
    │
    └─ Upload time: ~60 seconds (312 MB at 5 MB/s)

Step 3: Pin to Multiple Locations (Redundancy)
    │
    Ensure file persistence:
    ├─ Pin on hospital IPFS node (local)
    ├─ Pin on regional IPFS cluster (3 copies in different datacenters)
    ├─ Pin on Filecoin (incentivized long-term storage)
    │   └─ Storage deal: 312 MB for 1 year at $0.01/GB = $3.12
    ├─ Optional: Pin on Pinata/Infura (backup pinning services)
    │
    └─ Redundancy: File stored in 5+ locations

Step 4: Submit Metadata to Blockchain
    │
    Transaction submitted to appropriate sidechain:
    MedicalFileMetadata {
        fileId: "file_abc123",
        patient: "did:blueblocks:patient:john",
        recordType: "IMAGING_MRI",
        studyDescription: "Brain MRI with and without contrast",
        bodyPart: "BRAIN",
        modality: "MR",
        studyDate: "2025-12-15",

        // File details
        originalSize: 487000000,       // 487 MB
        compressedSize: 312000000,     // 312 MB
        compression: "tar.bz2",

        // Storage details
        storageCID: "QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX",
        storageProtocol: "ipfs",
        pinLocations: [
            "hospital-node-01",
            "regional-cluster-west",
            "filecoin-deal-12345"
        ],

        // Security
        encryptedKey: "base64_encrypted_aes_key",  // Encrypted to patient
        fileHash: "sha256:7d8a...",
        encryption: "aes-256-gcm",

        // Classification (see next section)
        classification: "HIPAA_PHI",

        // Metadata
        uploadedBy: "did:blueblocks:provider:radiologist-dr-jones",
        uploadedAt: 1704067200,
        chain: "ambulatory-chain"
    }

    Cost: ~$0.01 (gas fee)

Step 5: Provider/Patient Can Now Retrieve
    │
    Retrieval flow:
    ├─ Query blockchain for file metadata (by fileId or patient)
    ├─ Get IPFS CID from metadata
    ├─ Retrieve encrypted file from IPFS:
    │   $ ipfs get QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX
    │   Download time: ~30 seconds (from nearest IPFS node)
    │
    ├─ Decrypt encryption key (using patient or provider private key)
    ├─ Decrypt file (AES-256-GCM)
    ├─ Verify hash matches metadata (integrity check)
    ├─ Decompress (tar -xjf)
    ├─ Open in DICOM viewer or medical imaging software
    │
    └─ Audit log records retrieval
```

### Storage Classifications and Handling

```go
type StorageClassification string

const (
    // PUBLIC: No PHI, publicly accessible
    // Examples: Public health statistics, educational materials, drug databases
    ClassPublic StorageClassification = "PUBLIC"

    // PRIVATE: Non-medical personal data
    // Examples: Appointment schedules (no medical details), contact preferences
    ClassPrivate StorageClassification = "PRIVATE"

    // NMPI: Non-Medical Personal Information
    // Examples: Insurance ID numbers, billing addresses, employment info
    ClassNMPI StorageClassification = "NMPI"

    // MPI: Medical Personal Information (non-PHI)
    // Examples: De-identified research data, aggregated statistics
    ClassMPI StorageClassification = "MPI"

    // HIPAA_PHI: HIPAA Protected Health Information
    // Examples: Medical records, lab results, diagnoses, prescriptions
    // Requires: Encryption, audit logging, access controls, BAA
    ClassHIPAA StorageClassification = "HIPAA_PHI"

    // GDPR: EU General Data Protection Regulation
    // Examples: EU patient data, requires right to erasure, portability
    // Requires: Encryption, explicit consent, data processing agreements
    ClassGDPR StorageClassification = "GDPR"

    // HIPAA_GDPR: Both HIPAA and GDPR apply
    // Examples: EU patients treated in US facilities
    // Requires: Most stringent requirements of both regulations
    ClassHIPAA_GDPR StorageClassification = "HIPAA_GDPR"
)

type StoragePolicy struct {
    Classification       StorageClassification
    EncryptionRequired   bool
    EncryptionAlgorithm  string
    AuditLogRequired     bool
    AuditLogLevel        string  // "summary" or "detailed"
    AccessControlRequired bool
    RetentionPeriod      time.Duration
    GeoRestrictions      []string  // Country codes where data can be stored
    BackupRequired       bool
    BackupLocations      int       // Number of backup locations
    TransitEncryption    bool      // TLS/mTLS required
}

var StoragePolicies = map[StorageClassification]StoragePolicy{
    ClassPublic: {
        Classification:       ClassPublic,
        EncryptionRequired:   false,
        AuditLogRequired:     false,
        AccessControlRequired: false,
        RetentionPeriod:      0,  // Indefinite
        GeoRestrictions:      nil,
        BackupRequired:       false,
        TransitEncryption:    false,
    },

    ClassPrivate: {
        Classification:       ClassPrivate,
        EncryptionRequired:   true,
        EncryptionAlgorithm:  "aes-256-gcm",
        AuditLogRequired:     true,
        AuditLogLevel:        "summary",
        AccessControlRequired: true,
        RetentionPeriod:      7 * 365 * 24 * time.Hour,  // 7 years
        GeoRestrictions:      nil,
        BackupRequired:       true,
        BackupLocations:      2,
        TransitEncryption:    true,
    },

    ClassHIPAA: {
        Classification:       ClassHIPAA,
        EncryptionRequired:   true,
        EncryptionAlgorithm:  "aes-256-gcm",
        AuditLogRequired:     true,
        AuditLogLevel:        "detailed",
        AccessControlRequired: true,
        RetentionPeriod:      7 * 365 * 24 * time.Hour,  // 7 years (HIPAA minimum)
        GeoRestrictions:      []string{"US"},  // Must stay in US
        BackupRequired:       true,
        BackupLocations:      3,  // 3-2-1 backup rule
        TransitEncryption:    true,
    },

    ClassGDPR: {
        Classification:       ClassGDPR,
        EncryptionRequired:   true,
        EncryptionAlgorithm:  "aes-256-gcm",
        AuditLogRequired:     true,
        AuditLogLevel:        "detailed",
        AccessControlRequired: true,
        RetentionPeriod:      10 * 365 * 24 * time.Hour,  // 10 years (varies by country)
        GeoRestrictions:      []string{"EU", "EEA"},  // Must stay in EU/EEA
        BackupRequired:       true,
        BackupLocations:      3,
        TransitEncryption:    true,
    },

    ClassHIPAA_GDPR: {
        Classification:       ClassHIPAA_GDPR,
        EncryptionRequired:   true,
        EncryptionAlgorithm:  "aes-256-gcm",
        AuditLogRequired:     true,
        AuditLogLevel:        "detailed",
        AccessControlRequired: true,
        RetentionPeriod:      10 * 365 * 24 * time.Hour,  // Longer of HIPAA/GDPR
        GeoRestrictions:      []string{"US", "EU", "EEA"},
        BackupRequired:       true,
        BackupLocations:      3,
        TransitEncryption:    true,
    },
}
```

### Storage Node Classification

IPFS storage nodes in the network are tagged with capabilities:

```
Storage Node Registry (on mainchain):

{
    nodeId: "ipfs-node-mayo-01",
    operator: "Mayo Clinic",
    location: {
        country: "US",
        state: "MN",
        city: "Rochester",
        datacenter: "mayo-dc-primary"
    },
    certifications: [
        "HIPAA_COMPLIANT",
        "SOC2_TYPE2",
        "ISO27001"
    ],
    storageCapacity: 100TB,
    storageUsed: 43TB,
    classifications: [
        "PUBLIC",
        "PRIVATE",
        "NMPI",
        "MPI",
        "HIPAA_PHI"
    ],
    canStore: {
        "PUBLIC": true,
        "PRIVATE": true,
        "NMPI": true,
        "MPI": true,
        "HIPAA_PHI": true,
        "GDPR": false  // Not in EU, cannot store GDPR data
    },
    pricing: {
        "PUBLIC": 0,
        "PRIVATE": 0.001,  // $ per GB per month
        "HIPAA_PHI": 0.01
    },
    availability: "99.99%",
    bandwidth: "10 Gbps",
    lastHeartbeat: 1704067200
}
```

When uploading a file:
1. Client queries mainchain for eligible storage nodes based on classification
2. Selects nodes that meet requirements (location, certifications, capacity)
3. Uploads to 3+ nodes for redundancy
4. Records node IDs in blockchain metadata

### Large File Optimization Techniques

#### 1. Chunking for Streaming

Instead of downloading entire 500 MB MRI before viewing:

```
DICOM Study Structure:
├─ Series 1: T1 weighted (176 slices)
│   ├─ Slice 001 (1.5 MB) ─────► IPFS CID: Qm...001
│   ├─ Slice 002 (1.5 MB) ─────► IPFS CID: Qm...002
│   └─ ...
├─ Series 2: T2 weighted (176 slices)
└─ Series 3: FLAIR (88 slices)

Viewer downloads slices on-demand:
1. Download slice 88 (middle of brain) immediately - 1.5 MB in 0.3 sec
2. Display while loading adjacent slices
3. User scrolls through study, slices load just-in-time
4. Cache previously viewed slices locally

Total initial load: 1.5 MB (vs. 312 MB)
Time to first image: 0.3 seconds (vs. 60 seconds)
```

#### 2. Progressive JPEG 2000 Encoding

For pathology whole-slide images (gigapixel):

```
Whole Slide Image: 100,000 x 80,000 pixels (8 gigapixels)
Uncompressed: 24 GB (3 bytes per pixel)
JPEG 2000: 2.4 GB (90% compression, 10:1 ratio)

Progressive layers:
├─ Layer 0: Thumbnail (512x512) ─────► 100 KB, loads in 0.02 sec
├─ Layer 1: Low res (2048x2048) ─────► 2 MB, loads in 0.4 sec
├─ Layer 2: Medium res (8192x8192) ──► 20 MB, loads in 4 sec
└─ Layer 3: Full res (100000x80000) ─► 2.4 GB, loads on-demand per tile

Pathologist sees thumbnail immediately, zooms to area of interest,
only that tile downloads at full resolution.
```

#### 3. Deduplication

Same X-ray of chest taken at multiple visits:

```
Patient has 5 chest X-rays over 2 years.
Images are 80% identical (same patient anatomy).

Traditional storage: 5 * 10 MB = 50 MB

IPFS deduplication:
- Each image chunked into 256 KB blocks
- Identical blocks (rib cage, spine) stored once
- Only changed blocks (lung findings) stored new
- Total storage: 10 MB + (5 * 2 MB deltas) = 20 MB

60% storage reduction
```

#### 4. Compression Choice Matrix

```
| File Type          | Compression | Ratio | Speed   | Quality |
|--------------------|-------------|-------|---------|---------|
| DICOM (medical img)| None        | 1:1   | Fastest | Perfect |
| DICOM (non-lossy)  | JPEG-LS     | 2:1   | Fast    | Perfect |
| DICOM (lossy OK)   | JPEG 2000   | 10:1  | Medium  | Excellent |
| Office documents   | tar.gz      | 3:1   | Fast    | Perfect |
| Office documents   | tar.bz2     | 4:1   | Slow    | Perfect |
| Office documents   | tar.zst     | 4:1   | Fast    | Perfect |
| Video (surgical)   | H.265       | 50:1  | Slow    | Excellent |
| Pathology WSI      | JPEG 2000   | 15:1  | Medium  | Excellent |

Recommendation: tar.zst (Zstandard) for general use
- Better compression than gzip
- Faster than bzip2
- Adjustable compression levels (1-22)
- Widely supported
```

---

## Non-Repudiation System

Non-repudiation ensures that no party can deny:
- Creating a medical record
- Accessing a patient's data
- Authorizing a treatment
- Receiving data transfer

### Digital Signature Requirements

Every action in the system MUST be signed:

```go
type SignedAction struct {
    // Action details
    ActionType    ActionType    `json:"action_type"`
    Actor         string        `json:"actor"`        // DID of person/entity
    Timestamp     int64         `json:"timestamp"`    // Unix timestamp
    Payload       interface{}   `json:"payload"`      // Action-specific data

    // Cryptographic proof
    Signature     []byte        `json:"signature"`    // Ed25519 signature
    PublicKey     []byte        `json:"public_key"`   // Actor's public key
    SigningAlgo   string        `json:"signing_algo"` // "ed25519"

    // Timestamping (RFC 3161)
    TSASignature  []byte        `json:"tsa_signature"`  // Timestamp authority signature
    TSACertificate []byte       `json:"tsa_cert"`       // TSA certificate

    // Blockchain anchoring
    BlockHeight   uint64        `json:"block_height"` // Block where recorded
    TxHash        string        `json:"tx_hash"`      // Transaction hash
    MerkleProof   []byte        `json:"merkle_proof"` // Proof of inclusion
}

type ActionType string

const (
    ActionCreateRecord      ActionType = "CREATE_RECORD"
    ActionAccessRecord      ActionType = "ACCESS_RECORD"
    ActionModifyRecord      ActionType = "MODIFY_RECORD"
    ActionDeleteRecord      ActionType = "DELETE_RECORD"
    ActionGrantAccess       ActionType = "GRANT_ACCESS"
    ActionRevokeAccess      ActionType = "REVOKE_ACCESS"
    ActionTransferData      ActionType = "TRANSFER_DATA"
    ActionPrescribeMedication ActionType = "PRESCRIBE_MEDICATION"
    ActionOrderLab          ActionType = "ORDER_LAB"
    ActionReportResult      ActionType = "REPORT_RESULT"
)
```

### Signature Verification Process

```
When verifying a signed action:

1. Extract components:
   - payload: The action data
   - signature: Ed25519 signature bytes
   - publicKey: Signer's public key
   - timestamp: When action occurred

2. Verify signature:
   message = canonicalJSON(payload) + timestamp
   valid = ed25519.Verify(publicKey, message, signature)
   if not valid:
       reject "Invalid signature"

3. Verify public key ownership:
   - Query DID registry for actor's DID document
   - Confirm publicKey is listed in their DID document
   - Check key has not been revoked
   if key not in DID or revoked:
       reject "Key not authorized"

4. Verify timestamp:
   - Check TSA signature (if present)
   - Confirm timestamp within acceptable range (not too old/future)
   - For legal purposes, TSA timestamp is authoritative
   if timestamp invalid:
       reject "Invalid timestamp"

5. Verify blockchain anchoring:
   - Query blockchain for transaction at txHash
   - Verify transaction contains hash of this action
   - Verify merkle proof shows inclusion in block
   - Confirm block is finalized (not orphaned)
   if not anchored:
       reject "Action not on blockchain"

6. If all checks pass:
   - Action is verified as authentic
   - Cannot be repudiated by actor
   - Legally binding (digital signature laws)
```

### Timestamp Authority Integration

For long-term legal validity (beyond key expiration):

```
RFC 3161 Trusted Timestamp Protocol:

When action is signed:
1. Compute hash of signed action:
   hash = SHA256(action || signature)

2. Send Timestamp Request to TSA:
   POST https://tsa.example.com/rfc3161
   Content-Type: application/timestamp-query
   Body: TimeStampReq {
       version: 1,
       messageImprint: hash,
       reqPolicy: "1.2.3.4.5",  // TSA policy OID
       nonce: randomBytes(8)
   }

3. TSA validates request and signs timestamp:
   TimeStampToken {
       version: 1,
       policy: "1.2.3.4.5",
       messageImprint: hash,
       serialNumber: 123456,
       genTime: "2026-01-14T10:30:00Z",
       accuracy: 1 second,
       tsa: "CN=DigiCert Timestamp Authority"
   }
   Signed with TSA's private key (RSA-4096)

4. TSA returns TimeStampToken signed by trusted authority

5. Token stored with action in blockchain

6. Verification (years later, even if actor's key expired):
   - Verify TSA signature with TSA's certificate
   - Confirm certificate valid at signature time
   - Prove action existed at timestamp
   - Legally enforceable proof-of-existence
```

**Recommended TSAs**:
- DigiCert Timestamp Service
- Sectigo Timestamp Service
- GlobalSign Timestamp Service
- Free: FreeTSA.org (for testing only)

### Audit Trail Requirements

Every access to medical data creates immutable audit log:

```go
type AuditLogEntry struct {
    // Unique identifier
    AuditID       string        `json:"audit_id"`

    // Who
    Actor         string        `json:"actor"`          // DID of accessor
    ActorType     ActorType     `json:"actor_type"`     // Patient, Provider, System
    ActorName     string        `json:"actor_name"`     // Human-readable name
    ActorRole     string        `json:"actor_role"`     // Physician, Nurse, Admin

    // What
    Action        ActionType    `json:"action"`
    ResourceType  string        `json:"resource_type"`  // MedicalRecord, Imaging, Lab
    ResourceID    string        `json:"resource_id"`    // Specific record ID
    DataAccessed  []string      `json:"data_accessed"`  // Fields/files accessed

    // When
    Timestamp     int64         `json:"timestamp"`

    // Where
    SourceIP      string        `json:"source_ip"`
    SourceChain   string        `json:"source_chain"`
    UserAgent     string        `json:"user_agent"`
    Geolocation   string        `json:"geolocation"`    // City, State

    // Why
    Purpose       AccessPurpose `json:"purpose"`        // Treatment, Payment, etc.
    AccessGrant   string        `json:"access_grant"`   // Grant ID that authorized

    // How
    AccessMethod  string        `json:"access_method"`  // EMR, Web Portal, API

    // Result
    Success       bool          `json:"success"`
    ErrorCode     string        `json:"error_code"`     // If failed

    // Proof (Non-Repudiation)
    Signature     []byte        `json:"signature"`
    PublicKey     []byte        `json:"public_key"`
    TSAToken      []byte        `json:"tsa_token"`

    // Blockchain Anchoring
    BlockHeight   uint64        `json:"block_height"`
    TxHash        string        `json:"tx_hash"`

    // Retention
    RetentionDate int64         `json:"retention_date"` // When can be deleted
}

type ActorType string

const (
    ActorPatient    ActorType = "PATIENT"
    ActorProvider   ActorType = "PROVIDER"
    ActorPayer      ActorType = "PAYER"
    ActorResearcher ActorType = "RESEARCHER"
    ActorSystem     ActorType = "SYSTEM"
    ActorThirdParty ActorType = "THIRD_PARTY"
)
```

### Audit Log Query Interface

Patients can view WHO accessed their data:

```
Patient Audit Log Query:
┌──────────────────────────────────────────────────────────────┐
│ WHO ACCESSED MY MEDICAL RECORDS?                             │
├──────────────────────────────────────────────────────────────┤
│ Date Range: [Last 30 days ▼]                                 │
│ Filter by: [All providers ▼]                                 │
│                                                               │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Jan 14, 2026 10:32 AM                                    │ │
│ │ Dr. Alice Johnson (Cardiologist)                         │ │
│ │ Action: Viewed medical records                           │ │
│ │ Records: Cardiac history, Current medications            │ │
│ │ Purpose: Treatment                                       │ │
│ │ Location: Mayo Clinic, Rochester MN                      │ │
│ │ IP: 203.0.113.42                                         │ │
│ │ [VERIFY SIGNATURE] [EXPORT PROOF]                        │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Jan 12, 2026 2:15 PM                                     │ │
│ │ Quest Diagnostics Lab                                    │ │
│ │ Action: Uploaded lab results                             │ │
│ │ Records: Lipid panel, CBC                                │ │
│ │ Purpose: Test results for Dr. Johnson                    │ │
│ │ Location: Quest Lab, Phoenix AZ                          │ │
│ │ IP: 198.51.100.17                                        │ │
│ │ [VERIFY SIGNATURE] [EXPORT PROOF]                        │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Jan 10, 2026 9:03 AM                                     │ │
│ │ CVS Pharmacy (Pharmacist: Jane Smith)                    │ │
│ │ Action: Viewed prescription                              │ │
│ │ Records: Atorvastatin prescription                       │ │
│ │ Purpose: Dispensing medication                           │ │
│ │ Location: CVS #1234, Scottsdale AZ                       │ │
│ │ IP: 192.0.2.89                                           │ │
│ │ [VERIFY SIGNATURE] [EXPORT PROOF]                        │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                               │
│ [DOWNLOAD FULL AUDIT LOG] [REPORT UNAUTHORIZED ACCESS]       │
└──────────────────────────────────────────────────────────────┘
```

Compliance officers can query by provider:

```sql
-- Find all accesses by specific provider
SELECT * FROM audit_logs
WHERE actor = 'did:blueblocks:provider:dr-alice-johnson'
  AND timestamp > UNIX_TIMESTAMP('2026-01-01')
ORDER BY timestamp DESC;

-- Find all failed access attempts (potential breach)
SELECT * FROM audit_logs
WHERE success = false
  AND action = 'ACCESS_RECORD'
  AND timestamp > UNIX_TIMESTAMP('2026-01-01')
GROUP BY actor;

-- Find all emergency break-glass accesses (for review)
SELECT * FROM audit_logs
WHERE purpose = 'EMERGENCY'
  AND timestamp > UNIX_TIMESTAMP('2026-01-01');
```

### Data Integrity Verification

Prove medical record has not been tampered with:

```
Integrity Verification:

1. Retrieve record from blockchain/storage
2. Retrieve original signature and timestamp from blockchain
3. Compute hash of current record content
4. Compare with hash in original signature
5. If match: Record unmodified since creation
   If no match: Record has been tampered with

Example verification:
$ afterblock verify-record --id record_abc123

Verifying record: record_abc123
✓ Record found on hospital-chain
✓ Signature valid (Dr. Alice Johnson, Jan 14 2026 10:32:45 AM)
✓ Timestamp authority signature valid (DigiCert)
✓ Hash matches: SHA256:7d8a9b3c...
✓ Blockchain anchor confirmed at block 12345678
✓ Merkle proof valid

RESULT: Record is authentic and unmodified since creation.
Non-repudiation established. Legally defensible.
```

---

## Security Implementation

### Data in Motion Protection (Network Layer)

**ALL network communication MUST be encrypted:**

#### 1. mTLS (Mutual TLS) Between Chains

```go
// Configure mTLS for inter-chain communication
func configureMTLS() (*tls.Config, error) {
    // Load node's certificate and private key
    cert, err := tls.LoadX509KeyPair(
        "/etc/blueblocks/certs/node.crt",
        "/etc/blueblocks/keys/node.key",
    )
    if err != nil {
        return nil, err
    }

    // Load CA certificate pool (trusted chain CAs)
    caCert, err := os.ReadFile("/etc/blueblocks/certs/ca.crt")
    if err != nil {
        return nil, err
    }
    caCertPool := x509.NewCertPool()
    caCertPool.AppendCertsFromPEM(caCert)

    // Configure TLS 1.3 with strong cipher suites
    return &tls.Config{
        Certificates: []tls.Certificate{cert},
        ClientCAs:    caCertPool,
        RootCAs:      caCertPool,
        MinVersion:   tls.VersionTLS13,
        ClientAuth:   tls.RequireAndVerifyClientCert, // Mutual auth
        CipherSuites: []uint16{
            tls.TLS_AES_256_GCM_SHA384,
            tls.TLS_CHACHA20_POLY1305_SHA256,
        },
        CurvePreferences: []tls.CurveID{
            tls.X25519, // Modern, fast, secure
        },
    }, nil
}
```

#### 2. Perfect Forward Secrecy for Cross-Chain Transfers

```go
// ECDH key exchange for ephemeral session keys
func establishSecureChannel(recipientPubKey []byte) (*SecureChannel, error) {
    // Generate ephemeral key pair
    ephemeralPriv, ephemeralPub, err := ed25519.GenerateKey(rand.Reader)
    if err != nil {
        return nil, err
    }

    // Perform ECDH to derive shared secret
    sharedSecret, err := curve25519.X25519(ephemeralPriv, recipientPubKey)
    if err != nil {
        return nil, err
    }

    // Derive encryption key using HKDF
    kdf := hkdf.New(sha256.New, sharedSecret, nil, []byte("blueblocks-v1"))
    sessionKey := make([]byte, 32)
    if _, err := io.ReadFull(kdf, sessionKey); err != nil {
        return nil, err
    }

    return &SecureChannel{
        SessionKey:      sessionKey,
        EphemeralPubKey: ephemeralPub,
        RecipientPubKey: recipientPubKey,
    }, nil
}

// After session ends, session key is destroyed
// Even if long-term keys are compromised, past sessions remain secure
```

#### 3. Network Segmentation

```
Network Architecture:

┌────────────────────────────────────────────────────────────┐
│  PUBLIC INTERNET                                           │
│  - Patient mobile apps                                     │
│  - Provider EMR systems                                    │
│  - Third-party integrations                                │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       │ TLS 1.3 (HTTPS)
                       │ Certificate pinning
                       ▼
┌────────────────────────────────────────────────────────────┐
│  DMZ (Demilitarized Zone)                                  │
│  - API Gateway (authentication, rate limiting)             │
│  - Web Application Firewall (WAF)                          │
│  - DDoS protection (CloudFlare, AWS Shield)                │
│  - Load balancers                                          │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       │ mTLS
                       │ IP whitelist
                       ▼
┌────────────────────────────────────────────────────────────┐
│  APPLICATION TIER                                          │
│  - Blockchain nodes (mainchain + sidechains)               │
│  - Smart contract execution engines                        │
│  - API servers                                             │
│  - No direct internet access                               │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       │ Encrypted connections
                       │ Service mesh (Istio)
                       ▼
┌────────────────────────────────────────────────────────────┐
│  DATA TIER                                                 │
│  - Database servers (encrypted at rest)                    │
│  - IPFS storage nodes                                      │
│  - HSMs for key storage                                    │
│  - Backup systems                                          │
│  - No external network access                              │
└────────────────────────────────────────────────────────────┘

Private network: 10.0.0.0/8
Microsegmentation: Each sidechain on separate VLAN
Firewall rules: Deny all, allow specific ports only
```

### Data at Rest Protection (Storage Layer)

**ALL medical data MUST be encrypted at rest:**

#### 1. Layered Encryption

```
Multiple layers of encryption for defense-in-depth:

┌────────────────────────────────────────────────────────────┐
│  Layer 1: Application-Level Encryption                     │
│  - Each medical record encrypted with unique AES-256 key   │
│  - Key derived from patient master key                     │
│  - Encrypted BEFORE storage                                │
└──────────────────────┬─────────────────────────────────────┘
                       │ Encrypted medical record
                       ▼
┌────────────────────────────────────────────────────────────┐
│  Layer 2: File System Encryption                           │
│  - LUKS (Linux Unified Key Setup) full disk encryption     │
│  - OR dm-crypt with AES-XTS-256                            │
│  - Protects against physical disk theft                    │
└──────────────────────┬─────────────────────────────────────┘
                       │ Double-encrypted data
                       ▼
┌────────────────────────────────────────────────────────────┐
│  Layer 3: Database Encryption (TDE)                        │
│  - PostgreSQL: pgcrypto extension                          │
│  - Transparent Data Encryption                             │
│  - Encrypted database files on disk                        │
└──────────────────────┬─────────────────────────────────────┘
                       │ Triple-encrypted data
                       ▼
┌────────────────────────────────────────────────────────────┐
│  Layer 4: Backup Encryption                                │
│  - Backups encrypted with separate key                     │
│  - Key stored in different location                        │
│  - Protects against backup theft                           │
└────────────────────────────────────────────────────────────┘

Result: Attacker must compromise ALL layers to read data
```

#### 2. Per-Patient Encryption Keys

```go
// Each patient has unique master key
func derivePatientRecordKey(patientMasterKey []byte, recordID string) []byte {
    // Use HKDF to derive unique key per record
    info := []byte("blueblocks-record:" + recordID)
    kdf := hkdf.New(sha256.New, patientMasterKey, nil, info)

    recordKey := make([]byte, 32) // 256 bits
    io.ReadFull(kdf, recordKey)

    return recordKey
}

// Encrypt medical record
func encryptRecord(record *MedicalRecord, patientMasterKey []byte) ([]byte, error) {
    // Derive unique key for this record
    key := derivePatientRecordKey(patientMasterKey, record.ID)
    defer zeroBytes(key) // Clear from memory after use

    // Generate random nonce (NEVER reuse)
    nonce := make([]byte, 12)
    if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
        return nil, err
    }

    // AES-256-GCM provides encryption + authentication
    block, err := aes.NewCipher(key)
    if err != nil {
        return nil, err
    }
    aesgcm, err := cipher.NewGCM(block)
    if err != nil {
        return nil, err
    }

    // Serialize record to JSON
    plaintext, err := json.Marshal(record)
    if err != nil {
        return nil, err
    }

    // Encrypt (ciphertext includes authentication tag)
    ciphertext := aesgcm.Seal(nil, nonce, plaintext, nil)

    // Prepend nonce to ciphertext (nonce doesn't need to be secret)
    encrypted := append(nonce, ciphertext...)

    return encrypted, nil
}
```

#### 3. Crypto-Shredding for Right to Erasure

Instead of deleting data (impossible on blockchain), destroy encryption key:

```go
// GDPR Right to Erasure: Delete patient's master key
func cryptoShred(patientDID string) error {
    // 1. Retrieve patient's master key from secure storage
    masterKey, err := keystore.GetMasterKey(patientDID)
    if err != nil {
        return err
    }

    // 2. Overwrite key in memory (prevent swapfile recovery)
    zeroBytes(masterKey)

    // 3. Delete key from all storage locations
    keystore.DeleteMasterKey(patientDID)
    hsm.DeleteKey(patientDID)
    backupKeystore.DeleteMasterKey(patientDID)

    // 4. Record crypto-shredding event on blockchain (irreversible)
    tx := CryptoShredTransaction{
        Patient:   patientDID,
        Timestamp: time.Now().Unix(),
        Reason:    "RIGHT_TO_ERASURE_REQUEST",
    }
    blockchain.SubmitTransaction(tx)

    // 5. All medical records remain on blockchain BUT:
    //    - Ciphertext still exists
    //    - Decryption key destroyed
    //    - Data is cryptographically erased (unrecoverable)
    //    - Complies with GDPR Article 17

    return nil
}

func zeroBytes(b []byte) {
    for i := range b {
        b[i] = 0
    }
}
```

**Legal Opinion Required**: Crypto-shredding for GDPR compliance should be validated by legal counsel specializing in privacy law.

---

## Technical Specifications

### Cryptographic Algorithms

| Purpose | Algorithm | Key Size | Notes |
|---------|-----------|----------|-------|
| Digital Signatures | Ed25519 | 256-bit | Fast, secure, small signatures (64 bytes) |
| Key Exchange | X25519 (ECDH) | 256-bit | Perfect forward secrecy |
| Symmetric Encryption | AES-256-GCM | 256-bit | Authenticated encryption, prevents tampering |
| Hashing | SHA-256 | 256-bit output | NIST approved, widely supported |
| Key Derivation | HKDF-SHA256 | Variable | RFC 5869 standard |
| Password Hashing | Argon2id | 256-bit output | Memory-hard, GPU-resistant |
| Timestamp Signatures | RSA-4096 | 4096-bit | TSA standard, long-term validity |

### Performance Benchmarks (Target)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Transaction Throughput | 10,000 TPS per sidechain | Sustained load |
| Cross-Chain Transfer | < 2 seconds | 95th percentile |
| Smart Contract Execution | < 100 ms | Average |
| File Upload (100 MB) | < 30 seconds | With encryption |
| File Download (100 MB) | < 15 seconds | From nearest IPFS node |
| Signature Verification | < 1 ms | Ed25519 |
| Access Grant Creation | < 500 ms | Including ZK proof |
| Audit Log Query | < 100 ms | Last 1000 entries |
| Block Finality | < 5 seconds | Tendermint consensus |

### Scalability Projections

```
System Capacity (per sidechain):

Small deployment:
- 4 validators
- 10,000 patients
- 100 providers
- 100 transactions/sec
- 10 TB storage
- Cost: $50K/year

Medium deployment:
- 10 validators
- 100,000 patients
- 1,000 providers
- 1,000 transactions/sec
- 100 TB storage
- Cost: $500K/year

Large deployment (National scale):
- 50 validators
- 10,000,000 patients
- 100,000 providers
- 10,000 transactions/sec
- 10 PB storage
- Cost: $10M/year

Mainchain capacity:
- 100+ sidechains
- Routing 1M cross-chain transfers/day
- 1000 validators globally
- Petabyte-scale global audit log
```

### Technology Stack Recommendations

```yaml
mainchain:
  consensus: Tendermint BFT
  smart_contracts: CosmWasm (Rust)
  storage: IAVL tree (Cosmos SDK)
  networking: Tendermint P2P

sidechains:
  consensus: Tendermint BFT (per chain)
  smart_contracts: Starlark (Python-like, already implemented)
  storage: PostgreSQL with pgcrypto
  networking: Tendermint P2P + IBC

cross_chain:
  protocol: IBC (Inter-Blockchain Communication)
  relayer: Hermes or Go Relayer
  bridges: Custom bridges for non-IBC chains

file_storage:
  primary: IPFS (InterPlanetary File System)
  incentivized: Filecoin
  pinning: Pinata, Infura, Self-hosted clusters
  cdn: CloudFlare for fast retrieval

encryption:
  library: Go crypto/aes, crypto/ed25519, golang.org/x/crypto
  hsm: PKCS#11 interface (supports Thales, YubiHSM, AWS CloudHSM)

identity:
  did_method: did:blueblocks (custom DID method)
  verification: DIDComm for peer communication
  resolution: Universal Resolver

monitoring:
  metrics: Prometheus + Grafana
  logging: ELK Stack (Elasticsearch, Logstash, Kibana)
  tracing: Jaeger (OpenTelemetry)
  alerting: PagerDuty

infrastructure:
  orchestration: Kubernetes
  service_mesh: Istio (for mTLS, traffic management)
  cloud: AWS, Azure, or on-premise
  backup: Restic (encrypted backups)
```

---

## Implementation Roadmap

### Phase 1: Foundation (Months 1-6) - SECURITY FIRST

**Objective**: Fix critical security issues and build sidechain foundation

**Deliverables**:
1. ✅ Fix all critical vulnerabilities from security review
   - Argon2id password hashing
   - Transaction signing and replay protection
   - TLS/mTLS for all communication
   - Authentication and authorization framework
   - Input validation and rate limiting

2. ✅ Implement single sidechain (Hospital Chain)
   - Tendermint consensus integration
   - 4+ validators (test network)
   - Basic smart contracts (patient records)
   - Audit logging system

3. ✅ Build key management system
   - HD wallet implementation
   - HSM integration for institutional keys
   - Patient key backup (Shamir Secret Sharing)
   - Key rotation mechanisms

4. ✅ Testnet deployment
   - 1 mainchain + 1 sidechain
   - Synthetic test data (NO real PHI)
   - Security testing and penetration testing
   - Performance benchmarking

**Team**: 3-4 developers + 1 security consultant
**Cost**: $300K - $500K
**Success Criteria**: Pass third-party security audit

---

### Phase 2: Multi-Chain & Access Control (Months 7-12)

**Objective**: Add multiple sidechains and patient-controlled access

**Deliverables**:
1. ✅ Deploy 5 sidechains:
   - Hospital Chain
   - Clinic Chain
   - Lab Chain
   - Insurance Chain
   - Ambulatory Chain

2. ✅ IBC Integration:
   - Inter-Blockchain Communication protocol
   - Cross-chain transfer implementation
   - Two-phase commit for atomic transactions
   - IBC relayer deployment

3. ✅ Patient Access Control:
   - Consent management smart contracts
   - Zero-knowledge proof for need verification
   - Patient mobile app (iOS/Android)
   - Web portal for access management

4. ✅ Large file storage:
   - IPFS integration for medical images
   - Filecoin for incentivized storage
   - Chunking and streaming for large files
   - Deduplication

**Team**: 5-6 developers + 1 DevOps + 1 UX designer
**Cost**: $500K - $800K
**Success Criteria**: Successfully transfer patient data between chains

---

### Phase 3: HIPAA Compliance & Production Prep (Months 13-18)

**Objective**: Achieve HIPAA compliance and prepare for pilot

**Deliverables**:
1. ✅ HIPAA Compliance:
   - Comprehensive audit logging (all chains)
   - Business Associate Agreements (BAAs)
   - Data encryption at rest (all storage)
   - Data classification system
   - Security policies and procedures documentation
   - Employee training program

2. ✅ Non-Repudiation System:
   - RFC 3161 timestamp authority integration
   - Digital signature verification
   - Legal-grade audit trails
   - 7+ year data retention

3. ✅ Emergency Access:
   - Break-glass procedures
   - Emergency override smart contracts
   - Compliance review workflow
   - Notification system

4. ✅ Monitoring & Alerting:
   - 24/7 monitoring (Prometheus + Grafana)
   - Security incident response plan
   - Automated alerting (PagerDuty)
   - Disaster recovery procedures

5. ✅ Compliance Audits:
   - Third-party HIPAA compliance audit
   - Legal review by healthcare attorney
   - Risk assessment
   - Penetration testing (annual)

**Team**: 4-5 developers + 1 compliance specialist + 1 legal counsel
**Cost**: $600K - $1M
**Success Criteria**: Pass HIPAA compliance audit, obtain BAAs

---

### Phase 4: Pilot Program (Months 19-24)

**Objective**: Deploy to 2-3 healthcare partners for real-world validation

**Deliverables**:
1. ✅ Partner Onboarding:
   - 1 hospital system (small/medium)
   - 1 lab network
   - 1 primary care clinic group
   - Validator setup and training
   - EMR integration (HL7/FHIR interfaces)

2. ✅ Pilot Patients:
   - 100-500 volunteer patients
   - Informed consent process
   - Patient training (mobile app usage)
   - Support hotline

3. ✅ Monitoring & Optimization:
   - Real-world performance metrics
   - User feedback collection
   - Bug fixes and improvements
   - Scalability testing

4. ✅ Regulatory Coordination:
   - Ongoing legal review
   - State health department coordination
   - FDA software as medical device (SaMD) evaluation (if applicable)

**Team**: 6-8 developers + 2 support staff + 1 project manager
**Cost**: $800K - $1.5M
**Success Criteria**:
- Zero HIPAA violations
- 95%+ patient satisfaction
- 90%+ provider satisfaction
- < 0.1% error rate

---

### Phase 5: Mainnet Launch (Months 25-36)

**Objective**: Gradual expansion to production network

**Deliverables**:
1. ✅ Mainnet Deployment:
   - All 9 sidechain types operational
   - 50+ healthcare entities as validators
   - Mainnet launch event
   - Token generation event (if applicable)

2. ✅ Additional Features:
   - Pharma Chain (drug manufacturers)
   - International Chain (cross-border care)
   - Research Chain (de-identified data)
   - 3rd Party Access Chain (legal, family)

3. ✅ Enterprise Features:
   - API marketplace (developers build integrations)
   - Analytics dashboards (de-identified insights)
   - White-label solutions (branding for enterprises)
   - SLA guarantees (99.99% uptime)

4. ✅ Geographic Expansion:
   - Additional US states
   - International partnerships (EU, Asia)
   - Compliance with local regulations (GDPR, etc.)
   - Multi-language support

5. ✅ Ongoing Operations:
   - 24/7 operations team
   - Regular security audits (quarterly)
   - Bug bounty program
   - Continuous improvement

**Team**: 12-15 developers + 3-4 DevOps + 4-5 support + 2-3 management
**Cost**: $2M - $3M/year (operational)
**Success Criteria**:
- 10,000+ patients using system
- 100+ healthcare entities
- Zero major security incidents
- HIPAA compliance maintained

---

## Code Architecture

### New Packages/Modules Required

```
blueblocks/
├── cmd/
│   ├── afterblockd/          # Mainchain daemon (existing)
│   ├── sidechain/            # Sidechain daemon (new)
│   ├── relayer/              # IBC relayer (new)
│   └── afterwallet/          # Wallet CLI (existing)
│
├── lib/
│   ├── chain/                # Blockchain logic (existing)
│   ├── vm/                   # Smart contract VM (existing)
│   ├── state/                # State management (existing)
│   ├── ipfs/                 # IPFS integration (existing)
│   ├── wallet/               # Wallet/keys (existing)
│   ├── genesis/              # Genesis config (existing)
│   ├── httpapi/              # HTTP API (existing)
│   │
│   ├── sidechain/            # Sidechain management (NEW)
│   │   ├── registry.go       # Sidechain registry
│   │   ├── validator.go      # Validator management
│   │   └── consensus.go      # Tendermint integration
│   │
│   ├── ibc/                  # Inter-blockchain communication (NEW)
│   │   ├── client.go         # IBC client
│   │   ├── connection.go     # IBC connection
│   │   ├── channel.go        # IBC channel
│   │   ├── packet.go         # IBC packet handling
│   │   └── relayer.go        # Relayer logic
│   │
│   ├── access/               # Access control (NEW)
│   │   ├── consent.go        # Consent management
│   │   ├── grant.go          # Access grants
│   │   ├── zkproof.go        # Zero-knowledge proofs
│   │   └── breakglass.go     # Emergency access
│   │
│   ├── audit/                # Audit logging (NEW)
│   │   ├── logger.go         # Audit log writer
│   │   ├── query.go          # Audit log queries
│   │   └── retention.go      # Retention policies
│   │
│   ├── crypto/               # Enhanced cryptography (NEW)
│   │   ├── signing.go        # Digital signatures
│   │   ├── encryption.go     # Record encryption
│   │   ├── keyderiv.go       # Key derivation (HKDF)
│   │   ├── timestamp.go      # RFC 3161 timestamps
│   │   └── hsm.go            # HSM integration (PKCS#11)
│   │
│   ├── storage/              # Enhanced storage (NEW)
│   │   ├── classification.go # Data classification
│   │   ├── largefile.go      # Large file handling
│   │   ├── chunking.go       # File chunking
│   │   └── pinning.go        # IPFS pinning management
│   │
│   ├── identity/             # DID management (NEW)
│   │   ├── did.go            # DID creation/resolution
│   │   ├── diddoc.go         # DID document management
│   │   └── verifiable.go     # Verifiable credentials
│   │
│   └── compliance/           # Compliance tools (NEW)
│       ├── hipaa.go          # HIPAA-specific logic
│       ├── gdpr.go           # GDPR-specific logic
│       └── validation.go     # Compliance validation
│
├── contracts/                # Smart contracts
│   ├── patient_record.star   # Patient record contract (existing)
│   ├── consent.star          # Consent management (NEW)
│   ├── access_grant.star     # Access grant contract (NEW)
│   ├── transfer.star         # Cross-chain transfer (NEW)
│   └── emergency.star        # Emergency access (NEW)
│
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md       # System architecture (existing)
│   ├── SIDECHAIN_ARCHITECTURE.md  # This document (NEW)
│   ├── SECURITY.md           # Security review (existing)
│   └── COMPLIANCE.md         # Compliance guide (NEW)
│
└── test/                     # Tests
    ├── unit/                 # Unit tests
    ├── integration/          # Integration tests
    └── e2e/                  # End-to-end tests

```

### Key Interfaces to Define

```go
// lib/sidechain/sidechain.go
type Sidechain interface {
    // Lifecycle
    Start() error
    Stop() error

    // Consensus
    GetValidators() ([]Validator, error)
    AddValidator(v Validator) error
    RemoveValidator(id string) error

    // Transactions
    SubmitTransaction(tx Transaction) (string, error)
    GetTransaction(txHash string) (*Transaction, error)

    // State
    GetState(key string) ([]byte, error)
    SetState(key string, value []byte) error

    // Cross-chain
    SendIBCPacket(packet IBCPacket) error
    ReceiveIBCPacket(packet IBCPacket) error
}

// lib/ibc/ibc.go
type IBCClient interface {
    // Connection management
    CreateConnection(chainA, chainB string) (Connection, error)
    GetConnection(connID string) (*Connection, error)

    // Channel management
    CreateChannel(connID string) (Channel, error)
    GetChannel(channelID string) (*Channel, error)

    // Packet transmission
    SendPacket(channelID string, data []byte) error
    ReceivePacket(packet IBCPacket) error
    AcknowledgePacket(packet IBCPacket, ack []byte) error

    // Light client
    UpdateClient(clientID string, header Header) error
    VerifyMembership(clientID string, proof Proof, path string, value []byte) error
}

// lib/access/consent.go
type ConsentManager interface {
    // Access requests
    CreateAccessRequest(req AccessRequest) (string, error)
    GetAccessRequest(reqID string) (*AccessRequest, error)

    // Patient actions
    ApproveAccess(reqID string, restrictions AccessScope) (*AccessGrant, error)
    DenyAccess(reqID string, reason string) error
    RevokeAccess(grantID string) error

    // Access grants
    GetAccessGrant(grantID string) (*AccessGrant, error)
    ListActiveGrants(patientDID string) ([]*AccessGrant, error)

    // Verification
    VerifyNeedToKnow(req AccessRequest) (bool, error)  // ZK proof verification
}

// lib/audit/audit.go
type AuditLogger interface {
    // Logging
    LogAccess(entry AuditLogEntry) error
    LogAction(entry AuditLogEntry) error

    // Querying
    QueryByPatient(patientDID string, opts QueryOptions) ([]*AuditLogEntry, error)
    QueryByProvider(providerDID string, opts QueryOptions) ([]*AuditLogEntry, error)
    QueryByAction(action ActionType, opts QueryOptions) ([]*AuditLogEntry, error)

    // Export
    ExportAuditLog(patientDID string, format ExportFormat) ([]byte, error)

    // Retention
    ApplyRetentionPolicy(policy RetentionPolicy) error
}

// lib/storage/largefile.go
type LargeFileStorage interface {
    // Upload
    UploadFile(file io.Reader, metadata FileMetadata) (FileID, error)
    UploadChunked(chunks []Chunk, metadata FileMetadata) (FileID, error)

    // Download
    DownloadFile(fileID FileID) (io.ReadCloser, error)
    DownloadChunk(fileID FileID, chunkIndex int) ([]byte, error)
    StreamFile(fileID FileID) (io.ReadCloser, error)

    // Management
    PinFile(fileID FileID, locations []string) error
    UnpinFile(fileID FileID) error
    GetFileMetadata(fileID FileID) (*FileMetadata, error)

    // Classification
    ClassifyFile(fileID FileID, classification StorageClassification) error
    GetFilesByClassification(classification StorageClassification) ([]FileID, error)
}
```

### Smart Contract Examples

```python
# contracts/consent.star
"""
Consent Management Smart Contract
Manages patient consent for data access
"""

def init(ctx):
    """Initialize consent management"""
    state.consents = {}  # patientDID -> {providerDID -> Consent}
    state.requests = {}  # requestID -> AccessRequest

def request_access(ctx, patient_did, provider_did, purpose, scope):
    """Provider requests access to patient data"""
    # Verify provider is registered
    if not is_registered_provider(provider_did):
        fail("Provider not registered")

    # Create access request
    request_id = generate_request_id()
    state.requests[request_id] = {
        "patient": patient_did,
        "provider": provider_did,
        "purpose": purpose,
        "scope": scope,
        "requested_at": ctx.block_time,
        "status": "PENDING"
    }

    # Notify patient (emit event)
    emit("AccessRequested",
         request_id=request_id,
         patient=patient_did,
         provider=provider_did)

    return request_id

def approve_access(ctx, request_id, expiration_days):
    """Patient approves access request"""
    req = state.requests.get(request_id)
    if not req:
        fail("Request not found")

    # Verify patient is approving their own request
    if ctx.sender != req["patient"]:
        fail("Only patient can approve")

    # Create access grant
    grant_id = generate_grant_id()
    expiration = ctx.block_time + (expiration_days * 86400)

    # Store grant
    if req["patient"] not in state.consents:
        state.consents[req["patient"]] = {}

    state.consents[req["patient"]][req["provider"]] = {
        "grant_id": grant_id,
        "purpose": req["purpose"],
        "scope": req["scope"],
        "granted_at": ctx.block_time,
        "expires_at": expiration,
        "revoked": False
    }

    # Update request status
    state.requests[request_id]["status"] = "APPROVED"

    # Emit event
    emit("AccessGranted",
         grant_id=grant_id,
         patient=req["patient"],
         provider=req["provider"],
         expires_at=expiration)

    return grant_id

def revoke_access(ctx, provider_did):
    """Patient revokes provider's access"""
    patient_did = ctx.sender

    if patient_did not in state.consents:
        fail("No grants found")

    if provider_did not in state.consents[patient_did]:
        fail("No grant for this provider")

    # Mark as revoked
    state.consents[patient_did][provider_did]["revoked"] = True
    state.consents[patient_did][provider_did]["revoked_at"] = ctx.block_time

    # Emit event
    emit("AccessRevoked",
         patient=patient_did,
         provider=provider_did,
         revoked_at=ctx.block_time)

def check_access(ctx, patient_did, provider_did):
    """Check if provider has valid access"""
    if patient_did not in state.consents:
        return False

    if provider_did not in state.consents[patient_did]:
        return False

    grant = state.consents[patient_did][provider_did]

    # Check not revoked
    if grant["revoked"]:
        return False

    # Check not expired
    if ctx.block_time > grant["expires_at"]:
        return False

    return True

def emergency_access(ctx, patient_did, provider_did, justification):
    """Break-glass emergency access"""
    # Verify provider is registered
    if not is_registered_provider(provider_did):
        fail("Provider not registered")

    # Grant temporary access (4 hours)
    grant_id = generate_grant_id()
    expiration = ctx.block_time + (4 * 3600)

    if patient_did not in state.consents:
        state.consents[patient_did] = {}

    state.consents[patient_did][provider_did] = {
        "grant_id": grant_id,
        "purpose": "EMERGENCY",
        "scope": "ALL",  # Full access in emergency
        "granted_at": ctx.block_time,
        "expires_at": expiration,
        "emergency": True,
        "justification": justification,
        "review_required": True
    }

    # Alert patient and compliance
    emit("EmergencyAccessGranted",
         grant_id=grant_id,
         patient=patient_did,
         provider=provider_did,
         justification=justification)

    return grant_id

# Helper functions
def is_registered_provider(provider_did):
    # Query mainchain provider registry
    return state.providers.get(provider_did) != None

def generate_request_id():
    return "req_" + hash(ctx.block_height + ctx.sender + ctx.block_time)

def generate_grant_id():
    return "grant_" + hash(ctx.block_height + ctx.sender + ctx.block_time)
```

---

## Open Questions and Risks

### Technical Risks

1. **IBC Maturity**: IBC protocol is complex. Integration challenges may arise.
   - **Mitigation**: Start with simple token transfers, gradually add complexity
   - **Fallback**: Build custom bridge protocol if IBC proves too complex

2. **IPFS Performance**: Large medical images may be slow to retrieve from IPFS
   - **Mitigation**: Use CDN caching layer (CloudFlare), aggressive pinning
   - **Fallback**: Hybrid storage (IPFS + S3 for frequently accessed files)

3. **Tendermint Scalability**: 10,000 TPS may be ambitious for Tendermint
   - **Mitigation**: Horizontal scaling (multiple sidechains), layer 2 solutions
   - **Benchmark**: Test early and often with realistic workloads

4. **Key Recovery**: Shamir Secret Sharing is complex for patients
   - **Mitigation**: Provide multiple recovery options (social, time-locked, biometric)
   - **User Testing**: Pilot with tech-savvy patients first

5. **Cross-Border Data**: GDPR conflicts with HIPAA in some cases
   - **Mitigation**: Separate sidechains for EU vs US patients
   - **Legal Review**: Ongoing consultation with international privacy attorneys

### Regulatory Risks

1. **FDA SaMD Classification**: Blockchain might be considered medical device
   - **Mitigation**: Early FDA consultation, 510(k) pre-submission if needed
   - **Timeline**: Add 6-12 months if FDA approval required

2. **State Licensing**: State medical boards may have jurisdiction
   - **Mitigation**: Work with state health departments, pilot in friendly states first
   - **Compliance**: Ensure compliance with state-specific telehealth laws

3. **DEA Regulations**: E-prescribing controlled substances has strict requirements
   - **Mitigation**: EPCS (Electronic Prescriptions for Controlled Substances) compliance
   - **Partnership**: Integrate with existing EPCS providers (Surescripts)

4. **Breach Notification**: Multi-state data breach notification requirements
   - **Mitigation**: Automated breach detection and notification system
   - **Legal Review**: Have notification templates reviewed by legal counsel

### Business Risks

1. **EMR Integration**: Healthcare IT systems are notoriously difficult to integrate
   - **Mitigation**: Support standard interfaces (HL7 v2, FHIR, DICOM)
   - **Partnership**: Work with Epic, Cerner, Allscripts for integrations

2. **Provider Adoption**: Doctors may resist new technology
   - **Mitigation**: Minimize workflow disruption, provide excellent training
   - **Incentives**: Show ROI (reduced admin burden, faster records transfer)

3. **Insurance Reimbursement**: Payers may not reimburse for blockchain use
   - **Mitigation**: Frame as infrastructure (like EMR), not billable service
   - **Value Prop**: Show cost savings from reduced administrative overhead

4. **Competitive Landscape**: Existing health information exchanges (HIEs)
   - **Mitigation**: Position as complementary, not competitive
   - **Differentiation**: Patient control, cross-border, immutable audit

### Security Risks

1. **Quantum Computing**: Future quantum computers could break Ed25519
   - **Mitigation**: Monitor NIST post-quantum cryptography standards
   - **Timeline**: Quantum threat likely 10+ years away, plan migration path

2. **Supply Chain Attacks**: Compromised dependencies (NPM, Go modules)
   - **Mitigation**: Dependency scanning (Snyk), pin all versions
   - **Air-gapped Build**: Critical builds done on air-gapped systems

3. **Insider Threats**: Hospital administrators with elevated privileges
   - **Mitigation**: Separation of duties, audit all admin actions
   - **Background Checks**: Vetting of personnel with system access

4. **DDoS Attacks**: Public APIs vulnerable to denial of service
   - **Mitigation**: CloudFlare DDoS protection, rate limiting
   - **Redundancy**: Geographic distribution of nodes

---

## Conclusion

This sidechain architecture for BlueBlocks provides:

✅ **Entity-Specific Chains**: Each healthcare entity type (hospitals, labs, pharma, etc.) operates their own sovereign blockchain with independent key management

✅ **Patient-Controlled Access**: Granular, revocable consent system with zero-knowledge proofs for privacy-preserving need verification

✅ **Cross-Chain Data Transfer**: Secure, encrypted data transfer between chains using IBC protocol with perfect forward secrecy

✅ **Large File Support**: Medical images and videos stored in classified IPFS storage with compression (tar.bz2/zst) and base64 encoding support

✅ **Data Classification**: Six-tier classification system (PUBLIC, PRIVATE, NMPI, MPI, HIPAA, GDPR) with automated policy enforcement

✅ **Non-Repudiation**: Digital signatures, RFC 3161 timestamps, and blockchain anchoring provide legally defensible audit trails

✅ **Data in Motion Protection**: mTLS, TLS 1.3, perfect forward secrecy for all network communication

✅ **Data at Rest Protection**: Multi-layer encryption (application, filesystem, database, backup) with crypto-shredding for GDPR compliance

**Estimated Timeline**: 24-36 months to production
**Estimated Cost**: $5M - $10M initial investment + $2M-3M/year operational
**Recommended Next Steps**:
1. Secure funding and executive buy-in
2. Hire core team (4-5 blockchain engineers)
3. Engage legal counsel (healthcare privacy specialist)
4. Begin Phase 1 security fixes immediately
5. Select pilot healthcare partners (start conversations now)

This is an ambitious but achievable vision for the future of healthcare data interoperability.

---

**Document Status**: Draft for Review
**Next Review**: After stakeholder feedback
**Approval Required**: Executive Team, Legal, Security, Compliance
