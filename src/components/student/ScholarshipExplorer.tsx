import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Plane,
  Calendar,
  IndianRupee,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface ScholarshipExplorerProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const ScholarshipExplorer: React.FC<ScholarshipExplorerProps> = ({ onNavigate }) => {
  const { schemes } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredSchemes = schemes.filter((s) => {
    if (filterCategory === 'ALL') return true;
    return s.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              Schemes Directory
            </span>
            <span className="text-xs text-slate-500">Ministry of Tribal Affairs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Scheduled Tribe Scholarship & Fellowship Schemes
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Transparent, DBT-enabled national higher education and doctoral research funding.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterCategory === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Schemes ({schemes.length})
          </button>
          <button
            onClick={() => setFilterCategory('FELLOWSHIP')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterCategory === 'FELLOWSHIP' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Doctoral Fellowships
          </button>
          <button
            onClick={() => setFilterCategory('OVERSEAS_SCHOLARSHIP')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterCategory === 'OVERSEAS_SCHOLARSHIP' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overseas Studies
          </button>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gov-navy text-white flex items-center justify-center font-bold shadow-xs">
                      {scheme.category === 'OVERSEAS_SCHOLARSHIP' ? (
                        <Plane className="w-6 h-6 text-amber-300" />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-amber-300" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {scheme.code}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                        {scheme.name}
                      </h3>
                      {scheme.hindiName && (
                        <p className="text-xs text-slate-500 font-serif mt-0.5">
                          {scheme.hindiName}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 shrink-0">
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-4 line-clamp-3 leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              {/* Highlights & Rules Matrix */}
              <div className="p-6 space-y-4 bg-slate-50/50">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Fellowship / Grant</span>
                    <span className="font-bold text-gov-navy text-xs leading-tight mt-0.5 block">
                      {scheme.stipendAmountText}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Sanctioned Slots</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                      {scheme.slots} Annual Scholars
                    </span>
                  </div>
                </div>

                {/* Key Eligibility Highlights */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Configured Eligibility Criteria:
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {scheme.ruleGroups[0]?.rules.map((rule) => (
                      <div key={rule.id} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          <strong>{rule.fieldLabel}:</strong> {rule.operator}{' '}
                          {typeof rule.value === 'number'
                            ? `₹${rule.value.toLocaleString('en-IN')}`
                            : Array.isArray(rule.value)
                            ? rule.value.join(', ')
                            : rule.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Deadline */}
                <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Deadline: <strong>{new Date(scheme.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => onNavigate('student-checker')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Test Eligibility</span>
              </button>

              <button
                onClick={() => onNavigate('application-wizard', { schemeId: scheme.id })}
                className="px-5 py-2 bg-gov-navy hover:bg-gov-dark text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Apply for Scheme</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
