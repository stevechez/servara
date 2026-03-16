import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import JobDetailView from '@/components/dashboard/JobDetailView';

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: job, error } = await supabase
    .from('jobs')
    .select(
      `
      *,
      customers (*),
      services ( name, base_price, estimated_duration_minutes ),
      technicians ( name ),
      lead_sources ( name, color_code ),
      job_costs ( labor_cost, material_cost, overhead_cost )
    `
    )
    .eq('id', id)
    .maybeSingle(); // 👈 Fixed the typo here!

  if (error) {
    return (
      <div className="h-screen bg-red-900/20 p-8 font-mono text-red-500">
        <h1>Database Error:</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="h-screen bg-amber-900/20 p-8 font-mono text-amber-500">
        <h1>Missing Data:</h1>
        <p>Could not find a job matching ID: {id}</p>
        <p className="mt-4 text-xs text-slate-400 italic">
          Hint: Try running the SQL "Data Restoration" script to recreate this test job.
        </p>
      </div>
    );
  }

  return <JobDetailView job={job} />;
}
