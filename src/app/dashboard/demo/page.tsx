import { DollarSign, Briefcase, Users, TrendingUp } from 'lucide-react';
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

export default function DemoDashboardPage() {
  // ------------------------------------------------------------------
  // BULLETPROOF MOCK DATA (No Database Calls)
  // ------------------------------------------------------------------

  // 1. The correctly typed leads
  const demoLeads = [
    {
      id: 'l1',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      service_type: 'Water Heater Install',
      service_requested: 'Water Heater Install',
      status: 'new',
      amount: 2500,
      created_at: new Date().toISOString(),
    },
    {
      id: 'l2',
      name: 'Mark Vance',
      email: 'mark@vance.net',
      service_type: 'Pipe Leak',
      service_requested: 'Pipe Leak',
      status: 'contacted',
      amount: 450,
      created_at: new Date().toISOString(),
    },
    {
      id: 'l3',
      name: 'Oakwood Café',
      email: 'hello@oakwood.com',
      service_type: 'Commercial Sink',
      service_requested: 'Commercial Sink',
      status: 'new',
      amount: 1800,
      created_at: new Date().toISOString(),
    },
  ];

  // 2. The mock jobs
  const demoJobs = [
    {
      id: 'demo-1',
      service_type: 'Commercial Boiler Check',
      status: 'scheduled',
      scheduled_at: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
      customers: { name: 'Oakwood Café' },
      amount: 850,
    },
    {
      id: 'demo-2',
      service_type: 'Drain Cleaning & Scope',
      status: 'in_progress',
      scheduled_at: new Date(new Date().setHours(13, 30, 0, 0)).toISOString(),
      customers: { name: 'James Peterson' },
      amount: 325,
    },
    {
      id: 'demo-3',
      service_type: 'HVAC Annual Maintenance',
      status: 'scheduled',
      scheduled_at: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
      customers: { name: 'Skyline Properties' },
      amount: 1250,
    },
  ];

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
                Demo Mode Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <QuickAddJob />
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          <MetricCard
            title="Revenue"
            value="$8,450"
            icon={<DollarSign size={16} />}
            color="emerald"
          />
          <MetricCard title="Win Rate" value="68%" icon={<TrendingUp size={16} />} color="blue" />
          <MetricCard title="Active Jobs" value={3} icon={<Briefcase size={16} />} color="indigo" />
          <MetricCard title="Leads" value={12} icon={<Users size={16} />} color="slate" />
        </div>

        {/* PIPELINE & CHART */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LeadWarRoom leads={demoLeads as any} />
          </div>
          <div className="lg:col-span-1">
            <RevenueChart collected={8450} pending={4750} />
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
              <JobCalendar jobs={demoJobs} />
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

// Simple Metric Card inline
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
