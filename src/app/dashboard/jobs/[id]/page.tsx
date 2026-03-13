import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  Briefcase,
  FileText,
  CheckCircle,
  CheckCircle2,
  TrendingUp,
  Star,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import CompleteJobButton from '@/components/v2/CompleteJobButton';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Fetch job with customer data joined
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*, customers(*)')
    .eq('id', params.id)
    .single();

  if (error || !job) notFound();

  const scheduledDate = job.scheduled_at ? parseISO(job.scheduled_at) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. BACK BUTTON & HEADER */}
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-blue-600"
      >
        <ChevronLeft size={14} /> Back to Command Center
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black uppercase italic dark:text-white">
              {job.service_type || 'General Service'}
            </h1>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black text-blue-600 uppercase">
              {job.status}
            </span>
          </div>
          <p className="mt-2 font-medium text-slate-500">
            Job ID: #{job.id.toString().substring(0, 8)}
          </p>
        </div>

        <CompleteJobButton jobId={job.id} isCompleted={job.status === 'completed'} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Job Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* DESCRIPTION CARD */}
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 dark:border-white/5 dark:bg-[#12161D]">
            <h2 className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              <FileText size={14} /> Job Description
            </h2>
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {job.description || 'No notes provided for this job.'}
            </p>
          </div>

          {/* REPUTATION MANAGEMENT SECTION */}
          {job.status === 'completed' && (
            <div className="rounded-[2.5rem] border border-blue-100 bg-blue-50/50 p-8 dark:border-blue-500/10 dark:bg-blue-500/5">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-600 uppercase">
                    <Star size={14} fill="currentColor" /> Reputation Growth
                  </h2>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Job finished! Send a 5-star review request to {job.customers?.name}.
                  </p>
                </div>

                {job.review_request_sent ? (
                  <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-6 py-3 text-[10px] font-black text-emerald-600 uppercase">
                    <CheckCircle2 size={16} /> Request Sent
                  </div>
                ) : (
                  <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-[10px] font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95">
                    Send Review SMS
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ACTIVITY / TIMELINE */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/50 p-8 dark:border-white/5 dark:bg-white/5">
            <h2 className="mb-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Activity Log
            </h2>
            <div className="flex items-center gap-4 border-l-2 border-blue-500/20 pl-6">
              <div className="-ml-[1.55rem] h-2 w-2 rounded-full bg-blue-500" />
              <p className="text-xs font-bold text-slate-500">
                Job created and scheduled for{' '}
                {scheduledDate ? format(scheduledDate, 'PPPP') : 'unscheduled'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer & Logistics */}
        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#12161D]">
            <h2 className="mb-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Customer Info
            </h2>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600">
                  <Briefcase size={18} />
                </div>
                <p className="font-black dark:text-white">{job.customers?.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-slate-500/10 p-2 text-slate-400">
                  <Phone size={18} />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {job.customers?.phone}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-slate-500/10 p-2 text-slate-400">
                  <MapPin size={18} />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {job.customers?.address}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#12161D]">
            <h2 className="mb-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Schedule
            </h2>
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-sm font-black dark:text-white">
                  {scheduledDate ? format(scheduledDate, 'h:mm a') : 'TBD'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  {scheduledDate ? format(scheduledDate, 'EEEE, MMM do') : 'Date Unset'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
