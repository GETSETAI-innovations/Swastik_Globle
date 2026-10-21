import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export const KpiCard = ({
  title,
  value,
  trend,
  trendPositive = true,
  trendLabel = 'vs last month',
  subtitle,
  icon: Icon,
  iconBg = 'bg-teal-50 text-teal-700',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 active:scale-[0.99]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <div className="text-2xl font-bold text-slate-900 tracking-tight font-sans tabular-nums">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg} shadow-xs`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {trend ? (
          <div className="flex items-center gap-1">
            <span
              className={`inline-flex items-center text-xs font-semibold ${
                trendPositive ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {trendPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {trend}
            </span>
            <span className="text-slate-400 text-[11px]">{trendLabel}</span>
          </div>
        ) : subtitle ? (
          <span className="text-slate-500 text-[11px] truncate">{subtitle}</span>
        ) : (
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-slate-400" /> Active Tracking
          </span>
        )}
      </div>
    </div>
  );
};
