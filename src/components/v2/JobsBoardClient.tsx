'use client';

import { MapPin, Calendar, Wrench, CheckCircle, Play, Check } from 'lucide-react';
import { updateJobStatus } from '@/app/actions/updateJobStatus';
import Link from 'next/link';

export default function JobsBoardClient({ jobs }: { jobs: any[] }) {
  // Sort jobs into their respective columns
  const scheduled = jobs.filter(j => j.status === 'scheduled' || !j.status);
  const inProgress = jobs.filter(j => j.status === 'in_progress');
  const completed = jobs.filter(j => j.status === 'completed');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[70vh]">
      {/* COLUMN 1: SCHEDULED */}
      <div className="bg-slate-50 rounded-[32px] p-4 flex flex-col gap-4 border border-slate-200/60 shadow-inner">
        <div className="flex items-center justify-between px-2 pt-2">
          <h2 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" /> Scheduled
          </h2>
          <span className="bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold">{scheduled.length}</span>
        </div>
        
        {scheduled.map(job => (
          <JobCard key={job.id} job={job} nextStatus="in_progress" actionIcon={<Play size={14} />} actionText="Start Job" color="blue" />
        ))}
      </div>

      {/* COLUMN 2: IN PROGRESS */}
      <div className="bg-blue-50/50 rounded-[32px] p-4 flex flex-col gap-4 border border-blue-100 shadow-inner">
        <div className="flex items-center justify-between px-2 pt-2">
          <h2 className="font-black text-blue-900 tracking-tight flex items-center gap-2">
            <Wrench size={18} className="text-blue-500" /> In Progress
          </h2>
          <span className="bg-blue-200 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">{inProgress.length}</span>
        </div>
        
        {inProgress.map(job => (
          <JobCard key={job.id} job={job} nextStatus="completed" actionIcon={<Check size={14} />} actionText="Mark Complete" color="green" />
        ))}
      </div>

      {/* COLUMN 3: COMPLETED */}
      <div className="bg-green-50/50 rounded-[32px] p-4 flex flex-col gap-4 border border-green-100 shadow-inner">
        <div className="flex items-center justify-between px-2 pt-2">
          <h2 className="font-black text-green-900 tracking-tight flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" /> Completed
          </h2>
          <span className="bg-green-200 text-green-700 px-2.5 py-1 rounded-lg text-xs font-bold">{completed.length}</span>
        </div>
        
        {completed.map(job => (
          <JobCard key={job.id} job={job} nextStatus="" actionIcon={null} actionText="Paid" color="slate" />
        ))}
      </div>
    </div>
  );
}

// Helper Component for the Cards
function JobCard({ job, nextStatus, actionIcon, actionText, color }: any) {
  // Bind the server action so it knows which job and status to update
  const moveAction = nextStatus ? updateJobStatus.bind(null, job.id, nextStatus) : null;
  const customer = job.customers; // Supabase joined data

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
          {new Date(job.scheduled_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
        <span className="font-black text-slate-900">${job.amount}</span>
      </div>

      <Link href={`/customers/${customer?.id}`} className="block mb-4 hover:opacity-80 transition-opacity">
        <h3 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
          {customer?.name || 'Unknown Client'}
        </h3>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
          <MapPin size={12} className="flex-shrink-0" /> {customer?.address || 'No Address'}
        </p>
      </Link>

      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
        <p className="text-xs font-bold text-slate-600 truncate mr-2">{job.service_type}</p>
        
        {moveAction ? (
          <form action={moveAction}>
            <button type="submit" className={`text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest flex items-center gap-1 transition-all ${
              color === 'blue' ? 'bg-slate-900 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-green-500'
            }`}>
              {actionText} {actionIcon}
            </button>
          </form>
        ) : (
          <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1.5 rounded-lg">
            Closed
          </span>
        )}
      </div>
    </div>
  );
}