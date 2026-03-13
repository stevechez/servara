'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

interface Job {
  id: string | number;
  scheduled_at: string | null; // Allow null
  status: string;
  customers?: {
    name: string;
  };
  title?: string;
  service_type?: string;
}

export default function JobCalendar({ jobs = [] }: { jobs: Job[] }) {
  // Sort jobs by date, handling potential nulls safely
  const sortedJobs = [...jobs].sort((a, b) => {
    const dateA = a.scheduled_at ? new Date(a.scheduled_at).getTime() : 0;
    const dateB = b.scheduled_at ? new Date(b.scheduled_at).getTime() : 0;
    return dateA - dateB;
  });

  return (
    <div className="space-y-4">
      {sortedJobs.map((job) => {
        const displayCustomer = job.customers?.name || 'Unknown Customer';
        const displayService = job.service_type || job.title || 'Standard Service';

        // 1. Bulletproof Date Logic
        let dateLabel = 'Unscheduled';
        let dayDisplay = '--';
        let monthDisplay = '??';

        if (job.scheduled_at) {
          try {
            const parsedDate = parseISO(job.scheduled_at);
            dateLabel = format(parsedDate, 'MMM d, h:mm a');
            dayDisplay = format(parsedDate, 'd');
            monthDisplay = format(parsedDate, 'MMM');
          } catch (e) {
            console.error('Date parsing failed for:', job.scheduled_at);
            dateLabel = 'Invalid Date';
          }
        }

        return (
          <Link
            key={job.id}
            href={`/dashboard/jobs/${job.id}`}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:scale-[1.01] hover:border-blue-500/30 hover:bg-white hover:shadow-lg dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className="flex items-center gap-4">
              {/* DATE ICON */}
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-white font-black shadow-sm dark:bg-[#0B0E14]">
                <span className="text-[10px] text-blue-600 uppercase">{monthDisplay}</span>
                <span className="text-lg leading-none dark:text-white">{dayDisplay}</span>
              </div>

              {/* TEXT INFO */}
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {displayCustomer} — {displayService}
                </p>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {dateLabel} • Status: {job.status}
                </p>
              </div>
            </div>

            {/* STATUS BADGE */}
            <div
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                job.status === 'scheduled'
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'bg-slate-500/10 text-slate-500'
              }`}
            >
              {job.status}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
