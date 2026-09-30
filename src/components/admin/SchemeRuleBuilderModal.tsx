import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scheme, EligibilityRule, RuleGroup, RequiredDocumentConfig, Operator } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Save,
} from 'lucide-react';

interface SchemeRuleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingScheme?: Scheme;
}

export const SchemeRuleBuilderModal: React.FC<SchemeRuleBuilderModalProps> = ({
  isOpen,
  onClose,
  existingScheme,
}) => {
  const { addScheme, updateScheme } = useApp();

  const [activeStep, setActiveStep] = useState<number>(1);

  // Step 1: Basic Scheme Details
  const [code, setCode] = useState(existingScheme?.code || 'PMRF-ST-2026');
  const [name, setName] = useState(
    existingScheme?.name || 'Prime Minister Tribal Fellowship for Advanced Research'
  );
  const [hindiName, setHindiName] = useState(
    existingScheme?.hindiName || 'अनुसूचित जनजाति के लिए प्रधान मंत्री अनुसंधान फैलोशिप'
  );
  const [category, setCategory] = useState<Scheme['category']>(
    existingScheme?.category || 'FELLOWSHIP'
  );
  const [academicYear, setAcademicYear] = useState(existingScheme?.academicYear || '2026-2027');
  const [description, setDescription] = useState(
    existingScheme?.description ||
      'Prestigious research fellowship scheme for talented Scheduled Tribe students in IITs, IISc, NITs, and Central Universities.'
  );
  const [slots, setSlots] = useState(existingScheme?.slots || 100);
  const [stipendText, setStipendText] = useState(
    existingScheme?.stipendAmountText || '₹70,000 / month + ₹2,00,000 annual research grant'
  );
  const [deadline, setDeadline] = useState(
    existingScheme?.applicationDeadline || '2026-12-31'
  );

  // Step 2: Visual Rule Builder State
  const [logicalOperator, setLogicalOperator] = useState<'AND' | 'OR'>('AND');
  const [rules, setRules] = useState<EligibilityRule[]>(
    existingScheme?.ruleGroups?.[0]?.rules || [
      {
        id: 'r-1',
        field: 'category',
        fieldLabel: 'Social Category',
        operator: '=',
        value: 'ST',
        description: 'Must belong to Scheduled Tribe community',
        category: 'SOCIAL',
      },
      {
        id: 'r-2',
        field: 'annualIncome',
        fieldLabel: 'Annual Family Income',
        operator: '<=',
        value: 800000,
        description: 'Family gross income under 8 lakhs',
        category: 'INCOME',
      },
      {
        id: 'r-3',
        field: 'educationLevel',
        fieldLabel: 'Education Level',
        operator: '=',
        value: 'PhD',
        description: 'Must be enrolled in PhD program',
        category: 'ACADEMIC',
      },
      {
        id: 'r-4',
        field: 'degreePercentage',
        fieldLabel: 'Qualifying Degree Marks',
        operator: '>=',
        value: 65,
        description: 'Minimum 65% aggregate',
        category: 'ACADEMIC',
      },
    ]
  );

  // Step 3: Required Documents Configuration
  const [documents, setDocuments] = useState<RequiredDocumentConfig[]>(
    existingScheme?.requiredDocuments || [
      {
        id: 'd-1',
        docType: 'ST_CERTIFICATE',
        name: 'ST Community Certificate',
        description: 'Issued by SDM/Tahasildar with barcode',
        mandatory: true,
        allowedFormats: ['PDF', 'JPG'],
        maxSizeMB: 2,
        extractedKeyFields: ['certificateNumber', 'community'],
      },
      {
        id: 'd-2',
        docType: 'INCOME_CERTIFICATE',
        name: 'Income Certificate (Revenue Authority)',
        description: 'Current financial year revenue certificate',
        mandatory: true,
        allowedFormats: ['PDF'],
        maxSizeMB: 2,
        extractedKeyFields: ['annualIncome', 'validUpto'],
      },
      {
        id: 'd-3',
        docType: 'DEGREE_CERTIFICATE',
        name: 'Degree Transcript',
        description: 'Consolidated university marksheet',
        mandatory: true,
        allowedFormats: ['PDF'],
        maxSizeMB: 5,
        extractedKeyFields: ['degreeName', 'percentageOrCgpa'],
      },
      {
        id: 'd-4',
        docType: 'ADMISSION_LETTER',
        name: 'Doctoral Bonafide Admission Letter',
        description: 'Signed by Dean / Registrar',
        mandatory: true,
        allowedFormats: ['PDF'],
        maxSizeMB: 3,
        extractedKeyFields: ['courseName', 'registrationNumber'],
      },
    ]
  );

  if (!isOpen) return null;

  const handleAddRule = () => {
    const newRule: EligibilityRule = {
      id: `rule-${Date.now()}`,
      field: 'annualIncome',
      fieldLabel: 'Annual Income',
      operator: '<=',
      value: 600000,
      description: 'Income requirement',
      category: 'INCOME',
    };
    setRules([...rules, newRule]);
  };

  const handleUpdateRule = (index: number, updates: Partial<EligibilityRule>) => {
    setRules((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, idx) => idx !== index));
  };

  const handleSaveScheme = () => {
    const newScheme: Scheme = {
      id: existingScheme?.id || `scheme-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      code,
      name,
      hindiName,
      ministry: 'Ministry of Tribal Affairs, Government of India',
      category,
      academicYear,
      description,
      objectives: [
        'Deterministic rule execution and automated document screening',
        'Direct DBT disbursement to verified tribal scholars',
      ],
      slots: Number(slots),
      stipendAmountText: stipendText,
      stipendAmountNumeric: 70000,
      contingencyYearly: 200000,
      applicationStartDate: '2026-04-01',
      applicationDeadline: deadline,
      isActive: true,
      ruleGroups: [
        {
          id: `rg-${Date.now()}`,
          logicalOperator,
          rules,
        },
      ],
      requiredDocuments: documents,
      selectionCriteria: {
        method: 'INCOME_CUM_MERIT',
        weightageAcademic: 60,
        weightageIncome: 40,
        interviewRequired: false,
      },
    };

    if (existingScheme) {
      updateScheme(newScheme);
    } else {
      addScheme(newScheme);
    }

    onClose();
    alert(`Scheme ${newScheme.code} successfully published to the Configurable Engine!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Modal Top Header */}
        <div className="bg-gov-navy text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gov-dark flex items-center justify-center border border-white/20">
              <Sliders className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-300">
                Scheme Engine Configuration Wizard
              </span>
              <h2 className="text-lg font-bold">
                {existingScheme ? `Configure Scheme: ${existingScheme.code}` : 'Create New Scholarship Scheme'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Stepper */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 py-1 px-3 rounded-lg ${
              activeStep === 1 ? 'bg-gov-navy text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Scheme Metadata</span>
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-2 py-1 px-3 rounded-lg ${
              activeStep === 2 ? 'bg-gov-navy text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>Visual Rule Builder</span>
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-2 py-1 px-3 rounded-lg ${
              activeStep === 3 ? 'bg-gov-navy text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            <span>Document Checklists</span>
          </button>
        </div>

        {/* STEP 1: SCHEME METADATA */}
        {activeStep === 1 && (
          <div className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scheme Code (Unique)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold"
                  placeholder="e.g. PMRF-ST-2026"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scheme Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="FELLOWSHIP">Doctoral Fellowship (Ph.D./M.Phil)</option>
                  <option value="OVERSEAS_SCHOLARSHIP">National Overseas Scholarship</option>
                  <option value="HIGHER_EDUCATION">Top Class Higher Education</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Scheme Official Name (English)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Official Name (Hindi)</label>
                <input
                  type="text"
                  value={hindiName}
                  onChange={(e) => setHindiName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-serif"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sanctioned Annual Slots (Quota)</label>
                <input
                  type="number"
                  value={slots}
                  onChange={(e) => setSlots(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Stipend & Fellowship Amount Label</label>
                <input
                  type="text"
                  value={stipendText}
                  onChange={(e) => setStipendText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Description & Scope</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: VISUAL RULE BUILDER */}
        {activeStep === 2 && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gov-blue" />
                  <span>Visual Deterministic Eligibility Rule Builder</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Configure deterministic condition sets. Supported: =, !=, &gt;, &lt;, &gt;=, &lt;=, IN, NOT IN
                </p>
              </div>

              {/* Logical Operator AND / OR Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg text-xs font-bold border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLogicalOperator('AND')}
                  className={`px-3 py-1 rounded ${
                    logicalOperator === 'AND' ? 'bg-gov-navy text-white' : 'text-slate-600'
                  }`}
                >
                  Match ALL (AND)
                </button>
                <button
                  type="button"
                  onClick={() => setLogicalOperator('OR')}
                  className={`px-3 py-1 rounded ${
                    logicalOperator === 'OR' ? 'bg-gov-navy text-white' : 'text-slate-600'
                  }`}
                >
                  Match ANY (OR)
                </button>
              </div>
            </div>

            {/* List of Dynamic Rules */}
            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Rule #{idx + 1} ({rule.category})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {/* Field */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        FIELD
                      </label>
                      <select
                        value={rule.field}
                        onChange={(e) => {
                          const val = e.target.value;
                          let label = 'Annual Income';
                          let cat: EligibilityRule['category'] = 'INCOME';
                          if (val === 'category') { label = 'Social Category'; cat = 'SOCIAL'; }
                          if (val === 'educationLevel') { label = 'Education Level'; cat = 'ACADEMIC'; }
                          if (val === 'degreePercentage') { label = 'Qualifying Degree Marks'; cat = 'ACADEMIC'; }
                          if (val === 'age') { label = 'Candidate Age'; cat = 'AGE'; }

                          handleUpdateRule(idx, { field: val, fieldLabel: label, category: cat });
                        }}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white font-semibold"
                      >
                        <option value="annualIncome">Annual Income</option>
                        <option value="category">Social Category</option>
                        <option value="educationLevel">Education Level</option>
                        <option value="degreePercentage">Degree Percentage</option>
                        <option value="age">Candidate Age</option>
                      </select>
                    </div>

                    {/* Operator */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        OPERATOR
                      </label>
                      <select
                        value={rule.operator}
                        onChange={(e) =>
                          handleUpdateRule(idx, { operator: e.target.value as Operator })
                        }
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                      >
                        <option value="<=">&lt;= (Less than or equal to)</option>
                        <option value=">=">&gt;= (Greater than or equal to)</option>
                        <option value="=">= (Equals)</option>
                        <option value="!=">!= (Not equals)</option>
                        <option value="<">&lt; (Strictly less than)</option>
                        <option value=">">&gt; (Strictly greater than)</option>
                        <option value="IN">IN (Member of list)</option>
                        <option value="NOT IN">NOT IN</option>
                      </select>
                    </div>

                    {/* Value */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        THRESHOLD VALUE
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(rule.value) ? rule.value.join(', ') : rule.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          const num = Number(val);
                          handleUpdateRule(idx, {
                            value: !isNaN(num) && rule.field !== 'educationLevel' && rule.field !== 'category' ? num : val,
                          });
                        }}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>

                    {/* Rule Description */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        EXPLANATION TEXT
                      </label>
                      <input
                        type="text"
                        value={rule.description}
                        onChange={(e) => handleUpdateRule(idx, { description: e.target.value })}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                        placeholder="Human friendly message"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRule}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-300"
            >
              <Plus className="w-4 h-4" />
              <span>Add Eligibility Rule Clause</span>
            </button>
          </div>
        )}

        {/* STEP 3: DOCUMENT CHECKLISTS */}
        {activeStep === 3 && (
          <div className="p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Configured Verification Document Checklists
            </h3>

            <div className="space-y-2.5">
              {documents.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900">{doc.name}</span>
                    <span className="text-[10px] text-slate-400 block">{doc.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={doc.mandatory}
                        onChange={(e) => {
                          const copy = [...documents];
                          copy[idx].mandatory = e.target.checked;
                          setDocuments(copy);
                        }}
                      />
                      <span>Mandatory</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Previous Step
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-5 py-2 bg-gov-navy text-white text-xs font-bold rounded-lg"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveScheme}
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Publish Scheme to Engine</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
