'use client';

import React from 'react';
import { Play, MapPin, ArrowRight } from 'lucide-react';
import { resumePausedJob } from '@/app/actions/dispatch-actions';

export default function ResumePrompt({ pausedJob, onResume }: any) {
  if (!pausedJob) return null;

  const handleResume = async () => {
    const result = await resumePausedJob(pausedJob.id);
    if (result.success) {
      onResume(); // Callback to refresh local state
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-blue-500/30 bg-blue-500/5 p-6 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-400 uppercase">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          Pending Action
        </span>
      </div>

      <h3 className="mb-1 text-lg font-black text-white uppercase italic">Resume Previous Job?</h3>
      <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-400">
        <MapPin size={14} className="text-slate-600" />
        {pausedJob.address}
      </div>

      <button
        onClick={handleResume}
        className="group flex w-full items-center justify-between rounded-2xl bg-blue-600 p-4 text-xs font-black tracking-widest text-white uppercase transition hover:bg-blue-500"
      >
        <span className="flex items-center gap-2">
          <Play size={16} fill="currentColor" /> Resume Work
        </span>
        <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </button>
    </div>
  );
}
