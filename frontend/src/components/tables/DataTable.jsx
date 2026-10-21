import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from 'lucide-react';
import { Pagination } from './Pagination';
import { EmptyState } from '../common/EmptyState';

export const DataTable = ({
  columns = [],
  data = [],
  searchKeys = [],
  searchPlaceholder = 'Search records...',
  filterOptions = [], // e.g. [{ key: 'status', label: 'All Statuses', options: ['Active', 'Pending', ...] }]
  pageSize = 8,
  onRowClick,
  headerAction,
  emptyTitle = 'No data available',
  emptyDescription = 'Try adjusting your search terms or filters.',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Handle Sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and Search logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Filter by dropdowns
    Object.keys(activeFilters).forEach((filterKey) => {
      const val = activeFilters[filterKey];
      if (val && val !== 'ALL') {
        result = result.filter((item) => {
          const itemVal = item[filterKey];
          return String(itemVal).toLowerCase() === String(val).toLowerCase();
        });
      }
    });

    // Search query
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter((item) => {
        if (searchKeys.length > 0) {
          return searchKeys.some((k) => {
            const val = item[k];
            return val && String(val).toLowerCase().includes(query);
          });
        }
        // Fallback: search all values
        return Object.values(item).some(
          (v) => v && String(v).toLowerCase().includes(query)
        );
      });
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, activeFilters, sortConfig]);

  // Pagination calculation
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Reset page when search or filters change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, val) => {
    setActiveFilters((prev) => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== '' || Object.values(activeFilters).some((v) => v && v !== 'ALL');

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Top Toolbar: Search + Filters + Actions */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dynamic Dropdown Filters */}
          {filterOptions.map((filter) => (
            <div key={filter.key} className="relative">
              <select
                value={activeFilters[filter.key] || 'ALL'}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="h-9 text-xs rounded-lg bg-white border border-slate-300 pl-3 pr-8 text-slate-700 font-medium focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20 cursor-pointer appearance-none"
              >
                <option value="ALL">{filter.label || `All ${filter.key}`}</option>
                {filter.options.map((opt) => {
                  const optVal = typeof opt === 'object' ? opt.value : opt;
                  const optLabel = typeof opt === 'object' ? opt.label : opt;
                  return (
                    <option key={optVal} value={optVal}>
                      {optLabel}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      {/* Table Canvas */}
      <div className="overflow-x-auto min-h-[220px]">
        {paginatedData.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px] select-none">
                {columns.map((col, index) => {
                  const isSorted = sortConfig.key === (col.accessor || col.sortKey);
                  const isRight = col.align === 'right';
                  const isCenter = col.align === 'center';

                  return (
                    <th
                      key={index}
                      style={col.width ? { width: col.width } : {}}
                      className={`py-3 px-4 ${
                        isRight ? 'text-right' : isCenter ? 'text-center' : 'text-left'
                      } ${col.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''}`}
                      onClick={() => col.sortable && handleSort(col.accessor || col.sortKey)}
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 ${
                          isRight ? 'justify-end' : isCenter ? 'justify-center' : 'justify-start'
                        }`}
                      >
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-slate-400">
                            {isSorted ? (
                              sortConfig.direction === 'asc' ? (
                                <ArrowUp className="w-3 h-3 text-teal-700" />
                              ) : (
                                <ArrowDown className="w-3 h-3 text-teal-700" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-slate-50/80 active:bg-slate-100/60' : 'hover:bg-slate-50/40'
                  }`}
                >
                  {columns.map((col, colIndex) => {
                    const isRight = col.align === 'right';
                    const isCenter = col.align === 'center';
                    const cellValue = col.accessor ? row[col.accessor] : null;

                    return (
                      <td
                        key={colIndex}
                        className={`py-3 px-4 ${
                          isRight ? 'text-right' : isCenter ? 'text-center' : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(row, rowIndex) : cellValue ?? '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
