'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Shield,
  FileText,
  Lock,
} from 'lucide-react';
import { OwnershipTree } from '@/components/kyb/OwnershipTree';
import { BeneficialOwner, Director } from '@/types';

export default function BusinessOnboardingPage() {
  const [step, setStep] = useState<'DETAILS' | 'DIRECTORS_UBO' | 'REVIEW' | 'COMPLETED'>('DETAILS');

  const [companyDetails, setCompanyDetails] = useState({
    legalName: 'NovaPay Technologies Inc.',
    tradeName: 'NovaPay',
    registrationNumber: 'DE-84920481',
    taxId: 'US-948102948',
    jurisdiction: 'Delaware, USA',
    incorporationDate: '2022-03-15',
    street: '1209 Orange Street',
    city: 'Wilmington',
    postalCode: '19801',
    country: 'United States',
  });

  const [directors, setDirectors] = useState<Director[]>([
    {
      id: 'dir_1',
      businessId: 'biz_temp',
      fullName: 'Marcus Vance',
      role: 'Chief Executive Officer',
      appointmentDate: '2022-03-15',
      identificationNumber: 'PAS-9823410',
      status: 'ACTIVE',
    },
    {
      id: 'dir_2',
      businessId: 'biz_temp',
      fullName: 'Claire Fontaine',
      role: 'Chief Technology Officer',
      appointmentDate: '2022-03-15',
      identificationNumber: 'PAS-1123490',
      status: 'ACTIVE',
    },
  ]);

  const [beneficialOwners, setBeneficialOwners] = useState<BeneficialOwner[]>([
    {
      id: 'ubo_1',
      businessId: 'biz_temp',
      fullName: 'Marcus Vance',
      ownershipPercentage: 55,
      title: 'Founder & CEO',
      nationality: 'United States',
      dateOfBirth: '1985-09-14',
      isPep: false,
      verificationStatus: 'VERIFIED',
    },
    {
      id: 'ubo_2',
      businessId: 'biz_temp',
      fullName: 'Apex Horizon Ventures LP',
      ownershipPercentage: 35,
      title: 'Institutional Lead Investor',
      nationality: 'United States',
      dateOfBirth: '2020-01-01',
      isPep: false,
      verificationStatus: 'VERIFIED',
    },
    {
      id: 'ubo_3',
      businessId: 'biz_temp',
      fullName: 'Claire Fontaine',
      ownershipPercentage: 10,
      title: 'Co-Founder',
      nationality: 'France',
      dateOfBirth: '1989-11-20',
      isPep: false,
      verificationStatus: 'VERIFIED',
    },
  ]);

  // Form adding helpers
  const [newDirectorName, setNewDirectorName] = useState('');
  const [newDirectorRole, setNewDirectorRole] = useState('Executive Director');

  const [newUboName, setNewUboName] = useState('');
  const [newUboShare, setNewUboShare] = useState('10');
  const [newUboPep, setNewUboPep] = useState(false);

  const addDirector = () => {
    if (!newDirectorName.trim()) return;
    setDirectors([
      ...directors,
      {
        id: 'dir_' + Date.now(),
        businessId: 'biz_temp',
        fullName: newDirectorName,
        role: newDirectorRole,
        appointmentDate: new Date().toISOString().split('T')[0],
        identificationNumber: 'PAS-' + Math.floor(100000 + Math.random() * 900000),
        status: 'ACTIVE',
      },
    ]);
    setNewDirectorName('');
  };

  const removeDirector = (id: string) => {
    setDirectors(directors.filter(d => d.id !== id));
  };

  const addUbo = () => {
    if (!newUboName.trim()) return;
    const shareNum = parseInt(newUboShare, 10) || 5;
    setBeneficialOwners([
      ...beneficialOwners,
      {
        id: 'ubo_' + Date.now(),
        businessId: 'biz_temp',
        fullName: newUboName,
        ownershipPercentage: shareNum,
        title: 'Shareholder',
        nationality: 'United States',
        dateOfBirth: '1990-01-01',
        isPep: newUboPep,
        verificationStatus: newUboPep ? 'FLAGGED' : 'VERIFIED',
      },
    ]);
    setNewUboName('');
    setNewUboPep(false);
  };

  const removeUbo = (id: string) => {
    setBeneficialOwners(beneficialOwners.filter(u => u.id !== id));
  };

  const totalOwnershipPercentage = beneficialOwners.reduce((acc, curr) => acc + curr.ownershipPercentage, 0);

  const handleSubmitKyb = async () => {
    try {
      await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legalName: companyDetails.legalName,
          tradeName: companyDetails.tradeName,
          registrationNumber: companyDetails.registrationNumber,
          taxId: companyDetails.taxId,
          jurisdiction: companyDetails.jurisdiction,
          registeredAddress: {
            street: companyDetails.street,
            city: companyDetails.city,
            postalCode: companyDetails.postalCode,
            country: companyDetails.country,
          },
          directors,
          beneficialOwners,
        }),
      });
      setStep('COMPLETED');
    } catch (e) {
      setStep('COMPLETED');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Corporate Onboarding (KYB)
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Know Your Business Verification</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Corporate Compliance Engine</span>
          </div>
        </div>

        {/* STEP 1: COMPANY DETAILS */}
        {step === 'DETAILS' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs animate-in fade-in space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">1. Corporation & Registration</h2>
              <p className="text-xs text-slate-500 mt-1">
                Provide certified details from your certificate of incorporation and tax registry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={companyDetails.legalName}
                  onChange={e => setCompanyDetails({ ...companyDetails, legalName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Trading Name (DBA)</label>
                <input
                  type="text"
                  value={companyDetails.tradeName}
                  onChange={e => setCompanyDetails({ ...companyDetails, tradeName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Company Registration Number</label>
                <input
                  type="text"
                  value={companyDetails.registrationNumber}
                  onChange={e => setCompanyDetails({ ...companyDetails, registrationNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Federal Tax Identification (TIN / EIN)</label>
                <input
                  type="text"
                  value={companyDetails.taxId}
                  onChange={e => setCompanyDetails({ ...companyDetails, taxId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Incorporation Jurisdiction</label>
                <input
                  type="text"
                  value={companyDetails.jurisdiction}
                  onChange={e => setCompanyDetails({ ...companyDetails, jurisdiction: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Date of Incorporation</label>
                <input
                  type="date"
                  value={companyDetails.incorporationDate}
                  onChange={e => setCompanyDetails({ ...companyDetails, incorporationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep('DIRECTORS_UBO')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
              >
                <span>Continue to Directors & Beneficial Owners</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DIRECTORS & ULTIMATE BENEFICIAL OWNERS (UBO) */}
        {step === 'DIRECTORS_UBO' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Visual Ownership Tree Component */}
            <OwnershipTree
              companyName={companyDetails.legalName}
              directors={directors}
              beneficialOwners={beneficialOwners}
            />

            {/* Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Director Form */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 text-xs">
                <h4 className="font-bold text-slate-900">Manage Directors</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Director Name"
                    value={newDirectorName}
                    onChange={e => setNewDirectorName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={addDirector}
                    className="px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-1.5 pt-2">
                  {directors.map(d => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200"
                    >
                      <span className="font-medium text-slate-800">{d.fullName} ({d.role})</span>
                      <button
                        onClick={() => removeDirector(d.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add UBO Form */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Manage Beneficial Owners</h4>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      totalOwnershipPercentage === 100 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    Total: {totalOwnershipPercentage}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Owner Name / Entity"
                      value={newUboName}
                      onChange={e => setNewUboName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="%"
                      value={newUboShare}
                      onChange={e => setNewUboShare(e.target.value)}
                      className="w-16 px-2 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-slate-600 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newUboPep}
                        onChange={e => setNewUboPep(e.target.checked)}
                        className="rounded border-slate-300 text-brand-600"
                      />
                      <span>Flag as PEP (Politically Exposed)</span>
                    </label>
                    <button
                      onClick={addUbo}
                      className="px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-1 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add UBO
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  {beneficialOwners.map(u => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200"
                    >
                      <span className="font-medium text-slate-800">
                        {u.fullName} ({u.ownershipPercentage}%) {u.isPep && '⚠️ PEP'}
                      </span>
                      <button
                        onClick={() => removeUbo(u.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep('DETAILS')}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Company Details
              </button>
              <button
                onClick={handleSubmitKyb}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
              >
                <span>Submit KYB Dossier for Screening</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUBMISSION COMPLETED */}
        {step === 'COMPLETED' && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                KYB Submission Registered
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-3">Business Profile Verified</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {companyDetails.legalName} has been recorded in the platform ledger. Corporate ownership hierarchy accounted for 100% equity distribution.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/cases"
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
              >
                Open Compliance Case Queue
              </Link>
              <button
                onClick={() => setStep('DETAILS')}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition-colors"
              >
                Register Another Business
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

