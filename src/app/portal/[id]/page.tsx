import { createClient } from '@/lib/supabase/server';
import { MapPin, Clock, CheckCircle2, Wrench, FileText, Calendar } from 'lucide-react';

export const revalidate = 0;

export default async function ProjectPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase.from('jobs').select('*, customers(*)').eq('id', id).single();

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center dark:bg-[#0B0E14]">
        <Wrench size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
        <h1 className="text-2xl font-black text-slate-900 uppercase italic dark:text-white">
          Project Not Found
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500">
          The ID in the URL does not match any jobs in our database.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-[#0B0E14]">
      {/* HEADER */}
      <div className="bg-[#0B1021] px-6 py-8 text-white">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-xl bg-blue-600/20 px-3 py-1.5 text-blue-400">
              <Wrench size={18} />
              <span className="font-black tracking-tight">
                Zidro <span className="italic">PRO</span>
              </span>
            </div>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Client Portal
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">Project Tracker</h1>
          <p className="mt-2 font-medium text-slate-400">Live updates for {job.customers?.name}</p>
        </div>
      </div>

      <div className="mx-auto -mt-6 max-w-2xl px-4">
        {/* STATUS CARD */}
        <div className="mb-6 rounded-[2rem] border border-slate-100 bg-white p-8 shadow-xl dark:border-white/5 dark:bg-[#12161D]">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-6 dark:border-white/5">
            <div>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Current Status
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-900 uppercase italic dark:text-white">
                {job.status}
              </h2>
            </div>
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Service
              </p>
              <p className="font-bold text-slate-900 dark:text-white">{job.service_type}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Location
              </p>
              <p className="font-bold text-slate-900 dark:text-white">{job.customers?.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
