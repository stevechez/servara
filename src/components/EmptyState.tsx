'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] bg-slate-50/50 dark:bg-[#0B0E14]/50 animate-in fade-in duration-500">
      
      {/* Icon Wrapper with soft glow */}
      <div className="w-16 h-16 mb-4 rounded-2xl bg-white dark:bg-[#12161D] shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500">
        {icon}
      </div>
      
      {/* Text block */}
      <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1 tracking-tight">
        {title}
      </h3>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-[250px] mb-6 leading-relaxed">
        {description}
      </p>

      {/* Optional Action Button */}
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-5 py-2.5 bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}