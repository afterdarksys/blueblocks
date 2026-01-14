# BlueBlocks Medical Records Transmission Standard (BMRTS)
## Version 1.0 - A New Standard for Secure Medical Data Exchange

**Status:** Draft Specification
**Date:** 2026-01-14
**Authors:** BlueBlocks Core Team
**License:** Open Standard (Creative Commons CC-BY-4.0)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Design Principles](#design-principles)
4. [Standard Overview](#standard-overview)
5. [Data Format Specification](#data-format-specification)
6. [Permission Grant Protocol](#permission-grant-protocol)
7. [Cryptographic Specifications](#cryptographic-specifications)
8. [Network Protocol](#network-protocol)
9. [Quality Assurance](#quality-assurance)
10. [Implementation Guide](#implementation-guide)
11. [Conformance Requirements](#conformance-requirements)
12. [Reference Implementation](#reference-implementation)

---

## Executive Summary

The **BlueBlocks Medical Records Transmission Standard (BMRTS)** is an open, blockchain-based protocol for secure, patient-controlled exchange of high-quality medical records.

### Key Features

- ✅ **Patient-Controlled**: Patients grant and revoke access permissions
- ✅ **High Quality**: Lossless transmission of medical images, full-resolution DICOM
- ✅ **Comprehensive**: All record types (visits, labs, imaging, medications, procedures)
- ✅ **Secure**: End-to-end encryption, cryptographic signatures, non-repudiation
- ✅ **Interoperable**: Works across all EMR systems, healthcare entities, borders
- ✅ **Auditable**: Complete immutable audit trail on blockchain
- ✅ **Fast**: Records transmitted in seconds, not days/weeks
- ✅ **Standards-Based**: Built on FHIR, DICOM, HL7, IHE XDS standards
- ✅ **Open**: Free, open-source, vendor-neutral

### What Makes This Different

| Current Systems | BMRTS |
|----------------|-------|
| Fax machines, postal mail | Instant digital transmission |
| Provider-owned records | Patient-owned records |
| Manual permission process | Cryptographic permission grants |
| Lossy image compression | Lossless, full-resolution |
| Fragmented across systems | Unified patient record |
| No audit trail | Complete blockchain audit |
| Proprietary, vendor lock-in | Open standard, interoperable |

---

## Problem Statement

### The Crisis in Medical Records Exchange

**Current State (2026):**

1. **Slow**: Medical records take 2-14 days to transfer (if they transfer at all)
2. **Lossy**: Images faxed or scanned, diagnostic quality lost
3. **Incomplete**: Records fragmented across dozens of systems
4. **Insecure**: Fax to wrong number, unencrypted email, lost mail
5. **Unauditable**: No record of who accessed what when
6. **Patient-Hostile**: Patients have no control, can't access own records
7. **Expensive**: Administrative costs $150-$300 per record transfer

**Consequences:**
- Repeated tests (cost, radiation exposure, delays)
- Medical errors (incomplete information)
- Emergency care failures (no access to critical records)
- Patient frustration (managing multiple specialists)
- Deaths (life-saving information unavailable)

### Why Existing Standards Failed

**HL7 v2/v3:**
- ✗ Designed for intra-hospital, not inter-provider
- ✗ No patient control
- ✗ No standardized security

**FHIR (Fast Healthcare Interoperability Resources):**
- ✓ Good data model
- ✗ No built-in access control
- ✗ No blockchain/audit trail
- ✗ Adoption slow (EMR vendors resist)

**Direct Secure Messaging:**
- ✗ Provider-to-provider only
- ✗ No patient involvement
- ✗ Email-like, not structured data
- ✗ No programmatic access

**Health Information Exchanges (HIEs):**
- ✗ Regional silos
- ✗ Expensive to join ($50K+ setup)
- ✗ Poor EMR integration
- ✗ Low provider adoption

### What's Needed

A new standard that is:
1. **Patient-centric**: Patient owns, controls, grants access
2. **Blockchain-native**: Immutable audit trail, decentralized
3. **Quality-preserving**: Lossless transmission of all data types
4. **Fast**: Sub-second to seconds for transfer
5. **Secure**: Military-grade encryption, cryptographic proofs
6. **Universal**: Works everywhere, not regional
7. **Open**: Free standard, no vendor control
8. **Incentivized**: Participants rewarded for hosting/relaying

---

## Design Principles

### 1. Patient Sovereignty
**Principle**: Patients own their medical data and grant permission to access it.

**Implementation**:
- Patient cryptographic key controls all access
- Patient grants time-limited, scope-limited permissions
- Patient can revoke access instantly
- Patient sees audit trail of all accesses

### 2. Quality Preservation
**Principle**: Medical data must be transmitted at diagnostic quality, with zero loss.

**Implementation**:
- DICOM medical images: original, uncompressed or lossless compression only
- Lab results: full precision (no rounding)
- Documents: native formats (PDF, not scanned faxes)
- Medications: structured data (not free text)

### 3. Cryptographic Security
**Principle**: All data encrypted end-to-end, all actions cryptographically signed.

**Implementation**:
- AES-256-GCM for data encryption
- Ed25519 for signatures (fast, secure, small)
- ECDH (X25519) for key exchange
- Argon2id for password hashing
- RFC 3161 timestamps for non-repudiation

### 4. Blockchain Immutability
**Principle**: Audit trail cannot be tampered with, provides legal proof.

**Implementation**:
- All permissions recorded on blockchain
- All accesses logged immutably
- Merkle proofs for data integrity
- Multi-signature validation for critical actions

### 5. Standards Compatibility
**Principle**: Interoperate with existing healthcare IT standards.

**Implementation**:
- FHIR R5 for structured data representation
- DICOM for medical imaging
- HL7 v2 messages supported (translation layer)
- ICD-10, SNOMED CT, LOINC, RxNorm for coding
- C-CDA (Consolidated CDA) for document exchange

### 6. Privacy by Design
**Principle**: Minimum data exposure, maximum patient privacy.

**Implementation**:
- Zero-knowledge proofs for eligibility checks
- Selective disclosure (share only relevant records)
- De-identification tools for research
- Crypto-shredding for right to erasure
- Geographic restrictions (GDPR compliance)

### 7. Performance
**Principle**: Medical records available in seconds, not days.

**Implementation**:
- IPFS for distributed content delivery
- Edge caching (CDN-like)
- Progressive loading (thumbnails first, full resolution on-demand)
- Chunked streaming for large files
- Peer-to-peer direct transfers

### 8. Openness
**Principle**: Free, open standard anyone can implement.

**Implementation**:
- Open specification (this document)
- Reference implementation (open source)
- No licensing fees
- No vendor control
- Community governance

---

## Standard Overview

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 7: Application                                        │
│ - Patient apps, provider EMRs, research platforms           │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│ Layer 6: Permission Management                              │
│ - Patient grants/revokes access                             │
│ - Time-limited, scope-limited permissions                   │
│ - Smart contracts for access control                        │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: Data Representation                                │
│ - FHIR R5 resources (structured data)                       │
│ - DICOM objects (imaging)                                   │
│ - CDA documents (clinical documents)                        │
│ - Proprietary formats wrapped in BMRTS envelope             │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Cryptography                                       │
│ - End-to-end encryption (AES-256-GCM)                       │
│ - Digital signatures (Ed25519)                              │
│ - Key derivation (HKDF)                                     │
│ - Integrity proofs (SHA-256, Merkle trees)                  │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Storage                                            │
│ - IPFS (content-addressed, distributed)                     │
│ - Filecoin (incentivized persistence)                       │
│ - Local storage (patient devices, provider caches)          │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Blockchain                                         │
│ - Permission grants (on-chain)                              │
│ - Audit logs (immutable)                                    │
│ - Identity registry (DIDs)                                  │
│ - Content addressing (CIDs point to IPFS)                   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Network Transport                                  │
│ - HTTPS (for traditional web access)                        │
│ - libp2p (for peer-to-peer)                                 │
│ - IBC (for cross-chain)                                     │
│ - mTLS (for secure provider-to-provider)                    │
└─────────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. Medical Record Package (MRP)
A standardized container for all medical data associated with a patient encounter or record.

#### 2. Permission Grant Token (PGT)
Cryptographic token that grants time-limited, scope-limited access to specific medical records.

#### 3. Distributed Record Locator (DRL)
Blockchain-based index of where a patient's medical records are stored (IPFS CIDs).

#### 4. Audit Trail Entry (ATE)
Immutable log entry on blockchain recording access to medical records.

#### 5. Quality Attestation (QA)
Cryptographic proof that medical data meets quality standards (resolution, losslessness, completeness).

---

## Data Format Specification

### Medical Record Package (MRP) Format

Every medical record transmitted via BMRTS is wrapped in a Medical Record Package.

#### MRP Structure

```json
{
  "mrp_version": "1.0",
  "mrp_id": "mrp_550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-01-14T10:30:00Z",
  "patient": {
    "did": "did:blueblocks:patient:john-doe-1980",
    "mrn": "MRN123456",
    "name_encrypted": "base64_encrypted_name",
    "dob_hash": "sha256_hash_of_dob",
    "demographics_cid": "Qm..."
  },
  "encounter": {
    "encounter_id": "enc_12345",
    "date": "2026-01-14",
    "type": "OUTPATIENT",
    "provider": {
      "did": "did:blueblocks:physician:dr-alice-johnson",
      "npi": "1234567890",
      "name": "Dr. Alice Johnson",
      "specialty": "CARDIOLOGY"
    },
    "facility": {
      "did": "did:blueblocks:facility:mayo-clinic-cardio",
      "name": "Mayo Clinic Cardiology",
      "address": "200 First St SW, Rochester, MN 55905"
    }
  },
  "contents": {
    "visit_note": {
      "type": "FHIR_DOCUMENT_REFERENCE",
      "format": "application/fhir+json",
      "cid": "Qm...",
      "size": 15234,
      "hash": "sha256:abcd1234...",
      "encrypted": true,
      "compression": "none",
      "quality_score": 1.0
    },
    "lab_results": {
      "type": "FHIR_DIAGNOSTIC_REPORT",
      "format": "application/fhir+json",
      "cid": "Qm...",
      "size": 8923,
      "hash": "sha256:efgh5678...",
      "encrypted": true
    },
    "imaging_study": {
      "type": "DICOM_STUDY",
      "format": "application/dicom",
      "modality": "MR",
      "series_count": 4,
      "instance_count": 342,
      "total_size": 487234891,
      "cid": "Qm...",
      "hash": "sha256:ijkl9012...",
      "encrypted": true,
      "compression": "lossless_jpeg2000",
      "quality_attestation": {
        "original_resolution": true,
        "lossless": true,
        "diagnostic_quality": true,
        "attested_by": "did:blueblocks:radiologist:dr-bob-smith",
        "attestation_signature": "base64_signature"
      }
    },
    "medications": {
      "type": "FHIR_MEDICATION_STATEMENT",
      "format": "application/fhir+json",
      "cid": "Qm...",
      "size": 3421,
      "hash": "sha256:mnop3456..."
    },
    "procedure_note": {
      "type": "FHIR_PROCEDURE",
      "format": "application/fhir+json",
      "cid": "Qm...",
      "size": 12456,
      "hash": "sha256:qrst7890..."
    }
  },
  "metadata": {
    "classification": "HIPAA_PHI",
    "sensitivity": "STANDARD",
    "retention_period": "7_YEARS",
    "requires_special_consent": false,
    "tags": ["cardiology", "chronic_care", "medication_management"]
  },
  "cryptography": {
    "algorithm": "aes-256-gcm",
    "patient_key_id": "key_patient_john_doe_2026",
    "encrypted_for": [
      {
        "recipient": "did:blueblocks:physician:dr-alice-johnson",
        "key_cid": "Qm...",
        "granted_by": "did:blueblocks:patient:john-doe-1980",
        "grant_id": "grant_abc123",
        "expires_at": "2026-04-14T10:30:00Z"
      }
    ]
  },
  "signatures": [
    {
      "signer": "did:blueblocks:physician:dr-alice-johnson",
      "role": "AUTHOR",
      "signature": "base64_ed25519_signature",
      "signed_at": "2026-01-14T10:30:00Z",
      "timestamp_token": "base64_rfc3161_token"
    },
    {
      "signer": "did:blueblocks:patient:john-doe-1980",
      "role": "PATIENT_ATTESTATION",
      "signature": "base64_ed25519_signature",
      "signed_at": "2026-01-14T11:00:00Z"
    }
  ],
  "blockchain": {
    "chain_id": "hospital-chain",
    "block_height": 123456,
    "tx_hash": "0x7d8a9b3c...",
    "merkle_proof": "base64_merkle_proof"
  },
  "quality": {
    "completeness_score": 0.98,
    "data_quality_score": 1.0,
    "validation_errors": [],
    "validation_warnings": ["Missing patient phone number"]
  }
}
```

#### MRP Field Specifications

**mrp_version** (required)
- Type: String
- Format: Semantic versioning (e.g., "1.0", "1.1", "2.0")
- Description: Version of BMRTS standard used

**mrp_id** (required)
- Type: UUID v4
- Format: "mrp_{uuid}"
- Description: Globally unique identifier for this medical record package

**created_at** (required)
- Type: ISO 8601 timestamp with timezone
- Format: "YYYY-MM-DDTHH:MM:SSZ"
- Description: When this MRP was created

**patient** (required)
- Type: Object
- Fields:
  - `did`: Decentralized identifier (patient's blockchain identity)
  - `mrn`: Medical record number (optional, facility-specific)
  - `name_encrypted`: Patient name encrypted (privacy)
  - `dob_hash`: SHA-256 hash of date of birth (matching without revealing)
  - `demographics_cid`: IPFS CID of full demographic FHIR Patient resource

**encounter** (required)
- Type: Object
- Description: Details of the medical encounter that generated this record

**contents** (required)
- Type: Object (key-value pairs)
- Description: Actual medical data, each item is a content object with:
  - `type`: Content type (FHIR resource type, DICOM, etc.)
  - `format`: MIME type
  - `cid`: IPFS Content ID where data is stored
  - `size`: Size in bytes
  - `hash`: SHA-256 hash for integrity
  - `encrypted`: Boolean (is content encrypted?)
  - `compression`: Compression algorithm used (if any)
  - `quality_score`: 0.0-1.0 (quality assessment)

**metadata** (required)
- Type: Object
- Description: Classification and handling instructions

**cryptography** (required)
- Type: Object
- Description: Encryption details and key information

**signatures** (required, at least 1)
- Type: Array of signature objects
- Description: Digital signatures from all parties (author, witnesses, patient)

**blockchain** (required)
- Type: Object
- Description: Blockchain anchoring information

**quality** (required)
- Type: Object
- Description: Quality metrics and validation results

### Content Type Specifications

#### 1. Visit Notes (FHIR DocumentReference)

```json
{
  "type": "FHIR_DOCUMENT_REFERENCE",
  "format": "application/fhir+json",
  "resource": {
    "resourceType": "DocumentReference",
    "id": "visit-note-2026-01-14",
    "status": "current",
    "type": {
      "coding": [{
        "system": "http://loinc.org",
        "code": "34133-9",
        "display": "Summarization of episode note"
      }]
    },
    "category": [{
      "coding": [{
        "system": "http://hl7.org/fhir/us/core/CodeSystem/us-core-documentreference-category",
        "code": "clinical-note",
        "display": "Clinical Note"
      }]
    }],
    "subject": {
      "reference": "Patient/john-doe-1980"
    },
    "date": "2026-01-14T10:30:00Z",
    "author": [{
      "reference": "Practitioner/dr-alice-johnson"
    }],
    "content": [{
      "attachment": {
        "contentType": "text/plain",
        "data": "base64_encoded_note_text",
        "hash": "sha256_hash",
        "size": 15234
      }
    }]
  }
}
```

#### 2. Lab Results (FHIR DiagnosticReport)

```json
{
  "type": "FHIR_DIAGNOSTIC_REPORT",
  "format": "application/fhir+json",
  "resource": {
    "resourceType": "DiagnosticReport",
    "id": "lab-lipid-panel-2026-01-14",
    "status": "final",
    "category": [{
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/v2-0074",
        "code": "LAB",
        "display": "Laboratory"
      }]
    }],
    "code": {
      "coding": [{
        "system": "http://loinc.org",
        "code": "24331-1",
        "display": "Lipid panel"
      }]
    },
    "subject": {
      "reference": "Patient/john-doe-1980"
    },
    "effectiveDateTime": "2026-01-12T08:00:00Z",
    "issued": "2026-01-12T14:00:00Z",
    "performer": [{
      "reference": "Organization/quest-diagnostics"
    }],
    "result": [
      {
        "reference": "Observation/cholesterol-total"
      },
      {
        "reference": "Observation/hdl-cholesterol"
      },
      {
        "reference": "Observation/ldl-cholesterol"
      },
      {
        "reference": "Observation/triglycerides"
      }
    ],
    "conclusion": "Lipid panel within normal limits"
  },
  "observations": [
    {
      "resourceType": "Observation",
      "id": "cholesterol-total",
      "status": "final",
      "code": {
        "coding": [{
          "system": "http://loinc.org",
          "code": "2093-3",
          "display": "Cholesterol [Mass/volume] in Serum or Plasma"
        }]
      },
      "valueQuantity": {
        "value": 185,
        "unit": "mg/dL",
        "system": "http://unitsofmeasure.org",
        "code": "mg/dL"
      },
      "referenceRange": [{
        "low": {
          "value": 0,
          "unit": "mg/dL"
        },
        "high": {
          "value": 200,
          "unit": "mg/dL"
        },
        "text": "Desirable: <200 mg/dL"
      }]
    }
  ]
}
```

#### 3. Medical Imaging (DICOM)

DICOM studies transmitted as complete DICOM Part 10 files with BMRTS metadata wrapper.

```json
{
  "type": "DICOM_STUDY",
  "format": "application/dicom",
  "study": {
    "study_instance_uid": "1.2.840.113619.2.408.4100027.123456",
    "study_date": "20260114",
    "study_time": "103000",
    "study_description": "MRI BRAIN W/ & W/O CONTRAST",
    "modality": "MR",
    "accession_number": "ACC123456",
    "referring_physician": "Dr. Alice Johnson",
    "patient_id": "MRN123456",
    "patient_name_encrypted": "base64_encrypted"
  },
  "series": [
    {
      "series_instance_uid": "1.2.840.113619.2.408.4100027.123456.1",
      "series_number": 1,
      "series_description": "T1 MPRAGE SAGITTAL",
      "modality": "MR",
      "body_part": "BRAIN",
      "instance_count": 176,
      "file_size": 184549376,
      "cid": "Qm...",
      "hash": "sha256:abcd..."
    },
    {
      "series_instance_uid": "1.2.840.113619.2.408.4100027.123456.2",
      "series_number": 2,
      "series_description": "T2 FLAIR AXIAL",
      "modality": "MR",
      "body_part": "BRAIN",
      "instance_count": 88,
      "file_size": 92274688,
      "cid": "Qm...",
      "hash": "sha256:efgh..."
    }
  ],
  "quality_attestation": {
    "original_acquisition": true,
    "no_lossy_compression": true,
    "full_diagnostic_quality": true,
    "dicom_compliant": true,
    "attested_by": "did:blueblocks:radiologist:dr-bob-smith",
    "attested_at": "2026-01-14T11:00:00Z",
    "signature": "base64_signature"
  },
  "storage": {
    "total_size": 487234891,
    "compression": "lossless_jpeg2000",
    "transfer_syntax": "1.2.840.10008.1.2.4.90",
    "chunked": true,
    "chunk_size": 5242880,
    "chunk_count": 93,
    "chunks_cid": ["Qm...", "Qm...", "..."]
  }
}
```

**Quality Requirements for DICOM:**
- ✅ MUST preserve original acquisition matrix
- ✅ MUST use lossless compression only (or uncompressed)
- ✅ MUST include all DICOM metadata tags
- ✅ MUST NOT use lossy JPEG compression
- ✅ MUST include radiologist quality attestation

#### 4. Medications (FHIR MedicationStatement)

```json
{
  "type": "FHIR_MEDICATION_STATEMENT",
  "format": "application/fhir+json",
  "resource": {
    "resourceType": "MedicationStatement",
    "id": "med-oxycontin-2026",
    "status": "active",
    "medicationCodeableConcept": {
      "coding": [{
        "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
        "code": "1049621",
        "display": "oxycodone hydrochloride 40 MG 12 HR Extended Release Oral Tablet [OxyContin]"
      }],
      "text": "OxyContin 40mg ER tablet"
    },
    "subject": {
      "reference": "Patient/john-doe-1980"
    },
    "effectiveDateTime": "2021-06-01",
    "dateAsserted": "2026-01-05",
    "informationSource": {
      "reference": "Practitioner/pain-mgmt-dr"
    },
    "dosage": [{
      "text": "One tablet by mouth every 12 hours",
      "timing": {
        "repeat": {
          "frequency": 1,
          "period": 12,
          "periodUnit": "h"
        }
      },
      "route": {
        "coding": [{
          "system": "http://snomed.info/sct",
          "code": "26643006",
          "display": "Oral route"
        }]
      },
      "doseAndRate": [{
        "doseQuantity": {
          "value": 1,
          "unit": "tablet",
          "system": "http://unitsofmeasure.org",
          "code": "{tablet}"
        }
      }]
    }],
    "note": [{
      "text": "Chronic pain management. Do not discontinue abruptly."
    }]
  },
  "prescriber": {
    "did": "did:blueblocks:physician:pain-mgmt-dr",
    "npi": "9876543210",
    "dea": "PM9876543",
    "signature": "base64_signature"
  },
  "controlled_substance": {
    "schedule": "II",
    "dea_required": true,
    "epcs_compliant": true
  }
}
```

#### 5. Procedures (FHIR Procedure)

```json
{
  "type": "FHIR_PROCEDURE",
  "format": "application/fhir+json",
  "resource": {
    "resourceType": "Procedure",
    "id": "procedure-cabg-2026",
    "status": "completed",
    "code": {
      "coding": [{
        "system": "http://www.ama-assn.org/go/cpt",
        "code": "33533",
        "display": "Coronary artery bypass, using arterial graft(s); single arterial graft"
      }],
      "text": "CABG x1"
    },
    "subject": {
      "reference": "Patient/john-doe-1980"
    },
    "performedPeriod": {
      "start": "2026-01-14T08:00:00Z",
      "end": "2026-01-14T12:00:00Z"
    },
    "performer": [
      {
        "function": {
          "coding": [{
            "system": "http://snomed.info/sct",
            "code": "304292004",
            "display": "Surgeon"
          }]
        },
        "actor": {
          "reference": "Practitioner/dr-surgeon-chief",
          "display": "Dr. Robert Miller, MD FACS"
        }
      },
      {
        "function": {
          "coding": [{
            "system": "http://snomed.info/sct",
            "code": "88189002",
            "display": "Anesthesiologist"
          }]
        },
        "actor": {
          "reference": "Practitioner/dr-anesthesiologist"
        }
      }
    ],
    "location": {
      "reference": "Location/mayo-clinic-or-5",
      "display": "Mayo Clinic Operating Room 5"
    },
    "outcome": {
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": "385669000",
        "display": "Successful"
      }]
    },
    "complication": [],
    "note": [{
      "authorReference": {
        "reference": "Practitioner/dr-surgeon-chief"
      },
      "time": "2026-01-14T12:30:00Z",
      "text": "Operative note: [Full operative note IPFS CID: Qm...]"
    }]
  },
  "operative_note_cid": "Qm...",
  "signatures": [
    {
      "signer": "did:blueblocks:surgeon:dr-robert-miller",
      "role": "PRIMARY_SURGEON",
      "signature": "base64_signature",
      "signed_at": "2026-01-14T12:30:00Z"
    },
    {
      "signer": "did:blueblocks:anesthesiologist:dr-jane-wong",
      "role": "ANESTHESIOLOGIST",
      "signature": "base64_signature",
      "signed_at": "2026-01-14T12:35:00Z"
    }
  ]
}
```

---

## Permission Grant Protocol

### Patient Grants Access to Provider

#### Step 1: Provider Requests Access

Provider creates an access request:

```json
{
  "request_type": "ACCESS_REQUEST",
  "request_id": "req_550e8400-e29b-41d4-a716-446655440000",
  "requested_at": "2026-01-14T10:00:00Z",
  "requester": {
    "did": "did:blueblocks:physician:dr-alice-johnson",
    "npi": "1234567890",
    "name": "Dr. Alice Johnson",
    "specialty": "CARDIOLOGY",
    "facility": "Mayo Clinic Cardiology"
  },
  "patient": {
    "did": "did:blueblocks:patient:john-doe-1980",
    "identifier": "MRN123456 OR dob:1980-01-15"
  },
  "purpose": {
    "code": "TREATMENT",
    "description": "Cardiology follow-up visit for chronic chest pain"
  },
  "requested_scope": {
    "record_types": [
      "VISIT_NOTES",
      "LAB_RESULTS",
      "IMAGING",
      "MEDICATIONS",
      "PROCEDURES"
    ],
    "date_range": {
      "start": "2020-01-01",
      "end": "2026-01-14"
    },
    "exclude_sensitive": false
  },
  "requested_duration": {
    "duration_type": "FIXED",
    "days": 90
  },
  "need_verification": {
    "appointment_scheduled": true,
    "appointment_date": "2026-01-21",
    "referring_provider": "did:blueblocks:physician:dr-primary-care",
    "proof": "base64_zk_proof"
  },
  "requester_signature": "base64_signature"
}
```

Provider submits to blockchain:

```bash
$ afterblock request-access \
    --patient did:blueblocks:patient:john-doe-1980 \
    --purpose TREATMENT \
    --scope visit_notes,labs,imaging,medications \
    --duration 90days \
    --provider-key /secure/keys/dr-alice-johnson.json

Access request submitted to blockchain
Request ID: req_550e8400-e29b-41d4-a716-446655440000
Status: PENDING_PATIENT_APPROVAL
Notification sent to patient

Waiting for patient approval...
```

#### Step 2: Patient Notified (Multi-Channel)

Patient receives notification via:
- 📱 Mobile app push notification (immediate)
- 📧 Email (within 5 minutes)
- 📲 SMS text message (within 5 minutes)
- 🌐 Web portal (appears in pending requests)

Notification content:

```
┌─────────────────────────────────────────────┐
│ 🏥 NEW ACCESS REQUEST                       │
├─────────────────────────────────────────────┤
│                                             │
│ Dr. Alice Johnson (Cardiologist)            │
│ Mayo Clinic Cardiology                      │
│                                             │
│ is requesting access to your medical        │
│ records for:                                │
│                                             │
│ • Purpose: Cardiology follow-up             │
│ • Records: Visit notes, labs, imaging,      │
│   medications, procedures                   │
│ • Duration: 90 days                         │
│ • Appointment: Jan 21, 2026                 │
│                                             │
│ [REVIEW & DECIDE]                           │
│                                             │
└─────────────────────────────────────────────┘
```

#### Step 3: Patient Reviews and Approves

Patient opens app, sees request details:

```json
{
  "decision_type": "GRANT_ACCESS",
  "request_id": "req_550e8400-e29b-41d4-a716-446655440000",
  "decided_at": "2026-01-14T10:15:00Z",
  "patient": {
    "did": "did:blueblocks:patient:john-doe-1980"
  },
  "approved": true,
  "grant_details": {
    "scope": {
      "record_types": [
        "VISIT_NOTES",
        "LAB_RESULTS",
        "IMAGING",
        "MEDICATIONS"
      ],
      "exclude": ["MENTAL_HEALTH", "SUBSTANCE_ABUSE"],
      "date_range": {
        "start": "2020-01-01",
        "end": "2026-01-14"
      }
    },
    "duration": {
      "type": "FIXED",
      "days": 90,
      "expires_at": "2026-04-14T10:15:00Z"
    },
    "permissions": {
      "read": true,
      "write": true,
      "share": false,
      "download": true
    },
    "conditions": {
      "notify_on_access": true,
      "auto_revoke_if_unused": {
        "enabled": true,
        "idle_days": 14
      },
      "max_access_count": null
    }
  },
  "patient_signature": "base64_signature",
  "timestamp_token": "base64_rfc3161_token"
}
```

Patient submits approval:

```bash
$ afterblock approve-access \
    --request req_550e8400-e29b-41d4-a716-446655440000 \
    --duration 90days \
    --exclude mental_health,substance_abuse \
    --notify-on-access \
    --patient-key /secure/keys/patient-john-doe.json

Approving access request...
✓ Access grant created
✓ Grant ID: grant_abc123def456
✓ Encrypted decryption keys for provider
✓ Submitted to blockchain (tx: 0x7d8a9b3c...)
✓ Provider notified

Dr. Alice Johnson can now access your records
Expires: April 14, 2026
You can revoke at any time
```

#### Step 4: Permission Grant Token Generated

Smart contract creates Permission Grant Token (PGT):

```json
{
  "pgt_version": "1.0",
  "grant_id": "grant_abc123def456",
  "created_at": "2026-01-14T10:15:00Z",
  "patient": {
    "did": "did:blueblocks:patient:john-doe-1980"
  },
  "grantee": {
    "did": "did:blueblocks:physician:dr-alice-johnson",
    "npi": "1234567890"
  },
  "scope": {
    "record_types": ["VISIT_NOTES", "LAB_RESULTS", "IMAGING", "MEDICATIONS"],
    "date_range": {
      "start": "2020-01-01",
      "end": "2026-01-14"
    },
    "mrp_ids": ["mrp_001", "mrp_002", "..."],
    "total_records": 47
  },
  "validity": {
    "granted_at": "2026-01-14T10:15:00Z",
    "expires_at": "2026-04-14T10:15:00Z",
    "revoked": false,
    "status": "ACTIVE"
  },
  "permissions": {
    "read": true,
    "write": true,
    "download": true,
    "share": false
  },
  "cryptography": {
    "encrypted_patient_keys": [
      {
        "record_id": "mrp_001",
        "key_cid": "Qm...",
        "encrypted_for": "did:blueblocks:physician:dr-alice-johnson"
      }
    ],
    "key_derivation": "hkdf-sha256",
    "encryption_algorithm": "aes-256-gcm"
  },
  "blockchain": {
    "chain_id": "hospital-chain",
    "block_height": 123456,
    "tx_hash": "0x7d8a9b3c...",
    "smart_contract": "0x1234abcd..."
  },
  "audit": {
    "access_count": 0,
    "last_accessed": null,
    "notify_patient_on_access": true
  },
  "signatures": [
    {
      "signer": "did:blueblocks:patient:john-doe-1980",
      "role": "GRANTOR",
      "signature": "base64_signature",
      "signed_at": "2026-01-14T10:15:00Z"
    }
  ]
}
```

#### Step 5: Provider Accesses Records

Provider uses PGT to access records:

```bash
$ afterblock access-records \
    --grant grant_abc123def456 \
    --provider-key /secure/keys/dr-alice-johnson.json \
    --output /tmp/patient_records/

Accessing patient records...
✓ Grant validated (expires in 90 days)
✓ Retrieved 47 medical records
✓ Decrypting records...
✓ Downloaded to /tmp/patient_records/

Records available:
- 12 visit notes
- 15 lab results
- 3 imaging studies (487 MB)
- 8 medication statements
- 9 procedure notes

Access logged to blockchain (audit ID: audit_xyz789)
Patient notified of access
```

Provider's EMR system sees:

```
╔════════════════════════════════════════════════════════════╗
║  EXTERNAL RECORDS - John Doe (MRN: 123456)                ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Source: BlueBlocks Medical Records Network                ║
║  Authorized by: Patient (Grant ID: grant_abc123def456)     ║
║  Access expires: April 14, 2026                            ║
║                                                            ║
║  📋 Visit Notes (12)                                        ║
║  ├─ 2026-01-05: Pain Management - Dr. Brown                ║
║  ├─ 2025-12-15: Neurology - Dr. White                      ║
║  └─ [view all]                                             ║
║                                                            ║
║  🧪 Lab Results (15)                                        ║
║  ├─ 2026-01-12: Lipid Panel - Quest Diagnostics           ║
║  ├─ 2025-11-20: CBC - LabCorp                              ║
║  └─ [view all]                                             ║
║                                                            ║
║  🏥 Imaging Studies (3)                                     ║
║  ├─ 2026-01-10: MRI Brain - Imaging Center A              ║
║  │   [DOWNLOAD DICOM] [VIEW IN PACS]                       ║
║  └─ [view all]                                             ║
║                                                            ║
║  💊 Current Medications (6)                                 ║
║  ├─ OxyContin 40mg ER - Pain Management                    ║
║  ├─ Gabapentin 600mg - Neurology                           ║
║  └─ [view all]                                             ║
║                                                            ║
║  [IMPORT TO EMR] [DOWNLOAD ALL] [VIEW AUDIT LOG]           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

#### Step 6: Audit Trail Recorded

Every access creates immutable audit log:

```json
{
  "audit_id": "audit_xyz789abc123",
  "audit_type": "RECORD_ACCESS",
  "timestamp": "2026-01-14T10:20:00Z",
  "patient": {
    "did": "did:blueblocks:patient:john-doe-1980"
  },
  "accessor": {
    "did": "did:blueblocks:physician:dr-alice-johnson",
    "npi": "1234567890",
    "name": "Dr. Alice Johnson",
    "role": "PHYSICIAN"
  },
  "grant": {
    "grant_id": "grant_abc123def456",
    "granted_at": "2026-01-14T10:15:00Z",
    "expires_at": "2026-04-14T10:15:00Z"
  },
  "access_details": {
    "records_accessed": [
      "mrp_001",
      "mrp_002",
      "mrp_003"
    ],
    "access_type": "READ",
    "downloaded": false,
    "modified": false
  },
  "context": {
    "ip_address": "203.0.113.42",
    "user_agent": "EMRSoftware/3.2.1",
    "location": {
      "facility": "Mayo Clinic Cardiology",
      "city": "Rochester",
      "state": "MN",
      "country": "US"
    },
    "purpose": "TREATMENT"
  },
  "blockchain": {
    "chain_id": "hospital-chain",
    "block_height": 123457,
    "tx_hash": "0x9f8e7d6c...",
    "finalized": true
  },
  "signatures": [
    {
      "signer": "did:blueblocks:physician:dr-alice-johnson",
      "signature": "base64_signature"
    }
  ]
}
```

Patient receives access notification:

```
┌─────────────────────────────────────────────┐
│ 📋 YOUR RECORDS WERE ACCESSED               │
├─────────────────────────────────────────────┤
│                                             │
│ Dr. Alice Johnson (Cardiologist)            │
│ accessed your medical records               │
│                                             │
│ When: Today at 10:20 AM                     │
│ Records: 47 records (visit notes, labs,     │
│          imaging, medications)              │
│ Purpose: Treatment                          │
│ Location: Mayo Clinic, Rochester MN         │
│                                             │
│ This access was authorized by you           │
│ (Grant expires: April 14, 2026)             │
│                                             │
│ [VIEW DETAILS] [REVOKE ACCESS]              │
│                                             │
└─────────────────────────────────────────────┘
```

#### Step 7: Patient Can Revoke Anytime

```bash
$ afterblock revoke-access \
    --grant grant_abc123def456 \
    --reason "Treatment completed" \
    --patient-key /secure/keys/patient-john-doe.json

Revoking access grant...
✓ Grant revoked
✓ Provider's decryption keys invalidated
✓ Submitted to blockchain (tx: 0x5a6b7c8d...)
✓ Provider notified

Dr. Alice Johnson no longer has access to your records
Revocation reason: Treatment completed
Revocation timestamp: 2026-02-15T14:30:00Z
```

Provider sees:

```
┌─────────────────────────────────────────────┐
│ ⚠️  ACCESS REVOKED                          │
├─────────────────────────────────────────────┤
│                                             │
│ Patient: John Doe                           │
│                                             │
│ Your access to this patient's medical       │
│ records has been revoked by the patient.    │
│                                             │
│ Revoked: Feb 15, 2026 at 2:30 PM            │
│ Reason: Treatment completed                 │
│                                             │
│ Previously accessed records remain in your  │
│ EMR but are marked as [REVOKED ACCESS].     │
│                                             │
│ To regain access, submit a new access       │
│ request with justification.                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Cryptographic Specifications

### Algorithms

| Purpose | Algorithm | Key Size | Standard |
|---------|-----------|----------|----------|
| Symmetric Encryption | AES-256-GCM | 256-bit | NIST FIPS 197, SP 800-38D |
| Digital Signatures | Ed25519 | 256-bit | RFC 8032 |
| Key Exchange | X25519 (ECDH) | 256-bit | RFC 7748 |
| Key Derivation | HKDF-SHA256 | Variable | RFC 5869 |
| Password Hashing | Argon2id | 256-bit output | RFC 9106 |
| Hash Function | SHA-256 | 256-bit output | NIST FIPS 180-4 |
| Timestamp Signatures | RSA-4096 | 4096-bit | RFC 3161 |

### Encryption Process

#### Medical Record Encryption

```
1. Generate unique key for record:
   record_key = HKDF(patient_master_key, record_id, 32 bytes)

2. Generate random nonce (96 bits for GCM):
   nonce = random_bytes(12)

3. Encrypt record with AES-256-GCM:
   ciphertext, auth_tag = AES256GCM.encrypt(
       key=record_key,
       nonce=nonce,
       plaintext=medical_record,
       associated_data=record_metadata
   )

4. Combine nonce + ciphertext + auth_tag:
   encrypted_record = nonce || ciphertext || auth_tag

5. Compute content hash:
   content_hash = SHA256(encrypted_record)

6. Store in IPFS:
   cid = IPFS.add(encrypted_record)

7. Store metadata on blockchain:
   - CID (content identifier)
   - content_hash (integrity)
   - record_key encrypted for patient (key management)
```

#### Key Sharing (Patient → Provider)

When patient grants access to provider:

```
1. Retrieve provider's public key from DID registry:
   provider_pub_key = DID.resolve(provider_did).publicKey

2. Generate ephemeral key pair:
   ephemeral_priv, ephemeral_pub = X25519.generate()

3. Perform ECDH key exchange:
   shared_secret = X25519(ephemeral_priv, provider_pub_key)

4. Derive encryption key:
   kek = HKDF(shared_secret, "blueblocks-v1-key-encryption", 32)

5. Encrypt record key with KEK:
   nonce = random_bytes(12)
   encrypted_record_key = AES256GCM.encrypt(
       key=kek,
       nonce=nonce,
       plaintext=record_key
   )

6. Package encrypted key:
   key_package = {
       ephemeral_pub_key: ephemeral_pub,
       encrypted_key: nonce || encrypted_record_key,
       recipient: provider_did
   }

7. Store key package on blockchain or IPFS
```

Provider decrypts:

```
1. Retrieve key package
2. Retrieve provider's private key (from HSM/secure enclave)
3. Perform ECDH with ephemeral public key:
   shared_secret = X25519(provider_priv_key, ephemeral_pub)
4. Derive KEK:
   kek = HKDF(shared_secret, "blueblocks-v1-key-encryption", 32)
5. Decrypt record key:
   record_key = AES256GCM.decrypt(kek, encrypted_record_key)
6. Use record_key to decrypt medical records
```

### Digital Signatures

#### Record Signing (Provider Creates Record)

```
1. Serialize record to canonical JSON:
   record_canonical = JSON.stringify(record, sorted_keys=true)

2. Compute hash:
   record_hash = SHA256(record_canonical)

3. Sign with provider's private key:
   signature = Ed25519.sign(provider_priv_key, record_hash)

4. Create signature object:
   sig_obj = {
       signer_did: provider_did,
       signer_role: "AUTHOR",
       algorithm: "ed25519",
       hash_algorithm: "sha256",
       record_hash: record_hash,
       signature: signature,
       signed_at: timestamp
   }

5. Request RFC 3161 timestamp:
   tsa_token = TimestampAuthority.sign(record_hash)
   sig_obj.timestamp_token = tsa_token

6. Attach to record
```

#### Signature Verification

```
1. Extract signature object from record
2. Resolve signer's DID to get public key:
   pub_key = DID.resolve(signer_did).publicKey
3. Recompute record hash:
   computed_hash = SHA256(record_canonical)
4. Verify computed hash matches signed hash:
   assert computed_hash == sig_obj.record_hash
5. Verify Ed25519 signature:
   valid = Ed25519.verify(pub_key, record_hash, signature)
6. Verify TSA timestamp (if present):
   tsa_valid = TSA.verify(tsa_token, record_hash)
7. Check key wasn't revoked at signing time:
   key_status = DID.get_key_status(signer_did, sig_obj.signed_at)
   assert key_status == "ACTIVE"
8. If all checks pass: signature valid
```

### Key Hierarchy

```
Patient Master Seed (BIP39 mnemonic, 256-bit entropy)
    │
    ├─ Identity Key (m/44'/0'/0')
    │   └─ Used for: DID signatures, authentication
    │
    ├─ Encryption Master Key (m/44'/100'/0')
    │   ├─ Record Key 1 = HKDF(EMK, "record:mrp_001")
    │   ├─ Record Key 2 = HKDF(EMK, "record:mrp_002")
    │   └─ Record Key N = HKDF(EMK, "record:mrp_nnn")
    │
    └─ Recovery Key (m/44'/999'/0')
        └─ Shamir Secret Sharing (3-of-5 threshold)
```

### Merkle Tree for Integrity

Medical Record Package can contain hundreds of files. Use Merkle tree for efficient integrity verification:

```
                    Root Hash
                   /         \
              Hash_AB       Hash_CD
             /      \       /      \
         Hash_A  Hash_B Hash_C  Hash_D
           |       |      |       |
        File_A  File_B File_C  File_D

Merkle Proof for File_B:
- Hash_A (sibling)
- Hash_CD (uncle)
- Root Hash (from blockchain)

Verifier can confirm File_B is part of package without downloading entire package.
```

---

## Network Protocol

### Transport Mechanisms

BMRTS supports multiple transport protocols:

#### 1. HTTPS (Traditional Web)

For browser-based access and EMR integrations:

```
POST /api/v1/records/access
Host: hospital-chain.blueblocks.io
Authorization: Bearer {grant_token}
Content-Type: application/json

{
  "grant_id": "grant_abc123def456",
  "record_ids": ["mrp_001", "mrp_002"],
  "requester_did": "did:blueblocks:physician:dr-alice-johnson"
}

Response:
{
  "records": [
    {
      "mrp_id": "mrp_001",
      "cid": "Qm...",
      "download_url": "https://ipfs.blueblocks.io/ipfs/Qm...",
      "encrypted_key_cid": "Qm..."
    }
  ]
}
```

#### 2. libp2p (Peer-to-Peer)

For direct provider-to-provider transfers:

```
Provider A connects directly to Provider B:
/ip4/203.0.113.42/tcp/4001/p2p/12D3KooWProviderB

Stream protocol: /blueblocks/bmrts/1.0.0

Message:
{
  "request_type": "RECORD_TRANSFER",
  "grant_id": "grant_abc123def456",
  "record_ids": ["mrp_001"],
  "signature": "base64_signature"
}

Response: Stream of encrypted record chunks
```

#### 3. IBC (Inter-Blockchain Communication)

For cross-chain record transfers:

```
Hospital Chain → Clinic Chain transfer:

IBC Packet:
{
  "source_chain": "hospital-chain",
  "dest_chain": "clinic-chain",
  "data": {
    "transfer_type": "MEDICAL_RECORD",
    "patient_did": "did:blueblocks:patient:john-doe-1980",
    "record_cid": "Qm...",
    "encrypted_key_cid": "Qm...",
    "grant_id": "grant_abc123def456"
  },
  "timeout_height": 123500,
  "proof": "base64_merkle_proof"
}

Relayer picks up packet and delivers to clinic-chain
```

### API Endpoints

Standard REST API for BMRTS implementations:

#### Authentication

```
POST /auth/request
POST /auth/verify
GET /auth/status
```

#### Records

```
GET /records - List patient's records
GET /records/{mrp_id} - Get specific record
POST /records - Upload new record
PUT /records/{mrp_id} - Update record
DELETE /records/{mrp_id} - Delete record (crypto-shred)
```

#### Permissions

```
POST /permissions/request - Provider requests access
GET /permissions/pending - Patient lists pending requests
POST /permissions/grant - Patient grants access
POST /permissions/revoke - Patient revokes access
GET /permissions/active - List active grants
```

#### Audit

```
GET /audit/patient/{did} - Patient's audit log
GET /audit/provider/{did} - Provider's access log
GET /audit/record/{mrp_id} - Record's access history
```

#### Storage

```
POST /storage/upload - Upload file to IPFS
GET /storage/{cid} - Download from IPFS
POST /storage/pin - Pin file for persistence
```

---

## Quality Assurance

### Quality Metrics

Every Medical Record Package includes quality scores:

```json
{
  "quality": {
    "overall_score": 0.98,
    "completeness": {
      "score": 0.95,
      "missing_fields": ["patient_phone"],
      "optional_fields_present": ["emergency_contact", "preferred_language"]
    },
    "data_quality": {
      "score": 1.0,
      "validation_errors": [],
      "validation_warnings": ["Patient phone number missing"]
    },
    "imaging_quality": {
      "score": 1.0,
      "original_resolution": true,
      "lossless_compression": true,
      "diagnostic_quality_attested": true,
      "radiologist_signature": "base64_signature"
    },
    "standards_compliance": {
      "fhir_valid": true,
      "fhir_version": "R5",
      "dicom_compliant": true,
      "hl7_compliant": true
    }
  }
}
```

### Quality Attestation

Radiologists/providers can attest to image quality:

```json
{
  "quality_attestation": {
    "attestation_id": "qa_550e8400",
    "attester": {
      "did": "did:blueblocks:radiologist:dr-bob-smith",
      "npi": "9876543210",
      "name": "Dr. Bob Smith, MD",
      "specialty": "RADIOLOGY",
      "board_certified": true
    },
    "attested_at": "2026-01-14T11:00:00Z",
    "assertions": {
      "original_acquisition": true,
      "no_lossy_compression": true,
      "full_diagnostic_quality": true,
      "meets_acr_standards": true,
      "dicom_compliant": true
    },
    "details": {
      "modality": "MRI",
      "scanner": "Siemens Magnetom Vida 3T",
      "acquisition_matrix": "256x256",
      "slice_thickness": "1mm",
      "reviewed_by_radiologist": true
    },
    "signature": "base64_ed25519_signature",
    "timestamp_token": "base64_rfc3161_token"
  }
}
```

### Validation Rules

BMRTS implementations MUST validate:

1. **Structural Validation**
   - JSON schema compliance
   - Required fields present
   - Data types correct
   - Value ranges valid

2. **FHIR Validation**
   - Resources conform to FHIR R5 spec
   - References resolve
   - CodeableConcepts use valid terminologies
   - Cardinality rules respected

3. **DICOM Validation**
   - Files are valid DICOM Part 10
   - Required DICOM tags present
   - Transfer syntax supported
   - Patient identity matches MRP

4. **Cryptographic Validation**
   - All signatures verify
   - Hashes match content
   - Keys not revoked at signing time
   - Timestamps valid

5. **Permissions Validation**
   - Accessor has valid grant
   - Grant not expired
   - Grant not revoked
   - Scope includes requested records

### Quality Enforcement

```python
def validate_mrp_quality(mrp):
    """Validate Medical Record Package meets BMRTS quality standards"""

    errors = []
    warnings = []

    # Check FHIR compliance
    if not validate_fhir(mrp.contents):
        errors.append("FHIR validation failed")

    # Check imaging quality (if present)
    if mrp.has_imaging():
        imaging = mrp.contents.imaging_study

        # MUST be lossless or uncompressed
        if imaging.compression not in ["none", "lossless_jpeg2000", "lossless_jpeg"]:
            errors.append(f"Lossy compression not allowed: {imaging.compression}")

        # MUST have quality attestation
        if not imaging.quality_attestation:
            errors.append("Missing quality attestation for imaging")
        else:
            # Verify attestation signature
            if not verify_signature(imaging.quality_attestation):
                errors.append("Invalid quality attestation signature")

    # Check completeness
    required_fields = ["patient", "encounter", "contents", "signatures"]
    for field in required_fields:
        if not hasattr(mrp, field):
            errors.append(f"Missing required field: {field}")

    # Check at least one signature
    if len(mrp.signatures) == 0:
        errors.append("No signatures found")

    # Verify all signatures
    for sig in mrp.signatures:
        if not verify_signature(sig):
            errors.append(f"Invalid signature from {sig.signer}")

    # Check data quality
    if mrp.quality.overall_score < 0.8:
        warnings.append(f"Low quality score: {mrp.quality.overall_score}")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings
    }
```

---

## Implementation Guide

### For EMR Vendors

#### Step 1: Add BMRTS Export

```python
# Example: Export patient record to BMRTS format

def export_to_bmrts(patient_id, encounter_id):
    """Export encounter to BMRTS Medical Record Package"""

    # 1. Retrieve patient data from EMR
    patient = emr.get_patient(patient_id)
    encounter = emr.get_encounter(encounter_id)

    # 2. Create MRP structure
    mrp = {
        "mrp_version": "1.0",
        "mrp_id": f"mrp_{uuid.uuid4()}",
        "created_at": datetime.now().isoformat(),

        # Patient info
        "patient": {
            "did": patient.blockchain_did,  # Or generate new DID
            "mrn": patient.mrn,
            "name_encrypted": encrypt_pii(patient.name),
            "dob_hash": hashlib.sha256(patient.dob.encode()).hexdigest()
        },

        # Encounter info
        "encounter": {
            "encounter_id": encounter.id,
            "date": encounter.date.isoformat(),
            "type": encounter.type,
            "provider": {
                "did": encounter.provider.blockchain_did,
                "npi": encounter.provider.npi,
                "name": encounter.provider.name
            }
        },

        # Contents
        "contents": {}
    }

    # 3. Add visit note
    if encounter.visit_note:
        fhir_doc = convert_to_fhir_document(encounter.visit_note)
        encrypted_doc = encrypt_record(fhir_doc, patient.master_key)
        cid = ipfs_client.add(encrypted_doc)

        mrp["contents"]["visit_note"] = {
            "type": "FHIR_DOCUMENT_REFERENCE",
            "format": "application/fhir+json",
            "cid": cid,
            "size": len(encrypted_doc),
            "hash": hashlib.sha256(encrypted_doc).hexdigest(),
            "encrypted": True
        }

    # 4. Add lab results
    labs = emr.get_labs_for_encounter(encounter_id)
    if labs:
        fhir_labs = convert_labs_to_fhir(labs)
        encrypted_labs = encrypt_record(fhir_labs, patient.master_key)
        cid = ipfs_client.add(encrypted_labs)

        mrp["contents"]["lab_results"] = {
            "type": "FHIR_DIAGNOSTIC_REPORT",
            "format": "application/fhir+json",
            "cid": cid,
            "size": len(encrypted_labs),
            "hash": hashlib.sha256(encrypted_labs).hexdigest(),
            "encrypted": True
        }

    # 5. Add imaging (if exists)
    imaging = emr.get_imaging_for_encounter(encounter_id)
    if imaging:
        # Export from PACS as DICOM
        dicom_files = pacs.export_study(imaging.study_uid)

        # Compress losslessly (JPEG 2000 lossless)
        compressed = compress_lossless(dicom_files)

        # Encrypt
        encrypted_imaging = encrypt_record(compressed, patient.master_key)

        # Upload to IPFS
        cid = ipfs_client.add(encrypted_imaging)

        mrp["contents"]["imaging_study"] = {
            "type": "DICOM_STUDY",
            "format": "application/dicom",
            "modality": imaging.modality,
            "total_size": len(encrypted_imaging),
            "cid": cid,
            "encrypted": True,
            "compression": "lossless_jpeg2000"
        }

    # 6. Sign with provider's key
    provider_signature = sign_record(mrp, encounter.provider.private_key)
    mrp["signatures"] = [provider_signature]

    # 7. Submit to blockchain
    tx_hash = blockchain_client.submit_mrp(mrp)
    mrp["blockchain"] = {
        "chain_id": "hospital-chain",
        "tx_hash": tx_hash
    }

    return mrp
```

#### Step 2: Add BMRTS Import

```python
def import_from_bmrts(grant_id, provider_private_key):
    """Import external records from BMRTS"""

    # 1. Retrieve grant from blockchain
    grant = blockchain_client.get_grant(grant_id)

    # 2. Verify grant is valid
    if not grant.is_valid():
        raise PermissionError("Grant expired or revoked")

    # 3. Get list of record IDs in grant
    mrp_ids = grant.scope.mrp_ids

    imported_records = []

    for mrp_id in mrp_ids:
        # 4. Retrieve MRP from blockchain
        mrp = blockchain_client.get_mrp(mrp_id)

        # 5. Get encrypted key for this provider
        encrypted_key = grant.get_encrypted_key(mrp_id, provider_did)

        # 6. Decrypt key with provider's private key
        record_key = decrypt_key(encrypted_key, provider_private_key)

        # 7. For each content item, download and decrypt
        for content_type, content_info in mrp.contents.items():
            # Download from IPFS
            encrypted_content = ipfs_client.get(content_info.cid)

            # Decrypt
            decrypted_content = decrypt_record(encrypted_content, record_key)

            # Parse based on type
            if content_type == "visit_note":
                fhir_doc = json.loads(decrypted_content)
                # Import to EMR
                emr.import_document(fhir_doc, source="BlueBlocks")

            elif content_type == "lab_results":
                fhir_labs = json.loads(decrypted_content)
                # Import to EMR
                emr.import_labs(fhir_labs, source="BlueBlocks")

            elif content_type == "imaging_study":
                dicom_study = decrypted_content
                # Import to PACS
                pacs.import_study(dicom_study, source="BlueBlocks")

        # 8. Log access to blockchain
        audit_entry = {
            "grant_id": grant_id,
            "mrp_id": mrp_id,
            "accessed_by": provider_did,
            "accessed_at": datetime.now().isoformat()
        }
        blockchain_client.log_access(audit_entry)

        imported_records.append(mrp_id)

    return imported_records
```

### For Patients (Mobile App)

```javascript
// Example: Patient grants access via mobile app

async function grantAccessToProvider(requestId, duration, scope) {
  // 1. Retrieve access request from blockchain
  const request = await blockchain.getAccessRequest(requestId);

  // 2. Display to patient for review
  const approved = await showApprovalDialog(request);
  if (!approved) {
    await blockchain.denyAccessRequest(requestId);
    return;
  }

  // 3. Retrieve patient's master key from secure enclave
  const masterKey = await SecureEnclave.getMasterKey();

  // 4. Retrieve provider's public key
  const providerPubKey = await did.resolvePublicKey(request.provider.did);

  // 5. For each record in scope, encrypt key for provider
  const recordIds = await getRecordIdsInScope(scope);
  const encryptedKeys = [];

  for (const recordId of recordIds) {
    // Derive record key
    const recordKey = deriveRecordKey(masterKey, recordId);

    // Encrypt for provider using ECDH
    const encryptedKey = await encryptKeyForProvider(
      recordKey,
      providerPubKey
    );

    encryptedKeys.push({
      recordId,
      encryptedKey
    });
  }

  // 6. Create grant transaction
  const grant = {
    grantId: generateGrantId(),
    patientDid: patient.did,
    providerDid: request.provider.did,
    scope: scope,
    duration: duration,
    expiresAt: Date.now() + (duration * 24 * 60 * 60 * 1000),
    encryptedKeys: encryptedKeys
  };

  // 7. Sign with patient's private key
  const signature = await SecureEnclave.sign(grant);
  grant.signature = signature;

  // 8. Submit to blockchain
  const txHash = await blockchain.submitGrant(grant);

  // 9. Notify provider
  await notifications.sendToProvider(request.provider.did, {
    type: "ACCESS_GRANTED",
    grantId: grant.grantId,
    patient: patient.name
  });

  return grant;
}
```

---

## Conformance Requirements

### Conformance Levels

#### Level 1: Basic Conformance (REQUIRED)

- ✅ MUST support MRP format v1.0
- ✅ MUST support AES-256-GCM encryption
- ✅ MUST support Ed25519 signatures
- ✅ MUST support patient-controlled permissions
- ✅ MUST support FHIR R5 for structured data
- ✅ MUST support IPFS for content storage
- ✅ MUST support blockchain audit logs
- ✅ MUST validate all signatures
- ✅ MUST verify grants before access
- ✅ MUST log all accesses

#### Level 2: Full Conformance (RECOMMENDED)

- ✅ Level 1 + All basic requirements
- ✅ SHOULD support DICOM for medical imaging
- ✅ SHOULD support HL7 v2 import/export
- ✅ SHOULD support quality attestation
- ✅ SHOULD support emergency access
- ✅ SHOULD support cross-chain transfers (IBC)
- ✅ SHOULD support libp2p peer-to-peer
- ✅ SHOULD support RFC 3161 timestamps
- ✅ SHOULD support Argon2id password hashing

#### Level 3: Extended Conformance (OPTIONAL)

- ✅ Level 2 + All recommended features
- ✅ MAY support zero-knowledge proofs
- ✅ MAY support multi-signature workflows
- ✅ MAY support telemedicine integration
- ✅ MAY support research data de-identification
- ✅ MAY support international standards (GDPR, etc.)

### Testing & Certification

**BMRTS Certification Program** (Proposed):

1. **Self-Certification**
   - Run conformance test suite
   - Submit results to BMRTS registry
   - Display "BMRTS Compatible" badge

2. **Third-Party Certification**
   - Independent testing lab validates
   - Issues formal certificate
   - Annual recertification required

3. **Reference Implementation**
   - Open-source Go implementation
   - Conformance test suite included
   - Used as gold standard

---

## Reference Implementation

See: `github.com/blueblocks/bmrts-reference`

```
bmrts-reference/
├── lib/
│   ├── mrp/           # Medical Record Package encoding/decoding
│   ├── crypto/        # Cryptography (AES, Ed25519, HKDF)
│   ├── fhir/          # FHIR R5 support
│   ├── dicom/         # DICOM support
│   ├── permissions/   # Permission grant protocol
│   ├── storage/       # IPFS integration
│   └── blockchain/    # Blockchain integration
├── cmd/
│   ├── bmrts/         # CLI tool
│   └── server/        # Reference server
├── examples/
│   ├── export.go      # Export from EMR
│   ├── import.go      # Import to EMR
│   └── patient.go     # Patient app example
└── tests/
    └── conformance/   # Conformance test suite
```

**Usage:**

```bash
# Install
$ go install github.com/blueblocks/bmrts-reference/cmd/bmrts@latest

# Export record
$ bmrts export \
    --patient did:blueblocks:patient:john-doe \
    --encounter enc_12345 \
    --output record.mrp

# Import record
$ bmrts import \
    --grant grant_abc123 \
    --provider-key /secure/provider.key \
    --output /emr/imported/

# Validate
$ bmrts validate record.mrp

# Test conformance
$ bmrts test-conformance --implementation https://hospital.example.com/bmrts
```

---

## Conclusion

The **BlueBlocks Medical Records Transmission Standard (BMRTS)** provides a comprehensive, secure, patient-controlled framework for exchanging high-quality medical records.

**Key Innovations:**

1. **Patient Sovereignty**: Patients own and control access to their data
2. **Quality Preservation**: Lossless transmission of diagnostic-quality images
3. **Security**: Military-grade encryption, cryptographic non-repudiation
4. **Interoperability**: Works across all EMR systems and healthcare entities
5. **Speed**: Records transmitted in seconds, not days
6. **Auditability**: Complete immutable blockchain audit trail
7. **Openness**: Free, open standard anyone can implement

**Next Steps:**

1. **Community Feedback**: Open RFC period for comments
2. **Reference Implementation**: Release open-source Go library
3. **Pilot Programs**: Partner with 3-5 healthcare systems for validation
4. **Standards Body**: Submit to HL7, IHE for formal standardization
5. **Certification Program**: Launch BMRTS conformance testing
6. **Adoption**: EMR vendors integrate BMRTS support

**Join the Movement:**

- GitHub: `github.com/blueblocks/bmrts`
- Website: `bmrts.org` (proposed)
- Forum: `forum.bmrts.org` (proposed)
- Email: `standards@blueblocks.io`

---

**Document Status:** Draft for Community Review
**License:** Creative Commons Attribution 4.0 International (CC-BY-4.0)
**Contributions:** Welcome via GitHub pull requests

**END OF SPECIFICATION**
