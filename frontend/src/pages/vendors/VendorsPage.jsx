import React from 'react';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Store, ShieldCheck, Mail, Phone, MapPin, Star } from 'lucide-react';

export const VendorsPage = () => {
  const { vendors } = useData();

  const columns = [
    {
      header: 'Vendor Name & Identification',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block truncate max-w-[240px]">
            {row.name}
          </span>
          <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px] text-slate-400">
            <span>GeM: {row.gemRegNo}</span>
            <span>•</span>
            <span>GSTIN: {row.gstin}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Specialization Category',
      accessor: 'category',
      sortable: true,
      render: (row) => (
        <span className="text-slate-800 font-medium text-xs bg-slate-100 px-2 py-0.5 rounded">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Rating',
      accessor: 'rating',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          <span>{row.rating}</span>
        </span>
      ),
    },
    {
      header: 'Contact Person',
      accessor: 'contactPerson',
      render: (row) => (
        <div>
          <span className="font-medium text-slate-800 block text-xs">{row.contactPerson}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: 'city',
      sortable: true,
      render: (row) => <span className="text-slate-600 text-xs">{row.city}</span>,
    },
    {
      header: 'Statutory Compliance',
      accessor: 'complianceStatus',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{row.complianceStatus}</span>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-teal-700" />
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
            Approved Supplier Network
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
          Government Certified Vendor Directory
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          GeM-verified original equipment manufacturers (OEM) and contractors authorized for institutional bidding
        </p>
      </div>

      <DataTable
        columns={columns}
        data={vendors}
        searchKeys={['name', 'category', 'gstin', 'contactPerson', 'city']}
        searchPlaceholder="Search vendor name, category, GSTIN, city..."
        pageSize={8}
      />
    </div>
  );
};
