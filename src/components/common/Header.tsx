import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Sparkles,
  RefreshCw,
  UserCheck,
  Globe,
  Sliders,
  LogOut,
  ChevronDown,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    users,
    switchUser,
    notifications,
    markNotificationRead,
    language,
    setLanguage,
    resetAllData,
    setIsDemoModalOpen,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isOfficerOrAdmin = currentUser.role === 'OFFICER' || currentUser.role === 'ADMIN' || currentUser.role === 'VERIFIER';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Tricolor Top Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      {/* Main Gov Topbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Emblem & Ministry Branding */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab(isOfficerOrAdmin ? 'admin-dashboard' : 'student-dashboard')}>
          {/* Ashoka Pillar / Emblem Badge */}
          <div className="w-11 h-11 rounded-lg bg-gov-navy flex items-center justify-center text-white font-bold shadow-md shadow-gov-navy/20 border border-gov-dark">
            <span className="text-xl">🏛️</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                {language === 'HI' ? 'भारत सरकार | जनजातीय कार्य मंत्रालय' : 'GOVERNMENT OF INDIA | MINISTRY OF TRIBAL AFFAIRS'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 font-bold border border-orange-200">
                SIH 2026 #SIH26239
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-gov-navy tracking-tight flex items-center gap-2">
              <span>TribalScholar AI</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                v1.0 Configurable Engine
              </span>
            </h1>
          </div>
        </div>

        {/* Action Controls & User Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Mode Launch Button */}
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 animate-pulse"
            title="Launch 3-5 minute guided judge demonstration"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>⚡ SIH Judge Demo</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'EN' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo applications, rule configs, and audit logs to clean initial state?')) {
                resetAllData();
              }
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200"
            title="Reset All Demo Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 text-slate-600 hover:text-gov-navy hover:bg-slate-100 rounded-lg border border-slate-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifications ({notifications.length})
                  </h3>
                  <span className="text-[11px] text-slate-500">Live AI & Officer Alerts</span>
                </div>
                <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">No notifications</p>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          n.read
                            ? 'bg-slate-50 border-slate-100 text-slate-600'
                            : 'bg-amber-50/70 border-amber-200 text-slate-800 font-medium'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.type === 'ALERT' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          ) : n.type === 'SUCCESS' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 leading-tight">{n.title}</p>
                            <p className="text-[11px] text-slate-600 mt-1 leading-normal">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Role / User Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gov-navy text-white text-xs font-bold flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-semibold text-blue-700 leading-none">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* User Switcher Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Persona (Instant Role Toggle)
                </div>
                <div className="space-y-1">
                  {/* Persona: Student (Aruna Kerketta) */}
                  <button
                    onClick={() => {
                      switchUser('student-demo-1');
                      setShowUserMenu(false);
                      setActiveTab('student-dashboard');
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      currentUser.id === 'student-demo-1' ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">Aruna Kerketta (Student)</p>
                      <p className="text-[10px] text-slate-500">Oraon Tribe, Ranchi | Applicant TS-0012</p>
                    </div>
                    {currentUser.id === 'student-demo-1' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>

                  {/* Persona: Officer (Dr. Soren) */}
                  <button
                    onClick={() => {
                      switchUser('officer-1');
                      setShowUserMenu(false);
                      setActiveTab('admin-dashboard');
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      currentUser.id === 'officer-1' ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">Dr. Rajeshwar K. Soren (Officer)</p>
                      <p className="text-[10px] text-slate-500">Reviewing Officer, MoTA HQ</p>
                    </div>
                    {currentUser.id === 'officer-1' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>

                  {/* Persona: Admin (Smt. Minz, IAS) */}
                  <button
                    onClick={() => {
                      switchUser('admin-1');
                      setShowUserMenu(false);
                      setActiveTab('admin-schemes');
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      currentUser.id === 'admin-1' ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">Smt. Sushmita Minz, IAS (Admin)</p>
                      <p className="text-[10px] text-slate-500">Scheme & Rule Configuration Admin</p>
                    </div>
                    {currentUser.id === 'admin-1' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="bg-gov-navy text-white text-xs border-t border-gov-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          {/* Left navigation pills */}
          <div className="flex items-center gap-1 py-1.5 shrink-0">
            {isOfficerOrAdmin ? (
              // OFFICER / ADMIN NAV
              <>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'admin-dashboard' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('admin-applications')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'admin-applications' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  Applications (30)
                </button>
                <button
                  onClick={() => setActiveTab('admin-verification')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'admin-verification' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  Officer Scrutiny Queue
                </button>
                <button
                  onClick={() => setActiveTab('admin-ai-queue')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1 ${
                    activeTab === 'admin-ai-queue' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  <span>AI Mismatch Review</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                </button>
                <button
                  onClick={() => setActiveTab('admin-schemes')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'admin-schemes' || activeTab === 'scheme-builder' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  ⚙️ Scheme Rule Builder
                </button>
                <button
                  onClick={() => setActiveTab('admin-selection')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'admin-selection' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  Merit Selection
                </button>
                <button
                  onClick={() => setActiveTab('admin-analytics')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'admin-analytics' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('admin-audit')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'admin-audit' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  Audit Logs
                </button>
              </>
            ) : (
              // STUDENT NAV
              <>
                <button
                  onClick={() => setActiveTab('student-dashboard')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'student-dashboard' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  Student Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('student-schemes')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'student-schemes' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  Explore Schemes
                </button>
                <button
                  onClick={() => setActiveTab('student-checker')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'student-checker' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  ⚡ Instant Eligibility Checker
                </button>
                <button
                  onClick={() => setActiveTab('student-deficiency')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'student-deficiency' ? 'bg-amber-600 text-white font-bold' : 'text-amber-300 hover:bg-gov-dark'
                  }`}
                >
                  <span>⚠️ Deficiency Center</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">1</span>
                </button>
                <button
                  onClick={() => setActiveTab('student-fellowship')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'student-fellowship' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  Fellowship & DBT (Post-Selection)
                </button>
                <button
                  onClick={() => setActiveTab('student-profile')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    activeTab === 'student-profile' ? 'bg-gov-blue text-white' : 'text-slate-200 hover:bg-gov-dark'
                  }`}
                >
                  My Profile
                </button>
              </>
            )}
          </div>

          {/* Right Mode Indicator */}
          <div className="hidden md:flex items-center gap-2 text-slate-300 text-[11px] shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Active Portal: <strong className="text-white">{isOfficerOrAdmin ? 'Ministry Admin & Officer HQ' : 'National Tribal Scholar Portal'}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};
