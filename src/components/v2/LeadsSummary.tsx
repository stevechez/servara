'use client';

import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone?: string;
  service_type: string;
  status: string;
}

export default function LeadSummary({ leads }: { leads: Lead[] }) {
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.phone && l.service_type).length;
  const potentialRevenue = totalLeads * 1250;

  // AI Logic: Determine the "Vibe" of the pipeline
  const getInsight = () => {
    if (totalLeads === 0) return 'Pipeline is empty. Time to launch a Neighborhood Blitz.';
    if (hotLeads > totalLeads / 2)
      return 'High-intent traffic detected. Prioritize immediate callbacks.';
    return 'Steady lead flow. Focus on converting general inquiries to scheduled jobs.';
  };

  return (
    <div className="mb-8 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-[1px] shadow-xl shadow-blue-500/20">
      <div className="rounded-[calc(2rem-1px)] bg-white p-6 dark:bg-[#12161D]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-[10px] font-black tracking-[0.3em] text-blue-600 uppercase">
                AI Briefing
              </h3>
              <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
                {getInsight()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 border-t border-slate-50 pt-4 md:border-t-0 md:pt-0 dark:border-white/5">
            <div className="text-center md:text-left">
              <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                Pipeline Value
              </p>
              <p className="text-xl font-black tracking-tighter text-slate-900 italic dark:text-white">
                ${potentialRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[9px] font-black tracking-widest text-emerald-500 uppercase">
                Urgent Action
              </p>
              <p className="text-xl font-black tracking-tighter text-emerald-500 italic">
                {hotLeads} Hot
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
