'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle2, Crown, ShieldCheck, Zap, Percent, RefreshCcw } from 'lucide-react';

export default function SmartQuoteBuilder() {
  const [sqft, setSqft] = useState(1500);
  const [isMember, setIsMember] = useState(false); // THE 10x TOGGLE
  const [showProfit, setShowProfit] = useState(false);

  const tiers = useMemo(() => {
    const baseCost = sqft * 6; // $6/sqft cost
    const membershipDiscount = 0.9; // 10% off
    const membershipFee = 19; // $19/mo

    return [
      {
        name: 'Essential',
        basePrice: baseCost * 1.3,
        markup: 1.3,
        profit: baseCost * 0.3,
      },
      {
        name: 'Professional',
        basePrice: baseCost * 1.5,
        markup: 1.5,
        profit: baseCost * 0.5,
        isRecommended: true,
      },
      {
        name: 'Signature Platinum',
        basePrice: baseCost * 1.75 + 1500,
        markup: 1.75,
        profit: baseCost * 0.75 + 1500,
      },
    ].map((tier) => {
      // Apply Membership Logic
      const finalPrice = isMember ? tier.basePrice * membershipDiscount : tier.basePrice;
      const savings = tier.basePrice - finalPrice;

      return {
        ...tier,
        finalPrice,
        savings,
        monthlyFee: isMember ? membershipFee : 0,
      };
    });
  }, [sqft, isMember]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* 10x MEMBERSHIP UPSELL BANNER */}
      <div
        className={`mb-8 flex items-center justify-between rounded-3xl border-2 p-6 transition-all ${
          isMember
            ? 'border-emerald-500 bg-emerald-500/5'
            : 'border-slate-200 bg-white dark:border-white/5 dark:bg-[#12161D]'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`rounded-2xl p-4 ${isMember ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-white/5'}`}
          >
            <RefreshCcw className={isMember ? 'animate-spin-slow' : ''} size={24} />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight uppercase italic dark:text-white">
              Pro-Protection Plan
            </h4>
            <p className="text-sm font-bold text-slate-500">
              Save 10% on today's job + priority annual service.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsMember(!isMember)}
          className={`flex items-center gap-2 rounded-2xl px-8 py-4 text-xs font-black tracking-widest uppercase transition-all ${
            isMember
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-[#0B1021] text-white'
          }`}
        >
          {isMember ? <CheckCircle2 size={16} /> : <Percent size={16} />}
          {isMember ? 'Plan Applied' : 'Add Plan & Save'}
        </button>
      </div>

      {/* TIER DISPLAY (Mapping finalPrice) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.name} className="...">
            {/* ... inside the price section ... */}
            <p className="text-4xl font-black">
              ${tier.finalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>

            {isMember && (
              <div className="mt-2 animate-bounce text-xs font-black text-emerald-500 uppercase">
                Saved ${tier.savings.toLocaleString()} today
              </div>
            )}

            {isMember && (
              <div className="mt-4 border-t border-slate-100 pt-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                + $19/mo Protection Fee
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
