import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Award,
  CheckCircle2,
  Sliders,
  Download,
  Send,
  Sparkles,
  Users,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MeritSelectionProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const MeritSelection: React.FC<MeritSelectionProps> = ({ onNavigate }) => {
  const { applications, schemes, updateApplicationStatus } = useApp();

  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>('NFST-2026');
  const [cutoffScore, setCutoffScore] = useState<number>(75);
  const [bulkApprovedCount, setBulkApprovedCount] = useState<number | null>(null);

  const eligibleCandidates = applications
    .filter((a) => a.schemeCode === selectedSchemeCode && (a.eligibilityEvaluation?.isEligible || a.status === 'SELECTED' || a.status === 'POST_SELECTION'))
    .sort((a, b) => (b.score || 80) - (a.score || 80));

  const candidatesAboveCutoff = eligibleCandidates.filter((c) => (c.score || 80) >= cutoffScore);

  const handleBulkApprove = () => {
    candidatesAboveCutoff.forEach((cand) => {
      if (cand.status !== 'SELECTED' && cand.status !== 'POST_SELECTION') {
        updateApplicationStatus(
          cand.id,
          'SELECTED',
          `Selected under National Merit List (Score: ${cand.score}/100, Cutoff: ${cutoffScore})`,
          cand.score
        );
      }
    });

    setBulkApprovedCount(candidatesAboveCutoff.length);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Selection Directorate
            </span>
            <span className="text-xs text-slate-500">Ministry of Tribal Affairs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Merit Ranking & Digital Fellowship Sanction
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Rule-verified candidates ranked dynamically by merit & income-cum-merit weighting algorithms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSchemeCode}
            onChange={(e) => setSelectedSchemeCode(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 shadow-2xs"
          >
            <option value="NFST-2026">NFST 2026 (750 Slots)</option>
            <option value="NOS-2026">NOS 2026 (20 Slots)</option>
          </select>
        </div>
      </div>

      {bulkApprovedCount !== null && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-xs text-emerald-950 font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Sanction Orders Issued: {bulkApprovedCount} meritorious ST scholars selected and awarded fellowship!
            </span>
          </div>
          <button
            onClick={() => onNavigate('admin-applications')}
            className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs"
          >
            View Applications
          </button>
        </div>
      )}

      {/* Control Strip: Cutoff & Slot Quota */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Merit Cutoff Threshold ({cutoffScore}/100)
          </label>
          <input
            type="range"
            min="60"
            max="95"
            value={cutoffScore}
            onChange={(e) => setCutoffScore(Number(e.target.value))}
            className="w-full accent-gov-navy cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>60 (Min)</span>
            <span>Current: {cutoffScore}</span>
            <span>95 (Max)</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Scholars Meeting Cutoff</span>
          <span className="text-xl font-black text-gov-navy block mt-0.5">
            {candidatesAboveCutoff.length} Candidates
          </span>
          <span className="text-[10px] text-slate-400">Out of {eligibleCandidates.length} eligible</span>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleBulkApprove}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-emerald-200" />
            <span>Generate Sanctions ({candidatesAboveCutoff.length})</span>
          </button>
        </div>
      </div>

      {/* Merit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Ranked Tribal Scholars Merit List ({selectedSchemeCode})
          </h3>
          <span className="text-xs text-slate-500">60% Academic + 40% Income-Cum-Merit Weight</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Merit Rank</th>
                <th className="py-3 px-4">Candidate & Tribe</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Degree Marks</th>
                <th className="py-3 px-4">Annual Income</th>
                <th className="py-3 px-4">Composite Score</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {eligibleCandidates.map((c, idx) => {
                const isSelected = c.status === 'SELECTED' || c.status === 'POST_SELECTION';
                const qualifies = (c.score || 80) >= cutoffScore;

                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-black text-gov-navy">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.studentName}</div>
                      <div className="text-[11px] text-slate-500">{c.stCommunity}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{c.studentState}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{c.formData.degreePercentage}%</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      ₹{c.formData.annualIncome.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-gov-navy text-sm">
                      {c.score || 80}/100
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isSelected && (
                        <button
                          onClick={() => {
                            updateApplicationStatus(
                              c.id,
                              'SELECTED',
                              'Candidate selected by merit selection committee'
                            );
                            alert(`Scholar ${c.studentName} selected!`);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg"
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
