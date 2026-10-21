import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users2,
  UserCheck,
  FileText,
  Clock,
  Receipt,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
  Plus,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { SpendTrendChart } from '../../components/charts/SpendTrendChart';
import { DepartmentDistributionChart } from '../../components/charts/DepartmentDistributionChart';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateProcurementModal } from '../../components/forms/CreateProcurementModal';
import { CreateCompanyModal } from '../../components/forms/CreateCompanyModal';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';

export const SuperAdminDashboard = () => {
  const { currentUser } = useAuth();
  const { companies, employees, procurementRequests, purchaseOrders, auditLogs, quotations } = useData();
  const navigate = useNavigate();

  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('ALL');
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);

  // Compute Scoped / Global KPIs
  const isAll = selectedCompanyFilter === 'ALL';
  const scopedEmployees = isAll ? employees : employees.filter((e) => e.companyId === selectedCompanyFilter);
  const scopedRequests = isAll ? procurementRequests : procurementRequests.filter((pr) => pr.companyId === selectedCompanyFilter);
  const scopedPOs = isAll ? purchaseOrders : purchaseOrders.filter((po) => po.companyId === selectedCompanyFilter);

  const totalCompanies = isAll ? companies.length : 1;
  const activeEmployees = scopedEmployees.filter((e) => e.accountStatus === 'Active').length;
  const onlineEmployees = scopedEmployees.filter((e) => e.loginStatus === 'Online').length;
  const totalRequests = scopedRequests.length;
  const pendingFinalApprovals = scopedRequests.filter(
    (pr) => pr.currentStatus === 'Pending Super Admin Approval'
  ).length;
  const totalPoValue = scopedPOs.reduce((sum, po) => sum + (po.finalAmount || 0), 0);

  // Filtered Companies Table
  const filteredCompanies = isAll
    ? companies
    : companies.filter((c) => c.id === selectedCompanyFilter);

  // Pending Approvals requiring Super Admin attention
  const pendingApprovalsList = scopedRequests.filter(
    (pr) => pr.currentStatus === 'Pending Super Admin Approval'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              Central Operations Oversight
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            HQ Command & Super Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global monitoring across all registered enterprises, tenders, and statutory approval stages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Company Filter */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-2xs text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Enterprises (Global)</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => navigate('/super-admin/activity')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            title="Inspect Real-time Terminals and Sessions"
          >
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Activity Log</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCompModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Add Company</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPrModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Requisition</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Companies"
          value={totalCompanies}
          trend="+1 this quarter"
          trendPositive={true}
          icon={Building2}
          iconBg="bg-blue-50 text-blue-700"
          onClick={() => navigate('/super-admin/companies')}
        />
        <KpiCard
          title="Active Personnel"
          value={activeEmployees}
          trend="+4 joined this month"
          trendPositive={true}
          icon={Users2}
          iconBg="bg-indigo-50 text-indigo-700"
          onClick={() => navigate('/super-admin/all-employees')}
        />
        <KpiCard
          title="Staff Online"
          value={onlineEmployees}
          subtitle="Real-time connected"
          icon={UserCheck}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          title="Total Requisitions"
          value={totalRequests}
          trend="14 active pipeline"
          trendPositive={true}
          icon={FileText}
          iconBg="bg-teal-50 text-teal-700"
          onClick={() => navigate('/procurement')}
        />
        <KpiCard
          title="Pending HQ Approval"
          value={pendingFinalApprovals}
          subtitle="Stage-2 sign-off required"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-700"
          onClick={() => navigate('/approvals')}
        />
        <KpiCard
          title="Total PO Value"
          value={formatCompactCurrency(totalPoValue)}
          trend="₹5.52 Cr YTD"
          trendPositive={true}
          icon={Receipt}
          iconBg="bg-emerald-50 text-emerald-700"
          onClick={() => navigate('/purchase-orders')}
        />
      </div>

      {/* Pending Approvals Alert Banner (if any) */}
      {pendingApprovalsList.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                {pendingApprovalsList.length} Stage-2 Final Approval(s) Pending Central Authorization
              </h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Technical evaluations approved by Company Admins. Final Super Admin clearance is required to authorize Purchase Order issuance.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/approvals')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            Review Approvals
          </button>
        </div>
      )}

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendTrendChart />
        </div>
        <div>
          <DepartmentDistributionChart />
        </div>
      </div>

      {/* Company Overview Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Authorized Enterprises & Procurement Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live ledger summary across authorized corporate entities
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/super-admin/companies')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Enterprise Name</th>
                <th className="py-3 px-4">GeM Reg / GSTIN</th>
                <th className="py-3 px-4 text-center">Staff Count</th>
                <th className="py-3 px-4 text-center">Online</th>
                <th className="py-3 px-4">Company Admin</th>
                <th className="py-3 px-4 text-center">Pending Approvals</th>
                <th className="py-3 px-4 text-right">Total PO Value</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCompanies.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-[#0B2545] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {comp.code ? comp.code.substring(0, 2) : 'SG'}
                      </div>
                      <span className="truncate max-w-[200px]">{comp.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    <div>{comp.gemRegNo}</div>
                    <div className="text-slate-400 text-[10px]">{comp.gstin}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium">
                    {comp.employeeCount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-mono font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {comp.onlineCount}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{comp.adminName}</div>
                    <div className="text-[10px] text-slate-400">{comp.adminEmail}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {comp.pendingApprovals > 0 ? (
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full font-mono text-[11px]">
                        {comp.pendingApprovals}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(comp.poValue)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={comp.status} size="xs" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/super-admin/companies/${comp.id}`)}
                      className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Inspect Company Ledger"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Section: Recent Central Audits + Recent Requisitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audit Events */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h4 className="font-semibold text-sm text-slate-900">
                Recent Statutory Audit Events
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Immutable chronological event trail across enterprises
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/super-admin/audit-logs')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Full Trail
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-50/60 border border-slate-100 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800">{log.userName}</span>
                    <span className="text-slate-400 text-[10px]">({log.role})</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {log.details}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Procurement Pipeline & Fulfillment */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h4 className="font-semibold text-sm text-slate-900">
                Active Procurement Pipeline
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Current requisitions requiring technical or financial actions
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/procurement')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              All Requests
            </button>
          </div>

          <div className="space-y-3">
            {procurementRequests.slice(0, 4).map((pr) => (
              <div
                key={pr.id}
                onClick={() => navigate(`/procurement/${pr.id}`)}
                className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer transition-colors text-xs flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-slate-800">{pr.requestNumber}</span>
                    <span className="text-[10px] text-slate-500 truncate">• {pr.companyName}</span>
                  </div>
                  <p className="font-medium text-slate-900 text-xs truncate">
                    {pr.title}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Budget: {formatCurrency(pr.estimatedBudget)} • Due: {pr.requiredDeliveryDate}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <StatusBadge status={pr.currentStatus} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Dialogs */}
      <CreateProcurementModal
        isOpen={isPrModalOpen}
        onClose={() => setIsPrModalOpen(false)}
      />
      <CreateCompanyModal
        isOpen={isCompModalOpen}
        onClose={() => setIsCompModalOpen(false)}
      />
    </div>
  );
};
