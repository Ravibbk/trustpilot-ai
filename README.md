# TrustPilot AI

**Intelligent Identity, Risk & Onboarding Platform**

A production-quality fintech platform that combines KYC, KYB, document verification, liveness checking, explainable risk scoring, AML screening, human-in-the-loop analyst review, AI case intelligence, product analytics, A/B experimentation, and role-based access control.

> **Portfolio Demonstration** — Uses modular mock provider adapters (OCR, Liveness, AML). Does not certify regulatory KYC/AML compliance without real third-party vendor credentials. The architecture is designed so real providers can be swapped in later.

Live Demo: https://trustpilot-ai.onrender.com

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Demo Credentials](#demo-credentials)
3. [Application Routes](#application-routes)
4. [Architecture](#architecture)
5. [Technology Stack](#technology-stack)
6. [Project Structure](#project-structure)
7. [AI System — TrustPath AI & Copilot](#ai-system)
8. [Risk Engine](#risk-engine)
9. [Database Schema](#database-schema)
10. [API Reference](#api-reference)
11. [Authentication & RBAC](#authentication--rbac)
12. [Environment Variables](#environment-variables)
13. [Running Tests](#running-tests)
14. [Production Build](#production-build)
15. [Docker Deployment](#docker-deployment)
16. [Vercel Deployment](#vercel-deployment)
17. [Swapping Real Providers](#swapping-real-providers)
18. [Security Architecture](#security-architecture)

---

## Quick Start

### Prerequisites

You must have the following installed before running this project:

| Requirement | Minimum Version | Check |
|---|---|---|
| Node.js | 18.x or above | `node -v` |
| npm | 9.x or above | `npm -v` |
| Git | Any recent | `git --version` |

> PostgreSQL is **not required** to run the demo. The app uses an in-memory database seeded with demo data. For production, see [Database Schema](#database-schema).

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/Ravibbk/trustpilot-ai.git
cd trustpilot-ai

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Start the development server
npm run dev
```

Then open **http://localhost:3000** in your browser.

The app comes with seed data already loaded — no database setup needed.

---

## Demo Credentials

Use the **Demo Persona Switcher** in the top bar to switch roles instantly, or log in manually using these credentials:

| Role | Email | Password | Access |
|---|---|---|---|
| Admin | admin@trustpilot-ai.com | admin123 | Full system access |
| Analyst | analyst@trustpilot-ai.com | analyst123 | Cases, risk, AML, AI Copilot |
| Product Manager | pm@trustpilot-ai.com | pm123 | Analytics, experiments, rules |
| Customer | customer@trustpilot-ai.com | customer123 | Own KYC onboarding only |
| Business | business@trustpilot-ai.com | business123 | KYB onboarding only |

---

## Application Routes

### Public

| Route | Description |
|---|---|
| `/` | Landing page |
| `/onboarding` | Customer KYC — 4-step progressive identity verification |
| `/onboarding/business` | Business KYB — corporate onboarding with UBO tree |

### Internal Dashboard

| Route | Description |
|---|---|
| `/dashboard` | Operations overview — KPI cards, recent cases, TrustPath banner |
| `/dashboard/cases` | Filterable case queue with search and status filters |
| `/dashboard/cases/[id]` | Forensic case workspace — signals, TrustPath AI, AML, copilot, decisions |
| `/dashboard/analytics` | Funnel analytics with stage drop-off and AI Product Insights |
| `/dashboard/experiments` | A/B testing engine — create and monitor experiments |
| `/dashboard/rules` | Visual rule builder — configure verification trigger conditions |
| `/dashboard/audit` | Immutable audit log viewer |
| `/dashboard/settings` | Risk threshold configuration per role |

### Demo Shortcut

Go directly to the TrustPath AI demo case:
```
http://localhost:3000/dashboard/cases/case_10492
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser Client                        │
│          Next.js 14 App Router · React · TailwindCSS        │
└───────────────────────────┬─────────────────────────────────┘
                            │  HTTP / JSON
┌───────────────────────────▼─────────────────────────────────┐
│                    Next.js API Routes                        │
│   Auth · Onboarding · Documents · Liveness · Risk · Cases   │
│   Business · Copilot · Analytics · Experiments · Rules      │
└──────┬────────────┬────────────┬────────────┬───────────────┘
       │            │            │            │
  ┌────▼───┐  ┌─────▼────┐ ┌───▼────┐ ┌────▼──────────────┐
  │ Auth   │  │  Risk    │ │  AI    │ │  Mock Providers   │
  │ RBAC   │  │  Engine  │ │ Layer  │ │  (Swappable)      │
  │ JWT    │  │  (0-100) │ │        │ │                   │
  └────────┘  └──────────┘ │TrustPath│ │ Identity Provider │
                            │  AI™   │ │ Document / OCR    │
                            │Copilot │ │ Liveness Check    │
                            └────────┘ │ AML / Sanctions   │
                                       └───────────────────┘
                                               │
                                       ┌───────▼───────┐
                                       │   In-Memory   │
                                       │   Database    │
                                       │  (MemoryDB)   │
                                       │   + Seed Data │
                                       └───────────────┘
```

### Request Flow — Customer KYC

```
Browser → POST /api/onboarding
        → State Machine (STARTED → PROFILE → DOCUMENT → LIVENESS → RISK → DECISION)
        → MockDocumentProvider (OCR + quality checks)
        → MockLivenessProvider (3D liveness + spoof)
        → MockIdentityProvider (name/DOB/address similarity)
        → RiskEngine (0-100 score + signals)
        → TrustPath AI (next-best-action recommendation)
        → Decision (APPROVED / REVIEW / REJECTED)
        → AuditLog (immutable record written)
```

### Onboarding State Machine

```
STARTED
  ↓
PROFILE_COMPLETED
  ↓
DOCUMENT_REQUIRED → DOCUMENT_UPLOADED → DOCUMENT_VERIFIED
  ↓
LIVENESS_REQUIRED → LIVENESS_VERIFIED
  ↓
RISK_ASSESSED
  ↓
DECISION_PENDING
  ↓
APPROVED / REVIEW / REJECTED
```

Sessions are persisted — if a user closes the browser, they can resume where they left off.

### Progressive Verification

The system does not request every document from every user. Verification depth scales with risk:

| Risk Level | Steps |
|---|---|
| Low | Identity → Document → Liveness → Approved |
| Medium | Identity → Document → Liveness → Additional verification → Review |
| High | Identity → Document → Risk assessment → Enhanced verification → Human review |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | TailwindCSS 3 |
| Icons | Lucide React |
| Charts | Recharts |
| Testing | Vitest |
| Validation | Zod |
| Auth | jose (JWT) + bcryptjs |
| Database | In-memory (MemoryDB) · Schema documented for PostgreSQL |
| Containerization | Docker + docker-compose |
| CI/CD | GitHub Actions |

---

## Project Structure

```
trustpilot-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout with AuthProvider
│   │   ├── globals.css
│   │   ├── onboarding/
│   │   │   ├── page.tsx                # Customer KYC (4-step)
│   │   │   └── business/page.tsx       # Business KYB
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Dashboard shell with sidebar
│   │   │   ├── page.tsx                # Operations overview
│   │   │   ├── cases/
│   │   │   │   ├── page.tsx            # Case queue
│   │   │   │   └── [id]/page.tsx       # Forensic case workspace
│   │   │   ├── analytics/page.tsx      # Funnel + experiments
│   │   │   ├── experiments/page.tsx    # A/B testing
│   │   │   ├── rules/page.tsx          # Rule builder
│   │   │   ├── audit/page.tsx          # Audit logs
│   │   │   └── settings/page.tsx       # Risk thresholds
│   │   └── api/
│   │       ├── health/route.ts
│   │       ├── auth/login/route.ts
│   │       ├── onboarding/route.ts
│   │       ├── documents/verify/route.ts
│   │       ├── liveness/verify/route.ts
│   │       ├── risk/assess/route.ts
│   │       ├── cases/route.ts
│   │       ├── cases/[id]/route.ts
│   │       ├── copilot/route.ts
│   │       ├── business/route.ts
│   │       ├── analytics/funnel/route.ts
│   │       ├── experiments/route.ts
│   │       ├── rules/route.ts
│   │       └── audit-logs/route.ts
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.tsx               # Badge, RiskBadge, StatusBadge
│   │   │   └── DemoSwitcher.tsx        # 1-click persona switcher
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardSidebar.tsx
│   │   ├── copilot/
│   │   │   └── CaseCopilotModal.tsx    # AI Copilot drawer
│   │   ├── kyb/
│   │   │   └── OwnershipTree.tsx       # Visual UBO tree
│   │   └── landing/
│   │       └── LiveProductPreview.tsx  # Interactive risk simulator
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── jwt.ts                  # AuthService (JWT)
│   │   │   └── rbac.ts                 # RBACService
│   │   ├── db/
│   │   │   ├── index.ts                # MemoryDatabase singleton
│   │   │   └── seed.ts                 # Demo data seeder
│   │   ├── risk/
│   │   │   ├── engine.ts               # Risk scoring (0-100)
│   │   │   └── trustpath.ts            # TrustPath AI recommendations
│   │   ├── ai/
│   │   │   └── copilot.ts              # AI Case Copilot
│   │   └── providers/
│   │       ├── identity.ts             # MockIdentityProvider
│   │       ├── document.ts             # MockDocumentProvider (OCR)
│   │       ├── liveness.ts             # MockLivenessProvider
│   │       └── aml.ts                  # MockAMLProvider (sanctions/PEP)
│   ├── context/
│   │   └── AuthContext.tsx             # Auth context + Demo Switcher state
│   └── types/
│       └── index.ts                    # All TypeScript contracts
├── tests/
│   ├── risk-engine.test.ts             # 4 unit tests
│   └── api-and-workflows.test.ts       # 6 integration tests
├── docs/                               # Additional documentation files
├── .env.example                        # Environment variable template
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/ci.yml            # GitHub Actions CI/CD
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## AI System

### TrustPath AI™

TrustPath AI generates a next-best-action recommendation for each case based on its signal constellation. It uses deterministic rules — not a generative model — so results are always explainable and auditable.

**Decision logic:**

| Condition | Recommendation |
|---|---|
| Score < 25 + strong identity + strong liveness | AUTO_APPROVE |
| Score 25–50 + document issues | REQUEST_ADDITIONAL_DOCS |
| Score 25–50 + address confidence low | REQUEST_ADDRESS_VERIFICATION |
| Score 50–75 + anomalies present | MANUAL_REVIEW |
| Score > 75 OR sanctions hit OR emulator detected | REJECT / ESCALATE |

**Output always includes:**
- Recommended action
- Primary reason (human-readable)
- Confidence level (HIGH / MEDIUM / LOW)
- Supporting signal list
- Contra-indicator list

### AI Case Copilot

The Copilot answers analyst questions strictly grounded in case signals. It never invents facts, never extrapolates beyond the evidence, and always cites the signal it references.

**What it can answer:**
- Why is this case flagged?
- What are the key risk signals?
- What action should I take?
- Summarise this case for a manager

**What it will refuse:**
- Questions about other cases
- Speculative judgements about intent
- Any query that requires information not in the case record

### AI Product Insights

On the Analytics page, the system generates diagnostic insights from funnel drop-off data:

- Identifies the highest-drop stage
- Flags camera failure patterns in liveness
- Surfaces A/B experiment lift results
- Suggests configuration changes with expected conversion impact

---

## Risk Engine

The Risk Engine produces an explainable score from 0 to 100.

**Score interpretation:**

| Range | Level | Default Action |
|---|---|---|
| 0–24 | LOW | Auto-approve |
| 25–49 | MEDIUM | Additional verification |
| 50–74 | HIGH | Human review required |
| 75–100 | CRITICAL | Reject / Escalate |

**Signal categories:**

| Category | Examples |
|---|---|
| Identity | Name match %, DOB match, document number |
| Document | OCR confidence, blur, crop, expiry, duplicate |
| Liveness | 3D liveness pass/fail, spoof detection, face match |
| Behavioural | Device emulator flag, VPN/proxy, velocity |
| AML | PEP hit, sanctions hit, jurisdiction risk |
| Consistency | Cross-document name mismatch, address variance |

Each signal contributes a delta to the base score with a reason code and confidence percentage. The decomposition is stored and shown to analysts.

---

## Database Schema

The in-memory database mirrors a PostgreSQL schema. For production, run migrations using the schema below.

### Core Tables

```sql
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,  -- CUSTOMER | BUSINESS_USER | ANALYST | PRODUCT_MANAGER | ADMIN
  created_at TIMESTAMPTZ DEFAULT now()
)

customers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  full_name TEXT,
  date_of_birth DATE,
  nationality TEXT,
  address JSONB,
  status TEXT,  -- PENDING | APPROVED | REJECTED | REVIEW
  created_at TIMESTAMPTZ DEFAULT now()
)

onboarding_sessions (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  status TEXT,  -- State machine status
  current_step TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)

documents (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  session_id UUID REFERENCES onboarding_sessions(id),
  type TEXT,  -- PASSPORT | DRIVERS_LICENSE | NATIONAL_ID
  storage_key TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

document_extractions (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  extracted_name TEXT,
  extracted_dob DATE,
  extracted_document_number TEXT,
  extracted_expiry DATE,
  extracted_address TEXT,
  confidence_scores JSONB,  -- { name: 98, dob: 97, address: 84 }
  ocr_provider TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

liveness_checks (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  session_id UUID REFERENCES onboarding_sessions(id),
  status TEXT,  -- PASSED | FAILED | REVIEW
  liveness_score NUMERIC,
  face_match_score NUMERIC,
  spoof_detected BOOLEAN,
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

risk_assessments (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  session_id UUID REFERENCES onboarding_sessions(id),
  score INTEGER,  -- 0-100
  level TEXT,  -- LOW | MEDIUM | HIGH | CRITICAL
  signals JSONB,
  trustpath_recommendation JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
)

aml_assessments (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  sanctions_hit BOOLEAN,
  pep_hit BOOLEAN,
  hit_lists TEXT[],
  jurisdiction_risk TEXT,
  screened_at TIMESTAMPTZ DEFAULT now()
)

cases (
  id TEXT PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  status TEXT,  -- OPEN | PENDING | APPROVED | REJECTED | ESCALATED
  priority TEXT,  -- LOW | MEDIUM | HIGH | URGENT
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)

case_actions (
  id UUID PRIMARY KEY,
  case_id TEXT REFERENCES cases(id),
  analyst_id UUID REFERENCES users(id),
  action TEXT,  -- APPROVE | REJECT | ESCALATE | REQUEST_INFO | NOTE
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

audit_logs (
  id UUID PRIMARY KEY,
  actor_id UUID REFERENCES users(id),
  action TEXT,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

experiments (
  id UUID PRIMARY KEY,
  name TEXT,
  hypothesis TEXT,
  status TEXT,  -- DRAFT | RUNNING | PAUSED | COMPLETED
  variant_a JSONB,
  variant_b JSONB,
  traffic_split INTEGER,  -- percent to variant B
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
)

system_rules (
  id UUID PRIMARY KEY,
  name TEXT,
  condition JSONB,
  action TEXT,
  threshold NUMERIC,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

---

## API Reference

All endpoints are under `/api`. All responses follow:

```json
{
  "success": true | false,
  "data": {},
  "error": "Human-readable error message"
}
```

### Health

```
GET /api/health
→ 200 { status: "ok", timestamp, services: { database, auth, risk_engine, ai } }
```

### Authentication

```
POST /api/auth/login
Body: { email: string, password: string }
→ 200 { token: string, user: { id, email, role, name } }
→ 401 Invalid credentials
```

### Onboarding (KYC State Machine)

```
POST /api/onboarding
Headers: Authorization: Bearer <token>
Body: { action: "start" | "submit_profile" | "submit_document" | ... , data: {} }
→ 200 { session, nextStep, status }
```

### Document Verification

```
POST /api/documents/verify
Headers: Authorization: Bearer <token>
Body: { documentType: string, imageData: string (base64 or filename) }
→ 200 {
    status: "verified" | "failed" | "review",
    extraction: { name, dob, documentNumber, expiry, address },
    confidence: { name: 98, dob: 97, address: 84 },
    qualityIssues: []
  }
```

### Liveness Verification

```
POST /api/liveness/verify
Headers: Authorization: Bearer <token>
Body: { sessionId: string, attempt: number }
→ 200 { status: "passed" | "failed" | "review", livenessScore, faceMatchScore, spoofDetected }
```

### Risk Assessment

```
POST /api/risk/assess
Headers: Authorization: Bearer <token>
Body: { customerId, sessionId, signals: {} }
→ 200 { score: 0-100, level: "LOW"|"MEDIUM"|"HIGH"|"CRITICAL", signals: [], trustpath: {} }
```

### Cases

```
GET /api/cases
Headers: Authorization: Bearer <token>
Query: ?status=OPEN&priority=HIGH&search=john
→ 200 { cases: [], total }

GET /api/cases/:id
Headers: Authorization: Bearer <token>
→ 200 { case, customer, signals, riskAssessment, aml, documents, timeline }

POST /api/cases/:id
Headers: Authorization: Bearer <token>
Body: { action: "approve"|"reject"|"escalate"|"request_info"|"note", reason: string }
→ 200 { case, auditEntry }
```

### AI Copilot

```
POST /api/copilot
Headers: Authorization: Bearer <token>
Body: { caseId: string, query: string, mode: "case_query" | "product_insights" }
→ 200 { response: string, citations: [], confidence: "HIGH"|"MEDIUM"|"LOW" }
```

### Business KYB

```
POST /api/business
Headers: Authorization: Bearer <token>
Body: { companyName, registrationNumber, taxId, address, directors: [], beneficialOwners: [] }
→ 200 { businessId, status, riskAssessment }
```

### Analytics

```
GET /api/analytics/funnel
Headers: Authorization: Bearer <token>
→ 200 { overview: { total, approved, rejected, review }, funnelSteps: [], aiInsights: [] }
```

### Experiments

```
GET /api/experiments
Headers: Authorization: Bearer <token>
→ 200 { experiments: [] }

POST /api/experiments
Headers: Authorization: Bearer <token>
Body: { name, hypothesis, variantA, variantB, trafficSplit }
→ 201 { experiment }
```

### Rules

```
GET /api/rules
Headers: Authorization: Bearer <token>
→ 200 { rules: [] }

POST /api/rules
Headers: Authorization: Bearer <token>
Body: { name, condition, action, threshold }
→ 201 { rule }
```

### Audit Logs

```
GET /api/audit-logs
Headers: Authorization: Bearer <token>
Query: ?entityType=case&limit=50
→ 200 { logs: [], total }
```

---

## Authentication & RBAC

### Roles & Permissions

| Role | Onboarding | Cases | Analytics | Rules | Audit | Settings | Users |
|---|---|---|---|---|---|---|---|
| CUSTOMER | Own only | — | — | — | — | — | — |
| BUSINESS_USER | Own KYB | — | — | — | — | — | — |
| ANALYST | — | ✅ Full | Read | — | Read | — | — |
| PRODUCT_MANAGER | — | Read | ✅ Full | ✅ Full | Read | Partial | — |
| ADMIN | — | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |

### How it works

1. `POST /api/auth/login` returns a signed JWT
2. All protected routes check `Authorization: Bearer <token>` header
3. `RBACService.hasPermission(role, resource, action)` enforces access at the API route level
4. Frontend role gates are supplementary — backend always enforces

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

```env
# Required
JWT_SECRET=your-secret-key-minimum-32-characters

# Optional — defaults shown
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Real provider keys (leave blank for mock mode)
IDENTITY_PROVIDER_API_KEY=
DOCUMENT_PROVIDER_API_KEY=
LIVENESS_PROVIDER_API_KEY=
AML_PROVIDER_API_KEY=

# PostgreSQL (leave blank for in-memory demo mode)
DATABASE_URL=
```

**JWT_SECRET** must be at least 32 characters. Use a random generator:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Running Tests

```bash
npm test
# or verbose output:
npx vitest run --reporter=verbose
```

**Test results:**

```
✓ tests/risk-engine.test.ts (4 tests)
  ✓ should score clean documents and authentic liveness as Low Risk
  ✓ should flag duplicate identity and emulator as Critical Risk
  ✓ should recommend address verification when identity is authentic but address confidence is low
  ✓ should accurately compare declared identity with extracted credentials

✓ tests/api-and-workflows.test.ts (6 tests)
  ✓ should validate and extract fields from clear passport uploads
  ✓ should detect blur and generate human-friendly remediation
  ✓ should pass authentic active liveness challenges and reject spoofing attempts
  ✓ should screen watchlists and identify PEP and Sanctions hits
  ✓ should answer case queries strictly grounded in case signals
  ✓ should update case status, enforce audit logging, and mirror linked customer status

Test Files: 2 passed | Tests: 10 passed
```

---

## Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

The build produces 27 optimised static and dynamic routes. Expected output:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (27/27)
```

---

## Docker Deployment

### Using docker-compose (recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop
docker-compose down
```

Access the app at **http://localhost:3000**

### Manual Docker

```bash
# Build image
docker build -t trustpilot-ai .

# Run container
docker run -p 3000:3000 --env-file .env trustpilot-ai
```

### docker-compose services

The `docker-compose.yml` includes:
- `app` — Next.js application (port 3000)
- `db` — PostgreSQL 15 (port 5432) — connect via `DATABASE_URL` in `.env`

---

## Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

**Required environment variables in Vercel dashboard:**

| Variable | Value |
|---|---|
| `JWT_SECRET` | Random 32+ character string |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL |

---

## Swapping Real Providers

The mock providers implement clean interfaces. Replace them with real vendor SDKs without changing any other code.

### Identity Provider

**File:** `src/lib/providers/identity.ts`

Replace `MockIdentityProvider` with a real vendor such as [Onfido](https://onfido.com) or [Jumio](https://jumio.com).

The interface:
```typescript
interface IdentityProvider {
  compareIdentity(declared: DeclaredIdentity, extracted: ExtractedIdentity): Promise<IdentityMatchResult>
}
```

### Document / OCR Provider

**File:** `src/lib/providers/document.ts`

Replace with [Google Document AI](https://cloud.google.com/document-ai), [AWS Textract](https://aws.amazon.com/textract/), or [Mindee](https://mindee.com).

The interface:
```typescript
interface DocumentProvider {
  verify(input: DocumentVerificationInput): Promise<DocumentVerificationResult>
}
```

### Liveness Provider

**File:** `src/lib/providers/liveness.ts`

Replace with [iProov](https://iproov.com), [Onfido Motion](https://onfido.com), or [FaceX](https://facex.io).

The interface:
```typescript
interface LivenessProvider {
  check(input: LivenessCheckInput): Promise<LivenessCheckResult>
}
```

### AML Provider

**File:** `src/lib/providers/aml.ts`

Replace with [ComplyAdvantage](https://complyadvantage.com), [LexisNexis](https://risk.lexisnexis.com), or [Refinitiv](https://www.refinitiv.com/worldcheck).

The interface:
```typescript
interface AMLProvider {
  screen(input: AMLScreeningInput): Promise<AMLAssessmentResult>
}
```

---

## Security Architecture

### Transport

- TLS 1.3 enforced for all traffic in production
- HSTS headers set via Next.js response headers configuration

### Authentication

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens signed with HS256, 24-hour expiry
- Tokens stored in memory / httpOnly cookies — never localStorage

### Access Control

- RBAC enforced at API route level on every request
- Frontend role guards are supplementary, never the only control
- Customers can only access their own onboarding session

### Data Protection

- PII fields (name, DOB, document numbers) are masked in audit logs
- Document images stored by reference key only — raw bytes not in database
- No sensitive fields returned in list endpoints — detail endpoints only

### Audit Logging

- Every case decision, rule change, and login event is written to the immutable audit ledger
- Logs include: actor, action, entity, timestamp, IP address
- Logs cannot be modified or deleted through any application endpoint

### Threat Model

| Threat | Mitigation |
|---|---|
| Account takeover | bcrypt passwords, JWT expiry, failed login throttling |
| Privilege escalation | RBAC at API layer, no client-controlled role claims |
| Analyst data exfiltration | Audit logs, PII masking, role-scoped queries |
| Synthetic identity | Multi-signal cross-checking, liveness, AML screening |
| Emulator / bot fraud | Device signal detection in risk engine |
| Injection | Zod schema validation on all API inputs |

---

## CI/CD Pipeline

The `.github/workflows/ci.yml` pipeline runs on every push and pull request:

```
Install dependencies
  ↓
TypeScript type check (tsc --noEmit)
  ↓
Lint (next lint)
  ↓
Unit + integration tests (vitest run)
  ↓
Production build (next build)
```

All steps must pass for a merge to `main`.
