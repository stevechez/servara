'use client';

import { useState } from 'react';
import { Clock, UserPlus, Briefcase, Zap } from 'lucide-react';
import CustomerProfileSlideover from './CustomerProfileSlideover';

interface ActivityFeedProps {
  jobs: any[];
  leads: any[];
}

export default function ActivityFeed({ jobs, leads }: ActivityFeedProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const activity = [
    ...jobs.map((j) => ({ ...j, type: 'job' })),
    ...leads.map((l) => ({ ...l, type: 'lead' })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return (
    <div className="shadow-soft rounded-[2.5rem] border border-slate-200 bg-white p-6 dark:border-white/5 dark:bg-[#12161D]">
      {/* Header logic remains the same */}
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
        {activity.map((item) => (
          <div key={`${item.type}-${item.id}`} className="group relative flex gap-4">
            {/* ICON BLOCK */}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-white shadow-sm transition-transform group-hover:scale-110 dark:border-[#12161D] ${
                item.type === 'lead'
                  ? 'animate-pulse bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500 dark:bg-white/5'
              }`}
            >
              {item.type === 'lead' ? <UserPlus size={16} /> : <Briefcase size={16} />}
            </div>

            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm leading-tight font-bold text-slate-900 dark:text-white">
                    {item.type === 'lead' ? 'New Inbound Lead' : 'Job Dispatched'}
                  </p>

                  {/* ITEM-SPECIFIC UI */}
                  {item.type === 'job' ? (
                    <button
                      onClick={() => {
                        setSelectedCustomerId(item.customer_id);
                        if (item.lat && item.lng) {
                          const url = new URL(window.location.href);
                          url.searchParams.set('lat', item.lat.toString());
                          url.searchParams.set('lng', item.lng.toString());
                          window.history.pushState({}, '', url);
                        }
                      }}
                      className="mt-0.5 block text-left text-xs font-medium text-blue-600 hover:underline"
                    >
                      {item.customers?.name || 'Client'} • {item.service_type}
                    </button>
                  ) : (
                    <p className="mt-0.5 text-xs font-medium text-slate-500 italic">
                      {item.name} via Landing Page
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  {new Date(item.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
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
