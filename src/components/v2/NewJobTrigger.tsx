'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import NewJobModal from '@/components/v2/NewJobModal';

export default function NewJobTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group flex w-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-500/30 hover:shadow-lg dark:border-white/5 dark:bg-[#12161D]"
      >
        <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-110">
          <Plus size={20} />
        </div>
        <span className="text-left font-black tracking-tight text-slate-900 uppercase dark:text-white">
          New Job
        </span>
      </button>

      <NewJobModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
