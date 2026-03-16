import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import ReviewForm from '@/components/review/ReviewForm';

export default async function ReviewPage({ params }: { params: { jobId: string } }) {
  const supabase = await createClient();

  // 1. Corrected 'params.id' to 'params.jobId'
  const { data: job } = await supabase
    .from('jobs')
    .select('*, customers(name)')
    .eq('id', params.jobId)
    .single();

  if (!job) notFound();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20 dark:bg-[#0B0E14]">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20">
          <Star className="text-white" size={32} fill="currentColor" />
        </div>

        <h1 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">
          Rate Your Service
        </h1>
        <p className="mt-2 text-slate-500">
          Hey {job.customers?.name?.split(' ')[0] || 'there'}, thanks for choosing Zidro Pro!
        </p>

        {/* 2. Pass the ID to the Client Component */}
        <ReviewForm jobId={params.jobId} />

        <p className="mt-8 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Powered by Zidro Pro AI
        </p>
      </div>
    </div>
  );
}
