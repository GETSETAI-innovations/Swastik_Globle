import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PdfPreviewModal } from '../../components/common/PdfPreviewModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PlusCircle, Eye, GitCompare, Receipt, FileText } from 'lucide-react';

export const MyQuotationsPage = () => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { quotations } = useData();
  const navigate = useNavigate();

  const [previewDoc, setPreviewDoc] = useState(null);

  // Scoped to salesperson's company
  const visibleData = isSuperAdmin
    ? quotations
    : quotations.filter((q) => q.companyId === currentUser?.companyId);

  const columns = [
    {
      header: 'Quote Number',
      accessor: 'quotationNumber',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-900">{row.quotationNumber}</span>
          <span className="block text-[10px] text-slate-400">Date: {formatDate(row.quotationDate)}</span>
        </div>
      ),
    },
    {
      header: 'Requisition Ref',
      accessor: 'requestNumber',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-semibold text-slate-700">{row.requestNumber}</span>
      ),
    },
    {
      header: 'Vendor Name',
      accessor: 'vendorName',
      sortable: true,
      render: (row) => (
        <div className="max-w-[200px]">
          <span className="font-semibold text-slate-900 truncate block">{row.vendorName}</span>
          <span className="text-[10px] text-slate-400">Warranty: {row.warranty}</span>
        </div>
      ),
    },
    {
      header: 'Final Amount',
      accessor: 'finalAmount',
      sortable: true,
      align: 'right',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-900 tabular-nums">
            {formatCurrency(row.finalAmount)}
          </span>
          {row.isLowestPrice && (
            <span className="block text-[10px] font-bold text-emerald-700">Lowest Bid</span>
          )}
        </div>
      ),
    },
    {
      header: 'Lead Time',
      accessor: 'deliveryTime',
      render: (row) => <span className="text-slate-600 font-medium">{row.deliveryTime}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="xs" />,
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
            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Preview PDF"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Commercial Quotations Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Prepared quotations, pricing evaluations, and statutory approval status
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/salesperson/create-quotation')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Prepare New Quotation</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={visibleData}
        searchKeys={['quotationNumber', 'vendorName', 'requestNumber']}
        searchPlaceholder="Search quotation number, vendor name, tender ref..."
        pageSize={8}
        onRowClick={(row) => setPreviewDoc(row)}
      />

      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        documentData={previewDoc}
        type="quotation"
      />
    </div>
  );
};
