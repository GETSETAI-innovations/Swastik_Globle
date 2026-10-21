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

const defaultDistribution = [
  { department: 'Mechanical', count: 14, color: '#0F766E' },
  { department: 'Electrical', count: 10, color: '#2563EB' },
  { department: 'Procurement', count: 8, color: '#6366F1' },
  { department: 'Quality QA', count: 6, color: '#059669' },
  { department: 'Field Ops', count: 4, color: '#D97706' },
];

export const DepartmentDistributionChart = ({
  data = defaultDistribution,
  title = 'Department-wise Staff Distribution',
  subtitle = 'Headcount allocation across operational engineering units',
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="pb-4 mb-4 border-b border-slate-100">
        <h4 className="font-semibold text-sm text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="department"
              tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs space-y-0.5 border border-slate-700">
                      <div className="font-semibold text-slate-200">{item.department}</div>
                      <div className="text-teal-400 font-mono">
                        {item.count} Active Personnel
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#0F766E'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
