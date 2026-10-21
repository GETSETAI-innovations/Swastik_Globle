import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const UploadQuotationPdfPage = () => {
  const { currentUser } = useAuth();
  const { procurementRequests, vendors, addQuotation } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [selectedPrId, setSelectedPrId] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [quotationNumber, setQuotationNumber] = useState(
    `QT-2026-UP-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [finalAmount, setFinalAmount] = useState('1650000');
  const [deliveryTime, setDeliveryTime] = useState('15 Days');
  const [warranty, setWarranty] = useState('12 Months OEM');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const availablePRs = procurementRequests.filter(
    (pr) => !currentUser?.companyId || pr.companyId === currentUser.companyId
  );

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== 'application/pdf') {
        addToast({
          title: 'Invalid Format',
          message: 'Only verified PDF documents are supported.',
          type: 'error',
        });
        return;
      }
      if (selected.size > 15 * 1024 * 1024) {
        addToast({
          title: 'File Too Large',
          message: 'Maximum allowed file size is 15 MB.',
          type: 'error',
        });
        return;
      }
      setFile(selected);
      addToast({
        title: 'PDF Verified',
        message: `${selected.name} (${(selected.size / (1024 * 1024)).toFixed(1)} MB) loaded.`,
        type: 'info',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPrId || !selectedVendorId || !finalAmount) {
      addToast({
        title: 'Validation Error',
        message: 'Please link a requisition, vendor, and contract amount.',
        type: 'error',
      });
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const pr = procurementRequests.find((p) => p.id === selectedPrId);
      const vendor = vendors.find((v) => v.id === selectedVendorId);

      const numVal = Number(finalAmount) || 0;
      const subtotal = numVal * 0.82;
      const tax = numVal * 0.18;

      addQuotation(
        {
          quotationNumber,
          procurementRequestId: pr.id,
          requestNumber: pr.requestNumber,
          companyId: pr.companyId,
          companyName: pr.companyName,
          vendorId: vendor.id,
          vendorName: vendor.name,
          finalAmount: numVal,
          subtotal,
          taxAmount: tax,
          deliveryTime,
          warranty,
          pdfFileName: file ? file.name : 'Vendor_Uploaded_Bid.pdf',
          pdfFileSize: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB',
          remarks: 'Direct vendor bid document uploaded via salesperson portal.',
        },
        currentUser
      );

      addToast({
        title: 'Quotation Uploaded & Submitted',
        message: `${quotationNumber} is now queued for Company Admin Stage-1 review.`,
        type: 'success',
      });

      setIsUploading(false);
      navigate('/salesperson/my-quotations');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Upload Signed Vendor Quotation PDF
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Attach verified PDF bidding packages directly into the procurement dossier
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* File Drag & Drop Box */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <Upload className="w-10 h-10 text-emerald-600 mb-2" />
            <h3 className="font-semibold text-slate-900 text-sm">
              Drag and drop signed vendor PDF here
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Supports official tender PDF manifests up to 15 MB
            </p>

            <label className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
              <span>Choose PDF File</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-xs font-mono text-slate-800">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{file.name}</span>
                <span className="text-slate-400">({(file.size / (1024 * 1024)).toFixed(1)} MB)</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Requisition *
              </label>
              <select
                value={selectedPrId}
                onChange={(e) => setSelectedPrId(e.target.value)}
                required
                className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs"
              >
                <option value="">Select Requisition...</option>
                {availablePRs.map((pr) => (
                  <option key={pr.id} value={pr.id}>
                    {pr.requestNumber} — {pr.title.substring(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Bidding Vendor *
              </label>
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                required
                className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs"
              >
                <option value="">Select Vendor...</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Quotation Number *
              </label>
              <input
                type="text"
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
                required
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Final Amount (₹) *
              </label>
              <input
                type="number"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                required
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Lead Time
              </label>
              <input
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/salesperson')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isUploading ? 'Uploading & Indexing...' : 'Upload & Submit for Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
