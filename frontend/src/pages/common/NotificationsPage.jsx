import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Bell, CheckCheck, Clock, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('ALL');

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'APPROVAL') return n.type === 'approval';
    if (activeFilter === 'QUOTATION') return n.type === 'quotation';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-700" />
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              System Dispatch Center
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Operational Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Time-sensitive updates on tender submissions, statutory approvals, and purchase-order milestones
          </p>
        </div>

        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <CheckCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        {['ALL', 'UNREAD', 'APPROVAL', 'QUOTATION'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeFilter === tab
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab === 'ALL' ? 'All Alerts' : tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No notifications matching the selected filter.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.link && n.link !== '#') navigate(n.link);
              }}
              className={`p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors ${
                !n.read ? 'bg-teal-50/20' : ''
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  n.type === 'approval'
                    ? 'bg-amber-100 text-amber-800'
                    : n.type === 'quotation'
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-mono">{n.timestamp}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
