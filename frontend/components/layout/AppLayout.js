'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import RiskProvider from '../../providers/RiskProvider';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return (
      <RiskProvider>
        <div className="min-h-screen bg-white text-slate-900 font-sans">
          {children}
        </div>
      </RiskProvider>
    );
  }

  return (
    <RiskProvider>
      <div className="flex min-h-screen bg-white text-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <Header />
          <main className="flex-1 overflow-y-auto bg-white">
            {children}
          </main>
        </div>
      </div>
    </RiskProvider>
  );
}
