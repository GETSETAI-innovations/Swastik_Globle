import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, Building, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, theme } = useAuth();
  const { addToast } = useToast();

  const [phone, setPhone] = useState(currentUser?.phone || '+91 98200 11223');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast({
        title: 'Validation Error',
        message: 'Please fill in current and new password fields.',
        type: 'error',
      });
      return;
    }
    if (newPassword.length < 6) {
      addToast({
        title: 'Weak Password',
        message: 'New password must be at least 6 characters.',
        type: 'error',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({
        title: 'Mismatch Error',
        message: 'New password and confirm password do not match.',
        type: 'error',
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast({
        title: 'Password Updated',
        message: 'Your account security credentials have been updated.',
        type: 'success',
      });
    }, 500);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    addToast({
      title: 'Profile Updated',
      message: 'Contact preferences saved.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Enterprise Account Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified personnel credentials, role authorizations, and cryptographic password settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Role Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col items-center text-center space-y-3">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 shadow-md"
          />
          <div>
            <h2 className="text-base font-bold text-slate-900">{currentUser?.name}</h2>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
          </div>

          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            {theme.title}
          </span>

          <div className="w-full pt-4 border-t border-slate-100 text-left text-xs space-y-2 text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Designation</span>
              <span className="font-medium text-slate-800">{currentUser?.designation}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Company Assignment</span>
              <span className="font-medium text-slate-800">{currentUser?.companyName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Last Active</span>
              <span className="font-mono text-slate-700">{currentUser?.lastLogin}</span>
            </div>
          </div>
        </div>

        {/* Right Columns: Edit Contact & Change Password */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Information Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Official Contact & Communication Preferences
            </h3>

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={currentUser?.email}
                    disabled
                    className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 text-xs font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Phone / Extension
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                >
                  Save Contact Updates
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Lock className="w-4 h-4 text-teal-700" />
              <h3 className="font-semibold text-sm text-slate-900">
                Security & Portal Password
              </h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSaving ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
