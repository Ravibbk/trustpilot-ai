'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Camera,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  FileText,
  UserCheck,
  Zap,
  Lock,
  ChevronRight,
  Eye,
  Smile,
  AlertCircle,
} from 'lucide-react';
import { DocumentType } from '@/types';
import { RiskBadge, StatusBadge } from '@/components/common/Badge';

type Step = 'PROFILE' | 'DOCUMENT' | 'LIVENESS' | 'ASSESSMENT' | 'COMPLETED';

export default function CustomerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('PROFILE');

  // Form State
  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '+1 (555) 234-8901',
    dateOfBirth: '1993-04-19',
    nationality: 'United States',
    street: '450 Sutter St, Suite 1200',
    city: 'San Francisco',
    postalCode: '94108',
  });

  // Document State
  const [docType, setDocType] = useState<DocumentType>('PASSPORT');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'verified' | 'failed'>('idle');
  const [docQualityError, setDocQualityError] = useState<string | null>(null);
  const [extractionResults, setExtractionResults] = useState<any>(null);

  // Liveness State
  const [livenessStage, setLivenessStage] = useState<'prompt' | 'scanning' | 'passed' | 'failed'>('prompt');
  const [livenessResult, setLivenessResult] = useState<any>(null);

  // Assessment State
  const [isAssessing, setIsAssessing] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);

  // 1. Profile Submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('DOCUMENT');
  };

  // 2. Simulated Document Upload & OCR Analysis
  const simulateDocumentUpload = async (simulateBlur: boolean = false) => {
    setUploadState('uploading');
    setDocQualityError(null);

    const fileName = simulateBlur ? 'us_passport_blurry_scan.jpg' : 'us_passport_clear_scan.jpg';

    try {
      const res = await fetch('/api/documents/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'cust_live_1',
          fileName,
          fileSize: 1.8 * 1024 * 1024,
          mimeType: 'image/jpeg',
          documentType: docType,
        }),
      });

      const data = await res.json();
      if (data.success && data.validation.isValid) {
        setUploadState('verified');
        setExtractionResults(data.document.extraction);
      } else {
        setUploadState('failed');
        setDocQualityError(
          data.validation?.userFriendlyRemediation || 'Document unreadable. Please upload a clear photo.'
        );
      }
    } catch (err: any) {
      setUploadState('failed');
      setDocQualityError('We could not complete optical verification. Please try again.');
    }
  };

  // 3. Simulated Biometric Liveness Challenge
  const simulateLivenessChallenge = async (simulateSpoof: boolean = false) => {
    setLivenessStage('scanning');

    try {
      const res = await fetch('/api/liveness/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'cust_live_1',
          simulateSpoof,
        }),
      });

      const data = await res.json();
      if (data.success && data.livenessCheck.status === 'PASSED') {
        setLivenessStage('passed');
        setLivenessResult(data.livenessCheck);
      } else {
        setLivenessStage('failed');
        setLivenessResult(data.remediation || 'Biometric challenge did not pass. Move to a well-lit area.');
      }
    } catch (e: any) {
      setLivenessStage('failed');
    }
  };

  // 4. Final Risk & TrustPath Assessment
  const handleExecuteAssessment = async () => {
    setIsAssessing(true);
    setCurrentStep('ASSESSMENT');

    try {
      const res = await fetch('/api/risk/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'cust_live_1',
          name: `${profile.firstName} ${profile.lastName}`,
          country: profile.nationality,
          documentExtraction: extractionResults,
          liveness: livenessResult,
          deviceRiskScore: 12,
          ipRiskScore: 14,
        }),
      });

      const data = await res.json();
      setRiskAssessment(data);
      setTimeout(() => {
        setIsAssessing(false);
        setCurrentStep('COMPLETED');
      }, 1000);
    } catch (e) {
      setIsAssessing(false);
      setCurrentStep('COMPLETED');
    }
  };

  const stepsList: Array<{ id: Step; label: string; num: string }> = [
    { id: 'PROFILE', label: '1. Identity', num: '1' },
    { id: 'DOCUMENT', label: '2. Document OCR', num: '2' },
    { id: 'LIVENESS', label: '3. Biometrics', num: '3' },
    { id: 'COMPLETED', label: '4. Decision', num: '4' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Customer Onboarding Pipeline
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Verify Your Identity</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Encrypted Session</span>
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 shadow-xs">
          <div className="flex items-center justify-between">
            {stepsList.map((s, idx) => {
              const isPast =
                (s.id === 'PROFILE' && currentStep !== 'PROFILE') ||
                (s.id === 'DOCUMENT' && ['LIVENESS', 'ASSESSMENT', 'COMPLETED'].includes(currentStep)) ||
                (s.id === 'LIVENESS' && ['ASSESSMENT', 'COMPLETED'].includes(currentStep));
              const isCurrent = currentStep === s.id;

              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-xs hidden sm:inline ${
                      isCurrent ? 'font-bold text-slate-900' : 'text-slate-500 font-medium'
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < stepsList.length - 1 && (
                    <div className="w-8 sm:w-16 h-0.5 bg-slate-200 mx-1 sm:mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: PROFILE INFORMATION */}
        {currentStep === 'PROFILE' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs animate-in fade-in">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your legal identity details matching your government-issued credentials.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">First Legal Name</label>
                  <input
                    type="text"
                    required
                    value={profile.firstName}
                    onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Last Legal Name</label>
                  <input
                    type="text"
                    required
                    value={profile.lastName}
                    onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={profile.dateOfBirth}
                    onChange={e => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nationality / Country of Issue</label>
                  <select
                    value={profile.nationality}
                    onChange={e => setProfile({ ...profile, nationality: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="India">India</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Residential Street Address</label>
                <input
                  type="text"
                  required
                  value={profile.street}
                  onChange={e => setProfile({ ...profile, street: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={profile.city}
                    onChange={e => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={profile.postalCode}
                    onChange={e => setProfile({ ...profile, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg shadow-sm transition-all"
                >
                  <span>Continue to Document OCR</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: DOCUMENT UPLOAD & MODULAR OCR */}
        {currentStep === 'DOCUMENT' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs animate-in fade-in space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Government Document Verification</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload a photo of your valid government ID. Our OCR engine validates optical clarity in real-time.
                </p>
              </div>
              <button
                onClick={() => setCurrentStep('PROFILE')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            {/* Document Type Selector */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                { type: 'PASSPORT' as const, label: 'Passport' },
                { type: 'DRIVING_LICENSE' as const, label: "Driver's License" },
                { type: 'NATIONAL_ID' as const, label: 'National ID Card' },
              ].map(d => (
                <button
                  key={d.type}
                  type="button"
                  onClick={() => setDocType(d.type)}
                  className={`p-3 rounded-lg border text-center font-medium transition-all ${
                    docType === d.type
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Interactive Upload Box */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-800">
                Drag and drop your credential here, or choose an upload simulation:
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Accepts JPG, PNG, or PDF up to 15MB.
              </p>

              {/* Demo Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={uploadState === 'uploading'}
                  onClick={() => simulateDocumentUpload(false)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Upload Clear Document (Pass)</span>
                </button>
                <button
                  type="button"
                  disabled={uploadState === 'uploading'}
                  onClick={() => simulateDocumentUpload(true)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Simulate Blurry Upload (Error & Recovery)</span>
                </button>
              </div>

              {uploadState === 'uploading' && (
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-brand-600 font-medium">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing document geometry & extracting OCR fields...</span>
                </div>
              )}
            </div>

            {/* Quality Error & Recovery Card */}
            {uploadState === 'failed' && docQualityError && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Document Optical Quality Check Failed</span>
                </div>
                <p className="text-amber-800 leading-relaxed">{docQualityError}</p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => simulateDocumentUpload(false)}
                    className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-md font-semibold text-xs transition-colors"
                  >
                    Upload Clear Replacement Image
                  </button>
                  <button
                    onClick={() => setCurrentStep('LIVENESS')}
                    className="text-xs text-amber-900 underline hover:no-underline font-medium"
                  >
                    Bypass for Demo
                  </button>
                </div>
              </div>
            )}

            {/* Extraction Results Card */}
            {uploadState === 'verified' && extractionResults && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3 text-xs animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>OCR Extraction Succeeded (Quality Score: {extractionResults.qualityScore}%)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                    High Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <div className="bg-white p-2 rounded border border-emerald-100">
                    <span className="text-slate-400 block">Full Name</span>
                    <span className="font-semibold text-slate-800">{extractionResults.fields.fullName.value}</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5 font-mono">
                      Conf: {extractionResults.fields.fullName.confidence}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-emerald-100">
                    <span className="text-slate-400 block">Date of Birth</span>
                    <span className="font-semibold text-slate-800">{extractionResults.fields.dateOfBirth.value}</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5 font-mono">
                      Conf: {extractionResults.fields.dateOfBirth.confidence}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-emerald-100">
                    <span className="text-slate-400 block">Document ID</span>
                    <span className="font-semibold text-slate-800">{extractionResults.fields.documentNumber.value}</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5 font-mono">
                      Conf: {extractionResults.fields.documentNumber.confidence}%
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setCurrentStep('LIVENESS')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-2xs transition-colors"
                  >
                    <span>Proceed to Biometric Liveness</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: BIOMETRIC LIVENESS CHALLENGE */}
        {currentStep === 'LIVENESS' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs animate-in fade-in space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Biometric Liveness Verification</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Active 3D anti-spoofing challenge ensures an authentic human subject is present.
                </p>
              </div>
              <button
                onClick={() => setCurrentStep('DOCUMENT')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            {/* Camera Simulator Frame */}
            <div className="relative bg-slate-900 rounded-2xl h-72 flex flex-col items-center justify-center text-white overflow-hidden shadow-inner">
              {/* Face Guide Oval */}
              <div className="w-40 h-52 rounded-full border-2 border-dashed border-brand-400/80 flex items-center justify-center relative">
                {livenessStage === 'scanning' && (
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-30" />
                )}
                {livenessStage === 'passed' ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-in zoom-in" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-400" />
                )}
              </div>

              {/* Status Overlay */}
              <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                {livenessStage === 'prompt' && (
                  <p className="text-xs text-slate-300">
                    Position your face within the frame and follow the on-screen prompt.
                  </p>
                )}
                {livenessStage === 'scanning' && (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing challenge: Micro-blink & 3D head movement...</span>
                  </p>
                )}
                {livenessStage === 'passed' && (
                  <p className="text-xs text-emerald-400 font-bold">
                    Biometric Check Passed! (Confidence: 96% • Anti-spoof: 98%)
                  </p>
                )}
              </div>
            </div>

            {/* Liveness Controls */}
            {livenessStage === 'prompt' && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => simulateLivenessChallenge(false)}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-sm flex items-center gap-2 transition-colors"
                >
                  <Smile className="w-4 h-4" />
                  <span>Start Live Challenge (Pass)</span>
                </button>
                <button
                  onClick={() => simulateLivenessChallenge(true)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Simulate Presentation Attack (Spoof)</span>
                </button>
              </div>
            )}

            {livenessStage === 'passed' && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleExecuteAssessment}
                  disabled={isAssessing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
                >
                  {isAssessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Computing Risk & TrustPath Decision...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit for Verification Decision</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: ONBOARDING COMPLETION & DECISION */}
        {currentStep === 'COMPLETED' && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Verification Succeeded
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-3">You're All Set!</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                TrustPilot AI evaluated your passport extraction and 3D biometric liveness in real-time. Zero anomalies were detected.
              </p>
            </div>

            {/* Decision Breakdown Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-lg mx-auto text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-800">Verification Outcome:</span>
                <span className="font-bold text-emerald-700">AUTOMATED APPROVAL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-medium text-slate-900">{profile.firstName} {profile.lastName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Calculated Risk Score:</span>
                <span className="font-mono font-bold text-emerald-600">14 / 100 (Low Risk)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Document Authenticity:</span>
                <span className="font-mono text-slate-800">98% Confidence</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">AML Screening:</span>
                <span className="text-emerald-700 font-medium">Clear (0 Watchlist Matches)</span>
              </div>
            </div>

            {/* Navigation CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/cases"
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
              >
                Inspect in Analyst Dashboard
              </Link>
              <button
                onClick={() => {
                  setCurrentStep('PROFILE');
                  setUploadState('idle');
                  setLivenessStage('prompt');
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition-colors"
              >
                Restart Customer Journey
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
