'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  PhoneIncoming,
  PhoneMissed,
  Sparkles,
  Calendar,
  Clock,
  MoreHorizontal,
} from 'lucide-react';

const transcriptList = [
  {
    id: 1,
    customer: 'John Doe',
    intent: 'Emergency Leak',
    status: 'Booked',
    time: '10:30 AM',
    date: 'Today',
  },
  {
    id: 2,
    customer: 'Sarah Jenkins',
    intent: 'Quote Request',
    status: 'Pending',
    time: '9:15 AM',
    date: 'Today',
  },
  {
    id: 3,
    customer: 'Thorne Bistro',
    intent: 'Annual Service',
    status: 'Booked',
    time: 'Yesterday',
    date: 'Mar 6',
  },
  {
    id: 4,
    customer: 'Mike Ross',
    intent: 'HVAC Noise',
    status: 'Voicemail',
    time: 'Yesterday',
    date: 'Mar 6',
  },
];

export default function TranscriptionHistory() {
  const [selectedId, setSelectedId] = useState(1);

  return (
    <div className="mx-auto h-[calc(100vh-180px)] max-w-7xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 italic dark:text-white">
            Communications
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Review every AI interaction and call summary.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition-all hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900">
            <Filter size={20} />
          </button>
          <div className="relative w-full max-w-xl">
            <Search className="absolute top-4 left-4 text-slate-300" size={18} />
            <input
              placeholder="Search customers, jobs, or invoices..."
              className="w-full rounded-2xl bg-white p-4 pl-12 text-sm font-bold dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="grid h-full grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
        {/* LEFT: LIST VIEW */}
        <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white lg:col-span-4 dark:border-slate-800 dark:bg-[#0B0E14]">
          <div className="border-b border-slate-50 bg-slate-50/50 p-4 dark:border-slate-900 dark:bg-slate-900/50">
            <p className="px-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Recent Calls
            </p>
          </div>
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            {transcriptList.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`flex w-full items-center gap-4 border-b border-slate-50 p-6 text-left transition-all dark:border-slate-900 ${
                  selectedId === item.id
                    ? 'border-l-4 border-l-blue-600 bg-blue-50/50 dark:bg-blue-600/10'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    item.status === 'Voicemail'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                  }`}
                >
                  {item.status === 'Voicemail' ? (
                    <PhoneMissed size={18} />
                  ) : (
                    <PhoneIncoming size={18} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="truncate font-bold text-slate-900 dark:text-white">
                      {item.customer}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{item.intent}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAIL VIEW */}
        <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white lg:col-span-8 dark:border-slate-800 dark:bg-[#0B0E14]">
          {/* We can reuse the AITranscript component here, passing in the selectedId as a prop */}
          <div className="flex flex-1 items-center justify-center overflow-y-auto p-8 text-slate-400 italic">
            {/* Placeholder for the detail view we built in the previous step */}
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900">
                <Sparkles size={32} className="text-blue-600" />
              </div>
              <p className="text-sm font-medium">Select a call to view the full AI transcript.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
