import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Clock,
  CalendarCheck,
  CheckCircle2,
  PlusCircle,
  History,
  Shield,
  ArrowRight,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { WeeklyHoursChart } from '../../components/charts/WeeklyHoursChart';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

export const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const { workUpdates, submitWorkUpdate, loginSessions } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Quick submit modal/form state
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hoursWorked, setHoursWorked] = useState('8.0');
  const [project, setProject] = useState('Tender SG-2024-PSU-991A');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter updates for CURRENT EMPLOYEE ONLY
  const myUpdates = workUpdates.filter(
    (wu) => wu.employeeName === currentUser?.name || wu.employeeId === currentUser?.id
  );

  const totalUpdates = myUpdates.length;
  const updatesThisWeek = myUpdates.filter((wu) => wu.date >= '2026-10-14').length;
  const totalHours = myUpdates.reduce((sum, u) => sum + (Number(u.hoursWorked) || 0), 0);
  const pendingReviews = myUpdates.filter((wu) => wu.status === 'Submitted').length;

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !hoursWorked) {
      addToast({
        title: 'Validation Error',
        message: 'Task title and hours worked are mandatory.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitWorkUpdate(
        {
          taskTitle,
          description,
          hoursWorked,
          project,
          category: 'Engineering & Delivery',
        },
        currentUser
      );
      addToast({
        title: 'Work Update Filed',
        message: 'Your daily log has been submitted to your Company Admin for review.',
        type: 'success',
      });
      setIsSubmitting(false);
      setTaskTitle('');
      setDescription('');
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#3730A3] to-[#4F46E5] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              <span>{currentUser?.companyName}</span>
              <span>•</span>
              <span>{currentUser?.department}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {currentUser?.name}
            </h1>
            <p className="text-xs text-indigo-100 mt-1 max-w-xl">
              Today is Monday, 19 October 2026. Your workstation session is active. Remember to log your daily engineering hours and project deliverables.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-3.5 py-2 rounded-xl text-center">
              <span className="block text-[10px] text-indigo-200 uppercase font-semibold">Session Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online / Verified
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/employee/submit-work-update')}
              className="px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 font-semibold rounded-xl text-xs transition-colors shadow-xs shrink-0"
            >
              Submit Detailed Log
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Work Updates"
          value={totalUpdates}
          subtitle="All submitted reports"
          icon={FileSpreadsheet}
          iconBg="bg-indigo-50 text-indigo-700"
          onClick={() => navigate('/employee/work-updates')}
        />
        <KpiCard
          title="Updates This Week"
          value={updatesThisWeek}
          trend="Target: 5 updates"
          trendPositive={true}
          icon={CalendarCheck}
          iconBg="bg-blue-50 text-blue-700"
        />
        <KpiCard
          title="Hours Logged"
          value={`${totalHours.toFixed(1)} hrs`}
          subtitle="Current billing cycle"
          icon={Clock}
          iconBg="bg-purple-50 text-purple-700"
        />
        <KpiCard
          title="Pending Reviews"
          value={pendingReviews}
          subtitle="Admin sign-off pending"
          icon={TrendingUp}
          iconBg="bg-amber-50 text-amber-700"
        />
      </div>

      {/* Two Column Section: Quick Submit Form + Weekly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Work Update Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h4 className="font-semibold text-sm text-slate-900">
                Log Today's Work Report
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Record your daily deliverables and time allocation
              </p>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Date: 19 Oct 2026
            </span>
          </div>

          <form onSubmit={handleQuickSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Task Title / Milestone *
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Conducted hydrostatic pressure tests on Class 300 valves"
                required
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Hours Worked *
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(e.target.value)}
                  placeholder="8.0"
                  required
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs font-mono focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Project / Tender Assignment
                </label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-hidden"
                >
                  <option value="Tender SG-2024-PSU-991A">Tender SG-2024-PSU-991A</option>
                  <option value="Class 300 Valve Project">Class 300 Valve Project</option>
                  <option value="Transformer Cooling Units">Transformer Cooling Units</option>
                  <option value="General Engineering Verification">General Engineering Verification</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Work Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Key technical accomplishments, test results, specifications reviewed, or blockers..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-9 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : 'Submit Work Update for Review'}</span>
            </button>
          </form>
        </div>

        {/* Weekly Chart */}
        <div>
          <WeeklyHoursChart />
        </div>
      </div>

      {/* Recent Updates History with Reviewer Feedback */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h4 className="font-semibold text-sm text-slate-900">
              My Submitted Work Updates & Feedback
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Review history and administrative evaluation remarks
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/employee/work-updates')}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {myUpdates.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No work updates recorded yet. Use the form above to submit your first report.
            </p>
          ) : (
            myUpdates.map((wu) => (
              <div
                key={wu.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 text-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">{wu.taskTitle}</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {wu.project} • Logged on {formatDate(wu.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {wu.hoursWorked} hrs
                    </span>
                    <StatusBadge status={wu.status} size="xs" />
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {wu.description}
                </p>

                {wu.reviewerFeedback && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-start gap-2 bg-white/70 p-2.5 rounded border border-slate-200">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-700">Admin Feedback: </span>
                      <span className="text-slate-600 italic">"{wu.reviewerFeedback}"</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
