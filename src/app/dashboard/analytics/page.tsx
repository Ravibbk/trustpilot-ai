'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingDown,
  Sparkles,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { FunnelStepMetric } from '@/types';

export default function AnalyticsFunnelPage() {
  const [funnel, setFunnel] = useState<FunnelStepMetric[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generatingInsight, setGeneratingInsight] = useState(false);

  // Filters
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [deviceFilter, setDeviceFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/analytics/funnel')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setFunnel(json.funnel);
          setOverview(json.overview);
        }
      })
      .finally(() => setLoading(false));

    fetchAiInsights();
  }, []);

  const fetchAiInsights = async () => {
    setGeneratingInsight(true);
    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'PRODUCT_INSIGHTS' }),
      });
      const data = await res.json();
      if (data.success) {
        setAiInsight(data.insight);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingInsight(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 font-mono">
            Product & Growth Analytics
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Onboarding Funnel & Conversion Diagnostics</h1>
        </div>
        <button
          onClick={fetchAiInsights}
          disabled={generatingInsight}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>{generatingInsight ? 'Analyzing...' : 'Refresh AI Product Insights'}</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Started Applications</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.totalStarted?.toLocaleString() || '12,450'}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
            +14.2% vs last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">End-to-End Conversion</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.overallConversion || '60.9'}%
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
            +5.4% lift post TrustPath AI
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Avg Completion Time</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.avgOnboardingDurationMinutes || '4.8'} min
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            Clean flows under 90s
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Manual Review Routing</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.manualReviewRate || '9.4'}%
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
            Target benchmark: &lt; 10%
          </span>
        </div>
      </div>

      {/* AI PRODUCT INSIGHTS CARD */}
      <div className="bg-brand-50/70 border border-brand-200 rounded-xl p-5 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-brand-900 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Automated AI Product Insights (Section 30)</span>
        </div>
        <div className="text-xs text-brand-950 leading-relaxed whitespace-pre-wrap font-sans">
          {aiInsight || 'Analyzing real-time funnel signals...'}
        </div>
      </div>

      {/* ONBOARDING FUNNEL STEP-BY-STEP DIAGNOSTIC */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Onboarding Funnel Drop-off Analysis</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualizing user flow and friction at each verification gate
            </p>
          </div>

          {/* Filter controls */}
          <div className="flex items-center gap-2 text-xs">
            <select
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700"
            >
              <option value="ALL">Global (All Countries)</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="EU">European Union</option>
            </select>
            <select
              value={deviceFilter}
              onChange={e => setDeviceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700"
            >
              <option value="ALL">All Devices</option>
              <option value="MOBILE">Mobile (iOS / Android)</option>
              <option value="DESKTOP">Desktop Web</option>
            </select>
          </div>
        </div>

        {/* Funnel Steps Visualization */}
        <div className="space-y-3">
          {funnel.map((step, idx) => {
            const widthPct = Math.max(15, Math.round((step.count / (funnel[0]?.count || 1)) * 100));

            return (
              <div key={step.step} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-800 font-semibold">{step.label}</span>
                  <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                    <span className="font-bold text-slate-900">{step.count.toLocaleString()} users</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                      {step.conversionFromPrevious}% pass
                    </span>
                    {step.dropOffRate > 0 && (
                      <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-semibold">
                        -{step.dropOffRate}% drop
                      </span>
                    )}
                    <span className="text-slate-400">{step.avgDurationSec}s avg</span>
                  </div>
                </div>

                {/* Funnel Bar */}
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === funnel.length - 1
                        ? 'bg-emerald-600'
                        : step.dropOffRate > 12
                        ? 'bg-brand-500'
                        : 'bg-brand-600'
                    }`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

