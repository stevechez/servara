'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, ShieldCheck, Zap, Crown, TrendingUp, Eye, EyeOff, Send } from 'lucide-react';

export default function SmartQuoteBuilder() {
  const [sqft, setSqft] = useState(1500);
  const [showProfit, setShowProfit] = useState(false);
  const [baseCostPerSqft, setBaseCostPerSqft] = useState(6);

  // 10x Logic: Dynamic Tier Generation
  const tiers = useMemo(() => {
    const cost = sqft * baseCostPerSqft;

    return [
      {
        name: 'Essential',
        icon: <Zap className="text-slate-400" />,
        markup: 1.3,
        price: cost * 1.3,
        profit: cost * 0.3,
        margin: '23%',
        features: ['Standard Materials', '1-Year Warranty', 'Basic Cleanup'],
      },
      {
        name: 'Professional',
        icon: <ShieldCheck className="text-blue-500" />,
        markup: 1.5,
        price: cost * 1.5,
        profit: cost * 0.5,
        margin: '33%',
        isRecommended: true,
        features: [
          'Premium Materials',
          '5-Year Warranty',
          'Priority Scheduling',
          'Detailed Inspection',
        ],
      },
      {
        name: 'Signature Platinum',
        icon: <Crown className="text-amber-500" />,
        markup: 1.75,
        price: cost * 1.75 + 1500,
        profit: cost * 0.75 + 1500,
        margin: '45%',
        features: [
          'Ultra-Premium Materials',
          'Lifetime Warranty',
          'Concierge Support',
          'Annual Maintenance Plan',
        ],
      },
    ];
  }, [sqft, baseCostPerSqft]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* CONTROL PANEL */}
      <div className="mb-10 rounded-[2.5rem] bg-[#0B1021] p-8 text-white shadow-2xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex-1">
            <h2 className="flex items-center gap-3 text-2xl font-black uppercase italic">
              <Calculator className="text-blue-500" />
              Smart Quote Engine
            </h2>
            <p className="mt-1 text-sm font-bold tracking-widest text-slate-400 uppercase">
              Adjust project size to optimize margins
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black tracking-widest text-blue-400 text-slate-500 uppercase">
                Profit Mode
              </p>
              <button
                onClick={() => setShowProfit(!showProfit)}
                className={`mt-1 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase transition-all ${
                  showProfit ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {showProfit ? <Eye size={14} /> : <EyeOff size={14} />}
                {showProfit ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Project Square Footage:{' '}
              <span className="ml-2 text-lg text-white">{sqft.toLocaleString()} sq ft</span>
            </label>
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={sqft}
              onChange={(e) => setSqft(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-900 accent-blue-500"
            />
          </div>

          <div className="flex items-end justify-end gap-10">
            {showProfit && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <p className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                  Est. Total Profit
                </p>
                <p className="text-4xl font-black text-white">
                  ${tiers[1].profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TIER COMPARISON */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-[3rem] border p-8 transition-all hover:shadow-2xl ${
              tier.isRecommended
                ? 'border-blue-500 bg-white ring-4 ring-blue-500/10 dark:bg-[#12161D]'
                : 'border-slate-200 bg-white dark:border-white/5 dark:bg-[#12161D]'
            }`}
          >
            {tier.isRecommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-[10px] font-black tracking-widest text-white uppercase">
                Best Value
              </div>
            )}

            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">{tier.icon}</div>
              <h3 className="text-xl font-black tracking-tight uppercase italic dark:text-white">
                {tier.name}
              </h3>
            </div>

            <div className="mb-8">
              <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                ${tier.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              {showProfit && (
                <div className="mt-2 flex items-center gap-2 font-mono text-sm font-bold text-emerald-500">
                  <TrendingUp size={14} />
                  +${tier.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })} Profit (
                  {tier.margin})
                </div>
              )}
            </div>

            <ul className="mb-10 flex-1 space-y-4">
              {tier.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black tracking-widest uppercase transition-all active:scale-95 ${
                tier.isRecommended
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'
              }`}
            >
              Select {tier.name}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="flex items-center gap-3 rounded-full bg-[#0B1021] px-10 py-5 text-[10px] font-black tracking-[0.3em] text-white uppercase shadow-xl transition-all hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-95">
          <Send size={16} />
          Generate Professional Proposal
        </button>
      </div>
    </div>
  );
}
