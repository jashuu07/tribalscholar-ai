import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { applications, schemes } = useApp();

  const total = applications.length;
  const nfstCount = applications.filter((a) => a.schemeCode === 'NFST-2026').length;
  const nosCount = applications.filter((a) => a.schemeCode === 'NOS-2026').length;

  const statusCounts: Record<string, number> = {};
  applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  const stateCounts: Record<string, number> = {};
  applications.forEach((a) => {
    stateCounts[a.studentState] = (stateCounts[a.studentState] || 0) + 1;
  });
  const sortedStates = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gov-navy text-white">
            Decision Intelligence
          </span>
          <span className="text-xs text-slate-500">Ministry Leadership Analytics</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          National Tribal Scholarship Analytics & Scheme Insights
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          Real-time visibility into tribal youth representation, verification throughput, and deficiency mitigation.
        </p>
      </div>

      {/* Grid: 4 Analytic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Scheme Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-100">
            <span>Scheme Enrollment Breakdown</span>
            <PieChart className="w-4 h-4 text-slate-400" />
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>National Fellowship for ST (NFST-2026)</span>
                <span className="font-bold text-gov-navy">{nfstCount} Scholars ({Math.round((nfstCount / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gov-navy h-full rounded-full"
                  style={{ width: `${(nfstCount / total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>National Overseas Scholarship (NOS-2026)</span>
                <span className="font-bold text-orange-600">{nosCount} Scholars ({Math.round((nosCount / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full"
                  style={{ width: `${(nosCount / total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-200">
            Total active candidate enrollment is balanced according to Ministry allocated quotas across Central Universities and Premier Institutes.
          </div>
        </div>

        {/* Card 2: Deficiency Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-100">
            <span>Primary Deficiency Categories</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Family Annual Income Discrepancy (OCR Mismatch)</span>
                <span className="font-bold text-amber-800">55%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Scan Legibility / Blurred Digital Signature</span>
                <span className="font-bold text-blue-800">25%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Outdated Financial Year Certificate</span>
                <span className="font-bold text-slate-800">20%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
            Average resolution turnaround via the student Deficiency Center is <strong>24 hours</strong> compared to 18 days under legacy postal/manual systems.
          </div>
        </div>

        {/* Card 3: Pan-India State Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-100">
            <span>Tribal Scholars by Domicile State</span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </h3>

          <div className="space-y-2 text-xs max-h-60 overflow-y-auto pr-2">
            {sortedStates.map(([st, cnt]) => (
              <div key={st} className="flex items-center gap-3">
                <span className="w-32 truncate font-semibold text-slate-700">{st}</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gov-blue h-full rounded-full"
                    style={{ width: `${(cnt / total) * 100 * 2.5}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right font-bold text-slate-900">{cnt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: AI Scrutiny Impact */}
        <div className="bg-gradient-to-br from-gov-navy to-slate-900 text-white p-5 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
              <TrendingUp className="w-4 h-4" />
              <span>Operational Efficiency & Accuracy Impact</span>
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div>
                  <span className="text-xs font-bold block">Average Turnaround Time</span>
                  <span className="text-[11px] text-slate-300">From submission to sanction</span>
                </div>
                <span className="text-lg font-black text-emerald-300">3.5 Days</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div>
                  <span className="text-xs font-bold block">Advisory OCR Field Accuracy</span>
                  <span className="text-[11px] text-slate-300">LayoutLM & Vision Parser</span>
                </div>
                <span className="text-lg font-black text-amber-300">96.8%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div>
                  <span className="text-xs font-bold block">Human-in-the-Loop Sign-Off</span>
                  <span className="text-[11px] text-slate-300">No automated disqualification</span>
                </div>
                <span className="text-lg font-black text-blue-300">100%</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 text-center">
            Aligned with Government of India Digital Service Standards
          </div>
        </div>
      </div>
    </div>
  );
};
