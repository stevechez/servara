import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign } from 'lucide-react';

export default async function CalendarPage() {
  const supabase = await createClient();

  // 1. Fetch all jobs and join customers
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, customers(name, address)')
    .order('scheduled_at', { ascending: true });

  // 2. Generate the 7 days of the current week (Monday start)
  const today = new Date();
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) + i;
    d.setDate(diff);
    return d;
  });

  return (
    /* FIX: Added bg-slate-50 to create contrast against the white cards */
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-6 p-4 md:p-8">
      {/* HEADER: Apple-style floating header */}
      <div className="shadow-soft flex flex-col justify-between gap-4 rounded-[2.5rem] border border-slate-200 bg-white p-6 md:flex-row md:items-center dark:border-white/5 dark:bg-[#12161D]">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600">
              <CalendarIcon size={24} />
            </div>
            Weekly Dispatch
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • Week{' '}
            {getWeekNumber(today)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-all hover:bg-slate-50 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5">
            <ChevronLeft size={20} />
          </button>
          <button className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-black tracking-widest text-white uppercase transition-all active:scale-95 dark:bg-white dark:text-slate-900">
            Today
          </button>
          <button className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-all hover:bg-slate-50 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* THE CALENDAR GRID: Fixed white-on-white by adjusting borders and day backgrounds */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
        {week.map((date) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayJobs = jobs?.filter((j) => j.scheduled_at?.startsWith(dateStr)) || [];
          const dayRevenue = dayJobs.reduce((sum, j) => sum + (Number(j.amount) || 0), 0);
          const isToday = date.toDateString() === today.toDateString();

          return (
            <div
              key={dateStr}
              /* FIX: Day container now has clear separation */
              className={`flex min-h-[500px] flex-col rounded-[2.5rem] border p-4 shadow-sm transition-all ${
                isToday
                  ? 'border-blue-500 bg-blue-50/30 shadow-blue-500/10 dark:bg-blue-500/5'
                  : 'border-slate-200 bg-white/60 backdrop-blur-sm dark:border-white/5 dark:bg-[#12161D]/60'
              }`}
            >
              {/* Date Header */}
              <div className="mb-4 text-center">
                <p
                  className={`mb-1 text-[10px] font-black tracking-widest uppercase ${isToday ? 'text-blue-600' : 'text-slate-400'}`}
                >
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p
                  className={`text-2xl font-black ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}
                >
                  {date.getDate()}
                </p>
              </div>

              {/* Jobs List */}
              <div className="flex-1 space-y-3">
                {dayJobs.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-[10px] font-bold tracking-widest text-slate-300 uppercase dark:text-slate-700">
                    No Jobs
                  </div>
                ) : (
                  dayJobs.map((job) => (
                    /* FIX: Job card now has 'shadow-soft' and distinct borders */
                    <div
                      key={job.id}
                      className="group shadow-soft hover:shadow-float rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-blue-500/50 dark:border-white/5 dark:bg-[#1C232D]"
                    >
                      <p className="mb-1 truncate text-[10px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
                        {job.customers?.name || 'Unknown Client'}
                      </p>
                      <p className="mb-3 line-clamp-2 text-xs leading-snug font-bold text-slate-900 dark:text-white">
                        {job.service_type}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-3 dark:border-white/5">
                        <span className="flex items-center gap-0.5 text-[10px] font-black text-slate-400">
                          <DollarSign size={10} />
                          {job.amount}
                        </span>
                        <div
                          className={`h-1.5 w-1.5 rounded-full ring-4 ${
                            job.status === 'completed'
                              ? 'bg-emerald-500 ring-emerald-500/10'
                              : 'bg-amber-500 ring-amber-500/10'
                          }`}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* REVENUE FOOTER */}
              {dayRevenue > 0 && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
                  <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    Total
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    ${dayRevenue.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
