'use client';

import React from 'react';
import { CheckCircle2, MapPin, Zap, ShieldCheck, Download, CreditCard } from 'lucide-react';

export default function ClientPortalView({ job }: { job: any }) {
  const steps = [
    { label: 'Scheduled', status: 'complete', time: '8:00 AM' },
    { label: 'Technician Arrived', status: 'complete', time: '9:15 AM' },
    { label: 'Work in Progress', status: 'current', time: 'Active' },
    { label: 'Final Quality Check', status: 'pending', time: '--' },
  ];

  return (
    <div className="min-h-screen bg-[#050608] pb-20 font-sans text-white">
      {/* 1. BRANDED HEADER */}
      <div className="bg-gradient-to-b from-blue-600/20 to-transparent p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-2xl shadow-blue-600/40">
          <Zap size={28} fill="currentColor" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          Project Live Tracker
        </h1>
        <p className="mt-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
          Job ID: {job.id.substring(0, 8)}
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-8 px-6">
        {/* 2. LIVE TIMELINE */}
        <div className="rounded-[2.5rem] border border-white/5 bg-[#12161D] p-8">
          <h3 className="mb-8 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
            Live Status
          </h3>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="relative flex flex-col items-center">
                  <div
                    className={`z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      step.status === 'complete'
                        ? 'border-blue-500 bg-blue-500'
                        : step.status === 'current'
                          ? 'animate-pulse border-blue-500 bg-transparent'
                          : 'border-white/10'
                    }`}
                  >
                    {step.status === 'complete' && (
                      <CheckCircle2 size={12} className="text-white" />
                    )}
                  </div>
                  {i !== steps.length - 1 && (
                    <div className="absolute top-6 h-10 w-[2px] bg-white/5" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-black tracking-tight uppercase ${step.status === 'pending' ? 'text-slate-600' : 'text-white'}`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. EVIDENCE GALLERY */}
        <div className="rounded-[2.5rem] border border-white/5 bg-[#12161D] p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
              Work Evidence
            </h3>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[8px] font-black text-blue-500 uppercase">
              Live Photos
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Mocking the photos captured by tech */}
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[10px] text-slate-600 italic">
              Before Photo
            </div>
            <div className="flex aspect-square animate-pulse items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[10px] text-slate-600 italic">
              In Progress...
            </div>
          </div>
        </div>

        {/* 4. THE ACTION FOOTER (Sticky) */}
        <div className="fixed right-0 bottom-0 left-0 border-t border-white/10 bg-[#050608]/90 p-6 backdrop-blur-xl">
          <div className="mx-auto flex max-w-2xl gap-4">
            <button className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/30">
              <CreditCard size={18} />
              Pay Balance
            </button>
            <button className="flex items-center justify-center rounded-2xl bg-white/5 px-6 py-5 text-white">
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* 5. MEMBERSHIP UPSELL (Social Proof) */}
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
          <ShieldCheck size={32} className="mx-auto mb-3 text-emerald-500" />
          <p className="text-xs font-black tracking-widest text-emerald-400 uppercase">
            Pro-Protection Member?
          </p>
          <p className="mt-2 text-sm font-medium text-slate-400">
            Join 1,200+ neighbors and save 10% on future services.
          </p>
          <button className="mt-4 text-[10px] font-black tracking-widest text-white uppercase underline decoration-emerald-500/50 underline-offset-4">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
