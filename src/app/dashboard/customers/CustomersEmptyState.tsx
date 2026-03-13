'use client';

import { Users, UserPlus, Database, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-slate-200 bg-white px-6 py-24 text-center dark:border-white/10 dark:bg-[#12161D]">
      {/* Visual Metaphor: The "Organized Stack" */}
      <div className="relative mb-8 h-20 w-20">
        <motion.div
          initial={{ rotate: -10, x: -10 }}
          animate={{ rotate: -5, x: -5 }}
          className="absolute inset-0 rounded-3xl bg-slate-100 dark:bg-white/5"
        />
        <motion.div
          initial={{ rotate: 10, x: 10 }}
          animate={{ rotate: 5, x: 5 }}
          className="absolute inset-0 rounded-3xl bg-slate-200 dark:bg-white/10"
        />
        <div className="relative flex h-full w-full items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-600/30">
          <Users size={32} />
        </div>
      </div>

      <h2 className="max-w-xs text-2xl font-black tracking-tight text-slate-900 dark:text-white">
        Build Your Customer Database
      </h2>
      <p className="mt-4 max-w-sm text-sm leading-relaxed font-medium text-slate-500">
        Every lead you convert and every job you book starts here. Add your first customer to begin
        tracking their history, jobs, and invoices.
      </p>

      {/* Action Area */}
      <div className="mt-10 flex w-full max-w-sm flex-col items-center gap-6">
        <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-[10px] font-black tracking-widest text-white transition-all hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white">
          <UserPlus size={16} />
          ADD YOUR FIRST CUSTOMER
        </button>

        <div className="grid w-full grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-4 dark:border-white/5">
            <Database size={16} className="text-blue-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase">Secure CRM</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-4 dark:border-white/5">
            <Search size={16} className="text-blue-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase">Smart Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
