import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/tables/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateProcurementModal } from '../../components/forms/CreateProcurementModal';
import { ProductSpecsModal } from '../../components/modals/ProductSpecsModal';
import { BulkImportModal } from '../../components/modals/BulkImportModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  CATALOG_PRODUCTS,
  CATALOG_CATEGORIES,
  CATALOG_SUPPLIERS,
  STOCK_STATUS_OPTIONS,
} from '../../data/catalogData';
import {
  Plus,
  Eye,
  FileText,
  ArrowRight,
  GitCompare,
  Building,
  Search,
  Download,
  Upload,
  Grid,
  List,
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  HelpCircle,
  Bell,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Layers,
  Store,
  History,
  FileSpreadsheet,
} from 'lucide-react';

export const ProcurementRequestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, isSuperAdmin, isCompanyAdmin } = useAuth();
  const { procurementRequests, companies, notifications, addNotification } = useData();
  const { addToast } = useToast();

  // Active Tab from query param or default to 'catalog' (as in user screenshot)
  const initialTab = searchParams.get('tab') || 'catalog';
  const [activeTab, setActiveTab] = useState(initialTab); // 'catalog' | 'tenders' | 'quotations' | 'audit_logs'

  // View Mode: Grid (default as in image) vs List/Table
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState(CATALOG_SUPPLIERS[0]);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedStock, setSelectedStock] = useState('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Modals
  const [isPrModalOpen, setIsPrModalOpen] = useState(searchParams.get('new') === 'true');
  const [specsProduct, setSpecsProduct] = useState(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Unread notification count for topbar bell
  const unreadCount = notifications ? notifications.filter((n) => !n.read).length : 2;

  // Filter catalog products based on search, category, supplier, stock
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((prod) => {
      // Search
      const matchSearch =
        !searchQuery.trim() ||
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      let matchCat = true;
      if (selectedCategory === 'gym') matchCat = prod.category === 'Gym Equipment';
      else if (selectedCategory === 'plastic') matchCat = prod.category === 'Heavy Plastic Products';
      else if (selectedCategory === 'dustbins') matchCat = prod.category === 'Commercial Dustbins';
      else if (selectedCategory === 'furniture') matchCat = prod.category === 'Office Furniture';
      else if (selectedCategory === 'defense') matchCat = prod.category === 'Defense & General Supplies';

      // Supplier
      const matchSupplier =
        selectedSupplier.includes('All Vendors') || prod.supplier === selectedSupplier;

      // Stock
      let matchStock = true;
      if (selectedStock === 'Ready Stock') matchStock = prod.stockStatus === 'In Stock';
      else if (selectedStock === 'Low Stock') matchStock = prod.stockStatus === 'Low Stock';
      else if (selectedStock === 'On Order') matchStock = prod.stockStatus === 'On Order';

      return matchSearch && matchCat && matchSupplier && matchStock;
    }).sort((a, b) => {
      if (selectedSort === 'price_asc') return a.price - b.price;
      if (selectedSort === 'price_desc') return b.price - a.price;
      if (selectedSort === 'name_asc') return a.title.localeCompare(b.title);
      if (selectedSort === 'stock_desc') return b.stock - a.stock;
      return 0; // newest
    });
  }, [searchQuery, selectedCategory, selectedSupplier, selectedSort, selectedStock]);

  // Paginated Catalog items
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Scoped Requisitions data for 'tenders' tab
  const visiblePRs = isSuperAdmin
    ? procurementRequests
    : procurementRequests.filter((pr) => pr.companyId === currentUser?.companyId);

  // Actions
  const handleExportPriceList = () => {
    const headers = 'SKU,Product Name,Category,Ceiling Price (INR),Unit,Tax Rate (%),Stock,Supplier,GeM Rate Contract No\n';
    const rows = CATALOG_PRODUCTS.map(
      (p) =>
        `"${p.sku}","${p.title}","${p.category}",${p.price},"${p.unit}",${p.taxRate},${p.stock},"${p.supplier}","${p.gemContractNo}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `swastik_gem_rate_contract_price_list_2024_25.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast({
      title: 'Price Schedule Exported',
      message: 'Official GeM Rate-Contract Price List downloaded.',
      type: 'success',
    });
  };

  const handleDownloadTaxSchedule = (e) => {
    e.preventDefault();
    const csv =
      'Category,HSN Code,Standard GST Rate,GeM Concession Rate,Exemption Code\n' +
      'Gym Equipment,950691,18%,12%,NOTIF-48/2024-CUS\n' +
      'Commercial Dustbins,392690,18%,18%,SWACHH-BHARAT-2024\n' +
      'Heavy Plastic Products,392390,18%,18%,NIL\n' +
      'Office Furniture,940310,18%,18%,CPWD-SCH-2024\n' +
      'Defense Supplies,392690,18%,5%,DEF-EXEMPT-SEC12';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gem_statutory_tax_schedule.csv';
    link.click();
    URL.revokeObjectURL(url);
    addToast({
      title: 'Tax Schedule Downloaded',
      message: 'Statutory GeM GST rates and concession schedules downloaded.',
      type: 'info',
    });
  };

  const handleAddToQuote = (prod) => {
    if (currentUser?.role === 'salesperson') {
      navigate(
        `/salesperson/create-quotation?itemName=${encodeURIComponent(prod.title)}&sku=${prod.sku}&price=${prod.price}`
      );
    } else {
      addToast({
        title: 'Item Added to Procurement Dossier',
        message: `${prod.title} (${prod.sku}) queued for quotation solicitation.`,
        type: 'success',
      });
      setIsPrModalOpen(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Requisitions table columns
  const tenderColumns = [
    {
      header: 'Request No.',
      accessor: 'requestNumber',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-900">{row.requestNumber}</span>
          <span className="block text-[10px] text-slate-400">Created: {formatDate(row.createdDate)}</span>
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
              <span className="font-medium text-slate-800 truncate max-w-[180px] block">
                {row.companyName}
              </span>
            ),
          },
        ]
      : []),
    {
      header: 'Title & Category',
      accessor: 'title',
      sortable: true,
      render: (row) => (
        <div className="max-w-[260px]">
          <div className="font-semibold text-slate-900 truncate">{row.title}</div>
          <span className="inline-block text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
            {row.category}
          </span>
        </div>
      ),
    },
    {
      header: 'Quantity',
      accessor: 'requiredQuantity',
      align: 'center',
      render: (row) => <span className="font-mono font-medium">{row.requiredQuantity}</span>,
    },
    {
      header: 'Est. Budget',
      accessor: 'estimatedBudget',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-semibold text-slate-900 tabular-nums">
          {formatCurrency(row.estimatedBudget)}
        </span>
      ),
    },
    {
      header: 'Due Date',
      accessor: 'requiredDeliveryDate',
      sortable: true,
      render: (row) => <span className="text-slate-600 font-mono text-[11px]">{formatDate(row.requiredDeliveryDate)}</span>,
    },
    {
      header: 'Current Status',
      accessor: 'currentStatus',
      sortable: true,
      render: (row) => <StatusBadge status={row.currentStatus} size="xs" />,
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
              navigate(`/procurement/${row.id}`);
            }}
            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Inspect Requisition Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {isSuperAdmin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/quotation-comparison?prId=${row.id}`);
              }}
              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Compare Quotations"
            >
              <GitCompare className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // User initials for Top Identity Badge
  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'SG';

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* 1. TOP APP BAR / OPERATIONS BAR (EXACT AS IN IMAGE)      */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:px-5 sm:py-3.5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Section Title & Global Links */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="font-bold text-base sm:text-lg text-[#00254a] tracking-tight">
            Procurement Operations
          </span>
          <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                setActiveTab('tenders');
                setSearchParams({ tab: 'tenders' });
              }}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'tenders'
                  ? 'border-b-2 border-teal-700 text-teal-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tenders
            </button>
            {!isCompanyAdmin && (
              <button
                type="button"
                onClick={() => {
                  if (currentUser?.role === 'salesperson') {
                    navigate('/salesperson/my-quotations');
                  } else {
                    navigate('/quotation-comparison');
                  }
                }}
                className="text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer"
              >
                {currentUser?.role === 'salesperson' ? 'My Quotations' : 'Quotations'}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setActiveTab('catalog');
                setSearchParams({ tab: 'catalog' });
              }}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'border-b-2 border-teal-700 text-teal-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Catalog
            </button>
            <button
              type="button"
              onClick={() => {
                if (isSuperAdmin) navigate('/super-admin/audit-logs');
                else navigate('/notifications');
              }}
              className="text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer"
            >
              Audit Logs
            </button>
          </nav>
        </div>

        {/* Right: Search, Action, Trailing Tools & Profile Badge */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Global Search Input */}
          <div className="relative w-48 sm:w-60 hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Global search or GeM ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-teal-700 focus:ring-1 focus:ring-teal-700/20"
            />
          </div>

          {/* New Tender Quotation CTA */}
          <button
            type="button"
            onClick={() => {
              if (currentUser?.role === 'salesperson') {
                navigate('/salesperson/create-quotation');
              } else {
                setIsPrModalOpen(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123b68] hover:bg-[#00254a] text-white text-xs font-semibold transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Tender Quotation</span>
          </button>

          {/* Trailing Icon Actions */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Print Catalog"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                alert('GeM Institutional Procurement Desk: 1800-11-2024 / support@swastik.gov.in');
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="System Help & Compliance Advisory"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/notifications')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
              )}
            </button>
          </div>

          {/* Admin Identity Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[#00254a] font-bold text-xs shrink-0">
              {userInitials}
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="font-semibold text-xs text-slate-900 truncate max-w-[140px]">
                {currentUser?.name || 'P. Sharma'}
              </span>
              <span className="text-[10px] text-teal-700 font-medium">
                GeM Verified Supplier
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. BREADCRUMBS & PAGE HEADER SECTION                     */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span>{activeTab === 'catalog' ? 'Catalog' : 'Procurement'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">
              {activeTab === 'catalog' ? 'All Government Supplies' : 'Tenders & Requisitions'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'catalog' ? 'Product Catalog' : 'Procurement Requisitions & Tenders'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#a6ece8]/40 text-[#1d6965] border border-[#1d6965]/20 text-[11px] font-semibold">
              Active GeM Rate-Contract 2024–25
            </span>
          </div>
        </div>

        {/* Action cluster: Add New Product, Bulk CSV Import, Export Price List */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportPriceList}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Price List</span>
          </button>
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPrModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#123b68] hover:bg-[#00254a] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TENDERS TAB CONTENT (IF USER CLICKS 'TENDERS')        */}
      {/* ======================================================== */}
      {activeTab === 'tenders' ? (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-semibold text-slate-900 block">
                Official Requisition Dossier Ledger
              </span>
              <span className="text-slate-500">
                {isSuperAdmin
                  ? 'Consolidated requisition ledger across all authorized companies'
                  : `Authorized procurement requisitions for ${currentUser?.companyName}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('catalog');
                setSearchParams({ tab: 'catalog' });
              }}
              className="px-3 py-1.5 rounded-lg border border-teal-300 bg-teal-50 text-teal-800 font-semibold hover:bg-teal-100 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to GeM Product Catalog</span>
            </button>
          </div>

          <DataTable
            columns={tenderColumns}
            data={visiblePRs}
            searchKeys={['requestNumber', 'title', 'companyName', 'category', 'requestedBy']}
            searchPlaceholder="Search requisition number, item title, company, category..."
            pageSize={8}
            onRowClick={(row) => navigate(`/procurement/${row.id}`)}
          />
        </div>
      ) : (
        /* ======================================================== */
        /* 4. PRODUCT CATALOG TAB (PRIMARY SHOWCASE MATCHING IMAGE) */
        /* ======================================================== */
        <div className="space-y-4">
          {/* ========================================== */}
          {/* FILTER & CRITERIA BAR                     */}
          {/* ========================================== */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col gap-3">
            {/* Primary Search & View Row */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Live Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by product name, GeM category, or SKU code (e.g. SG-GYM-104)..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-teal-700 focus:ring-1 focus:ring-teal-700/20 transition-all"
                />
              </div>

              {/* Secondary Quick Toggles & Controls */}
              <div className="flex items-center flex-wrap gap-2.5">
                {/* Supplier Filter */}
                <div className="relative">
                  <select
                    value={selectedSupplier}
                    onChange={(e) => {
                      setSelectedSupplier(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="py-2 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-teal-700 cursor-pointer"
                  >
                    {CATALOG_SUPPLIERS.map((sup, idx) => (
                      <option key={idx} value={sup}>
                        {sup}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="py-2 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-teal-700 cursor-pointer"
                  >
                    <option value="newest">Sort by: Newest Releases</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="stock_desc">Highest Ready Stock</option>
                  </select>
                </div>

                {/* Grid / List Switcher */}
                <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Filter Criteria: Categories Pills & Stock Segment */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
                <span className="text-slate-400 font-medium mr-1 shrink-0">Categories:</span>
                {CATALOG_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-md shrink-0 transition-colors text-xs font-medium cursor-pointer ${
                        isActive
                          ? 'bg-[#123b68] text-white font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {cat.label} ({cat.count})
                    </button>
                  );
                })}
              </div>

              {/* Stock Availability Toggle Group */}
              <div className="flex items-center gap-1 shrink-0 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                <span className="text-slate-400 px-1 font-medium">Stock:</span>
                {STOCK_STATUS_OPTIONS.map((st) => {
                  const isActive = selectedStock === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setSelectedStock(st);
                        setCurrentPage(1);
                      }}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 5. RESPONSIVE PRODUCT INVENTORY GRID (8 CARDS)           */}
          {/* ======================================================== */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white border border-slate-200/90 rounded-xl overflow-hidden hover:border-teal-700 transition-all duration-150 flex flex-col justify-between group shadow-2xs hover:shadow-md"
                >
                  <div>
                    {/* Top Image Preview + Badges */}
                    <div className="relative bg-slate-50 h-48 flex items-center justify-center p-3 border-b border-slate-100 overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {/* SKU Badge */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-white/95 border border-slate-200 text-slate-800 shadow-2xs font-mono">
                        SKU: {prod.sku}
                      </span>
                      {/* In Stock / Low Stock Badge */}
                      <span
                        className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs border ${
                          prod.badgeColor === 'green'
                            ? 'bg-[#E6F4EA] text-[#23865B] border-[#23865B]/30'
                            : 'bg-[#FEF7E6] text-[#D99A25] border-[#D99A25]/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            prod.badgeColor === 'green' ? 'bg-[#23865B]' : 'bg-[#D99A25]'
                          }`}
                        />
                        {prod.stockStatusText}
                      </span>
                      {/* Category Label Pill */}
                      <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#123b68] text-white">
                        {prod.shortCategory}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 flex flex-col gap-2">
                      <h3
                        className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-teal-800 transition-colors"
                        title={prod.title}
                      >
                        {prod.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>

                      {/* Price & Tag */}
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <div>
                          <span className="font-mono text-base text-[#00254a] font-bold tabular-nums">
                            {formatCurrency(prod.price)}
                          </span>
                          <span className="text-xs text-slate-500 font-medium"> / {prod.unit}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {prod.commercialTag}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-3 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSpecsProduct(prod)}
                      className="flex-1 py-1.5 px-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold text-center transition-colors shadow-2xs cursor-pointer"
                    >
                      View Specs
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToQuote(prod)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#123b68] hover:bg-[#00254a] text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Quote</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ========================================== */
            /* LIST / TABLE VIEW OPTION                  */
            /* ========================================== */
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">SKU / Code</th>
                      <th className="py-3 px-4">Product Name & Spec</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-right">Ceiling Price</th>
                      <th className="py-3 px-4 text-center">Ready Stock</th>
                      <th className="py-3 px-4">Supplier</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {paginatedProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {prod.sku}
                        </td>
                        <td className="py-3 px-4 max-w-[280px]">
                          <div className="font-semibold text-slate-900">{prod.title}</div>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{prod.description}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700">
                            {prod.shortCategory}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {formatCurrency(prod.price)} <span className="text-[10px] text-slate-400 font-normal">/ {prod.unit}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                              prod.badgeColor === 'green'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            • {prod.stockStatusText}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {prod.supplier}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSpecsProduct(prod)}
                              className="px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Specs
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddToQuote(prod)}
                              className="px-2.5 py-1 rounded bg-[#123b68] hover:bg-[#00254a] text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Quote
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. PAGINATION & METRICS FOOTER                           */}
          {/* ======================================================== */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-900">1–{paginatedProducts.length}</span> of{' '}
              <span className="font-semibold text-slate-900">284</span> government approved SKUs (Page {currentPage} of 36)
            </div>

            <div className="flex items-center gap-3">
              {/* Items per page selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="py-1 px-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-semibold text-xs cursor-pointer focus:outline-hidden"
                >
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={32}>32</option>
                  <option value={64}>64</option>
                </select>
              </div>

              {/* Pagination controls */}
              <div className="inline-flex items-center -space-x-px rounded-lg border border-slate-200 shadow-2xs text-xs font-medium bg-white">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-l-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    currentPage === 1 ? 'bg-[#123b68] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    currentPage === 2 ? 'bg-[#123b68] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(3)}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    currentPage === 3 ? 'bg-[#123b68] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  3
                </button>
                <span className="px-2 py-1.5 text-slate-400">...</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(36)}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    currentPage === 36 ? 'bg-[#123b68] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  36
                </button>
                <button
                  type="button"
                  disabled={currentPage === 36}
                  onClick={() => setCurrentPage((p) => Math.min(36, p + 1))}
                  className="px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 rounded-r-lg transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 7. QUICK TENDER COMPLIANCE ADVISORY NOTE (FOOTER NOTICE) */}
          {/* ======================================================== */}
          <div className="p-3.5 bg-slate-100/70 border border-teal-600/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
              <span>
                <strong className="text-slate-900 font-bold">GeM Portal Statutory Notice:</strong> All listed prices reflect ceiling rates agreed under Swastik Globle CPWD/GeM Rate Contracts. Quantities over 100 units qualify for bulk ministry concession.
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownloadTaxSchedule}
              className="text-teal-800 font-semibold hover:underline shrink-0 text-xs transition-colors cursor-pointer"
            >
              Download Tax Schedule
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS: Product Specs, Bulk Import, Create Procurement   */}
      {/* ======================================================== */}
      <ProductSpecsModal
        isOpen={Boolean(specsProduct)}
        onClose={() => setSpecsProduct(null)}
        product={specsProduct}
        onAddToQuote={handleAddToQuote}
      />

      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImportSuccess={() => {
          addToast({
            title: 'Bulk Import Completed',
            message: 'All items successfully verified and ingested into GeM rate contract registry.',
            type: 'success',
          });
        }}
      />

      <CreateProcurementModal
        isOpen={isPrModalOpen}
        onClose={() => {
          setIsPrModalOpen(false);
          setSearchParams((prev) => {
            const updated = new URLSearchParams(prev);
            updated.delete('new');
            return updated;
          });
        }}
      />
    </div>
  );
};
