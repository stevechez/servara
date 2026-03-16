'use client';

import React, { useState } from 'react';
import { Map, Phone, Play, CheckCircle, Loader2, Flag } from 'lucide-react';
import { startJob, completeJob } from '@/app/actions/tech-actions';

export default function TechActionCenter({ job }: { job: any }) {
  const [loading, setLoading] = useState(false);
  const customer = job.customers || {};

  const handleStart = async () => {
    setLoading(true);
    await startJob(job.id);
    setLoading(false);
  };

  const handleComplete = async () => {
    if (!confirm('Are you sure? This will finalize the work and notify the office.')) return;
    setLoading(true);
    await completeJob(job.id);
    setLoading(false);
  };

  const openMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customer.address || '')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="mb-6 grid grid-cols-2 gap-4">
      {/* MAP & CALL BUTTONS */}
      <button
        onClick={openMap}
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#12161D] p-6 text-slate-300 transition hover:bg-white/5 active:scale-95"
      >
        <Map size={24} className="text-blue-500" />
        <span className="text-[10px] font-black tracking-widest uppercase">Navigate</span>
      </button>

      <a
        href={`tel:${customer.phone}`}
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#12161D] p-6 text-slate-300 transition hover:bg-white/5 active:scale-95"
      >
        <Phone size={24} className="text-emerald-500" />
        <span className="text-[10px] font-black tracking-widest uppercase">Call Client</span>
      </a>

      {/* START JOB BUTTON */}
      {job.status === 'en_route' && (
        <button
          onClick={handleStart}
          disabled={loading}
          className="col-span-2 flex items-center justify-center gap-3 rounded-2xl bg-blue-600 p-5 text-sm font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Play size={20} fill="currentColor" />}
          I'm On Site / Start Job
        </button>
      )}

      {/* COMPLETE JOB BUTTON */}
      {job.status === 'in_progress' && (
        <button
          onClick={handleComplete}
          disabled={loading}
          className="col-span-2 flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 p-5 text-sm font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Flag size={20} />}
          Complete & Close Job
        </button>
      )}

      {/* COMPLETED STATUS */}
      {job.status === 'completed' && (
        <div className="col-span-2 flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm font-black tracking-[0.2em] text-emerald-500 uppercase">
          <CheckCircle size={20} />
          Job Completed
        </div>
      )}
    </div>
  );
}
