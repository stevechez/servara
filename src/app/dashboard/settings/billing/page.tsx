'use client';

import { CreditCard, Zap, CheckCircle2, ExternalLink } from 'lucide-react';

export default function BillingSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic dark:text-white">Billing & Plan</h1>
        <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
          Manage your subscription and usage
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 text-white dark:bg-black">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap size={200} />
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1 text-[10px] font-black tracking-widest uppercase">
              Current Plan: Pro Unlimited
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">
              $99<span className="text-xl text-slate-400">/mo</span>
            </h2>
            <p className="mt-2 text-sm font-bold text-slate-400">
              Next billing date: April 14, 2026
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-[12px] font-black text-slate-900 uppercase transition-all hover:bg-slate-100">
            Manage via Stripe <ExternalLink size={16} />
          </button>
        </div>

        <div className="relative z-10 mt-12 grid grid-cols-1 gap-6 border-t border-white/10 pt-8 md:grid-cols-3">
          {['Unlimited Leads', 'Priority Support', 'Custom Branding'].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-300 uppercase"
            >
              <CheckCircle2 size={16} className="text-blue-500" /> {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
