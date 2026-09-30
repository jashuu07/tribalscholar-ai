import React from 'react';
import { ApplicationStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = (st: string) => {
    switch (st) {
      case 'SELECTED':
      case 'POST_SELECTION':
      case 'APPROVED':
      case 'OFFICER_APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-500/20';
      case 'DEFICIENCY':
      case 'MISMATCH_DETECTED':
      case 'REJECTED':
      case 'OFFICER_REJECTED':
      case 'NOT_SELECTED':
        return 'bg-amber-100 text-amber-900 border-amber-300 ring-amber-500/20';
      case 'DOCUMENT_VERIFICATION':
      case 'AI_VERIFIED':
      case 'PENDING_AI':
        return 'bg-blue-100 text-blue-800 border-blue-300 ring-blue-500/20';
      case 'ELIGIBILITY_CHECK':
      case 'SCREENING':
      case 'RE_SUBMITTED':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300 ring-indigo-500/20';
      case 'SUBMITTED':
        return 'bg-sky-100 text-sky-800 border-sky-300 ring-sky-500/20';
      case 'DRAFT':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-500/10';
    }
  };

  const getLabel = (st: string) => {
    switch (st) {
      case 'POST_SELECTION':
        return 'Fellowship Active (Post-Selection)';
      case 'DEFICIENCY':
        return 'Deficiency Flagged';
      case 'MISMATCH_DETECTED':
        return 'Review Required (Mismatch)';
      case 'DOCUMENT_VERIFICATION':
        return 'Doc Verification';
      case 'ELIGIBILITY_CHECK':
        return 'Rule Engine Check';
      case 'RE_SUBMITTED':
        return 'Re-Submitted';
      case 'AI_VERIFIED':
        return 'AI Verified';
      default:
        return st.replace(/_/g, ' ');
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs ${getBadgeStyle(
        status
      )} ${sizeClasses[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {getLabel(status)}
    </span>
  );
};
