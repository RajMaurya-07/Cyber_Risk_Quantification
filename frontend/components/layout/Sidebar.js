'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingDown,
  GitFork,
  Server,
  ShieldAlert,
  SlidersHorizontal,
  Calculator,
  PieChart,
  Bot,
  FileCheck,
  FileText,
  Database,
  Settings,
  Building2,
  ChevronRight,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Data Sources', href: '/data-sources', icon: LayoutDashboard },
    { label: 'Overview', href: '/dashboard', icon: BarChart3 },
    { label: 'Risk Quantification', href: '/risk', icon: TrendingDown },
    { label: 'Attack Paths', href: '/attack-paths', icon: GitFork },
    { label: 'Assets', href: '/assets', icon: Server },
    { label: 'Vulnerabilities', href: '/vulnerabilities', icon: ShieldAlert },
    { label: 'Controls', href: '/risk/scenarios', icon: SlidersHorizontal },
    { label: 'What-If Simulator', href: '/simulator', icon: Calculator },
    { label: 'Investment Optimizer', href: '/optimizer', icon: PieChart, highlight: true },
    { label: 'AI Copilot', href: '/copilot', icon: Bot, badge: 'AI' },
    { label: 'Compliance', href: '/compliance', icon: FileCheck },
    { label: 'Settings & Security', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 sticky top-0 text-slate-700 font-sans z-30 select-none shadow-sm">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-lg shadow-cyan-200/50 group-hover:scale-105 transition-transform bg-cyan-50">
            <img src="/risknexus_icon.png" className="w-10 h-10 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-slate-900 font-mono">RiskNexus</span>
            </div>
            <p className="text-[11px] text-cyan-600 font-medium tracking-wide uppercase">Risk Intelligence</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Platform Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-sm shadow-cyan-100'
                  : 'text-slate-700 hover:text-cyan-700 hover:bg-cyan-50/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-600' : 'text-slate-500 group-hover:text-cyan-600'
                  }`}
                />
                <span className={item.highlight ? 'font-semibold text-slate-900' : ''}>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <Building2 className="w-4 h-4 text-cyan-600 shrink-0" />
            <div className="truncate">
              <p className="text-[11px] font-semibold text-slate-900 truncate">Enterprise Security</p>
              <p className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active System
              </p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 border border-cyan-200 flex items-center justify-center text-xs font-bold text-cyan-700">
            RM
          </div>
          <div className="truncate flex-1">
            <p className="text-[11px] font-medium text-slate-800 truncate">Raj Maurya</p>
            <p className="text-[10px] text-slate-500 truncate">Chief Risk Officer (CISO)</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
