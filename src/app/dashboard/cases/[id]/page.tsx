'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Shield,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Zap,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
  FileText,
  UserCheck,
  Send,
  Lock,
  MessageSquare,
  AlertCircle,
  Building2,
  Check,
  X,
} from 'lucide-react';
import { CaseReview, CaseStatus } from '@/types';
import { RiskBadge, StatusBadge } from '@/components/common/Badge';
import { CaseCopilotModal } from '@/components/copilot/CaseCopilotModal';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<CaseReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [maskPii, setMaskPii] = useState(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Decision Modal State
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<CaseStatus | null>(null);
  const [isOverride, setIsOverride] = useState(false);
  const [decisionReason, setDecisionReason] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [decisionSuccessMsg, setDecisionSuccessMsg] = useState<string | null>(null);

  // New Note State
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const fetchCaseDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      const data = await res.json();
      if (data.success) {
        setCaseData(data.case);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetail();
  }, [caseId]);

  const handleOpenDecision = (action: CaseStatus, override: boolean = false) => {
    setSelectedAction(action);
    setIsOverride(override);
    setDecisionReason('');
    setDecisionModalOpen(true);
  };

  const handleCommitDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction || !decisionReason.trim()) return;

    setIsSubmittingDecision(true);
    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: selectedAction,
          reason: decisionReason,
          overrideAi: isOverride,
          performedBy: 'Elena Rostova (Compliance Analyst)',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCaseData(data.case);
        setDecisionModalOpen(false);
        setDecisionSuccessMsg(`Decision executed: ${selectedAction} successfully recorded in immutable audit log.`);
        setTimeout(() => setDecisionSuccessMsg(null), 6000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      await fetch(`/api/cases/${caseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: newNote,
          performedBy: 'Elena Rostova (Compliance Analyst)',
        }),
      });
      setNewNote('');
      fetchCaseDetail();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
        <span className="w-4 h-4 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
        <span>Loading forensic case dossier...</span>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-12 text-center text-slate-600">
        <h2 className="text-base font-bold">Case Not Found</h2>
        <Link href="/dashboard/cases" className="text-xs text-brand-600 underline mt-2 inline-block">
          Return to Queue
        </Link>
      </div>
    );
  }

  // PII masking helpers
  const displayEmail = maskPii
    ? caseData.customerEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : caseData.customerEmail;

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Top Navigation & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/cases"
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                {caseData.entityType} Case
              </span>
              <span className="text-slate-300">•</span>
              <h1 className="text-xl font-bold text-slate-900">{caseData.caseNumber}</h1>
              <StatusBadge status={caseData.status} />
              <RiskBadge level={caseData.riskLevel} score={caseData.riskScore} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Subject: <strong className="text-slate-800">{caseData.customerName}</strong> ({displayEmail})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* PII Masking Toggle */}
          <button
            onClick={() => setMaskPii(!maskPii)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Mask or unmask personally identifiable information"
          >
            {maskPii ? <Eye className="w-3.5 h-3.5 text-slate-500" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
            <span>{maskPii ? 'PII Masked' : 'PII Visible'}</span>
          </button>

          {/* AI Case Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Bot className="w-4 h-4 text-brand-400" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Decision Success Notification */}
      {decisionSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{decisionSuccessMsg}</span>
          </div>
          <button onClick={() => setDecisionSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900 p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SIGNATURE FEATURE: TRUSTPATH AI NEXT BEST ACTION CARD */}
      <div className="bg-gradient-to-r from-brand-950 via-slate-900 to-slate-950 border border-brand-800/60 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-brand-600 text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-brand-300">
                Signature Feature • Explainable Workflow
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                TrustPath AI™ — Next Best Verification Action
              </h3>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
            Automation Confidence: {caseData.recommendation?.automationConfidence || 91}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1 md:col-span-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Recommended Action
            </span>
            <p className="text-sm font-bold text-white leading-snug">
              {caseData.recommendation?.recommendedAction}
            </p>
          </div>

          <div className="space-y-1 md:col-span-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Underlying Deterministic Rationale
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {caseData.recommendation?.reason}
            </p>
          </div>

          <div className="space-y-1 md:col-span-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Expected Compliance Outcome
            </span>
            <p className="text-xs text-emerald-300 leading-relaxed bg-emerald-950/40 border border-emerald-800/30 p-2.5 rounded-lg">
              {caseData.recommendation?.expectedOutcome}
            </p>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Suggested Requirements:</span>
            {caseData.recommendation?.suggestedRequirements.map((req, rIdx) => (
              <span key={rIdx} className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 text-[11px]">
                {req}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenDecision('INFO_REQUESTED', false)}
              className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold shadow-2xs transition-colors"
            >
              Execute Recommended Action
            </button>
            <button
              onClick={() => handleOpenDecision('APPROVED', true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg font-medium transition-colors"
            >
              Override AI
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: EVIDENCE, SIGNALS, & TIMELINE (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. EXPLAINABLE RISK DECOMPOSITION */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Risk Signal Breakdown ({caseData.riskScore}/100)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Transparent mathematical signal aggregation (Section 21)
                </p>
              </div>
              <RiskBadge level={caseData.riskLevel} score={caseData.riskScore} />
            </div>

            <div className="space-y-2 text-xs">
              {caseData.signals.map(s => (
                <div
                  key={s.id}
                  className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
                    s.polarity === 'POSITIVE'
                      ? 'bg-emerald-50/50 border-emerald-100'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {s.polarity === 'POSITIVE' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{s.title}</strong>
                        <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 bg-white border rounded">
                          {s.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{s.description}</p>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono italic">
                        Evidence: {s.evidence}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-mono font-bold text-xs flex-shrink-0 ${
                      s.polarity === 'POSITIVE' ? 'text-emerald-700' : 'text-amber-800'
                    }`}
                  >
                    {s.polarity === 'POSITIVE' ? `-${s.weight}` : `+${s.weight}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. CHRONOLOGICAL FRAUD TIMELINE */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Session & Device Fraud Timeline
                </h3>
                <p className="text-[11px] text-slate-500">Chronological telemetry events (Section 23)</p>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
              {caseData.fraudTimeline.map(ev => (
                <div key={ev.id} className="relative">
                  <span
                    className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      ev.severity === 'HIGH'
                        ? 'bg-rose-500'
                        : ev.severity === 'MEDIUM'
                        ? 'bg-amber-500'
                        : 'bg-brand-500'
                    }`}
                  />
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-slate-900">{ev.event}</span>
                    <span className="text-[11px] font-mono text-slate-400">{ev.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. AML WATCHLIST SCREENING ASSISTANCE */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  AML Watchlist Screening Assistance
                </h3>
                <p className="text-[11px] text-slate-500">
                  Sanctions, Politically Exposed Persons (PEP), and adverse media screening
                </p>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  caseData.amlAssessment?.sanctionsMatch
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : caseData.amlAssessment?.pepMatch
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {caseData.amlAssessment?.status || 'CLEAR'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Sanctions List (OFAC/UN)</span>
                <span
                  className={`font-bold mt-1 block ${
                    caseData.amlAssessment?.sanctionsMatch ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {caseData.amlAssessment?.sanctionsMatch ? 'MATCH DETECTED' : 'Zero Hits'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">PEP Database</span>
                <span
                  className={`font-bold mt-1 block ${
                    caseData.amlAssessment?.pepMatch ? 'text-amber-600' : 'text-emerald-700'
                  }`}
                >
                  {caseData.amlAssessment?.pepMatch ? 'Potential Politically Exposed' : 'Clean'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Adverse Media</span>
                <span className="font-bold text-emerald-700 mt-1 block">Clear</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION TOOLBAR, OCR INSPECTION, & AUDIT NOTES (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* HUMAN-IN-THE-LOOP ACTION TOOLBAR */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Analyst Actions (Human-in-the-Loop)
            </h3>
            <p className="text-[11px] text-slate-500">
              Sensitive operations require an immutable audit reason.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleOpenDecision('APPROVED', false)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                onClick={() => handleOpenDecision('REJECTED', false)}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" /> Reject
              </button>
              <button
                onClick={() => handleOpenDecision('INFO_REQUESTED', false)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
              >
                Request Info
              </button>
              <button
                onClick={() => handleOpenDecision('ESCALATED', false)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
              >
                Escalate
              </button>
            </div>
          </div>

          {/* AI CASE SUMMARY CARD */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-brand-700 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Case Executive Summary</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              {caseData.aiSummary.overview}
            </p>
            <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
              <span className="text-slate-500 font-semibold block">Missing Evidence:</span>
              {caseData.aiSummary.missingEvidence.map((ev, idx) => (
                <div key={idx} className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AUDIT CASE NOTES */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-800">Analyst Investigation Notes</h3>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {caseData.notes.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No notes added yet.</p>
              ) : (
                caseData.notes.map(n => (
                  <div key={n.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700">{n.author}</span>
                      <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-800 text-[11px]">{n.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddNote} className="pt-2 space-y-2">
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add compliance note or finding..."
                rows={2}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newNote.trim() || isSubmittingNote}
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                Add Audit Note
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* DECISION JUSTIFICATION MODAL */}
      {decisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-600">
                Compliance Audit Requirement (Section 25 & 35)
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Confirm Case Decision: {selectedAction}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Every sensitive action generates an immutable audit log record citing analyst rationale.
              </p>
            </div>

            <form onSubmit={handleCommitDecision} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Substantive Justification / Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={decisionReason}
                  onChange={e => setDecisionReason(e.target.value)}
                  placeholder="State evidence cited or reason for decision/override..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {isOverride && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed">
                  ⚠️ <strong>AI Override Flagged:</strong> This action will record an explicit analyst override of the TrustPath AI recommendation.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!decisionReason.trim() || isSubmittingDecision}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-lg font-semibold"
                >
                  {isSubmittingDecision ? 'Committing to Ledger...' : 'Commit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI CASE COPILOT MODAL */}
      <CaseCopilotModal
        caseData={caseData}
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onApplyAction={actionText => {
          handleOpenDecision('INFO_REQUESTED', false);
          setDecisionReason(`Executed via Copilot recommendation: ${actionText}`);
          setIsCopilotOpen(false);
        }}
      />
    </div>
  );
}
