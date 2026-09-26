'use client';

import React from 'react';

export default function Card({ children, className = '', title, subtitle, headerAction }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)] backdrop-blur ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
          <div>
            {title && <h3 className="text-sm font-semibold text-slate-900 tracking-wide">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
