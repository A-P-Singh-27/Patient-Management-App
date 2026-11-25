import React from 'react';
import { Search, X, RotateCcw, Filter } from 'lucide-react';

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  selectedWard,
  onWardChange,
  selectedDepartment,
  onDepartmentChange,
  selectedDoctor,
  onDoctorChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  wards = [],
  departments = [],
  doctors = [],
  totalResults = 0,
  searchRef,
  wardRef,
  deptRef,
}) {
  const hasActiveFilters =
    searchTerm !== '' ||
    selectedWard !== 'ALL' ||
    selectedDepartment !== 'ALL' ||
    selectedDoctor !== 'ALL' ||
    selectedStatus !== 'ALL';

  const activeCount = [
    searchTerm !== '',
    selectedWard !== 'ALL',
    selectedDepartment !== 'ALL',
    selectedDoctor !== 'ALL',
    selectedStatus !== 'ALL',
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg border-2 border-slate-300 p-2.5 sm:p-3 mb-3 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">
        {/* Search Bar with Keyboard Shortcut Hint */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            ref={searchRef}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search patient name... (Press 'S', Navigate with ↑/↓)"
            className="w-full pl-8 pr-16 py-1.5 text-xs bg-slate-50 border-2 border-slate-300 rounded-md text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-teal-500 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-1">
            {searchTerm ? (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-slate-400 hover:text-slate-700"
                title="Clear Search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] bg-slate-200 text-slate-700 rounded border border-slate-300 font-mono font-bold">
                S
              </kbd>
            )}
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
          {/* Ward Selector */}
          <div className="relative">
            <select
              ref={wardRef}
              value={selectedWard}
              onChange={(e) => onWardChange(e.target.value)}
              className="w-full py-1.5 pl-2 pr-6 text-xs bg-slate-50 border-2 border-slate-300 rounded-md text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            >
              <option value="ALL">All Wards (W)</option>
              {wards.map((ward) => (
                <option key={ward} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
          </div>

          {/* Department Selector */}
          <div className="relative">
            <select
              ref={deptRef}
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full py-1.5 pl-2 pr-6 text-xs bg-slate-50 border-2 border-slate-300 rounded-md text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            >
              <option value="ALL">All Depts (P)</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selector */}
          <div className="relative">
            <select
              value={selectedDoctor}
              onChange={(e) => onDoctorChange(e.target.value)}
              className="w-full py-1.5 pl-2 pr-6 text-xs bg-slate-50 border-2 border-slate-300 rounded-md text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white truncate"
            >
              <option value="ALL">All Doctors</option>
              {doctors.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full py-1.5 pl-2 pr-6 text-xs bg-slate-50 border-2 border-slate-300 rounded-md text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Admitted">Admitted</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>
        </div>

        {/* Counter & Reset Action */}
        <div className="flex items-center justify-between sm:justify-end space-x-2 pt-1 lg:pt-0">
          <div className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-700 whitespace-nowrap">
            <span>{totalResults} Patient{totalResults === 1 ? '' : 's'}</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Reset All Filters (Press 'R')"
              className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-300 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Reset</span>
              <kbd className="ml-1 px-1 py-0.2 bg-white text-rose-800 rounded border border-rose-200 text-[9px] font-mono">
                R
              </kbd>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
