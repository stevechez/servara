'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronUp, Navigation2, Phone, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamically import the map to prevent SSR issues with Leaflet
const ServiceMap = dynamic(() => import('@/components/v2/ServiceMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse" />
});

const activeJobs = [
  { id: 1, client: "Thorne Bistro", time: "2:00 PM", address: "452 Market St", status: "Next" },
  { id: 2, client: "Sarah Smith", time: "4:30 PM", address: "122 Valencia St", status: "Scheduled" },
];

export default function FullMapPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden bg-slate-900">
      
      {/* 1. THE MAP (Fullscreen) */}
      <div className="absolute inset-0 z-0">
        <ServiceMap />
      </div>

      {/* 2. TOP FLOATING SEARCH/STATUS */}
      <div className="absolute top-6 left-6 right-6 z-10">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest">Live Route: SF Metro</span>
          </div>
          <button className="p-2 bg-blue-600 text-white rounded-lg">
            <Navigation2 size={16} fill="white" />
          </button>
        </div>
      </div>

      {/* 3. MOBILE PULL-UP DRAWER */}
      <motion.div 
        initial={false}
        animate={{ y: drawerOpen ? 0 : 'calc(100% - 120px)' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute inset-x-0 bottom-0 z-20 bg-white dark:bg-[#0B0E14] rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] border-t border-slate-100 dark:border-white/5"
      >
        {/* Handle Bar */}
        <div 
          className="w-full py-4 flex flex-col items-center cursor-pointer"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-2" />
          {!drawerOpen && (
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tap to view 2 more jobs</p>
          )}
        </div>

        {/* Drawer Content */}
        <div className="px-8 pb-12 overflow-y-auto max-h-[70vh]">
          <h2 className="text-xl font-black mb-6 italic">Today's Sequence</h2>
          
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <div 
                key={job.id} 
                className={`p-6 rounded-[2rem] border transition-all ${
                  job.status === 'Next' 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-500/20' 
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-900 dark:text-white'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-widest opacity-70`}>{job.time}</span>
                    <h3 className="text-lg font-black">{job.client}</h3>
                  </div>
                  <div className={`p-2 rounded-xl ${job.status === 'Next' ? 'bg-white/20' : 'bg-white dark:bg-slate-800'}`}>
                    <MapPin size={18} />
                  </div>
                </div>
                
                <p className="text-sm font-medium opacity-80 mb-6 flex items-center gap-2">
                  <Clock size={14} /> {job.address}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button className={`py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 ${
                    job.status === 'Next' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                  }`}>
                    <Navigation2 size={14} fill="currentColor" /> Go
                  </button>
                  <button className={`py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 ${
                    job.status === 'Next' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    <Phone size={14} fill="currentColor" /> Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}