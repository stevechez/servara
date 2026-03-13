'use client';

import { CheckCircle2, Circle, Sparkles, ArrowRight } from 'lucide-react';

export default function MagicSetup() {
  const steps = [
    { name: 'Connect Supabase', status: 'complete' },
    { name: 'Import Service Catalog', status: 'complete' },
    { name: 'Configure Twilio SMS', status: 'pending' },
    { name: 'Set Blitz Radius', status: 'pending' },
  ];

  return (
    <div className="shadow-float rounded-[2.5rem] border border-slate-200 bg-white p-8 dark:border-white/5 dark:bg-[#12161D]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
          <Sparkles size={14} className="text-blue-500" /> Startup Progress
        </h2>
        <span className="text-[10px] font-black text-blue-600 uppercase">50% Complete</span>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.name} className="group flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step.status === 'complete' ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <Circle size={18} className="text-slate-200 dark:text-white/10" />
              )}
              <span
                className={`text-sm font-bold ${step.status === 'complete' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}
              >
                {step.name}
              </span>
            </div>
            {step.status === 'pending' && (
              <button className="text-[9px] font-black text-blue-600 uppercase opacity-0 transition-opacity group-hover:opacity-100">
                Setup &rarr;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
