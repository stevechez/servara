'use client';

import { useState } from 'react';
import { UserPlus, X, Loader2, CheckCircle2 } from 'lucide-react';

export default function NewCustomerSlideover() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <>
      {/* THE TRIGGER BUTTON (This lives in the grid) */}
      <button
        onClick={() => setIsOpen(true)}
        className="shadow-soft group flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-500 dark:border-white/5 dark:bg-[#12161D]"
      >
        <div className="rounded-2xl bg-blue-600 p-3 text-white">
          <UserPlus size={20} />
        </div>
        <span className="font-black tracking-tight text-slate-900 uppercase dark:text-white">
          Add Customer
        </span>
      </button>

      {/* THE SLIDEOVER PANEL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden bg-slate-900/20 backdrop-blur-sm">
          <div className="animate-in slide-in-from-right h-full w-full max-w-md bg-white shadow-2xl dark:bg-[#0B0E14]">
            <div className="flex h-20 items-center justify-between border-b border-slate-100 px-8 dark:border-white/5">
              <h2 className="text-xl font-black uppercase italic dark:text-white">New Customer</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form className="space-y-6 p-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Smith"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/5 dark:bg-[#12161D] dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="(555) 000-0000"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/5 dark:bg-[#12161D] dark:text-white"
                />
              </div>

              <button
                type="button"
                className="w-full rounded-2xl bg-blue-600 py-4 font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700"
              >
                SAVE CUSTOMER
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
