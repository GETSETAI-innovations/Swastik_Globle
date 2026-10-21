import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Building2, ShieldCheck, Mail, Phone, MapPin, Users, Receipt, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const MyCompanyPage = () => {
  const { currentUser } = useAuth();
  const { companies, employees, procurementRequests, purchaseOrders } = useData();

  const myCompany = companies.find((c) => c.id === currentUser?.companyId) || companies[0];

  const companyEmployees = employees.filter((e) => e.companyId === myCompany.id);
  const companyPos = purchaseOrders.filter((po) => po.companyId === myCompany.id);
  const totalPoSpend = companyPos.reduce((sum, po) => sum + (po.finalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Company Profile & Statutory Credentials
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Authorized corporate profile, GeM accreditation, tax registration, and departmental roster
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0B2545] text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
              {myCompany.code ? myCompany.code.substring(0, 2) : 'SG'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{myCompany.name}</h2>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified GeM Supplier
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{myCompany.category}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Accreditation</span>
            <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">{myCompany.gemRegNo}</div>
            <div className="font-mono text-slate-500 text-[11px]">GSTIN: {myCompany.gstin}</div>
          </div>
        </div>

        {/* Company Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Headcount</span>
            <div className="font-mono font-bold text-slate-900 text-base mt-0.5">
              {companyEmployees.length} Personnel
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total PO Volume</span>
            <div className="font-mono font-bold text-teal-800 text-base mt-0.5 tabular-nums">
              {formatCurrency(totalPoSpend)}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Est. Year</span>
            <div className="font-mono font-bold text-slate-900 text-base mt-0.5">
              {myCompany.establishedYear}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Designated Admin</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">
              {myCompany.adminName}
            </div>
          </div>
        </div>

        {/* Contact & Statutory Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1.5">
              Registered Head Office & Contact
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{myCompany.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{myCompany.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{myCompany.adminEmail}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1.5">
              Operational Departments
            </h4>
            <div className="flex flex-wrap gap-2">
              {(myCompany.departments || []).map((dept, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium text-xs border border-slate-200"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
