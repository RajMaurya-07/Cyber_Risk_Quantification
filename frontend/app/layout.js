'use client';

import './globals.css';
import AppLayout from '../components/layout/AppLayout';
import AuthProvider from '../providers/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="h-full min-h-screen overflow-x-hidden bg-[#F1F6F9] font-sans text-slate-900 antialiased select-none">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
