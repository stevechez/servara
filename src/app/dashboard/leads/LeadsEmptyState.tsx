'use client';

import { Zap, Plus, MousePointerClick } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeadsEmptyState() {
  return (
    <div className="relative">
      {/* 1. GHOST PIPELINE (Background Decor) */}
      <div className="pointer-events-none grid grid-cols-1 gap-6 opacity-[0.03] select-none md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="h-4 w-24 rounded bg-slate-900" />
            <div className="h-32 rounded-[2rem] border-4 border-dashed border-slate-900" />
            <div className="h-32 rounded-[2rem] border-4 border-dashed border-slate-900" />
          </div>
        ))}
      </div>

      {/* 2. THE ACTION CARD (Centered Over the Ghost UI) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex max-w-sm flex-col items-center rounded-[3rem] border border-slate-200 bg-white p-10 text-center shadow-2xl dark:border-white/5 dark:bg-[#12161D]"
        >
          <div className="mb-6 rounded-3xl bg-blue-600 p-5 text-white shadow-lg shadow-blue-600/30">
            <Zap size={32} fill="currentColor" />
          </div>

          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Your Pipeline is Ready
          </h2>
          <p className="mt-3 text-sm leading-relaxed font-medium text-slate-500">
            This is where you'll track new inquiries, send quotes, and win more jobs.
          </p>

          <div className="mt-8 w-full space-y-3">
            <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-[10px] font-black tracking-widest text-white transition-all hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white">
              <Plus size={14} />
              CREATE FIRST LEAD
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-tighter text-slate-400 uppercase">
              <MousePointerClick size={12} />
              Or connect your website to sync automatically
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
