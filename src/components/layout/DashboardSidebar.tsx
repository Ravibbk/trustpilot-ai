'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
  FlaskConical,
  Sliders,
  FileSpreadsheet,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { currentUser } = useAuth();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Case Queue', href: '/dashboard/cases', icon: ShieldCheck, badge: '3 Pending' },
    { name: 'Funnel Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'A/B Experiments', href: '/dashboard/experiments', icon: FlaskConical, badge: 'Active' },
    { name: 'Rule Builder', href: '/dashboard/rules', icon: Sliders },
    { name: 'Audit Logs', href: '/dashboard/audit', icon: FileSpreadsheet },
    { name: 'System Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Current Operator Box */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-xs">
            {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-slate-500 font-mono tracking-tight uppercase">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
          Internal Operations
        </div>
        {navigation.map(item => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
                isActive
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 space-y-1">
        <Link
          href="/dashboard/cases/case_10492"
          className="flex items-center justify-between p-2 rounded-md hover:bg-white border border-transparent hover:border-slate-200 transition-all text-[11px] text-slate-700 font-medium"
        >
          <span>Sample Flagged Case (10492)</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </aside>
  );
}

