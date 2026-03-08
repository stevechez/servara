import { createClient } from '@/lib/supabase/server'
import { DollarSign, TrendingUp, AlertCircle, Briefcase } from 'lucide-react'
import JobCalendar from '@/components/JobCalendar'
import MissedCallInbox from '@/components/v2/MissedCallInbox';
import RouteMap from '@/components/v2/RouteMap';
import MagicSetup from '@/components/v2/MagicSetup';
import QuickQuote from '@/components/v2/QuickQuote';
import RevenueForecast from '@/components/v2/RevenueForecast';
import DailyBriefing from '@/components/v2/DailyBriefing';
import ServiceMap from '@/components/v2/ServiceMap';
import ConflictResolver from '@/components/v2/ConflictResolver';
import ActivityFeed from '@/components/v2/ActivityFeed';
import MobileMapTeaser from '@/components/v2/MobileMapTeaser'; 

export const revalidate = 0 

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Parallel Data Fetching
  const [{ data: leads }, { data: invoices }, { data: jobs }] = await Promise.all([
    supabase.from('leads').select('status'),
    supabase.from('invoices').select('amount, status'),
    supabase.from('jobs').select('*, customers(name)')
  ])

  // 2. Analytics Logic
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
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* NOTE: We removed <Sidebar /> from here because it's now handled by 
         your (dashboard)/layout.tsx wrapper. This prevents duplicate sidebars.
      */}

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
          
          {/* HEADER SECTION */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight italic">COMMAND CENTER</h1>
              <p className="text-muted text-sm font-medium">Real-time AI Operations</p>
            </div>
          </header>

          {/* 1. AI DAILY BRIEFING (Full Width) */}
          <DailyBriefing jobs={[]} />
          {/* <DailyBriefing jobs={formattedJobs} /> */}

          {/* 2. THE MAIN INTELLIGENCE GRID (Revenue, Map, Conflicts) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Col: Money & Vision */}
            <div className="lg:col-span-2 space-y-6">
              <RevenueForecast /> 
              
              {/* Responsive Map Strategy */}
              <div className="md:hidden">
                <MobileMapTeaser />
              </div>
              <div className="hidden md:block">
                <ServiceMap />
              </div>
            </div>

            {/* Right Col: Priority Action & Feed */}
            <div className="space-y-6">
              <ConflictResolver />
              <ActivityFeed />
            </div>
          </div>

          {/* 3. KPI GRID (Now using the Global Theme variables) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <StatCard title="Collected" value={collectedRevenue} icon={<DollarSign size={18}/>} color="green" isCurrency />
             <StatCard title="Outstanding" value={outstandingRevenue} icon={<AlertCircle size={18}/>} color="red" isCurrency />
             <StatCard title="Win Rate" value={`${winRate}%`} icon={<TrendingUp size={18}/>} color="blue" />
             <StatCard title="Active Jobs" value={activeJobsCount} icon={<Briefcase size={18}/>} color="amber" />
          </div>

          {/* 4. UTILITY SECTION: SMS, Quotes, Setup */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MissedCallInbox />
            <QuickQuote />
            <MagicSetup />
          </div>

          {/* 5. MASTER SCHEDULE (Bottom) */}
          <div className="bg-card border border-card-border rounded-[2.5rem] shadow-sm p-8">
            <div className="flex items-center gap-2 mb-8">
               <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
               <h2 className="text-lg font-black tracking-tight uppercase">Master Schedule</h2>
            </div>
            <JobCalendar jobs={formattedJobs} />
          </div>

        </div>
      </main>
    </div>
  )
}

/**
 * REUSABLE STAT CARD COMPONENT
 * Updated to use CSS variables for Dark Mode support
 */
function StatCard({ title, value, icon, color, isCurrency, subtitle }: any) {
  const colors: any = {
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    red: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    blue: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  }
  
  return (
    <div className="bg-card border border-card-border p-6 rounded-[2rem] shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${colors[color]}`}>{icon}</div>
        <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <p className="text-2xl font-black">
        {isCurrency ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}` : value}
      </p>
      {subtitle && <p className="text-[10px] text-muted font-bold mt-1 italic">{subtitle}</p>}
    </div>
  )
}