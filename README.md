# TrustPilot AI
### Intelligent Identity, Risk & Onboarding Platform

[![CI/CD Pipeline](https://github.com/Ravibbk/trustpilot-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/Ravibbk/trustpilot-ai/actions)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-brightgreen?logo=vitest)](https://vitest.dev/)

> **"Reduce unnecessary friction for legitimate users while increasing scrutiny for genuinely risky cases."**

---

## 1. Project Overview

**TrustPilot AI** is a production-quality, portfolio-grade fintech trust, safety, and intelligent onboarding platform. Designed by human product engineering principles, it bridges the gap between customer experience and financial crime prevention.

Rather than forcing a binary trade-off between high drop-off friction and fraud losses, TrustPilot AI uses an **adaptive, risk-based workflow** with explainable 0–100 risk scoring, human-in-the-loop review, and its signature innovation: **TrustPath AI™ Next Best Verification Action**.

---

## 2. Core Features & Capabilities

- **Progressive Customer KYC Pipeline:**
  - Multi-stage state machine (`STARTED` -> `PROFILE` -> `DOCUMENT` -> `LIVENESS` -> `RISK` -> `DECISION`).
  - Modular OCR field extraction (Name 98%, DOB 97%, ID 99%, Address 84%).
  - Optical quality inspection (blur, cropped edges, glare, resolution) with human-friendly remediation.
  - Active 3D biometric liveness verification (challenge-response micro-blink, head rotation, anti-spoof presentation attack detection).
  - Sub-90-second frictionless approval for low-risk applicants.

- **Corporate KYB & Ultimate Beneficial Ownership (UBO):**
  - Company registration, tax ID (EIN/TIN), and jurisdiction validation.
  - Directors and Ultimate Beneficial Owners (UBO) registry.
  - Interactive **Corporate Ownership Tree** visual relationship mapping to account for 100% equity.
  - Automated screening against Politically Exposed Persons (PEP) registers.

- **Transparent Risk Engine & Scoring (0–100):**
  - Mathematically decomposes risk into **Positive Signals (+)** and **Risk Signals (-)** with exact weights and physical evidence citations.
  - Configurable risk tiers: Low (0–30), Medium (31–60), High (61–80), and Critical (81–100).
  - Session and device telemetry (WebGL canvas emulator detection, commercial VPN exit nodes, and cross-account velocity spikes).

- **Signature Feature — TrustPath AI™:**
  - Recommends the optimal next verification action for borderline cases (e.g. *Request Additional Proof of Address via automated utility bill upload rather than outright manual rejection*).
  - Diverts **72% of false positive manual reviews** into automated customer self-service.

- **Human-in-the-Loop Analyst Workspace:**
  - High-density review queue with instant filtering (Status, Risk Level, Entity Type).
  - Chronological fraud timeline and AML screening dossier.
  - Analyst action toolbar (`Approve`, `Reject`, `Request Info`, `Escalate`, `Override AI`).
  - Mandatory compliance justification modal creating write-once immutable audit log records.

- **AI Case Copilot & Case Summaries:**
  - Zero-hallucination assistant responding strictly citing verified facts from the case dossier.
  - Instant one-click queries: *"Why was this customer flagged?"*, *"Summarize this case"*, *"What should the analyst verify next?"*.

- **Product Manager Funnel Analytics & A/B Testing:**
  - Full-funnel diagnostics tracking conversion and drop-off % at every verification gate.
  - Automated AI Product Insights identifying camera blur and mobile abandonment causes.
  - Built-in A/B experimentation engine showing conversion lift (e.g., Progressive Onboarding: **+10.7% lift** over monolithic form).

- **System Rules & Immutable Audit Ledger:**
  - Visual Rule Builder (`IF conditionField operator value THEN action`).
  - Write-only audit log recording actor email, role, timestamp, target entity, justification, and IP address.

---

## 3. Product Architecture

```text
trustpilot-ai/
├── src/
│   ├── app/                      # Next.js App Router (Pages & REST endpoints)
│   │   ├── api/                  # RESTful API Micro-endpoints
│   │   │   ├── analytics/funnel/ # Funnel drop-off analytics
│   │   │   ├── audit-logs/       # Immutable compliance ledger
│   │   │   ├── auth/login/       # Session & persona authentication
│   │   │   ├── business/         # Corporate KYB registrations
│   │   │   ├── cases/            # Case queue & decision recording
│   │   │   ├── copilot/          # Grounded AI analyst assistant
│   │   │   ├── documents/verify/ # Modular OCR validation
│   │   │   ├── experiments/      # A/B testing management
│   │   │   ├── health/           # System & dependency telemetry
│   │   │   ├── liveness/verify/  # Active 3D biometrics
│   │   │   ├── onboarding/       # Customer KYC state machine
│   │   │   └── rules/            # Visual rule builder
│   │   ├── dashboard/            # Internal Operations Suite
│   │   ├── docs/                 # Interactive Documentation & PRD
│   │   ├── onboarding/           # Customer KYC & Corporate KYB Flows
│   │   └── page.tsx              # High-fidelity Fintech Landing Page
│   ├── components/               # Reusable UI & Domain Components
│   │   ├── common/               # Badges, Persona Switcher
│   │   ├── copilot/              # AI Case Copilot Modal & Drawer
│   │   ├── kyb/                  # UBO Corporate Ownership Tree
│   │   ├── landing/              # Live Product Preview component
│   │   └── layout/               # Navbar, Footer, Dashboard Sidebar
│   ├── lib/                      # Core Business Logic & Adapters
│   │   ├── ai/                   # AI Case Copilot & Product Insights
│   │   ├── auth/                 # RBAC matrix & session management
│   │   ├── db/                   # In-memory transactional ledger & seeds
│   │   ├── providers/            # Decoupled Mock Verification Adapters
│   │   └── risk/                 # Risk Engine & TrustPath AI Core
│   └── types/                    # Shared TypeScript Data Contracts
├── tests/                        # Vitest Unit, Workflow, & API Tests
├── docs/                         # Comprehensive Documentation Suite
├── .github/workflows/ci.yml      # GitHub Actions CI/CD Pipeline
├── Dockerfile                    # Production Multi-Stage Containerfile
└── docker-compose.yml            # Multi-Container Compose Config
```

---

## 4. Demo Personas & Pre-Loaded Credentials

The platform features a 1-click **Demo Persona Switcher** located in the top navigation bar:

| Persona | Name | Role | Primary Workspace |
| :--- | :--- | :--- | :--- |
| **Risk & Compliance Analyst** | Elena Rostova | `ANALYST` | `/dashboard/cases` — Review Queue, Copilot, TrustPath AI |
| **Individual Customer** | Sarah Jenkins | `CUSTOMER` | `/onboarding` — Progressive KYC, OCR, Biometrics |
| **Business Customer** | Marcus Vance | `BUSINESS_USER` | `/onboarding/business` — Corporate KYB & UBO Tree |
| **Product Manager** | David Chen | `PRODUCT_MANAGER` | `/dashboard/analytics` — Funnel Diagnostics & A/B Tests |
| **Platform Administrator** | Rachel Sterling | `ADMIN` | `/dashboard/rules` & `/dashboard/audit` — Rules & Ledger |

---

## 5. 5-Minute Product Demonstration Walkthrough

1. **Minute 1: Landing Page & Live Product Preview**
   - Open `/`. Review the core product principle.
   - Interact with the **Live Product Preview**: toggle between *Legitimate User*, *Borderline Discrepancy*, and *Fraud Attack* to observe live mathematical risk scoring and TrustPath recommendations.
2. **Minute 2: Customer KYC Journey**
   - Click **Start Verification** (`/onboarding`).
   - Fill profile details, simulate document upload (test blur detection error & recovery), execute biometric liveness check, and complete instant approval under 90 seconds.
3. **Minute 3: Signature Feature — TrustPath AI in Analyst Review**
   - Switch persona to **Compliance Analyst**. Navigate to `/dashboard/cases/case_10492` (Rahul Kumar).
   - Show that passport identity (94%) and liveness (96%) are authentic, but residential address scored 64%.
   - Highlight TrustPath AI recommending an automated utility bill request to avoid manual rejection.
4. **Minute 4: AI Case Copilot & Immutable Audit Logs**
   - Click **AI Copilot** inside Case 10492. Click *"Why was this customer flagged?"* and *"Summarize this case"*.
   - Approve or override with a justification note.
   - Navigate to `/dashboard/audit` to show the write-once audit entry.
5. **Minute 5: Product Funnel Analytics & A/B Experiments**
   - Switch persona to **Product Manager**.
   - Navigate to `/dashboard/analytics` to view stage-by-stage drop-off diagnostics and AI Product Insights.
   - Navigate to `/dashboard/experiments` to view the **+10.7% conversion lift** achieved by progressive onboarding.

---

## 6. Running Locally

### Prerequisites
- Node.js 18.x or 20.x
- npm 9.x or 10.x

```bash
# 1. Clone the repository
git clone https://github.com/Ravibbk/trustpilot-ai.git
cd trustpilot-ai

# 2. Install dependencies
npm install

# 3. Run automated test suite
npm test

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Automated Testing Suite

The repository contains comprehensive unit, workflow, and API tests executed with Vitest:

```bash
npm test
```

Test coverage includes:
- **Risk Calculations:** Low, medium, high, and critical risk score boundary evaluation.
- **TrustPath AI:** Next-best-action routing, address discrepancy handling, and sanctions escalation.
- **Identity Matching:** Levenshtein-token similarity algorithms between declared and extracted records.
- **Document OCR Quality:** Blur, crop, glare, and resolution degradation detection.
- **Biometric 3D Liveness:** Anti-spoof presentation attack rejection.
- **AML Screening:** Global sanctions and PEP watchlist hits.
- **AI Case Copilot:** Grounded, zero-hallucination fact verification.
- **State Machine & Audit Logging:** Case updates and linked customer status mirroring.

---

## 8. Author & Developer

**Ravi Kumar**
- GitHub: [https://www.github.com/Ravibbk](https://www.github.com/Ravibbk)

---

## 9. Regulatory & Positioning Disclosure

*TrustPilot AI is an advanced fintech product simulation and portfolio demonstration platform. It includes modular mock verification provider adapters for identity matching, OCR parsing, 3D biometrics, and AML screening. It does not claim legally certified KYC/AML compliance without integration to licensed third-party verification providers.*

