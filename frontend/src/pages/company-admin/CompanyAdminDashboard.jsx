import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users2,
  UserCheck,
  FileSpreadsheet,
  Clock,
  Briefcase,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { SpendTrendChart } from '../../components/charts/SpendTrendChart';
import { DepartmentDistributionChart } from '../../components/charts/DepartmentDistributionChart';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateProcurementModal } from '../../components/forms/CreateProcurementModal';
import { CreateEmployeeModal } from '../../components/forms/CreateEmployeeModal';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';

export const CompanyAdminDashboard = () => {
  const { currentUser } = useAuth();
  const { employees, workUpdates, salespersons, procurementRequests, purchaseOrders, quotations } = useData();
  const navigate = useNavigate();

  const [isPrModalOpen, setIsPrModalOpen] = useState(false);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);

  // Scope strictly to current company!
  const myCompanyId = currentUser?.companyId || 'comp-1';
  const myEmployees = employees.filter((e) => e.companyId === myCompanyId);
  const mySalespersons = salespersons.filter((sp) => sp.companyId === myCompanyId);
  const myRequests = procurementRequests.filter((pr) => pr.companyId === myCompanyId);
  const myWorkUpdates = workUpdates.filter((wu) => wu.companyId === myCompanyId);
  const myPurchaseOrders = purchaseOrders.filter((po) => po.companyId === myCompanyId);
  const myQuotations = quotations.filter((q) => q.companyId === myCompanyId);

  // Metrics
  const totalEmployees = myEmployees.length;
  const onlineEmployees = myEmployees.filter((e) => e.loginStatus === 'Online').length;
  const workUpdatesToday = myWorkUpdates.filter((wu) => wu.date === '2026-10-19').length;
  const workUpdatesPendingReview = myWorkUpdates.filter((wu) => wu.status === 'Submitted').length;
  const activeSales = mySalespersons.length;
  const pendingCompanyApprovals = myRequests.filter(
    (pr) => pr.currentStatus === 'Pending Company Admin Approval'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              {currentUser?.companyName || 'Swastik Globle Enterprises'} • Operations Deck
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Company Admin Operational Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personnel attendance, daily engineering deliverables, tenders, and Stage-1 technical reviews
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsEmpModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Add Employee</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPrModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Requisition</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Staff"
          value={totalEmployees}
          trend="+2 joined"
          trendPositive={true}
          icon={Users2}
          iconBg="bg-blue-50 text-blue-700"
          onClick={() => navigate('/company-admin/employees')}
        />
        <KpiCard
          title="Staff Online"
          value={onlineEmployees}
          subtitle="Currently active"
          icon={UserCheck}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          title="Work Updates Today"
          value={workUpdatesToday}
          trend="85% filed"
          trendPositive={true}
          icon={FileSpreadsheet}
          iconBg="bg-indigo-50 text-indigo-700"
          onClick={() => navigate('/company-admin/work-updates')}
        />
        <KpiCard
          title="Updates Pending Review"
          value={workUpdatesPendingReview}
          subtitle="Awaiting sign-off"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-700"
          onClick={() => navigate('/company-admin/work-updates')}
        />
        <KpiCard
          title="Active Sales Team"
          value={activeSales}
          subtitle="Bidding personnel"
          icon={Briefcase}
          iconBg="bg-purple-50 text-purple-700"
          onClick={() => navigate('/company-admin/sales-team')}
        />
        <KpiCard
          title="Stage 1 Approvals"
          value={pendingCompanyApprovals}
          subtitle="Awaiting evaluation"
          icon={ShieldCheck}
          iconBg="bg-blue-50 text-blue-700"
          onClick={() => navigate('/approvals')}
        />
      </div>

      {/* Stage 1 Review Alert Banner (if needed) */}
      {pendingCompanyApprovals > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                {pendingCompanyApprovals} Procurement Requisition(s) Require Your Stage-1 Technical Review
              </h4>
              <p className="text-xs text-blue-800/90 mt-0.5">
                Review vendor compliance, specifications, and line items. Once approved by you, the dossier is automatically forwarded to Super Admin HQ for final clearance.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/approvals')}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            Review Requisitions
          </button>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendTrendChart
            title="Company Procurement & PO Expenditures"
            subtitle="Departmental billing progression over recent months"
            color="#2563EB"
          />
        </div>
        <div>
          <DepartmentDistributionChart
            title="Company Staff by Department"
            subtitle="Staff headcount allocation across internal units"
          />
        </div>
      </div>

      {/* Two Column Grid: Employee Management Quick Table & Daily Work Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees Table Quick View */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h4 className="font-semibold text-sm text-slate-900">
                Company Employees Roster
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Staff credentials, departments, and live connection status
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/company-admin/employees')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myEmployees.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No employees registered for this company yet.
                <button
                  type="button"
                  onClick={() => setIsEmpModalOpen(true)}
                  className="block mx-auto mt-2 text-blue-700 font-semibold hover:underline"
                >
                  + Add First Employee
                </button>
              </div>
            ) : (
              myEmployees.slice(0, 4).map((emp) => (
                <div key={emp.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 truncate">{emp.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({emp.employeeId})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {emp.designation} • {emp.department}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={emp.loginStatus} size="xs" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Daily Work Updates Review */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h4 className="font-semibold text-sm text-slate-900">
                Daily Work Updates Submitted
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Engineering milestones and logged billable hours
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/company-admin/work-updates')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              Review Updates
            </button>
          </div>

          <div className="space-y-3">
            {myWorkUpdates.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No work reports filed by staff today.
              </div>
            ) : (
              myWorkUpdates.slice(0, 3).map((wu) => (
                <div
                  key={wu.id}
                  className="p-3 rounded-lg bg-slate-50/60 border border-slate-200/80 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-900">{wu.employeeName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-700 font-bold">{wu.hoursWorked} hrs</span>
                      <StatusBadge status={wu.status} size="xs" />
                    </div>
                  </div>
                  <p className="font-medium text-slate-800 text-[11px] truncate mb-0.5">
                    {wu.taskTitle}
                  </p>
                  <p className="text-slate-500 text-[10px] line-clamp-2 leading-relaxed">
                    {wu.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateProcurementModal
        isOpen={isPrModalOpen}
        onClose={() => setIsPrModalOpen(false)}
      />
      <CreateEmployeeModal
        isOpen={isEmpModalOpen}
        onClose={() => setIsEmpModalOpen(false)}
      />
    </div>
  );
};
