import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { Settings, RefreshCw, Bell, Shield, Database, Check } from 'lucide-react';

export const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { resetDatabase } = useData();
  const { addToast } = useToast();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [approvalSms, setApprovalSms] = useState(true);
  const [compactTables, setCompactTables] = useState(false);

  const handleConfirmReset = () => {
    resetDatabase();
    setConfirmResetOpen(false);
    addToast({
      title: 'Database Restored',
      message: 'All procurement requests, quotations, and audit logs have been reset to pristine demo values.',
      type: 'info',
    });
  };

  const handleSavePreferences = () => {
    addToast({
      title: 'Preferences Saved',
      message: 'Your system and notification settings have been stored.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          System Preferences & Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Portal notifications, display density, statutory compliance parameters, and demo state reset
        </p>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Bell className="w-4 h-4 text-teal-700" />
          <h3 className="font-semibold text-sm text-slate-900">
            Dispatch & Alert Notifications
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-teal-700 border-slate-300 focus:ring-teal-600"
            />
            <div>
              <span className="font-semibold text-slate-800 block">
                Instant Email Notifications on Stage Approvals
              </span>
              <span className="text-slate-500 text-[11px]">
                Dispatches a notification when Stage 1 or Stage 2 decisions are recorded.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={approvalSms}
              onChange={(e) => setApprovalSms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-teal-700 border-slate-300 focus:ring-teal-600"
            />
            <div>
              <span className="font-semibold text-slate-800 block">
                Urgent High-Value Tender Alerts (SMS/WhatsApp)
              </span>
              <span className="text-slate-500 text-[11px]">
                Sends security alerts for bids exceeding ₹25,00,000 threshold.
              </span>
            </div>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Demonstration Database Reset */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Database className="w-4 h-4 text-amber-600" />
          <h3 className="font-semibold text-sm text-slate-900">
            Demonstration State Management
          </h3>
        </div>

        <p className="text-slate-600 leading-relaxed">
          If you have added new requisitions, created quotations, or completed approval cycles and wish to restore the pristine multi-company demonstration dataset, click below to reset the browser storage.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Database to Initial State</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Database"
        message="This will clear your local storage modifications and restore the initial companies, employees, requisitions, and quotations dataset."
        confirmText="Confirm Reset"
        type="warning"
      />
    </div>
  );
};
