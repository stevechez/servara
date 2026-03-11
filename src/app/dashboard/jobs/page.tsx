import { createClient } from '@/lib/supabase/server';
import JobsBoardClient from '@/components/v2/JobsBoardClient';

export const revalidate = 0;

export default async function JobsPage() {
  const supabase = await createClient();
  
  // Fetch jobs AND include the customer details in one query!
  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      *,
      customers ( id, name, address, phone )
    `)
    .order('scheduled_at', { ascending: true });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dispatch Board</h1>
          <p className="text-slate-500 text-sm font-medium">Manage today's schedule and active jobs.</p>
        </div>
        {/* We can add a "Filter by Date" dropdown here later */}
      </div>

      {/* THE KANBAN BOARD */}
      <JobsBoardClient jobs={jobs || []} />
    </div>
  );
}