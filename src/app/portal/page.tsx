import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

export const revalidate = 0; // Ensures we always grab a fresh ID

export default async function ClientPortalSearchPage() {
  const supabase = await createClient();

  // 1. Fetch exactly ONE working job ID for the demo hint
  const { data: demoJob } = await supabase.from('jobs').select('id').limit(1).single();

  // 2. Server Action to handle the form submission
  async function handleSearch(formData: FormData) {
    'use server';

    // The input MUST have name="jobId" for this to work
    const jobId = formData.get('jobId')?.toString().trim();

    if (jobId) {
      redirect(`/portal/${jobId}`);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 dark:bg-[#0B0E14]">
      {/* Main Card */}
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Track Your Project
        </h1>
        <p className="mb-8 text-sm font-medium text-slate-500 dark:text-slate-400">
          Enter your Job ID to see live updates, photos, and invoices.
        </p>

        <form action={handleSearch} className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              name="jobId" /* <-- THIS IS REQUIRED FOR THE BUTTON TO WORK */
              required
              placeholder="e.g. #88241"
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pr-4 pl-12 text-sm font-bold text-slate-900 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B1021] py-4 text-[12px] font-black tracking-widest text-white uppercase transition-all hover:bg-blue-600 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white"
          >
            Find My Project
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* BEAUTIFUL DEMO HELPER */}
        {demoJob?.id && (
          <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 py-5 text-center dark:bg-white/5">
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              For Demo Purpose
            </span>
            {/* The 'select-all' class makes it copyable with a single click */}
            <code className="rounded-lg bg-white px-3 py-2 font-mono text-xs font-bold text-blue-600 shadow-sm transition-colors select-all hover:bg-blue-50 dark:bg-black/50 dark:text-blue-400">
              {demoJob.id}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
