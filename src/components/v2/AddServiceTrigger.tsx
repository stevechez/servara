'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddServiceModal from '@/components/v2/AddServiceModal';

// 1. Define the props expected from the Catalog Page
interface AddServiceTriggerProps {
  userId: string;
}

export default function AddServiceTrigger({ userId }: AddServiceTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-[12px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
      >
        <Plus size={16} />
        Add Service
      </button>

      {/* 2. Pass the userId down to the Modal */}
      <AddServiceModal isOpen={isOpen} onClose={() => setIsOpen(false)} userId={userId} />
    </>
  );
}
