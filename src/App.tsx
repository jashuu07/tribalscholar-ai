import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { DemoModal } from './components/common/DemoModal';

// Student Portal Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { ScholarshipExplorer } from './components/student/ScholarshipExplorer';
import { EligibilityChecker } from './components/student/EligibilityChecker';
import { DeficiencyCenter } from './components/student/DeficiencyCenter';
import { FellowshipDashboard } from './components/student/FellowshipDashboard';
import { StudentProfile } from './components/student/StudentProfile';
import { ApplicationWizard } from './components/student/ApplicationWizard';
import { ApplicationDetailsView } from './components/student/ApplicationDetailsView';

// Admin / Officer Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ApplicationsList } from './components/admin/ApplicationsList';
import { OfficerVerificationQueue } from './components/admin/OfficerVerificationQueue';
import { AIReviewQueue } from './components/admin/AIReviewQueue';
import { SchemeManagement } from './components/admin/SchemeManagement';
import { MeritSelection } from './components/admin/MeritSelection';
import { AnalyticsView } from './components/admin/AnalyticsView';
import { AuditLogsView } from './components/admin/AuditLogsView';

import { Sparkles, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentUser, setIsDemoModalOpen, demoStep } = useApp();
  const isOfficerOrAdmin = currentUser.role === 'OFFICER' || currentUser.role === 'ADMIN' || currentUser.role === 'VERIFIER';

  const [activeTab, setActiveTab] = useState<string>(
    isOfficerOrAdmin ? 'admin-dashboard' : 'student-dashboard'
  );
  const [navExtra, setNavExtra] = useState<any>(null);

  const handleNavigate = (tab: string, extra?: any) => {
    setActiveTab(tab);
    setNavExtra(extra || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header with tricolor, emblem, and persona switchers */}
      <Header activeTab={activeTab} setActiveTab={handleNavigate} />

      {/* Floating Demo Mode Guide Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs px-4 py-2 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
            <span className="font-bold">SIH 2026 Judge Mode:</span>
            <span className="hidden sm:inline text-amber-100">
              Interactive 3–5 min demonstration simulating Scheme Configuration → Application → AI Mismatch (App: ₹1.80L vs Cert: ₹2.80L) → Deficiency → Re-upload → Approval!
            </span>
          </div>
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="px-3 py-1 bg-white text-amber-900 hover:bg-amber-50 font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <span>Launch Interactive Walkthrough</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Student Portal Views */}
        {activeTab === 'student-dashboard' && <StudentDashboard onNavigate={handleNavigate} />}
        {activeTab === 'student-schemes' && <ScholarshipExplorer onNavigate={handleNavigate} />}
        {activeTab === 'student-checker' && <EligibilityChecker onNavigate={handleNavigate} />}
        {activeTab === 'student-deficiency' && <DeficiencyCenter onNavigate={handleNavigate} />}
        {activeTab === 'student-fellowship' && <FellowshipDashboard onNavigate={handleNavigate} />}
        {activeTab === 'student-profile' && <StudentProfile />}
        {activeTab === 'application-wizard' && (
          <ApplicationWizard schemeId={navExtra?.schemeId} onNavigate={handleNavigate} />
        )}
        {activeTab === 'application-details' && (
          <ApplicationDetailsView appId={navExtra?.appId} onNavigate={handleNavigate} />
        )}

        {/* Admin / Officer Portal Views */}
        {activeTab === 'admin-dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
        {activeTab === 'admin-applications' && <ApplicationsList onNavigate={handleNavigate} />}
        {activeTab === 'admin-verification' && <OfficerVerificationQueue onNavigate={handleNavigate} />}
        {activeTab === 'admin-ai-queue' && <AIReviewQueue onNavigate={handleNavigate} />}
        {activeTab === 'admin-schemes' && <SchemeManagement onNavigate={handleNavigate} />}
        {activeTab === 'admin-selection' && <MeritSelection onNavigate={handleNavigate} />}
        {activeTab === 'admin-analytics' && <AnalyticsView />}
        {activeTab === 'admin-audit' && <AuditLogsView />}
      </main>

      {/* Guided Judge Tour Modal */}
      <DemoModal onNavigate={handleNavigate} />

      {/* Footer */}
      <Footer />
    </div>
  );
};
