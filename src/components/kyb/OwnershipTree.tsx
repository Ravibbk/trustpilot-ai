'use client';

import React from 'react';
import { BeneficialOwner, Director } from '@/types';
import { Building2, UserCheck, ShieldAlert, Award, AlertCircle } from 'lucide-react';

interface OwnershipTreeProps {
  companyName: string;
  directors: Director[];
  beneficialOwners: BeneficialOwner[];
}

export function OwnershipTree({ companyName, directors, beneficialOwners }: OwnershipTreeProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Corporate Ownership & Control Structure (KYB / UBO)
          </h4>
          <p className="text-[11px] text-slate-500">
            Entity ownership hierarchy and multi-tiered beneficial ownership validation
          </p>
        </div>
        <span className="text-xs font-mono bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-600">
          UBO Disclosure: 100% Accounted
        </span>
      </div>

      {/* Root Node: Company */}
      <div className="flex flex-col items-center">
        <div className="bg-white border-2 border-brand-600 rounded-xl px-5 py-3 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-50 text-brand-700">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase text-brand-600 tracking-wider">
              Subject Corporation
            </span>
            <h5 className="text-sm font-bold text-slate-900">{companyName}</h5>
          </div>
        </div>

        {/* Stem down */}
        <div className="w-0.5 h-6 bg-slate-300" />
        <div className="w-48 h-0.5 bg-slate-300" />

        {/* Two branches: Directors (Left) and Beneficial Owners (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
          {/* Directors Branch */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-600" /> Executive Directors ({directors.length})
              </span>
              <span className="text-[10px] text-slate-400">Board Authority</span>
            </div>

            <div className="space-y-2">
              {directors.map(dir => (
                <div
                  key={dir.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{dir.fullName}</p>
                    <p className="text-[11px] text-slate-500">{dir.role}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                    {dir.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Beneficial Owners (UBO) Branch */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" /> Ultimate Beneficial Owners ({beneficialOwners.length})
              </span>
              <span className="text-[10px] text-slate-400">Equity & Control</span>
            </div>

            <div className="space-y-2">
              {beneficialOwners.map(ubo => (
                <div
                  key={ubo.id}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                    ubo.isPep ? 'border-amber-200 bg-amber-50/40' : 'border-slate-100 bg-slate-50/60'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 truncate">{ubo.fullName}</p>
                      {ubo.isPep && (
                        <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> PEP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {ubo.title} • {ubo.nationality}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-brand-700 text-xs">
                      {ubo.ownershipPercentage}%
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {ubo.verificationStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

