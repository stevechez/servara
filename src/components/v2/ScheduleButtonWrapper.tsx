'use client';

import { useState } from 'react';
import JobSchedulerModal from './JobSchedulerModal';

export default function ScheduleButtonWrapper({ 
  customerId, 
  customerName 
}: { 
  customerId: string, 
  customerName: string 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all uppercase tracking-widest"
      >
        Schedule New Job
      </button>

      <JobSchedulerModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        customerId={customerId}
        customerName={customerName}
      />
    </>
  );
}