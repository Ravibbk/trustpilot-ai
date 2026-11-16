'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CaseReview, RiskLevel, CaseStatus } from '@/types';
import { RiskBadge, StatusBadge } from '@/components/common/Badge';

export default function CasesQueuePage() {
  const [cases, setCases] = useState<CaseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (riskFilter !== 'ALL') params.append('riskLevel', riskFilter);
      if (entityFilter !== 'ALL') params.append('entityType', entityFilter);

      const res = await fetch(`/api/cases?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCases(data.cases);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter, riskFilter, entityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCases();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 font-mono">
            Compliance Operations
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Review Queue & Risk Dossiers</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCases}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Case #, customer name, email..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Filter
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="INFO_REQUESTED">Info Requested</option>
              <option value="ESCALATED">Escalated</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Risk:</span>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700"
            >
              <option value="ALL">All Risks</option>
              <option value="LOW">Low (0-30)</option>
              <option value="MEDIUM">Medium (31-60)</option>
              <option value="HIGH">High (61-80)</option>
              <option value="CRITICAL">Critical (81-100)</option>
            </select>
          </div>

          {/* Entity Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Entity:</span>
            <select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700"
            >
              <option value="ALL">All Entities</option>
              <option value="CUSTOMER">Individual Customer</option>
              <option value="BUSINESS">Business Entity (KYB)</option>
            </select>
          </div>

          <span className="ml-auto text-slate-400 font-mono text-[11px]">
            Showing {cases.length} case{cases.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
            <span>Loading active compliance records...</span>
          </div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No cases found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No cases match your active search or filter criteria. Try resetting filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Case #</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Risk Evaluation</th>
                  <th className="py-3 px-4">TrustPath Recommendation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {cases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <Link
                        href={`/dashboard/cases/${c.id}`}
                        className="text-brand-600 hover:text-brand-800 underline hover:no-underline"
                      >
                        {c.caseNumber}
                      </Link>
                    </td>
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
                      {c.recommendation?.recommendedAction || 'Evaluation needed'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dashboard/cases/${c.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold rounded text-xs transition-colors"
                      >
                        <span>Examine</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

