'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Bot,
} from 'lucide-react';
import { RiskBadge, StatusBadge } from '@/components/common/Badge';

export default function DashboardOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/analytics/funnel')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.overview);
      })
      .catch(() => {});

    fetch('/api/cases')
      .then(res => res.json())
      .then(json => {
        if (json.success) setCases(json.cases);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Platform Operations Center
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Trust & Risk Command Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/cases/case_10492"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Open Flagged Case (TrustPath Demo)</span>
          </Link>
          <Link
            href="/dashboard/cases"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Cases in Queue</span>
            <span className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{cases.length}</span>
            <span className="text-xs text-amber-600 font-medium">3 Pending Action</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requiring analyst evaluation</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Manual Review Rate</span>
            <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {data ? `${data.manualReviewRate}%` : '9.4%'}
            </span>
            <span className="text-xs text-emerald-600 font-medium">-72% via TrustPath</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Target threshold: &lt; 12%</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Avg Verification Time</span>
            <span className="p-1.5 rounded-md bg-sky-50 text-sky-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {data ? `${data.avgOnboardingDurationMinutes}m` : '4.8m'}
            </span>
            <span className="text-xs text-slate-500 font-medium">End-to-end</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Clean pass: &lt; 90 seconds</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Fraud Detection Rate</span>
            <span className="p-1.5 rounded-md bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {data ? `${data.fraudBlockRate}%` : '1.2%'}
            </span>
            <span className="text-xs text-rose-600 font-medium">Zero Leakage</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Synthetics & Emulators blocked</p>
        </div>
      </div>

      {/* Signature Highlight: TrustPath Active Interventions */}
      <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-slate-950 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>TrustPath AI™ Autonomous Intervention</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Case 10492: Borderline address variance rerouted to automated remediation
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Applicant Rahul Kumar presented strong passport OCR (94%) and active 3D liveness (96%), but residential proof scored 64%. Rather than rejecting or piling into manual queue, TrustPath AI requested a fresh utility bill, saving an estimated 45 minutes of compliance investigation.
          </p>
        </div>
        <Link
          href="/dashboard/cases/case_10492"
          className="flex-shrink-0 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <span>Examine Case Dossier</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Recent Investigation Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Review Queue</h3>
            <p className="text-[11px] text-slate-500">Live high-risk and borderline cases awaiting analyst decision</p>
          </div>
          <Link
            href="/dashboard/cases"
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
          >
            <span>View All ({cases.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Case #</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">TrustPath Recommendation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {cases.slice(0, 5).map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.caseNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{c.customerName}</div>
                    <div className="text-[11px] text-slate-400">{c.customerEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                      {c.entityType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={c.riskLevel} score={c.riskScore} />
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-600">
                    {c.recommendation?.recommendedAction || 'Review required'}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/dashboard/cases/${c.id}`}
                      className="px-2.5 py-1 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 rounded hover:bg-brand-100 transition-colors inline-block"
                    >
                      Investigate
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
