import React from 'react';
import { X, ShieldCheck, CheckCircle2, Download, ShoppingCart, Building, Award, Calendar, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ProductSpecsModal = ({ isOpen, onClose, product, onAddToQuote }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-300 uppercase tracking-wider">
                  {product.sku}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-300">{product.gemContractNo}</span>
              </div>
              <h3 className="text-base font-bold text-white truncate max-w-md">
                {product.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Top Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="sm:col-span-1 flex items-center justify-center bg-white p-2 rounded-lg border border-slate-200 h-32">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white">
                  {product.category}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  product.badgeColor === 'green'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  • {product.stockStatusText}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                {product.description}
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rate Contract Ceiling</span>
                  <span className="font-mono text-base font-bold text-slate-900">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-slate-500 font-medium text-xs"> / {product.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Commercial Tag</span>
                  <span className="text-xs font-semibold text-slate-800 bg-slate-200/70 px-2 py-0.5 rounded inline-block">
                    {product.commercialTag}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional GeM Rate Terms */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-teal-50/50 border border-teal-200/60 text-center">
            <div>
              <span className="text-[10px] text-teal-800 font-semibold uppercase block">Verified OEM</span>
              <span className="font-semibold text-slate-900 text-[11px] truncate block">{product.supplier}</span>
            </div>
            <div>
              <span className="text-[10px] text-teal-800 font-semibold uppercase block">Min. Order Qty</span>
              <span className="font-semibold text-slate-900 text-[11px] block">{product.moq} {product.unit}</span>
            </div>
            <div>
              <span className="text-[10px] text-teal-800 font-semibold uppercase block">Lead Time</span>
              <span className="font-semibold text-slate-900 text-[11px] block">{product.leadTime}</span>
            </div>
            <div>
              <span className="text-[10px] text-teal-800 font-semibold uppercase block">Warranty</span>
              <span className="font-semibold text-slate-900 text-[11px] truncate block">{product.warranty}</span>
            </div>
          </div>

          {/* Detailed Technical Specifications Table */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Official GeM Technical Compliance Parameters</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
              {product.specifications.map((spec, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 hover:bg-slate-50 text-xs">
                  <span className="font-medium text-slate-500 sm:w-1/3">{spec.label}</span>
                  <span className="font-semibold text-slate-800 sm:w-2/3">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                alert(`Downloaded official technical spec sheet for ${product.sku} (${product.title})`);
              }}
              className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Spec Sheet PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onAddToQuote(product);
                onClose();
              }}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Quotation Draft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
