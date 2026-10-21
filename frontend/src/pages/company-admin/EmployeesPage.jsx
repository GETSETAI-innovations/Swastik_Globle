import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateEmployeeModal } from '../../components/forms/CreateEmployeeModal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { useToast } from '../../context/ToastContext';
import { Plus, UserCheck, Shield, Eye, MoreHorizontal, Power, CheckCircle2 } from 'lucide-react';

export const EmployeesPage = () => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { employees, updateEmployeeStatus } = useData();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusDialog, setStatusDialog] = useState({ isOpen: false, emp: null, nextStatus: 'Active' });

  // Scoped strictly to company unless super admin
  const visibleData = isSuperAdmin
    ? employees
    : employees.filter((e) => e.companyId === currentUser?.companyId);

  const handleToggleStatus = (emp) => {
    const nextStatus = emp.accountStatus === 'Active' ? 'Inactive' : 'Active';
    setStatusDialog({ isOpen: true, emp, nextStatus });
  };

  const handleConfirmToggle = () => {
    if (!statusDialog.emp) return;
    updateEmployeeStatus(statusDialog.emp.id, statusDialog.nextStatus, currentUser);
    addToast({
      title: 'Employee Status Updated',
      message: `${statusDialog.emp.name}'s account status set to ${statusDialog.nextStatus}.`,
      type: 'success',
    });
    setStatusDialog({ isOpen: false, emp: null, nextStatus: 'Active' });
  };

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-900">{row.employeeId}</span>
          <span className="block text-[10px] text-slate-400">Joined: {row.joiningDate}</span>
        </div>
      ),
    },
    {
      header: 'Employee Name & Email',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-[11px] text-slate-500">{row.email}</div>
        </div>
      ),
    },
    ...(isSuperAdmin
      ? [
          {
            header: 'Company',
            accessor: 'companyName',
            sortable: true,
            render: (row) => (
              <span className="font-medium text-slate-800 truncate max-w-[170px] block">
                {row.companyName}
              </span>
            ),
          },
        ]
      : []),
    {
      header: 'Department',
      accessor: 'department',
      sortable: true,
      render: (row) => (
        <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
          {row.department}
        </span>
      ),
    },
    {
      header: 'Designation',
      accessor: 'designation',
      sortable: true,
      render: (row) => <span className="text-slate-700">{row.designation}</span>,
    },
    {
      header: 'Login Status',
      accessor: 'loginStatus',
      sortable: true,
      render: (row) => <StatusBadge status={row.loginStatus} size="xs" />,
    },
    {
      header: 'Last Login',
      accessor: 'lastLogin',
      sortable: true,
      render: (row) => <span className="text-slate-500 font-mono text-[11px]">{row.lastLogin}</span>,
    },
    {
      header: 'Work Report',
      accessor: 'workUpdateStatus',
      sortable: true,
      render: (row) => <StatusBadge status={row.workUpdateStatus} size="xs" />,
    },
    {
      header: 'Account Status',
      accessor: 'accountStatus',
      sortable: true,
      render: (row) => <StatusBadge status={row.accountStatus} size="xs" />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleToggleStatus(row)}
            className={`p-1.5 rounded-lg border transition-colors ${
              row.accountStatus === 'Active'
                ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200'
                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 border-slate-200'
            }`}
            title={row.accountStatus === 'Active' ? 'Deactivate Account' : 'Reactivate Account'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      key: 'department',
      label: 'All Departments',
      options: [
        'Mechanical Engineering',
        'Electrical Systems',
        'Quality Assurance',
        'Procurement & Tenders',
        'Field Operations',
        'Network Infrastructure',
      ],
    },
    {
      key: 'loginStatus',
      label: 'Login Status',
      options: ['Online', 'Away', 'Offline'],
    },
    {
      key: 'accountStatus',
      label: 'Account Status',
      options: ['Active', 'Inactive'],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Employee Directory & Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSuperAdmin
              ? 'Global employee directory across all registered corporate entities'
              : `Authorized staff credentials and departmental roles for ${currentUser?.companyName}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Employee</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={visibleData}
        searchKeys={['employeeId', 'name', 'email', 'department', 'designation']}
        searchPlaceholder="Search employee ID, name, email, department..."
        filterOptions={filterOptions}
        pageSize={8}
      />

      <CreateEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ConfirmationDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog({ isOpen: false, emp: null, nextStatus: 'Active' })}
        onConfirm={handleConfirmToggle}
        title={`Set Account to ${statusDialog.nextStatus}`}
        message={`Are you sure you want to mark ${statusDialog.emp?.name}'s account as ${statusDialog.nextStatus}?`}
        confirmText="Confirm Status Change"
        type={statusDialog.nextStatus === 'Inactive' ? 'danger' : 'success'}
      />
    </div>
  );
};
