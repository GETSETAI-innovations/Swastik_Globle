import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import { FileSpreadsheet, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export const WorkUpdatesPage = () => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { workUpdates, reviewWorkUpdate } = useData();
  const { addToast } = useToast();

  const [reviewModal, setReviewModal] = useState({ isOpen: false, update: null, feedback: '' });

  // Scope to company
  const visibleData = isSuperAdmin
    ? workUpdates
    : workUpdates.filter((wu) => wu.companyId === currentUser?.companyId);

  const handleOpenReview = (wu) => {
    setReviewModal({
      isOpen: true,
      update: wu,
      feedback: wu.reviewerFeedback || 'Approved. Work delivered according to engineering requirements.',
    });
  };

  const handleConfirmReview = () => {
    if (!reviewModal.update) return;

    reviewWorkUpdate(reviewModal.update.id, reviewModal.feedback, currentUser);
    addToast({
      title: 'Work Update Reviewed',
      message: `Feedback and review status logged for ${reviewModal.update.employeeName}.`,
      type: 'success',
    });
    setReviewModal({ isOpen: false, update: null, feedback: '' });
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      sortable: true,
      render: (row) => <span className="font-mono text-slate-800 font-semibold">{formatDate(row.date)}</span>,
    },
    {
      header: 'Employee Name',
      accessor: 'employeeName',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.employeeName}</span>
          <span className="text-[10px] text-slate-400">{row.employeeDesignation}</span>
        </div>
      ),
    },
    {
      header: 'Task Title & Deliverables',
      accessor: 'taskTitle',
      sortable: true,
      render: (row) => (
        <div className="max-w-[280px]">
          <span className="font-semibold text-slate-900 truncate block">{row.taskTitle}</span>
          <span className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
            {row.description}
          </span>
        </div>
      ),
    },
    {
      header: 'Project / Category',
      accessor: 'project',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-medium text-slate-800 block text-[11px]">{row.project}</span>
          <span className="text-[10px] text-slate-400">{row.category}</span>
        </div>
      ),
    },
    {
      header: 'Hours',
      accessor: 'hoursWorked',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          {row.hoursWorked} hrs
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
      header: 'Action',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenReview(row);
            }}
            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
          >
            Review / Feedback
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Employee Daily Work Updates & Approvals
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review submitted engineering tasks, verified hours, and provide managerial feedback
        </p>
      </div>

      <DataTable
        columns={columns}
        data={visibleData}
        searchKeys={['employeeName', 'taskTitle', 'project', 'description']}
        searchPlaceholder="Search employee, task, project, scope..."
        pageSize={8}
      />

      {/* Review & Feedback Modal */}
      <Modal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, update: null, feedback: '' })}
        title="Review Employee Work Report"
        subtitle={`Evaluation for ${reviewModal.update?.employeeName} • ${reviewModal.update?.hoursWorked} hrs reported`}
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setReviewModal({ isOpen: false, update: null, feedback: '' })}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReview}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Save Feedback</span>
            </button>
          </>
        }
      >
        {reviewModal.update && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-900 text-sm">
                {reviewModal.update.taskTitle}
              </div>
              <p className="text-slate-600 leading-relaxed">
                {reviewModal.update.description}
              </p>
              <div className="text-[11px] text-slate-400 pt-1 font-mono">
                Project: {reviewModal.update.project} • Date: {formatDate(reviewModal.update.date)}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Admin Evaluation Feedback / Remarks
              </label>
              <textarea
                value={reviewModal.feedback}
                onChange={(e) =>
                  setReviewModal((prev) => ({ ...prev, feedback: e.target.value }))
                }
                rows={3}
                placeholder="Enter feedback or performance remarks..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-800 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
