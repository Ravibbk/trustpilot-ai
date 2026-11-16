# TrustPilot AI — Security, Governance & Privacy Architecture

## 1. Threat Modeling & Defense Vectors
- **Synthetic Identity Fraud:** Mitigated by optical OCR security zone checks, MRZ checksum calculations, and cross-account national ID collision detection.
- **Biometric Presentation Attacks:** Mitigated via active 3D pupil constriction challenges, micro-expression tracking, and spectral analysis for screen playback detection.
- **Emulator Botnets & Multi-Accounting:** Mitigated by WebGL canvas fingerprinting, battery/hardware sensor verification, and velocity monitoring.
- **Account Takeover / SIM Swap:** Mitigated by Step-Up Multi-Factor Authentication triggers.

---

## 2. PII Protection & Data Privacy
- **Default Data Redaction:** Identification numbers, dates of birth, and email addresses are masked by default on analyst screens (`XXXXX1234X`).
- **Access Tracking:** Any analyst request to unmask PII triggers an immutable audit log entry.
- **Retention Controls:** Biometric vectors and temporary selfie frames are ephemeral and can be deleted post-verification per GDPR Article 17 requirements.

---

## 3. Role-Based Access Control (RBAC) Matrix
Permissions are enforced server-side within API middleware:
- `CUSTOMER`: Limited to `onboarding:read_self` and `onboarding:write_self`.
- `BUSINESS_USER`: Limited to `kyb:read_self` and `kyb:write_self`.
- `ANALYST`: Granted `cases:read`, `cases:decide`, `cases:annotate`, `audit:read`.
- `PRODUCT_MANAGER`: Granted `analytics:read`, `experiments:manage`, `rules:manage`.
- `ADMIN`: Granted full system administration and user permission management.

---

## 4. Immutable Audit Ledger
Audit records conform to write-once properties:
- Structured schema: `timestamp`, `userId`, `userRole`, `action`, `entityType`, `entityId`, `details`, `ipAddress`.
- Zero in-place updates: Every decision, override, or rule update appends a new record to the audit sequence.
