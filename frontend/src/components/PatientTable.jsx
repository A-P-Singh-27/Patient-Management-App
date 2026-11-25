import React from 'react';
import {
  Edit3,
  Trash2,
  CheckCircle,
  Calendar,
  Building,
  User,
  Stethoscope,
  Clock,
  ArrowRight
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
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent mb-4"></div>
        <p className="text-sm font-semibold text-slate-700">Loading patient records...</p>
        <p className="text-xs text-slate-400 mt-1">Retrieving database state</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const [year, month, day] = dateStr.split('-');
      const d = new Date(year, parseInt(month) - 1, day);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Patient Info</th>
              <th className="py-3.5 px-4">Ward & Department</th>
              <th className="py-3.5 px-4">Attending Doctor</th>
              <th className="py-3.5 px-4">Admission Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {patients.map((patient) => {
              const isAdmitted = patient.status === 'Admitted';
              const initial = patient.name ? patient.name.charAt(0).toUpperCase() : '?';

              return (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50/60 transition-colors duration-100 group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        isAdmitted
                          ? 'bg-teal-100 text-teal-800 border border-teal-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {initial}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{patient.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {patient.age} yrs • {patient.gender} • <span className="text-slate-400">ID #{patient.id}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{patient.ward}</div>
                    <div className="text-[11px] text-teal-700 font-medium flex items-center mt-0.5">
                      <Building className="w-3 h-3 mr-1 text-teal-500" />
                      {patient.department}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center text-slate-700 font-medium">
                      <Stethoscope className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[210px]">{patient.doctor}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
                      <span>{formatDate(patient.admission_date)}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {isAdmitted ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                        Admitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Discharged
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {isAdmitted && (
                        <button
                          onClick={() => onDischargePatient(patient)}
                          title="Mark patient as Discharged"
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 hover:border-emerald-300 transition-colors inline-flex items-center"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          <span>Discharge</span>
                        </button>
                      )}

                      <button
                        onClick={() => onEditPatient(patient)}
                        title="Edit Patient Details"
                        className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg border border-transparent hover:border-teal-200 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenDeleteModal(patient)}
                        title="Delete Patient Record"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
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

      <div className="lg:hidden divide-y divide-slate-100">
        {patients.map((patient) => {
          const isAdmitted = patient.status === 'Admitted';
          const initial = patient.name ? patient.name.charAt(0).toUpperCase() : '?';

          return (
            <div key={patient.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    isAdmitted
                      ? 'bg-teal-100 text-teal-800 border border-teal-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {initial}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{patient.name}</h3>
                    <p className="text-xs text-slate-500">
                      {patient.age} yrs • {patient.gender} • ID #{patient.id}
                    </p>
                  </div>
                </div>

                {isAdmitted ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    Admitted
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Discharged
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Ward & Dept</span>
                  <span className="font-semibold text-slate-800">{patient.ward}</span>
                  <span className="text-teal-700 block text-[11px] font-medium">{patient.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Doctor & Date</span>
                  <span className="font-medium text-slate-800 truncate block">{patient.doctor}</span>
                  <span className="text-slate-500 block text-[11px]">{formatDate(patient.admission_date)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                {isAdmitted && (
                  <button
                    onClick={() => onDischargePatient(patient)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold rounded-lg border border-emerald-200 inline-flex items-center"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Discharge
                  </button>
                )}
                <button
                  onClick={() => onEditPatient(patient)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 inline-flex items-center"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => onOpenDeleteModal(patient)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
