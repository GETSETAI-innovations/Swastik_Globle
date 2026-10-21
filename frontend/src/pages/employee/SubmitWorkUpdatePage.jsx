import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, Clock, Calendar, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

export const SubmitWorkUpdatePage = () => {
  const { currentUser } = useAuth();
  const { submitWorkUpdate } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hoursWorked, setHoursWorked] = useState('8.0');
  const [project, setProject] = useState('Tender SG-2024-PSU-991A');
  const [category, setCategory] = useState('Engineering Verification');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !hoursWorked || !date) {
      addToast({
        title: 'Validation Error',
        message: 'Please complete all required work report fields.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitWorkUpdate(
        {
          date,
          taskTitle,
          description,
          hoursWorked,
          project,
          category,
        },
        currentUser
      );

      addToast({
        title: 'Work Update Submitted',
        message: `Successfully filed ${hoursWorked} hours for "${taskTitle}".`,
        type: 'success',
      });

      setIsSubmitting(false);
      navigate('/employee/work-updates');
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80">
        <button
          type="button"
          onClick={() => navigate('/employee')}
          className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Submit Daily Work Update
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record task milestones and time allocation for administrative review
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Work Report Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Hours Worked *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                required
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Task Title / Deliverable *
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Conducted hydrostatic pressure testing on Class 300 gate valves"
              required
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Project / Tender
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-hidden"
              >
                <option value="Tender SG-2024-PSU-991A">Tender SG-2024-PSU-991A</option>
                <option value="Class 300 Valve Project">Class 300 Valve Project</option>
                <option value="Transformer Cooling Units">Transformer Cooling Units</option>
                <option value="General Engineering & QA">General Engineering & QA</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-hidden"
              >
                <option value="Engineering Verification">Engineering Verification</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="BOM Preparation">BOM Preparation</option>
                <option value="Field Commissioning">Field Commissioning</option>
                <option value="Procurement Support">Procurement Support</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Comprehensive Work Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Detail key activities, tools utilized, test measurements recorded, specifications verified, and dependencies..."
              className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-hidden"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/employee')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Filing Update...' : 'Submit Work Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
