'use client';

import { useState } from 'react';
import { Check, Zap, Sparkles, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: "Starter",
    icon: Zap,
    description: "Perfect for solo operators and owner-operators just getting off the ground.",
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      "Client CRM & Portals",
      "Basic Scheduling",
      "Estimates & Invoicing",
      "Unlimited Clients",
      "Email Support"
    ],
    cta: "Start Free Trial",
    popular: false,
    color: "text-slate-500",
    bgIcon: "bg-slate-100 dark:bg-white/5"
  },
  {
    name: "Growth",
    icon: Sparkles,
    description: "Everything you need to scale your crews and lock in recurring revenue.",
    monthlyPrice: 129,
    annualPrice: 99,
    features: [
      "Everything in Starter",
      "Smart Route Mapping",
      "1-Click PDF Reports",
      "Recurring Care Plans",
      "Field Payments",
      "Priority Support"
    ],
    cta: "Start Free Trial",
    popular: true,
    color: "text-blue-500",
    bgIcon: "bg-blue-50 dark:bg-blue-500/10"
  },
  {
    name: "Scale",
    icon: Building2,
    description: "Advanced AI and automation for established businesses dominating their market.",
    monthlyPrice: 299,
    annualPrice: 249,
    features: [
      "Everything in Growth",
      "AI Call Intercept",
      "Revenue Forecasting",
      "Multi-Crew Dispatching",
      "QuickBooks Integration",
      "24/7 Phone Support"
    ],
    cta: "Contact Sales",
    popular: false,
    color: "text-purple-500",
    bgIcon: "bg-purple-50 dark:bg-purple-500/10"
  }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-white dark:bg-[#0B0E14] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER & TOGGLE */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium mb-10">
            No hidden fees. No per-user penalties. Choose the plan that fits your business, and upgrade when you're ready to scale.
          </p>

          {/* BILLING TOGGLE */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-800 p-1 transition-colors hover:bg-slate-300 dark:hover:bg-slate-700 focus:outline-none"
              aria-label="Toggle annual billing"
            >
              <div className={`w-6 h-6 rounded-full bg-white dark:bg-slate-300 shadow-sm transition-transform duration-300 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              Annually <span className="px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] uppercase tracking-widest">Save 20%</span>
            </span>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative rounded-[2.5rem] p-8 md:p-10 transition-all duration-300 ${
                tier.popular 
                  ? 'bg-slate-900 dark:bg-[#12161D] text-white border-2 border-blue-500 shadow-2xl md:-translate-y-4' 
                  : 'bg-slate-50 dark:bg-[#12161D] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-lg'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/30">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${tier.bgIcon}`}>
                  <tier.icon size={24} className={tier.color} />
                </div>
                <h3 className={`text-2xl font-black ${tier.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {tier.name}
                </h3>
              </div>
              
              <p className={`text-sm font-medium h-12 mb-8 ${tier.popular ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                {tier.description}
              </p>

              <div className="mb-8">
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-black text-slate-400">$</span>
                  <span className={`text-6xl font-black tracking-tight ${tier.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {isAnnual ? tier.annualPrice : tier.monthlyPrice}
                  </span>
                  <span className={`font-bold mb-2 ml-1 ${tier.popular ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span>
                </div>
                <p className={`text-xs font-bold ${tier.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isAnnual ? `Billed annually at $${tier.annualPrice * 12}` : 'Billed monthly'}
                </p>
              </div>

              <Link 
                href="/login" 
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 mb-8 ${
                  tier.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {tier.cta} <ArrowRight size={16} />
              </Link>

              <div className="space-y-4">
                <p className={`text-xs font-black uppercase tracking-widest ${tier.popular ? 'text-slate-400' : 'text-slate-400'}`}>
                  What's included
                </p>
                <ul className="space-y-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={18} className="shrink-0 text-blue-500 mt-0.5" />
                      <span className={`text-sm font-medium ${tier.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}