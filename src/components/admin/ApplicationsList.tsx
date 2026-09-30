import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

interface ApplicationsListProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const ApplicationsList: React.FC<ApplicationsListProps> = ({ onNavigate }) => {
  const { applications, schemes } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterScheme, setFilterScheme] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterState, setFilterState] = useState('ALL');

  // Extract unique states
  const states = Array.from(new Set(applications.map((a) => a.studentState))).sort();

  const filteredApps = applications.filter((app) => {
    if (filterScheme !== 'ALL' && app.schemeCode !== filterScheme) return false;
    if (filterStatus !== 'ALL' && app.status !== filterStatus) return false;
    if (filterState !== 'ALL' && app.studentState !== filterState) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        app.applicationNumber.toLowerCase().includes(term) ||
        app.studentName.toLowerCase().includes(term) ||
        app.stCommunity.toLowerCase().includes(term) ||
        app.studentEmail.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['Application Number', 'Candidate Name', 'Tribe', 'State', 'Scheme', 'Income', 'Marks', 'Status', 'Merit Score'];
    const rows = filteredApps.map((a) => [
      a.applicationNumber,
      `"${a.studentName}"`,
      a.stCommunity,
      a.studentState,
      a.schemeCode,
      a.formData.annualIncome,
      a.formData.degreePercentage,
      a.status,
      a.score || 80,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TribalScholar_Applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gov-blue text-white">
              Central Registry
            </span>
            <span className="text-xs text-slate-500">Scheduled Tribe Candidates</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Master Applications Dossier Registry
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Full repository of all pan-India fellowship applications with real-time audit statuses.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Master CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, tribe, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-hidden font-medium"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterScheme}
            onChange={(e) => setFilterScheme(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 bg-white font-medium"
          >
            <option value="ALL">All Schemes ({applications.length})</option>
            {schemes.map((s) => (
              <option key={s.id} value={s.code}>
                {s.code}
              </option>
            ))}
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
            <option value="SCREENING">Screening</option>
            <option value="SELECTED">Selected</option>
            <option value="POST_SELECTION">Post-Selection Active</option>
          </select>

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 bg-white font-medium"
          >
            <option value="ALL">All States</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Scholar Details</th>
                <th className="py-3 px-4">Scheme</th>
                <th className="py-3 px-4">Income & Marks</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Merit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gov-navy whitespace-nowrap">
                    {app.applicationNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{app.studentName}</div>
                    <div className="text-[11px] text-slate-500">
                      {app.stCommunity} Tribe • {app.studentState}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">{app.schemeCode}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      ₹{app.formData.annualIncome.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500">{app.formData.degreePercentage}% Marks</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-slate-700 font-medium">
                      {app.documents.length} Uploaded
                    </span>
                    {app.documents.some((d) => d.status === 'MISMATCH_DETECTED') && (
                      <span className="ml-1.5 w-2 h-2 rounded-full bg-amber-500 inline-block" title="Mismatch flagged"></span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                    {app.score || 85}/100
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onNavigate('admin-verification', { appId: app.id })}
                      className="px-2.5 py-1 text-xs font-semibold text-gov-blue hover:bg-blue-50 rounded-lg border border-blue-200"
                    >
                      Review
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
