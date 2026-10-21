import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { ShieldCheck, Truck, MapPin } from 'lucide-react';

export const CreatePoModal = ({ isOpen, onClose, procurementRequest, quotation }) => {
  const { currentUser } = useAuth();
  const { createPurchaseOrder } = useData();
  const { addToast } = useToast();

  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('2026-11-30');
  const [billingAddress, setBillingAddress] = useState('Central Procurement HQ, MIDC Andheri East, Mumbai, MH - 400093');
  const [shippingAddress, setShippingAddress] = useState('Swastik Fabrication Yard, Sector 4, Navi Mumbai, MH');
  const [loading, setLoading] = useState(false);

  if (!procurementRequest || !quotation) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newPo = createPurchaseOrder({
        requestId: procurementRequest.id,
        quotationId: quotation.id,
        poData: {
          expectedDeliveryDate,
          billingAddress,
          shippingAddress,
        },
        currentUser,
      });

      addToast({
        title: 'Purchase Order Issued',
        message: `${newPo.poNumber} generated successfully for ${quotation.vendorName}.`,
        type: 'success',
      });
      onClose();
    } catch (err) {
      addToast({
        title: 'Order Generation Failed',
        message: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Statutory Purchase Order"
      subtitle={`Authorized issuance following Stage 1 & Stage 2 central sign-off`}
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Issuing PO...' : 'Confirm & Generate Official PO'}</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Approved Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span>Requisition Reference:</span>
            <span className="font-semibold text-slate-800 font-mono">
              {procurementRequest.requestNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Selected Bidding Vendor:</span>
            <span className="font-semibold text-slate-900">
              {quotation.vendorName}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Quotation Number:</span>
            <span className="font-mono text-slate-700">{quotation.quotationNumber}</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between items-center font-bold text-sm text-slate-900">
            <span>Approved Total Contract Value:</span>
            <span className="font-mono text-teal-800 tabular-nums">
              {formatCurrency(quotation.finalAmount)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Contractual Delivery Due Date *
          </label>
          <div className="relative">
            <input
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              required
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Statutory Billing Entity & Address
          </label>
          <textarea
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            rows={2}
            required
            className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Consignee Delivery / Shipping Address
          </label>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            rows={2}
            required
            className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
          />
        </div>

        <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 text-[11px] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-teal-600 mt-0.5" />
          <span>
            This Purchase Order will be sealed with a tamper-evident digital manifest and transmitted directly to the vendor's certified procurement email.
          </span>
        </div>
      </form>
    </Modal>
  );
};
