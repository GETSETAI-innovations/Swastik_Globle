import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, CheckCircle2, Clock, Award, Shield } from 'lucide-react';
import { KpiCard } from '../../components/dashboard/KpiCard';

export const MyAttendancePage = () => {
  const { currentUser } = useAuth();

  // Simulated calendar days for October 2026
  const attendanceDays = [
    { day: 1, status: 'Present', hours: 8.5 },
    { day: 2, status: 'Present', hours: 8.0 },
    { day: 3, status: 'Present', hours: 7.5 },
    { day: 4, status: 'Weekend', hours: 0 },
    { day: 5, status: 'Weekend', hours: 0 },
    { day: 6, status: 'Present', hours: 8.0 },
    { day: 7, status: 'Present', hours: 8.5 },
    { day: 8, status: 'Present', hours: 8.0 },
    { day: 9, status: 'Present', hours: 8.0 },
    { day: 10, status: 'Present', hours: 7.5 },
    { day: 11, status: 'Weekend', hours: 0 },
    { day: 12, status: 'Weekend', hours: 0 },
    { day: 13, status: 'Present', hours: 8.5 },
    { day: 14, status: 'Present', hours: 8.0 },
    { day: 15, status: 'Present', hours: 8.2 },
    { day: 16, status: 'Present', hours: 8.0 },
    { day: 17, status: 'Present', hours: 7.8 },
    { day: 18, status: 'Weekend', hours: 0 },
    { day: 19, status: 'Present', hours: 7.5, current: true },
    { day: 20, status: 'Upcoming', hours: 0 },
    { day: 21, status: 'Upcoming', hours: 0 },
    { day: 22, status: 'Upcoming', hours: 0 },
    { day: 23, status: 'Upcoming', hours: 0 },
    { day: 24, status: 'Weekend', hours: 0 },
    { day: 25, status: 'Weekend', hours: 0 },
    { day: 26, status: 'Upcoming', hours: 0 },
    { day: 27, status: 'Upcoming', hours: 0 },
    { day: 28, status: 'Upcoming', hours: 0 },
    { day: 29, status: 'Upcoming', hours: 0 },
    { day: 30, status: 'Upcoming', hours: 0 },
    { day: 31, status: 'Weekend', hours: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Attendance & Duty Log (October 2026)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified presence, biometric timestamps, and compliant working hours
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Days Present"
          value="14 Days"
          subtitle="100% on-time attendance"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          title="Monthly Hours"
          value="112.0 hrs"
          subtitle="Target: 160 hrs / month"
          icon={Clock}
          iconBg="bg-indigo-50 text-indigo-700"
        />
        <KpiCard
          title="Daily Average"
          value="8.0 hrs"
          subtitle="Statutory compliance"
          icon={Award}
          iconBg="bg-blue-50 text-blue-700"
        />
        <KpiCard
          title="Leaves Remaining"
          value="18 Days"
          subtitle="Annual earned leaves"
          icon={Calendar}
          iconBg="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Monthly Attendance Calendar Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h3 className="font-semibold text-sm text-slate-900">October 2026 Monthly Breakdown</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present (8+ hrs)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Weekend / Holiday
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Today
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="font-bold text-[11px] text-slate-400 py-1 uppercase">
              {d}
            </div>
          ))}

          {attendanceDays.map((item) => {
            const isToday = item.current;
            const isPresent = item.status === 'Present';
            const isWeekend = item.status === 'Weekend';

            return (
              <div
                key={item.day}
                className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between h-20 transition-all ${
                  isToday
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : isPresent
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-800'
                    : isWeekend
                    ? 'border-slate-100 bg-slate-50 text-slate-400'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-mono font-bold ${isToday ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {item.day}
                  </span>
                  {isPresent && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                </div>

                <div className="text-[10px] text-left">
                  {isPresent && (
                    <span className="font-mono font-semibold text-emerald-700 block">
                      {item.hours}h logged
                    </span>
                  )}
                  {isWeekend && <span className="text-slate-400">Off</span>}
                  {item.status === 'Upcoming' && <span className="text-slate-300">—</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
