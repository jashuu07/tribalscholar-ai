import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Server,
  Key,
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { resetAllData } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-navy text-white flex items-center justify-center font-bold">
            <Settings className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              System Settings & Governance Disclaimers
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Smart India Hackathon 2026 Environment Configuration (#SIH26239)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Compliance Notice */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Government Integration Disclaimers</span>
          </h3>

          <div className="space-y-2 text-slate-600 leading-relaxed">
            <p>
              • <strong>Prototype Environment:</strong> This application is engineered as a functional prototype for SIH 2026.
            </p>
            <p>
              • <strong>Synthetic Privacy Compliance:</strong> All candidate names, Aadhaar numbers (e.g. XXXXXXXX8291), and certificate identifiers are synthetic test fixtures adhering to DPDP Act 2023 guidelines.
            </p>
            <p>
              • <strong>Advisory AI Standard:</strong> Non-deterministic agents are strictly decoupled from automated disqualifications. Final legal decisions remain exclusively with authorized human scrutiny officers.
            </p>
          </div>
        </div>

        {/* Environment Architecture */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Server className="w-4 h-4 text-gov-blue" />
            <span>Environment Architecture</span>
          </h3>

          <div className="space-y-2.5 font-mono text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px]">VITE_API_URL</span>
              <span className="text-slate-800 font-bold">Local Service Abstraction (Decoupled)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px]">DATABASE_URL</span>
              <span className="text-slate-800 font-bold">PostgreSQL Relational Schema (3NF)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px]">AI_OCR_PROVIDER</span>
              <span className="text-emerald-700 font-bold">Local Sovereign OCR Simulator (Zero External API Keys)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Demo Data Card */}
      <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Reset Demo State</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset all applications, dynamically configured schemes, and audit trails to the initial SIH judging state.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Reset all demo applications and rule configs to initial clean state?')) {
              resetAllData();
              alert('Demo data reset to clean initial state!');
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demo Data</span>
        </button>
      </div>
    </div>
  );
};
