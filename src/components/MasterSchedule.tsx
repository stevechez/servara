// src/components/MasterSchedule.tsx
import { Calendar, Clock } from 'lucide-react';

interface Job {
  id: string;
  customer_name: string | null;
  title: string | null;
  service_type: string | null;
  status: string;
  scheduled_date: string | null;
  scheduled_at: string | null;
}

export default function MasterSchedule({ jobs }: { jobs: Job[] }) {
  // Helper to format the date (e.g., "MAR 14")
  const formatShortDate = (dateString: string | null) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  // Helper to get a nice display date string
  const getDisplayDate = (dateString: string | null) => {
    if (!dateString) return 'Unscheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase italic">
        Master Schedule
      </h2>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-100 py-10 text-center">
            <p className="text-xs font-bold text-slate-400">No jobs scheduled yet.</p>
          </div>
        ) : (
          jobs.map((job) => {
            const customerName = job.customer_name || 'New Customer';
            const jobTitle = job.title || job.service_type || 'Standard Service';

            return (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-blue-500/30 hover:shadow-md"
              >
                <div className="flex items-center gap-5">
                  {/* Clean Date Badge instead of the "??" */}
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
                    <span className="text-[10px] font-black text-blue-600 uppercase">
                      {job.scheduled_date
                        ? new Date(job.scheduled_date).toLocaleDateString('en-US', {
                            month: 'short',
                          })
                        : 'TBD'}
                    </span>
                    <span className="text-xl leading-none font-black text-slate-900">
                      {job.scheduled_date ? new Date(job.scheduled_date).getDate() : '--'}
                    </span>
                  </div>

                  {/* Main Info */}
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-slate-900">
                      {customerName} — {jobTitle}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {getDisplayDate(job.scheduled_date)}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">Status: {job.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Status Pill */}
                <div
                  className={`rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase ${
                    job.status.toUpperCase() === 'NEXT'
                      ? 'bg-orange-500/10 text-orange-600'
                      : 'bg-blue-500/10 text-blue-600'
                  }`}
                >
                  {job.status.replace('_', ' ')}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
