'use client';

import { Plus, ListPlus, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CatalogEmptyState() {
  return (
    <div className="relative overflow-hidden rounded-[3rem] border border-dashed border-slate-200 bg-slate-50/50 px-6 py-20 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-lg text-center">
        {/* Animated Icon Group */}
        <div className="relative mx-auto mb-8 h-24 w-24">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="flex h-full w-full items-center justify-center rounded-[2.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/40"
          >
            <ListPlus size={40} />
          </motion.div>
          <div className="absolute -top-2 -right-2 rounded-xl bg-emerald-500 p-2 text-white shadow-lg">
            <ShieldCheck size={16} />
          </div>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Create Your First Service
        </h2>
        <p className="mt-4 text-sm leading-relaxed font-medium text-slate-500">
          Standardizing your services makes quoting 10x faster. Add your common jobs, set your base
          price, and let Zidro Pro handle the math.
        </p>

        {/* Action Button */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <button className="flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-[10px] font-black tracking-widest text-white transition-all hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white">
            <Plus size={16} />
            ADD YOUR FIRST SERVICE
          </button>

          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              <Zap size={12} className="text-blue-500" /> Professional Quotes
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              <Zap size={12} className="text-blue-500" /> Instant Pricing
            </div>
          </div>
        </div>
      </div>

      {/* Background Ghost Cards */}
      <div className="absolute -bottom-10 -left-10 h-64 w-64 rotate-12 rounded-[3rem] border-4 border-dashed border-slate-200/50 dark:border-white/5" />
      <div className="absolute top-10 -right-20 h-64 w-64 -rotate-12 rounded-[3rem] border-4 border-dashed border-slate-200/50 dark:border-white/5" />
    </div>
  );
}
