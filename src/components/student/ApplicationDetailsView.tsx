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
  FileCheck,
} from 'lucide-react';

interface ApplicationDetailsViewProps {
  appId: string;
  onNavigate: (tab: string, extra?: any) => void;
}

export const ApplicationDetailsView: React.FC<ApplicationDetailsViewProps> = ({ appId, onNavigate }) => {
  const { applications, currentUser } = useApp();
  const app = applications.find((a) => a.id === appId) || applications[0];

  const [inspectDocId, setInspectDocId] = useState<string | null>(null);

  const inspectedDoc = app.documents.find((d) => d.id === inspectDocId) || app.documents[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(currentUser.role === 'STUDENT' ? 'student-dashboard' : 'admin-applications')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gov-navy">
                  {app.applicationNumber}
                </span>
                <StatusBadge status={app.status} size="sm" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {app.schemeName}
              </h2>
              <p className="text-xs text-slate-500">
                Applicant: <strong className="text-slate-800">{app.studentName}</strong> | State: {app.studentState} | Submitted: {new Date(app.submittedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {app.status === 'DEFICIENCY' && (
              <button
                onClick={() => onNavigate('student-deficiency')}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Go to Deficiency Desk</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Form Data & Rule Verification Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Data & Documents */}
        <div className="md:col-span-2 space-y-6">
          {/* Key Form Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Application Details & Academic Record
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Enrolled Degree</span>
                <span className="font-bold text-slate-900">{app.formData.educationLevel}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Qualifying Marks</span>
                <span className="font-bold text-slate-900">{app.formData.degreePercentage}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Declared Annual Income</span>
                <span className="font-bold text-slate-900">₹{app.formData.annualIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl sm:col-span-3">
                <span className="text-slate-400 block text-[11px]">Research / Doctoral Topic</span>
                <span className="font-medium text-slate-800 leading-snug block mt-0.5">
                  {app.formData.researchTitle || 'Doctoral research in indigenous tribal knowledge systems'}
                </span>
              </div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Uploaded Verification Documents ({app.documents.length})
            </h3>
            <div className="space-y-2.5">
              {app.documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    doc.status === 'MISMATCH_DETECTED'
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gov-navy shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{doc.name}</span>
                        <StatusBadge status={doc.status} size="sm" />
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {doc.fileName} ({doc.fileSizeKB} KB)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setInspectDocId(doc.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-gov-blue hover:bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect OCR</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inspected Doc OCR Preview Modal / Box */}
          {inspectedDoc && inspectedDoc.aiResult && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    AI OCR Inspection: {inspectedDoc.name}
                  </h4>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Confidence: {inspectedDoc.aiResult.confidence}%
                </span>
              </div>

              {/* Mismatch Alert if any */}
              {inspectedDoc.aiResult.mismatches && inspectedDoc.aiResult.mismatches.length > 0 && (
                <div className="mt-3 p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Advisory OCR Mismatch Flagged:</span>
                  </div>
                  <p>{inspectedDoc.aiResult.mismatches[0].explanation}</p>
                </div>
              )}

              {/* Extracted JSON / Snippet */}
              <div className="mt-3 bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto">
                <pre>{inspectedDoc.aiResult.ocrSnippet}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Rule Evaluation Matrix & Timeline */}
        <div className="space-y-6">
          {/* Rule Evaluation Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Deterministic Scheme Rules
            </h3>
            <div className="space-y-2">
              {app.eligibilityEvaluation?.ruleResults.map((r) => (
                <div
                  key={r.ruleId}
                  className={`p-2 rounded-lg border text-[11px] flex items-center justify-between ${
                    r.passed ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-red-50/50 border-red-200 text-red-900'
                  }`}
                >
                  <span className="font-semibold">{r.fieldLabel}</span>
                  <span className="font-bold">{r.passed ? 'PASSED' : 'FAILED'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Audit Stepper</span>
            </h3>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {app.timeline.slice().reverse().map((t) => (
                <div key={t.id} className="text-xs border-l-2 border-gov-navy pl-3 py-1">
                  <div className="font-bold text-slate-900 text-[11px]">{t.title}</div>
                  <div className="text-[10px] text-slate-500">{new Date(t.timestamp).toLocaleDateString()} by {t.actor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
