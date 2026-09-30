import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
} from 'lucide-react';

interface StudentNotificationsViewProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const StudentNotificationsView: React.FC<StudentNotificationsViewProps> = ({ onNavigate }) => {
  const { notifications, markNotificationRead, clearNotifications } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              Communication Center
            </span>
            <span className="text-xs text-slate-500">Real-time Scrutiny & DBT Broadcasts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Official Notifications & Alerts
          </h2>
        </div>

        <button
          onClick={clearNotifications}
          className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-xs">No active notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.actionUrl) {
                  const tab = n.actionUrl.includes('deficiency') ? 'student-deficiency' : 'student-dashboard';
                  onNavigate(tab);
                }
              }}
              className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                n.read
                  ? 'bg-white border-slate-200 text-slate-600'
                  : 'bg-amber-50/70 border-amber-300 text-slate-900 shadow-2xs font-medium'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {n.type === 'ALERT' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : n.type === 'SUCCESS' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1 leading-normal">{n.message}</p>
                  {n.actionUrl && (
                    <span className="text-[11px] font-bold text-gov-blue hover:underline mt-2 inline-block">
                      Take Action →
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
