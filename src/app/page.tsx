import React from 'react';
import Link from 'next/link';
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Zap,
  Users,
  Building,
  BarChart3,
  Search,
  Scale,
  FileCheck,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { LiveProductPreview } from '@/components/landing/LiveProductPreview';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-brand-50/40 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span>Next-Generation Fintech Trust & Safety Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Trust every onboarding decision.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            AI-powered identity verification, risk intelligence, and human review workflows designed to help businesses onboard legitimate customers faster and investigate risky cases with confidence.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <span>Start Verification</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/cases"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm transition-all"
            >
              <span>Explore Platform</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Trust Principles Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Explainable Risk Scoring (0–100)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> TrustPath AI™ Next Best Action
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Human-In-The-Loop Review
            </span>
          </div>

          {/* Visual Interactive Product Preview */}
          <div className="mt-14 max-w-5xl mx-auto">
            <LiveProductPreview />
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM & SOLUTION */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">The Problem</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                The traditional onboarding dilemma: friction vs fraud.
              </h2>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                Most onboarding pipelines force a binary trade-off. They either bombard every user with intrusive checks—causing high drop-off and lost customer lifetime value—or they automate blindly with black-box models, leaving platforms vulnerable to synthetic identity theft, emulator rings, and regulatory fines.
              </p>
              <div className="mt-6 space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-rose-950">Indiscriminate Friction:</strong> Asking 100% of applicants for 5 verification steps repels genuine customers.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-rose-950">Black-Box Rejections:</strong> Rejecting applicants on unexplained scores creates compliance liabilities and frustrates users.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">The TrustPilot Solution</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                Risk-based adaptive workflows.
              </h3>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                TrustPilot AI adjusts scrutiny dynamically based on real-time signal confidence. Clean users experience instant pass-through; borderline discrepancies trigger targeted self-service remediations; genuinely suspicious patterns route immediately to experienced analysts.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 text-center">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-2xl font-extrabold text-brand-600">&lt; 90s</p>
                  <p className="text-[11px] text-slate-500 mt-1">Legitimate Pass Time</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-2xl font-extrabold text-emerald-600">-72%</p>
                  <p className="text-[11px] text-slate-500 mt-1">Manual Review Churn</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-2xl font-extrabold text-slate-900">100%</p>
                  <p className="text-[11px] text-slate-500 mt-1">Audit Trail Coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE CAPABILITIES (KYC, KYB, RISK, HUMAN-IN-THE-LOOP) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Unified Architecture</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
              Built for the full lifecycle of trust.
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Modular verification engines working in harmony across consumers, businesses, and internal compliance operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Customer KYC */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Progressive Customer KYC</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Modular OCR field extraction (Name 98%, DOB 97%, Address 84%), optical blur/glare checks, and active 3D biometric liveness challenges.
                </p>
              </div>
              <Link
                href="/onboarding"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 pt-4 border-t border-slate-100"
              >
                <span>Launch KYC Onboarding</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Business KYB */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Corporate KYB & UBO Trees</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Entity registration validation, executive directors registry, and interactive visual ultimate beneficial ownership (UBO) relationship mapping.
                </p>
              </div>
              <Link
                href="/onboarding/business"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 pt-4 border-t border-slate-100"
              >
                <span>Launch KYB Flow</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: Human Review & Copilot */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Human-In-The-Loop Workspace</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Analyst case management with fraud timeline, AML watchlist screening, TrustPath AI recommendations, and interactive AI Case Copilot.
                </p>
              </div>
              <Link
                href="/dashboard/cases"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 pt-4 border-t border-slate-100"
              >
                <span>Explore Analyst Queue</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT ANALYTICS & EXPERIMENTATION */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Product Manager Intelligence</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                Diagnose drop-offs. Optimize conversion.
              </h2>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                Track full funnel metrics from initiation through OCR and liveness to decision. Built-in A/B experimentation allows growth and risk teams to measure conversion lifts without engineering redeployments.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <BarChart3 className="w-4 h-4 text-brand-600" />
                  <span>Granular stage-by-stage drop-off diagnostic metrics</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <Zap className="w-4 h-4 text-brand-600" />
                  <span>A/B test progressive disclosure vs traditional forms (+10.7% lift)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>AI Product Insights highlighting camera failure patterns</span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/dashboard/analytics"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                >
                  <span>View Funnel Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Funnel Preview Graphic */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">Live Funnel Throughput</span>
                <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  60.9% Overall Conversion
                </span>
              </div>
              {[
                { step: 'Started Onboarding', count: '12,450', pct: '100%', drop: '0%' },
                { step: 'Profile & Identity', count: '11,520', pct: '92.5%', drop: '7.5%' },
                { step: 'Document Upload & OCR', count: '9,840', pct: '85.4%', drop: '14.6%' },
                { step: 'Biometric Liveness', count: '8,310', pct: '84.4%', drop: '15.6%' },
                { step: 'Approved Customer', count: '7,580', pct: '94.5%', drop: '5.5%' },
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{s.step}</span>
                  <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                    <span>{s.count} users</span>
                    <span className="font-semibold text-slate-900">{s.pct}</span>
                    <span className="text-rose-600">-{s.drop}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-brand-600 mx-auto flex items-center justify-center text-white shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to experience intelligent fintech onboarding?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Test the live customer journey, inspect analyst investigation cases, and explore explainable risk models immediately.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-sm"
            >
              <span>Test Customer KYC Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/cases/case_10492"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
            >
              <span>Open Flagged Case (TrustPath Demo)</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

