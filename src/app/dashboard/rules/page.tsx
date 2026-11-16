'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Check, X, Shield, ArrowRight } from 'lucide-react';
import { SystemRule } from '@/types';

export default function RuleBuilderPage() {
  const [rules, setRules] = useState<SystemRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [conditionField, setConditionField] = useState('deviceRiskScore');
  const [conditionOperator, setConditionOperator] = useState<SystemRule['conditionOperator']>('GREATER_THAN');
  const [conditionValue, setConditionValue] = useState('70');
  const [action, setAction] = useState<SystemRule['action']>('ENHANCED_VERIFICATION');

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rules');
      const data = await res.json();
      if (data.success) setRules(data.rules);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          conditionField,
          conditionOperator,
          conditionValue,
          action,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreateModalOpen(false);
        setName('');
        setDescription('');
        fetchRules();
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
            Deterministic Decision Engine
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Configurable System Rules (Section 32)</h1>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Decision Rule</span>
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Rule Name</th>
                <th className="py-3 px-4">Logical Trigger Condition</th>
                <th className="py-3 px-4">Resulting Action</th>
                <th className="py-3 px-4">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {rules.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">#{r.priority}</td>
                  <td className="py-3 px-4">
                    <strong className="text-slate-900 block">{r.name}</strong>
                    <span className="text-[11px] text-slate-400">{r.description}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200 text-[11px]">
                      IF {r.conditionField} {r.conditionOperator.replace(/_/g, ' ')} {r.conditionValue}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase font-mono bg-brand-50 text-brand-800 border border-brand-200">
                      {r.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                        r.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {r.isActive ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE RULE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Define New System Rule</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Identity Confidence Floor"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description / Intent</label>
                <input
                  type="text"
                  placeholder="Escalate for analyst review if name match drops..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Condition Row */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Condition Syntax (IF)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={conditionField}
                    onChange={e => setConditionField(e.target.value)}
                    className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="deviceRiskScore">Device Risk</option>
                    <option value="identityConfidence">Identity Confidence</option>
                    <option value="sanctionsMatch">Sanctions Match</option>
                    <option value="businessRisk">Business Risk</option>
                  </select>

                  <select
                    value={conditionOperator}
                    onChange={e => setConditionOperator(e.target.value as any)}
                    className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="GREATER_THAN">&gt; Greater Than</option>
                    <option value="LESS_THAN">&lt; Less Than</option>
                    <option value="EQUALS">= Equals</option>
                    <option value="CONTAINS">Contains</option>
                  </select>

                  <input
                    type="text"
                    value={conditionValue}
                    onChange={e => setConditionValue(e.target.value)}
                    className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Action Row */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Resulting System Action (THEN)</label>
                <select
                  value={action}
                  onChange={e => setAction(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="ENHANCED_VERIFICATION">Require Additional Verification</option>
                  <option value="MANUAL_REVIEW">Route to Human Review</option>
                  <option value="REJECT">Immediate Rejection & Block</option>
                  <option value="REQUEST_ADDRESS">Request Address Clarification</option>
                </select>
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
                  Save & Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
