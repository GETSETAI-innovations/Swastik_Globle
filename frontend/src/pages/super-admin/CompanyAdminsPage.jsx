import React from 'react';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DEMO_USERS } from '../../data/mockData';
import { ShieldCheck, Mail, Phone, Building } from 'lucide-react';

export const CompanyAdminsPage = () => {
  const { companies } = useData();

  // Find all company admin users
  const companyAdmins = DEMO_USERS.filter((u) => u.role === 'company_admin');

  const columns = [
    {
      header: 'Administrator Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div>
            <span className="font-semibold text-slate-900 block">{row.name}</span>
            <span className="text-[11px] text-slate-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Enterprise',
      accessor: 'companyName',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-[220px]">{row.companyName}</span>
        </div>
      ),
    },
    {
      header: 'Designation',
      accessor: 'designation',
      render: (row) => <span className="text-slate-600">{row.designation}</span>,
    },
    {
      header: 'Contact Phone',
      accessor: 'phone',
      render: (row) => <span className="font-mono text-slate-600">{row.phone}</span>,
    },
    {
      header: 'Last Authentication',
      accessor: 'lastLogin',
      sortable: true,
      render: (row) => <span className="font-mono text-slate-500 text-[11px]">{row.lastLogin}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="xs" />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Company Administrators Roster
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Designated executive administrators managing company operations, employees, and Stage-1 reviews
        </p>
      </div>

      <DataTable
        columns={columns}
        data={companyAdmins}
        searchKeys={['name', 'email', 'companyName', 'phone']}
        searchPlaceholder="Search admin name, email, company..."
        pageSize={8}
      />
    </div>
  );
};
