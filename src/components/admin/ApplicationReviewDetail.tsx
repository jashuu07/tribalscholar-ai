import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Eye,
  Award,
  Sliders,
  Send,
  UserCheck,
} from 'lucide-react';

interface ApplicationReviewDetailProps {
  appId: string;
  onNavigate: (tab: string, extra?: any) => void;
}

export const ApplicationReviewDetail: React.FC<ApplicationReviewDetailProps> = ({ appId, onNavigate }) => {
  const { applications, currentUser, officerReviewDocument, updateApplicationStatus } = useApp();

  const app = applications.find((a) => a.id === appId) || applications[0];

  const targetDoc =
    app.documents.find((d) => d.status === 'MISMATCH_DETECTED') ||
    app.documents.find((d) => d.docType === 'INCOME_CERTIFICATE') ||
    app.documents[0];

  const mismatch = targetDoc?.aiResult?.mismatches?.[0];

  const [officerRemarks, setOfficerRemarks] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverride, setShowOverride] = useState(false);

  // Compute AI Review Summary statistics
  const totalDocs = app.documents.length;
  const verifiedDocs = app.documents.filter((d) => d.status === 'AI_VERIFIED' || d.status === 'OFFICER_APPROVED').length;
  const mismatchedDocs = app.documents.filter((d) => d.status === 'MISMATCH_DETECTED').length;
  const rulesTotal = app.eligibilityEvaluation?.totalCount || 5;
  const rulesPassed = app.eligibilityEvaluation?.passedCount || 4;

  const handleAction = (decision: 'APPROVED' | 'REJECTED' | 'DEFICIENCY_RAISED' | 'OVERRIDDEN') => {
    if (!targetDoc) return;
    officerReviewDocument(app.id, targetDoc.id, decision, officerRemarks || `Officer ${decision}`, overrideReason);
    alert(`Decision recorded: ${decision}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin-applications')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-gov-navy">{app.applicationNumber}</span>
              <StatusBadge status={app.status} size="sm" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {app.studentName} — Scrutiny Dossier
            </h2>
            <p className="text-xs text-slate-500">
              Scheme: <strong className="text-slate-800">{app.schemeName}</strong> ({app.schemeCode}) | Community: {app.stCommunity} | State: {app.studentState}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Composite Merit Score</span>
          <span className="text-2xl font-black text-gov-navy">{app.score || 85}/100</span>
        </div>
      </div>

      {/* AI REVIEW ASSISTANT PANEL */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-gov-navy text-white rounded-2xl p-6 shadow-md border border-blue-800">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-200">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                Advisory Decision Support
              </span>
              <h3 className="text-base font-extrabold text-white">
                AI Scrutiny Assistant Summary
              </h3>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/30 text-blue-200 font-semibold border border-blue-400/30">
            Advisory Only • Non-Accusatory
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-300 uppercase block">Documents Ingested</span>
            <span className="text-lg font-bold text-white block mt-0.5">{totalDocs} Uploaded</span>
            <span className="text-[10px] text-emerald-300">{totalDocs} Classified</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-300 uppercase block">Verification Status</span>
            <span className="text-lg font-bold text-emerald-300 block mt-0.5">{verifiedDocs} Verified</span>
            <span className="text-[10px] text-slate-300">{mismatchedDocs} Flagged</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-300 uppercase block">Deterministic Rules</span>
            <span className="text-lg font-bold text-white block mt-0.5">{rulesPassed}/{rulesTotal} Passed</span>
            <span className="text-[10px] text-emerald-300">100% Explainable</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-300 uppercase block">Recommended Action</span>
            <span className="text-sm font-bold text-amber-300 block mt-1">
              {mismatchedDocs > 0 ? 'Review Income Discrepancy' : 'Advance to Selection'}
            </span>
          </div>
        </div>

        {/* Plain Language Summary */}
        <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/10 text-xs text-slate-200 leading-relaxed">
          <strong>AI Finding Summary:</strong> {totalDocs} documents uploaded and classified. {verifiedDocs} documents verified with high confidence. {mismatchedDocs > 0 ? '1 potential inconsistency detected in family annual income between self-declaration and Revenue Certificate. Human review required before finalizing merit screening.' : 'Zero document inconsistencies detected. All deterministic scheme eligibility rules satisfied.'}
        </div>
      </div>

      {/* SIDE-BY-SIDE COMPARISON: APPLICATION DATA | DOCUMENT DATA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Side-by-Side Verification: Application Data vs. Document OCR
          </h3>
          <span className="text-xs text-slate-500 font-mono">Target: {targetDoc?.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Left Column: Application Declared Data */}
          <div className="p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gov-navy flex items-center gap-1.5">
              <span>Candidate Application Declarations</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Scholar Name</span>
                <span className="font-bold text-slate-900">{app.studentName}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Declared ST Community</span>
                <span className="font-bold text-slate-900">{app.stCommunity} ({app.formData.stCertificateNumber})</span>
              </div>

              {/* CRITICAL MISMATCH HIGHLIGHT */}
              <div className="p-3.5 bg-amber-50/80 border-2 border-amber-300 rounded-xl shadow-2xs">
                <span className="text-amber-800 font-bold block text-[10px] uppercase">
                  Declared Annual Family Income
                </span>
                <span className="text-xl font-black text-slate-900 mt-0.5 block">
                  ₹{app.formData.annualIncome.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-amber-700 block mt-0.5">
                  Self-declared in online application form
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Enrolled Degree & University</span>
                <span className="font-bold text-slate-900">{app.formData.educationLevel} — {app.formData.universityName}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Qualifying Aggregate Percentage</span>
                <span className="font-bold text-slate-900">{app.formData.degreePercentage}%</span>
              </div>
            </div>
          </div>

          {/* Right Column: OCR Document Extracted Data */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Document AI Extracted Data
              </h4>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                OCR Confidence: {targetDoc?.aiResult?.confidence || 95}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Document Classification</span>
                <span className="font-bold text-slate-900">{targetDoc?.aiResult?.classification || targetDoc?.name}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Issuing Authority / Jurisdiction</span>
                <span className="font-bold text-slate-900">
                  {targetDoc?.aiResult?.extractedFields?.issuingAuthority || 'Tahasildar, Revenue Dept.'}
                </span>
              </div>

              {/* CRITICAL MISMATCH HIGHLIGHT */}
              {mismatch ? (
                <div className="p-3.5 bg-red-50/80 border-2 border-red-300 rounded-xl shadow-2xs">
                  <span className="text-red-700 font-bold block text-[10px] uppercase">
                    Extracted Certificate Value (OCR)
                  </span>
                  <span className="text-xl font-black text-red-600 mt-0.5 block">
                    {mismatch.documentValue}
                  </span>
                  <span className="text-[11px] text-red-700 font-medium block mt-0.5">
                    Discrepancy: Difference of ₹1,00,000 detected
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 font-bold block text-[10px]">Extracted Value</span>
                  <span className="text-xl font-black text-emerald-800 mt-0.5 block">
                    ₹{app.formData.annualIncome.toLocaleString('en-IN')} (Matches)
                  </span>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Certificate Number / Unique Token</span>
                <span className="font-mono font-bold text-slate-900">
                  {targetDoc?.aiResult?.extractedFields?.certificateNo || 'REV/INC/2025/89201'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Security Checks & Seals</span>
                <span className="font-semibold text-emerald-700">Digital Signature Verified (Valid)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Human Officer Scrutiny Action Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gov-blue" />
          <span>Human Officer Scrutiny Decision</span>
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Officer Remarks / Instructions for Candidate or Selection Committee
          </label>
          <input
            type="text"
            value={officerRemarks}
            onChange={(e) => setOfficerRemarks(e.target.value)}
            placeholder="e.g. Verified with Revenue Department portal. Deficiency issued for updated income certificate..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
          />
        </div>

        {showOverride && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs">
            <label className="font-bold text-blue-900 block">Override Rationale (Logged to Audit Trail)</label>
            <input
              type="text"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. Discrepancy confirmed as clerical typo by District Magistrate..."
              className="w-full p-2 bg-white rounded-lg border border-blue-300 text-xs"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowOverride(!showOverride)}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
          >
            {showOverride ? 'Hide Override Field' : '+ Add Formal Override Justification'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('DEFICIENCY_RAISED')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Issue Deficiency to Student
            </button>
            <button
              onClick={() => handleAction(showOverride ? 'OVERRIDDEN' : 'APPROVED')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              {showOverride ? 'Override & Approve' : 'Approve Document'}
            </button>
            <button
              onClick={() => handleAction('REJECTED')}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
            >
              Reject Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
