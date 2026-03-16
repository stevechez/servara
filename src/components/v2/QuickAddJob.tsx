'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import NewJobModal from '@/components/v2/NewJobModal';

export default function QuickAddJob() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-[10px] font-black tracking-widest text-white uppercase shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Quick Job</span>
      </button>

      {/* Renders the exact same Dispatch Modal */}
      <NewJobModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
