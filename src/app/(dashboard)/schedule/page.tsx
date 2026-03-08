import { createClient } from '@/lib/supabase/server';
import JobCalendar from '@/components/JobCalendar'; 
import NewJobModal from '@/components/v2/NewJobModal'; // Let's put the dispatch button here too!

export const revalidate = 0;

export default async function SchedulePage() {
  const supabase = await createClient();
  
  // Fetch all jobs, ordered by date
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, customers(name)')
    .order('scheduled_date', { ascending: true });

  // Format the jobs so the calendar can read the customer name
  const formattedJobs = jobs?.map(j => {
    const cust = j.customers as any;
    const custName = Array.isArray(cust) ? cust[0]?.name : cust?.name;
    return { ...j, customer_name: custName || 'Unknown Client' };
  }) || [];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-24 md:pb-8">
      
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic dark:text-white">MASTER SCHEDULE</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage your field team's calendar and upcoming dispatches.</p>
        </div>
        
        {/* Easy access to dispatch a new job right from the calendar */}
        <div className="flex items-center justify-end">
          <NewJobModal />
        </div>
      </header>

      {/* FULL PAGE CALENDAR CONTAINER */}
      <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm p-8 min-h-[600px]">
        <JobCalendar jobs={formattedJobs} />
      </div>
      
    </div>
  );
}