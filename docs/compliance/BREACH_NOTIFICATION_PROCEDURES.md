# BlueBlocks Breach Notification Procedures

**Document Version:** 1.0
**Effective Date:** 2026-01-16
**Last Review:** 2026-01-16
**Next Review:** 2026-07-16
**Owner:** Chief Compliance Officer

---

## 1. Purpose

This document establishes procedures for identifying, responding to, and reporting breaches of Protected Health Information (PHI) in compliance with the HIPAA Breach Notification Rule (45 CFR 164.400-414).

---

## 2. Scope

These procedures apply to:
- All BlueBlocks employees, contractors, and agents
- All systems processing, storing, or transmitting PHI
- All Business Associates and subcontractors

---

## 3. Definitions

**Breach**: Acquisition, access, use, or disclosure of PHI not permitted under HIPAA that compromises the security or privacy of the PHI.

**Unsecured PHI**: PHI not rendered unusable, unreadable, or indecipherable through encryption or destruction.

**Secured PHI**: PHI encrypted using NIST-approved algorithms with proper key management, OR PHI that has been destroyed.

**Discovery**: The date the breach is first known or should have been known through reasonable diligence.

---

## 4. Breach Risk Assessment

### 4.1 Four-Factor Analysis

All potential breaches must be assessed using these factors:

| Factor | Questions to Consider |
|--------|----------------------|
| **1. Nature & Extent** | What types of PHI were involved? How many identifiers? What is the sensitivity? |
| **2. Unauthorized Person** | Who accessed the PHI? What is their relationship? Do they have obligations to protect PHI? |
| **3. Actual Acquisition** | Was PHI actually viewed or acquired? Is there evidence of copying or retention? |
| **4. Risk Mitigation** | What steps were taken? Was PHI returned? Are there assurances PHI was not retained? |

### 4.2 Risk Determination

Based on analysis, determine if there is a **low probability** that PHI was compromised:

- **Low Probability = NOT a Breach**: Document analysis and retain for 6 years
- **High Probability = Breach**: Proceed with notification procedures

### 4.3 Presumption of Breach

Unless documented analysis demonstrates low probability of compromise, **assume breach has occurred**.

---

## 5. Incident Response Timeline

```
DISCOVERY (Day 0)
      │
      ▼
┌─────────────────────────────────────────────────────┐
│ IMMEDIATE (0-4 hours)                               │
│ • Contain the incident                              │
│ • Preserve evidence                                 │
│ • Notify Security Officer                           │
│ • Begin incident log                                │
└─────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────┐
│ INITIAL ASSESSMENT (4-24 hours)                     │
│ • Identify affected systems                         │
│ • Identify affected individuals                     │
│ • Determine PHI types involved                      │
│ • Notify Privacy Officer                            │
│ • Convene Incident Response Team                    │
└─────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────┐
│ RISK ASSESSMENT (24-72 hours)                       │
│ • Complete 4-factor analysis                        │
│ • Determine if breach occurred                      │
│ • Document findings                                 │
│ • Notify Covered Entities (if BA)                   │
└─────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────┐
│ NOTIFICATION PREPARATION (Days 3-30)                │
│ • Draft notification letters                        │
│ • Prepare HHS report (if 500+)                      │
│ • Prepare media notice (if 500+ in state)           │
│ • Coordinate with legal counsel                     │
└─────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────┐
│ NOTIFICATION (Within 60 days of discovery)          │
│ • Send individual notifications                     │
│ • Submit HHS report                                 │
│ • Issue media notice if required                    │
│ • Document all notifications                        │
└─────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────┐
│ POST-INCIDENT (Ongoing)                             │
│ • Implement remediation                             │
│ • Update policies and procedures                    │
│ • Conduct root cause analysis                       │
│ • Training updates if needed                        │
│ • Retain documentation 6 years                      │
└─────────────────────────────────────────────────────┘
```

---

## 6. Notification Requirements

### 6.1 Individual Notification

**Required For**: All breaches affecting 1+ individuals

**Timeline**: Within 60 days of discovery

**Method**:
- First-class mail to last known address
- Email if individual has agreed to electronic notice
- Telephone if urgent

**Content Must Include**:
1. Brief description of what happened and dates
2. Types of PHI involved
3. Steps individual should take to protect themselves
4. What BlueBlocks is doing to investigate and mitigate
5. Contact information for questions

### 6.2 HHS Notification

**Breaches affecting 500+ individuals**:
- Report to HHS within 60 days
- Submit via HHS breach portal: https://ocrportal.hhs.gov/ocr/breach/

**Breaches affecting fewer than 500**:
- Log and report to HHS annually
- Due within 60 days after end of calendar year

### 6.3 Media Notification

**Required When**: 500+ residents of a single state/jurisdiction affected

**Timeline**: Within 60 days of discovery

**Method**: Prominent media outlets in the state

### 6.4 Business Associate Notification

If BlueBlocks is a Business Associate:
- Notify Covered Entity within 30 days of discovery
- Provide: affected individuals, PHI types, circumstances

---

## 7. Incident Response Team

### 7.1 Team Composition

| Role | Responsibility | Contact |
|------|----------------|---------|
| **Security Officer** | Lead technical response | security@blueblocks.xyz |
| **Privacy Officer** | Lead compliance response | privacy@blueblocks.xyz |
| **Legal Counsel** | Legal guidance | legal@blueblocks.xyz |
| **Communications** | Media/public relations | pr@blueblocks.xyz |
| **IT Director** | Technical remediation | it@blueblocks.xyz |
| **CEO** | Executive decisions | [Internal] |

### 7.2 Escalation Matrix

| Severity | Affected Individuals | Response Level |
|----------|---------------------|----------------|
| Low | 1-10 | Security + Privacy Officers |
| Medium | 11-499 | + Legal + IT Director |
| High | 500-4,999 | + Communications + CEO |
| Critical | 5,000+ | Full team + External counsel |

---

## 8. Documentation Requirements

### 8.1 Incident Log

Maintain log including:
- Date and time of discovery
- Date and time of breach (if different)
- Source of report
- Description of incident
- PHI types involved
- Number of individuals affected
- Risk assessment findings
- Notification actions taken
- Remediation steps

### 8.2 Retention

All breach documentation retained for **6 years** from date of creation or last effective date.

---

## 9. Special Situations

### 9.1 Law Enforcement Delay

If law enforcement requests delay:
- Document request in writing
- Delay notification for period specified (max 30 days for oral, 60 days for written)
- Resume notification when delay expires

### 9.2 Insufficient Contact Information

If unable to contact 10+ individuals:
- Post notice on BlueBlocks website for 90 days
- Include toll-free number active for 90 days
- Consider major media notification

### 9.3 Agent Breach

If breach by Business Associate/subcontractor:
- They must notify us within 30 days
- We are responsible for individual notifications
- May delegate notification but retain accountability

---

## 10. Breach Exceptions

### 10.1 Not Considered a Breach

The following are **not** breaches under HIPAA:

1. **Unintentional Access**: Good faith, within scope of work, no further use
2. **Inadvertent Disclosure**: Between authorized persons, within same facility
3. **Recipient Unable**: PHI cannot reasonably be retained

### 10.2 Encryption Safe Harbor

PHI is considered **secured** and notification is NOT required if:
- Encrypted using NIST-approved algorithm
- Decryption key was not compromised
- Processes validated (AES-128+, SHA-256+)

BlueBlocks encryption meets safe harbor:
- AES-256-GCM (NIST approved)
- X25519 key exchange
- Keys stored separately from data

---

## 11. Notification Templates

### 11.1 Individual Notification Letter

```
[DATE]

[RECIPIENT NAME]
[ADDRESS]

RE: Notice of Privacy Incident

Dear [RECIPIENT NAME]:

We are writing to inform you of an incident that may have involved some of your
personal health information.

WHAT HAPPENED
On [DATE], we discovered [BRIEF DESCRIPTION]. This incident occurred on or about
[DATE OF BREACH].

WHAT INFORMATION WAS INVOLVED
The information that may have been accessed includes: [LIST PHI TYPES]
- [Example: Name, date of birth]
- [Example: Medical record number]
- [Example: Diagnosis information]

WHAT WE ARE DOING
Upon discovering this incident, we immediately [ACTIONS TAKEN]. We have also
[ADDITIONAL STEPS]. We are conducting a thorough review of our security measures
and implementing additional safeguards.

WHAT YOU CAN DO
We recommend you [RECOMMENDED ACTIONS]:
- Review your medical records and insurance statements
- [Additional recommendations as appropriate]

FOR MORE INFORMATION
If you have questions, please contact:
[CONTACT NAME]
[PHONE NUMBER]
[EMAIL]
[HOURS OF AVAILABILITY]

We sincerely regret any inconvenience or concern this incident may cause.

Sincerely,

[NAME]
[TITLE]
BlueBlocks, Inc.
```

### 11.2 HHS Report Template

Submit via: https://ocrportal.hhs.gov/ocr/breach/

Required information:
- Covered Entity/BA information
- Breach details (type, location, dates)
- Types of PHI involved
- Safeguards in place
- Actions taken
- Number of individuals affected

---

## 12. Annual Review

This document shall be reviewed:
- Annually at minimum
- After any breach incident
- When regulations change
- When systems change significantly

---

## 13. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Security Officer | | | |
| Privacy Officer | | | |
| Legal Counsel | | | |
| CEO | | | |

---

## Appendix A: Breach Response Checklist

### Immediate (0-4 hours)
- [ ] Contain the incident (isolate systems, revoke access)
- [ ] Preserve evidence (logs, screenshots)
- [ ] Notify Security Officer
- [ ] Begin incident log
- [ ] Assess if PHI was encrypted

### Initial Assessment (4-24 hours)
- [ ] Identify affected systems
- [ ] Identify affected individuals (count and list)
- [ ] Determine PHI types involved
- [ ] Notify Privacy Officer
- [ ] Convene Incident Response Team
- [ ] Notify affected Covered Entities (if BA)

### Risk Assessment (24-72 hours)
- [ ] Complete 4-factor analysis
- [ ] Document low probability determination (if applicable)
- [ ] Determine breach status
- [ ] Prepare executive briefing

### Notification Preparation (Days 3-30)
- [ ] Identify individuals to notify
- [ ] Prepare notification letters
- [ ] Prepare HHS report (if 500+)
- [ ] Prepare media notice (if 500+ in state)
- [ ] Review with legal counsel
- [ ] Establish contact center (if large breach)

### Notification Execution (Within 60 days)
- [ ] Send individual notifications
- [ ] Submit HHS report
- [ ] Issue media notice (if required)
- [ ] Document all notification activities
- [ ] Log returned mail, update addresses, resend

### Post-Incident
- [ ] Complete root cause analysis
- [ ] Implement corrective actions
- [ ] Update policies/procedures
- [ ] Conduct additional training
- [ ] Prepare lessons learned report
- [ ] Archive all documentation

---

## Appendix B: Contact Information

### Internal Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Security Officer | TBD | | security@blueblocks.xyz |
| Privacy Officer | TBD | | privacy@blueblocks.xyz |
| Legal | TBD | | legal@blueblocks.xyz |
| On-call Security | | | security-oncall@blueblocks.xyz |

### External Contacts

| Organization | Purpose | Contact |
|--------------|---------|---------|
| HHS OCR | Breach reporting | ocrportal.hhs.gov |
| FBI Cyber | Law enforcement | ic3.gov |
| External Counsel | Legal support | [TBD] |
| PR Firm | Media response | [TBD] |
| Forensics Firm | Investigation | [TBD] |
