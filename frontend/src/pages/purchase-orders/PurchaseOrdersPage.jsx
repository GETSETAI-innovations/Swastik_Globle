import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PdfPreviewModal } from '../../components/common/PdfPreviewModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Receipt, Eye, Download, ShieldCheck, ArrowRight } from 'lucide-react';

export const PurchaseOrdersPage = () => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { purchaseOrders } = useData();
  const navigate = useNavigate();

  const [previewDoc, setPreviewDoc] = useState(null);

  const visibleData = isSuperAdmin
    ? purchaseOrders
    : purchaseOrders.filter((po) => po.companyId === currentUser?.companyId);

  const columns = [
    {
      header: 'PO Number',
      accessor: 'poNumber',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-900">{row.poNumber}</span>
          <span className="block text-[10px] text-slate-400">Date: {formatDate(row.createdDate)}</span>
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
      header: 'Procurement Title',
      accessor: 'requestTitle',
      sortable: true,
      render: (row) => (
        <div className="max-w-[220px]">
          <span className="font-semibold text-slate-900 truncate block">{row.requestTitle}</span>
          <span className="text-[10px] text-slate-400 font-mono">Ref: {row.requestNumber}</span>
        </div>
      ),
    },
    {
      header: 'Selected Vendor',
      accessor: 'vendorName',
      sortable: true,
      render: (row) => (
        <div className="max-w-[200px]">
          <span className="font-medium text-slate-800 truncate block">{row.vendorName}</span>
          <span className="text-[10px] text-slate-400 font-mono">Quote: {row.quotationNumber}</span>
        </div>
      ),
    },
    {
      header: 'Total PO Amount',
      accessor: 'finalAmount',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 tabular-nums">
          {formatCurrency(row.finalAmount)}
        </span>
      ),
    },
    {
      header: 'Delivery Due',
      accessor: 'expectedDeliveryDate',
      sortable: true,
      render: (row) => <span className="text-slate-600 font-mono text-[11px]">{formatDate(row.expectedDeliveryDate)}</span>,
    },
    {
      header: 'Delivery Status',
      accessor: 'deliveryStatus',
      sortable: true,
      render: (row) => <StatusBadge status={row.deliveryStatus} size="xs" />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewDoc(row);
            }}
            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Preview Official PO PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/purchase-orders/${row.id}`);
            }}
            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Inspect PO Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      key: 'deliveryStatus',
      label: 'All Delivery Statuses',
      options: ['Pending Dispatch', 'In Transit', 'Delivered', 'Completed'],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-700" />
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              Issued Contracts & PO Manifests
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Purchase Order Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statutory Purchase Orders issued following dual-stage administrative approval
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={visibleData}
        searchKeys={['poNumber', 'requestTitle', 'vendorName', 'requestNumber']}
        searchPlaceholder="Search PO number, item, vendor name, quote..."
        filterOptions={filterOptions}
        pageSize={8}
        onRowClick={(row) => navigate(`/purchase-orders/${row.id}`)}
      />

      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        documentData={previewDoc}
        type="po"
      />
    </div>
  );
};
