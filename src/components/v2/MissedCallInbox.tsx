'use client';

import { useState, useEffect } from 'react';
import { PhoneMissed, MessageSquare, Play, ChevronRight, Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MissedCallInbox() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCalls() {
      const { data } = await supabase
        .from('ai_calls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) setCalls(data);
      setLoading(false);
    }
    fetchCalls();
  }, []);

  return (
    <div className="shadow-float rounded-[2.5rem] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#12161D]">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-red-500/10 p-2 text-red-500">
            <PhoneMissed size={18} />
          </div>
          <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase italic">
            AI Call Reception
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[8px] font-black text-emerald-600 uppercase">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="animate-pulse py-10 text-center text-xs font-bold tracking-widest text-slate-400 uppercase">
            Syncing AI Logs...
          </div>
        ) : calls.length === 0 ? (
          /* THE EMPTY STATE */
          <div className="group relative overflow-hidden rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-white/5 dark:bg-white/[0.02]">
            <div className="mb-4 flex justify-center">
              <Activity className="text-slate-300 dark:text-slate-700" size={32} />
            </div>
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Reception Active
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              No missed calls yet. Your AI agent is standing by.
            </p>
          </div>
        ) : (
          /* THE REAL DATA */
          calls.map((call) => (
            <div
              key={call.id}
              className="group relative flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/50 p-3 transition-all hover:bg-white hover:shadow-md dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-[#0B0E14]">
                  <Play size={14} className="fill-blue-600 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">
                    {call.customer_name || 'Unknown Caller'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">
                    {call.summary || 'Transcribing call...'}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 transition-transform group-hover:translate-x-1"
              />
            </div>
          ))
        )}
      </div>

      <button className="mt-6 w-full rounded-2xl border border-slate-100 py-3 text-[9px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:bg-slate-50 hover:text-slate-600 dark:border-white/5 dark:hover:bg-white/5">
        View Call History
      </button>
    </div>
  );
}
