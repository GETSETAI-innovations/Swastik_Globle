import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ArrowLeft,
  Building2,
  Users,
  FileText,
  Receipt,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companies, employees, procurementRequests, purchaseOrders } = useData();

  const [activeTab, setActiveTab] = useState('employees'); // 'employees' | 'requests' | 'orders'

  const company = companies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
        <h3 className="text-base font-bold text-slate-800">Company Record Not Found</h3>
        <button
          type="button"
          onClick={() => navigate('/super-admin/companies')}
          className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold"
        >
          Back to Companies
        </button>
      </div>
    );
  }

  // Scoped records strictly to this company!
  const compEmployees = employees.filter((e) => e.companyId === company.id);
  const compRequests = procurementRequests.filter((pr) => pr.companyId === company.id);
  const compOrders = purchaseOrders.filter((po) => po.companyId === company.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => navigate('/super-admin/companies')}
          className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase">
              {company.code}
            </span>
            <StatusBadge status={company.status} size="xs" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            {company.name}
          </h1>
        </div>
      </div>

      {/* Meta Summary Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Accreditation</span>
            <div className="font-mono font-bold text-slate-900 mt-0.5">{company.gemRegNo}</div>
            <span className="text-[10px] text-slate-400">{company.gstin}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Authorized Personnel</span>
            <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
              {compEmployees.length} Staff
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Purchase Orders</span>
            <div className="font-mono font-bold text-teal-800 text-sm mt-0.5 tabular-nums">
              {formatCurrency(compOrders.reduce((sum, p) => sum + p.finalAmount, 0))}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Company Administrator</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">{company.adminName}</div>
            <span className="text-[10px] text-slate-400">{company.adminEmail}</span>
          </div>
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{company.address}</span>
        </div>
      </div>

      {/* Tabs for Scoped Records */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="flex items-center gap-4 px-6 pt-4 border-b border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('employees')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'employees'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Staff Directory ({compEmployees.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'requests'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Procurement Requisitions ({compRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Purchase Orders ({compOrders.length})
          </button>
        </div>

        <div className="p-4 overflow-x-auto text-xs">
          {activeTab === 'employees' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <th className="py-2.5 px-3">Emp ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Designation</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {compEmployees.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2.5 px-3 font-mono font-medium">{e.employeeId}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{e.name}</td>
                    <td className="py-2.5 px-3">{e.department}</td>
                    <td className="py-2.5 px-3">{e.designation}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={e.loginStatus} size="xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'requests' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <th className="py-2.5 px-3">Request No.</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3 text-right">Budget</th>
                  <th className="py-2.5 px-3">Target Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {compRequests.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-mono font-semibold">{r.requestNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 truncate max-w-[240px]">{r.title}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatCurrency(r.estimatedBudget)}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{r.requiredDeliveryDate}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={r.currentStatus} size="xs" /></td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/procurement/${r.id}`)}
                        className="p-1 hover:text-teal-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'orders' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <th className="py-2.5 px-3">PO Number</th>
                  <th className="py-2.5 px-3">Selected Vendor</th>
                  <th className="py-2.5 px-3 text-right">Final Amount</th>
                  <th className="py-2.5 px-3">Delivery Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {compOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 px-3 font-mono font-bold">{o.poNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{o.vendorName}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">{formatCurrency(o.finalAmount)}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={o.deliveryStatus} size="xs" /></td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/purchase-orders/${o.id}`)}
                        className="p-1 hover:text-teal-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
