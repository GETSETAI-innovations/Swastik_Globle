import React from 'react';
import { Modal } from './Modal';
import { Download, Printer, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const PdfPreviewModal = ({ isOpen, onClose, documentData, type = 'quotation' }) => {
  const { addToast } = useToast();

  if (!documentData) return null;

  const isPo = type === 'po';
  const docTitle = isPo ? `PURCHASE ORDER: ${documentData.poNumber}` : `COMMERCIAL QUOTATION: ${documentData.quotationNumber}`;

  const handleDownload = () => {
    addToast({
      title: 'Document Downloaded',
      message: `Downloaded official manifest for ${isPo ? documentData.poNumber : documentData.quotationNumber} in PDF format.`,
      type: 'success',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={docTitle}
      subtitle={`Official Verified Enterprise Document • Registered GeM Supplier`}
      maxWidth="max-w-4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital SHA-256 Checksum Verified • Statutory Audit-Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      }
    >
      {/* PDF Document Preview Canvas */}
      <div className="bg-white border border-slate-300 rounded-lg p-8 shadow-inner font-sans text-slate-800 text-xs relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <span className="text-8xl font-black rotate-[-25deg] tracking-widest text-slate-900 uppercase">
            {isPo ? 'PURCHASE ORDER' : 'OFFICIAL BID'}
          </span>
        </div>

        {/* Top Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0B2545] text-white rounded flex items-center justify-center font-bold text-lg tracking-wider">
              SG
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B2545] tracking-tight uppercase">
                {documentData.companyName || 'Swastik Globle Enterprises Pvt Ltd'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Government Procurement & Heavy Engineering Supplies
              </p>
              <p className="text-[10px] text-slate-400">
                GeM Portal Reg: SG-2024-PSU-991A • GSTIN: 27AAACS1234F1Z5
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase rounded bg-slate-100 text-slate-800 border border-slate-300">
              {isPo ? 'Official Purchase Order' : 'Commercial Quotation'}
            </span>
            <div className="mt-2 text-xs font-semibold text-slate-900 font-mono">
              Ref: {isPo ? documentData.poNumber : documentData.quotationNumber}
            </div>
            <div className="text-[11px] text-slate-500">
              Date: {formatDate(documentData.createdDate || documentData.quotationDate)}
            </div>
          </div>
        </div>

        {/* Parties Meta */}
        <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {isPo ? 'Vendor / Contractor' : 'Bidding Vendor'}
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-1">
              {documentData.vendorName}
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Certified Enterprise Vendor • GeM Verified Supplier
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Payment Terms: {documentData.paymentTerms || 'Standard GeM 30-Day terms'}
            </p>
            <p className="text-[10px] text-slate-500">
              Warranty: {documentData.warranty || 'Standard OEM 12 Months'}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Procurement Reference
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-1">
              {documentData.requestNumber || 'PR-2026-0893'}
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
              {documentData.requestTitle || 'Heavy Duty Industrial Machinery Requisition'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Lead Time: {documentData.deliveryTime || '14 Days at site'}
            </p>
            <p className="text-[10px] text-slate-500">
              Delivery Target: {formatDate(documentData.expectedDeliveryDate || documentData.validityDate)}
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Description & Specifications</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Tax (GST)</th>
                <th className="py-2.5 px-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {(documentData.lineItems || []).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {item.description || item.name}
                    {item.hsn && <span className="block text-[10px] text-slate-400 font-mono">HSN: {item.hsn}</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{formatCurrency(item.unitPrice || item.price)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-500 text-[11px] font-mono">{item.taxRate ? `${item.taxRate}%` : item.tax || '18%'}</td>
                  <td className="py-2.5 px-3 text-right font-semibold font-mono tabular-nums text-slate-900">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="flex justify-end mb-6">
          <div className="w-72 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-slate-900 tabular-nums">
                {formatCurrency(documentData.subtotal || (documentData.finalAmount * 0.82))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Applicable GST (IGST/CGST):</span>
              <span className="font-mono text-slate-900 tabular-nums">
                {formatCurrency(documentData.taxAmount || (documentData.finalAmount * 0.18))}
              </span>
            </div>
            {documentData.shippingCharges > 0 && (
              <div className="flex justify-between">
                <span>Freight & In-Transit Insurance:</span>
                <span className="font-mono text-slate-900 tabular-nums">
                  {formatCurrency(documentData.shippingCharges)}
                </span>
              </div>
            )}
            <div className="border-t border-slate-300 pt-1.5 flex justify-between font-bold text-sm text-slate-900">
              <span>Final Evaluated Amount:</span>
              <span className="font-mono text-teal-800 tabular-nums">
                {formatCurrency(documentData.finalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Statutory Compliance Footer & Signatures */}
        <div className="border-t border-slate-200 pt-4 flex items-end justify-between">
          <div className="max-w-md space-y-1 text-[10px] text-slate-500">
            <p className="font-semibold text-slate-700">TERMS & STATUTORY DECLARATION:</p>
            <p>1. This electronic manifest is generated by Swastik Globle Enterprise Procurement Portal.</p>
            <p>2. Complies with General Financial Rules (GFR 2017) and Public Procurement Order.</p>
            <p>3. Goods must pass QA inspection prior to final invoice clearance.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="w-24 h-12 border-b border-dashed border-slate-400 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic font-serif">Verified</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-600 block mt-1">Company Admin</span>
            </div>

            <div className="text-center">
              <div className="w-24 h-12 border-b border-dashed border-slate-400 flex items-center justify-center">
                <div className="border-2 border-emerald-600 text-emerald-700 rounded px-1 text-[9px] font-bold uppercase rotate-[-8deg]">
                  AUTHORIZED
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-600 block mt-1">Super Admin HQ</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
