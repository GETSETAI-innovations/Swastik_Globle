import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';

const defaultMonthlyData = [
  { month: 'May 2026', quotations: 18500000, purchaseOrders: 14200000 },
  { month: 'Jun 2026', quotations: 22000000, purchaseOrders: 18900000 },
  { month: 'Jul 2026', quotations: 26400000, purchaseOrders: 21500000 },
  { month: 'Aug 2026', quotations: 31000000, purchaseOrders: 27800000 },
  { month: 'Sep 2026', quotations: 29500000, purchaseOrders: 24600000 },
  { month: 'Oct 2026', quotations: 38200000, purchaseOrders: 32100000 },
];

export const SpendTrendChart = ({
  data = defaultMonthlyData,
  title = 'Monthly Quotation vs Purchase Order Trends',
  subtitle = 'Fiscal value in INR across all authorized tenders',
  color = '#0F766E',
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
        <div>
          <h4 className="font-semibold text-sm text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-slate-600 font-medium">Quotations</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600 font-medium">Purchase Orders</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPO" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCompactCurrency(v)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1 border border-slate-700">
                      <div className="font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-1">
                        {label}
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-teal-400">Quotations:</span>
                        <span className="font-mono font-bold">
                          {formatCurrency(payload[0]?.value)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-blue-400">Purchase Orders:</span>
                        <span className="font-mono font-bold">
                          {formatCurrency(payload[1]?.value)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="quotations"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorQuotes)"
            />
            <Area
              type="monotone"
              dataKey="purchaseOrders"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPO)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
