import { Job } from '@/types';
import { siteConfig } from '@/config/site'; // Use our new config!

interface JobFeedProps {
  jobs?: Job[];
  isDemo?: boolean;
}

export const JobFeed = ({ jobs = [], isDemo = false }: JobFeedProps) => {
  // If no jobs and not a demo, show empty state
  if (jobs.length === 0 && !isDemo) {
    return (
      <div className="rounded-xl border-2 border-dashed bg-slate-50 p-8 text-center">
        <p className="text-slate-500">No live jobs yet. Start a Blitz!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{isDemo ? 'Sample Job Feed' : 'Live Activity'}</h2>
        {isDemo && (
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
            DEMO MODE
          </span>
        )}
      </div>

      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div>
            <p className="font-bold text-slate-900">{job.customer_name}</p>
            <p className="text-sm text-slate-500">
              {job.service_type} • {job.location}
            </p>
          </div>
          <div className="text-right">
            <p className="font-black text-blue-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: siteConfig.business.defaultCurrency,
              }).format(job.amount)}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{job.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
