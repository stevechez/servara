import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  DollarSign,
  Briefcase,
  Users,
  Calendar as CalendarIcon,
  TrendingUp,
  Plus,
} from 'lucide-react';
import NotificationBell from '@/components/v2/NotificationBell';
import DemoSeedButton from '@/components/v2/DemoSeedButton';
import RevenueChart from '@/components/v2/RevenueChart';
import NewCustomerSlideover from '@/components/v2/NewCustomerSlideover';
import NeighborhoodBlitz from '@/components/v2/NeighborhoodBlitz';
import JobCalendar from '@/components/JobCalendar';
import MissedCallInbox from '@/components/v2/MissedCallInbox';
import MagicSetup from '@/components/v2/MagicSetup';
import QuickQuote from '@/components/v2/QuickQuote';
import QuickAddJob from '@/components/v2/QuickAddJob';
import LeadWarRoom from '@/components/v2/LeadWarRoom';

export const revalidate = 0;

export default async function DashboardHomePage() {
  const supabase = await createClient();

  // 1. FETCH ALL NECESSARY DATA
  const { data: leadsDataTemp } = await supabase.from('leads').select('*');
  const { data: jobsDataTemp } = await supabase.from('jobs').select('*, customers(name)');
  const { count: activeCountTemp } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'scheduled');
  const { data: completedJobsTemp } = await supabase
    .from('jobs')
    .select('id')
    .eq('status', 'completed');

  // 2. SAFE FALLBACKS
  const leadsData = leadsDataTemp || [];
  const allJobsData = jobsDataTemp || [];
  const activeCount = activeCountTemp || 0;
  const completedJobsCount = completedJobsTemp?.length || 0;
  const recentLeads = leadsData.slice(0, 5);

  // 3. CALCULATIONS
  const collectedRevenue = completedJobsCount * 1250;
  const pendingRevenue = leadsData.filter((l) => l.status === 'new').length * 1250;
  const totalLeads = leadsData.length;
  const convertedCount = leadsData.filter((l) => l.status === 'converted').length;
  const winRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-24 md:pb-10 dark:bg-[#0B0E14]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black uppercase italic md:text-4xl dark:text-white">
              Command Center
            </h1>
            <div className="mt-1 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-black tracking-widest text-emerald-500 uppercase">
                AI Dispatch Active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DemoSeedButton />
            <NotificationBell />
            <QuickAddJob />
          </div>
        </div>

        {/* METRICS */}
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

        {/* PIPELINE & CHART */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LeadWarRoom leads={recentLeads} />
          </div>
          <div className="lg:col-span-1">
            <RevenueChart collected={collectedRevenue} pending={pendingRevenue} />
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NewCustomerSlideover />
              <Link
                href="/dashboard/jobs/new"
                className="group flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-50 dark:border-white/5 dark:bg-[#12161D]"
              >
                <div className="rounded-2xl bg-indigo-600 p-3 text-white">
                  <Plus size={20} />
                </div>
                <span className="font-black tracking-tight text-slate-900 uppercase dark:text-white">
                  New Job
                </span>
              </Link>
            </div>

            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#12161D]">
              <h2 className="mb-6 text-[10px] font-black tracking-widest text-slate-400 uppercase italic">
                Master Schedule
              </h2>
              {allJobsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarIcon size={32} className="mb-4 text-slate-300" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Your schedule is clear
                  </h3>
                </div>
              ) : (
                <JobCalendar jobs={allJobsData} />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <MissedCallInbox />
            <MagicSetup />
          </div>
        </div>

        {/* BOTTOM TOOLS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NeighborhoodBlitz />
          <QuickQuote />
        </div>
      </div>
    </div>
  );
}

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
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-500',
    blue: 'bg-blue-500/10 text-blue-500',
    indigo: 'bg-indigo-500/10 text-indigo-500',
    slate: 'bg-slate-500/10 text-slate-500',
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/5 dark:bg-[#12161D]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{title}</h3>
        <div className={`rounded-xl p-2 ${colorMap[color]}`}>{icon}</div>
      </div>
      <p className="text-xl font-black md:text-2xl dark:text-white">{value}</p>
    </div>
  );
}
