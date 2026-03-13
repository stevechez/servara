import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Star, CheckCircle2, Send } from 'lucide-react';

export default async function PublicReviewPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Fetch job and customer info (Publicly accessible)
  const { data: job } = await supabase
    .from('jobs')
    .select('*, customers(name)')
    .eq('id', params.id)
    .single();

  if (!job) notFound();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20 dark:bg-[#0B0E14]">
      <div className="mx-auto max-w-md text-center">
        {/* Branding */}
        <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20">
          <Star className="text-white" size={32} fill="currentColor" />
        </div>

        <h1 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">
          Rate Your Service
        </h1>
        <p className="mt-2 text-slate-500">
          Hey {job.customers?.name.split(' ')[0]}, thanks for choosing Zidro Pro for your{' '}
          {job.service_type}!
        </p>

        {/* The Star Rating Component (Mock for now) */}
        <div className="mt-12 rounded-[3rem] border border-slate-200 bg-white p-10 shadow-2xl dark:border-white/5 dark:bg-[#12161D]">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="text-slate-200 transition-colors hover:text-yellow-400">
                <Star size={40} fill="currentColor" />
              </button>
            ))}
          </div>

          <textarea
            placeholder="Anything else you'd like to share?"
            className="mt-8 w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm focus:border-blue-500 focus:outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
            rows={4}
          />

          <button className="mt-6 w-full rounded-2xl bg-blue-600 py-4 font-black tracking-widest text-white uppercase shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700">
            Submit Feedback
          </button>
        </div>

        <p className="mt-8 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Powered by Zidro Pro AI
        </p>
      </div>
    </div>
  );
}
