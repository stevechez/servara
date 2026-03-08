'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

// 1. Define the interface for TypeScript
interface DailyBriefingProps {
  jobs: any[];
}

export default function DailyBriefing({ jobs }: DailyBriefingProps) {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // 2. Derive real stats from the jobs prop to make it "Live"
  const completedToday = jobs.filter(j => j.status === 'completed').length;
  const pendingToday = jobs.filter(j => j.status === 'scheduled' || j.status === 'next').length;

  return (
    <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="p-8 border-b border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight italic dark:text-white">AI Daily Briefing</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{date}</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-10">
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Executive Summary</h4>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            Today is a <span className="text-emerald-500 font-bold">productive day</span>. 
            You have <span className="text-blue-500 font-bold">{completedToday} jobs completed</span> and {pendingToday} upcoming appointments. 
            AI is currently monitoring leads to optimize your schedule for the remainder of the week.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard label="Jobs Today" value={jobs.length} trend="Live" sub="Total volume" color="blue" />
          <KPICard label="Efficiency" value="94%" trend="+4%" sub="Route optimized" color="emerald" />
          <KPICard label="Next Window" value="2:00 PM" trend="Open" sub="At Thorne Bistro" color="purple" />
        </div>

        <section className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={18} className="text-slate-400" />
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Upcoming Focus</h4>
          </div>
          <div className="space-y-4">
            {jobs.slice(0, 3).map((job, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  {job.customer_name} — {job.status === 'completed' ? 'Finished' : 'Upcoming'}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Reusable KPICard for internal use
function KPICard({ label, value, trend, sub, color }: any) {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-500/10",
  };

  return (
    <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-3xl">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${colorMap[color]}`}>
          {trend}
        </div>
      </div>
      <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">{value}</p>
      <p className="text-[10px] text-slate-400 font-bold italic">{sub}</p>
    </div>
  );
}