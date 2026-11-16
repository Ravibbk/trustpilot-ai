'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Shield,
  Layers,
  Cpu,
  Lock,
  Database,
  ExternalLink,
  ChevronRight,
  Code2,
  Sparkles,
} from 'lucide-react';

export default function PlatformDocsPage() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'ai' | 'security' | 'api' | 'demo'>('architecture');

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 font-mono">
              System Engineering & Specifications
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Platform Architecture & PRD</h1>
            <p className="text-xs text-slate-500 mt-1">
              Production-oriented design documentation for TrustPilot AI.
            </p>
          </div>
          <a
            href="https://www.github.com/Ravibbk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>GitHub Profile (@Ravibbk)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
          {[
            { id: 'architecture', label: '1. Architecture & Stack', icon: Layers },
            { id: 'ai', label: '2. TrustPath & AI Guardrails', icon: Sparkles },
            { id: 'security', label: '3. Security & RBAC', icon: Lock },
            { id: 'api', label: '4. REST API Spec', icon: Code2 },
            { id: 'demo', label: '5. Demo Presentation Script', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: ARCHITECTURE & STACK */}
        {activeTab === 'architecture' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed animate-in fade-in">
            <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              System Architecture & Technology Choices
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-xs">Full-Stack Framework</h3>
                <p>
                  Built on <strong>Next.js 14 App Router</strong> with TypeScript, Tailwind CSS, Lucide icons, and Recharts. Combines edge performance, zero-waterfall server rendering, and deterministic REST micro-endpoints.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-xs">Modular Provider Adapters</h3>
                <p>
                  Zero vendor lock-in. Verification providers are decoupled behind clean interfaces:
                  <code className="block mt-1 font-mono text-[11px] text-brand-700">
                    MockIdentityProvider, MockDocumentProvider, MockLivenessProvider, MockAMLProvider
                  </code>
                </p>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 text-sm pt-4">Data Flow Hierarchy</h3>
            <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto">
{`Client Applications (Customer KYC / Corporate KYB)
         │
         ▼
Next.js REST API Layer (/api/onboarding, /api/documents, /api/liveness)
         │
         ├─► Modular OCR Service (Field confidence, blur/glare optical checks)
         ├─► Biometric Liveness Engine (3D depth, anti-spoof analysis)
         ├─► AML Watchlist Provider (OFAC, EU, UN, PEP Screening)
         │
         ▼
Risk Engine & TrustPath AI (0–100 mathematical risk scoring & next-best-action)
         │
         ▼
Decision Orchestration (Instant automated pass OR Human-in-the-Loop review)
         │
         ▼
Immutable Audit Ledger & Real-Time Product Analytics`}
            </pre>
          </div>
        )}

        {/* TAB 2: TRUSTPATH & AI GUARDRAILS */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed animate-in fade-in">
            <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              TrustPath AI™ & Safety Guardrails
            </h2>

            <div className="p-4 bg-brand-50/70 border border-brand-200 rounded-xl space-y-2">
              <h3 className="font-bold text-brand-900 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" /> Signature Feature Principle
              </h3>
              <p className="text-brand-950">
                Critical fintech decisions are <strong>never</strong> left to uncontrolled, black-box LLM hallucinations. TrustPilot AI couples deterministic mathematical rules for irreversible decisions with AI assistance for summarization, evidence citation, and next-best-action routing.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Key Safety Guardrails:</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>Grounded Case Copilot:</strong> The AI analyst assistant responds strictly citing verified facts present in the case dossier (OCR text, biometrics, timeline).
                </li>
                <li>
                  <strong>Explainable Risk Signals:</strong> Every risk score (0-100) displays exact positive (+) and negative (-) weights alongside physical evidence citations.
                </li>
                <li>
                  <strong>Mandatory Human Decision Rationale:</strong> Overriding an AI recommendation or rejecting an applicant requires a substantive justification stored in the immutable audit log.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & RBAC */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed animate-in fade-in">
            <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              Security & Role-Based Access Control (RBAC)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">User Role</th>
                    <th className="p-3">Permitted Scope</th>
                    <th className="p-3">Enforcement Layer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">CUSTOMER</td>
                    <td className="p-3">Own onboarding progression and document upload only</td>
                    <td className="p-3 font-mono text-[11px] text-brand-700">Client + Server /api/onboarding</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">BUSINESS_USER</td>
                    <td className="p-3">Corporate KYB registration, directors, and UBO tree</td>
                    <td className="p-3 font-mono text-[11px] text-brand-700">Client + Server /api/business</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">ANALYST</td>
                    <td className="p-3">Full case review queue, fraud timeline, AML evaluation, and AI Copilot</td>
                    <td className="p-3 font-mono text-[11px] text-brand-700">Role guard on /api/cases</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">PRODUCT_MANAGER</td>
                    <td className="p-3">Onboarding funnel metrics, A/B experiments, and AI Product Insights</td>
                    <td className="p-3 font-mono text-[11px] text-brand-700">Role guard on /api/analytics</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">ADMIN</td>
                    <td className="p-3">Full platform administration, rule builder, and immutable audit logs</td>
                    <td className="p-3 font-mono text-[11px] text-brand-700">Global Admin permissions</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">PII Data Masking & Redaction</h4>
              <p>
                In compliance with global data privacy best practices (GDPR / CCPA / DPDP), national identification numbers and full email addresses are masked by default on internal queues. Analysts can toggle reveal mode on demand with audit event tracking.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: REST API SPEC */}
        {activeTab === 'api' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed animate-in fade-in">
            <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              RESTful API Specification
            </h2>

            <div className="space-y-4">
              {[
                { method: 'GET', endpoint: '/api/health', desc: 'System health check and dependency status' },
                { method: 'POST', endpoint: '/api/onboarding', desc: 'Initialize or update customer KYC profile' },
                { method: 'POST', endpoint: '/api/documents/verify', desc: 'OCR parsing, optical quality check & field confidence' },
                { method: 'POST', endpoint: '/api/liveness/verify', desc: 'Execute active 3D biometric anti-spoof challenge' },
                { method: 'POST', endpoint: '/api/risk/assess', desc: '0-100 risk scoring & TrustPath recommendation' },
                { method: 'GET', endpoint: '/api/cases', desc: 'Query compliance review queue with filters' },
                { method: 'POST', endpoint: '/api/cases/[id]', desc: 'Record analyst decision with mandatory justification' },
                { method: 'POST', endpoint: '/api/copilot', desc: 'AI Case Copilot & AI Product Insights' },
                { method: 'GET', endpoint: '/api/analytics/funnel', desc: 'Funnel drop-off and stage conversion metrics' },
                { method: 'GET / POST', endpoint: '/api/rules', desc: 'Retrieve or define system deterministic rules' },
                { method: 'GET', endpoint: '/api/audit-logs', desc: 'Query immutable compliance audit ledger' },
              ].map((api, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-4">
                  <span className="font-mono font-bold text-brand-700 bg-white border border-brand-200 px-2 py-0.5 rounded text-[11px] flex-shrink-0">
                    {api.method}
                  </span>
                  <div className="flex-1">
                    <span className="font-mono text-slate-900 font-bold">{api.endpoint}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{api.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DEMO PRESENTATION SCRIPT */}
        {activeTab === 'demo' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed animate-in fade-in">
            <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              5-Minute Product Demonstration Walkthrough (Section 76 & 77)
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  Minute 1: The Product Vision & Landing Page
                </span>
                <p>
                  Start on the Landing Page. Highlight the core principle: "Reduce unnecessary friction for legitimate users while increasing scrutiny for genuinely risky cases." Interact with the Live Product Preview, switching between Legitimate User and Borderline Discrepancy.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  Minute 2: Customer KYC Experience
                </span>
                <p>
                  Navigate to Customer KYC Onboarding (`/onboarding`). Fill profile, simulate document upload (showing blur detection remediation), run biometric liveness challenge, and demonstrate instant automated approval under 90 seconds.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  Minute 3: Signature Feature — TrustPath AI in Analyst Review
                </span>
                <p>
                  Switch demo persona to <strong>Compliance Analyst</strong>. Open Case 10492 (Rahul Kumar). Show the explainable risk breakdown: Passport is authentic (94%) and liveness passed (96%), but address variance flagged the case. Show TrustPath AI recommending an automated proof of address request, avoiding manual rejection.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  Minute 4: AI Case Copilot & Immutable Audit Logs
                </span>
                <p>
                  Click "AI Copilot" inside Case 10492. Click "Why was this customer flagged?" and "Summarize this case". Demonstrate grounded responses. Approve or override with a note, then navigate to Audit Logs (`/dashboard/audit`) to prove the immutable ledger entry.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  Minute 5: Product Funnel Analytics & A/B Experiments
                </span>
                <p>
                  Switch persona to <strong>Product Manager</strong>. Visit `/dashboard/analytics` to view the stage-by-stage onboarding funnel drop-offs and AI Product Insights. Open `/dashboard/experiments` to view the +10.7% conversion lift from progressive onboarding.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
