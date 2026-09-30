import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scheme } from '../../types';
import { SchemeRuleBuilderModal } from './SchemeRuleBuilderModal';
import {
  Sliders,
  Plus,
  CheckCircle2,
  Calendar,
  IndianRupee,
  FileText,
  Trash2,
  Edit3,
  Award,
} from 'lucide-react';

interface SchemeManagementProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const SchemeManagement: React.FC<SchemeManagementProps> = ({ onNavigate }) => {
  const { schemes, deleteScheme } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | undefined>(undefined);

  const handleCreateNew = () => {
    setEditingScheme(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (s: Scheme) => {
    setEditingScheme(s);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gov-navy text-white">
              Scheme Engine Administration
            </span>
            <span className="text-xs text-slate-500">Ministry of Tribal Affairs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Configurable Scholarship Schemes & Rule Governance
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Create, update, or deprecate schemes with dynamic deterministic eligibility criteria without redeploying code.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-2.5 bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Scholarship Scheme</span>
        </button>
      </div>

      {/* Schemes List Cards */}
      <div className="space-y-6">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gov-navy text-white flex items-center justify-center font-bold">
                  <Award className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {scheme.code}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    {scheme.name}
                  </h3>
                  {scheme.hindiName && (
                    <p className="text-xs text-slate-500 font-serif mt-0.5">{scheme.hindiName}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(scheme)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Configure Rules</span>
                </button>
                {schemes.length > 2 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete scheme ${scheme.code}?`)) {
                        deleteScheme(scheme.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Scheme Metadata & Configured Rules Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column: Configured Rules */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span>Deterministic Rule Matrix ({scheme.ruleGroups[0]?.logicalOperator} Logic)</span>
                  <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-mono">
                    {scheme.ruleGroups[0]?.rules.length} Active Rules
                  </span>
                </h4>

                <div className="space-y-2">
                  {scheme.ruleGroups[0]?.rules.map((rule, idx) => (
                    <div
                      key={rule.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-gov-navy text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{rule.fieldLabel}</span>
                          <span className="font-mono text-blue-700 font-bold">
                            {rule.operator}{' '}
                            {typeof rule.value === 'number'
                              ? `₹${rule.value.toLocaleString('en-IN')}`
                              : Array.isArray(rule.value)
                              ? `[${rule.value.join(', ')}]`
                              : rule.value}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Required Documents */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Configured Verification Document Pipeline ({scheme.requiredDocuments.length})
                </h4>

                <div className="space-y-2">
                  {scheme.requiredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-gov-navy shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900">{doc.name}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {doc.docType} (Max {doc.maxSizeMB}MB)
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          doc.mandatory ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {doc.mandatory ? 'Mandatory' : 'Optional'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Rule Builder Modal */}
      <SchemeRuleBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingScheme={editingScheme}
      />
    </div>
  );
};
