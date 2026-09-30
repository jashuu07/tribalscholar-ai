import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scheme, RequiredDocumentConfig } from '../../types';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building,
  GraduationCap,
  IndianRupee,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationWizardProps {
  schemeId?: string;
  onNavigate: (tab: string, extra?: any) => void;
}

export const ApplicationWizard: React.FC<ApplicationWizardProps> = ({ schemeId, onNavigate }) => {
  const { schemes, currentUser, createApplication, uploadDocument } = useApp();

  const activeScheme = schemes.find((s) => s.id === schemeId) || schemes[0];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    annualIncome: 180000,
    educationLevel: activeScheme.code === 'NOS-2026' ? 'Masters' : 'PhD',
    degreeName: 'M.Sc. in Tribal Ethnobotany & Plant Sciences',
    universityName: currentUser.university || 'Ranchi University',
    degreePercentage: 74.5,
    age: 27,
    stSubCaste: currentUser.stCommunity || 'Oraon',
    stCertificateNumber: currentUser.certificateNumber || 'JH/ST/2023/88194',
    issuingDistrict: currentUser.district || 'Ranchi',
    issuingState: currentUser.state || 'Jharkhand',
    bankAccountNumber: '38190284910',
    bankIfsc: 'SBIN0000167',
    bankName: 'State Bank of India',
    researchTitle: 'Medicinal Flora and Traditional Health Traditions of Tribal Communities in Eastern India',
    foreignUniversity: 'University of Cambridge, UK',
    foreignCountry: 'United Kingdom',
    greIeltsScore: 'IELTS Academic 7.5',
  });

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; size: number; type: string }>>({
    ST_CERTIFICATE: { name: 'ST_Certificate_Oraon.pdf', size: 610 * 1024, type: 'application/pdf' },
    INCOME_CERTIFICATE: { name: 'Revenue_Income_Cert_2025.pdf', size: 740 * 1024, type: 'application/pdf' },
    DEGREE_CERTIFICATE: { name: 'MSc_Tribal_Botany_Transcript.pdf', size: 1200 * 1024, type: 'application/pdf' },
    ADMISSION_LETTER: { name: 'PhD_Admission_Letter_RU.pdf', size: 480 * 1024, type: 'application/pdf' },
    BANK_PASSBOOK: { name: 'SBI_Passbook_AadhaarSeeded.pdf', size: 520 * 1024, type: 'application/pdf' },
  });

  const [createdAppId, setCreatedAppId] = useState<string | null>(null);

  const handleFileUpload = (docType: string, file: File) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docType]: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    }));
  };

  const handleSubmitApplication = () => {
    const newApp = createApplication(activeScheme.id, formData);

    // Upload documents into the newly created application
    Object.entries(uploadedFiles).forEach(([docType, f]) => {
      uploadDocument(newApp.id, docType, f);
    });

    setCreatedAppId(newApp.id);
    setCurrentStep(5); // Success step
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  const steps = [
    { num: 1, label: 'Candidate & Social Identity' },
    { num: 2, label: 'Academic & Research Profile' },
    { num: 3, label: 'Financial Declaration' },
    { num: 4, label: 'Document Ingestion' },
    { num: 5, label: 'Verification & Status' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
              Scheme Application Wizard
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {activeScheme.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Code: <strong>{activeScheme.code}</strong> | Academic Session: {activeScheme.academicYear} | DBT Sanction: {activeScheme.stipendAmountText}
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
            Step {currentStep} of 5
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-6 flex items-center justify-between overflow-x-auto pb-2">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex-1 flex items-center min-w-[120px]">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === s.num
                      ? 'bg-gov-navy text-white ring-4 ring-blue-100'
                      : currentStep > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-xs font-medium ${
                    currentStep === s.num ? 'text-slate-900 font-bold' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 ${
                    currentStep > s.num ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: PERSONAL & ST COMMUNITY */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gov-blue" />
            <span>Step 1: Scheduled Tribe Community & Domicile Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Scholar Full Name</label>
              <input
                type="text"
                disabled
                value={currentUser.name}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ST Sub-Tribe / Community</label>
              <input
                type="text"
                value={formData.stSubCaste}
                onChange={(e) => setFormData({ ...formData, stSubCaste: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ST Certificate Number</label>
              <input
                type="text"
                value={formData.stCertificateNumber}
                onChange={(e) => setFormData({ ...formData, stCertificateNumber: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issuing District & State</label>
              <input
                type="text"
                value={`${formData.issuingDistrict}, ${formData.issuingState}`}
                onChange={(e) => setFormData({ ...formData, issuingDistrict: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Candidate Age (Years)</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Aadhaar (Masked NPCI Verification)</label>
              <input
                type="text"
                disabled
                value="XXXXXXXX8291 (Seeded for DBT)"
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-emerald-700 font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <span>Next: Academic Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ACADEMIC DETAILS */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-gov-blue" />
            <span>Step 2: Doctoral Research & Academic Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Program Enrolled</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="PhD">Ph.D. (Doctoral Research)</option>
                <option value="MPhil">M.Phil.</option>
                <option value="Masters">Masters (Overseas)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Qualifying Degree Aggregate Marks (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.degreePercentage}
                onChange={(e) => setFormData({ ...formData, degreePercentage: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">University / Research Institute Name</label>
              <input
                type="text"
                value={formData.universityName}
                onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            {activeScheme.code === 'NOS-2026' ? (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Foreign University (Top 500 QS)</label>
                  <input
                    type="text"
                    value={formData.foreignUniversity}
                    onChange={(e) => setFormData({ ...formData, foreignUniversity: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GRE / IELTS / TOEFL Score</label>
                  <input
                    type="text"
                    value={formData.greIeltsScore}
                    onChange={(e) => setFormData({ ...formData, greIeltsScore: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </>
            ) : (
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Doctoral Research Title / Topic</label>
                <textarea
                  rows={2}
                  value={formData.researchTitle}
                  onChange={(e) => setFormData({ ...formData, researchTitle: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  required
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <span>Next: Financial Declaration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FINANCIAL DECLARATION */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-gov-blue" />
            <span>Step 3: Family Annual Income & DBT Bank Account</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Declared Annual Family Income (₹)
              </label>
              <input
                type="number"
                value={formData.annualIncome}
                onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-base font-bold text-gov-navy"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Must match your Revenue Department Income Certificate.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Scheme Income Ceiling
              </label>
              <input
                type="text"
                disabled
                value="₹6,00,000 / annum (NFST Limit)"
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Number (Aadhaar Seeded)</label>
              <input
                type="text"
                value={formData.bankAccountNumber}
                onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank IFSC Code</label>
              <input
                type="text"
                value={formData.bankIfsc}
                onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white uppercase"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <span>Next: Document Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DYNAMIC DOCUMENT UPLOADS */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-gov-blue" />
                <span>Step 4: Dynamic Scheme Document Ingestion</span>
              </h3>
              <p className="text-xs text-slate-500">
                Documents dynamically configured for {activeScheme.code} by the Ministry
              </p>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {Object.keys(uploadedFiles).length} of {activeScheme.requiredDocuments.length} Ready
            </span>
          </div>

          <div className="space-y-3">
            {activeScheme.requiredDocuments.map((docConfig) => {
              const uploaded = uploadedFiles[docConfig.docType];

              return (
                <div
                  key={docConfig.id}
                  className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    uploaded
                      ? 'bg-slate-50/80 border-slate-200'
                      : 'bg-amber-50/30 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        uploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {uploaded ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{docConfig.name}</span>
                        {docConfig.mandatory ? (
                          <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.2 rounded">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{docConfig.description}</p>
                      {uploaded && (
                        <p className="text-emerald-700 font-semibold text-[11px] mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Attached: {uploaded.name} ({Math.round(uploaded.size / 1024)} KB)</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 cursor-pointer shadow-2xs">
                      <span>{uploaded ? 'Replace' : 'Upload'}</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(docConfig.docType, e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSubmitApplication}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Submit Application & Trigger AI OCR</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS & NEXT STEPS */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl border-2 border-emerald-400 p-8 shadow-lg text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Application Successfully Registered
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              Submitted for {activeScheme.code}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-1">
              Your application has been ingested into the Ministry of Tribal Affairs digital scrutiny pipeline. The AI Document Intelligence engine is cross-verifying extracted certificates.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="px-5 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl"
            >
              Return to Student Dashboard
            </button>
            <button
              onClick={() => onNavigate('student-deficiency')}
              className="px-5 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Check Scrutiny / Deficiency Desk</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
