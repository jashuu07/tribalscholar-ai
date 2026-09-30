import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Users,
  FileCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { applications, schemes, auditLogs } = useApp();

  // Metrics computation
  const totalApplications = applications.length;
  const pendingVerification = applications.filter(
    (a) => a.status === 'SUBMITTED' || a.status === 'DOCUMENT_VERIFICATION' || a.status === 'RE_SUBMITTED'
  ).length;
  const aiVerified = applications.filter((a) => a.status === 'AI_VERIFIED' as any || a.documents.some((d) => d.status === 'AI_VERIFIED')).length;
  const deficient = applications.filter((a) => a.status === 'DEFICIENCY').length;
  const eligible = applications.filter((a) => a.eligibilityEvaluation?.isEligible).length;
  const ineligible = totalApplications - eligible;
  const selected = applications.filter((a) => a.status === 'SELECTED' || a.status === 'POST_SELECTION').length;
  const pendingOfficerReview = applications.filter(
    (a) => a.status === 'DOCUMENT_VERIFICATION' || a.status === 'RE_SUBMITTED' || a.status === 'DEFICIENCY'
  ).length;

  // Scheme Breakdown
  const nfstApps = applications.filter((a) => a.schemeCode === 'NFST-2026').length;
  const nosApps = applications.filter((a) => a.schemeCode === 'NOS-2026').length;

  // State Breakdown
  const stateCounts: Record<string, number> = {};
  applications.forEach((a) => {
    stateCounts[a.studentState] = (stateCounts[a.studentState] || 0) + 1;
  });
  const topStates = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Ministry Banner */}
      <div className="bg-gradient-to-r from-gov-navy via-gov-dark to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-400/30">
              Officer Command Centre
            </span>
            <span className="text-xs text-slate-300">Ministry of Tribal Affairs Scrutiny Cell</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            National Tribal Fellowship Operations Dashboard
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            Configurable Rule Engine • AI-Assisted Scrutiny • Human-in-the-Loop Oversight
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('admin-verification')}
            className="px-4 py-2 bg-gov-blue hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>Open Officer Queue ({pendingOfficerReview})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('admin-schemes')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 transition-all"
          >
            <span>Configure Schemes</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards (8 Realistic Demo Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Applications</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalApplications}</span>
          <span className="text-[10px] text-slate-500">Across 2 Schemes</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Pending Verification</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{pendingVerification}</span>
          <span className="text-[10px] text-blue-600 font-semibold">In Scrutiny</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">AI Verified</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{aiVerified}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">96% Avg Conf</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-amber-300 bg-amber-50/30 shadow-2xs">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Deficient</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{deficient}</span>
          <span className="text-[10px] text-amber-700 font-bold">Action Required</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Eligible (Rules)</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{eligible}</span>
          <span className="text-[10px] text-slate-500">Rules Satisfied</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ineligible</span>
          <span className="text-2xl font-black text-slate-500 mt-1 block">{ineligible}</span>
          <span className="text-[10px] text-slate-400">Income / Marks</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/20 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Selected</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{selected}</span>
          <span className="text-[10px] text-emerald-700 font-bold">Sanction Issued</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-gov-navy uppercase tracking-wider block">Pending Officer</span>
          <span className="text-2xl font-black text-gov-navy mt-1 block">{pendingOfficerReview}</span>
          <span className="text-[10px] text-slate-500">Sign-Off Queue</span>
        </div>
      </div>

      {/* Charts & Graphical Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 1: Applications by Scheme */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Applications by Scheme</span>
              <PieChart className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>NFST 2026 (Doctoral Fellowship)</span>
                  <span className="font-bold text-gov-navy">{nfstApps} ({Math.round((nfstApps / totalApplications) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gov-navy h-full rounded-full"
                    style={{ width: `${(nfstApps / totalApplications) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>NOS 2026 (Overseas Scholarship)</span>
                  <span className="font-bold text-orange-600">{nosApps} ({Math.round((nosApps / totalApplications) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full"
                    style={{ width: `${(nosApps / totalApplications) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Annual NFST Quota: 750 slots</span>
            <span>NOS Quota: 20 slots</span>
          </div>
        </div>

        {/* Chart 2: State-wise Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Top States Representation</span>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-2 text-xs">
              {topStates.map(([st, count]) => (
                <div key={st} className="flex items-center gap-2">
                  <span className="w-28 truncate font-medium text-slate-700">{st}</span>
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gov-blue h-full rounded-full"
                      style={{ width: `${(count / totalApplications) * 100 * 3}%` }}
                    ></div>
                  </div>
                  <span className="w-6 text-right font-bold text-slate-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-right">
            Pan-India Tribal Representation
          </div>
        </div>

        {/* Chart 3: Turnaround Processing Time Impact */}
        <div className="bg-gradient-to-br from-blue-900 to-gov-navy text-white p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Turnaround Time Impact
              </span>
            </div>
            <h3 className="text-base font-extrabold mt-2">
              Processing Time Reduction
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Automated OCR parsing & deterministic rules eliminate manual data verification delays.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Manual Process</span>
                <span className="text-xl font-bold text-red-300 block mt-0.5">45 Days</span>
                <span className="text-[10px] text-slate-300">Legacy physical scrutiny</span>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30">
                <span className="text-[10px] text-emerald-300 block uppercase font-bold">TribalScholar AI</span>
                <span className="text-xl font-black text-emerald-300 block mt-0.5">3.5 Days</span>
                <span className="text-[10px] text-emerald-200">92% reduction</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-slate-300 text-center">
            Advisory AI + 100% Human Officer Sign-Off
          </div>
        </div>
      </div>

      {/* Critical Verification Queue Callout (Focus on Income Mismatch) */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 uppercase">
                  AI Review Queue Alert
                </span>
                <span className="text-xs font-bold text-amber-950 font-mono">
                  TS-2026-NFST-0012 (Aruna Kerketta)
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-amber-950 mt-1">
                Advisory Income Mismatch Flagged (App: ₹1,80,000 vs Cert: ₹2,80,000)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 max-w-2xl">
                Confidence: 95% | Status: REVIEW REQUIRED. Human scrutiny officer oversight required before advancing candidate to selection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('admin-ai-queue')}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Review Advisory Finding →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Applications Ingestion Queue</h3>
            <p className="text-xs text-slate-500">Live applications under scrutiny</p>
          </div>
          <button
            onClick={() => onNavigate('admin-applications')}
            className="text-xs font-semibold text-gov-blue hover:underline"
          >
            View All ({totalApplications}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Application No</th>
                <th className="py-3 px-4">Candidate & Tribe</th>
                <th className="py-3 px-4">Scheme</th>
                <th className="py-3 px-4">Declared Income</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Eligibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.slice(0, 6).map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {app.applicationNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{app.studentName}</div>
                    <div className="text-[11px] text-slate-500">{app.stCommunity} • {app.studentState}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700">{app.schemeCode}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    ₹{app.formData.annualIncome.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    {app.eligibilityEvaluation?.isEligible ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
                        <XCircle className="w-3.5 h-3.5" />
                        Review
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigate('admin-verification', { appId: app.id })}
                      className="px-2.5 py-1 text-xs font-semibold text-gov-blue hover:bg-blue-50 rounded-lg border border-blue-200"
                    >
                      Scrutiny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
