import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Receipt,
  Upload,
  ArrowUpRight,
  FileUp,
  Store,
  Eye,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { SpendTrendChart } from '../../components/charts/SpendTrendChart';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PdfPreviewModal } from '../../components/common/PdfPreviewModal';
import { formatCurrency, formatCompactCurrency, formatDate } from '../../utils/formatters';

export const SalespersonDashboard = () => {
  const { currentUser } = useAuth();
  const { procurementRequests, quotations } = useData();
  const navigate = useNavigate();

  const [previewDoc, setPreviewDoc] = useState(null);

  // Scope to current salesperson company
  const myCompanyId = currentUser?.companyId || 'comp-1';
  const myRequests = procurementRequests.filter((pr) => pr.companyId === myCompanyId);
  const myQuotes = quotations.filter((q) => q.companyId === myCompanyId);

  // Metrics
  const assignedRequests = myRequests.length;
  const quotesCreated = myQuotes.length;
  const quotesAwaitingReview = myQuotes.filter((q) => q.status.includes('Pending')).length;
  const quotesApproved = myQuotes.filter((q) => q.status === 'Approved' || q.status === 'Ordered').length;
  const quotesRejected = myQuotes.filter((q) => q.status === 'Rejected').length;
  const totalQuoteValue = myQuotes.reduce((sum, q) => sum + (q.finalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Bidding Desk • {currentUser?.companyName}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Procurement Bidding & Quotation Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vendor bid preparation, BOQ calculations, PDF manifest uploads, and two-stage approval tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/salesperson/upload-pdf')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload PDF Bid</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/salesperson/create-quotation')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Quotation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Assigned Requests"
          value={assignedRequests}
          subtitle="Tenders for company"
          icon={FileText}
          iconBg="bg-blue-50 text-blue-700"
          onClick={() => navigate('/procurement')}
        />
        <KpiCard
          title="Quotations Created"
          value={quotesCreated}
          trend="+3 this week"
          trendPositive={true}
          icon={Receipt}
          iconBg="bg-emerald-50 text-emerald-700"
          onClick={() => navigate('/salesperson/my-quotations')}
        />
        <KpiCard
          title="Awaiting Review"
          value={quotesAwaitingReview}
          subtitle="Stage 1 or Stage 2"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-700"
          onClick={() => navigate('/approvals')}
        />
        <KpiCard
          title="Approved Quotes"
          value={quotesApproved}
          trend="85% win rate"
          trendPositive={true}
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          title="Rejected Quotes"
          value={quotesRejected}
          subtitle="Technical or price"
          icon={XCircle}
          iconBg="bg-rose-50 text-rose-700"
        />
        <KpiCard
          title="Total Bidding Value"
          value={formatCompactCurrency(totalQuoteValue)}
          trend="Commercial pipeline"
          trendPositive={true}
          icon={Receipt}
          iconBg="bg-teal-50 text-teal-700"
        />
      </div>

      {/* Spend & Quotation Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendTrendChart
            title="Monthly Quotation Submissions"
            subtitle="Value of competitive vendor bids filed for institutional tenders"
            color="#059669"
          />
        </div>

        {/* Quotation Submission Pipeline Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 mb-3 border-b border-slate-100">
              <h4 className="font-semibold text-sm text-slate-900">
                Quotation Approval Pipeline
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Current progress across statutory clearance stages
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <div className="flex justify-between items-center text-amber-900 font-semibold mb-1">
                  <span>Awaiting Stage 1 (Co. Admin)</span>
                  <span className="font-mono">
                    {myQuotes.filter((q) => q.status === 'Pending Company Admin Approval').length}
                  </span>
                </div>
                <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-2/5 rounded-full" />
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div className="flex justify-between items-center text-blue-900 font-semibold mb-1">
                  <span>Awaiting Stage 2 (Super Admin)</span>
                  <span className="font-mono">
                    {myQuotes.filter((q) => q.status === 'Pending Super Admin Approval').length}
                  </span>
                </div>
                <div className="w-full bg-blue-200/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-4/5 rounded-full" />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div className="flex justify-between items-center text-emerald-900 font-semibold mb-1">
                  <span>PO Clearance Granted</span>
                  <span className="font-mono">{quotesApproved}</span>
                </div>
                <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/salesperson/create-quotation')}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Initiate New Vendor Bid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: My Quotations & Recent Uploaded PDF Manifests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Created Quotations Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h4 className="font-semibold text-sm text-slate-900">
                My Quotations & Evaluations
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Bids submitted for technical evaluation
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/salesperson/my-quotations')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myQuotes.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No quotations submitted yet. Click "Initiate New Vendor Bid" to prepare a quote.
              </div>
            ) : (
              myQuotes.slice(0, 4).map((q) => (
                <div key={q.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{q.quotationNumber}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({q.requestNumber})</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium truncate">
                      {q.vendorName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Lead time: {q.deliveryTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">
                        {formatCurrency(q.finalAmount)}
                      </div>
                      {q.isLowestPrice && (
                        <span className="text-[10px] font-bold text-emerald-700">Lowest Bid</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(q)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Preview PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assigned Requisitions Ready for Bidding */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h4 className="font-semibold text-sm text-slate-900">
                Assigned Requisitions for Bidding
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Requisitions ready for vendor quotes collection
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/procurement')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Browse All
            </button>
          </div>

          <div className="space-y-3">
            {myRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No open procurement requisitions assigned to this company.
              </div>
            ) : (
              myRequests.slice(0, 3).map((pr) => (
                <div
                  key={pr.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono font-bold text-slate-800">{pr.requestNumber}</span>
                      <StatusBadge status={pr.currentStatus} size="xs" />
                    </div>
                    <p className="font-semibold text-slate-900 text-xs truncate">
                      {pr.title}
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      Qty: {pr.requiredQuantity} • Budget: {formatCurrency(pr.estimatedBudget)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/salesperson/create-quotation?prId=${pr.id}`)}
                    className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-2xs"
                  >
                    Prepare Quote
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        documentData={previewDoc}
        type="quotation"
      />
    </div>
  );
};
