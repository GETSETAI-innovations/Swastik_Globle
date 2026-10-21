import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning' | 'danger' | 'info' | 'success'
  loading = false,
  reasonInput = false,
  reasonValue = '',
  onReasonChange = () => {},
  reasonPlaceholder = 'Please enter remarks or reason...',
  reasonRequired = false,
}) => {
  const isDanger = type === 'danger';
  const isSuccess = type === 'success';

  let Icon = AlertTriangle;
  let iconBg = 'bg-amber-100 text-amber-600';
  let confirmBtnClass = 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500';

  if (isDanger) {
    iconBg = 'bg-rose-100 text-rose-600';
    confirmBtnClass = 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500';
  } else if (isSuccess) {
    Icon = CheckCircle;
    iconBg = 'bg-emerald-100 text-emerald-600';
    confirmBtnClass = 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500';
  } else if (type === 'info') {
    Icon = Info;
    iconBg = 'bg-blue-100 text-blue-600';
    confirmBtnClass = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
  }

  const handleConfirm = () => {
    if (reasonRequired && !reasonValue.trim()) return;
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || (reasonRequired && !reasonValue.trim())}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-xs disabled:opacity-50 ${confirmBtnClass}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            {message}
          </p>

          {reasonInput && (
            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {reasonRequired ? 'Reason / Remarks (Required)' : 'Remarks (Optional)'}
              </label>
              <textarea
                value={reasonValue}
                onChange={(e) => onReasonChange(e.target.value)}
                placeholder={reasonPlaceholder}
                rows={3}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
