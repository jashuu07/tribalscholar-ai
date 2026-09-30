import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  UploadCloud,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentUser, applications, schemes, notifications } = useApp();

  const userApps = applications.filter((a) => a.studentId === currentUser.id);
  const primaryApp = userApps[0] || applications[0]; // fallback to demo app

  const openDeficiencies = primaryApp?.deficiencies?.filter((d) => d.status === 'OPEN') || [];
  const hasDeficiency = openDeficiencies.length > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gov-navy via-gov-dark to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none">
          <Award className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-400/30">
              National Tribal Fellowship Portal
            </span>
            <span className="text-xs text-slate-300">Academic Year 2026–2027</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-slate-300 text-sm mt-1 leading-relaxed">
            Community: <strong className="text-amber-300">{currentUser.stCommunity || 'Scheduled Tribe'}</strong> | Domicile: <strong className="text-white">{currentUser.state}</strong> | Institute: <strong className="text-white">{currentUser.university || 'Central University'}</strong>
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('student-checker')}
              className="px-4 py-2 bg-gov-blue hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Check Scheme Eligibility</span>
            </button>
            <button
              onClick={() => onNavigate('student-schemes')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <span>Explore Available Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* URGENT ACTION ALERT BANNER (If Deficiency Exists) */}
      {hasDeficiency && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase tracking-wider">
                    Action Required
                  </span>
                  <span className="text-xs text-amber-900 font-semibold">
                    Application #{primaryApp.applicationNumber}
                  </span>
                </div>
                <h3 className="text-base font-bold text-amber-950 mt-0.5">
                  Deficiency Raised on Income Certificate (Mismatch Detected)
                </h3>
                <p className="text-xs text-amber-800 mt-1 max-w-2xl">
                  {openDeficiencies[0].description}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('student-deficiency')}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Resolve Deficiency Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Application Card */}
      {primaryApp ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {primaryApp.schemeName}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {primaryApp.schemeCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Application No: <strong className="text-slate-800">{primaryApp.applicationNumber}</strong> | Submitted: {new Date(primaryApp.submittedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={primaryApp.status} size="lg" />
              <button
                onClick={() => onNavigate('application-details', { appId: primaryApp.id })}
                className="px-3 py-1.5 text-xs font-semibold text-gov-blue hover:bg-blue-50 rounded-lg border border-blue-200"
              >
                View Full Dossier
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center p-4 bg-white">
            <div className="p-2">
              <span className="text-xs text-slate-500 block">Declared Income</span>
              <span className="text-base font-bold text-slate-900">
                ₹{primaryApp.formData.annualIncome.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2">
              <span className="text-xs text-slate-500 block">Enrolled Program</span>
              <span className="text-base font-bold text-slate-900">
                {primaryApp.formData.educationLevel} ({primaryApp.formData.degreePercentage}%)
              </span>
            </div>
            <div className="p-2">
              <span className="text-xs text-slate-500 block">Documents Uploaded</span>
              <span className="text-base font-bold text-slate-900">
                {primaryApp.documents.length} Files
              </span>
            </div>
            <div className="p-2">
              <span className="text-xs text-slate-500 block">Eligibility Status</span>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                All 5 Rules Satisfied
              </span>
            </div>
          </div>

          {/* Application Verification Stepper */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/40">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Lifecycle Verification Stepper
            </h4>
            <div className="flex items-center justify-between relative overflow-x-auto pb-2">
              {[
                { stage: 'SUBMITTED', label: 'Submitted', done: true },
                { stage: 'DOCUMENT_VERIFICATION', label: 'AI Doc OCR', done: true },
                { stage: 'DEFICIENCY', label: 'Scrutiny', current: primaryApp.status === 'DEFICIENCY', done: primaryApp.status !== 'SUBMITTED' && primaryApp.status !== 'DOCUMENT_VERIFICATION' },
                { stage: 'ELIGIBILITY_CHECK', label: 'Rule Engine', done: primaryApp.status === 'ELIGIBILITY_CHECK' || primaryApp.status === 'SCREENING' || primaryApp.status === 'SELECTED' || primaryApp.status === 'POST_SELECTION' },
                { stage: 'SELECTED', label: 'Selection', done: primaryApp.status === 'SELECTED' || primaryApp.status === 'POST_SELECTION' },
                { stage: 'POST_SELECTION', label: 'Fellowship DBT', done: primaryApp.status === 'POST_SELECTION' },
              ].map((step, idx, arr) => (
                <div key={step.stage} className="flex-1 flex flex-col items-center text-center relative px-2 min-w-[90px]">
                  {/* Connector Line */}
                  {idx < arr.length - 1 && (
                    <div
                      className={`absolute top-3.5 left-1/2 w-full h-0.5 ${
                        step.done ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    ></div>
                  )}

                  {/* Step Dot */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                      step.current
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                        : step.done
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 ${
                      step.current ? 'text-amber-800 font-bold' : step.done ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500 text-sm">No active applications found.</p>
          <button
            onClick={() => onNavigate('student-schemes')}
            className="mt-3 px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-lg"
          >
            Apply for Fellowship
          </button>
        </div>
      )}

      {/* Two Column Layout: Quick Actions & Recent Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions & Status */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gov-blue" />
              <span>Tribal Scholar Services</span>
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('student-checker')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-left"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Eligibility Pre-Check</h4>
                  <p className="text-[11px] text-slate-500">Test income, marks, and tribal criteria instantly</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('student-deficiency')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors text-left"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-amber-950">Deficiency Action Desk</h4>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  </div>
                  <p className="text-[11px] text-amber-800">Resolve flagged document mismatches</p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </button>

              <button
                onClick={() => onNavigate('student-fellowship')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors text-left"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Post-Selection & DBT Stipend</h4>
                  <p className="text-[11px] text-slate-500">Track monthly ₹37,000 disbursement & reports</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Timeline Log */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gov-blue" />
                <span>Transparent Application Audit Timeline</span>
              </h3>
              <p className="text-xs text-slate-500">Real-time scrutiny status directly from NIC-GovNet</p>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {primaryApp?.timeline?.length || 0} Events Recorded
            </span>
          </div>

          <div className="mt-4 space-y-4 max-h-96 overflow-y-auto pr-2">
            {primaryApp?.timeline?.slice().reverse().map((ev) => (
              <div key={ev.id} className="flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  {ev.actorRole === 'SYSTEM_AI' ? (
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  ) : ev.actorRole === 'OFFICER' ? (
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                  ) : (
                    <FileText className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div className="flex-1 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs">{ev.title}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ev.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1 leading-normal">{ev.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                    <span>Actor: <strong>{ev.actor}</strong></span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">{ev.actorRole}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
