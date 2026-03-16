import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DollarSign, Briefcase, Users, TrendingUp, Sparkles } from 'lucide-react';
import NotificationBell from '@/components/v2/NotificationBell';
import RevenueChart from '@/components/v2/RevenueChart';
import NewCustomerSlideover from '@/components/v2/NewCustomerSlideover';
import NeighborhoodBlitz from '@/components/v2/NeighborhoodBlitz';
import JobCalendar from '@/components/JobCalendar';
import MissedCallInbox from '@/components/v2/MissedCallInbox';
import MagicSetup from '@/components/v2/MagicSetup';
import QuickQuote from '@/components/v2/QuickQuote';
import QuickAddJob from '@/components/v2/QuickAddJob';
import LeadWarRoom from '@/components/v2/LeadWarRoom';
import NewJobTrigger from '@/components/v2/NewJobTrigger';

export const revalidate = 0;

export default async function DashboardHomePage() {
  const supabase = await createClient();

  // 1. GET THE CURRENT LOGGED IN USER
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login'); // Boot them out if not logged in

  // 2. FETCH ONLY THIS USER'S DATA
  const { data: leadsData } = await supabase.from('leads').select('*').eq('user_id', user.id);

  const { data: allJobsData } = await supabase
    .from('jobs')
    .select('*, customers(name)')
    .eq('user_id', user.id);

  // 3. CALCULATE REAL METRICS
  const jobs = allJobsData || [];
  const leads = leadsData || [];

  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const collectedRevenue = completedJobs.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingLeads = leads.filter((l) => l.status === 'new');
  const pendingRevenue = pendingLeads.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const activeCount = jobs.filter(
    (j) => j.status === 'scheduled' || j.status === 'in_progress'
  ).length;

  const totalLeads = leads.length;
  const convertedCount = leads.filter((l) => l.status === 'converted').length;
  const winRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;

  // 4. CHECK IF NEW USER (Empty State)
  const isNewAccount = jobs.length === 0 && leads.length === 0;

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
              <span className="text-[9px] font-black tracking-widest text-emerald-500 uppercase">
                AI Dispatch Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <QuickAddJob />
          </div>
        </div>

        {/* WELCOME BANNER FOR NEW BETA TESTERS */}
        {isNewAccount && (
          <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl">
            <Sparkles className="h-10 w-10 shrink-0 text-blue-200" />
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">Welcome to Zidro Pro!</h2>
              <p className="font-medium text-blue-100">
                Your workspace is ready. Let's start by adding your first customer or service to the
                catalog.
              </p>
            </div>
          </div>
        )}

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
            title="Active Jobs"
            value={activeCount}
            icon={<Briefcase size={16} />}
            color="indigo"
          />
          <MetricCard title="Leads" value={totalLeads} icon={<Users size={16} />} color="slate" />
        </div>

        {/* PIPELINE & CHART */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LeadWarRoom leads={leads.slice(0, 5)} />
          </div>
          <div className="lg:col-span-1">
            <RevenueChart collected={collectedRevenue} pending={pendingRevenue} />
          </div>
        </div>

        {/* ACTION GRID */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NewCustomerSlideover />
              <NewJobTrigger />
            </div>

            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#12161D]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase italic">
                  Master Schedule
                </h2>
              </div>
              <JobCalendar jobs={jobs} />
            </div>
          </div>

          <div className="space-y-6">
            <MissedCallInbox />
            <MagicSetup />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NeighborhoodBlitz />
          <QuickQuote />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400',
  };
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-[#12161D]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{title}</h3>
        <div className={`rounded-lg p-2 ${colors[color]}`}>{icon}</div>
      </div>
      <p className="text-2xl font-black md:text-3xl dark:text-white">{value}</p>
    </div>
  );
}
