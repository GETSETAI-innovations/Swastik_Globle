import React from 'react';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { ShieldCheck, History, User, Building } from 'lucide-react';

export const AuditLogsPage = () => {
  const { auditLogs } = useData();

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      sortable: true,
      render: (row) => <span className="font-mono text-slate-700 text-[11px] font-semibold">{row.timestamp}</span>,
    },
    {
      header: 'User & Role',
      accessor: 'userName',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.userName}</span>
          <span className="text-[10px] text-slate-400 capitalize font-medium">{row.role}</span>
        </div>
      ),
    },
    {
      header: 'Enterprise / Origin',
      accessor: 'companyName',
      sortable: true,
      render: (row) => (
        <span className="text-slate-700 text-xs truncate max-w-[170px] block font-medium">
          {row.companyName}
        </span>
      ),
    },
    {
      header: 'Action Event',
      accessor: 'action',
      sortable: true,
      render: (row) => {
        let badgeCol = 'bg-slate-100 text-slate-800 border-slate-200';
        if (row.action.includes('APPROVAL')) badgeCol = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        else if (row.action.includes('REJECT')) badgeCol = 'bg-rose-50 text-rose-800 border-rose-200';
        else if (row.action.includes('CREATE')) badgeCol = 'bg-blue-50 text-blue-800 border-blue-200';
        else if (row.action.includes('UPLOAD')) badgeCol = 'bg-purple-50 text-purple-800 border-purple-200';

        return (
          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeCol}`}>
            {row.action}
          </span>
        );
      },
    },
    {
      header: 'Entity Ref',
      accessor: 'entityId',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-900">{row.entityId}</span>
          <span className="text-[10px] text-slate-400 block">{row.entityType}</span>
        </div>
      ),
    },
    {
      header: 'Detailed Audit Remarks',
      accessor: 'details',
      render: (row) => (
        <p className="text-slate-600 text-xs leading-relaxed max-w-md">
          {row.details}
        </p>
      ),
    },
  ];

  const filterOptions = [
    {
      key: 'action',
      label: 'Action Filter',
      options: [
        'APPROVAL_STAGE_1',
        'APPROVAL_STAGE_2',
        'CREATE_PURCHASE_ORDER',
        'SUBMIT_QUOTATION',
        'UPLOAD_QUOTATION_PDF',
        'SUBMIT_WORK_UPDATE',
        'CREATE_PROCUREMENT_REQUEST',
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
            Statutory Compliance Ledger
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
          Central Immutable Audit Trail
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Permanent chronological log of all approvals, rejections, vendor uploads, logins, and purchase-order commitments
        </p>
      </div>

      <DataTable
        columns={columns}
        data={auditLogs}
        searchKeys={['userName', 'action', 'entityId', 'details', 'companyName']}
        searchPlaceholder="Search user, action, requisition ID, PO number..."
        filterOptions={filterOptions}
        pageSize={10}
      />
    </div>
  );
};
