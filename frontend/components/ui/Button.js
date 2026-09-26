'use client';

import React from 'react';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}) {
  const baseStyle =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-cyan-500 hover:bg-cyan-600 text-white shadow-[0_4px_14px_rgba(6,182,212,0.18)] focus:ring-cyan-500 border border-cyan-500 hover:border-cyan-600',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-300 border border-slate-200',
    outline:
      'bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 border border-slate-300 hover:border-cyan-300 focus:ring-cyan-200',
    danger:
      'bg-red-50 hover:bg-red-100 text-red-700 focus:ring-red-200 border border-red-200',
    success:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 focus:ring-emerald-200 border border-emerald-200',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </button>
  );
}
