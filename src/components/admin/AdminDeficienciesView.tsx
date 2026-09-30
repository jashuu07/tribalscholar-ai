import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface AdminDeficienciesViewProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const AdminDeficienciesView: React.FC<AdminDeficienciesViewProps> = ({ onNavigate }) => {
  const { applications, officerReviewDocument } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Collect all deficiencies with application context
  const allDeficiencies = applications.flatMap((app) =>
    (app.deficiencies || []).map((def) => ({
      ...def,
      applicationId: app.id,
      applicationNumber: app.applicationNumber,
      studentName: app.studentName,
      schemeCode: app.schemeCode,
      studentState: app.studentState,
    }))
  );

  const filtered = allDeficiencies.filter((d) => {
    if (filterStatus !== 'ALL' && d.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        d.applicationNumber.toLowerCase().includes(term) ||
        d.studentName.toLowerCase().includes(term) ||
        d.title.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Scrutiny Governance
            </span>
            <span className="text-xs text-slate-500">Ministry of Tribal Affairs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Deficiency & Discrepancy Redressal Central Desk
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Monitor and resolve applicant document discrepancies with full audit compliance.
          </p>
        </div>

        <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          Total Flagged: {allDeficiencies.length} Cases
        </span>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by candidate name, application no, reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-hidden font-medium"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 rounded-lg border border-slate-200 bg-white font-medium"
        >
          <option value="ALL">All Statuses ({allDeficiencies.length})</option>
          <option value="OPEN">OPEN</option>
          <option value="RESPONDED">RESPONDED</option>
          <option value="UNDER REVIEW">UNDER REVIEW</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="ESCALATED">ESCALATED</option>
        </select>
      </div>

      {/* Deficiencies Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">Candidate & State</th>
                <th className="py-3 px-4">Deficiency Issue</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gov-navy whitespace-nowrap">
                    {d.applicationNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{d.studentName}</div>
                    <div className="text-[11px] text-slate-500">{d.schemeCode} • {d.studentState}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <span className="font-bold text-slate-900 block">{d.title}</span>
                    <span className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{d.description}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        d.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {d.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {d.status === 'RESOLVED' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span>{d.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onNavigate('admin-verification', { appId: d.applicationId })}
                      className="px-2.5 py-1 text-xs font-semibold text-gov-blue hover:bg-blue-50 rounded-lg border border-blue-200"
                    >
                      Inspect
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
