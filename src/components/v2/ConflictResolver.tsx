'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Zap, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'; // Added ArrowRight
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface ConflictResolverProps {
  jobs: any[];
}

export default function ConflictResolver({ jobs }: ConflictResolverProps) {
  const [conflict, setConflict] = useState<any>(null);
  const [resolving, setResolving] = useState(false);
  const [done, setDone] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // LOGIC: Scans the jobs prop for real overlaps
  useEffect(() => {
    const findConflict = () => {
      if (!jobs || jobs.length === 0) return null;
      for (let i = 0; i < jobs.length; i++) {
        for (let j = i + 1; j < jobs.length; j++) {
          const timeA = new Date(jobs[i].scheduled_at).getTime();
          const timeB = new Date(jobs[j].scheduled_at).getTime();
          const diffMinutes = Math.abs(timeA - timeB) / (1000 * 60);

          if (
            diffMinutes < 60 &&
            jobs[i].status !== 'completed' &&
            jobs[j].status !== 'completed'
          ) {
            return { jobA: jobs[i], jobB: jobs[j] };
          }
        }
      }
      return null;
    };
    setConflict(findConflict());
  }, [jobs]);

  const handleResolve = async () => {
    if (!conflict) return;
    setResolving(true);

    // AI Logic: Push the second job back by 2 hours
    const newTime = new Date(new Date(conflict.jobB.scheduled_at).getTime() + 2 * 60 * 60 * 1000);

    const { error } = await supabase
      .from('jobs')
      .update({ scheduled_at: newTime.toISOString() })
      .eq('id', conflict.jobB.id);

    if (!error) {
      setDone(true);
      router.refresh();
      setTimeout(() => {
        setDone(false);
        setConflict(null);
        setResolving(false);
      }, 3000);
    }
  };

  // SUCCESS STATE
  if (done) {
    return (
      <div className="animate-in fade-in zoom-in rounded-[2.5rem] border border-emerald-100 bg-emerald-50/50 p-6 duration-500 dark:border-emerald-500/20 dark:bg-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-emerald-500 p-2 text-white">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-sm leading-tight font-black tracking-tight text-emerald-900 uppercase dark:text-emerald-400">
              Schedule Optimized
            </p>
            <p className="mt-1 text-xs font-bold text-emerald-700/70 dark:text-emerald-500/50">
              All overlaps resolved for today.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // IDLE STATE (If no conflict found)
  if (!conflict) return null;

  // CONFLICT DETECTED UI
  return (
    <div className="group shadow-soft relative overflow-hidden rounded-[2.5rem] border border-amber-200 bg-white p-6 transition-all hover:border-amber-500/50 dark:border-amber-500/20 dark:bg-[#12161D]">
      <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl transition-all group-hover:bg-amber-500/20" />

      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={20} className="animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900 italic dark:text-white">
            Conflict Detected
          </h2>
          <p className="mt-0.5 text-[10px] font-black tracking-widest text-amber-600/80 uppercase">
            Schedule Collision
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {conflict.jobA.customers?.name || 'Client A'}
            </p>
            <span className="text-[10px] font-black text-slate-400">
              {new Date(conflict.jobA.scheduled_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="my-2 ml-1.5 h-4 border-l-2 border-dashed border-amber-500/20" />
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-amber-600">
              {conflict.jobB.customers?.name || 'Client B'}
            </p>
            <span className="text-[10px] font-black text-amber-600">
              {new Date(conflict.jobB.scheduled_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
        <p className="px-1 text-[11px] leading-relaxed font-medium text-slate-500 dark:text-slate-400">
          AI suggests moving{' '}
          <span className="font-bold text-slate-900 underline decoration-amber-500 dark:text-white">
            {conflict.jobB.customers?.name}
          </span>{' '}
          back to clear the schedule gap.
        </p>
      </div>

      <button
        onClick={handleResolve}
        disabled={resolving}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 py-4 text-[10px] font-black tracking-[0.2em] text-white uppercase shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-95"
      >
        {resolving ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Zap size={14} fill="currentColor" /> Auto-Reschedule <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}
