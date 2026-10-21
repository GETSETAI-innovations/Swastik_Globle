import React from 'react';
import { CheckCircle2, Clock, XCircle, Lock, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const ApprovalTimeline = ({ workflow, currentStatus, onStage1Approve, onStage1Reject, onStage2Approve, onStage2Reject, canReviewStage1, canReviewStage2 }) => {
  const stage1 = workflow?.stage1 || {
    stage: 'Company Admin Review',
    status: 'Pending',
    reviewer: null,
    timestamp: null,
    remarks: 'Awaiting Company Admin evaluation.',
  };

  const stage2 = workflow?.stage2 || {
    stage: 'Super Admin Final Approval',
    status: 'Locked',
    reviewer: null,
    timestamp: null,
    remarks: 'Locked until Stage-1 approval succeeds.',
  };

  const isStage1Approved = stage1.status === 'Approved';
  const isStage1Rejected = stage1.status === 'Rejected';
  const isStage2Approved = stage2.status === 'Approved';
  const isStage2Rejected = stage2.status === 'Rejected';
  const isOrdered = currentStatus === 'Ordered';

  // 5 Stages computation
  const steps = [
    { num: 1, label: 'Procurement Request', status: 'completed' },
    {
      num: 2,
      label: 'Quotation Review',
      status: currentStatus === 'Collecting Quotations' ? 'current' : 'completed',
    },
    {
      num: 3,
      label: 'Company Admin Approval',
      status: isStage1Approved
        ? 'completed'
        : isStage1Rejected
        ? 'rejected'
        : currentStatus === 'Pending Company Admin Approval'
        ? 'current'
        : 'pending',
    },
    {
      num: 4,
      label: 'Super Admin Final Approval',
      status: isStage2Approved
        ? 'completed'
        : isStage2Rejected
        ? 'rejected'
        : isStage1Approved
        ? 'current'
        : 'locked',
    },
    {
      num: 5,
      label: 'PO Generation',
      status: isOrdered
        ? 'completed'
        : isStage1Approved && isStage2Approved
        ? 'ready'
        : 'locked',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-700" />
          <div>
            <h4 className="font-semibold text-sm text-slate-900">
              Procurement Statutory Approval Workflow
            </h4>
            <p className="text-[11px] text-slate-500">
              Two-stage statutory clearance complying with institutional procurement regulations
            </p>
          </div>
        </div>
        <StatusBadge status={currentStatus} size="sm" />
      </div>

      {/* 5-Stage Visual Workflow Stepper */}
      <div className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl overflow-x-auto">
        <div className="flex items-center justify-between min-w-[580px] gap-2">
          {steps.map((st, idx) => {
            const isLast = idx === steps.length - 1;
            const isDone = st.status === 'completed';
            const isCurrent = st.status === 'current';
            const isLocked = st.status === 'locked';
            const isRejected = st.status === 'rejected';
            const isReady = st.status === 'ready';

            let pillBg = 'bg-slate-200 text-slate-600';
            let lineBg = 'bg-slate-200';

            if (isDone) {
              pillBg = 'bg-emerald-600 text-white shadow-2xs';
              lineBg = 'bg-emerald-500';
            } else if (isCurrent || isReady) {
              pillBg = 'bg-teal-700 text-white ring-2 ring-teal-200 shadow-2xs';
            } else if (isRejected) {
              pillBg = 'bg-rose-600 text-white';
            } else if (isLocked) {
              pillBg = 'bg-slate-100 text-slate-400 border border-slate-200';
            }

            return (
              <React.Fragment key={st.num}>
                <div className="flex flex-col items-center text-center flex-1 min-w-[100px]">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${pillBg}`}>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isRejected ? (
                      <XCircle className="w-4 h-4" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      st.num
                    )}
                  </div>
                  <span className={`text-[10px] leading-tight font-semibold uppercase tracking-wider ${
                    isDone
                      ? 'text-emerald-800'
                      : isCurrent || isReady
                      ? 'text-teal-900 font-bold'
                      : isRejected
                      ? 'text-rose-700'
                      : 'text-slate-400'
                  }`}>
                    {st.label}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 capitalize">
                    {st.status === 'current' ? 'In Review' : st.status === 'ready' ? 'PO Unlocked' : st.status}
                  </span>
                </div>
                {!isLast && (
                  <div className={`h-0.5 flex-1 max-w-[40px] mb-6 transition-colors ${lineBg}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {/* Stage 1 Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          isStage1Approved
            ? 'bg-emerald-50/40 border-emerald-200'
            : isStage1Rejected
            ? 'bg-rose-50/40 border-rose-200'
            : 'bg-amber-50/30 border-amber-200 ring-1 ring-amber-300/40'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                Stage 1: Company Admin
              </span>
            </div>
            {isStage1Approved ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
              </span>
            ) : isStage1Rejected ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                <XCircle className="w-3.5 h-3.5" /> Rejected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                <Clock className="w-3.5 h-3.5" /> Pending Review
              </span>
            )}
          </div>

          <div className="space-y-1 text-xs text-slate-600 mt-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Reviewer:</span>
              <span className="font-medium text-slate-800">{stage1.reviewer || 'Assigned Company Admin'}</span>
            </div>
            {stage1.timestamp && (
              <div className="flex justify-between">
                <span className="text-slate-400">Decision Date:</span>
                <span className="text-slate-700">{stage1.timestamp}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200/60 mt-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Remarks / Evaluation:
              </span>
              <p className="text-xs italic text-slate-700 bg-white/70 p-2 rounded border border-slate-200/50">
                "{stage1.remarks || 'Pending evaluation.'}"
              </p>
            </div>
          </div>

          {/* Interactive actions if permitted */}
          {canReviewStage1 && !isStage1Approved && !isStage1Rejected && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onStage1Approve}
                className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve Stage 1
              </button>
              <button
                type="button"
                onClick={onStage1Reject}
                className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>

        {/* Stage 2 Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          isStage2Approved
            ? 'bg-emerald-50/40 border-emerald-200'
            : isStage2Rejected
            ? 'bg-rose-50/40 border-rose-200'
            : isStage1Approved
            ? 'bg-amber-50/30 border-amber-200 ring-1 ring-amber-300/40'
            : 'bg-slate-50 border-slate-200 opacity-75'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                Stage 2: Super Admin HQ
              </span>
            </div>
            {isStage2Approved ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
              </span>
            ) : isStage2Rejected ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                <XCircle className="w-3.5 h-3.5" /> Rejected
              </span>
            ) : isStage1Approved ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                <Clock className="w-3.5 h-3.5" /> Ready for Review
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
                <Lock className="w-3.5 h-3.5" /> Locked
              </span>
            )}
          </div>

          <div className="space-y-1 text-xs text-slate-600 mt-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Reviewer:</span>
              <span className="font-medium text-slate-800">{stage2.reviewer || 'Central Super Admin HQ'}</span>
            </div>
            {stage2.timestamp && (
              <div className="flex justify-between">
                <span className="text-slate-400">Decision Date:</span>
                <span className="text-slate-700">{stage2.timestamp}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200/60 mt-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Central Sign-off Remarks:
              </span>
              <p className="text-xs italic text-slate-700 bg-white/70 p-2 rounded border border-slate-200/50">
                "{stage2.remarks || (isStage1Approved ? 'Pending Super Admin review.' : 'Locked until Stage 1 approved.')}"
              </p>
            </div>
          </div>

          {/* Interactive actions for Super Admin if Stage 1 is approved */}
          {canReviewStage2 && isStage1Approved && !isStage2Approved && !isStage2Rejected && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onStage2Approve}
                className="flex-1 py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Grant Final PO Clearance
              </button>
              <button
                type="button"
                onClick={onStage2Reject}
                className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PO Unlock Notification banner */}
      {isStage1Approved && isStage2Approved && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              Both Approval Stages Complete — Purchase Order Generation is Unlocked.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
