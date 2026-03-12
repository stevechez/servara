'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, ArrowRight, Download, Share2 } from 'lucide-react';

export default function PaymentSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-[#050608]">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 text-center shadow-2xl dark:border-white/5 dark:bg-[#12161D]"
        >
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 bg-emerald-500/10 blur-[80px]" />

          <div className="relative z-10">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 size={44} className="text-emerald-500" strokeWidth={2.5} />
            </div>

            <h1 className="mb-2 text-3xl font-black tracking-tight italic dark:text-white">
              Payment Received
            </h1>
            <p className="mb-8 text-sm font-bold tracking-widest text-slate-500 uppercase">
              Transaction Successful
            </p>

            <div className="mb-8 rounded-3xl border border-slate-100 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase">Reference</span>
                <span className="font-mono text-xs font-bold dark:text-slate-300">#INV-9921-X</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase">Method</span>
                <span className="text-xs font-bold dark:text-slate-300">
                  Card ending in •••• 4242
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-[10px] font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-500">
                <Download size={14} /> Download Receipt
              </button>

              <div className="border-t border-slate-100 pt-4 dark:border-white/5">
                <p className="mb-4 text-xs font-bold text-slate-500 italic">How did we do today?</p>
                <div className="mb-8 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      className="p-2 text-amber-400 transition-transform hover:scale-110"
                    >
                      <Star size={24} fill={s <= 5 ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-blue-600"
              >
                Back to Website <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
