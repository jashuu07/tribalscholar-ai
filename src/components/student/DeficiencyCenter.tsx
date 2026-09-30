import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  AlertTriangle,
  CheckCircle2,
  UploadCloud,
  FileText,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeficiencyCenterProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const DeficiencyCenter: React.FC<DeficiencyCenterProps> = ({ onNavigate }) => {
  const { currentUser, applications, resolveDeficiency } = useApp();

  const userApps = applications.filter((a) => a.studentId === currentUser.id);
  const currentApp = userApps[0] || applications[0]; // fallback to demo app

  const openDeficiencies = currentApp?.deficiencies?.filter((d) => d.status === 'OPEN') || [];
  const resolvedDeficiencies = currentApp?.deficiencies?.filter((d) => d.status === 'RESOLVED') || [];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [correctionNote, setCorrectionNote] = useState<string>(
    'Attached renewed Tahasildar Revenue Certificate confirming gross family annual income of ₹1,80,000. Prior upload accidentally included ancestral joint family land valuation instead of immediate family.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const targetDoc = currentApp?.documents?.find((d) => d.docType === 'INCOME_CERTIFICATE') || currentApp?.documents[0];

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!openDeficiencies[0]) return;

    setIsSubmitting(true);
    setTimeout(() => {
      resolveDeficiency(
        currentApp.id,
        openDeficiencies[0].id,
        correctionNote,
        selectedFile ? selectedFile.name : 'Corrected_Revenue_Income_Certificate_2026.pdf'
      );
      setIsSubmitting(false);
      setSuccessMessage(true);
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {
        // ignore
      }
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Action Desk
              </span>
              <span className="text-xs text-slate-500">Ministry Scrutiny Redressal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Deficiency Resolution & Document Re-Upload Center
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Government scrutiny officers and AI cross-verification flag discrepancies for transparent student rectification.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Application No</span>
            <span className="font-extrabold text-gov-navy text-sm sm:text-base">
              {currentApp?.applicationNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification after resolution */}
      {successMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 shadow-xs animate-in fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Corrected Document Re-Submitted & AI Verified!
              </h3>
              <p className="text-xs text-emerald-800 mt-1">
                The AI Document Intelligence pipeline re-scanned your new Revenue Certificate. Verified gross annual income: <strong>₹1,80,000</strong> with <strong>98% confidence</strong> and zero mismatches. Application status has transitioned to <strong>RE-SUBMITTED</strong> and routed for officer sign-off.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('admin-verification')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg"
                >
                  View Officer Verification Queue →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Deficiencies Section */}
      {openDeficiencies.length > 0 ? (
        <div className="space-y-6">
          {openDeficiencies.map((def) => (
            <div
              key={def.id}
              className="bg-white rounded-2xl border-2 border-amber-300 shadow-md overflow-hidden"
            >
              {/* Header */}
              <div className="bg-amber-500/10 p-5 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                      {def.severity} Severity Discrepancy
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {def.title}
                    </h3>
                  </div>
                </div>
                <StatusBadge status="DEFICIENCY" size="md" />
              </div>

              {/* Discrepancy Details & Critical Comparison Callout */}
              <div className="p-6 space-y-5">
                {/* Officer Reason */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Officer's Deficiency Remarks
                  </h4>
                  <p className="text-sm text-slate-800 mt-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    "{def.description}"
                  </p>
                </div>

                {/* CRITICAL DEMO BOX: APPLICATION VS DOCUMENT COMPARISON */}
                {targetDoc?.aiResult?.mismatches && targetDoc.aiResult.mismatches.length > 0 && (
                  <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                        ⚠ POTENTIAL MISMATCH DETECTED BY AI OCR
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs">
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          Application Self-Declaration:
                        </span>
                        <span className="text-lg font-extrabold text-slate-900">
                          {targetDoc.aiResult.mismatches[0].applicationValue}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-red-200 shadow-2xs">
                        <span className="text-[11px] font-semibold text-red-600 block">
                          Revenue Certificate Extracted Value:
                        </span>
                        <span className="text-lg font-extrabold text-red-600">
                          {targetDoc.aiResult.mismatches[0].documentValue}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-amber-900 space-y-1">
                      <p>
                        <strong>Confidence:</strong> 95%
                      </p>
                      <p>
                        <strong>Explanation:</strong> "
                        {targetDoc.aiResult.mismatches[0].explanation}"
                      </p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className="px-2 py-0.5 rounded bg-amber-200 font-bold">
                          REVIEW REQUIRED
                        </span>{' '}
                        (AI is advisory; student is never automatically rejected)
                      </p>
                    </div>
                  </div>
                )}

                {/* Rectification / Upload Form */}
                <form onSubmit={handleCorrectionSubmit} className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Submit Rectified Certificate & Clarification
                  </h4>

                  {/* File Upload Drop Area */}
                  <div className="border-2 border-dashed border-slate-300 hover:border-gov-blue rounded-xl p-5 text-center bg-slate-50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-8 h-8 text-gov-navy mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      {selectedFile
                        ? `Selected: ${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)`
                        : 'Click to select corrected Revenue Certificate (PDF/PNG, Max 2MB)'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ensure the Tahasildar seal, issue date, and declared income of ₹1,80,000 are clearly visible.
                    </p>
                  </div>

                  {/* Student Clarification Note */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Clarification / Rectification Remarks
                    </label>
                    <textarea
                      rows={3}
                      value={correctionNote}
                      onChange={(e) => setCorrectionNote(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-blue focus:border-transparent outline-hidden bg-white"
                      placeholder="Explain the correction or reason for earlier discrepancy..."
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-gov-navy hover:bg-gov-dark text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Running AI Document OCR Re-Scan...</span>
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4 text-emerald-300" />
                          <span>Submit Corrected Document & Trigger Re-Scan</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Active Deficiencies
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            All submitted documents have been successfully verified or resolved. Your application is proceeding through the scrutiny pipeline.
          </p>
        </div>
      )}

      {/* Resolved Deficiencies History */}
      {resolvedDeficiencies.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Resolved Deficiencies History ({resolvedDeficiencies.length})</span>
          </h3>

          <div className="space-y-3">
            {resolvedDeficiencies.map((d) => (
              <div
                key={d.id}
                className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-900">{d.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 font-bold">
                      RESOLVED
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Student Note: "{d.studentCorrectionNote}"
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-400 shrink-0">
                  Resolved: {d.resolvedAt ? new Date(d.resolvedAt).toLocaleDateString() : 'Today'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
