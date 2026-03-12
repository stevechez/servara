'use client';

import { useState } from 'react';
import { Sparkles, Wrench, DollarSign, Globe, Check, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function MagicSetup() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const completeSetup = async (niche: string) => {
    setLoading(true);

    const starterServices: Record<string, any[]> = {
      Plumbing: [
        { name: 'Emergency Service Call', base_price: 185, category: 'General' },
        { name: 'Drain Snaking (Basic)', base_price: 225, category: 'Drainage' },
        { name: 'Toilet Replacement', base_price: 450, category: 'Fixtures' },
        { name: 'Water Heater Flush', base_price: 150, category: 'Maintenance' },
      ],
      HVAC: [
        { name: 'Diagnostic Fee', base_price: 125, category: 'Service' },
        { name: 'A/C Tune-up', base_price: 195, category: 'Maintenance' },
        { name: 'Furnace Inspection', base_price: 150, category: 'Safety' },
        { name: 'Refrigerant Recharge', base_price: 350, category: 'Repair' },
      ],
      Electrical: [
        { name: 'Safety Inspection', base_price: 150, category: 'Safety' },
        { name: 'Panel Upgrade', base_price: 2500, category: 'Infrastructure' },
        { name: 'Outlet/Switch Install', base_price: 95, category: 'General' },
        { name: 'EV Charger Setup', base_price: 800, category: 'Green Energy' },
      ],
    };

    const servicesToInject = starterServices[niche] || starterServices['Plumbing'];

    try {
      const { error } = await supabase
        .from('service_items')
        .insert(servicesToInject.map((s) => ({ ...s, is_active: true })));

      if (error) throw error;

      setTimeout(() => {
        setLoading(false);
        setStep(4); // Move to Success State
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error('AI Injection failed', err);
      setLoading(false);
      alert('Setup failed to save. Check database connection.');
    }
  };

  const steps = [
    { title: 'Service Niche', icon: <Wrench size={20} />, text: "What's your primary trade?" },
    { title: 'Price Baseline', icon: <DollarSign size={20} />, text: 'Average service call fee?' },
    { title: 'Service Radius', icon: <Globe size={20} />, text: 'How far do you travel?' },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  return (
    <div className="shadow-soft group relative flex h-full min-h-[400px] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 dark:border-white/5 dark:bg-[#12161D]">
      {/* Background Aesthetic */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all group-hover:bg-blue-500/20" />

      <div>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-lg shadow-blue-500/20">
            <Sparkles size={20} className={loading ? 'animate-spin' : ''} />
          </div>
          <div>
            <h2 className="text-lg leading-none font-black tracking-tight italic dark:text-white">
              Magic Setup
            </h2>
            <p className="mt-1 text-[10px] font-black tracking-widest text-blue-600 uppercase">
              AI Config Engine
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 animate-pulse flex-col items-center justify-center py-12">
            <Loader2 className="mb-4 animate-spin text-blue-600" size={40} />
            <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Building your price book...
            </p>
          </div>
        ) : step === 4 ? (
          <div className="animate-in zoom-in py-8 text-center duration-500">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-inner">
              <Check size={36} strokeWidth={3} />
            </div>
            <p className="text-xl font-black text-slate-900 italic dark:text-white">
              Business Profile Live
            </p>
            <p className="mt-2 text-xs leading-relaxed font-bold tracking-widest text-slate-500 uppercase">
              Pricing engine is now active.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              {steps[step].icon}
              <span className="text-[10px] font-black tracking-widest uppercase">
                {steps[step].title}
              </span>
            </div>
            <p className="mb-8 text-2xl leading-tight font-black text-slate-900 italic dark:text-white">
              {steps[step].text}
            </p>

            <div className="space-y-3">
              {step === 0 &&
                ['Plumbing', 'HVAC', 'Electrical'].map((niche) => (
                  <button
                    key={niche}
                    onClick={() => completeSetup(niche)}
                    className="group/btn flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left text-sm font-black transition-all hover:border-blue-500 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-blue-500/10"
                  >
                    {niche}
                    <ArrowRight
                      size={16}
                      className="-translate-x-2 text-blue-600 opacity-0 transition-all group-hover/btn:translate-x-0 group-hover/btn:opacity-100"
                    />
                  </button>
                ))}

              {step === 1 &&
                ['$99 - Basic', '$149 - Standard', '$199 - Premium'].map((p) => (
                  <button
                    key={p}
                    onClick={handleNext}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left text-sm font-black transition-all hover:border-blue-500 dark:border-white/5 dark:bg-white/5 dark:text-slate-300"
                  >
                    {p}
                  </button>
                ))}

              {step === 2 &&
                ['15 miles', '25 miles', '50 miles'].map((r) => (
                  <button
                    key={r}
                    onClick={handleNext}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left text-sm font-black transition-all hover:border-blue-500 dark:border-white/5 dark:bg-white/5 dark:text-slate-300"
                  >
                    {r}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {step < 3 && !loading && (
        <div className="mt-8 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${i <= step ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-slate-100 dark:bg-white/5'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
