import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateSchemeEligibility } from '../../services/ruleEngine';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calculator,
  SlidersHorizontal,
} from 'lucide-react';

interface EligibilityCheckerProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ onNavigate }) => {
  const { schemes, currentUser } = useApp();

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemes[0]?.id || '');
  const [category, setCategory] = useState<string>('ST');
  const [annualIncome, setAnnualIncome] = useState<number>(currentUser.annualIncome || 180000);
  const [educationLevel, setEducationLevel] = useState<string>('PhD');
  const [degreePercentage, setDegreePercentage] = useState<number>(74.5);
  const [age, setAge] = useState<number>(27);

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  const candidateData = {
    category,
    annualIncome: Number(annualIncome),
    educationLevel,
    degreePercentage: Number(degreePercentage),
    age: Number(age),
  };

  const evaluation = selectedScheme
    ? evaluateSchemeEligibility(selectedScheme.ruleGroups, candidateData)
    : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gov-navy text-white flex items-center justify-center">
            <Calculator className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Deterministic Scheme Eligibility Checker
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Live mathematical evaluation powered by the configurable rule engine. 100% transparent explanations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Input Form Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <SlidersHorizontal className="w-4 h-4 text-gov-blue" />
            <span>Candidate Evaluation Parameters</span>
          </h3>

          {/* Scheme Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Fellowship / Scholarship Scheme
            </label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-blue bg-white font-medium"
            >
              {schemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Social Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Social Category (Reservation Status)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-blue bg-white font-medium"
            >
              <option value="ST">Scheduled Tribe (ST) - Notified</option>
              <option value="SC">Scheduled Caste (SC)</option>
              <option value="OBC">Other Backward Class (OBC)</option>
              <option value="GENERAL">General / Unreserved</option>
            </select>
          </div>

          {/* Family Annual Income */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Annual Family Income (Gross All Sources)
              </label>
              <span className="text-xs font-bold text-gov-navy">
                ₹{Number(annualIncome).toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="1200000"
              step="10000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full accent-gov-navy cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>₹50,000</span>
              <span>₹6,00,000 (NFST Limit)</span>
              <span>₹12,00,000</span>
            </div>
          </div>

          {/* Course Enrolled */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Highest / Current Degree Level
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-blue bg-white font-medium"
            >
              <option value="PhD">Ph.D. (Doctoral Research)</option>
              <option value="MPhil">M.Phil. (Pre-Doctoral)</option>
              <option value="Masters">Masters / Post-Graduate</option>
              <option value="UnderGraduate">Under-Graduate (B.Tech / B.A / B.Sc)</option>
            </select>
          </div>

          {/* Aggregate Marks */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Post-Graduate Qualifying Marks (%)
              </label>
              <span className="text-xs font-bold text-gov-navy">{degreePercentage}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="0.5"
              value={degreePercentage}
              onChange={(e) => setDegreePercentage(Number(e.target.value))}
              className="w-full accent-gov-navy cursor-pointer"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Candidate Age (Years)
            </label>
            <input
              type="number"
              min="18"
              max="60"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
        </div>

        {/* Right Column: Deterministic Rule Matrix Result */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Rule Evaluation Verdict</span>
              {evaluation?.isEligible ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ELIGIBLE
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  CRITERIA NOT MET
                </span>
              )}
            </h3>

            {/* Scheme Summary */}
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">{selectedScheme?.name}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Stipend: <strong className="text-emerald-700">{selectedScheme?.stipendAmountText}</strong>
              </p>
            </div>

            {/* Individual Rule Breakdown */}
            <div className="mt-4 space-y-2.5">
              {evaluation?.ruleResults.map((rule) => (
                <div
                  key={rule.ruleId}
                  className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-colors ${
                    rule.passed
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-red-50/50 border-red-200 text-slate-900 font-medium'
                  }`}
                >
                  {rule.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{rule.fieldLabel}</span>
                      <span className="text-[10px] text-slate-400">
                        ({rule.operator} {String(rule.expected)})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{rule.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Explanation */}
            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                <span>Eligibility Engine Explanation:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {evaluation?.summaryExplanation}
              </p>
            </div>
          </div>

          {/* Action to Apply */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {evaluation?.passedCount} of {evaluation?.totalCount} rules satisfied
            </span>
            <button
              onClick={() => onNavigate('application-wizard', { schemeId: selectedSchemeId })}
              disabled={!evaluation?.isEligible}
              className="px-5 py-2.5 bg-gov-blue hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Proceed to Application Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
