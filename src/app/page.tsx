import React from 'react';
import Link from 'next/link';
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Lock,
  Users,
  Building,
  BarChart3,
  Search,
  FileCheck,
  ChevronRight,
  ShieldAlert,
  Zap,
  Eye,
  Bot,
  ClipboardList,
} from 'lucide-react';
import { LiveProductPreview } from '@/components/landing/LiveProductPreview';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="pt-14 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Fintech Trust & Safety Platform — Portfolio Demo</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Trust every onboarding decision.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            AI-powered identity verification, risk intelligence, and human review workflows — built to onboard legitimate customers faster and investigate risky cases with confidence.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
            >
              Start Verification
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/cases"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 transition-colors"
            >
              Explore Dashboard
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Explainable Risk Scoring (0–100)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              TrustPath AI™ Next Best Action
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Human-In-The-Loop Review
            </span>
          </div>

          {/* Live Product Preview */}
          <div className="mt-14 max-w-5xl mx-auto">
            <LiveProductPreview />
          </div>
        </div>
      </section>

      {/* ─── PROBLEM / SOLUTION ───────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">The Problem</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                The friction-vs-fraud trade-off.
              </h2>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                Most onboarding pipelines force a binary choice: bombard every user with intrusive checks (high drop-off) or automate blindly with black-box models (fraud exposure and compliance risk).
              </p>
              <div className="mt-5 space-y-2.5">
                {[
                  'Indiscriminate friction repels legitimate customers',
                  'Unexplained rejections create compliance liability',
                  'Manual review queues overflow with low-quality signals',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-7">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">The Solution</span>
              <h3 className="text-xl font-bold text-slate-900 mt-2 tracking-tight">
                Risk-based adaptive workflows.
              </h3>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                TrustPilot AI adjusts verification depth dynamically. Clean signals get instant pass-through. Borderline cases trigger targeted self-service remediations. Suspicious patterns route to analysts with full evidence context.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 pt-5 border-t border-slate-200 text-center">
                {[
                  { stat: '< 90s', label: 'Clean pass time' },
                  { stat: '−72%', label: 'Manual review load' },
                  { stat: '100%', label: 'Audit coverage' },
                ].map((m, i) => (
                  <div key={i} className="bg-white rounded-lg border border-slate-200 py-3 px-2">
                    <p className="text-xl font-bold text-slate-900">{m.stat}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CORE MODULES ─────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Modules</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
              Built for the full trust lifecycle.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Modular verification engines working in harmony across consumers, businesses, and internal compliance teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Customer KYC',
                desc: 'Progressive 4-step onboarding with OCR field extraction (Name 98%, DOB 97%), blur/glare detection, and active biometric liveness challenges.',
                href: '/onboarding',
                cta: 'Launch KYC',
              },
              {
                icon: Building,
                title: 'Business KYB',
                desc: 'Entity registration validation, executive director registry, and interactive UBO ownership tree with beneficial owner mapping.',
                href: '/onboarding/business',
                cta: 'Launch KYB',
              },
              {
                icon: Shield,
                title: 'Analyst Review',
                desc: 'Forensic case workspace with TrustPath AI next-best-action, full signal evidence, AML screening results, and AI case summaries.',
                href: '/dashboard/cases',
                cta: 'Open Cases',
              },
              {
                icon: Search,
                title: 'Risk Engine',
                desc: 'Mathematical 0–100 explainable scoring with positive and risk signal decomposition. Device emulator, VPN, and velocity detection.',
                href: '/dashboard/cases/case_10492',
                cta: 'View Demo Case',
              },
              {
                icon: FileCheck,
                title: 'AML Screening',
                desc: 'Mock OFAC, UN, and EU sanctions list screening plus PEP detection with jurisdiction risk flags and watchlist hit reasons.',
                href: '/dashboard/cases/case_10492',
                cta: 'See AML Results',
              },
              {
                icon: Bot,
                title: 'AI Case Copilot',
                desc: 'Grounded analyst assistant that answers case queries using only verified signal data. Zero hallucination — strictly evidence-bound.',
                href: '/dashboard/cases/case_10492',
                cta: 'Try Copilot',
              },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
                <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center mb-4">
                  <m.icon className="w-4.5 h-4.5 text-slate-600 w-[18px] h-[18px]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{m.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed flex-1">{m.desc}</p>
                <Link
                  href={m.href}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-100"
                >
                  {m.cta}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUSTPATH AI ─────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">TrustPath AI™</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                Next-best-action intelligence for every case.
              </h2>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                TrustPath AI analyzes each case's signal constellation and generates a prioritized, explainable recommendation — not a black-box score. Analysts see exactly why a recommendation was made.
              </p>
              <div className="mt-5 space-y-2.5">
                {[
                  { icon: Zap, text: 'Auto-approve clean, low-risk sessions instantly' },
                  { icon: Eye, text: 'Route borderline cases with targeted evidence requests' },
                  { icon: ClipboardList, text: 'Escalate suspicious cases with pre-populated analyst dossiers' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-600">
                    <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/dashboard/cases/case_10492"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                >
                  Open TrustPath Demo Case
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* TrustPath signal card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-700">TrustPath AI — Case #10492</span>
                <span className="text-[11px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                  REVIEW RECOMMENDED
                </span>
              </div>
              {[
                { label: 'Identity Match', val: '97%', pos: true },
                { label: 'Liveness Score', val: 'PASS', pos: true },
                { label: 'AML Screening', val: 'PEP HIT', pos: false },
                { label: 'Device Signal', val: 'Emulator detected', pos: false },
                { label: 'Overall Risk Score', val: '72 / 100', pos: false },
              ].map((row, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between text-xs">
                  <span className="text-slate-600">{row.label}</span>
                  <span className={`font-semibold font-mono ${row.pos ? 'text-emerald-600' : 'text-amber-700'}`}>
                    {row.val}
                  </span>
                </div>
              ))}
              <div className="pt-2 text-[11px] text-slate-400">
                Next Action: Request proof of address · Escalate to L2 analyst
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ANALYTICS ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Funnel table */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-700">Onboarding Funnel</span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  60.9% Overall Conversion
                </span>
              </div>
              {[
                { step: 'Started Onboarding', count: '12,450', pct: '100%', drop: '—' },
                { step: 'Profile & Identity', count: '11,520', pct: '92.5%', drop: '−7.5%' },
                { step: 'Document Upload & OCR', count: '9,840', pct: '85.4%', drop: '−14.6%' },
                { step: 'Biometric Liveness', count: '8,310', pct: '84.4%', drop: '−15.6%' },
                { step: 'Approved', count: '7,580', pct: '94.5%', drop: '−5.5%' },
              ].map((s, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between text-xs">
                  <span className="text-slate-600">{s.step}</span>
                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span className="text-slate-400">{s.count}</span>
                    <span className="font-semibold text-slate-900">{s.pct}</span>
                    <span className="text-slate-400">{s.drop}</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Product Analytics</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                Measure, diagnose, and improve.
              </h2>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                Stage-by-stage drop-off analysis, A/B experiment results, and AI-generated product insights give product and risk teams a shared view of the onboarding funnel.
              </p>
              <div className="mt-5 space-y-2">
                {[
                  'Granular stage-by-stage drop-off metrics',
                  'A/B test progressive disclosure vs traditional forms',
                  'AI Product Insights flagging camera failure patterns',
                  'Configurable rule builder without deployments',
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/dashboard/analytics"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                >
                  View Funnel Analytics
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECURITY ──────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security Architecture</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
              Designed with security at every layer.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Lock, title: 'TLS 1.3', desc: 'All traffic encrypted in transit' },
              { icon: Shield, title: 'RBAC', desc: '5-role permission enforcement at API level' },
              { icon: FileCheck, title: 'Audit Trail', desc: 'Immutable ledger for every decision' },
              { icon: Eye, title: 'PII Redaction', desc: 'Sensitive fields masked in all logs' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center mb-3">
                  <s.icon className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-xs font-semibold text-slate-900">{s.title}</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-11 h-11 rounded-xl bg-blue-600 mx-auto flex items-center justify-center mb-5">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to explore?
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mt-3 leading-relaxed">
            Run through the customer KYC journey, inspect flagged analyst cases, or explore explainable risk intelligence — all in the live demo.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              Test Customer KYC
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/cases/case_10492"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
            >
              Open Flagged Case (TrustPath Demo)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
