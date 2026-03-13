'use client';

import { useState } from 'react';
import { Clock, UserPlus, Briefcase, Zap, Star, CheckCircle2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import CustomerProfileSlideover from './CustomerProfileSlideover';

interface ActivityFeedProps {
  jobs: any[];
  leads: any[];
}

export default function ActivityFeed({ jobs, leads }: ActivityFeedProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Merge and sort all events by date
  const activity = [
    ...jobs.map((j) => ({ ...j, type: 'job' })),
    ...leads.map((l) => ({ ...l, type: 'lead' })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at || b.updated_at).getTime() -
        new Date(a.created_at || a.updated_at).getTime()
    )
    .slice(0, 8);

  return (
    <div className="shadow-soft rounded-[2.5rem] border border-slate-200 bg-white p-6 dark:border-white/5 dark:bg-[#12161D]">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase italic">
          Live Pulse
        </h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black text-emerald-500 uppercase">Live</span>
        </div>
      </div>

      <div className="space-y-6">
        {activity.map((item) => {
          const isReview = item.customer_rating > 0;
          const isLead = item.type === 'lead';

          return (
            <div key={`${item.type}-${item.id}`} className="group relative flex gap-4">
              {/* DYNAMIC ICON BLOCK */}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-white shadow-sm transition-transform group-hover:scale-110 dark:border-[#12161D] ${
                  isReview
                    ? 'bg-yellow-500 text-white'
                    : isLead
                      ? 'animate-pulse bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-500 dark:bg-white/5'
                }`}
              >
                {isReview ? (
                  <Star size={16} fill="currentColor" />
                ) : isLead ? (
                  <UserPlus size={16} />
                ) : (
                  <Briefcase size={16} />
                )}
              </div>

              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm leading-tight font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
                      {isReview ? 'New 5-Star Review!' : isLead ? 'Inbound Lead' : 'Job Dispatched'}
                    </p>

                    {/* CONTENT LOGIC */}
                    {isReview ? (
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500 italic">
                        "{item.customer_feedback}" — {item.customers?.name}
                      </p>
                    ) : isLead ? (
                      <p className="mt-1 text-xs font-bold tracking-tighter text-blue-600 uppercase">
                        {item.name} via Landing Page
                      </p>
                    ) : (
                      <button
                        onClick={() => setSelectedCustomerId(item.customer_id)}
                        className="mt-1 block text-left text-xs font-bold text-slate-500 transition-colors hover:text-blue-600"
                      >
                        {item.customers?.name || 'Client'} • {item.service_type}
                      </button>
                    )}
                  </div>

                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    {format(parseISO(item.created_at || item.updated_at), 'h:mm a')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCustomerId && (
        <CustomerProfileSlideover
          customerId={selectedCustomerId}
          isOpen={!!selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </div>
  );
}
