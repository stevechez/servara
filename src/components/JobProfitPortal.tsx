'use client';

import React from 'react';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function JobProfitPanel({
  jobPrice,
  laborCost,
  materialCost,
}: {
  jobPrice: number;
  laborCost: number;
  materialCost: number;
}) {
  const totalCost = laborCost + materialCost;
  const profit = jobPrice - totalCost;
  const margin = (profit / jobPrice) * 100;

  return (
    <div className="rounded-3xl border border-white/5 bg-[#12161D] p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase italic">
          Profit Intelligence
        </h3>
        <TrendingUp size={16} className="text-emerald-500" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-xs">
          <span className="font-bold tracking-tighter text-slate-500 uppercase">Gross Revenue</span>
          <span className="font-black text-white">${jobPrice.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="font-bold tracking-tighter text-slate-500 uppercase">
            Total Expenses
          </span>
          <span className="font-black text-red-500">-${totalCost.toLocaleString()}</span>
        </div>

        <div className="flex items-end justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Net Profit
            </p>
            <p className="mt-1 text-3xl font-black tracking-tighter text-emerald-500 italic">
              ${profit.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Margin
            </p>
            <p
              className={`mt-1 text-xl font-black ${margin > 40 ? 'text-emerald-400' : 'text-amber-500'}`}
            >
              {margin.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
