import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateCompanyModal } from '../../components/forms/CreateCompanyModal';
import { formatCurrency } from '../../utils/formatters';
import { Building2, Plus, Eye, ArrowRight, ShieldCheck } from 'lucide-react';

export const CompaniesPage = () => {
  const { companies } = useData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      header: 'Company Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0B2545] text-white font-bold text-xs flex items-center justify-center shrink-0">
            {row.code ? row.code.substring(0, 2) : 'SG'}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block truncate max-w-[220px]">
              {row.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Code: {row.code}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'GeM Reg / GSTIN',
      accessor: 'gemRegNo',
      sortable: true,
      render: (row) => (
        <div className="font-mono text-xs text-slate-700">
          <div>{row.gemRegNo}</div>
          <span className="text-[10px] text-slate-400 block">{row.gstin}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="text-[11px] text-slate-600 truncate max-w-[200px] block">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Admin',
      accessor: 'adminName',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-medium text-slate-900 block text-xs">{row.adminName}</span>
          <span className="text-[10px] text-slate-400">{row.adminEmail}</span>
        </div>
      ),
    },
    {
      header: 'Staff',
      accessor: 'employeeCount',
      sortable: true,
      align: 'center',
      render: (row) => <span className="font-mono font-medium">{row.employeeCount}</span>,
    },
    {
      header: 'Pending Approvals',
      accessor: 'pendingApprovals',
      sortable: true,
      align: 'center',
      render: (row) => (
        row.pendingApprovals > 0 ? (
          <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full font-mono text-[11px]">
            {row.pendingApprovals}
          </span>
        ) : (
          <span className="text-slate-400 font-mono">0</span>
        )
      ),
    },
    {
      header: 'Total PO Value',
      accessor: 'poValue',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 tabular-nums">
          {formatCurrency(row.poValue)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="xs" />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/super-admin/companies/${row.id}`);
          }}
          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Inspect Ledger"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Registered Enterprises Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central governance and ledger separation across participating corporate entities
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enroll New Company</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={companies}
        searchKeys={['name', 'code', 'gemRegNo', 'adminName', 'gstin']}
        searchPlaceholder="Search company name, code, GeM reg, admin..."
        pageSize={8}
        onRowClick={(row) => navigate(`/super-admin/companies/${row.id}`)}
      />

      <CreateCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
