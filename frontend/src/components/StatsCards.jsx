import React from 'react';
import { Users, UserCheck, Activity, Building2 } from 'lucide-react';

export default function StatsCards({ stats, onSelectStatusFilter, currentStatusFilter }) {
  const items = [
    {
      title: 'Total Inpatients',
      value: stats?.total_patients ?? 0,
      icon: Users,
      filterValue: 'ALL',
      activeBorder: 'border-blue-500 bg-blue-50/50 text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Currently Admitted',
      value: stats?.admitted_patients ?? 0,
      icon: Activity,
      filterValue: 'Admitted',
      activeBorder: 'border-emerald-600 bg-emerald-50/60 text-emerald-950',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      iconColor: 'text-emerald-600',
      pulse: true,
    },
    {
      title: 'Discharged Records',
      value: stats?.discharged_patients ?? 0,
      icon: UserCheck,
      filterValue: 'Discharged',
      activeBorder: 'border-slate-600 bg-slate-100 text-slate-900',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
      iconColor: 'text-slate-600',
    },
    {
      title: 'Active Departments',
      value: stats?.total_departments ?? 0,
      icon: Building2,
      filterValue: null,
      activeBorder: '',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-3">
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = item.filterValue && currentStatusFilter === item.filterValue;

        return (
          <div
            key={idx}
            onClick={() => item.filterValue && onSelectStatusFilter(item.filterValue)}
            title={item.filterValue ? `Filter by ${item.title}` : undefined}
            className={`bg-white rounded-lg border-2 p-2.5 sm:p-3 shadow-2xs transition-all select-none ${
              item.filterValue
                ? 'cursor-pointer hover:border-slate-400 active:scale-[0.99]'
                : ''
            } ${
              isActive
                ? `${item.activeBorder} ring-2 ring-teal-500 shadow-xs`
                : 'border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider truncate">
                {item.title}
              </span>
              <Icon className={`w-4 h-4 ${item.iconColor} flex-shrink-0`} />
            </div>

            <div className="mt-1 flex items-baseline justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                  {item.value}
                </span>
                {item.pulse && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                )}
              </div>

              {item.filterValue && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                  isActive ? 'bg-teal-600 text-white border-teal-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}>
                  {isActive ? 'Active' : 'Filter'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
