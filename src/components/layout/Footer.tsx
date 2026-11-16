import React from 'react';
import Link from 'next/link';
import { Shield, Lock, FileText, ExternalLink, Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">TrustPilot AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Intelligent identity verification, risk intelligence, and human-in-the-loop review architecture for modern fintech applications.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-400 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 / AES-256 PII Redaction Pattern</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Core Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/onboarding" className="hover:text-white transition-colors">Customer KYC Flow</Link></li>
              <li><Link href="/onboarding/business" className="hover:text-white transition-colors">Business KYB & UBO Tree</Link></li>
              <li><Link href="/dashboard/cases" className="hover:text-white transition-colors">Analyst Review Workspace</Link></li>
              <li><Link href="/dashboard/cases/case_10492" className="hover:text-white transition-colors">TrustPath AI Demo Case</Link></li>
              <li><Link href="/dashboard/analytics" className="hover:text-white transition-colors">Funnel & Drop-off Analytics</Link></li>
            </ul>
          </div>

          {/* Compliance & Intelligence */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Intelligence & Ops</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard/rules" className="hover:text-white transition-colors">Configurable Rule Builder</Link></li>
              <li><Link href="/dashboard/experiments" className="hover:text-white transition-colors">A/B Testing Experiments</Link></li>
              <li><Link href="/dashboard/audit" className="hover:text-white transition-colors">Immutable Audit Logs</Link></li>
              <li><Link href="/dashboard/settings" className="hover:text-white transition-colors">Risk Threshold Settings</Link></li>
              <li><Link href="/api/health" target="_blank" className="hover:text-white transition-colors inline-flex items-center gap-1">API Health Status <ExternalLink className="w-3 h-3" /></Link></li>
            </ul>
          </div>

          {/* Engineering & Docs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Engineering & Docs</h4>
            <ul className="space-y-2">
              <li><Link href="/docs" className="hover:text-white transition-colors inline-flex items-center gap-1"><FileText className="w-3 h-3" /> Architecture & PRD</Link></li>
              <li><a href="https://www.github.com/Ravibbk" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">Developer GitHub (@Ravibbk) <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
            <div className="mt-4 p-3 bg-slate-800/80 rounded-lg border border-slate-750">
              <p className="text-[11px] text-slate-300 font-medium">Positioning Disclosure:</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                This is a portfolio-grade fintech demonstration with modular mock provider adapters. Does not certify regulatory KYC/AML without third-party vendor credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} TrustPilot AI. Engineered with Next.js, TypeScript, TailwindCSS & Deep Risk Intelligence.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
              All Services Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

