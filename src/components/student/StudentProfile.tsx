import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  ShieldCheck,
  Building,
  GraduationCap,
  IndianRupee,
  FileText,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gov-navy text-white text-2xl font-black flex items-center justify-center shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Aadhaar NPCI Verified
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {currentUser.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {currentUser.name}
            </h2>
            <p className="text-xs text-slate-600">
              Scheduled Tribe Scholar ({currentUser.stCommunity || 'Oraon'}) | {currentUser.state}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Social Identity & Tribal Domicile */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gov-blue" />
            <span>Social & Tribal Identity Credentials</span>
          </h3>

          <div className="space-y-2.5">
            <div>
              <span className="text-slate-400 block text-[11px]">Notified ST Community</span>
              <span className="font-bold text-slate-800 text-sm">{currentUser.stCommunity || 'Oraon Tribe'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Revenue Certificate Number</span>
              <span className="font-mono font-bold text-slate-800">{currentUser.certificateNumber || 'JH/ST/2023/88194'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Domicile Jurisdiction</span>
              <span className="font-semibold text-slate-800">{currentUser.district || 'Ranchi'}, {currentUser.state}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Aadhaar NPCI Seeded Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                ✓ XXXXXXXX8291 (Linked with DBT PFMS)
              </span>
            </div>
          </div>
        </div>

        {/* Academic & Bank Details */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gov-blue" />
            <span>Academic & Financial DBT Profile</span>
          </h3>

          <div className="space-y-2.5">
            <div>
              <span className="text-slate-400 block text-[11px]">Current Institution</span>
              <span className="font-bold text-slate-800">{currentUser.university || 'Ranchi University'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Highest Degree / Enrolled Level</span>
              <span className="font-bold text-slate-800">{currentUser.educationLevel || 'Ph.D. Scholar'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Declared Family Income</span>
              <span className="font-bold text-slate-900 text-sm">
                ₹{currentUser.annualIncome ? currentUser.annualIncome.toLocaleString('en-IN') : '1,80,000'} / year
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Bank Direct Benefit Transfer (DBT)</span>
              <span className="font-mono text-slate-800">
                State Bank of India (A/c: {currentUser.bankAccountMasked || 'XXXXXX5021'})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
