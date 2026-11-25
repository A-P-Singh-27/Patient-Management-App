import React from 'react';
import { X, Keyboard, Command, CornerDownLeft, ArrowDown, ArrowUp, Search, Plus, Trash2, CheckCircle, RotateCcw } from 'lucide-react';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Navigation & Selection',
      items: [
        { key: '↓ / ↑', desc: 'Navigate patient rows up / down' },
        { key: 'J / K', desc: 'Vim-style row navigation' },
        { key: 'Enter', desc: 'Edit / View selected patient details' },
      ],
    },
    {
      category: 'Patient Actions',
      items: [
        { key: 'N', desc: 'Open New Patient Admission modal' },
        { key: 'D', desc: 'Mark selected admitted patient as Discharged' },
        { key: 'Del / Backspace', desc: 'Delete selected patient record' },
      ],
    },
    {
      category: 'Search & Filtering',
      items: [
        { key: 'S  or  /', desc: 'Quick-focus search bar' },
        { key: 'W', desc: 'Jump to Ward filter' },
        { key: 'P', desc: 'Jump to Department filter' },
        { key: 'R', desc: 'Reset all active filters' },
      ],
    },
    {
      category: 'General & Windows',
      items: [
        { key: '?', desc: 'Toggle this keyboard shortcuts cheatsheet' },
        { key: 'Esc', desc: 'Close modals / Clear search / Unfocus' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border-2 border-slate-300 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg border border-teal-500/30">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Dscribe ERP — Keyboard Shortcuts</h3>
              <p className="text-[11px] text-slate-400">Power-user navigation & clinical controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[75vh] overflow-y-auto text-xs">
          {shortcuts.map((group, gIdx) => (
            <div key={gIdx} className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mr-1.5"></span>
                {group.category}
              </h4>
              <div className="space-y-2 divide-y divide-slate-200/60 pt-1">
                {group.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center justify-between pt-1.5 first:pt-0">
                    <span className="text-slate-600 font-medium">{item.desc}</span>
                    <kbd className="px-2 py-0.5 bg-white text-slate-900 border border-slate-300 rounded font-mono font-bold text-[11px] shadow-2xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">Esc</kbd> anytime to dismiss active dialogs.</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
