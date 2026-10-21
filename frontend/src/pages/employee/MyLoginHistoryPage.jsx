import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ShieldCheck, Monitor, History } from 'lucide-react';

export const MyLoginHistoryPage = () => {
  const { currentUser } = useAuth();
  const { loginSessions } = useData();

  // Filter to current user
  const mySessions = loginSessions.filter(
    (s) => s.userName === currentUser?.name || s.userId === currentUser?.id
  );

  const columns = [
    {
      header: 'Login Timestamp',
      accessor: 'loginTime',
      sortable: true,
      render: (row) => <span className="font-mono text-slate-900 font-semibold">{row.loginTime}</span>,
    },
    {
      header: 'Logout Timestamp',
      accessor: 'logoutTime',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-slate-500">
          {row.logoutTime || <span className="text-emerald-600 font-bold">Active Current Session</span>}
        </span>
      ),
    },
    {
      header: 'Client IP Address',
      accessor: 'ipAddress',
      sortable: true,
      render: (row) => <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{row.ipAddress}</span>,
    },
    {
      header: 'Terminal / OS',
      accessor: 'device',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-700">
          <Monitor className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.device}</span>
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

  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          My Authentication & Session History
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Audit-ready log of your workstation logins, terminal fingerprints, and active sessions
        </p>
      </div>

      <DataTable
        columns={columns}
        data={mySessions}
        searchKeys={['ipAddress', 'device', 'loginTime']}
        searchPlaceholder="Search IP address, terminal, dates..."
        pageSize={8}
      />
    </div>
  );
};
