'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, CheckCircle2, AlertTriangle, ArrowRight, Zap, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { RiskBadge } from '../common/Badge';

export function LiveProductPreview() {
  const [selectedScenario, setSelectedScenario] = useState<'legit' | 'address_variance' | 'fraud'>('address_variance');

  const scenarios = {
    legit: {
      name: 'Sarah Jenkins',
      type: 'Legitimate Consumer',
      docType: 'US Passport',
      docConfidence: 98,
      livenessScore: 97,
      riskScore: 14,
      riskLevel: 'LOW' as const,
      signals: [
        { label: 'High Document Quality', positive: true, note: 'Optical microtext & MRZ verified' },
        { label: 'Biometric 3D Depth Passed', positive: true, note: 'Passive micro-expression detected' },
        { label: 'Clean Sanctions Screening', positive: true, note: 'Zero hits across OFAC/EU lists' },
      ],
      recommendation: {
        action: 'Automated Frictionless Approval',
        reason: 'All document, biometric, and geo signals passed within prime thresholds.',
        expected: 'Zero-friction completion under 90s.',
      },
    },
    address_variance: {
      name: 'Rahul Kumar',
      type: 'Borderline Address Discrepancy',
      docType: 'UK Passport',
      docConfidence: 94,
      livenessScore: 96,
      riskScore: 64,
      riskLevel: 'HIGH' as const,
      signals: [
        { label: 'Passport Identity Confirmed', positive: true, note: 'Name and DOB match perfectly (94%)' },
        { label: 'Active Liveness Passed', positive: true, note: 'Real-time blink challenge passed (96%)' },
        { label: 'Address Mismatch', positive: false, note: 'Extracted address differs from application (64%)' },
      ],
      recommendation: {
        action: 'TrustPath AI: Request Additional Proof of Address',
        reason: 'Identity is verified but address confidence is low. Avoid premature manual rejection.',
        expected: 'Diverts 72% of false positives into automated self-service resolution.',
      },
    },
    fraud: {
      name: 'Dmitri Vasiliev (Synthetic)',
      type: 'Device Emulator & VPN Ring',
      docType: 'Forged National ID',
      docConfidence: 48,
      livenessScore: 22,
      riskScore: 88,
      riskLevel: 'CRITICAL' as const,
      signals: [
        { label: 'Device Emulator Fingerprint', positive: false, note: 'WebGL canvas matches Genymotion bot' },
        { label: 'Commercial VPN Relay', positive: false, note: 'Frankfurt data center IP node' },
        { label: 'MRZ Digital Font Tampering', positive: false, note: 'OCR checksum algorithm failed' },
      ],
      recommendation: {
        action: 'Immediate Block & Forensic Blacklist',
        reason: 'Synthetic identity ring: repeated attempts linked across multiple accounts.',
        expected: 'Protect fintech ledger from account takeover and chargebacks.',
      },
    },
  };

  const active = scenarios[selectedScenario];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-left font-sans">
      {/* Chrome Window Header */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-xs font-mono text-slate-400">
            trustpath-engine://eval/live-telemetry
          </span>
        </div>

        {/* Interactive Scenario Buttons */}
        <div className="flex items-center bg-slate-850 p-1 rounded-lg border border-slate-750 text-xs">
          <button
            onClick={() => setSelectedScenario('legit')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedScenario === 'legit'
                ? 'bg-emerald-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Legitimate User
          </button>
          <button
            onClick={() => setSelectedScenario('address_variance')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedScenario === 'address_variance'
                ? 'bg-brand-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Borderline Discrepancy
          </button>
          <button
            onClick={() => setSelectedScenario('fraud')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedScenario === 'fraud'
                ? 'bg-rose-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fraud Attack
          </button>
        </div>
      </div>

      {/* Main Interactive Screen */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-100">
        {/* Left Column: Telemetry & Extraction (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-slate-850 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Evaluation Subject
              </span>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {active.name}
                <span className="text-xs font-normal text-slate-400">({active.type})</span>
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Risk Engine Output
              </span>
              <div>
                <RiskBadge level={active.riskLevel} score={active.riskScore} />
              </div>
            </div>
          </div>

          {/* Verification Pillars */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>OCR Quality & ID</span>
                <span className="font-mono text-white font-bold">{active.docConfidence}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    active.docConfidence > 80 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${active.docConfidence}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{active.docType}</p>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>3D Biometric Liveness</span>
                <span className="font-mono text-white font-bold">{active.livenessScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    active.livenessScore > 80 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${active.livenessScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Active Challenge Response</p>
            </div>
          </div>

          {/* Signal Decomposition */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Explainable Risk Signals
            </span>
            <div className="space-y-1.5">
              {active.signals.map((sig, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {sig.positive ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className="text-slate-200">{sig.label}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{sig.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Signature Feature "TrustPath AI Recommendation" (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-brand-950/60 to-slate-900 p-5 rounded-xl border border-brand-800/50">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-brand-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">TrustPath AI™</h5>
                <p className="text-[10px] text-brand-300">Next Best Verification Action</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-brand-700/40 p-3.5 rounded-lg space-y-2.5">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-semibold text-white leading-snug">
                  {active.recommendation.action}
                </p>
              </div>

              <div className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800 pt-2">
                <p className="font-medium text-slate-400 mb-0.5">Underlying Rationale:</p>
                {active.recommendation.reason}
              </div>

              <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 p-2 rounded">
                <span className="font-semibold text-emerald-200">Expected Outcome:</span>{' '}
                {active.recommendation.expected}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <Link
              href="/dashboard/cases/case_10492"
              className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 font-medium transition-colors"
            >
              Open Full Case Workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[10px] text-slate-500 font-mono">Simulated Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}

