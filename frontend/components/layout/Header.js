'use client';

import React from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../providers/AuthProvider';

export default function Header() {
  const { user } = useAuth();
  const initials = user?.name?.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="h-14 bg-white/85 backdrop-blur-xl border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 font-sans shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets, CVEs, scenarios, controls, or ask AI..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/copilot"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-200 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Copilot</span>
        </Link>

        <button className="relative p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-cyan-700 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400"></span>
        </button>

        <div
          title={user ? `${user.name} · ${user.email}` : 'Signed in user'}
          aria-label={user ? `${user.name}, ${user.email}` : 'Signed in user'}
          className="w-8 h-8 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-xs font-bold text-cyan-700"
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
