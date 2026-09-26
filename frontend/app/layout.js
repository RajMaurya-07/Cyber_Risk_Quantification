'use client';

import './globals.css';
import AppLayout from '../components/layout/AppLayout';
import QueryProvider from '../providers/QueryProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full min-h-screen overflow-x-hidden bg-[#F1F6F9] font-sans text-slate-900 antialiased select-none">
        <QueryProvider>
          <AppLayout>{children}</AppLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
