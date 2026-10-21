import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { PlusCircle, MessageSquare, Clock } from 'lucide-react';

export const MyWorkUpdatesPage = () => {
  const { currentUser } = useAuth();
  const { workUpdates } = useData();
  const navigate = useNavigate();

  // Scope to current employee only!
  const myUpdates = workUpdates.filter(
    (wu) => wu.employeeName === currentUser?.name || wu.employeeId === currentUser?.id
  );

  const columns = [
    {
      header: 'Report Date',
      accessor: 'date',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-slate-800 font-semibold">{formatDate(row.date)}</span>
      ),
    },
    {
      header: 'Task Title & Deliverables',
      accessor: 'taskTitle',
      sortable: true,
      render: (row) => (
        <div className="max-w-[320px]">
          <span className="font-semibold text-slate-900 block truncate">{row.taskTitle}</span>
          <span className="text-[10px] text-slate-400 block truncate mt-0.5">
            {row.description}
          </span>
          {row.reviewerFeedback && (
            <div className="flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50/70 p-1 rounded mt-1">
              <MessageSquare className="w-3 h-3 shrink-0" />
              <span className="italic truncate">{row.reviewerFeedback}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Project / Tender',
      accessor: 'project',
      sortable: true,
      render: (row) => <span className="text-slate-600 font-medium">{row.project}</span>,
    },
    {
      header: 'Hours',
      accessor: 'hoursWorked',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
          {row.hoursWorked} hrs
        </span>
      ),
    },
    {
      header: 'Review Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="xs" />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            My Daily Work Reports History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Personal chronological log of submitted project deliverables and administrative review feedback
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/employee/submit-work-update')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Submit Work Report</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={myUpdates}
        searchKeys={['taskTitle', 'project', 'description']}
        searchPlaceholder="Search task titles, deliverables, projects..."
        pageSize={8}
      />
    </div>
  );
};
