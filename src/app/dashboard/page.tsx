import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DollarSign, Briefcase, Repeat, FileText, Plus, Users, Calendar as CalendarIcon, ArrowRight, Clock, MapPin, AlertCircle, TrendingUp } from 'lucide-react';

// --- ALL YOUR COMPONENTS ---
import JobCalendar from '@/components/JobCalendar';
import MissedCallInbox from '@/components/v2/MissedCallInbox';
import MagicSetup from '@/components/v2/MagicSetup';
import QuickQuote from '@/components/v2/QuickQuote';
import ActivityFeed from '@/components/v2/ActivityFeed';
import ConflictResolver from '@/components/v2/ConflictResolver';

export const revalidate = 0;

export default async function DashboardHomePage() {
  const supabase = await createClient();

  // 1. Parallel Data Fetching
  const [
    { data: leads }, 
    { data: invoices }, 
    { data: allJobs },
    { count: activeJobsCount },
    { data: todayJobs }
  ] = await Promise.all([
    supabase.from('leads').select('status'),
    supabase.from('invoices').select('amount, status'),
    supabase.from('jobs').select('*, customers(name)'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
    supabase.from('jobs').select('*, customers(*)').order('scheduled_at', { ascending: true }).limit(5)
  ]);

  // 2. Analytics Calculation Logic
  const collectedRevenue = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0;
  const outstandingRevenue = invoices?.filter(inv => inv.status === 'pending' || inv.status === 'unpaid').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0;
  
  const totalLeads = leads?.length || 0;
  const convertedLeads = leads?.filter(l => l.status === 'converted').length || 0;
  const winRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  // 3. FIX THE CALENDAR DATES HERE
  const formattedJobs = allJobs?.map(j => {
    const cleanDate = j.scheduled_at ? j.scheduled_at.split('T')[0] : '';
    return {
      id: j.id,
      title: j.service_type || 'Service Call',
      date: cleanDate, 
      status: j.status
    };
  }) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back, Admin</h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">Here's what's happening with your business today.</p>
      </div>

      {/* 2. DYNAMIC METRICS OVERVIEW */}
      {/* grid-cols-2 on mobile (side by side), grid-cols-4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-[#12161D] p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Revenue</h3>
            <div className="p-2 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-xl"><DollarSign size={16} /></div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">${collectedRevenue.toLocaleString()}</p>
          <p className="text-[10px] sm:text-xs font-bold text-green-500 mt-2">Collected to date</p>
        </div>

        <div className="bg-white dark:bg-[#12161D] p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Unpaid</h3>
            <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-xl"><FileText size={16} /></div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">${outstandingRevenue.toLocaleString()}</p>
          <p className="text-[10px] sm:text-xs font-bold text-amber-500 mt-2">Awaiting payment</p>
        </div>

        <div className="bg-white dark:bg-[#12161D] p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Active</h3>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl"><Briefcase size={16} /></div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{activeJobsCount || 0}</p>
          <p className="text-[10px] sm:text-xs font-bold text-indigo-500 mt-2">Currently scheduled</p>
        </div>

        <div className="bg-white dark:bg-[#12161D] p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Win Rate</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl"><TrendingUp size={16} /></div>
          </div>
          <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{winRate}%</p>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 mt-2">From {totalLeads} total leads</p>
        </div>
      </div>

      {/* 3. THE MAIN SPLIT GRID (1 col mobile, 3 cols desktop) */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-4 lg:mt-8">  
        {/* LEFT COLUMN: Quick Actions (1 Span on Desktop) */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/dashboard/customers" className="flex items-center p-4 bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-2xl hover:border-blue-500 transition-colors group shadow-sm">
                <div className="p-3 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl mr-4">
                  <Users size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">New Customer</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Add a client to CRM</p>
                </div>
                <Plus size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </Link>

              <Link href="/dashboard/jobs" className="flex items-center p-4 bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-2xl hover:border-blue-500 transition-colors group shadow-sm">
                <div className="p-3 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl mr-4">
                  <CalendarIcon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Schedule Job</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Create a work order</p>
                </div>
                <Plus size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </Link>
            </div>
          </div>

          <ConflictResolver />
        </div>

        {/* RIGHT COLUMN: Daily Dispatch & Activity (2 Spans on Desktop) */}
        <div className="space-y-4 lg:space-y-6">
          
          {/* Dispatch Widget */}
          <div>
            <div className="flex items-center justify-between pl-2 mb-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Daily Dispatch</h2>
              <Link href="/dashboard/jobs" className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors">
                View All <ArrowRight size={12} />
              </Link>
            </div>

            <div className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-[2rem] p-4 sm:p-6 shadow-sm">
              {todayJobs && todayJobs.length > 0 ? (
                <div className="space-y-4">
                  {todayJobs.map((job) => {
                    const customer = Array.isArray(job.customers) ? job.customers[0] : job.customers;
                    return (
                      <Link href={`/dashboard/jobs/${job.id}`} key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-[#0B0E14] rounded-2xl border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-colors group">
                        <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
                          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 leading-none">
                              {new Date(job.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-sm font-black text-slate-900 dark:text-white leading-none mt-0.5">
                              {new Date(job.scheduled_at).getDate()}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">
                              {customer?.name || 'Unknown Customer'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                <Briefcase size={12} /> {job.service_type || 'Service Call'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-center ${
                          job.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                          job.status === 'invoiced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                        }`}>
                          {job.status?.replace('_', ' ') || 'Scheduled'}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Clear schedule!</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">You have no jobs pending for today.</p>
                </div>
              )}
            </div>
          </div>
          
          <ActivityFeed />

        </div>
      </div>

      {/* 4. FIELD OPERATIONS (1 col mobile, 3 cols desktop) */}
      <div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 mb-4">Field Operations & AI Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MissedCallInbox />
          <QuickQuote />
          <MagicSetup />
        </div>
      </div>

      {/* 5. MASTER CALENDAR */}
      <div className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-2xl sm:rounded-[2.5rem] shadow-sm p-4 sm:p-8 overflow-hidden">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-8">Master Schedule</h2>
        {/* Added overflow-x-auto so the calendar can scroll side-to-side on mobile without breaking the page */}
        <div className="overflow-x-auto custom-scrollbar pb-4">
          <div className="min-w-[700px]">
            <JobCalendar jobs={formattedJobs} />
          </div>
        </div>
      </div>

    </div>
  );
}