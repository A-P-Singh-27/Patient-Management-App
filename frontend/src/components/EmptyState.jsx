import React from 'react';
import { UserX, RotateCcw, Plus } from 'lucide-react';

export default function EmptyState({ hasActiveFilters, onResetFilters, onOpenNewModal }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
      <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        <UserX className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">No Patient Records Found</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 mb-6">
        {hasActiveFilters
          ? 'No admissions match your active search terms or filter criteria. Try resetting filters to see all patients.'
          : 'There are currently no patients registered in the hospital database. Add a new admission to begin.'}
      </p>

      <div className="flex items-center justify-center space-x-3">
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Reset All Filters
          </button>
        )}
        <button
          onClick={onOpenNewModal}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Patient Admission
        </button>
      </div>
    </div>
  );
}
