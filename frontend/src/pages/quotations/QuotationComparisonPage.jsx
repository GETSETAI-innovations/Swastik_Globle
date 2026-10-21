import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PdfPreviewModal } from '../../components/common/PdfPreviewModal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  GitCompare,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  Award,
  ShieldCheck,
  TrendingDown,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';

export const QuotationComparisonPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, isSuperAdmin, isCompanyAdmin } = useAuth();
  const { procurementRequests, quotations, approveStage1, approveStage2 } = useData();
  const { addToast } = useToast();

  const requestedPrId = searchParams.get('prId') || 'pr-1';
  const [selectedPrId, setSelectedPrId] = useState(requestedPrId);
  const [previewQuote, setPreviewQuote] = useState(null);
  const [confirmSelectQuote, setConfirmSelectQuote] = useState(null);
  const [selectionReason, setSelectionReason] = useState('Lowest evaluated price with comprehensive 18-month warranty and rapid 14-day turnaround.');

  // Current PR
  const currentPr = procurementRequests.find((pr) => pr.id === selectedPrId) || procurementRequests[0];

  // Quotations for this PR
  const prQuotations = quotations.filter((q) => q.procurementRequestId === currentPr?.id);

  // Lowest price calculation
  const lowestPrice = Math.min(...prQuotations.map((q) => q.finalAmount || Infinity));

  const handleSelectPreferredQuote = (quote) => {
    setConfirmSelectQuote(quote);
  };

  const handleConfirmPreferred = () => {
    if (!confirmSelectQuote) return;

    if (isCompanyAdmin) {
      approveStage1(currentPr.id, confirmSelectQuote.id, selectionReason, currentUser);
      addToast({
        title: 'Preferred Quotation Selected',
        message: `${confirmSelectQuote.vendorName} selected and approved under Stage 1 review.`,
        type: 'success',
      });
    } else if (isSuperAdmin) {
      approveStage2(currentPr.id, confirmSelectQuote.id, selectionReason, currentUser);
      addToast({
        title: 'Central Clearance Granted',
        message: `Final approval granted for ${confirmSelectQuote.vendorName}. PO unlocked.`,
        type: 'success',
      });
    }

    setConfirmSelectQuote(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Requisition Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-teal-700" />
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              Side-by-Side Tender Matrix
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Quotation Comparison & Commercial Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Value-based statutory comparison comparing prices, delivery timelines, taxes, and OEM warranties
          </p>
        </div>

        {/* PR Selector Dropdown */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-2xs text-xs">
          <span className="text-slate-500 font-medium">Requisition:</span>
          <select
            value={currentPr?.id}
            onChange={(e) => setSelectedPrId(e.target.value)}
            className="bg-transparent text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
          >
            {procurementRequests.map((pr) => (
              <option key={pr.id} value={pr.id}>
                {pr.requestNumber} — {pr.title.substring(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Requisition Context Card */}
      {currentPr && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900">{currentPr.requestNumber}</span>
              <StatusBadge status={currentPr.currentStatus} size="xs" />
              <span className="text-slate-400">• {currentPr.companyName}</span>
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">{currentPr.title}</h3>
            <p className="text-slate-500 text-[11px]">{currentPr.description}</p>
          </div>

          <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Budget</span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {formatCurrency(currentPr.estimatedBudget)}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Required Qty</span>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {currentPr.requiredQuantity}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix */}
      {prQuotations.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">
            No vendor quotations have been filed for this requisition yet.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/salesperson/create-quotation?prId=${currentPr?.id}`)}
            className="mt-3 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
          >
            Submit First Quotation
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-44 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200">
                    Evaluation Metric
                  </th>
                  {prQuotations.map((q) => {
                    const isLowest = q.finalAmount === lowestPrice;
                    return (
                      <th
                        key={q.id}
                        className={`py-3.5 px-4 min-w-[280px] transition-colors ${
                          isLowest ? 'bg-emerald-50/70 border-b-2 border-emerald-600' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs text-slate-500 font-bold">
                            {q.quotationNumber}
                          </span>
                          {isLowest && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <Award className="w-3 h-3 text-emerald-600" /> Lowest Price
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-slate-900 line-clamp-1">
                          {q.vendorName}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Final Price Row */}
                <tr className="bg-slate-50/50 font-bold">
                  <td className="py-3 px-4 font-semibold text-slate-900 sticky left-0 bg-slate-50 border-r border-slate-200">
                    Evaluated Final Price
                  </td>
                  {prQuotations.map((q) => {
                    const isLowest = q.finalAmount === lowestPrice;
                    const diffFromLowest = q.finalAmount - lowestPrice;
                    const diffPercent = lowestPrice > 0 ? ((diffFromLowest / lowestPrice) * 100).toFixed(1) : 0;

                    return (
                      <td
                        key={q.id}
                        className={`py-3 px-4 ${isLowest ? 'bg-emerald-50/40 text-emerald-900' : ''}`}
                      >
                        <div className="font-mono text-base font-bold tabular-nums text-slate-900">
                          {formatCurrency(q.finalAmount)}
                        </div>
                        <div className="text-[10px] font-normal mt-0.5">
                          {isLowest ? (
                            <span className="text-emerald-700 font-bold">Lowest Compliant Bid</span>
                          ) : (
                            <span className="text-rose-600 font-mono">
                              +{formatCurrency(diffFromLowest)} (+{diffPercent}%)
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Subtotal */}
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-500 sticky left-0 bg-white border-r border-slate-200">
                    Base Subtotal (excl. Tax)
                  </td>
                  {prQuotations.map((q) => (
                    <td key={q.id} className="py-2.5 px-4 font-mono">
                      {formatCurrency(q.subtotal)}
                    </td>
                  ))}
                </tr>

                {/* Taxes & GST */}
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-500 sticky left-0 bg-white border-r border-slate-200">
                    Applicable GST (18%)
                  </td>
                  {prQuotations.map((q) => (
                    <td key={q.id} className="py-2.5 px-4 font-mono text-slate-600">
                      {formatCurrency(q.taxAmount)}
                    </td>
                  ))}
                </tr>

                {/* Shipping & Freight */}
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-500 sticky left-0 bg-white border-r border-slate-200">
                    Freight & In-transit
                  </td>
                  {prQuotations.map((q) => (
                    <td key={q.id} className="py-2.5 px-4 font-mono text-slate-600">
                      {formatCurrency(q.shippingCharges)}
                    </td>
                  ))}
                </tr>

                {/* Delivery Time */}
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-500 sticky left-0 bg-white border-r border-slate-200">
                    Turnaround / Lead Time
                  </td>
                  {prQuotations.map((q) => (
                    <td key={q.id} className="py-2.5 px-4 font-semibold text-slate-800">
                      {q.deliveryTime}
                    </td>
                  ))}
                </tr>

                {/* Payment Terms */}
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-500 sticky left-0 bg-white border-r border-slate-200">
                    Payment Terms
                  </td>
                  {prQuotations.map((q) => (
                    <td key={q.id} className="py-2.5 px-4 text-slate-600 text-[11px]">
                      {q.paymentTerms}
                    </td>
                  ))}
                </tr>

                {/* Warranty */}
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-500 sticky left-0 bg-white border-r border-slate-200">
                    OEM Warranty
                  </td>
                  {prQuotations.map((q) => (
                    <td key={q.id} className="py-2.5 px-4 font-medium text-slate-900">
                      {q.warranty}
                    </td>
                  ))}
                </tr>

                {/* Validity Date */}
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-500 sticky left-0 bg-white border-r border-slate-200">
                    Quote Validity
                  </td>
                  {prQuotations.map((q) => (
                    <td key={q.id} className="py-2.5 px-4 font-mono text-slate-600">
                      {formatDate(q.validityDate)}
                    </td>
                  ))}
                </tr>

                {/* Technical Compliance */}
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-500 sticky left-0 bg-white border-r border-slate-200">
                    Compliance Verification
                  </td>
                  {prQuotations.map((q) => (
                    <td key={q.id} className="py-2.5 px-4">
                      <div className="flex items-start gap-1.5 text-[11px]">
                        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{q.complianceStatus}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Actions & PDF Preview */}
                <tr className="bg-slate-50/80">
                  <td className="py-3 px-4 font-semibold text-slate-700 sticky left-0 bg-slate-50 border-r border-slate-200">
                    Review Actions
                  </td>
                  {prQuotations.map((q) => (
                    <td key={q.id} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewQuote(q)}
                          className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>PDF Manifest</span>
                        </button>

                        {(isCompanyAdmin || isSuperAdmin) && (
                          <button
                            type="button"
                            onClick={() => handleSelectPreferredQuote(q)}
                            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Select & Approve</span>
                          </button>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Value-Based Procurement Note */}
      <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-teal-950 uppercase tracking-wider text-[11px]">
            Statutory Value-Based Selection Notice (Rule 149 GFR)
          </h4>
          <p className="leading-relaxed">
            While lowest price is automatically tagged above, institutional procurement guidelines permit reviewers to select an alternative bidder if justifiable by longer OEM warranties, superior compliance, or expedited delivery parameters. All selection justifications are permanently recorded in the audit trail.
          </p>
        </div>
      </div>

      {/* PDF Modal */}
      <PdfPreviewModal
        isOpen={!!previewQuote}
        onClose={() => setPreviewQuote(null)}
        documentData={previewQuote}
        type="quotation"
      />

      {/* Selection Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!confirmSelectQuote}
        onClose={() => setConfirmSelectQuote(null)}
        onConfirm={handleConfirmPreferred}
        title={`Select ${confirmSelectQuote?.vendorName} as Preferred Vendor`}
        message={`Are you sure you want to select Quotation ${confirmSelectQuote?.quotationNumber} for contract value ${formatCurrency(confirmSelectQuote?.finalAmount)}? This will advance the proposal through the approval workflow.`}
        confirmText="Confirm & Approve Bid"
        type="success"
        reasonInput={true}
        reasonValue={selectionReason}
        onReasonChange={setSelectionReason}
        reasonPlaceholder="Mandatory justification for vendor selection..."
      />
    </div>
  );
};
