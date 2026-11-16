# TrustPilot AI — System Architecture & Technical Design

## 1. High-Level Architecture Overview

TrustPilot AI is built as a production-grade, modular web application combining a modern Next.js 14 App Router frontend with a high-performance REST API and deterministic risk evaluation engine.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TrustPilot AI Platform                          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
      ┌──────────────────────────────┴──────────────────────────────┐
      ▼                                                             ▼
┌───────────────────────────┐                         ┌───────────────────────────┐
│ Client-Facing Onboarding  │                         │ Internal Operations Suite │
│ • Customer KYC Pipeline   │                         │ • Analyst Review Queue    │
│ • Business KYB Hierarchy  │                         │ • Forensic Case Workspace │
│ • Interactive Liveness    │                         │ • Funnel Diagnostics & PM │
└─────────────┬─────────────┘                         └─────────────┬─────────────┘
              │                                                     │
              └──────────────────────┬──────────────────────────────┘
                                     ▼
                   ┌───────────────────────────────────┐
                   │    Next.js REST API Middleware    │
                   │    • RBAC & Route Authorization   │
                   │    • Input Validation & Rate Gate │
                   └─────────────────┬─────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  Modular OCR     │       │ Biometric 3D     │       │ AML Watchlist    │
│  Pipeline        │       │ Liveness Engine  │       │ Screening Engine │
└────────┬─────────┘       └────────┬─────────┘       └────────┬─────────┘
         │                          │                          │
         └──────────────────────────┼──────────────────────────┘
                                    ▼
                   ┌───────────────────────────────────┐
                   │     Risk & TrustPath AI Core      │
                   │  • 0–100 Mathematical Scoring     │
                   │  • Positive/Risk Signal Breakdown │
                   │  • Next-Best-Action Engine        │
                   └────────────────┬──────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌───────────────────────────────────┐        ┌───────────────────────────────────┐
│     Decision Orchestrator         │        │    Immutable Compliance Ledger    │
│ • Automated Pass (&lt; 30 score)     │        │ • Write-Once Audit Records        │
│ • Human-in-the-Loop Review        │        │ • Analyst Justification Logs      │
└───────────────────────────────────┘        └───────────────────────────────────┘
```

---

## 2. Directory Layout
```
trustpilot-ai/
├── src/
│   ├── app/                         # Next.js App Router (Pages & REST endpoints)
│   │   ├── api/                     # REST API Micro-endpoints
│   │   │   ├── analytics/funnel/    # Funnel diagnostics & drop-off
│   │   │   ├── audit-logs/          # Immutable compliance ledger
│   │   │   ├── auth/login/          # Session & persona authentication
│   │   │   ├── business/            # Corporate KYB registrations
│   │   │   ├── cases/               # Review queue & case actions
│   │   │   ├── copilot/             # Grounded AI analyst assistant
│   │   │   ├── documents/verify/    # Modular OCR validation
│   │   │   ├── experiments/         # A/B testing management
│   │   │   ├── health/              # System & dependency telemetry
│   │   │   ├── liveness/verify/     # Active 3D biometrics
│   │   │   ├── onboarding/          # Customer KYC state machine
│   │   │   └── rules/               # Visual rule builder
│   │   ├── dashboard/               # Internal Operations Suite
│   │   │   ├── analytics/           # Funnel & conversion charts
│   │   │   ├── audit/               # Immutable audit log viewer
│   │   │   ├── cases/               # Case Queue & Forensic Workspace
│   │   │   ├── experiments/         # Growth A/B testing
│   │   │   ├── rules/               # Deterministic rule builder
│   │   │   └── settings/            # Risk thresholds & policies
│   │   ├── docs/                    # Live Architecture Documentation
│   │   ├── onboarding/              # Customer KYC & Corporate KYB Flows
│   │   ├── globals.css              # Design system & Tailwind directives
│   │   ├── layout.tsx               # Root layout & context wrappers
│   │   └── page.tsx                 # High-fidelity Fintech Landing Page
│   ├── components/                  # Modular React Components
│   │   ├── common/                  # Badges, Persona Switcher, Buttons
│   │   ├── copilot/                 # AI Case Copilot Modal & Drawer
│   │   ├── kyb/                     # UBO Corporate Ownership Tree
│   │   ├── landing/                 # Live Product Preview component
│   │   └── layout/                  # Navbar, Footer, Dashboard Sidebar
│   ├── context/                     # Persona & Auth Context State
│   ├── lib/                         # Core Business Logic & Adapters
│   │   ├── ai/                      # AI Case Copilot & Product Insights
│   │   ├── auth/                    # RBAC matrix & session management
│   │   ├── db/                      # Transactional memory ledger & seeds
│   │   ├── providers/               # Decoupled Mock Verification Adapters
│   │   └── risk/                    # Risk Engine & TrustPath AI Core
│   └── types/                       # Shared TypeScript Data Contracts
├── tests/                           # Vitest Unit, Workflow, & API Tests
├── docs/                            # Comprehensive Documentation Suite
├── .github/workflows/ci.yml         # CI/CD Pipeline
├── Dockerfile                       # Production Containerization
├── docker-compose.yml               # Multi-container orchestration
└── package.json
```

---

## 3. Modular Provider Pattern
Verification providers conform to strict interfaces. For production deployment, real third-party verification providers (e.g., Onfido, Jumio, Veriff, Persona, ComplyAdvantage) can be introduced simply by implementing the corresponding interface:

- `IdentityProvider`: Compares declared identity with extracted credentials.
- `DocumentProvider`: Optical blur, glare, and resolution analysis with OCR field parsing.
- `LivenessProvider`: 3D depth estimation, facial landmark verification, and anti-spoofing.
- `AMLProvider`: Screening against global sanctions (OFAC, EU, UN) and PEP lists.
