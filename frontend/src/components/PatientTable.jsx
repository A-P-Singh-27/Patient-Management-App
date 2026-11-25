import React, { useEffect, useRef } from 'react';
import {
  Edit3,
  Trash2,
  CheckCircle,
  Calendar,
  Building,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';

export default function PatientTable({
  patients = [],
  onEditPatient,
  onOpenDeleteModal,
  onDischargePatient,
  isLoading = false,
  selectedIndex = 0,
  onSelectIndex,
}) {
  const selectedRowRef = useRef(null);

  // Auto-scroll the active keyboard-selected row into view if needed
  useEffect(() => {
    if (selectedRowRef.current) {
      selectedRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border-2 border-slate-300 overflow-hidden shadow-2xs p-10 text-center">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-4 border-teal-600 border-t-transparent mb-3"></div>
        <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Loading Clinical Records...</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Synchronizing persistent database state</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const [year, month, day] = dateStr.split('-');
      // Format as DD/MM/YYYY (Indian standard convention)
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-slate-300 shadow-2xs overflow-hidden">
      {/* 
        DESKTOP & TABLET VIEW (md:block and up):
        Rows and columns table layout shared identically across Tablet & Laptop.
      */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-300 text-[11px] font-bold uppercase tracking-wider text-slate-800">
              <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center">#</th>
              <th className="py-2.5 px-3.5 border-r border-slate-200">Patient Demographics</th>
              <th className="py-2.5 px-3.5 border-r border-slate-200">Ward & Department</th>
              <th className="py-2.5 px-3.5 border-r border-slate-200">Attending Physician</th>
              <th className="py-2.5 px-3.5 border-r border-slate-200 whitespace-nowrap">Admission Date</th>
              <th className="py-2.5 px-3.5 border-r border-slate-200">Status</th>
              <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Clinical Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-200 text-xs">
            {patients.map((patient, index) => {
              const isAdmitted = patient.status === 'Admitted';
              const isSelected = selectedIndex === index;
              const initial = patient.name ? patient.name.charAt(0).toUpperCase() : '?';

              return (
                <tr
                  key={patient.id}
                  ref={isSelected ? selectedRowRef : null}
                  onClick={() => onSelectIndex && onSelectIndex(index)}
                  onDoubleClick={() => onEditPatient(patient)}
                  className={`transition-colors duration-100 cursor-pointer select-none group border-b border-slate-200 ${
                    isSelected
                      ? 'bg-teal-50/90 ring-2 ring-inset ring-teal-500 font-semibold'
                      : 'even:bg-slate-50/80 hover:bg-slate-100/80'
                  }`}
                >
                  {/* Row Indicator & ID */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center text-[11px] font-mono font-bold text-slate-600">
                    {isSelected ? (
                      <span className="inline-block text-teal-700 font-black animate-pulse">▶</span>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </td>

                  {/* Patient Info */}
                  <td className="py-2.5 px-3.5 border-r border-slate-200">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                        isAdmitted
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'bg-slate-300 text-slate-700'
                      }`}>
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm truncate leading-tight">
                          {patient.name}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 mt-0.5">
                          <span>{patient.age}y</span>
                          <span>•</span>
                          <span>{patient.gender}</span>
                          <span className="bg-slate-200 text-slate-800 px-1 py-0.2 rounded font-mono font-bold text-[10px] border border-slate-300">
                            #{patient.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Ward & Department */}
                  <td className="py-2.5 px-3.5 border-r border-slate-200">
                    <div className="font-bold text-slate-900 text-xs">{patient.ward}</div>
                    <div className="text-[11px] text-teal-800 font-semibold flex items-center mt-0.5">
                      <Building className="w-3 h-3 mr-1 text-teal-600 flex-shrink-0" />
                      <span className="truncate">{patient.department}</span>
                    </div>
                  </td>

                  {/* Doctor */}
                  <td className="py-2.5 px-3.5 border-r border-slate-200">
                    <div className="flex items-center text-slate-900 font-medium text-xs">
                      <Stethoscope className="w-3.5 h-3.5 mr-1.5 text-teal-600 flex-shrink-0" />
                      <span className="truncate max-w-[200px] font-semibold">{patient.doctor}</span>
                    </div>
                  </td>

                  {/* Admission Date */}
                  <td className="py-2.5 px-3.5 border-r border-slate-200 whitespace-nowrap">
                    <div className="flex items-center text-slate-800 font-mono font-semibold text-xs">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-500 flex-shrink-0" />
                      <span>{formatDate(patient.admission_date)}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3.5 border-r border-slate-200 whitespace-nowrap">
                    {isAdmitted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-400 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span>
                        Admitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800 border border-slate-400">
                        <CheckCircle className="w-3 h-3 mr-1 text-slate-600" />
                        Discharged
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      {isAdmitted && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDischargePatient(patient);
                          }}
                          title="Discharge Patient (Press 'D')"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold border border-emerald-700 shadow-2xs transition-colors inline-flex items-center"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span>Discharge</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPatient(patient);
                        }}
                        title="Edit Details (Press 'Enter')"
                        className="p-1 text-slate-700 hover:text-teal-900 hover:bg-teal-100 rounded border border-slate-300 hover:border-teal-400 bg-white transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDeleteModal(patient);
                        }}
                        title="Delete Record (Press 'Del')"
                        className="p-1 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded border border-rose-300 hover:border-rose-400 bg-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 
        MOBILE VIEW (md:hidden):
        Compact, professional ERP card cards for mobile screens (< 768px).
      */}
      <div className="md:hidden bg-slate-100 p-2.5 space-y-2">
        {patients.map((patient, index) => {
          const isAdmitted = patient.status === 'Admitted';
          const isSelected = selectedIndex === index;
          const initial = patient.name ? patient.name.charAt(0).toUpperCase() : '?';

          return (
            <div
              key={patient.id}
              ref={isSelected ? selectedRowRef : null}
              onClick={() => onSelectIndex && onSelectIndex(index)}
              className={`bg-white rounded-lg border-2 p-3 space-y-2.5 transition-all select-none ${
                isAdmitted ? 'border-l-4 border-l-teal-600' : 'border-l-4 border-l-slate-400'
              } ${
                isSelected ? 'border-teal-500 ring-2 ring-teal-500 bg-teal-50/50' : 'border-slate-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                    isAdmitted ? 'bg-teal-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}>
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-xs truncate leading-snug">{patient.name}</h3>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      {patient.age}y • {patient.gender} • <span className="font-mono text-slate-700">#{patient.id}</span>
                    </p>
                  </div>
                </div>

                <div>
                  {isAdmitted ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-400">
                      Admitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 border border-slate-400">
                      Discharged
                    </span>
                  )}
                </div>
              </div>

              {/* Clinical Details */}
              <div className="bg-slate-50 border border-slate-200 rounded p-2 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Ward & Dept</span>
                  <span className="font-bold text-slate-900 block truncate">{patient.ward}</span>
                  <span className="text-teal-800 font-semibold block truncate">{patient.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Doctor & Date</span>
                  <span className="font-semibold text-slate-900 block truncate">{patient.doctor}</span>
                  <span className="font-mono font-medium text-slate-600 block">{formatDate(patient.admission_date)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-1.5 pt-1 border-t border-slate-200">
                {isAdmitted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDischargePatient(patient);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded border border-emerald-700 inline-flex items-center"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Discharge
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPatient(patient);
                  }}
                  className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded border border-slate-300 inline-flex items-center"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDeleteModal(patient);
                  }}
                  className="p-1 text-rose-700 bg-rose-50 rounded border border-rose-300 inline-flex items-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
