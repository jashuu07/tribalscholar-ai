import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  IndianRupee,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  FileText,
  Search,
} from 'lucide-react';

export const AdminFellowshipView: React.FC = () => {
  const { applications } = useApp();

  const selectedApps = applications.filter(
    (a) => a.status === 'SELECTED' || a.status === 'POST_SELECTION'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Post-Selection Management
            </span>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              Demo DBT Data — Prototype
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Fellowship Directorate & Direct Benefit Transfer (DBT) Oversight
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Monitor monthly doctoral research stipend releases, contingency grants, and PFMS payment vouchers.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Total Active Scholars</span>
          <span className="text-2xl font-black text-gov-navy">{selectedApps.length}</span>
        </div>
      </div>

      {/* Disbursal Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-400 block uppercase font-bold">Monthly Stipend Standard</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">₹37,000 / month</span>
          <span className="text-[10px] text-slate-500">Junior Research Fellowship (JRF)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-400 block uppercase font-bold">Total Disbursed (Demo Batch)</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">₹14,80,000</span>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Aadhaar-NPCI Seeded</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-400 block uppercase font-bold">Annual Contingency Grant</span>
          <span className="text-xl font-black text-gov-navy mt-1 block">₹25,000 / year</span>
          <span className="text-[10px] text-slate-500">Field survey & publication support</span>
        </div>
      </div>

      {/* Scholars Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Active Fellowship Awardees & DBT Ledger
          </h3>
          <span className="text-[11px] text-slate-400">Direct PFMS Batch Integration Simulation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Award ID</th>
                <th className="py-3 px-4">Scholar & Tribe</th>
                <th className="py-3 px-4">University</th>
                <th className="py-3 px-4">Monthly Stipend</th>
                <th className="py-3 px-4">Latest DBT Status</th>
                <th className="py-3 px-4">Aadhaar Bank Mandate</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedApps.map((a, idx) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gov-navy">
                    {a.fellowshipDetails?.fellowshipAwardNumber || `MOTA/NFST/2026/AW-${1000 + idx}`}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{a.studentName}</div>
                    <div className="text-[11px] text-slate-500">{a.stCommunity} • {a.studentState}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {a.formData.universityName}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹37,000
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>CREDITED (DBT)</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                    SBI • {a.formData.bankAccountNumber.slice(-4).padStart(8, 'X')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Sanction Order for ${a.studentName} generated.`)}
                      className="px-2.5 py-1 text-xs font-semibold text-gov-blue hover:bg-blue-50 rounded-lg border border-blue-200"
                    >
                      Sanction Order
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
