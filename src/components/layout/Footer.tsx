import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">TrustPilot AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-powered identity verification, risk intelligence, and human-in-the-loop review for fintech onboarding.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>TLS 1.3 · AES-256 · PII Redaction</span>
            </div>
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-3">Onboarding</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/onboarding" className="hover:text-white transition-colors">Customer KYC</Link></li>
              <li><Link href="/onboarding/business" className="hover:text-white transition-colors">Business KYB</Link></li>
            </ul>
          </div>

          {/* Ops */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-3">Operations</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard/cases" className="hover:text-white transition-colors">Case Queue</Link></li>
              <li><Link href="/dashboard/cases/case_10492" className="hover:text-white transition-colors">TrustPath AI Demo</Link></li>
              <li><Link href="/dashboard/analytics" className="hover:text-white transition-colors">Funnel Analytics</Link></li>
              <li><Link href="/dashboard/experiments" className="hover:text-white transition-colors">A/B Experiments</Link></li>
              <li><Link href="/dashboard/rules" className="hover:text-white transition-colors">Rule Builder</Link></li>
              <li><Link href="/dashboard/audit" className="hover:text-white transition-colors">Audit Logs</Link></li>
            </ul>
          </div>

          {/* Disclosure */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-3">About</h4>
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-[11px] text-slate-300 font-medium mb-1">Portfolio Demonstration</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                This platform uses modular mock provider adapters (OCR, Liveness, AML). It does not certify regulatory KYC/AML compliance without real third-party vendor credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} TrustPilot AI. Built with Next.js, TypeScript & TailwindCSS.</p>
          <span className="flex items-center gap-1.5 text-emerald-500">
            <Activity className="w-3 h-3" />
            All Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}
