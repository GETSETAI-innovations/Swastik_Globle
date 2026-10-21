import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from 'lucide-react';

export const BulkImportModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDownloadSample = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'SKU,Product_Title,Category,Price_INR,Unit,Tax_Percent,Ready_Stock,Supplier,MoQ\n' +
      'SG-GYM-104,Commercial Heavy Duty Treadmill 5HP,Gym Equipment,145000,Unit,18,18,Aerofit Defense Commercial,1\n' +
      'SG-PL-902,1100L Wheelie Waste Dustbin HDPE,Commercial Dustbins,8450,Piece,18,240,Vectus Industrial Polymers,10\n' +
      'SG-GYM-800,Multi-Gym 8-Station Heavy Commercial,Gym Equipment,385000,Set,18,6,Aerofit Defense Commercial,1\n' +
      'SG-PL-301,Industrial Plastic Pallet 4-Way,Heavy Plastic Products,2150,Piece,18,520,Vectus Industrial Polymers,50';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'swastik_procurement_items_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedFile(null);
        if (onImportSuccess) onImportSuccess();
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Bulk CSV Procurement Import</h3>
              <p className="text-[11px] text-slate-500">Upload bulk product catalog items or tenders</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Download sample */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-semibold text-slate-800 block">Download Template</span>
              <span className="text-[11px] text-slate-500">Use pre-formatted government schema columns</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-semibold text-slate-700 text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              dragActive ? 'border-teal-600 bg-teal-50/30' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
            }`}
            onClick={() => document.getElementById('csvFileInput')?.click()}
          >
            <input
              id="csvFileInput"
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-800 text-xs">
              {selectedFile ? selectedFile.name : 'Click to browse or drop CSV file here'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports CSV, XLS, XLSX up to 15MB
            </p>
          </div>

          {isSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-xs">Successfully validated and parsed 8 items into active catalog!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-3.5 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedFile || isProcessing}
            onClick={handleUpload}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              selectedFile && !isProcessing
                ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'Validating CSV...' : 'Import Records'}
          </button>
        </div>
      </div>
    </div>
  );
};
