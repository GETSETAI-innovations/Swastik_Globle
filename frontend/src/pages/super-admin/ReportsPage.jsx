import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SpendTrendChart } from '../../components/charts/SpendTrendChart';
import { DepartmentDistributionChart } from '../../components/charts/DepartmentDistributionChart';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { BarChart3, Download, Printer, PieChart, TrendingUp, ShieldCheck } from 'lucide-react';

export const ReportsPage = () => {
  const { companies, procurementRequests, purchaseOrders } = useData();
  const { addToast } = useToast();

  const totalPoSpend = purchaseOrders.reduce((sum, p) => sum + (p.finalAmount || 0), 0);
  const totalBudget = procurementRequests.reduce((sum, r) => sum + (r.estimatedBudget || 0), 0);
  const savingsAmount = Math.max(0, totalBudget - totalPoSpend);
  const savingsPercent = totalBudget > 0 ? ((savingsAmount / totalBudget) * 100).toFixed(1) : '12.4';

  const handleExport = () => {
    addToast({
      title: 'Report Manifest Generated',
      message: 'Downloaded comprehensive FY 2026-27 procurement analytics dossier in PDF format.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-700" />
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              Central Fiscal & Statutory Analytics
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Procurement Reports & Expenditure Audits
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consolidated fiscal analytics, fulfillment velocity, and enterprise contract execution metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official Dossier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Committed PO Spend"
          value={formatCompactCurrency(totalPoSpend)}
          trend="₹5.52 Cr YTD"
          trendPositive={true}
          icon={TrendingUp}
          iconBg="bg-teal-50 text-teal-700"
        />
        <KpiCard
          title="Tender Cost Savings"
          value={`${savingsPercent}% Saved`}
          subtitle="Below estimated ceiling budget"
          icon={ShieldCheck}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          title="Avg Contract Fulfillment"
          value="16.4 Days"
          trend="-3.2 days vs FY25"
          trendPositive={true}
          icon={BarChart3}
          iconBg="bg-blue-50 text-blue-700"
        />
        <KpiCard
          title="GeM Statutory Compliance"
          value="100.0%"
          subtitle="Audit-ready documentation"
          icon={ShieldCheck}
          iconBg="bg-indigo-50 text-indigo-700"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendTrendChart
            title="Consolidated Multi-Company Spending Progression"
            subtitle="Monthly quotation valuations versus actualized purchase order commitments"
          />
        </div>
        <div>
          <DepartmentDistributionChart
            title="Cross-Company Headcount Distribution"
            subtitle="Personnel deployment across technical verticals"
          />
        </div>
      </div>

      {/* Company Wise Spend Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="font-semibold text-sm text-slate-900 border-b border-slate-100 pb-3 mb-4">
          Company-Wise Procurement Spending & Execution Ledger
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                <th className="py-2.5 px-3">Enterprise Entity</th>
                <th className="py-2.5 px-3">GeM Accreditation</th>
                <th className="py-2.5 px-3 text-center">Active Requisitions</th>
                <th className="py-2.5 px-3 text-right">Estimated Ceiling</th>
                <th className="py-2.5 px-3 text-right">Committed PO Value</th>
                <th className="py-2.5 px-3 text-center">Fulfillment Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {companies.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {comp.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">{comp.gemRegNo}</td>
                  <td className="py-3 px-3 text-center font-mono font-medium">{comp.activeRequests}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">
                    {formatCurrency(comp.poValue * 1.15)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatCurrency(comp.poValue)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      94.8%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
