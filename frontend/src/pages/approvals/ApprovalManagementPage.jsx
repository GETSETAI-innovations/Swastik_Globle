import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PdfPreviewModal } from '../../components/common/PdfPreviewModal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { CreatePoModal } from '../../components/forms/CreatePoModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Eye,
  Receipt,
  AlertTriangle,
  Building,
  User,
  ArrowRight,
} from 'lucide-react';

export const ApprovalManagementPage = () => {
  const { currentUser, isSuperAdmin, isCompanyAdmin } = useAuth();
  const {
    procurementRequests,
    quotations,
    approveStage1,
    rejectStage1,
    approveStage2,
    rejectStage2,
  } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'completed' | 'all'
  const [previewDoc, setPreviewDoc] = useState(null);
  const [selectedPrForPo, setSelectedPrForPo] = useState(null);
  const [selectedQuoteForPo, setSelectedQuoteForPo] = useState(null);
  const [actionDialog, setActionDialog] = useState({
    isOpen: false,
    pr: null,
    quote: null,
    stage: 1, // 1 or 2
    action: 'approve', // 'approve' or 'reject'
    remarks: '',
  });

  // Filter PRs scoped to role and company
  const scopedPRs = isSuperAdmin
    ? procurementRequests
    : procurementRequests.filter((pr) => pr.companyId === currentUser?.companyId);

  // Tab filtering
  const filteredPRs = scopedPRs.filter((pr) => {
    const isPending = pr.currentStatus.includes('Pending');
    const isCompleted = pr.currentStatus === 'Approved' || pr.currentStatus === 'Ordered' || pr.currentStatus === 'Rejected';

    if (activeTab === 'pending') return isPending;
    if (activeTab === 'completed') return isCompleted;
    return true;
  });

  const handleOpenAction = (pr, stage, action) => {
    const quote = quotations.find((q) => q.id === pr.selectedQuotationId) || quotations.find((q) => q.procurementRequestId === pr.id);
    setActionDialog({
      isOpen: true,
      pr,
      quote,
      stage,
      action,
      remarks: action === 'approve'
        ? (stage === 1 ? 'Technical compliance and quotation terms approved by Company Admin.' : 'Final central clearance approved by Super Admin HQ.')
        : '',
    });
  };

  const handleConfirmAction = () => {
    const { pr, quote, stage, action, remarks } = actionDialog;
    if (!pr) return;

    if (stage === 1) {
      if (action === 'approve') {
        approveStage1(pr.id, quote?.id, remarks, currentUser);
        addToast({
          title: 'Stage-1 Approved',
          message: `Forwarded ${pr.requestNumber} to Super Admin HQ for Stage-2 clearance.`,
          type: 'success',
        });
      } else {
        rejectStage1(pr.id, quote?.id, remarks, currentUser);
        addToast({
          title: 'Stage-1 Rejected',
          message: `${pr.requestNumber} rejected with remarks logged.`,
          type: 'warning',
        });
      }
    } else if (stage === 2) {
      if (action === 'approve') {
        approveStage2(pr.id, quote?.id, remarks, currentUser);
        addToast({
          title: 'Super Admin Final Approval Granted',
          message: `Central clearance complete! Purchase Order issuance is unlocked for ${pr.requestNumber}.`,
          type: 'success',
        });
      } else {
        rejectStage2(pr.id, quote?.id, remarks, currentUser);
        addToast({
          title: 'Stage-2 Rejected',
          message: `Final approval declined for ${pr.requestNumber}.`,
          type: 'error',
        });
      }
    }

    setActionDialog({ isOpen: false, pr: null, quote: null, stage: 1, action: 'approve', remarks: '' });
  };

  const handleOpenPoModal = (pr) => {
    const quote = quotations.find((q) => q.id === pr.selectedQuotationId) || quotations.find((q) => q.procurementRequestId === pr.id);
    setSelectedPrForPo(pr);
    setSelectedQuoteForPo(quote);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              Statutory Two-Stage Review Desk
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Procurement Approval Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mandatory governance: Salesperson submission → Company Admin Stage 1 → Super Admin HQ Stage 2 → Purchase Order unlock
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Actions ({scopedPRs.filter((p) => p.currentStatus.includes('Pending')).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'completed'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Decided / Completed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Requisitions
          </button>
        </div>
      </div>

      {/* Requisitions List with Interactive Two-Stage Steppers */}
      <div className="space-y-4">
        {filteredPRs.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-xs">
            <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No Approvals Pending</h3>
            <p className="text-xs text-slate-500 mt-1">
              All procurement requisitions are up to date in this view.
            </p>
          </div>
        ) : (
          filteredPRs.map((pr) => {
            const quote = quotations.find((q) => q.id === pr.selectedQuotationId) || quotations.find((q) => q.procurementRequestId === pr.id);
            const stage1 = pr.approvalWorkflow?.stage1;
            const stage2 = pr.approvalWorkflow?.stage2;

            const isStage1Approved = stage1?.status === 'Approved';
            const isStage1Pending = pr.currentStatus === 'Pending Company Admin Approval';
            const isStage2Pending = pr.currentStatus === 'Pending Super Admin Approval';
            const isFullyApproved = pr.currentStatus === 'Approved';
            const isOrdered = pr.currentStatus === 'Ordered';

            const canActStage1 = isCompanyAdmin && isStage1Pending && pr.companyId === currentUser?.companyId;
            const canActStage2 = isSuperAdmin && isStage2Pending;

            return (
              <div
                key={pr.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {pr.requestNumber}
                      </span>
                      <StatusBadge status={pr.currentStatus} size="xs" />
                      <span className="text-[11px] text-slate-400">• {pr.companyName}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm mt-0.5 truncate">
                      {pr.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Estimated Budget
                      </span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {formatCurrency(pr.estimatedBudget)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Quantity
                      </span>
                      <span className="font-mono font-medium text-slate-800">
                        {pr.requiredQuantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected Quotation Brief */}
                {quote ? (
                  <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-1.5 py-0.5 rounded">
                          Evaluated Bid
                        </span>
                        <span className="font-semibold text-slate-900 truncate">
                          {quote.vendorName}
                        </span>
                        <span className="font-mono text-slate-500">({quote.quotationNumber})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Lead time: {quote.deliveryTime} • Warranty: {quote.warranty} • Terms: {quote.paymentTerms}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Total Bid Value</span>
                        <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                          {formatCurrency(quote.finalAmount)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(quote)}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                        title="View Official Bid PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>No quotation has been attached to this requisition yet. Bidding team must submit a quotation.</span>
                  </div>
                )}

                {/* 5-Stage Procurement Progress Bar */}
                <div className="p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl overflow-x-auto">
                  <div className="flex items-center justify-between min-w-[520px] gap-2">
                    {[
                      { num: 1, label: '1. Requisition', done: true },
                      { num: 2, label: '2. Quotations', done: Boolean(quote), current: pr.currentStatus === 'Collecting Quotations' },
                      {
                        num: 3,
                        label: '3. Co. Admin',
                        done: isStage1Approved,
                        rejected: stage1?.status === 'Rejected',
                        current: isStage1Pending,
                      },
                      {
                        num: 4,
                        label: '4. Super Admin',
                        done: stage2?.status === 'Approved',
                        rejected: stage2?.status === 'Rejected',
                        current: isStage2Pending,
                        locked: !isStage1Approved,
                      },
                      {
                        num: 5,
                        label: '5. Purchase Order',
                        done: isOrdered,
                        ready: isFullyApproved && !isOrdered,
                        locked: !isFullyApproved,
                      },
                    ].map((st, sIdx, arr) => (
                      <React.Fragment key={st.num}>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              st.done
                                ? 'bg-emerald-600 text-white'
                                : st.rejected
                                ? 'bg-rose-600 text-white'
                                : st.current || st.ready
                                ? 'bg-teal-700 text-white ring-2 ring-teal-200'
                                : st.locked
                                ? 'bg-slate-200 text-slate-400'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {st.done ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : st.rejected ? (
                              <XCircle className="w-3 h-3" />
                            ) : st.locked ? (
                              <Lock className="w-2.5 h-2.5" />
                            ) : (
                              st.num
                            )}
                          </span>
                          <span
                            className={`text-[10px] font-semibold tracking-tight ${
                              st.done
                                ? 'text-emerald-800'
                                : st.rejected
                                ? 'text-rose-700'
                                : st.current || st.ready
                                ? 'text-teal-900 font-bold'
                                : 'text-slate-400'
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                        {sIdx < arr.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 min-w-[12px] max-w-[36px] ${
                              st.done ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Two-Stage Approval Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Stage 1: Company Admin */}
                  <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                    isStage1Approved
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : stage1?.status === 'Rejected'
                      ? 'bg-rose-50/40 border-rose-200'
                      : isStage1Pending
                      ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300/50'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                          1
                        </span>
                        <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                          Stage 1: Company Admin Review
                        </span>
                      </div>
                      <StatusBadge status={stage1?.status || 'Pending'} size="xs" />
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>Reviewer: <span className="font-medium text-slate-800">{stage1?.reviewer || 'Assigned Company Admin'}</span></div>
                      {stage1?.timestamp && <div>Date: <span className="text-slate-700">{stage1.timestamp}</span></div>}
                      {stage1?.remarks && (
                        <p className="italic text-slate-600 mt-1 bg-white/60 p-1.5 rounded border border-slate-200/50">
                          "{stage1.remarks}"
                        </p>
                      )}
                    </div>

                    {/* Action buttons if user can act */}
                    {canActStage1 && (
                      <div className="pt-2 flex items-center gap-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => handleOpenAction(pr, 1, 'approve')}
                          className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve Stage 1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAction(pr, 1, 'reject')}
                          className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Stage 2: Super Admin HQ */}
                  <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                    pr.approvalWorkflow?.stage2?.status === 'Approved'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : stage2?.status === 'Rejected'
                      ? 'bg-rose-50/40 border-rose-200'
                      : isStage2Pending
                      ? 'bg-blue-50/40 border-blue-300 ring-1 ring-blue-300/50'
                      : 'bg-slate-50 border-slate-200 opacity-70'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                          2
                        </span>
                        <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                          Stage 2: Super Admin HQ Final Sign-off
                        </span>
                      </div>
                      <StatusBadge status={stage2?.status || (isStage1Approved ? 'Pending' : 'Locked')} size="xs" />
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>Reviewer: <span className="font-medium text-slate-800">{stage2?.reviewer || 'Super Admin HQ'}</span></div>
                      {stage2?.timestamp && <div>Date: <span className="text-slate-700">{stage2.timestamp}</span></div>}
                      <p className="italic text-slate-600 mt-1 bg-white/60 p-1.5 rounded border border-slate-200/50">
                        "{stage2?.remarks || (isStage1Approved ? 'Awaiting Super Admin central review.' : 'Locked until Stage 1 approved.')}"
                      </p>
                    </div>

                    {/* Action buttons for Super Admin */}
                    {canActStage2 && (
                      <div className="pt-2 flex items-center gap-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => handleOpenAction(pr, 2, 'approve')}
                          className="flex-1 py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Grant Final PO Clearance
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAction(pr, 2, 'reject')}
                          className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Final State & PO Action */}
                {isFullyApproved && !isOrdered && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">
                        Statutory approvals complete. Contract is cleared for official Purchase Order generation.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenPoModal(pr)}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Issue Purchase Order</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Action Dialog (Approve / Reject) */}
      <ConfirmationDialog
        isOpen={actionDialog.isOpen}
        onClose={() => setActionDialog({ isOpen: false, pr: null, quote: null, stage: 1, action: 'approve', remarks: '' })}
        onConfirm={handleConfirmAction}
        title={
          actionDialog.action === 'approve'
            ? actionDialog.stage === 1
              ? 'Certify Stage 1 Company Approval'
              : 'Grant Final Super Admin PO Clearance'
            : `Reject Requisition (Stage ${actionDialog.stage})`
        }
        message={
          actionDialog.action === 'approve'
            ? actionDialog.stage === 1
              ? `Certify technical compliance and forwarding of ${actionDialog.pr?.requestNumber} to Super Admin HQ.`
              : `Authorize final procurement sign-off and unlock official Purchase Order creation for ${actionDialog.pr?.requestNumber}.`
            : `Are you sure you want to decline this procurement proposal? A statutory rejection reason is mandatory.`
        }
        confirmText={actionDialog.action === 'approve' ? 'Authorize & Proceed' : 'Confirm Rejection'}
        type={actionDialog.action === 'approve' ? 'success' : 'danger'}
        reasonInput={true}
        reasonRequired={actionDialog.action === 'reject'}
        reasonValue={actionDialog.remarks}
        onReasonChange={(val) => setActionDialog((prev) => ({ ...prev, remarks: val }))}
        reasonPlaceholder={
          actionDialog.action === 'reject'
            ? 'Enter mandatory rejection justification...'
            : 'Enter approval evaluation remarks...'
        }
      />

      {/* PO Issuance Modal */}
      <CreatePoModal
        isOpen={!!selectedPrForPo}
        onClose={() => {
          setSelectedPrForPo(null);
          setSelectedQuoteForPo(null);
        }}
        procurementRequest={selectedPrForPo}
        quotation={selectedQuoteForPo}
      />

      {/* PDF Preview */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        documentData={previewDoc}
        type="quotation"
      />
    </div>
  );
};
