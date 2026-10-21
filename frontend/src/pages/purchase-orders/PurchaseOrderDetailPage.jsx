import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PdfPreviewModal } from '../../components/common/PdfPreviewModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ArrowLeft,
  Receipt,
  Download,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';

export const PurchaseOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isSuperAdmin, isCompanyAdmin } = useAuth();
  const { purchaseOrders, updatePoDeliveryStatus } = useData();
  const { addToast } = useToast();

  const [previewOpen, setPreviewOpen] = useState(false);

  const po = purchaseOrders.find((p) => p.id === id);

  if (!po) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
        <h3 className="text-base font-bold text-slate-800">Purchase Order Not Found</h3>
        <button
          type="button"
          onClick={() => navigate('/purchase-orders')}
          className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold"
        >
          Back to Purchase Orders
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updatePoDeliveryStatus(po.id, newStatus, currentUser);
    addToast({
      title: 'Delivery Status Updated',
      message: `Purchase Order marked as "${newStatus}".`,
      type: 'success',
    });
  };

  const deliverySteps = [
    { key: 'Pending Dispatch', label: 'Order Confirmed & Pending Dispatch' },
    { key: 'In Transit', label: 'Dispatched & In Transit' },
    { key: 'Delivered', label: 'Delivered to Consignee Yard' },
    { key: 'Completed', label: 'Quality Verified & Invoice Completed' },
  ];

  const currentStepIdx = deliverySteps.findIndex((s) => s.key === po.deliveryStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/purchase-orders')}
            className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                {po.poNumber}
              </span>
              <StatusBadge status={po.deliveryStatus} size="xs" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Official Purchase Order Dossier
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Delivery Tracking Stepper */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-4">
          Statutory Shipment & Delivery Progress
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
          {deliverySteps.map((step, idx) => {
            const isCompleted = idx <= (currentStepIdx === -1 ? 0 : currentStepIdx);
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step.key}
                onClick={() => (isSuperAdmin || isCompanyAdmin) && handleStatusChange(step.key)}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  (isSuperAdmin || isCompanyAdmin) ? 'cursor-pointer hover:border-teal-500' : ''
                } ${
                  isCurrent
                    ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-500/20'
                    : isCompleted
                    ? 'bg-slate-50 border-emerald-300 text-slate-800'
                    : 'bg-slate-50/40 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="font-semibold text-slate-900 leading-snug">{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Order Visual Dossier */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-teal-800 uppercase block">
              Government Supplier Manifest
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5 uppercase tracking-tight">
              {po.companyName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ref Tender: {po.requestNumber} • Approved Quote: {po.quotationNumber}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase rounded bg-teal-50 text-teal-800 border border-teal-200">
              Official Purchase Order
            </span>
            <div className="mt-1 font-mono font-bold text-slate-900 text-sm">{po.poNumber}</div>
            <div className="text-[11px] text-slate-500">Issued: {formatDate(po.createdDate)}</div>
          </div>
        </div>

        {/* Parties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Issued To (Contractor)
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">{po.vendorName}</h4>
            <p className="text-slate-600 mt-1">GeM Verified Supplier • ISO 9001:2015</p>
            <div className="mt-3 text-slate-500">
              <span className="font-semibold text-slate-700">Billing Address:</span> {po.billingAddress}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Consignee & Delivery Instructions
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              Due Date: {formatDate(po.expectedDeliveryDate)}
            </h4>
            <div className="mt-2 text-slate-500">
              <span className="font-semibold text-slate-700">Consignee Address:</span> {po.shippingAddress}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Quantity</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Tax (GST)</th>
                <th className="py-2.5 px-3 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {(po.lineItems || []).map((item, i) => (
                <tr key={i}>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{i + 1}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{item.name}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{item.quantity} {item.unit}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{formatCurrency(item.price)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500">{item.tax}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Sum */}
        <div className="flex justify-end">
          <div className="w-72 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Contract Subtotal:</span>
              <span className="font-mono text-slate-800">{formatCurrency(po.finalAmount * 0.82)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Applicable GST:</span>
              <span className="font-mono text-slate-800">{formatCurrency(po.finalAmount * 0.18)}</span>
            </div>
            <div className="border-t border-slate-300 pt-1.5 flex justify-between font-bold text-sm text-slate-900">
              <span>Authorized Amount:</span>
              <span className="font-mono text-teal-800 tabular-nums">
                {formatCurrency(po.finalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Signatures & Approval Stamps */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Certificate Registered on GeM Procurement Network</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center text-xs">
              <div className="w-28 h-10 border-b border-dashed border-slate-400 flex items-center justify-center font-serif text-slate-400 italic">
                {po.approvedByCompanyAdmin}
              </div>
              <span className="text-[10px] font-semibold text-slate-600 block mt-1">Company Admin</span>
            </div>

            <div className="text-center text-xs">
              <div className="w-28 h-10 border-b border-dashed border-slate-400 flex items-center justify-center font-serif text-teal-700 font-bold">
                {po.approvedBySuperAdmin}
              </div>
              <span className="text-[10px] font-semibold text-slate-600 block mt-1">Super Admin HQ</span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      <PdfPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        documentData={po}
        type="po"
      />
    </div>
  );
};
