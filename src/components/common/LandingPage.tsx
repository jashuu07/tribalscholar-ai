import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Sliders,
  Award,
  Clock,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Building,
  GraduationCap,
  Plane,
  AlertTriangle,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDemo: () => void;
  onExplore: (portal: 'student' | 'officer') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDemo, onExplore }) => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gov-navy via-gov-dark to-slate-900 text-white p-8 sm:p-14 shadow-2xl border border-white/10">
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-400/40">
              Ministry of Tribal Affairs | जनजातीय कार्य मंत्रालय
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
              Smart India Hackathon 2026 #SIH26239
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              TribalScholar <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">AI</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-amber-200">
              Intelligent, Transparent & Configurable Scholarship Management
            </p>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            An AI-assisted digital governance platform for transparent scholarship and fellowship administration.
            Combining sovereign document intelligence, deterministic rule evaluation, and human-in-the-loop oversight
            to accelerate tribal student empowerment while preventing bias and opaque automation.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onLaunchDemo}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Launch 3-Min SIH Judge Demo</span>
            </button>

            <button
              onClick={() => onExplore('student')}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onExplore('officer')}
              className="px-5 py-3.5 bg-gov-blue hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Officer Command Center</span>
            </button>
          </div>

          {/* Prototype Disclosure */}
          <div className="pt-4 border-t border-white/10 text-slate-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Note:</strong> Prototype created for SIH 2026 using synthetic data. Demonstrates local modular AI OCR and deterministic rules with zero external API dependencies.
            </span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-gov-blue uppercase tracking-wider">
            Core Architecture Highlights
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why TribalScholar AI is Different
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Engineered to replace slow, manual paper scrutiny with an auditable, configurable digital engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center font-bold">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Configurable Scheme Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No hardcoded logic. Administrators visually configure eligibility rules, required documents, and quotas using mathematical operators (=, !=, &gt;, &lt;, &gt;=, &lt;=, IN, NOT IN, AND, OR).
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              AI Document Intelligence
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated OCR extracts key revenue fields, certificate numbers, and degrees. Cross-verifies against application declarations to pinpoint discrepancies with confidence metrics.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Human-in-the-Loop Governance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI is strictly advisory. Students are <em>never</em> automatically rejected. Discrepancies generate a deficiency notice allowing the scholar to clarify or re-upload corrected records.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Turnaround Time: 45d to 3.5d
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drastically cuts average processing time from 45 days down to 3.5 days, eliminating administrative bottlenecks while maintaining 100% human officer sign-off.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Post-Selection & Fellowship DBT
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              End-to-end lifecycle from initial application to monthly Direct Benefit Transfer (₹37,000/mo JRF stipend), annual contingency grants, and quarterly progress reporting.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Forensic Audit Ledger
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every action—AI extraction finding, officer remarks, override justification, deficiency issuance, and status change—is recorded with timestamp and actor identity.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Visualization */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-gov-blue uppercase tracking-wider">
            Operational Lifecycle
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            End-to-End Application & Verification Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { step: '1', title: 'Apply', desc: 'Dynamic scheme wizard', icon: '📝' },
            { step: '2', title: 'AI OCR', desc: 'Entity extraction', icon: '🔍' },
            { step: '3', title: 'Scrutiny', desc: 'Officer oversight', icon: '⚖️' },
            { step: '4', title: 'Deficiency', desc: 'Student re-upload', icon: '🔄' },
            { step: '5', title: 'Rules', desc: 'Deterministic check', icon: '✓' },
            { step: '6', title: 'DBT Sanction', desc: 'Monthly fellowship', icon: '🏛️' },
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-2xl mb-1">{item.icon}</div>
              <span className="text-[10px] font-bold text-gov-blue block">Step {item.step}</span>
              <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
              <p className="text-[10px] text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
