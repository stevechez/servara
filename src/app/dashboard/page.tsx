import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DollarSign, Briefcase, Users, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';

import NewCustomerSlideover from '@/components/v2/NewCustomerSlideover';
import NeighborhoodBlitz from '@/components/v2/NeighborhoodBlitz';
import JobCalendar from '@/components/JobCalendar';
import MissedCallInbox from '@/components/v2/MissedCallInbox';
import MagicSetup from '@/components/v2/MagicSetup';
import QuickQuote from '@/components/v2/QuickQuote';
import ActivityFeed from '@/components/v2/ActivityFeed';
import ConflictResolver from '@/components/v2/ConflictResolver';
import QuickAddJob from '@/components/v2/QuickAddJob';

export const revalidate = 0;

export default async function DashboardHomePage() {
  const supabase = await createClient();

  // 1. DATA FETCHING
  const [leadsRes, invoicesRes, jobsRes, activeRes] = await Promise.all([
    supabase.from('leads').select('*'),
    supabase.from('invoices').select('amount, status'),
    supabase.from('jobs').select('*, customers(name)'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
  ]);

  const allJobsData = jobsRes.data || [];
  const leadsData = leadsRes.data || [];
  const activeCount = activeRes.count || 0;

  // 2. CALCULATIONS
  const collectedRevenue =
    invoicesRes.data
      ?.filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0;

  const totalLeads = leadsData.length;
  const convertedCount = leadsData.filter((l) => l.status === 'converted').length;
  const winRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-24 md:pb-10 dark:bg-[#0B0E14]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* 1. HEADER */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black uppercase italic md:text-4xl dark:text-white">
              Command Center
            </h1>
            <p className="mt-1 text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
              Operations & AI Dispatch
            </p>
          </div>
          <div className="w-full md:w-auto">
            <QuickAddJob />
          </div>
        </div>

        {/* 2. METRICS */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          <MetricCard
            title="Revenue"
            value={`$${collectedRevenue.toLocaleString()}`}
            icon={<DollarSign size={16} />}
            color="emerald"
          />
          <MetricCard
            title="Win Rate"
            value={`${winRate}%`}
            icon={<TrendingUp size={16} />}
            color="blue"
          />
          <MetricCard
            title="Active"
            value={activeCount}
            icon={<Briefcase size={16} />}
            color="indigo"
          />
          <MetricCard title="Leads" value={totalLeads} icon={<Users size={16} />} color="slate" />
        </div>

        {/* 3. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NewCustomerSlideover />
              <Link
                href="/dashboard/jobs"
                className="shadow-soft group flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-500 dark:border-white/5 dark:bg-[#12161D]"
              >
                <div className="rounded-2xl bg-indigo-600 p-3 text-white">
                  <CalendarIcon size={20} />
                </div>
                <span className="font-black tracking-tight text-slate-900 uppercase dark:text-white">
                  Schedule Job
                </span>
              </Link>
            </div>

            <ConflictResolver jobs={allJobsData} />

            <div className="shadow-float rounded-[2.5rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#12161D]">
              <h2 className="mb-4 text-[10px] font-black tracking-widest text-slate-400 uppercase italic">
                Master Schedule
              </h2>
              <div className="scrollbar-hide overflow-x-auto">
                <div className="min-w-[800px] lg:min-w-full">
                  <JobCalendar jobs={allJobsData} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <MissedCallInbox />
            <ActivityFeed jobs={allJobsData} leads={leadsData} />
          </div>
        </div>

        {/* 4. BOTTOM TOOLS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NeighborhoodBlitz />
          <QuickQuote />
          <div className="md:col-span-2 lg:col-span-1">
            <MagicSetup />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Metric Card Component
function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: any;
  icon: any;
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/5 dark:bg-[#12161D]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{title}</h3>
        <div
          className={`rounded-xl bg-${color === 'emerald' ? 'emerald' : color === 'blue' ? 'blue' : color === 'indigo' ? 'indigo' : 'slate'}-500/10 p-2 text-${color === 'emerald' ? 'emerald' : color === 'blue' ? 'blue' : color === 'indigo' ? 'indigo' : 'slate'}-500`}
        >
          {icon}
        </div>
      </div>
      <p className="text-xl font-black md:text-2xl dark:text-white">{value}</p>
    </div>
  );
}
