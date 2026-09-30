import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  ShieldAlert,
  Send,
  UserCheck,
  TrendingUp,
  Play,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DemoModalProps {
  onNavigate: (tab: string) => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ onNavigate }) => {
  const {
    isDemoModalOpen,
    setIsDemoModalOpen,
    demoStep,
    runDemoStep,
    resetAllData,
  } = useApp();

  if (!isDemoModalOpen) return null;

  const DEMO_STEPS = [
    {
      step: 1,
      role: 'ADMIN (Smt. Sushmita Minz, IAS)',
      title: '1. Configurable Scheme & Visual Rule Engine',
      subtitle: 'Ministry creates & configures scholarship rules dynamically without hardcoding',
      tab: 'admin-schemes',
      description:
        'Witness how an administrator configures NFST-2026 and NOS-2026 schemes with deterministic mathematical rules (=, <=, >=, IN, NOT IN), dynamic document checklists, and quotas.',
      badge: 'Scheme Engine',
      actionText: 'Inspect Rule Builder',
    },
    {
      step: 2,
      role: 'STUDENT (Aruna Kerketta)',
      title: '2. Student Application Wizard & Profile',
      subtitle: 'Tribal scholar applies with declared income ₹1,80,000',
      tab: 'student-dashboard',
      description:
        'Scholar from Jharkhand logs in with role-based access. Declares Annual Family Income as ₹1,80,000 and submits doctoral research credentials for NFST-2026.',
      badge: 'Student Portal',
      actionText: 'View Student Application',
    },
    {
      step: 3,
      role: 'AI DOCUMENT INTELLIGENCE',
      title: '3. AI Document Ingestion & Field Extraction',
      subtitle: 'OCR and document parsing extracts ₹2,80,000 from revenue certificate',
      tab: 'admin-ai-queue',
      description:
        'The OCR engine extracts entities from uploaded State Revenue Certificate. Extracted Income: ₹2,80,000. Application income: ₹1,80,000.',
      badge: 'AI Pipeline',
      actionText: 'View Extracted OCR Entities',
    },
    {
      step: 4,
      role: 'AI ADVISORY CROSS-VERIFICATION',
      title: '4. Critical Demo: Potential Mismatch Detected (95% Confidence)',
      subtitle: 'Advisory AI flags discrepancy between application and certificate',
      tab: 'admin-ai-queue',
      description:
        'SYSTEM ALERT: Application says ₹1,80,000. Certificate says ₹2,80,000. Advisory confidence 95%. Status set to REVIEW REQUIRED. The student is NEVER automatically rejected!',
      badge: '⚠ 95% Mismatch Alert',
      actionText: 'Inspect Mismatch Details',
    },
    {
      step: 5,
      role: 'OFFICER (Dr. Rajeshwar K. Soren)',
      title: '5. Human-in-the-Loop Scrutiny & Deficiency Issuance',
      subtitle: 'Officer exercises oversight and raises formal clarification deficiency',
      tab: 'admin-verification',
      description:
        'Officer reviews advisory finding with side-by-side certificate view. Officer flags deficiency to request valid Tahasildar certificate or clarification. Immutable audit log recorded.',
      badge: 'Officer Oversight',
      actionText: 'View Verification Queue',
    },
    {
      step: 6,
      role: 'STUDENT (Aruna Kerketta)',
      title: '6. Student Deficiency Center & Document Re-Upload',
      subtitle: 'Student notified, sees exact discrepancy, and uploads corrected certificate',
      tab: 'student-deficiency',
      description:
        'Student receives alert, views exact reason ("Income mismatch"), and uploads updated Revenue Certificate showing ₹1,80,000 with clarification note.',
      badge: 'Deficiency Center',
      actionText: 'Go to Deficiency Center',
    },
    {
      step: 7,
      role: 'AI RE-VERIFICATION & RULE ENGINE',
      title: '7. AI Re-Verification (98% Match) & Eligibility Matrix',
      subtitle: 'Deterministic rule engine validates all 5 scheme criteria (All Passed)',
      tab: 'admin-verification',
      description:
        'AI verifies corrected certificate (Income ₹1,80,000, 98% match). Rule engine validates: Social=ST (✓), Income <= ₹6L (✓), PG Marks >= 55% (✓), Age <= 36 (✓).',
      badge: 'Rules Evaluated',
      actionText: 'View Eligibility Breakdown',
    },
    {
      step: 8,
      role: 'OFFICER (Dr. Soren)',
      title: '8. Merit Selection & Digital Sanction Order',
      subtitle: 'Application approved and candidate ranked for fellowship award',
      tab: 'admin-selection',
      description:
        'Scrutiny officer gives final sign-off. Application status advances to SELECTED with merit score 88/100 and formal fellowship sanction order.',
      badge: 'Candidate Selected',
      actionText: 'View Merit Selection',
    },
    {
      step: 9,
      role: 'FELLOWSHIP MANAGEMENT',
      title: '9. Post-Selection Dashboard & DBT Stipend Tracking',
      subtitle: 'Direct Benefit Transfer (₹37,000/mo) and quarterly research progress tracking',
      tab: 'student-fellowship',
      description:
        'End-to-end lifecycle completion! Student tracks monthly stipend disbursements (₹37,000/mo DBT), annual contingency, and submits quarterly doctoral progress reports.',
      badge: 'Lifecycle Complete',
      actionText: 'View Fellowship Dashboard',
    },
  ];

  const currentStepData = DEMO_STEPS[Math.max(0, Math.min(demoStep - 1, DEMO_STEPS.length - 1))] || DEMO_STEPS[0];

  const handleStepClick = (stepNum: number) => {
    runDemoStep(stepNum);
    const target = DEMO_STEPS.find((s) => s.step === stepNum);
    if (target) {
      onNavigate(target.tab);
    }
    if (stepNum === 8 || stepNum === 9) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-gov-navy via-gov-dark to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/30">
                  SIH 2026 Prototype
                </span>
                <span className="text-xs text-slate-300">3–5 Minute Guided Judge Experience</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                TribalScholar AI Live Demonstration Tour
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsDemoModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[580px] gap-2">
            {DEMO_STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => handleStepClick(s.step)}
                className={`flex-1 text-center py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                  demoStep === s.step
                    ? 'bg-gov-navy text-white border-gov-navy shadow-sm ring-2 ring-blue-400/30'
                    : demoStep > s.step
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] opacity-75">Step {s.step}</div>
                <div className="truncate text-[11px] font-bold mt-0.5">{s.badge}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content Card */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 mb-2">
                Active Persona: {currentStepData.role}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                {currentStepData.title}
              </h3>
              <p className="text-sm font-medium text-amber-700 mt-1">
                {currentStepData.subtitle}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              {demoStep === 4 ? (
                <AlertTriangle className="w-7 h-7 text-amber-600 animate-pulse" />
              ) : demoStep === 8 || demoStep === 9 ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              ) : (
                <FileText className="w-6 h-6 text-gov-navy" />
              )}
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
            {currentStepData.description}
          </div>

          {/* Highlight for Step 4 Mismatch Scenario */}
          {demoStep === 4 && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>CRITICAL DEMO REQUIREMENT HIGHLIGHT:</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                  <span className="text-slate-500 font-semibold block">Application Self-Declaration:</span>
                  <span className="text-base font-extrabold text-slate-900">₹1,80,000</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                  <span className="text-slate-500 font-semibold block">Revenue Certificate OCR:</span>
                  <span className="text-base font-extrabold text-red-600">₹2,80,000</span>
                </div>
              </div>
              <div className="mt-2 text-xs font-medium text-amber-800">
                Confidence: <strong>95%</strong> | Status: <strong>REVIEW REQUIRED</strong> | <em>AI is purely advisory; never auto-rejects the student.</em>
              </div>
            </div>
          )}

          {/* Action Navigation Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStepClick(Math.max(1, demoStep - 1))}
                disabled={demoStep <= 1}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  handleStepClick(1);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsDemoModalOpen(false);
                  onNavigate(currentStepData.tab);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg"
              >
                View Screen ({currentStepData.actionText})
              </button>
              <button
                onClick={() => handleStepClick(demoStep < 9 ? demoStep + 1 : 1)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gov-blue hover:bg-blue-800 rounded-lg shadow-sm"
              >
                <span>{demoStep < 9 ? `Execute Step ${demoStep + 1}` : 'Restart Demo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
