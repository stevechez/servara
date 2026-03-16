'use client';

import { useState, useEffect } from 'react';
import {
  Wrench,
  DollarSign,
  Calendar,
  FileText,
  User,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

interface Activity {
  id: string;
  activity_type: string;
  title: string;
  description: string;
  metadata: any;
  created_at: string;
}

// Fallback data for the demo if the database is empty
const MOCK_ACTIVITY: Activity[] = [
  {
    id: '1',
    activity_type: 'job_completed',
    title: 'Job Completed',
    description: 'Drain cleaning completed by Mike.',
    metadata: { price: 325 },
    created_at: '2026-01-12T14:30:00Z',
  },
  {
    id: '2',
    activity_type: 'invoice_paid',
    title: 'Invoice Paid',
    description: 'Invoice #INV-142 was paid in full via Credit Card.',
    metadata: { amount: 325 },
    created_at: '2026-01-12T14:35:00Z',
  },
  {
    id: '3',
    activity_type: 'job_scheduled',
    title: 'Appointment Scheduled',
    description: 'Scheduled for Jan 12 at 10:00 AM.',
    metadata: {},
    created_at: '2026-01-10T09:15:00Z',
  },
  {
    id: '4',
    activity_type: 'estimate_sent',
    title: 'Estimate Sent',
    description: 'Estimate #EST-089 sent to john@smith.com',
    metadata: { total: 325 },
    created_at: '2026-01-05T11:20:00Z',
  },
  {
    id: '5',
    activity_type: 'customer_created',
    title: 'Customer Profile Created',
    description: 'Lead converted from Google Search.',
    metadata: {},
    created_at: '2026-01-05T10:00:00Z',
  },
];

export default function CustomerTimeline({ customerId }: { customerId?: string }) {
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITY);
  const [loading, setLoading] = useState(false);

  // In a real app, you would fetch from Supabase here using the customerId
  // useEffect(() => { fetchActivities() }, [customerId])

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'job_completed':
        return { icon: Wrench, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20' };
      case 'invoice_paid':
        return {
          icon: DollarSign,
          color: 'text-emerald-500',
          bg: 'bg-emerald-100 dark:bg-emerald-500/20',
        };
      case 'job_scheduled':
        return {
          icon: Calendar,
          color: 'text-indigo-500',
          bg: 'bg-indigo-100 dark:bg-indigo-500/20',
        };
      case 'estimate_sent':
        return { icon: FileText, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/20' };
      case 'customer_created':
        return { icon: User, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-white/10' };
      case 'message_sent':
        return {
          icon: MessageSquare,
          color: 'text-purple-500',
          bg: 'bg-purple-100 dark:bg-purple-500/20',
        };
      default:
        return { icon: CheckCircle2, color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-white/5' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#12161D]">
      <div className="mb-8">
        <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
          Activity Timeline
        </h2>
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Complete interaction history
        </p>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-slate-100 md:before:mx-auto md:before:translate-x-0 dark:before:bg-white/10">
        {activities.map((activity, index) => {
          const { icon: Icon, color, bg } = getIconConfig(activity.activity_type);

          return (
            <div
              key={activity.id}
              className="group is-active relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
            >
              {/* Icon Marker */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:border-[#12161D] ${bg} ${color}`}
              >
                <Icon size={16} className="stroke-2" />
              </div>

              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)]">
                <div className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-colors hover:border-blue-100 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:hover:border-white/10 dark:hover:bg-white/10">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {activity.title}
                    </span>
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      {formatDate(activity.created_at)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {activity.description}
                  </p>

                  {/* Metadata display (e.g., Price) */}
                  {(activity.metadata?.price || activity.metadata?.amount) && (
                    <div className="mt-3 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      ${activity.metadata.price || activity.metadata.amount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOAD MORE BUTTON */}
      <div className="mt-10 flex justify-center">
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-[10px] font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-50 active:scale-95 dark:border-white/10 dark:bg-[#12161D] dark:hover:bg-white/5">
          <ChevronDown size={14} /> Load Older Activity
        </button>
      </div>
    </div>
  );
}
