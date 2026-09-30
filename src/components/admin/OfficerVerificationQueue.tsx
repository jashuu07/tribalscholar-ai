import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
} from 'lucide-react';

interface OfficerVerificationQueueProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const OfficerVerificationQueue: React.FC<OfficerVerificationQueueProps> = ({ onNavigate }) => {
  const { applications, updateApplicationStatus, officerReviewDocument } = useApp();

  const [filterScheme, setFilterScheme] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredApps = applications.filter((app) => {
    if (filterScheme !== 'ALL' && app.schemeCode !== filterScheme) return false;
    if (filterStatus !== 'ALL' && app.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        app.applicationNumber.toLowerCase().includes(term) ||
        app.studentName.toLowerCase().includes(term) ||
        app.studentState.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const [selectedApp, setSelectedApp] = useState(filteredApps[0] || applications[0]);
  const [officerRemarks, setOfficerRemarks] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gov-blue text-white">
              Official Scrutiny Desk
            </span>
            <span className="text-xs text-slate-500">Ministry of Tribal Affairs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Officer Verification & Eligibility Adjudication Queue
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Review document credentials, evaluate deterministic eligibility rules, and grant formal approvals.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Total in Queue: {filteredApps.length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by candidate name, application no, state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterScheme}
            onChange={(e) => setFilterScheme(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 bg-white font-medium"
          >
            <option value="ALL">All Schemes</option>
            <option value="NFST-2026">NFST 2026</option>
            <option value="NOS-2026">NOS 2026</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 bg-white font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="DOCUMENT_VERIFICATION">Document Verification</option>
            <option value="DEFICIENCY">Deficiency</option>
            <option value="RE_SUBMITTED">Re-Submitted</option>
            <option value="ELIGIBILITY_CHECK">Eligibility Check</option>
            <option value="SELECTED">Selected</option>
          </select>
        </div>
      </div>

      {/* Split Layout: Applications List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Apps List */}
        <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                selectedApp?.id === app.id
                  ? 'bg-blue-50/80 border-gov-blue ring-2 ring-blue-300/30 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900">{app.applicationNumber}</span>
                <StatusBadge status={app.status} size="sm" />
              </div>
              <div className="font-bold text-slate-800 text-xs mt-1">{app.studentName}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {app.stCommunity} • {app.studentState} • {app.schemeCode}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">
                  Income: ₹{app.formData.annualIncome.toLocaleString('en-IN')}
                </span>
                <span className="font-bold text-gov-navy">
                  Score: {app.score || 85}/100
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2 Cols: Detail Reviewer */}
        <div className="lg:col-span-2 space-y-5">
          {selectedApp ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gov-navy text-sm">
                      {selectedApp.applicationNumber}
                    </span>
                    <StatusBadge status={selectedApp.status} size="md" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    {selectedApp.studentName} ({selectedApp.stCommunity}, {selectedApp.studentState})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Scheme: {selectedApp.schemeName} | Email: {selectedApp.studentEmail}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Candidate Merit Score</span>
                  <span className="text-2xl font-black text-gov-navy">
                    {selectedApp.score || 85}<span className="text-xs font-normal text-slate-400">/100</span>
                  </span>
                </div>
              </div>

              {/* Deterministic Rule Evaluation Matrix */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gov-blue" />
                  <span>Rule Engine Evaluation Breakdown</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedApp.eligibilityEvaluation?.ruleResults.map((rule) => (
                    <div
                      key={rule.ruleId}
                      className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                        rule.passed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-red-50/60 border-red-200'
                      }`}
                    >
                      {rule.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block">{rule.fieldLabel}</span>
                        <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">
                          {rule.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Scrutiny List */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Uploaded Verification Documents ({selectedApp.documents.length})
                </h4>
                <div className="space-y-2.5">
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gov-navy shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{doc.name}</span>
                            <StatusBadge status={doc.status} size="sm" />
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {doc.fileName} • Conf: {doc.aiResult?.confidence || 95}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {doc.status === 'MISMATCH_DETECTED' && (
                          <button
                            onClick={() => onNavigate('admin-ai-queue')}
                            className="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>View Mismatch</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            officerReviewDocument(selectedApp.id, doc.id, 'APPROVED', 'Verified by officer.');
                            alert(`Document ${doc.name} approved.`);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg"
                        >
                          Approve Doc
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Decision Bar */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Adjudicate Application Stage
                </h4>

                <input
                  type="text"
                  placeholder="Officer remarks / instructions for applicant or committee..."
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                />

                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      updateApplicationStatus(
                        selectedApp.id,
                        'DEFICIENCY',
                        officerRemarks || 'Officer requested document rectification'
                      );
                      alert('Deficiency raised and sent to student.');
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
                  >
                    Raise Deficiency
                  </button>

                  <button
                    onClick={() => {
                      updateApplicationStatus(
                        selectedApp.id,
                        'SCREENING',
                        officerRemarks || 'Candidate advanced to merit screening committee'
                      );
                      alert('Application moved to Screening.');
                    }}
                    className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl"
                  >
                    Advance to Screening
                  </button>

                  <button
                    onClick={() => {
                      updateApplicationStatus(
                        selectedApp.id,
                        'SELECTED',
                        officerRemarks || 'Candidate formally selected under National Tribal Fellowship quota'
                      );
                      alert('Candidate selected!');
                    }}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Award Fellowship (Select)
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
