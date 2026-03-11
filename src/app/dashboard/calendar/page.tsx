import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default async function CalendarPage() {
  const supabase = await createClient();
  
  // 1. Fetch all jobs and join customers
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, customers(name, address)')
    .order('scheduled_at', { ascending: true });

  // 2. Generate the 7 days of the current week
  const today = new Date();
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    // Adjusting to start the week on Monday
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) + i;
    d.setDate(diff);
    return d;
  });

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="text-blue-600" /> Weekly Dispatch
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • Week {getWeekNumber(today)}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"><ChevronLeft size={20}/></button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm">Today</button>
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"><ChevronRight size={20}/></button>
        </div>
      </div>

      {/* THE CALENDAR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-[600px]">
        {week.map((date) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayJobs = jobs?.filter(j => j.scheduled_at?.startsWith(dateStr)) || [];
          
          // CALCULATE DAY TOTAL
          const dayRevenue = dayJobs.reduce((sum, j) => sum + (Number(j.amount) || 0), 0);
          const isToday = date.toDateString() === today.toDateString();

          return (
            <div 
              key={dateStr} 
              className={`rounded-[32px] border p-4 flex flex-col gap-4 transition-all ${
                isToday ? 'bg-blue-50/50 border-blue-200 shadow-inner' : 'bg-white border-slate-200'
              }`}
            >
              {/* Date Header */}
              <div className="text-center pb-2 border-b border-slate-100">
                <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`text-xl font-black ${isToday ? 'text-blue-700' : 'text-slate-900'}`}>
                  {date.getDate()}
                </p>
              </div>

              {/* Jobs List */}
              <div className="space-y-3 flex-1">
                {dayJobs.length === 0 ? (
                  <div className="h-full flex items-center justify-center opacity-20 italic text-[10px] text-slate-400">No Jobs</div>
                ) : (
                  dayJobs.map(job => (
                    <div key={job.id} className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter mb-1 truncate">
                        {job.customers?.name || 'Unknown Client'}
                      </p>
                      <p className="text-xs font-bold text-slate-900 leading-tight mb-2 line-clamp-2">
                        {job.service_type}
                      </p>
                      <div className="flex justify-between items-center border-t border-slate-50 pt-2">
                        <span className="text-[10px] font-black text-slate-400">${job.amount}</span>
                        <div className={`h-1.5 w-1.5 rounded-full ${job.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* REVENUE FOOTER */}
              {dayRevenue > 0 && (
                <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily Total</p>
                  <p className="text-xs font-black text-slate-900">${dayRevenue.toLocaleString()}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function for week numbers
function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
