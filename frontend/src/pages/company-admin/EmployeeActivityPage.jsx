import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Monitor, UserCheck, Shield } from 'lucide-react';

export const EmployeeActivityPage = () => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { loginSessions } = useData();

  const visibleData = isSuperAdmin
    ? loginSessions
    : loginSessions.filter((s) => !s.companyId || s.companyId === currentUser?.companyId);

  const columns = [
    {
      header: 'Employee / User',
      accessor: 'userName',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.userName}</span>
          <span className="text-[10px] text-slate-400 capitalize">{row.role.replace('_', ' ')}</span>
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
      header: 'Login Time',
      accessor: 'loginTime',
      sortable: true,
      render: (row) => <span className="font-mono text-slate-800 text-[11px] font-medium">{row.loginTime}</span>,
    },
    {
      header: 'Logout Time',
      accessor: 'logoutTime',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-slate-500 text-[11px]">
          {row.logoutTime || <span className="text-emerald-700 font-bold">Currently Active</span>}
        </span>
      ),
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
          {row.ipAddress}
        </span>
      ),
    },
    {
      header: 'Terminal & Device',
      accessor: 'device',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-[200px]">{row.device}</span>
        </div>
      ),
    },
    {
      header: 'Session Status',
      accessor: 'sessionStatus',
      sortable: true,
      render: (row) => <StatusBadge status={row.sessionStatus} size="xs" />,
    },
  ];

  const filterOptions = [
    {
      key: 'sessionStatus',
      label: 'Session Status',
      options: ['Active', 'Terminated'],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Employee Login & Session Activity
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Statutory audit logs of employee workstation sessions, network origins, and connection duration
        </p>
      </div>

      <DataTable
        columns={columns}
        data={visibleData}
        searchKeys={['userName', 'ipAddress', 'device', 'companyName']}
        searchPlaceholder="Search user name, IP address, device..."
        filterOptions={filterOptions}
        pageSize={8}
      />
    </div>
  );
};
