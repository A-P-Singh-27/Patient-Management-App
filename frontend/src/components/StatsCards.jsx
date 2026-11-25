import React from 'react';
import { Users, UserCheck, Activity, Building2 } from 'lucide-react';

export default function StatsCards({ stats, onSelectStatusFilter, currentStatusFilter }) {
  const cards = [
    {
      title: 'Total Patients',
      value: stats?.total_patients ?? 0,
      icon: Users,
      color: 'blue',
      filterValue: 'ALL',
      description: 'Lifetime registered records',
      gradient: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Currently Admitted',
      value: stats?.admitted_patients ?? 0,
      icon: Activity,
      color: 'emerald',
      filterValue: 'Admitted',
      description: 'Patients under active care',
      gradient: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pulse: true,
    },
    {
      title: 'Discharged',
      value: stats?.discharged_patients ?? 0,
      icon: UserCheck,
      color: 'slate',
      filterValue: 'Discharged',
      description: 'Successfully discharged',
      gradient: 'from-slate-600 to-slate-800',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      title: 'Active Departments',
      value: stats?.total_departments ?? 0,
      icon: Building2,
      color: 'violet',
      filterValue: null,
      description: 'Specialty wards assigned',
      gradient: 'from-violet-500 to-purple-600',
      badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isActive = card.filterValue && currentStatusFilter === card.filterValue;

        return (
          <div
            key={idx}
            onClick={() => card.filterValue && onSelectStatusFilter(card.filterValue)}
            className={`bg-white rounded-xl border p-5 shadow-xs transition-all duration-200 ${
              card.filterValue ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''
            } ${isActive ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/20' : 'border-slate-200'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${card.gradient} shadow-xs`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </span>
              {card.pulse && (
                <span className="relative flex h-2.5 w-2.5 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-slate-500 font-medium">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
