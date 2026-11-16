'use client';

import React, { useState } from 'react';
import { Settings, Shield, Sliders, CheckCircle2, Lock, Save } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const [thresholds, setThresholds] = useState({
    lowMax: 30,
    mediumMax: 60,
    highMax: 80,
  });

  const [settings, setSettings] = useState({
    autoApproveLowRisk: true,
    requireSubstantiveNotes: true,
    maskPiiByDefault: true,
    ocrConfidenceFloor: 70,
    livenessScoreFloor: 85,
    enableSimulationBypass: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 font-mono">
            Platform Configuration
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">System Settings & Governance</h1>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Risk Thresholds Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Configurable Risk Scoring Tiers (Section 20)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Defines the numerical thresholds for automatic tier classifications (0–100 scale).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Low Risk Ceiling (0 - X)</label>
              <input
                type="number"
                value={thresholds.lowMax}
                onChange={e => setThresholds({ ...thresholds, lowMax: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
              <span className="text-[10px] text-emerald-600 mt-1 block">Default: 30 (Frictionless Pass)</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Medium Risk Ceiling (X - Y)</label>
              <input
                type="number"
                value={thresholds.mediumMax}
                onChange={e => setThresholds({ ...thresholds, mediumMax: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
              <span className="text-[10px] text-amber-600 mt-1 block">Default: 60 (TrustPath Action)</span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">High Risk Ceiling (Y - Z)</label>
              <input
                type="number"
                value={thresholds.highMax}
                onChange={e => setThresholds({ ...thresholds, highMax: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
              <span className="text-[10px] text-rose-600 mt-1 block">&gt; 80 is Critical Risk</span>
            </div>
          </div>
        </div>

        {/* Automation & Safety Gates */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Automation & Human Review Gates</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enforce compliance policies and reviewer obligations before decisions are committed.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoApproveLowRisk}
                onChange={e => setSettings({ ...settings, autoApproveLowRisk: e.target.checked })}
                className="rounded border-slate-300 text-brand-600 mt-0.5"
              />
              <div>
                <strong className="text-slate-900 block">Enable Automated Low-Risk Approval</strong>
                <span className="text-slate-500 text-[11px]">
                  Allows applicants with scores &lt; 30 and zero sanctions flags to instantly onboard without human delay.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireSubstantiveNotes}
                onChange={e => setSettings({ ...settings, requireSubstantiveNotes: e.target.checked })}
                className="rounded border-slate-300 text-brand-600 mt-0.5"
              />
              <div>
                <strong className="text-slate-900 block">Enforce Mandatory Justification on Review Decisions</strong>
                <span className="text-slate-500 text-[11px]">
                  Requires analysts to enter at least 15 characters of rationale for regulatory audit records.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maskPiiByDefault}
                onChange={e => setSettings({ ...settings, maskPiiByDefault: e.target.checked })}
                className="rounded border-slate-300 text-brand-600 mt-0.5"
              />
              <div>
                <strong className="text-slate-900 block">Default PII Masking on Case Dossiers</strong>
                <span className="text-slate-500 text-[11px]">
                  Redacts SSN/PAN, full emails, and national document numbers until explicit analyst reveal.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
