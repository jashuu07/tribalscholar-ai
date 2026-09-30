import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  IndianRupee,
  CheckCircle2,
  Clock,
  Download,
  UploadCloud,
  FileText,
  Calendar,
  Building,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

interface FellowshipDashboardProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const FellowshipDashboard: React.FC<FellowshipDashboardProps> = ({ onNavigate }) => {
  const { currentUser, applications } = useApp();

  // Find user application with fellowship details, or fallback to demo application
  const appWithFellowship =
    applications.find((a) => a.studentId === currentUser.id && a.fellowshipDetails) ||
    applications.find((a) => a.fellowshipDetails) ||
    applications[0];

  const fellowship = appWithFellowship?.fellowshipDetails || {
    fellowshipAwardNumber: 'MOTA/NFST/2026/AW-1042',
    awardDate: '2026-03-01',
    tenureYears: 5,
    monthlyStipend: 37000,
    annualContingency: 25000,
    totalSanctioned: 2345000,
    totalDisbursed: 74000,
    universityName: 'Ranchi University (Tribal & Regional Languages)',
    researchTopic: 'Ethnobotany & Rights Documentation of Eastern Indian Tribes',
    guideName: 'Prof. Animesh Beck, Senior Research Supervisor',
    disbursements: [
      { month: 'January 2026', amount: 37000, status: 'CREDITED' as const, transactionId: 'DBT202601318819', disbursedDate: '2026-01-31' },
      { month: 'February 2026', amount: 37000, status: 'CREDITED' as const, transactionId: 'DBT202602288819', disbursedDate: '2026-02-28' },
      { month: 'March 2026', amount: 37000, status: 'CREDITED' as const, transactionId: 'DBT202603318819', disbursedDate: '2026-03-31' },
      { month: 'April 2026', amount: 37000, status: 'PROCESSING' as const, disbursedDate: 'Expected 2026-04-30' },
    ],
    quarterlyReports: [
      {
        id: 'qr-1',
        quarter: 'Q1 (Jan - Mar 2026)',
        academicYear: '2026-27',
        title: 'Tribal Field Survey & Indigenous Botanical Taxonomy Documentation',
        status: 'APPROVED' as const,
        submittedDate: '2026-03-25',
        mentorName: 'Prof. Animesh Beck',
        mentorRemarks: 'Field data validated from 14 tribal settlements. Methodology approved.',
        publicationsCount: 1,
      },
      {
        id: 'qr-2',
        quarter: 'Q2 (Apr - Jun 2026)',
        academicYear: '2026-27',
        title: 'Herbarium Sample Analysis & Phytochemical Profiling',
        status: 'PENDING' as const,
        mentorName: 'Prof. Animesh Beck',
      },
    ],
  };

  const [activeTab, setActiveTab] = useState<'disbursements' | 'reports'>('disbursements');
  const [showUploadReport, setShowUploadReport] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [downloadAlert, setDownloadAlert] = useState(false);

  const handleDownloadSanction = () => {
    setDownloadAlert(true);
    setTimeout(() => setDownloadAlert(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy via-gov-dark to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Active Fellowship Sanction
              </span>
              <span className="text-xs text-slate-300">Direct Benefit Transfer (DBT)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              National Fellowship Post-Selection Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Award Number: <strong className="text-amber-300 font-mono">{fellowship.fellowshipAwardNumber}</strong> | Supervisor: {fellowship.guideName}
            </p>
          </div>

          <button
            onClick={handleDownloadSanction}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Download Digital Sanction Order</span>
          </button>
        </div>

        {downloadAlert && (
          <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-200 animate-in fade-in">
            ✓ Digital Sanction Letter with QR Code and Government of India seal downloaded successfully!
          </div>
        )}
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Monthly Fellowship (JRF)</span>
          <span className="text-2xl font-black text-gov-navy mt-1 block">
            ₹{fellowship.monthlyStipend.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Aadhaar-NPCI Seeded
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Annual Contingency Grant</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            ₹{fellowship.annualContingency.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">For field research & books</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Total Disbursed to Date</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            ₹{fellowship.totalDisbursed.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Direct Bank Credit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Tenure Remaining</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            4.5 Years
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Max 5 Years Full-Time Ph.D.</span>
        </div>
      </div>

      {/* Tabs: Disbursements vs Quarterly Reports */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 px-6 flex items-center gap-6">
          <button
            onClick={() => setActiveTab('disbursements')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'disbursements'
                ? 'border-gov-navy text-gov-navy'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            <span>Monthly Stipend Disbursement Ledger</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-gov-navy text-gov-navy'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quarterly Research Progress Reports</span>
          </button>
        </div>

        {/* Tab 1: Disbursements */}
        {activeTab === 'disbursements' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Billing Cycle</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">PFMS / DBT Reference</th>
                    <th className="py-3 px-3">Disbursed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fellowship.disbursements.map((d, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{d.month}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        ₹{d.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === 'CREDITED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {d.status === 'CREDITED' ? 'Directly Credited (DBT)' : 'PFMS Processing'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                        {d.transactionId || 'Pending Batch Generation'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {d.disbursedDate || 'Scheduled 30-Apr-2026'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Quarterly Progress Reports */}
        {activeTab === 'reports' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Mandatory Doctoral Progress Reports</h4>
                <p className="text-xs text-slate-500">Stipend continuation requires quarterly review endorsed by Research Guide</p>
              </div>
              <button
                onClick={() => setShowUploadReport(!showUploadReport)}
                className="px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Q2 Progress Report</span>
              </button>
            </div>

            {showUploadReport && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs animate-in fade-in">
                <h5 className="font-bold text-slate-900">Submit Quarterly Report (Q2 2026)</h5>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Report Title / Summary</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="e.g. Phytochemical screening of selected medicinal herbs..."
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="border border-dashed border-slate-300 p-3 rounded-lg text-center bg-white cursor-pointer">
                  <p className="text-slate-600 font-medium">Attach Signed Supervisor Progress Proforma (PDF, Max 5MB)</p>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowUploadReport(false)}
                    className="px-3 py-1.5 bg-slate-200 rounded-lg text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert('Progress report submitted and forwarded to Research Supervisor & Ministry Scrutiny Cell.');
                      setShowUploadReport(false);
                    }}
                    className="px-4 py-1.5 bg-gov-blue text-white rounded-lg font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {fellowship.quarterlyReports.map((qr) => (
                <div key={qr.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{qr.quarter} - {qr.academicYear}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        qr.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {qr.status}
                    </span>
                  </div>
                  <p className="font-medium text-slate-800 mt-1">{qr.title}</p>
                  {qr.mentorRemarks && (
                    <div className="mt-2 p-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px]">
                      <strong>Supervisor Remarks:</strong> "{qr.mentorRemarks}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
