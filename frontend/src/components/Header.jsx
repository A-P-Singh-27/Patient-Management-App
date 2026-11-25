import React from 'react';
import { Plus, HeartPulse, Keyboard, Database } from 'lucide-react';

export default function Header({ onOpenNewModal, onOpenShortcuts }) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b-2 border-slate-300 sticky top-0 z-20 shadow-xs">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-5">
        <div className="flex items-center justify-between h-14">
          {/* Left: Brand & ERP System Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs flex-shrink-0">
              <HeartPulse className="w-5 h-5 text-teal-200" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-extrabold text-slate-900 tracking-tight">Dscribe</span>
              <span className="text-slate-300 font-light">|</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider hidden sm:inline-block">
                Inpatient Admission PMS
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1 animate-pulse"></span>
                Active DB
              </span>
            </div>
          </div>

          {/* Right: Date, Shortcuts Helper & New Admission Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              <span className="font-semibold text-slate-800">{currentDate}</span>
            </div>

            {/* Keyboard Shortcuts Trigger */}
            <button
              onClick={onOpenShortcuts}
              title="Keyboard Shortcuts Cheatsheet (Press '?')"
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
            >
              <Keyboard className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span className="hidden sm:inline">Shortcuts</span>
              <kbd className="ml-1.5 px-1.5 py-0.2 bg-white text-slate-700 rounded border border-slate-300 text-[10px] font-mono font-bold">
                ?
              </kbd>
            </button>

            {/* New Admission Action */}
            <button
              onClick={onOpenNewModal}
              title="Register New Inpatient Admission (Press 'N')"
              className="inline-flex items-center px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-xs border border-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>New Admission</span>
              <kbd className="ml-2 hidden sm:inline-block px-1.5 py-0.2 bg-teal-800 text-teal-100 rounded border border-teal-500/50 text-[10px] font-mono font-bold">
                N
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
