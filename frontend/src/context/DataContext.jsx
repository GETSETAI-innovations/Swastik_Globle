import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  COMPANIES as initialCompanies,
  EMPLOYEES as initialEmployees,
  SALESPERSONS as initialSalespersons,
  VENDORS as initialVendors,
  PROCUREMENT_REQUESTS as initialPRs,
  QUOTATIONS as initialQuotations,
  PURCHASE_ORDERS as initialPOs,
  WORK_UPDATES as initialWorkUpdates,
  LOGIN_SESSIONS as initialLoginSessions,
  AUDIT_LOGS as initialAuditLogs,
  NOTIFICATIONS as initialNotifications,
} from '../data/mockData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // Load state or fallback to mock data
  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem('swastik_companies');
    return saved ? JSON.parse(saved) : initialCompanies;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('swastik_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [salespersons, setSalespersons] = useState(() => {
    const saved = localStorage.getItem('swastik_salespersons');
    return saved ? JSON.parse(saved) : initialSalespersons;
  });

  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem('swastik_vendors');
    return saved ? JSON.parse(saved) : initialVendors;
  });

  const [procurementRequests, setProcurementRequests] = useState(() => {
    const saved = localStorage.getItem('swastik_procurement_requests');
    return saved ? JSON.parse(saved) : initialPRs;
  });

  const [quotations, setQuotations] = useState(() => {
    const saved = localStorage.getItem('swastik_quotations');
    return saved ? JSON.parse(saved) : initialQuotations;
  });

  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    const saved = localStorage.getItem('swastik_purchase_orders');
    return saved ? JSON.parse(saved) : initialPOs;
  });

  const [workUpdates, setWorkUpdates] = useState(() => {
    const saved = localStorage.getItem('swastik_work_updates');
    return saved ? JSON.parse(saved) : initialWorkUpdates;
  });

  const [loginSessions, setLoginSessions] = useState(() => {
    const saved = localStorage.getItem('swastik_login_sessions');
    return saved ? JSON.parse(saved) : initialLoginSessions;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('swastik_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('swastik_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('swastik_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('swastik_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('swastik_salespersons', JSON.stringify(salespersons));
  }, [salespersons]);

  useEffect(() => {
    localStorage.setItem('swastik_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('swastik_procurement_requests', JSON.stringify(procurementRequests));
  }, [procurementRequests]);

  useEffect(() => {
    localStorage.setItem('swastik_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('swastik_purchase_orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('swastik_work_updates', JSON.stringify(workUpdates));
  }, [workUpdates]);

  useEffect(() => {
    localStorage.setItem('swastik_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('swastik_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Audit Log Appender
  const logAudit = ({ action, entityType, entityId, details, user }) => {
    const newLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      userId: user?.id || 'usr-system',
      userName: user?.name || 'System Operator',
      role: user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'company_admin' ? 'Company Admin' : user?.role === 'salesperson' ? 'Salesperson' : 'Employee',
      companyName: user?.companyName || 'HQ Central Administration',
      action,
      entityType,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Add Notification
  const addNotification = ({ title, message, type = 'general', roleTarget = ['super_admin'], link = '#' }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
      roleTarget,
      link,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Procurement Requests: Add
  const addProcurementRequest = (prData, currentUser) => {
    const newId = `pr-${Date.now()}`;
    const newNumber = `PR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPR = {
      id: newId,
      requestNumber: newNumber,
      companyId: prData.companyId || currentUser?.companyId || 'comp-1',
      companyName: prData.companyName || currentUser?.companyName || 'Swastik Globle Enterprises Pvt Ltd',
      title: prData.title,
      description: prData.description,
      category: prData.category || 'General Procurement',
      requestedBy: currentUser?.name || 'Procurement Officer',
      requestedByRole: currentUser?.designation || 'Staff',
      requiredQuantity: prData.requiredQuantity,
      estimatedBudget: Number(prData.estimatedBudget) || 0,
      currency: 'INR',
      requiredDeliveryDate: prData.requiredDeliveryDate,
      priority: prData.priority || 'Medium',
      attachments: prData.attachments || [],
      createdDate: new Date().toISOString().split('T')[0],
      currentStatus: 'Collecting Quotations',
      selectedQuotationId: null,
      approvalWorkflow: {
        stage1: {
          stage: 'Company Admin Review',
          reviewer: null,
          reviewerRole: 'Company Admin',
          status: 'Pending',
          timestamp: null,
          remarks: 'New request initiated. Awaiting quotations.',
        },
        stage2: {
          stage: 'Super Admin Final Approval',
          reviewer: null,
          reviewerRole: 'Super Admin',
          status: 'Locked',
          timestamp: null,
          remarks: 'Locked until Company Admin approval succeeds.',
        },
      },
    };

    setProcurementRequests((prev) => [newPR, ...prev]);
    logAudit({
      action: 'CREATE_PROCUREMENT_REQUEST',
      entityType: 'Procurement Request',
      entityId: newNumber,
      details: `Requisition created for ${newPR.title} (Budget: ₹${newPR.estimatedBudget})`,
      user: currentUser,
    });
    addNotification({
      title: 'New Procurement Request Created',
      message: `${newNumber}: ${newPR.title} was submitted. Ready for quotation collection.`,
      roleTarget: ['company_admin', 'salesperson', 'super_admin'],
      link: `/procurement/${newId}`,
    });
    return newPR;
  };

  // Quotations: Add / Submit
  const addQuotation = (quoteData, currentUser) => {
    const newId = `qt-${Date.now()}`;
    const quoteNum = quoteData.quotationNumber || `QT-2026-SG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newQuote = {
      id: newId,
      quotationNumber: quoteNum,
      procurementRequestId: quoteData.procurementRequestId,
      requestNumber: quoteData.requestNumber,
      companyId: quoteData.companyId || currentUser?.companyId,
      companyName: quoteData.companyName || currentUser?.companyName,
      vendorId: quoteData.vendorId,
      vendorName: quoteData.vendorName,
      preparedBy: currentUser?.name || 'Sales Representative',
      quotationDate: quoteData.quotationDate || new Date().toISOString().split('T')[0],
      validityDate: quoteData.validityDate,
      deliveryTime: quoteData.deliveryTime,
      paymentTerms: quoteData.paymentTerms,
      warranty: quoteData.warranty,
      complianceStatus: quoteData.complianceStatus || 'Compliant with tender specs',
      lineItems: quoteData.lineItems || [],
      subtotal: Number(quoteData.subtotal) || 0,
      taxAmount: Number(quoteData.taxAmount) || 0,
      shippingCharges: Number(quoteData.shippingCharges) || 0,
      finalAmount: Number(quoteData.finalAmount) || 0,
      isLowestPrice: quoteData.isLowestPrice || false,
      priceDeltaPercent: quoteData.priceDeltaPercent || 'Standard Bid',
      pdfFileName: quoteData.pdfFileName || 'Vendor_Commercial_Bid.pdf',
      pdfFileSize: quoteData.pdfFileSize || '1.8 MB',
      status: 'Pending Company Admin Approval',
      stage1Approved: false,
      stage2Approved: false,
      remarks: quoteData.remarks || 'Quotation submitted for Company Admin review.',
    };

    setQuotations((prev) => [newQuote, ...prev]);

    // Update parent procurement request status
    setProcurementRequests((prev) =>
      prev.map((pr) => {
        if (pr.id === quoteData.procurementRequestId) {
          return {
            ...pr,
            currentStatus: 'Pending Company Admin Approval',
          };
        }
        return pr;
      })
    );

    logAudit({
      action: 'SUBMIT_QUOTATION',
      entityType: 'Quotation',
      entityId: quoteNum,
      details: `Submitted quotation from ${quoteData.vendorName} for ₹${newQuote.finalAmount}`,
      user: currentUser,
    });

    addNotification({
      title: 'Quotation Submitted for Review',
      message: `${quoteNum} from ${quoteData.vendorName} is awaiting Company Admin review.`,
      roleTarget: ['company_admin'],
      link: '/approvals',
    });

    return newQuote;
  };

  // Two-Stage Approval: Stage 1 (Company Admin)
  const approveStage1 = (requestId, quotationId, remarks, currentUser) => {
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    // Update quotation
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === quotationId) {
          return {
            ...q,
            status: 'Pending Super Admin Approval',
            stage1Approved: true,
            stage1Remarks: remarks,
            stage1Reviewer: currentUser?.name || 'Company Admin',
            stage1Date: timestamp,
          };
        }
        return q;
      })
    );

    // Update PR
    setProcurementRequests((prev) =>
      prev.map((pr) => {
        if (pr.id === requestId) {
          return {
            ...pr,
            currentStatus: 'Pending Super Admin Approval',
            selectedQuotationId: quotationId,
            approvalWorkflow: {
              ...pr.approvalWorkflow,
              stage1: {
                stage: 'Company Admin Review',
                reviewer: currentUser?.name || 'Company Admin',
                reviewerRole: 'Company Admin',
                status: 'Approved',
                timestamp,
                remarks: remarks || 'Company Admin evaluated and approved technical & financial parameters.',
              },
              stage2: {
                stage: 'Super Admin Final Approval',
                reviewer: null,
                reviewerRole: 'Super Admin',
                status: 'Pending',
                timestamp: null,
                remarks: 'Unlocked. Awaiting Super Admin final sign-off.',
              },
            },
          };
        }
        return pr;
      })
    );

    logAudit({
      action: 'APPROVAL_STAGE_1',
      entityType: 'Procurement Request',
      entityId: requestId,
      details: `Company Admin approved quotation ${quotationId}. Forwarded to Super Admin. Remarks: ${remarks}`,
      user: currentUser,
    });

    addNotification({
      title: 'Stage-1 Approval Granted',
      message: `Quotation verified by Company Admin. Super Admin final authorization is now pending.`,
      roleTarget: ['super_admin', 'salesperson'],
      link: '/approvals',
    });
  };

  // Stage 1 Rejection
  const rejectStage1 = (requestId, quotationId, reason, currentUser) => {
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'Rejected', rejectionReason: reason } : q))
    );

    setProcurementRequests((prev) =>
      prev.map((pr) => {
        if (pr.id === requestId) {
          return {
            ...pr,
            currentStatus: 'Rejected',
            approvalWorkflow: {
              ...pr.approvalWorkflow,
              stage1: {
                stage: 'Company Admin Review',
                reviewer: currentUser?.name || 'Company Admin',
                reviewerRole: 'Company Admin',
                status: 'Rejected',
                timestamp,
                remarks: reason || 'Rejected during Company Admin review.',
              },
            },
          };
        }
        return pr;
      })
    );

    logAudit({
      action: 'REJECT_STAGE_1',
      entityType: 'Procurement Request',
      entityId: requestId,
      details: `Company Admin rejected quotation ${quotationId}. Reason: ${reason}`,
      user: currentUser,
    });
  };

  // Two-Stage Approval: Stage 2 (Super Admin Final)
  const approveStage2 = (requestId, quotationId, remarks, currentUser) => {
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === quotationId) {
          return {
            ...q,
            status: 'Approved',
            stage2Approved: true,
            stage2Remarks: remarks,
            stage2Reviewer: currentUser?.name || 'Super Admin',
            stage2Date: timestamp,
          };
        }
        return q;
      })
    );

    setProcurementRequests((prev) =>
      prev.map((pr) => {
        if (pr.id === requestId) {
          return {
            ...pr,
            currentStatus: 'Approved',
            approvalWorkflow: {
              ...pr.approvalWorkflow,
              stage2: {
                stage: 'Super Admin Final Approval',
                reviewer: currentUser?.name || 'Super Admin',
                reviewerRole: 'Super Admin',
                status: 'Approved',
                timestamp,
                remarks: remarks || 'Central oversight approval completed. PO generation enabled.',
              },
            },
          };
        }
        return pr;
      })
    );

    logAudit({
      action: 'APPROVAL_STAGE_2',
      entityType: 'Procurement Request',
      entityId: requestId,
      details: `Super Admin granted final approval for request ${requestId}. Remarks: ${remarks}`,
      user: currentUser,
    });

    addNotification({
      title: 'Final Super Admin Approval Granted',
      message: `Central clearance complete! Purchase Order generation is now active.`,
      roleTarget: ['company_admin', 'salesperson', 'super_admin'],
      link: '/purchase-orders',
    });
  };

  // Stage 2 Rejection
  const rejectStage2 = (requestId, quotationId, reason, currentUser) => {
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'Rejected', rejectionReason: reason } : q))
    );

    setProcurementRequests((prev) =>
      prev.map((pr) => {
        if (pr.id === requestId) {
          return {
            ...pr,
            currentStatus: 'Rejected',
            approvalWorkflow: {
              ...pr.approvalWorkflow,
              stage2: {
                stage: 'Super Admin Final Approval',
                reviewer: currentUser?.name || 'Super Admin',
                reviewerRole: 'Super Admin',
                status: 'Rejected',
                timestamp,
                remarks: reason || 'Super Admin declined final approval.',
              },
            },
          };
        }
        return pr;
      })
    );

    logAudit({
      action: 'REJECT_STAGE_2',
      entityType: 'Procurement Request',
      entityId: requestId,
      details: `Super Admin rejected request ${requestId}. Reason: ${reason}`,
      user: currentUser,
    });
  };

  // Purchase Order: Create (Only after Stage 2 Approval!)
  const createPurchaseOrder = ({ requestId, quotationId, poData, currentUser }) => {
    const quote = quotations.find((q) => q.id === quotationId);
    const pr = procurementRequests.find((p) => p.id === requestId);

    if (!quote || !pr) {
      throw new Error('Associated Quotation or Procurement Request not found.');
    }

    if (pr.currentStatus !== 'Approved') {
      throw new Error('Cannot generate Purchase Order until both Company Admin and Super Admin approvals are complete.');
    }

    const newPoId = `po-${Date.now()}`;
    const newPoNum = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPO = {
      id: newPoId,
      poNumber: newPoNum,
      companyId: pr.companyId,
      companyName: pr.companyName,
      requestId: pr.id,
      requestNumber: pr.requestNumber,
      requestTitle: pr.title,
      quotationId: quote.id,
      quotationNumber: quote.quotationNumber,
      vendorId: quote.vendorId,
      vendorName: quote.vendorName,
      finalAmount: quote.finalAmount,
      createdDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: poData?.expectedDeliveryDate || '2026-12-01',
      deliveryStatus: 'Pending Dispatch',
      approvedBySuperAdmin: pr.approvalWorkflow?.stage2?.reviewer || 'Super Admin',
      approvedByCompanyAdmin: pr.approvalWorkflow?.stage1?.reviewer || 'Company Admin',
      paymentStatus: 'Pending Advance',
      lineItems: quote.lineItems.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        unit: 'Units',
        price: item.unitPrice,
        tax: `${item.taxRate}%`,
        total: item.total,
      })),
      billingAddress: poData?.billingAddress || 'Corporate Headquarters',
      shippingAddress: poData?.shippingAddress || 'Central Supply Depot',
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);

    // Mark PR as ordered
    setProcurementRequests((prev) =>
      prev.map((p) => (p.id === requestId ? { ...p, currentStatus: 'Ordered' } : p))
    );

    // Mark quote as ordered
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'Ordered' } : q))
    );

    logAudit({
      action: 'CREATE_PURCHASE_ORDER',
      entityType: 'Purchase Order',
      entityId: newPoNum,
      details: `Generated official PO for ${quote.vendorName} valued at ₹${quote.finalAmount}`,
      user: currentUser,
    });

    addNotification({
      title: 'Purchase Order Generated',
      message: `${newPoNum} was successfully generated for ${quote.vendorName}.`,
      roleTarget: ['super_admin', 'company_admin', 'salesperson'],
      link: `/purchase-orders/${newPoId}`,
    });

    return newPO;
  };

  // Update PO Delivery Status
  const updatePoDeliveryStatus = (poId, newStatus, currentUser) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === poId ? { ...po, deliveryStatus: newStatus } : po))
    );
    logAudit({
      action: 'UPDATE_PO_STATUS',
      entityType: 'Purchase Order',
      entityId: poId,
      details: `Purchase Order status updated to ${newStatus}`,
      user: currentUser,
    });
  };

  // Employee: Submit Work Update
  const submitWorkUpdate = (updateData, currentUser) => {
    const newId = `wu-${Date.now()}`;
    const newUpdate = {
      id: newId,
      date: updateData.date || new Date().toISOString().split('T')[0],
      employeeId: currentUser?.id || 'emp-user',
      employeeName: currentUser?.name || 'Employee',
      employeeDesignation: currentUser?.designation || 'Staff',
      companyId: currentUser?.companyId || 'comp-1',
      companyName: currentUser?.companyName || 'Swastik Globle Enterprises Pvt Ltd',
      taskTitle: updateData.taskTitle,
      description: updateData.description,
      hoursWorked: Number(updateData.hoursWorked) || 8,
      project: updateData.project || 'General Duties',
      category: updateData.category || 'Engineering',
      status: 'Submitted',
      reviewerFeedback: null,
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    setWorkUpdates((prev) => [newUpdate, ...prev]);

    logAudit({
      action: 'SUBMIT_WORK_UPDATE',
      entityType: 'Work Update',
      entityId: newId,
      details: `${currentUser?.name} submitted ${newUpdate.hoursWorked} hours for "${newUpdate.taskTitle}"`,
      user: currentUser,
    });

    addNotification({
      title: 'Work Update Submitted',
      message: `${currentUser?.name} submitted a work update for ${newUpdate.taskTitle}`,
      roleTarget: ['company_admin'],
      link: '/company-admin/work-updates',
    });

    return newUpdate;
  };

  // Review Work Update (Company Admin)
  const reviewWorkUpdate = (updateId, feedback, currentUser) => {
    setWorkUpdates((prev) =>
      prev.map((wu) =>
        wu.id === updateId
          ? {
              ...wu,
              status: 'Reviewed',
              reviewerFeedback: feedback || 'Approved and reviewed by Company Admin.',
            }
          : wu
      )
    );

    logAudit({
      action: 'REVIEW_WORK_UPDATE',
      entityType: 'Work Update',
      entityId: updateId,
      details: `Company Admin reviewed work update. Feedback: ${feedback}`,
      user: currentUser,
    });
  };

  // Add Employee
  const addEmployee = (empData, currentUser) => {
    const newId = `emp-${Date.now()}`;
    const empIdStr = `SG-EMP-${Math.floor(200 + Math.random() * 800)}`;
    const newEmp = {
      id: newId,
      employeeId: empIdStr,
      userId: `usr-${Date.now()}`,
      name: empData.name,
      email: empData.email,
      phone: empData.phone || '+91 98000 00000',
      companyId: empData.companyId || currentUser?.companyId || 'comp-1',
      companyName: empData.companyName || currentUser?.companyName || 'Swastik Globle Enterprises Pvt Ltd',
      department: empData.department,
      designation: empData.designation,
      joiningDate: new Date().toISOString().split('T')[0],
      loginStatus: 'Offline',
      lastLogin: 'Never',
      workUpdateStatus: 'Pending Submission',
      accountStatus: 'Active',
      hoursThisMonth: 0,
      todayHours: 0,
    };

    setEmployees((prev) => [newEmp, ...prev]);

    logAudit({
      action: 'CREATE_EMPLOYEE',
      entityType: 'Employee',
      entityId: empIdStr,
      details: `Added new employee ${newEmp.name} in department ${newEmp.department}`,
      user: currentUser,
    });

    return newEmp;
  };

  // Update Employee Status
  const updateEmployeeStatus = (empId, newStatus, currentUser) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === empId ? { ...emp, accountStatus: newStatus } : emp))
    );
    logAudit({
      action: 'UPDATE_EMPLOYEE_STATUS',
      entityType: 'Employee',
      entityId: empId,
      details: `Employee account status set to ${newStatus}`,
      user: currentUser,
    });
  };

  // Add Company (Super Admin only)
  const addCompany = (compData, currentUser) => {
    const newId = `comp-${Date.now()}`;
    const newComp = {
      id: newId,
      name: compData.name,
      code: compData.code || compData.name.substring(0, 4).toUpperCase(),
      shortName: compData.shortName || compData.name,
      gemRegNo: compData.gemRegNo || `GEM-2026-IND-${Math.floor(100 + Math.random() * 900)}`,
      gstin: compData.gstin || '27AAACS0000F1Z0',
      category: compData.category || 'Industrial Supplies',
      employeeCount: 0,
      onlineCount: 0,
      activeRequests: 0,
      pendingApprovals: 0,
      poValue: 0,
      status: 'Active',
      adminName: compData.adminName,
      adminEmail: compData.adminEmail,
      address: compData.address || 'Industrial Estate',
      phone: compData.phone || '+91 22 0000 0000',
      departments: compData.departments || ['Engineering', 'Procurement', 'Operations'],
      establishedYear: 2026,
    };

    setCompanies((prev) => [...prev, newComp]);
    logAudit({
      action: 'CREATE_COMPANY',
      entityType: 'Company',
      entityId: newId,
      details: `Registered new authorized company: ${newComp.name}`,
      user: currentUser,
    });
    return newComp;
  };

  // Notifications
  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Reset to initial mock database
  const resetDatabase = () => {
    localStorage.removeItem('swastik_companies');
    localStorage.removeItem('swastik_employees');
    localStorage.removeItem('swastik_salespersons');
    localStorage.removeItem('swastik_vendors');
    localStorage.removeItem('swastik_procurement_requests');
    localStorage.removeItem('swastik_quotations');
    localStorage.removeItem('swastik_purchase_orders');
    localStorage.removeItem('swastik_work_updates');
    localStorage.removeItem('swastik_audit_logs');
    localStorage.removeItem('swastik_notifications');

    setCompanies(initialCompanies);
    setEmployees(initialEmployees);
    setSalespersons(initialSalespersons);
    setVendors(initialVendors);
    setProcurementRequests(initialPRs);
    setQuotations(initialQuotations);
    setPurchaseOrders(initialPOs);
    setWorkUpdates(initialWorkUpdates);
    setAuditLogs(initialAuditLogs);
    setNotifications(initialNotifications);
  };

  return (
    <DataContext.Provider
      value={{
        companies,
        employees,
        salespersons,
        vendors,
        procurementRequests,
        quotations,
        purchaseOrders,
        workUpdates,
        loginSessions,
        auditLogs,
        notifications,
        logAudit,
        addNotification,
        addProcurementRequest,
        addQuotation,
        approveStage1,
        rejectStage1,
        approveStage2,
        rejectStage2,
        createPurchaseOrder,
        updatePoDeliveryStatus,
        submitWorkUpdate,
        reviewWorkUpdate,
        addEmployee,
        updateEmployeeStatus,
        addCompany,
        markNotificationRead,
        markAllNotificationsRead,
        resetDatabase,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
