# TrustPilot AI — Product Requirements Document (PRD)

## 1. Executive Summary
**TrustPilot AI** is an intelligent identity, risk, and onboarding platform engineered for fintechs, digital banks, and high-growth internet businesses. It balances two competing objectives:
1. **Frictionless Onboarding:** Delivering sub-90-second automated approval for legitimate customers.
2. **Deterministic Risk Protection:** Preventing synthetic identity rings, emulator botnets, and compliance breaches with explainable scoring and human-in-the-loop workflows.

---

## 2. Problem Statement
Traditional onboarding solutions impose static, indiscriminate friction. Legitimate consumers are subjected to excessive manual verification steps, leading to drop-off rates exceeding 35%. Conversely, automated black-box risk algorithms reject ambiguous cases without remediation paths, alienating legitimate users and violating fair lending and compliance standards.

---

## 3. Product Vision & Principle
> **"Reduce unnecessary friction for legitimate users while increasing scrutiny for genuinely risky cases."**

The platform employs **adaptive progressive verification**:
- **Low Risk (0–30):** Fast-track pass-through under 90 seconds.
- **Medium Risk (31–60):** Signature **TrustPath AI™** next-best-action recommendations (e.g., automated request for updated utility bill rather than outright rejection).
- **High Risk (61–80):** Human-in-the-loop escalation with complete forensic dossiers and AI Case Copilot.
- **Critical Risk (81–100):** Immediate lock and blacklisting with zero financial exposure.

---

## 4. User Personas & Use Cases

### 4.1 Individual Customer (KYC)
- Wants a fast, trustworthy onboarding flow with clear instructions.
- Requires instant feedback if an uploaded image is blurry, cropped, or unreadable.
- Requires active 3D biometric liveness verification without technical jargon.

### 4.2 Corporate Customer (KYB)
- Submits company incorporation credentials, tax identification (EIN/TIN), and jurisdiction.
- Discloses Board of Directors and Ultimate Beneficial Ownership (UBO) structure.
- Explores ownership hierarchy via interactive visual tree mapping to account for 100% equity.

### 4.3 Risk & Compliance Analyst
- Prioritizes flagged applications in a high-density triage queue.
- Reviews extracted OCR documents with per-field confidence scores (Name 98%, DOB 97%, Address 84%).
- Inspects device telemetry, IP proxy indicators, and session velocity timelines.
- Uses **AI Case Copilot** to query case facts and receive grounded summaries.
- Executes actions (`Approve`, `Reject`, `Request Info`, `Escalate`, `Override AI`) backed by mandatory justification logging.

### 4.4 Product Manager
- Monitors end-to-end onboarding funnel drop-offs at every verification gate.
- Generates AI Product Insights highlighting mobile camera friction and abandonment causes.
- Runs A/B experiments (e.g. progressive disclosure workflow vs monolithic form) to quantify statistical conversion lift.

### 4.5 Platform Administrator
- Defines visual business rules (e.g., `IF deviceRiskScore > 70 THEN require enhanced verification`).
- Configures numerical thresholds for risk score tiers.
- Audits immutable compliance ledgers for SOC 2 and regulatory reporting.

---

## 5. Functional Requirements
- **Progressive State Machine:** `STARTED` -> `PROFILE_COMPLETED` -> `DOCUMENT_REQUIRED` -> `DOCUMENT_VERIFIED` -> `LIVENESS_REQUIRED` -> `LIVENESS_VERIFIED` -> `RISK_ASSESSED` -> `DECISION_PENDING` -> `APPROVED` / `MANUAL_REVIEW` / `REJECTED`.
- **Modular OCR Engine:** Optical quality inspection (blur, crop, glare, resolution) and structured JSON field extraction with per-field confidence metrics.
- **Biometric Liveness Verification:** 3D facial landmark tracking, micro-expression challenges, presentation attack detection (anti-spoofing), and face-to-credential photo comparison.
- **Explainable Risk Scoring:** Mathematical calculation from 0 to 100 with explicit positive (+) and negative (-) weights and cited evidence.
- **TrustPath AI™ Engine:** Computes optimal next verification step to divert borderline address and document mismatches into self-service resolution.
- **AI Case Copilot:** Zero-hallucination assistant responding exclusively to active case signals and forensic events.
- **Immutable Audit Ledger:** Every state change, rule modification, and analyst decision records an immutable event with actor, timestamp, IP, and justification.

---

## 6. Non-Functional Requirements
- **Security:** TLS 1.3 in transit, AES-256 for sensitive credentials, PII data masking by default.
- **Performance:** Sub-100ms API response latency; client bundle under 100kB first-load JS.
- **Accessibility:** WCAG 2.1 AA compliant, keyboard-navigable, high contrast ratio.
- **Reliability:** Decoupled mock provider adapters allowing swap-in of live vendors (Jumio, Onfido, Sumsub, ComplyAdvantage) without architecture changes.

