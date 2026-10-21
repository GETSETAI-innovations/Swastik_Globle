import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NotFoundPage = () => {
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
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        404 — Record or Route Not Found
      </h2>
      <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
        The requested procurement file, quotation schedule, or system view does not exist or may have been archived.
      </p>
      <div className="mt-6">
        <Link
          to={getHomePath()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
