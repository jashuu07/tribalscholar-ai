import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  Eye,
  Sliders,
  Send,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface AIReviewQueueProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const AIReviewQueue: React.FC<AIReviewQueueProps> = ({ onNavigate }) => {
  const { applications, currentUser, officerReviewDocument } = useApp();

  // Find all applications with mismatches or under verification
  const flaggedApps = applications.filter((app) =>
    app.documents.some((d) => d.status === 'MISMATCH_DETECTED' || d.aiResult?.mismatches?.length! > 0)
  );

  const [selectedAppId, setSelectedAppId] = useState<string>(
    flaggedApps[0]?.id || 'app-demo-nfst-0012'
  );

  const selectedApp =
    applications.find((a) => a.id === selectedAppId) || flaggedApps[0] || applications[0];

  const targetDoc =
    selectedApp?.documents?.find(
      (d) => d.status === 'MISMATCH_DETECTED' || (d.aiResult?.mismatches && d.aiResult.mismatches.length > 0)
    ) || selectedApp?.documents[0];

  const mismatch = targetDoc?.aiResult?.mismatches?.[0];

  const [officerRemarks, setOfficerRemarks] = useState<string>(
    'Discrepancy detected between self-declared income (₹1.80L) and Revenue Certificate (₹2.80L). Please upload the current valid FY income certificate or clarify family income.'
  );
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [showOverrideInput, setShowOverrideInput] = useState<boolean>(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const handleOfficerAction = (decision: 'APPROVED' | 'REJECTED' | 'DEFICIENCY_RAISED' | 'OVERRIDDEN') => {
    if (!targetDoc) return;
    officerReviewDocument(selectedApp.id, targetDoc.id, decision, officerRemarks, overrideReason);
    setActionDone(decision);
    setTimeout(() => setActionDone(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Advisory AI Review Queue</span>
            </span>
            <span className="text-xs text-slate-500">Human-in-the-Loop Scrutiny Desk</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            AI Document Discrepancy & Mismatch Triage
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            AI findings are strictly advisory. Final decisions always rest with authorized Ministry officers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-900 text-xs font-bold rounded-lg border border-amber-200">
            {flaggedApps.length} Flagged Case(s)
          </span>
        </div>
      </div>

      {actionDone && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Decision recorded: {actionDone.replace(/_/g, ' ')}. Audit trail updated and candidate notified.</span>
        </div>
      )}

      {/* Main Grid: Application Selector + Side-by-Side Reviewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Flagged Queue List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Flagged Applications ({flaggedApps.length})
          </h3>

          <div className="space-y-2">
            {flaggedApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedAppId === app.id
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300/30 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{app.applicationNumber}</span>
                  <StatusBadge status={app.status} size="sm" />
                </div>
                <div className="font-bold text-slate-800 text-xs mt-1">{app.studentName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {app.schemeCode} • {app.studentState}
                </div>
                <div className="mt-2 text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Annual Income Discrepancy (95% Conf)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: THE CRITICAL DEMO INSPECTOR */}
        <div className="lg:col-span-2 space-y-5">
          {selectedApp && targetDoc ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gov-navy text-xs">
                      {selectedApp.applicationNumber}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {selectedApp.schemeCode}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {selectedApp.studentName} ({selectedApp.stCommunity}, {selectedApp.studentState})
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Document</span>
                  <span className="text-xs font-bold text-slate-800">{targetDoc.name}</span>
                </div>
              </div>

              {/* CRITICAL DEMO CALLOUT BOX */}
              <div className="p-6 space-y-5">
                <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
                    <span>⚠ POTENTIAL MISMATCH DETECTED BY AI OCR</span>
                  </div>

                  {/* Side-by-side values */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Application Self-Declaration:
                      </span>
                      <span className="text-2xl font-black text-slate-900 mt-1 block">
                        {mismatch ? mismatch.applicationValue : `₹${selectedApp.formData.annualIncome.toLocaleString('en-IN')}`}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">Entered by scholar in Form</span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border-2 border-red-300 shadow-2xs">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                        Certificate Extracted Value (OCR):
                      </span>
                      <span className="text-2xl font-black text-red-600 mt-1 block">
                        {mismatch ? mismatch.documentValue : '₹2,80,000'}
                      </span>
                      <span className="text-[11px] text-red-500 mt-0.5 block">State Revenue Dept Certificate</span>
                    </div>
                  </div>

                  {/* Advisory Metadata */}
                  <div className="mt-4 pt-3 border-t border-amber-200/60 text-xs text-amber-950 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span><strong>AI Advisory Confidence:</strong> 95%</span>
                      <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-extrabold text-[11px]">
                        STATUS: REVIEW REQUIRED
                      </span>
                    </div>
                    <p className="leading-relaxed">
                      <strong>Explanation:</strong> "{mismatch?.explanation || 'The annual income extracted from the uploaded certificate does not match the value provided in the application.'}"
                    </p>
                    <p className="text-[11px] text-amber-800 italic">
                      Policy Rule: System NEVER automatically rejects the candidate. Officer discretion is required.
                    </p>
                  </div>
                </div>

                {/* Document OCR Preview Snippet */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Raw OCR Extracted Entity Snippet ({targetDoc.fileName})</span>
                  </h4>
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <pre>{targetDoc.aiResult?.ocrSnippet || 'Extracting document entities...'}</pre>
                  </div>
                </div>

                {/* Human Officer Action Panel */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gov-blue" />
                    <span>Human Officer Scrutiny Action</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Remarks / Scrutiny Note
                    </label>
                    <textarea
                      rows={2}
                      value={officerRemarks}
                      onChange={(e) => setOfficerRemarks(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-blue outline-hidden bg-white"
                      placeholder="Add officer comments..."
                    />
                  </div>

                  {showOverrideInput && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs">
                      <label className="font-bold text-blue-900 block">
                        Override Rationale (Mandatory for Audit Trail)
                      </label>
                      <input
                        type="text"
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        placeholder="e.g. Verified with District Magistrate office via NIC portal..."
                        className="w-full p-2 bg-white rounded-lg border border-blue-300 text-xs"
                      />
                    </div>
                  )}

                  {/* Decision Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowOverrideInput(!showOverrideInput)}
                        className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200"
                      >
                        {showOverrideInput ? 'Hide Override' : 'Override AI Decision'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Flag Deficiency */}
                      <button
                        onClick={() => handleOfficerAction('DEFICIENCY_RAISED')}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Issue Deficiency to Student</span>
                      </button>

                      {/* Approve / Override */}
                      <button
                        onClick={() => handleOfficerAction(showOverrideInput ? 'OVERRIDDEN' : 'APPROVED')}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{showOverrideInput ? 'Confirm Override & Approve' : 'Approve Document'}</span>
                      </button>

                      {/* Reject */}
                      <button
                        onClick={() => handleOfficerAction('REJECTED')}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500 text-xs">No flagged mismatch selected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
