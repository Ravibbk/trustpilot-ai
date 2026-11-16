'use client';

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Plus,
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
  X,
  Play,
  Pause,
} from 'lucide-react';
import { Experiment } from '@/types';

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [controlName, setControlName] = useState('Standard Form');
  const [variantName, setVariantName] = useState('Progressive Disclosure Flow');

  const fetchExperiments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/experiments');
      const data = await res.json();
      if (data.success) setExperiments(data.experiments);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, controlName, variantName }),
      });
      const data = await res.json();
      if (data.success) {
        setCreateModalOpen(false);
        setName('');
        setDescription('');
        fetchExperiments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 font-mono">
            Growth & Experimentation Platform
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">A/B Testing & Workflow Optimization</h1>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Experiment</span>
        </button>
      </div>

      {/* Experiment Cards */}
      <div className="space-y-6">
        {experiments.map(exp => (
          <div
            key={exp.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-purple-50 text-purple-700">
                    <FlaskConical className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{exp.name}</h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                    {exp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{exp.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> +{exp.liftPercent}% Conversion Lift
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Statistical Confidence 99.2%</span>
                </div>
              </div>
            </div>

            {/* Split Metrics: Control vs Variant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Control */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800">Control (A): {exp.controlName}</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {exp.controlMetrics.participants.toLocaleString()} Users
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Conversion</span>
                    <span className="font-bold text-slate-900 text-sm font-mono">
                      {exp.controlMetrics.completionRate}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Avg Duration</span>
                    <span className="font-bold text-slate-900 text-sm font-mono">
                      {exp.controlMetrics.avgDurationMinutes}m
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Drop-off</span>
                    <span className="font-bold text-rose-600 text-sm font-mono">
                      {exp.controlMetrics.dropoffRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Variant */}
              <div className="p-4 rounded-xl border-2 border-brand-500 bg-brand-50/20 space-y-3 text-xs shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-brand-200">
                  <span className="font-bold text-brand-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" /> Variant (B): {exp.variantName}
                  </span>
                  <span className="text-[11px] font-mono text-brand-700 font-semibold">
                    {exp.variantMetrics.participants.toLocaleString()} Users
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded border border-brand-200">
                    <span className="text-[10px] text-slate-400 block">Conversion</span>
                    <span className="font-bold text-emerald-600 text-sm font-mono">
                      {exp.variantMetrics.completionRate}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-brand-200">
                    <span className="text-[10px] text-slate-400 block">Avg Duration</span>
                    <span className="font-bold text-brand-700 text-sm font-mono">
                      {exp.variantMetrics.avgDurationMinutes}m
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-brand-200">
                    <span className="text-[10px] text-slate-400 block">Drop-off</span>
                    <span className="font-bold text-slate-800 text-sm font-mono">
                      {exp.variantMetrics.dropoffRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE EXPERIMENT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Create New A/B Experiment</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Experiment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real-Time Camera Framing"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Hypothesis Description</label>
                <textarea
                  rows={2}
                  placeholder="Testing visual boundary cues to reduce blur retries..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Control Flow (A)</label>
                  <input
                    type="text"
                    required
                    value={controlName}
                    onChange={e => setControlName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Variant Flow (B)</label>
                  <input
                    type="text"
                    required
                    value={variantName}
                    onChange={e => setVariantName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg"
                >
                  Create Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

