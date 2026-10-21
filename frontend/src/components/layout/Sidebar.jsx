import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users2,
  UserCheck,
  Briefcase,
  FileText,
  GitCompare,
  ShieldCheck,
  Receipt,
  Store,
  BarChart3,
  History,
  Bell,
  Settings,
  PlusCircle,
  HelpCircle,
  Clock,
  CalendarCheck,
  Upload,
  User,
  X,
  FileSpreadsheet,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, theme } = useAuth();
  const { procurementRequests, purchaseOrders, workUpdates, quotations } = useData();
  const navigate = useNavigate();

  const role = currentUser?.role || 'super_admin';

  // Role-specific counts for sidebar badges
  const pendingApprovalsCount = role === 'super_admin'
    ? procurementRequests.filter((pr) => pr.currentStatus === 'Pending Super Admin Approval').length
    : role === 'company_admin'
    ? procurementRequests.filter((pr) => pr.companyId === currentUser?.companyId && pr.currentStatus === 'Pending Company Admin Approval').length
    : quotations.filter((q) => q.companyId === currentUser?.companyId && q.status.includes('Pending')).length;

  const pendingWorkUpdatesCount = workUpdates.filter(
    (wu) => (!currentUser?.companyId || wu.companyId === currentUser?.companyId) && wu.status === 'Submitted'
  ).length;

  const activePosCount = role === 'super_admin'
    ? purchaseOrders.length
    : purchaseOrders.filter((po) => po.companyId === currentUser?.companyId).length;

  // Role Navigation Items
  const getNavItems = () => {
    switch (role) {
      case 'super_admin':
        return [
          { label: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
          { label: 'Tenders & Quotes', path: '/procurement?tab=tenders', icon: FileText },
          { label: 'Product Catalog', path: '/procurement?tab=catalog', icon: Store },
          { label: 'Companies', path: '/super-admin/companies', icon: Building2 },
          { label: 'Company Admins', path: '/super-admin/company-admins', icon: Users2 },
          { label: 'All Employees', path: '/super-admin/all-employees', icon: UserCheck },
          { label: 'Sales Team', path: '/super-admin/sales-team', icon: Briefcase },
          { label: 'Login & Activity', path: '/super-admin/activity', icon: Activity },
          { label: 'Quotation Comparison', path: '/quotation-comparison', icon: GitCompare },
          {
            label: 'Approval Management',
            path: '/approvals',
            icon: ShieldCheck,
            badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
          },
          {
            label: 'Purchase Orders',
            path: '/purchase-orders',
            icon: Receipt,
            badge: activePosCount > 0 ? activePosCount : null,
          },
          { label: 'Reports & Analytics', path: '/super-admin/reports', icon: BarChart3 },
          { label: 'Audit Logs', path: '/super-admin/audit-logs', icon: History },
          { label: 'Notifications', path: '/notifications', icon: Bell },
          { label: 'Settings', path: '/super-admin/settings', icon: Settings },
        ];

      case 'company_admin':
        return [
          { label: 'Dashboard', path: '/company-admin', icon: LayoutDashboard },
          { label: 'Tenders & Quotes', path: '/procurement?tab=tenders', icon: FileText },
          { label: 'Product Catalog', path: '/procurement?tab=catalog', icon: Store },
          { label: 'My Company', path: '/company-admin/my-company', icon: Building2 },
          { label: 'Employees', path: '/company-admin/employees', icon: UserCheck },
          { label: 'Login Activity', path: '/company-admin/activity', icon: History },
          {
            label: 'Work Updates',
            path: '/company-admin/work-updates',
            icon: FileSpreadsheet,
            badge: pendingWorkUpdatesCount > 0 ? pendingWorkUpdatesCount : null,
          },
          { label: 'Sales Team', path: '/company-admin/sales-team', icon: Briefcase },
          {
            label: 'Pending Approvals',
            path: '/approvals',
            icon: ShieldCheck,
            badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
          },
          {
            label: 'Purchase Orders',
            path: '/purchase-orders',
            icon: Receipt,
            badge: activePosCount > 0 ? activePosCount : null,
          },
          { label: 'Reports', path: '/company-admin/reports', icon: BarChart3 },
          { label: 'Notifications', path: '/notifications', icon: Bell },
          { label: 'Settings', path: '/company-admin/settings', icon: Settings },
        ];

      case 'employee':
        return [
          { label: 'My Dashboard', path: '/employee', icon: LayoutDashboard },
          { label: 'My Profile', path: '/employee/profile', icon: User },
          { label: 'My Work Updates', path: '/employee/work-updates', icon: FileSpreadsheet },
          { label: 'Submit Work Update', path: '/employee/submit-work-update', icon: PlusCircle },
          { label: 'My Login History', path: '/employee/login-history', icon: History },
          { label: 'My Attendance', path: '/employee/attendance', icon: CalendarCheck },
          { label: 'Notifications', path: '/notifications', icon: Bell },
          { label: 'Settings', path: '/employee/settings', icon: Settings },
        ];

      case 'salesperson':
        return [
          { label: 'My Dashboard', path: '/salesperson', icon: LayoutDashboard },
          { label: 'Tenders & Quotes', path: '/procurement?tab=tenders', icon: FileText },
          { label: 'Product Catalog', path: '/procurement?tab=catalog', icon: Store },
          { label: 'My Quotations', path: '/salesperson/my-quotations', icon: GitCompare },
          { label: 'Create Quotation', path: '/salesperson/create-quotation', icon: PlusCircle },
          { label: 'Upload Quotation PDF', path: '/salesperson/upload-pdf', icon: Upload },
          {
            label: 'Quotation Status',
            path: '/approvals',
            icon: ShieldCheck,
            badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
          },
          { label: 'Purchase Orders', path: '/purchase-orders', icon: Receipt },
          { label: 'Notifications', path: '/notifications', icon: Bell },
          { label: 'My Profile', path: '/salesperson/profile', icon: User },
          { label: 'Settings', path: '/salesperson/settings', icon: Settings },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  // CTA button config based on role
  const getCtaConfig = () => {
    if (role === 'employee') {
      return {
        label: 'Daily Work Update',
        action: () => navigate('/employee/submit-work-update'),
      };
    }
    return {
      label: 'Create Quote',
      action: () => (role === 'salesperson' ? navigate('/salesperson/create-quotation') : navigate('/procurement?tab=catalog')),
    };
  };

  const cta = getCtaConfig();

  const sidebarContent = (
    <div className={`h-full flex flex-col justify-between py-4 px-3 select-none text-slate-300 ${theme.sidebarBg}`}>
      {/* Top Section: Brand + CTA + Nav */}
      <div className="flex flex-col gap-4">
        {/* Brand Emblem */}
        <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
              <div className="w-full h-full bg-[#0B2545] text-white font-black text-sm flex items-center justify-center rounded">
                <img src="/screen.png" alt="Logo" className="w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm tracking-tight font-bold text-white uppercase leading-tight truncate">
                SWASTIK GLOBLE
              </span>
              <span className="text-[10px] text-teal-300 font-semibold tracking-wider truncate">
                Government Supplier
              </span>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action CTA inside Sidebar */}
        <div className="px-1">
          <button
            type="button"
            onClick={cta.action}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer shadow-sm active:scale-[0.98] ${theme.btnPrimary}`}
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">{cta.label}</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-0.5 mt-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/super-admin' || item.path === '/company-admin' || item.path === '/employee' || item.path === '/salesperson'}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer duration-150 ${
                    isActive
                      ? theme.sidebarActive
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0 opacity-80" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-teal-500/20 text-teal-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Section: Role & Help Desk */}
      <div className="border-t border-white/10 pt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-3 py-2 text-slate-300 text-xs font-medium rounded-lg bg-white/5">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-slate-400" />
            <span>Role: {theme.title || 'Admin'}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Session Verified" />
        </div>
        <button
          type="button"
          onClick={() => alert('Swastik Globle GeM Help Desk: Toll-Free 1800-11-2024 / support@swastik.gov.in')}
          className="flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 font-medium text-xs transition-colors rounded-lg cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help Desk</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 bottom-0 z-40 w-60 border-r border-slate-800/20 shadow-md">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Mobile Off-Canvas Drawer */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
