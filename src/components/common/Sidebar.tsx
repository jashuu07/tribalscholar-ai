import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  GraduationCap,
  Calculator,
  FileText,
  UploadCloud,
  AlertTriangle,
  Bell,
  Award,
  User,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Clock,
  Settings,
  Sparkles,
  Home,
  FolderOpen,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string, extra?: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate }) => {
  const { currentUser, applications, notifications } = useApp();

  const isOfficerOrAdmin =
    currentUser.role === 'OFFICER' ||
    currentUser.role === 'ADMIN' ||
    currentUser.role === 'VERIFIER' ||
    currentUser.role === 'SELECTION_OFFICER' ||
    currentUser.role === 'SUPER_ADMIN';

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const openDeficiencyCount = applications.reduce(
    (acc, a) => acc + (a.deficiencies?.filter((d) => d.status === 'OPEN').length || 0),
    0
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-100px)]">
      {/* Top Portal Badge */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Current View
        </span>
        <div className="font-extrabold text-xs text-gov-navy flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{isOfficerOrAdmin ? 'Officer Command Center' : 'Tribal Student Portal'}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto text-xs font-medium">
        {/* Landing Page Link */}
        <button
          onClick={() => onNavigate('landing')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
            currentTab === 'landing'
              ? 'bg-gov-navy text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Home / Overview</span>
        </button>

        <div className="pt-2 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {isOfficerOrAdmin ? 'Administration' : 'Student Services'}
        </div>

        {isOfficerOrAdmin ? (
          // OFFICER / ADMIN LINKS
          <>
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-dashboard'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => onNavigate('admin-applications')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-applications'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Applications</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-bold">
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => onNavigate('admin-verification')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-verification'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Officer Verification</span>
            </button>

            <button
              onClick={() => onNavigate('admin-ai-queue')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-ai-queue'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>AI Review & Mismatches</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </button>

            <button
              onClick={() => onNavigate('admin-deficiencies')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-deficiencies'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Deficiencies</span>
              </div>
              {openDeficiencyCount > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                  {openDeficiencyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('admin-schemes')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-schemes'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Schemes & Rule Engine</span>
            </button>

            <button
              onClick={() => onNavigate('admin-selection')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-selection'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Selection & Quotas</span>
            </button>

            <button
              onClick={() => onNavigate('admin-fellowship')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-fellowship'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Fellowship / DBT</span>
            </button>

            <button
              onClick={() => onNavigate('admin-analytics')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-analytics'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Analytics & Metrics</span>
            </button>

            <button
              onClick={() => onNavigate('admin-audit')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-audit'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>Audit Trail Logs</span>
            </button>

            <button
              onClick={() => onNavigate('admin-settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'admin-settings'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings & Disclaimers</span>
            </button>
          </>
        ) : (
          // STUDENT LINKS
          <>
            <button
              onClick={() => onNavigate('student-dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'student-dashboard'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('student-schemes')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'student-schemes'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Explore Schemes</span>
            </button>

            <button
              onClick={() => onNavigate('student-checker')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'student-checker'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4 shrink-0" />
              <span>Eligibility Checker</span>
            </button>

            <button
              onClick={() => onNavigate('student-applications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'student-applications'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>My Applications</span>
            </button>

            <button
              onClick={() => onNavigate('student-documents')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'student-documents'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FolderOpen className="w-4 h-4 shrink-0" />
              <span>Uploaded Documents</span>
            </button>

            <button
              onClick={() => onNavigate('student-deficiency')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'student-deficiency'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Deficiency Center</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                1 Active
              </span>
            </button>

            <button
              onClick={() => onNavigate('student-fellowship')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'student-fellowship'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Fellowship & DBT</span>
            </button>

            <button
              onClick={() => onNavigate('student-notifications')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'student-notifications'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 shrink-0" />
                <span>Notifications</span>
              </div>
              {unreadNotifCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
              )}
            </button>

            <button
              onClick={() => onNavigate('student-profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                currentTab === 'student-profile'
                  ? 'bg-gov-navy text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profile & Bank DBT</span>
            </button>
          </>
        )}
      </nav>

      {/* Bottom Persona Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gov-navy text-white font-bold flex items-center justify-center text-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 truncate">
            <div className="font-bold text-slate-800 truncate">{currentUser.name}</div>
            <div className="text-[10px] text-blue-700 font-semibold">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
