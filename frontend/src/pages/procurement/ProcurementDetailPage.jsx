import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ApprovalTimeline } from '../../components/common/ApprovalTimeline';
import { PdfPreviewModal } from '../../components/common/PdfPreviewModal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { CreatePoModal } from '../../components/forms/CreatePoModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Building2,
  User,
  Paperclip,
  GitCompare,
  PlusCircle,
  Eye,
  Receipt,
  ShieldCheck,
} from 'lucide-react';

export const ProcurementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isSuperAdmin, isCompanyAdmin } = useAuth();
  const {
    procurementRequests,
    quotations,
    purchaseOrders,
    approveStage1,
    rejectStage1,
    approveStage2,
    rejectStage2,
  } = useData();
  const { addToast } = useToast();

  const [previewDoc, setPreviewDoc] = useState(null);
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [rejectDialog, setRejectDialog] = useState({ isOpen: false, stage: null, reason: '' });
  const [approveDialog, setApproveDialog] = useState({ isOpen: false, stage: null, remarks: '' });

  const request = procurementRequests.find((pr) => pr.id === id);

  if (!request) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
        <h3 className="text-base font-bold text-slate-800">Requisition Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested procurement requisition does not exist or has been archived.
        </p>
        <button
          type="button"
          onClick={() => navigate('/procurement')}
          className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold"
        >
          Back to Requisitions
        </button>
      </div>
    );
  }

  // Linked Quotations
  const relatedQuotes = quotations.filter((q) => q.procurementRequestId === request.id);
  const selectedQuote = relatedQuotes.find((q) => q.id === request.selectedQuotationId) || relatedQuotes[0];
  const linkedPo = purchaseOrders.find((po) => po.requestId === request.id);

  // Review permissions
  const canReviewStage1 = isCompanyAdmin && request.companyId === currentUser?.companyId;
  const canReviewStage2 = isSuperAdmin;

  // Confirm Stage 1 Approval
  const handleStage1Approve = () => {
    approveStage1(request.id, selectedQuote?.id, approveDialog.remarks, currentUser);
    addToast({
      title: 'Stage-1 Approved',
      message: `Technical review cleared by Company Admin. Sent to Super Admin HQ for final clearance.`,
      type: 'success',
    });
    setApproveDialog({ isOpen: false, stage: null, remarks: '' });
  };

  // Confirm Stage 2 Approval
  const handleStage2Approve = () => {
    approveStage2(request.id, selectedQuote?.id, approveDialog.remarks, currentUser);
    addToast({
      title: 'Final Super Admin Approval Granted',
      message: `Statutory central clearance completed. Purchase Order issuance is unlocked.`,
      type: 'success',
    });
    setApproveDialog({ isOpen: false, stage: null, remarks: '' });
  };

  // Confirm Rejection
  const handleReject = () => {
    if (rejectDialog.stage === 1) {
      rejectStage1(request.id, selectedQuote?.id, rejectDialog.reason, currentUser);
      addToast({
        title: 'Stage-1 Rejected',
        message: 'Requisition returned with Company Admin remarks.',
        type: 'warning',
      });
    } else {
      rejectStage2(request.id, selectedQuote?.id, rejectDialog.reason, currentUser);
      addToast({
        title: 'Stage-2 Rejected',
        message: 'Requisition rejected by Super Admin HQ.',
        type: 'error',
      });
    }
    setRejectDialog({ isOpen: false, stage: null, reason: '' });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/procurement')}
            className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                {request.requestNumber}
              </span>
              <StatusBadge status={request.currentStatus} size="xs" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              {request.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => navigate(`/quotation-comparison?prId=${request.id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <GitCompare className="w-3.5 h-3.5 text-blue-600" />
              <span>Compare {relatedQuotes.length} Quotes</span>
            </button>
          )}

          {request.currentStatus === 'Approved' && !linkedPo && (
            <button
              type="button"
              onClick={() => setIsPoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Generate Purchase Order</span>
            </button>
          )}

          {linkedPo && (
            <button
              type="button"
              onClick={() => navigate(`/purchase-orders/${linkedPo.id}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>View Issued PO</span>
            </button>
          )}
        </div>
      </div>

      {/* Two-Stage Approval Tracker Banner */}
      <ApprovalTimeline
        workflow={request.approvalWorkflow}
        currentStatus={request.currentStatus}
        canReviewStage1={canReviewStage1}
        canReviewStage2={canReviewStage2}
        onStage1Approve={() => setApproveDialog({ isOpen: true, stage: 1, remarks: 'Verified technical specifications and vendor warranty compliance.' })}
        onStage1Reject={() => setRejectDialog({ isOpen: true, stage: 1, reason: '' })}
        onStage2Approve={() => setApproveDialog({ isOpen: true, stage: 2, remarks: 'Final central sign-off granted by Super Admin HQ. Contract authorized.' })}
        onStage2Reject={() => setRejectDialog({ isOpen: true, stage: 2, reason: '' })}
      />

      {/* Detailed Grid: Dossier Overview & Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Requisition Scope & Specs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Procurement Technical Scope & Justification
            </h3>

            <p className="text-xs text-slate-700 leading-relaxed">
              {request.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Category</span>
                <p className="font-medium text-slate-800 mt-0.5">{request.category}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Required Quantity</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{request.requiredQuantity}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Allocated Budget</span>
                <p className="font-mono font-bold text-teal-800 mt-0.5 tabular-nums">
                  {formatCurrency(request.estimatedBudget)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Delivery Due</span>
                <p className="font-mono font-medium text-slate-800 mt-0.5">
                  {formatDate(request.requiredDeliveryDate)}
                </p>
              </div>
            </div>

            {/* Mandatory Technical Attachments */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Mandatory Technical Dossier & BOQ Attachments
              </span>
              <div className="space-y-2">
                {(request.attachments || []).map((file, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-700" />
                      <span className="font-medium text-slate-800">{file.name}</span>
                      <span className="text-[10px] text-slate-400">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addToast({
                          title: 'Dossier Downloaded',
                          message: `Downloading ${file.name} for technical review.`,
                          type: 'info',
                        })
                      }
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Received Vendor Quotations Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Received Vendor Bids ({relatedQuotes.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Competitive quotation submissions awaiting side-by-side evaluation
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/salesperson/create-quotation?prId=${request.id}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Quote</span>
              </button>
            </div>

            <div className="space-y-3">
              {relatedQuotes.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    q.isLowestPrice
                      ? 'bg-emerald-50/30 border-emerald-300 ring-1 ring-emerald-400/30'
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-slate-900">{q.quotationNumber}</span>
                      {q.isLowestPrice && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Lowest Evaluated Bid
                        </span>
                      )}
                      <StatusBadge status={q.status} size="xs" />
                    </div>
                    <div className="font-semibold text-slate-800 text-xs">
                      {q.vendorName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Warranty: {q.warranty} • Delivery: {q.deliveryTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:text-right">
                    <div>
                      <div className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                        {formatCurrency(q.finalAmount)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {q.priceDeltaPercent}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(q)}
                        className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-white rounded-lg border border-slate-200 shadow-2xs transition-colors"
                        title="Preview PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => navigate(`/quotation-comparison?prId=${request.id}`)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
                        >
                          Evaluate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Requisition Meta Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-4">
            <h4 className="font-semibold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Requisition Statutory Metadata
            </h4>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Corporate Origin
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-900">{request.companyName}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Requisition Initiator
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-900">{request.requestedBy}</span>
                  <span className="text-slate-400">({request.requestedByRole})</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Filing Timestamp
                </span>
                <div className="flex items-center gap-2 mt-1 text-slate-700 font-mono">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>{formatDate(request.createdDate)}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Evaluation Framework
                </span>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  GFR 2017 Rule 149 (Value-based selection evaluating price, OEM warranty, compliance, and delivery schedule).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        documentData={previewDoc}
        type="quotation"
      />

      {/* PO Creation Modal */}
      <CreatePoModal
        isOpen={isPoModalOpen}
        onClose={() => setIsPoModalOpen(false)}
        procurementRequest={request}
        quotation={selectedQuote}
      />

      {/* Approval Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={approveDialog.isOpen}
        onClose={() => setApproveDialog({ isOpen: false, stage: null, remarks: '' })}
        onConfirm={approveDialog.stage === 1 ? handleStage1Approve : handleStage2Approve}
        title={approveDialog.stage === 1 ? 'Confirm Stage 1 Approval' : 'Grant Final Super Admin PO Clearance'}
        message={
          approveDialog.stage === 1
            ? 'As Company Admin, you are certifying technical & financial compliance of the selected quotation. This will unlock Stage 2 Super Admin review.'
            : 'As Super Admin HQ, you are granting central statutory clearance. This will unlock official Purchase Order creation.'
        }
        confirmText={approveDialog.stage === 1 ? 'Approve Stage 1' : 'Grant Final Clearance'}
        type="success"
        reasonInput={true}
        reasonValue={approveDialog.remarks}
        onReasonChange={(val) => setApproveDialog((prev) => ({ ...prev, remarks: val }))}
        reasonPlaceholder="Enter approval remarks..."
      />

      {/* Rejection Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={rejectDialog.isOpen}
        onClose={() => setRejectDialog({ isOpen: false, stage: null, reason: '' })}
        onConfirm={handleReject}
        title="Reject Requisition / Quotation"
        message="Please provide a mandatory justification for rejecting this proposal. The decision will be logged permanently in the audit trail."
        confirmText="Confirm Rejection"
        type="danger"
        reasonInput={true}
        reasonRequired={true}
        reasonValue={rejectDialog.reason}
        onReasonChange={(val) => setRejectDialog((prev) => ({ ...prev, reason: val }))}
        reasonPlaceholder="Detailed statutory reason for rejection (Required)..."
      />
    </div>
  );
};
