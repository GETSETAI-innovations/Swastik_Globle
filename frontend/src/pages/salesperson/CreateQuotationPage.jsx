import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { PdfPreviewModal } from '../../components/common/PdfPreviewModal';
import {
  Plus,
  Trash2,
  FileUp,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Save,
  ArrowRight,
  Store,
  FileText,
} from 'lucide-react';

export const CreateQuotationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { procurementRequests, vendors, addQuotation } = useData();
  const { addToast } = useToast();

  const preselectedPrId = searchParams.get('prId') || '';

  // 1. Requisition Selection
  const [selectedPrId, setSelectedPrId] = useState(preselectedPrId);

  // 2. Vendor Selection
  const [vendorId, setVendorId] = useState('ven-1');

  // 3. Quotation Meta
  const [quotationNumber, setQuotationNumber] = useState(
    `QT-2026-SG-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [quotationDate, setQuotationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [validityDate, setValidityDate] = useState('2026-11-30');
  const [deliveryTime, setDeliveryTime] = useState('14 Days at Site');
  const [paymentTerms, setPaymentTerms] = useState('100% against Delivery & Inspection Sign-off');
  const [warranty, setWarranty] = useState('18 Months Standard OEM');
  const [remarks, setRemarks] = useState('');

  // 4. Line Items
  const [lineItems, setLineItems] = useState([
    {
      description: 'Industrial Centrifugal Submersible Pumping Unit 50HP',
      hsn: '841370',
      quantity: 6,
      unitPrice: 220000,
      taxRate: 18,
      total: 1557600,
    },
  ]);
  const [shippingCharges, setShippingCharges] = useState(25000);

  // 6. PDF Upload
  const [uploadedPdf, setUploadedPdf] = useState({
    name: 'Kirloskar_Official_Bid_Document.pdf',
    size: '2.1 MB',
  });

  // 7. Preview Modal
  const [previewOpen, setPreviewOpen] = useState(false);

  // Company-scoped PRs
  const availablePRs = procurementRequests.filter(
    (pr) => !currentUser?.companyId || pr.companyId === currentUser.companyId
  );

  useEffect(() => {
    if (!selectedPrId && availablePRs.length > 0) {
      setSelectedPrId(availablePRs[0].id);
    }
  }, [availablePRs, selectedPrId]);

  const selectedPr = procurementRequests.find((p) => p.id === selectedPrId);
  const selectedVendor = vendors.find((v) => v.id === vendorId);

  // Calculation logic
  const handleItemChange = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;

    // Recalculate item total
    const qty = Number(updated[index].quantity) || 0;
    const price = Number(updated[index].unitPrice) || 0;
    const tax = Number(updated[index].taxRate) || 0;
    const itemSubtotal = qty * price;
    const itemTax = (itemSubtotal * tax) / 100;
    updated[index].total = itemSubtotal + itemTax;

    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        description: 'Auxiliary Coupling & Piping Kit',
        hsn: '841391',
        quantity: 1,
        unitPrice: 15000,
        taxRate: 18,
        total: 17700,
      },
    ]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length === 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Subtotals and totals
  const subtotal = lineItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const taxAmount = lineItems.reduce(
    (sum, item) =>
      sum +
      ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0) * (Number(item.taxRate) || 0)) /
        100,
    0
  );
  const finalAmount = subtotal + taxAmount + (Number(shippingCharges) || 0);

  // PDF Upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        addToast({
          title: 'Invalid File Format',
          message: 'Only signed PDF documents are permitted for quotation submission.',
          type: 'error',
        });
        return;
      }
      setUploadedPdf({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
      addToast({
        title: 'PDF Uploaded',
        message: `Verified and attached ${file.name}.`,
        type: 'info',
      });
    }
  };

  // Submit quotation
  const handleSaveOrSubmit = (statusType = 'Pending Company Admin Approval') => {
    if (!selectedPr) {
      addToast({
        title: 'Validation Error',
        message: 'Please link this quotation to an active procurement request.',
        type: 'error',
      });
      return;
    }

    const newQuote = addQuotation(
      {
        quotationNumber,
        procurementRequestId: selectedPr.id,
        requestNumber: selectedPr.requestNumber,
        companyId: selectedPr.companyId,
        companyName: selectedPr.companyName,
        vendorId: selectedVendor?.id,
        vendorName: selectedVendor?.name,
        quotationDate,
        validityDate,
        deliveryTime,
        paymentTerms,
        warranty,
        lineItems,
        subtotal,
        taxAmount,
        shippingCharges: Number(shippingCharges) || 0,
        finalAmount,
        pdfFileName: uploadedPdf?.name,
        pdfFileSize: uploadedPdf?.size,
        remarks: remarks || 'Submitted by Salesperson for Company Admin technical evaluation.',
      },
      currentUser
    );

    addToast({
      title: 'Quotation Submitted Successfully',
      message: `${newQuote.quotationNumber} is now queued for Company Admin Stage-1 review.`,
      type: 'success',
    });

    navigate('/salesperson/my-quotations');
  };

  // Prepare doc object for PDF Preview
  const previewDocData = {
    quotationNumber,
    companyName: selectedPr?.companyName || currentUser?.companyName,
    vendorName: selectedVendor?.name || 'Selected Bidding Vendor',
    requestNumber: selectedPr?.requestNumber || 'PR-2026-0000',
    requestTitle: selectedPr?.title || 'Tender Requisition',
    quotationDate,
    validityDate,
    deliveryTime,
    paymentTerms,
    warranty,
    lineItems,
    subtotal,
    taxAmount,
    shippingCharges: Number(shippingCharges) || 0,
    finalAmount,
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Create Vendor Quotation (9-Step Workflow)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step statutory quotation preparation with line item tax calculation and PDF manifest attachment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview Bid Manifest</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveOrSubmit('Draft')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveOrSubmit('Pending Company Admin Approval')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Submit for Review</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Workflow Form: Steps 1-6 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1 & 2: Select PR & Vendor */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 1 & 2: Procurement Requisition & Vendor Selection
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target Requisition *
                </label>
                <select
                  value={selectedPrId}
                  onChange={(e) => setSelectedPrId(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                >
                  {availablePRs.map((pr) => (
                    <option key={pr.id} value={pr.id}>
                      {pr.requestNumber} — {pr.title.substring(0, 30)}...
                    </option>
                  ))}
                </select>
                {selectedPr && (
                  <span className="block text-[10px] text-slate-400 mt-1">
                    Est. Budget: {formatCurrency(selectedPr.estimatedBudget)} • Qty: {selectedPr.requiredQuantity}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Bidding Vendor *
                </label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.gemRegNo})
                    </option>
                  ))}
                </select>
                {selectedVendor && (
                  <span className="block text-[10px] text-slate-400 mt-1">
                    GSTIN: {selectedVendor.gstin} • Rating: {selectedVendor.rating}★
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Quotation Reference & Commercial Terms */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 3: Commercial Proposal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Quotation Number *
                </label>
                <input
                  type="text"
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Quotation Date
                </label>
                <input
                  type="date"
                  value={quotationDate}
                  onChange={(e) => setQuotationDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Validity Deadline
                </label>
                <input
                  type="date"
                  value={validityDate}
                  onChange={(e) => setValidityDate(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Lead Time
                </label>
                <input
                  type="text"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  placeholder="e.g. 14 Days at Site"
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g. Net 30 Days"
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  OEM Warranty Period
                </label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="e.g. 18 Months Standard"
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Step 4 & 5: Line Items & Live Calculation */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                Step 4 & 5: Line Items & Automated Fiscal Computation
              </h3>
              <button
                type="button"
                onClick={addLineItem}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50/70 border border-slate-200 grid grid-cols-12 gap-2 text-xs items-center"
                >
                  <div className="col-span-12 sm:col-span-5">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Item Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full h-8 rounded border border-slate-300 px-2 text-slate-800 text-xs"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full h-8 rounded border border-slate-300 px-2 text-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Unit Price (₹)
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      className="w-full h-8 rounded border border-slate-300 px-2 text-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2 text-right">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Line Total
                    </label>
                    <span className="font-mono font-bold text-slate-900 block pt-1.5 tabular-nums">
                      {formatCurrency(item.total)}
                    </span>
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeLineItem(idx)}
                      disabled={lineItems.length === 1}
                      className="text-slate-400 hover:text-rose-600 p-1 disabled:opacity-20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Freight & Insurance (₹):</span>
                  <input
                    type="number"
                    value={shippingCharges}
                    onChange={(e) => setShippingCharges(e.target.value)}
                    className="w-28 h-7 text-right font-mono rounded border border-slate-300 px-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 6: Mandatory Quotation PDF Upload */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 6: Official Vendor Signed PDF Manifest (Mandatory)
            </h3>

            <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <FileUp className="w-8 h-8 text-emerald-600 mb-2" />
              <div className="text-xs font-semibold text-slate-800">
                Upload Signed Vendor Quotation Dossier
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PDF format only with valid GSTIN and statutory declarations (Max 15 MB)
              </p>
              <label className="mt-3 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                <span>Select PDF File</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedPdf && (
                <div className="mt-4 p-2.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-xs text-slate-800">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium font-mono">{uploadedPdf.name}</span>
                  <span className="text-slate-400">({uploadedPdf.size})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Computation Summary Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-4 sticky top-24">
            <h4 className="font-semibold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Statutory Fiscal Summary
            </h4>

            <div className="space-y-2.5 text-slate-600">
              <div className="flex justify-between">
                <span>Base Subtotal:</span>
                <span className="font-mono text-slate-900 tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Applicable GST (18%):</span>
                <span className="font-mono text-slate-900 tabular-nums">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Freight & Handling:</span>
                <span className="font-mono text-slate-900 tabular-nums">
                  {formatCurrency(Number(shippingCharges) || 0)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-base text-slate-900">
                <span>Final Evaluated:</span>
                <span className="font-mono text-emerald-800 tabular-nums">
                  {formatCurrency(finalAmount)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Approval Flow After Submission
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Quotation will be forwarded immediately to <strong>Company Admin</strong> for Stage-1 technical review. Upon approval, it advances to <strong>Super Admin HQ</strong>.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSaveOrSubmit('Pending Company Admin Approval')}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Quotation for Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      <PdfPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        documentData={previewDocData}
        type="quotation"
      />
    </div>
  );
};
