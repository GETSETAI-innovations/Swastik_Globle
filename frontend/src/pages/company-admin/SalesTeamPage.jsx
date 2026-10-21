import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { Briefcase, Receipt, CheckCircle2 } from 'lucide-react';

export const SalesTeamPage = () => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { salespersons } = useData();

  const visibleData = isSuperAdmin
    ? salespersons
    : salespersons.filter((sp) => sp.companyId === currentUser?.companyId);

  const columns = [
    {
      header: 'Specialist Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.name}</span>
          <span className="text-[11px] text-slate-500">{row.email}</span>
        </div>
      ),
    },
    ...(isSuperAdmin
      ? [
          {
            header: 'Company',
            accessor: 'companyName',
            sortable: true,
            render: (row) => <span className="text-slate-700">{row.companyName}</span>,
          },
        ]
      : []),
    {
      header: 'Designation',
      accessor: 'designation',
      sortable: true,
      render: (row) => <span className="text-slate-800 font-medium">{row.designation}</span>,
    },
    {
      header: 'Quotes Created',
      accessor: 'quotationsCreated',
      sortable: true,
      align: 'center',
      render: (row) => <span className="font-mono font-bold text-slate-800">{row.quotationsCreated}</span>,
    },
    {
      header: 'Approved Bids',
      accessor: 'quotationsApproved',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {row.quotationsApproved}
        </span>
      ),
    },
    {
      header: 'Total Quotation Value',
      accessor: 'totalQuotationValue',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 tabular-nums">
          {formatCurrency(row.totalQuotationValue)}
        </span>
      ),
    },
    {
      header: 'Account Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="xs" />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Sales & Institutional Bidding Personnel
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Specialists managing procurement bids, quotation preparation, and vendor negotiations
        </p>
      </div>

      <DataTable
        columns={columns}
        data={visibleData}
        searchKeys={['name', 'email', 'designation', 'companyName']}
        searchPlaceholder="Search salesperson, email, company..."
        pageSize={8}
      />
    </div>
  );
};
