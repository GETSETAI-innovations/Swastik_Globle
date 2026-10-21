import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const defaultWeekData = [
  { day: 'Mon', hours: 8.5 },
  { day: 'Tue', hours: 7.8 },
  { day: 'Wed', hours: 8.0 },
  { day: 'Thu', hours: 8.2 },
  { day: 'Fri', hours: 7.5 },
];

export const WeeklyHoursChart = ({
  data = defaultWeekData,
  title = 'Weekly Working Hours Logged',
  subtitle = 'Daily reported billable hours (Mon — Fri)',
  color = '#6366F1',
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h4 className="font-semibold text-sm text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
            Target: 40h/week
          </span>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}h`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-xl border border-slate-700">
                      <div className="font-semibold text-slate-300">{label}</div>
                      <div className="text-indigo-400 font-mono font-bold">
                        {payload[0]?.value} hours logged
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="hours" fill={color} radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
