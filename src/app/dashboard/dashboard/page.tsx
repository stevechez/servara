import { createClient } from '@/lib/supabase/server';
import { DollarSign, TrendingUp, AlertCircle, Briefcase } from 'lucide-react';
import JobCalendar from '@/components/JobCalendar';
import MissedCallInbox from '@/components/v2/MissedCallInbox';
import MagicSetup from '@/components/v2/MagicSetup';
import QuickQuote from '@/components/v2/QuickQuote';
import RevenueForecast from '@/components/v2/RevenueForecast';
import DailyBriefing from '@/components/v2/DailyBriefing';
import ConflictResolver from '@/components/v2/ConflictResolver';
import ActivityFeed from '@/components/v2/ActivityFeed';
import MobileMapTeaser from '@/components/v2/MobileMapTeaser'; 
import MapWrapper from '@/components/v2/MapWrapper';
import NewJobModal from '@/components/v2/NewJobModal';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Parallel Data Fetching from Supabase
  const [{ data: leads }, { data: invoices }, { data: jobs }] = await Promise.all([
    supabase.from('leads').select('status'),
    supabase.from('invoices').select('amount, status'),
    supabase.from('jobs').select('*, customers(name)')
  ])

  // 2. Analytics Calculation Logic
  const collectedRevenue = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0
  const outstandingRevenue = invoices?.filter(inv => inv.status === 'unpaid').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0
  const totalLeads = leads?.length || 0
  const convertedLeads = leads?.filter(l => l.status === 'converted').length || 0
  const winRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0
  const activeJobsCount = jobs?.filter(j => j.status !== 'completed' && j.status !== 'invoiced').length || 0

  const formattedJobs = jobs?.map(j => {
    const cust = j.customers as any;
    const custName = Array.isArray(cust) ? cust[0]?.name : cust?.name;
    return { ...j, customer_name: custName || 'Unknown Client' };
  }) || []

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
      
      {/* 1. TOP HEADER & BRIEFING */}
      {/* 1. TOP HEADER & BRIEFING */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic dark:text-white">COMMAND CENTER</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Real-time AI Operations</p>
        </div>
        
        {/* We place the New Job Modal trigger right here! */}
        <div className="flex items-center justify-end">
          <NewJobModal />
        </div>
      </header>

      <DailyBriefing jobs={formattedJobs} />

      {/* 2. THE INTELLIGENCE GRID (High Priority) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* LEFT COLUMN: Revenue & Map */}
        <div className="lg:col-span-2 space-y-6">
          <RevenueForecast /> 
          
          {/* Mobile vs Desktop Map Logic */}
          <div className="md:hidden">
            <MobileMapTeaser />
          </div>
          <div className="hidden md:block">
            <MapWrapper />
          </div>
        </div> {/* <-- FIX: This was the missing closing div! */}

        {/* RIGHT COLUMN: AI Tasks & Feed */}
        <div className="space-y-6">
          <ConflictResolver />
          <ActivityFeed />
        </div>
        
      </div>

      {/* 3. KPI SCORECARDS (Wrapper is now just a grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <StatCard title="Collected" value={collectedRevenue} icon={<DollarSign size={18}/>} color="green" isCurrency />
         <StatCard title="Outstanding" value={outstandingRevenue} icon={<AlertCircle size={18}/>} color="red" isCurrency />
         <StatCard title="Win Rate" value={`${winRate}%`} icon={<TrendingUp size={18}/>} color="blue" />
         <StatCard title="Active Jobs" value={activeJobsCount} icon={<Briefcase size={18}/>} color="amber" />
      </div>

      {/* 4. OPERATIONAL TOOLS (Wrapper is now just a grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <MissedCallInbox />
        <QuickQuote />
        <MagicSetup />
      </div>

      {/* 5. MASTER CALENDAR */}
      <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-soft transition-all hover:shadow-float p-6 md:p-8">
        <h2 className="text-lg font-black tracking-tight uppercase mb-8 dark:text-white pl-2">Master Schedule</h2>
        <JobCalendar jobs={formattedJobs} />
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color, isCurrency }: any) {
  const colors: any = {
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    red: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    blue: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  }
  
  return (
    // THE FIX: Added shadow-soft, hover:shadow-float, and transition-all here!
    <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 p-6 rounded-[2rem] shadow-soft transition-all duration-300 hover:shadow-float hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${colors[color]}`}>{icon}</div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
      </div>
      <p className="text-2xl font-black dark:text-white">
        {isCurrency ? `$${value.toLocaleString()}` : value}
      </p>
    </div>
  )
}