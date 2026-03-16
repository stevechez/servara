'use client';

import React from 'react';
import { TrendingUp, DollarSign, Briefcase, Percent } from 'lucide-react';

export default function JobProfitPanel({
  revenue,
  labor,
  materials,
  overhead = 0,
}: {
  revenue: number;
  labor: number;
  materials: number;
  overhead?: number;
}) {
  const totalCost = labor + materials + overhead;
  const profit = revenue - totalCost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return (
    <div className="rounded-[2rem] border border-white/5 bg-[#12161D] p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-emerald-500/10 p-2">
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
          <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Profit Intel
          </h3>
        </div>
        <span
          className={`rounded-md px-2 py-1 text-[10px] font-black ${margin > 40 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}
        >
          {margin > 40 ? 'Healthy Margin' : 'Low Margin'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="font-bold tracking-tighter text-slate-500 uppercase">Gross Revenue</span>
          <span className="font-black text-white">${revenue.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="font-bold tracking-tighter text-slate-500 uppercase">
            Labor + Materials
          </span>
          <span className="font-black text-red-400">-${totalCost.toLocaleString()}</span>
        </div>

        <div className="mt-2 flex items-end justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Net Profit
            </p>
            <p className="text-3xl font-black tracking-tighter text-emerald-500 italic">
              ${profit.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Margin
            </p>
            <p className="text-xl font-black text-white">{margin.toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
