'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, Briefcase, BarChart2, ShieldAlert, ChevronDown, Check } from 'lucide-react';

export function DemoSwitcher() {
  const { currentUser, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles: Array<{ role: UserRole; label: string; desc: string; icon: any }> = [
    {
      role: 'ANALYST',
      label: 'Risk & Compliance Analyst',
      desc: 'Case queue, fraud timeline, TrustPath AI & AI Copilot',
      icon: ShieldCheck,
    },
    {
      role: 'CUSTOMER',
      label: 'Individual Customer',
      desc: 'Progressive KYC, OCR extraction & biometric liveness',
      icon: UserCheck,
    },
    {
      role: 'BUSINESS_USER',
      label: 'Business Customer (KYB)',
      desc: 'Corporate registration, directors & UBO ownership tree',
      icon: Briefcase,
    },
    {
      role: 'PRODUCT_MANAGER',
      label: 'Product Manager',
      desc: 'Onboarding funnel, A/B experiments & AI product insights',
      icon: BarChart2,
    },
    {
      role: 'ADMIN',
      label: 'Platform Admin',
      desc: 'System rules, RBAC controls & immutable audit logs',
      icon: ShieldAlert,
    },
  ];

  const currentRoleMeta = roles.find(r => r.role === currentUser.role) || roles[0];
  const IconComponent = currentRoleMeta.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all"
        title="Switch active user persona for demo"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-slate-400 font-normal">Persona:</span>
        <IconComponent className="w-3.5 h-3.5 text-brand-600" />
        <span className="font-semibold text-slate-900">{currentRoleMeta.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-elevation border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-900">Switch Demo Persona</p>
              <p className="text-[11px] text-slate-500">
                Experience role-based workflows and access permissions instantly.
              </p>
            </div>
            <div className="p-1">
              {roles.map(r => {
                const isSelected = currentUser.role === r.role;
                const Icon = r.icon;
                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-brand-50 text-brand-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-md mt-0.5 ${
                        isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">{r.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

