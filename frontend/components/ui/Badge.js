'use client';

import React from 'react';

export default function Badge({ children, variant = 'info', className = '' }) {
  const variantStyles = {
    critical: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    info: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  const style = variantStyles[variant] || variantStyles.info;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${style} ${className}`}
    >
      {children}
    </span>
  );
}
