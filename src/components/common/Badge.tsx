import React from 'react';
import { RiskLevel, CaseStatus, OnboardingStatus } from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', className = '', size = 'md' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    default: 'bg-slate-100 text-slate-750 border border-slate-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200 font-medium',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 font-medium',
    info: 'bg-sky-50 text-sky-700 border border-sky-200 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border tracking-wide font-sans ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  const map: Record<RiskLevel, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
    LOW: { variant: 'success', label: 'Low Risk' },
    MEDIUM: { variant: 'warning', label: 'Medium Risk' },
    HIGH: { variant: 'warning', label: 'High Risk' },
    CRITICAL: { variant: 'danger', label: 'Critical Risk' },
  };

  const meta = map[level] || { variant: 'neutral', label: level };

  return (
    <Badge variant={meta.variant}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {meta.label} {score !== undefined ? `(${score})` : ''}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: CaseStatus | OnboardingStatus }) {
  let variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'neutral';

  switch (status) {
    case 'APPROVED':
    case 'DOCUMENT_VERIFIED':
    case 'LIVENESS_VERIFIED':
      variant = 'success';
      break;
    case 'IN_REVIEW':
    case 'MANUAL_REVIEW':
    case 'DECISION_PENDING':
    case 'INFO_REQUESTED':
      variant = 'warning';
      break;
    case 'REJECTED':
      variant = 'danger';
      break;
    case 'PENDING':
    case 'STARTED':
    case 'DOCUMENT_REQUIRED':
    case 'LIVENESS_REQUIRED':
      variant = 'info';
      break;
    default:
      variant = 'neutral';
  }

  return (
    <Badge variant={variant}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

