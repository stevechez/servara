import { createClient } from '@/lib/supabase/server';
import JobsBoardClient from '@/components/v2/JobsBoardClient';
import MasterSchedule from '@/components/MasterSchedule';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  const supabase = await createClient();

  // 2. Fetch the jobs from your database
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Dispatch Board</h1>
        <p className="text-slate-500">Manage today's schedule and active jobs.</p>
      </div>

      {/* 3. Drop in your gorgeous new component! */}
      <MasterSchedule jobs={jobs || []} />
    </div>
  );
}
