import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

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
}) {
  const hasActiveFilters =
    searchTerm !== '' ||
    selectedWard !== 'ALL' ||
    selectedDepartment !== 'ALL' ||
    selectedDoctor !== 'ALL' ||
    selectedStatus !== 'ALL';

  const activeFilterCount = [
    searchTerm !== '',
    selectedWard !== 'ALL',
    selectedDepartment !== 'ALL',
    selectedDoctor !== 'ALL',
    selectedStatus !== 'ALL',
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search patients by name..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end space-x-3 text-xs">
          <span className="font-medium text-slate-500">
            Showing <strong className="text-slate-900 font-semibold">{totalResults}</strong> patient{totalResults === 1 ? '' : 's'}
          </span>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Filter by Ward
          </label>
          <select
            value={selectedWard}
            onChange={(e) => onWardChange(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          >
            <option value="ALL">All Wards</option>
            {wards.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Filter by Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Filter by Doctor
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => onDoctorChange(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          >
            <option value="ALL">All Attending Doctors</option>
            {doctors.map((doc) => (
              <option key={doc} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Admission Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
      </div>
    </div>
  );
}
