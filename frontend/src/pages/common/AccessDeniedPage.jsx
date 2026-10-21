import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccessDeniedPage = () => {
  const { currentUser } = useAuth();

  const getHomePath = () => {
    if (currentUser?.role === 'super_admin') return '/super-admin';
    if (currentUser?.role === 'company_admin') return '/company-admin';
    if (currentUser?.role === 'employee') return '/employee';
    if (currentUser?.role === 'salesperson') return '/salesperson';
    return '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        403 — Statutory Access Restricted
      </h2>
      <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
        Your role ({currentUser?.role || 'Guest'}) does not have security clearance to access this department or company ledger. All unauthorized access attempts are recorded in the central audit trail.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          to={getHomePath()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Authorized Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
