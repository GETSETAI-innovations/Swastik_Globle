import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  'super-admin': 'Super Admin',
  'company-admin': 'Company Admin',
  'employee': 'Employee Portal',
  'salesperson': 'Sales Portal',
  'companies': 'Company Directory',
  'company-admins': 'Company Administrators',
  'all-employees': 'All Employees',
  'employees': 'Staff Directory',
  'work-updates': 'Work Updates',
  'submit-work-update': 'Submit Work Update',
  'login-history': 'Login History',
  'attendance': 'Attendance',
  'sales-team': 'Sales Team',
  'procurement': 'Procurement Requests',
  'create-quotation': 'Create Quotation',
  'quotations': 'Quotations',
  'quotation-comparison': 'Quotation Comparison',
  'approvals': 'Approval Management',
  'purchase-orders': 'Purchase Orders',
  'vendors': 'Vendor Directory',
  'reports': 'Reports & Analytics',
  'audit-logs': 'Audit Logs',
  'notifications': 'Notifications',
  'profile': 'User Profile',
  'settings': 'Settings',
  'activity': 'Login Activity',
  'upload-pdf': 'Upload Quotation PDF',
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium overflow-hidden">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-slate-800 transition-colors text-slate-400 shrink-0"
        title="Home Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = ROUTE_LABELS[segment] || segment.replace(/-/g, ' ');

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="text-slate-800 font-semibold truncate capitalize">
                {label}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-slate-800 transition-colors text-slate-500 truncate capitalize"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
