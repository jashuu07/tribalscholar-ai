import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-gov-navy text-slate-300 text-xs border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Ministry Details */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl text-white font-bold">
                🏛️
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">
                  Ministry of Tribal Affairs | जनजातीय कार्य मंत्रालय
                </h3>
                <p className="text-[11px] text-slate-400">Government of India | भारत सरकार</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              TribalScholar AI is an intelligent, transparent and configurable scholarship and fellowship management engine designed for Scheduled Tribe students pursuing higher education and doctoral research in India and abroad.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-amber-300 font-bold border border-white/10">
                SIH 2026 Problem ID: SIH26239
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-semibold border border-white/10">
                Category: Software
              </span>
            </div>
          </div>

          {/* Col 2: Schemes */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Flagship Schemes
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>• National Fellowship for STs (NFST)</li>
              <li>• National Overseas Scholarship (NOS)</li>
              <li>• Top Class Higher Education for STs</li>
              <li>• Pre-Matric & Post-Matric ST Grants</li>
            </ul>
          </div>

          {/* Col 3: Technical & Compliance */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Platform Architecture
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>• Deterministic Rule Engine</li>
              <li>• Advisory AI Document Intelligence</li>
              <li>• 100% Human-in-the-Loop Oversight</li>
              <li>• Cryptographic Audit Trail</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © 2026 Ministry of Tribal Affairs, Government of India. Designed for Smart India Hackathon 2026.
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by NIC & Digital India</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Demo Prototype Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
