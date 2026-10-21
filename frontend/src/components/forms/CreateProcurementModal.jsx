import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { FileUp, Paperclip, X } from 'lucide-react';

export const CreateProcurementModal = ({ isOpen, onClose }) => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { companies, addProcurementRequest } = useData();
  const { addToast } = useToast();

  const [companyId, setCompanyId] = useState(currentUser?.companyId || 'comp-1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Industrial Machinery & Pumps');
  const [requiredQuantity, setRequiredQuantity] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState('');
  const [priority, setPriority] = useState('High');
  const [attachedFiles, setAttachedFiles] = useState([
    { name: 'Technical_BOQ_Specifications.pdf', size: '1.4 MB' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !requiredQuantity || !estimatedBudget || !requiredDeliveryDate) {
      addToast({
        title: 'Validation Error',
        message: 'Please fill in all mandatory procurement fields.',
        type: 'error',
      });
      return;
    }

    const selectedComp = companies.find((c) => c.id === companyId);

    const newPr = addProcurementRequest(
      {
        companyId,
        companyName: selectedComp?.name || currentUser?.companyName,
        title,
        description,
        category,
        requiredQuantity,
        estimatedBudget,
        requiredDeliveryDate,
        priority,
        attachments: attachedFiles,
      },
      currentUser
    );

    addToast({
      title: 'Procurement Request Created',
      message: `${newPr.requestNumber} successfully logged into the system.`,
      type: 'success',
    });

    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setRequiredQuantity('');
    setEstimatedBudget('');
    setRequiredDeliveryDate('');
  };

  const handleSimulatedFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        addToast({
          title: 'Invalid File Type',
          message: 'Only official PDF documents are accepted for statutory compliance.',
          type: 'error',
        });
        return;
      }
      setAttachedFiles((prev) => [
        ...prev,
        { name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` },
      ]);
      addToast({
        title: 'File Attached',
        message: `Attached ${file.name} to requisition dossier.`,
        type: 'info',
      });
    }
  };

  const removeFile = (idx) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Procurement Requisition"
      subtitle="Statutory Requisition Dossier conforming to GFR 2017"
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
          >
            Submit Requisition
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Company Selection (if Super Admin) */}
        {isSuperAdmin && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Company *
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Procurement Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. High-Pressure Gate Valves Class 300"
            required
            className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Procurement Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            >
              <option value="Industrial Machinery & Pumps">Industrial Machinery & Pumps</option>
              <option value="Valves & Actuators">Valves & Actuators</option>
              <option value="IT Hardware & Enterprise Servers">IT Hardware & Enterprise Servers</option>
              <option value="Networking & Telecommunications">Networking & Telecommunications</option>
              <option value="Safety & Industrial Gear">Safety & Industrial Gear</option>
              <option value="Electrical Switchgear & Transformers">Electrical Switchgear & Transformers</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            >
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Priority</option>
              <option value="Urgent">Urgent (Express Review)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Required Quantity *
            </label>
            <input
              type="text"
              value={requiredQuantity}
              onChange={(e) => setRequiredQuantity(e.target.value)}
              placeholder="e.g. 12 Units"
              required
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Estimated Budget (₹) *
            </label>
            <input
              type="number"
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(e.target.value)}
              placeholder="e.g. 1500000"
              required
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Target Delivery Date *
            </label>
            <input
              type="date"
              value={requiredDeliveryDate}
              onChange={(e) => setRequiredDeliveryDate(e.target.value)}
              required
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Requisition Description & Technical Scope
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Detailed scope of supply, standard compliance standards (IS/ISO/IEC), testing parameters..."
            className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
          />
        </div>

        {/* File Attachments */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Mandatory Technical Dossier & BOQ (PDF)
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer text-slate-700 font-medium transition-colors">
              <FileUp className="w-4 h-4 text-teal-700" />
              <span>Attach PDF</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleSimulatedFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-[11px] text-slate-400">PDF up to 15 MB</span>
          </div>

          {attachedFiles.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {attachedFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-700 truncate">
                    <Paperclip className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span className="truncate">{f.name}</span>
                    <span className="text-[10px] text-slate-400">({f.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};
