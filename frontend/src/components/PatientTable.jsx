import React from 'react';
import {
  Edit3,
  Trash2,
  CheckCircle,
  Calendar,
  Building,
  Stethoscope,
} from 'lucide-react';

export default function PatientTable({
  patients = [],
  onEditPatient,
  onOpenDeleteModal,
  onDischargePatient,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border-2 border-slate-300 overflow-hidden shadow-xs p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-600 border-t-transparent mb-4"></div>
        <p className="text-sm font-bold text-slate-800">Loading patient records...</p>
        <p className="text-xs text-slate-500 mt-1">Retrieving database state</p>
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
    <div className="bg-white rounded-xl border-2 border-slate-300 shadow-sm overflow-hidden">
      {/* Desktop & Wide Screens: High-Contrast Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-300 text-[11px] font-bold uppercase tracking-wider text-slate-800">
              <th className="py-4 px-4 border-r border-slate-200">Patient Info</th>
              <th className="py-4 px-4 border-r border-slate-200">Ward & Department</th>
              <th className="py-4 px-4 border-r border-slate-200">Attending Doctor</th>
              <th className="py-4 px-4 border-r border-slate-200">Admission Date</th>
              <th className="py-4 px-4 border-r border-slate-200">Status</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-200 text-xs">
            {patients.map((patient) => {
              const isAdmitted = patient.status === 'Admitted';
              const initial = patient.name ? patient.name.charAt(0).toUpperCase() : '?';

              return (
                <tr
                  key={patient.id}
                  className="even:bg-slate-50/70 hover:bg-teal-50/60 transition-colors duration-150 group border-b border-slate-200"
                >
                  {/* Patient Info */}
                  <td className="py-4 px-4 border-r border-slate-200/80">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        isAdmitted
                          ? 'bg-teal-600 text-white shadow-xs ring-2 ring-teal-200'
                          : 'bg-slate-200 text-slate-700 ring-2 ring-slate-300'
                      }`}>
                        {initial}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{patient.name}</div>
                        <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-0.5">
                          <span>{patient.age} yrs</span>
                          <span>•</span>
                          <span>{patient.gender}</span>
                          <span className="bg-slate-200/90 text-slate-800 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold border border-slate-300">
                            ID #{patient.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Ward & Department */}
                  <td className="py-4 px-4 border-r border-slate-200/80">
                    <div className="font-bold text-slate-900 text-sm">{patient.ward}</div>
                    <div className="text-xs text-teal-800 font-semibold flex items-center mt-1">
                      <Building className="w-3.5 h-3.5 mr-1 text-teal-600 flex-shrink-0" />
                      {patient.department}
                    </div>
                  </td>

                  {/* Attending Doctor */}
                  <td className="py-4 px-4 border-r border-slate-200/80">
                    <div className="flex items-center text-slate-900 font-medium">
                      <Stethoscope className="w-4 h-4 mr-2 text-teal-600 flex-shrink-0" />
                      <span className="truncate max-w-[210px] font-semibold">{patient.doctor}</span>
                    </div>
                  </td>

                  {/* Admission Date */}
                  <td className="py-4 px-4 border-r border-slate-200/80">
                    <div className="flex items-center text-slate-800 font-mono font-semibold">
                      <Calendar className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0" />
                      <span>{formatDate(patient.admission_date)}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 border-r border-slate-200/80">
                    {isAdmitted ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border-2 border-emerald-400 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span>
                        Admitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border-2 border-slate-400">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                        Discharged
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {isAdmitted && (
                        <button
                          onClick={() => onDischargePatient(patient)}
                          title="Mark patient as Discharged"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold border border-emerald-700 shadow-xs transition-colors inline-flex items-center"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1 text-white" />
                          <span>Discharge</span>
                        </button>
                      )}

                      <button
                        onClick={() => onEditPatient(patient)}
                        title="Edit Patient Details"
                        className="p-1.5 text-slate-700 hover:text-teal-900 hover:bg-teal-100 rounded-lg border-2 border-slate-300 hover:border-teal-500 bg-white transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenDeleteModal(patient)}
                        title="Delete Patient Record"
                        className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded-lg border-2 border-rose-300 hover:border-rose-500 bg-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Small Screens (Tablets & Mobile): Distinct, High-Contrast Cards */}
      <div className="lg:hidden bg-slate-100/80 p-3.5 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patients.map((patient) => {
            const isAdmitted = patient.status === 'Admitted';
            const initial = patient.name ? patient.name.charAt(0).toUpperCase() : '?';

            return (
              <div
                key={patient.id}
                className={`bg-white rounded-xl border-2 border-slate-300 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 space-y-3.5 ${
                  isAdmitted
                    ? 'border-l-[6px] border-l-teal-600'
                    : 'border-l-[6px] border-l-slate-400'
                }`}
              >
                {/* Header: Avatar, Name, and Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                      isAdmitted
                        ? 'bg-teal-600 text-white shadow-xs ring-2 ring-teal-200'
                        : 'bg-slate-200 text-slate-700 ring-2 ring-slate-300'
                    }`}>
                      {initial}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{patient.name}</h3>
                      <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-700 font-semibold mt-0.5">
                        <span>{patient.age} yrs</span>
                        <span>•</span>
                        <span>{patient.gender}</span>
                        <span className="bg-slate-200/90 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold text-[10px] border border-slate-300">
                          ID #{patient.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isAdmitted ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border-2 border-emerald-400 shadow-xs flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span>
                        Admitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border-2 border-slate-400 flex-shrink-0">
                        Discharged
                      </span>
                    )}
                  </div>
                </div>

                {/* Patient Clinical Info Block */}
                <div className="bg-slate-50 border-2 border-slate-200/90 rounded-lg p-3 space-y-2.5 text-xs">
                  <div className="flex items-start space-x-2.5">
                    <Building className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Ward & Department</span>
                      <span className="font-bold text-slate-900 text-xs block">{patient.ward}</span>
                      <span className="text-teal-800 font-semibold text-xs block mt-0.5">{patient.department}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 pt-2 border-t border-slate-200">
                    <Stethoscope className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Attending Doctor</span>
                      <span className="font-semibold text-slate-900 text-xs block truncate">{patient.doctor}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 pt-2 border-t border-slate-200">
                    <Calendar className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Admitted:</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">{formatDate(patient.admission_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                  {isAdmitted && (
                    <button
                      onClick={() => onDischargePatient(patient)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg border border-emerald-700 shadow-xs inline-flex items-center active:scale-95 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                      Discharge
                    </button>
                  )}
                  <button
                    onClick={() => onEditPatient(patient)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border-2 border-slate-300 inline-flex items-center active:scale-95 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => onOpenDeleteModal(patient)}
                    className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-lg border-2 border-rose-300 bg-rose-50 inline-flex items-center active:scale-95 transition-all"
                    title="Delete Patient Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
