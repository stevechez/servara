'use client';

import { useState, useEffect } from 'react';
import { Calculator, DollarSign, Zap } from 'lucide-react';

export default function QuickQuote() {
  const [sqft, setSqft] = useState<number>(0);
  const [rate, setRate] = useState<number>(0.25); // Default $0.25 per sq ft
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setTotal(sqft * rate);
  }, [sqft, rate]);

  return (
    <div className="shadow-soft group rounded-[2.5rem] border border-slate-200 bg-white p-8 dark:border-white/5 dark:bg-[#12161D]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
          <Calculator size={14} className="text-indigo-500" /> Quick Estimate
        </h2>
        <Zap size={14} className="animate-pulse text-yellow-500" />
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-[10px] font-black text-slate-400 uppercase">
            Square Footage
          </label>
          <input
            type="number"
            onChange={(e) => setSqft(Number(e.target.value))}
            placeholder="e.g. 2500"
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xl font-black focus:border-indigo-500 focus:outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setRate(0.2)}
            className={`flex-1 rounded-xl border py-2 text-[10px] font-black tracking-widest uppercase transition-all ${rate === 0.2 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-100 text-slate-400'}`}
          >
            Eco
          </button>
          <button
            onClick={() => setRate(0.25)}
            className={`flex-1 rounded-xl border py-2 text-[10px] font-black tracking-widest uppercase transition-all ${rate === 0.25 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-100 text-slate-400'}`}
          >
            Std
          </button>
          <button
            onClick={() => setRate(0.35)}
            className={`flex-1 rounded-xl border py-2 text-[10px] font-black tracking-widest uppercase transition-all ${rate === 0.35 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-100 text-slate-400'}`}
          >
            Pro
          </button>
        </div>

        <div className="border-t border-slate-50 pt-4 dark:border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase">Estimated Total</span>
            <span className="text-3xl font-black text-indigo-600 italic">
              ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
