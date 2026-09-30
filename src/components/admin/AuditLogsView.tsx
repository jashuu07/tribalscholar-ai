import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Search,
  Filter,
  Sparkles,
  Download,
  Clock,
  UserCheck,
  FileText,
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterRole !== 'ALL' && log.userRole !== filterRole) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(term) ||
        log.userName.toLowerCase().includes(term) ||
        (log.applicationNumber && log.applicationNumber.toLowerCase().includes(term)) ||
        (log.reason && log.reason.toLowerCase().includes(term)) ||
        (log.aiFinding && log.aiFinding.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const exportAuditJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `TribalScholar_AuditTrail_${Date.now()}.json`);
    dlAnchor.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gov-navy text-white">
              Immutable Audit Ledger
            </span>
            <span className="text-xs text-slate-500">NIC-GovNet Security Compliant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Official System Audit & Decision Trail
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Every AI extraction finding, officer override, deficiency issuance, and status mutation is cryptographically timestamped.
          </p>
        </div>

        <button
          onClick={exportAuditJSON}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-1.5 shadow-2xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Forensic Audit JSON</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, user, application no, AI finding..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 bg-white font-medium"
          >
            <option value="ALL">All Roles ({auditLogs.length})</option>
            <option value="SYSTEM_AI">SYSTEM_AI (Document OCR)</option>
            <option value="OFFICER">OFFICER (Human Reviewer)</option>
            <option value="ADMIN">ADMIN (Scheme Config)</option>
            <option value="STUDENT">STUDENT (Applicant)</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Application</th>
                <th className="py-3 px-4">AI Finding / Officer Decision</th>
                <th className="py-3 px-4">Reason / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        log.userRole === 'SYSTEM_AI'
                          ? 'bg-blue-100 text-blue-800'
                          : log.userRole === 'OFFICER'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-gov-navy font-bold whitespace-nowrap">
                    {log.applicationNumber || log.applicationId || '—'}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    {log.aiFinding && (
                      <div className="text-[11px] text-blue-900 bg-blue-50/70 p-1.5 rounded border border-blue-200">
                        <strong>AI:</strong> {log.aiFinding}
                      </div>
                    )}
                    {log.officerDecision && (
                      <div className="text-[11px] text-amber-900 bg-amber-50/70 p-1.5 rounded border border-amber-200 mt-1">
                        <strong>Decision:</strong> {log.officerDecision}
                      </div>
                    )}
                    {!log.aiFinding && !log.officerDecision && '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px] max-w-sm">
                    {log.reason || '—'}
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
