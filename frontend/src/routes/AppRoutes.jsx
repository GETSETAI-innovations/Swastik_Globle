import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';
import { RoleRoute } from './RoleRoute';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Super Admin Pages
import { SuperAdminDashboard } from '../pages/super-admin/SuperAdminDashboard';
import { CompaniesPage } from '../pages/super-admin/CompaniesPage';
import { CompanyDetailPage } from '../pages/super-admin/CompanyDetailPage';
import { CompanyAdminsPage } from '../pages/super-admin/CompanyAdminsPage';
import { ReportsPage } from '../pages/super-admin/ReportsPage';
import { AuditLogsPage } from '../pages/super-admin/AuditLogsPage';

// Company Admin Pages
import { CompanyAdminDashboard } from '../pages/company-admin/CompanyAdminDashboard';
import { MyCompanyPage } from '../pages/company-admin/MyCompanyPage';
import { EmployeesPage } from '../pages/company-admin/EmployeesPage';
import { EmployeeActivityPage } from '../pages/company-admin/EmployeeActivityPage';
import { WorkUpdatesPage } from '../pages/company-admin/WorkUpdatesPage';
import { SalesTeamPage } from '../pages/company-admin/SalesTeamPage';

// Employee Pages
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { MyWorkUpdatesPage } from '../pages/employee/MyWorkUpdatesPage';
import { SubmitWorkUpdatePage } from '../pages/employee/SubmitWorkUpdatePage';
import { MyLoginHistoryPage } from '../pages/employee/MyLoginHistoryPage';
import { MyAttendancePage } from '../pages/employee/MyAttendancePage';

// Salesperson Pages
import { SalespersonDashboard } from '../pages/salesperson/SalespersonDashboard';
import { CreateQuotationPage } from '../pages/salesperson/CreateQuotationPage';
import { MyQuotationsPage } from '../pages/salesperson/MyQuotationsPage';
import { UploadQuotationPdfPage } from '../pages/salesperson/UploadQuotationPdfPage';

// Shared Operations Pages
import { ProcurementRequestsPage } from '../pages/procurement/ProcurementRequestsPage';
import { ProcurementDetailPage } from '../pages/procurement/ProcurementDetailPage';
import { QuotationComparisonPage } from '../pages/quotations/QuotationComparisonPage';
import { ApprovalManagementPage } from '../pages/approvals/ApprovalManagementPage';
import { PurchaseOrdersPage } from '../pages/purchase-orders/PurchaseOrdersPage';
import { PurchaseOrderDetailPage } from '../pages/purchase-orders/PurchaseOrderDetailPage';
import { VendorsPage } from '../pages/vendors/VendorsPage';

// Common Utility Pages
import { NotificationsPage } from '../pages/common/NotificationsPage';
import { ProfilePage } from '../pages/common/ProfilePage';
import { SettingsPage } from '../pages/common/SettingsPage';
import { AccessDeniedPage } from '../pages/common/AccessDeniedPage';
import { NotFoundPage } from '../pages/common/NotFoundPage';

// Helper component that redirects "/" to the user's role-specific dashboard
const RoleRootRedirect = () => {
  const { currentUser, isAuthenticated } = useAuth();
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role === 'super_admin') return <Navigate to="/super-admin" replace />;
  if (currentUser.role === 'company_admin') return <Navigate to="/company-admin" replace />;
  if (currentUser.role === 'employee') return <Navigate to="/employee" replace />;
  if (currentUser.role === 'salesperson') return <Navigate to="/salesperson" replace />;
  return <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes Layout */}
      <Route
        element={
          <RoleRoute>
            <Layout />
          </RoleRoute>
        }
      >
        {/* Dynamic Root Redirect */}
        <Route path="/" element={<RoleRootRedirect />} />

        {/* ======================================================== */}
        {/* 1. Super Admin Clearance Routes                         */}
        {/* ======================================================== */}
        <Route element={<RoleRoute allowedRoles={['super_admin']} />}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/companies" element={<CompaniesPage />} />
          <Route path="/super-admin/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/super-admin/company-admins" element={<CompanyAdminsPage />} />
          <Route path="/super-admin/all-employees" element={<EmployeesPage />} />
          <Route path="/super-admin/sales-team" element={<SalesTeamPage />} />
          <Route path="/super-admin/activity" element={<EmployeeActivityPage />} />
          <Route path="/super-admin/reports" element={<ReportsPage />} />
          <Route path="/super-admin/audit-logs" element={<AuditLogsPage />} />
          <Route path="/super-admin/settings" element={<SettingsPage />} />
        </Route>

        {/* ======================================================== */}
        {/* 2. Company Admin Clearance Routes                       */}
        {/* ======================================================== */}
        <Route element={<RoleRoute allowedRoles={['company_admin', 'super_admin']} />}>
          <Route path="/company-admin" element={<CompanyAdminDashboard />} />
          <Route path="/company-admin/my-company" element={<MyCompanyPage />} />
          <Route path="/company-admin/employees" element={<EmployeesPage />} />
          <Route path="/company-admin/activity" element={<EmployeeActivityPage />} />
          <Route path="/company-admin/work-updates" element={<WorkUpdatesPage />} />
          <Route path="/company-admin/sales-team" element={<SalesTeamPage />} />
          <Route path="/company-admin/reports" element={<ReportsPage />} />
          <Route path="/company-admin/settings" element={<SettingsPage />} />
        </Route>

        {/* ======================================================== */}
        {/* 3. Employee Clearance Routes                            */}
        {/* ======================================================== */}
        <Route element={<RoleRoute allowedRoles={['employee', 'super_admin', 'company_admin']} />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<ProfilePage />} />
          <Route path="/employee/work-updates" element={<MyWorkUpdatesPage />} />
          <Route path="/employee/submit-work-update" element={<SubmitWorkUpdatePage />} />
          <Route path="/employee/login-history" element={<MyLoginHistoryPage />} />
          <Route path="/employee/attendance" element={<MyAttendancePage />} />
          <Route path="/employee/settings" element={<SettingsPage />} />
        </Route>

        {/* ======================================================== */}
        {/* 4. Salesperson Clearance Routes                         */}
        {/* ======================================================== */}
        <Route element={<RoleRoute allowedRoles={['salesperson', 'super_admin', 'company_admin']} />}>
          <Route path="/salesperson" element={<SalespersonDashboard />} />
          <Route path="/salesperson/create-quotation" element={<CreateQuotationPage />} />
          <Route path="/salesperson/my-quotations" element={<MyQuotationsPage />} />
          <Route path="/salesperson/upload-pdf" element={<UploadQuotationPdfPage />} />
          <Route path="/salesperson/profile" element={<ProfilePage />} />
          <Route path="/salesperson/settings" element={<SettingsPage />} />
        </Route>

        {/* ======================================================== */}
        {/* Shared Procurement, Quotation & Purchase Order Routes    */}
        {/* Accessible to Super Admin, Company Admin, & Salesperson */}
        {/* ======================================================== */}
        <Route element={<RoleRoute allowedRoles={['super_admin', 'company_admin', 'salesperson']} />}>
          <Route path="/procurement" element={<ProcurementRequestsPage />} />
          <Route path="/procurement/:id" element={<ProcurementDetailPage />} />
          <Route element={<RoleRoute allowedRoles={['super_admin']} />}>
            <Route path="/quotation-comparison" element={<QuotationComparisonPage />} />
          </Route>
          <Route path="/approvals" element={<ApprovalManagementPage />} />
          <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />
          <Route path="/vendors" element={<Navigate to="/procurement" replace />} />
        </Route>

        {/* Common Account & Preferences */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Error Pages */}
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
