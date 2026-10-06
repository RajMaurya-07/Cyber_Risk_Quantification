'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import RiskProvider from '../../providers/RiskProvider';
import apiClient from '../../lib/api/client';

function DataSourceGate({ children }) {
  const [status, setStatus] = useState({ state: 'loading', message: '' });

  const checkDataSource = useCallback(async () => {
    setStatus({ state: 'loading', message: '' });
    try {
      const result = await apiClient.get('/data-sources/status');
      setStatus({
        state: result.calculations_enabled ? 'ready' : 'required',
        message: '',
      });
    } catch (error) {
      setStatus({ state: 'error', message: error.message });
    }
  }, []);

  useEffect(() => {
    checkDataSource();
  }, [checkDataSource]);

  if (status.state === 'ready') {
    return <RiskProvider>{children}</RiskProvider>;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cyan-50 text-cyan-700">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4.5 6v5.2c0 4.4 3.1 8.4 7.5 9.8 4.4-1.4 7.5-5.4 7.5-9.8V6L12 3Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <h1 className="mt-5 text-xl font-semibold text-slate-900">
          {status.state === 'loading'
            ? 'Checking your data source'
            : status.state === 'error'
              ? 'Unable to check your data source'
              : 'Upload your data to get started'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {status.state === 'loading'
            ? 'Risk calculations will remain unavailable until a customer data source is active.'
            : status.state === 'error'
              ? status.message
              : 'RiskNexus will not display sample-data calculations. Upload your organization’s dataset in Data Sources to unlock risk analysis, dashboards, and optimization.'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {status.state === 'error' ? (
            <button
              type="button"
              onClick={checkDataSource}
              className="rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              Retry
            </button>
          ) : status.state !== 'loading' ? (
            <Link
              href="/data-sources"
              className="rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              Go to Data Sources
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isAuthPage = pathname === '/signup' || pathname === '/login';
  const isDataSourcesPage = pathname === '/data-sources';

  if (isHomePage) {
    return <div className="min-h-screen bg-white font-sans text-slate-900">{children}</div>;
  }

  if (isAuthPage) {
    return children;
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <Header />
        <main className="flex-1 overflow-y-auto bg-white">
          {isDataSourcesPage ? children : <DataSourceGate>{children}</DataSourceGate>}
        </main>
      </div>
    </div>
  );
}
