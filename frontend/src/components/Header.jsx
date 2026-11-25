import React from 'react';
import { Plus, Activity, HeartPulse } from 'lucide-react';

export default function Header({ onOpenNewModal }) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dscribe</h1>
                <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-200/60">
                  Hospital Admission System
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Inpatient Admission & Ward Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs text-slate-400 font-medium">Hospital System Time</span>
              <span className="text-xs font-semibold text-slate-700">{currentDate}</span>
            </div>

            <button
              onClick={onOpenNewModal}
              className="inline-flex items-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold rounded-lg shadow-sm shadow-teal-600/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>New Patient Admission</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
