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
  MoreHorizontal 
} from 'lucide-react';

const transcriptList = [
  { id: 1, customer: "John Doe", intent: "Emergency Leak", status: "Booked", time: "10:30 AM", date: "Today" },
  { id: 2, customer: "Sarah Jenkins", intent: "Quote Request", status: "Pending", time: "9:15 AM", date: "Today" },
  { id: 3, customer: "Thorne Bistro", intent: "Annual Service", status: "Booked", time: "Yesterday", date: "Mar 6" },
  { id: 4, customer: "Mike Ross", intent: "HVAC Noise", status: "Voicemail", time: "Yesterday", date: "Mar 6" },
];

export default function TranscriptionHistory() {
  const [selectedId, setSelectedId] = useState(1);

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-[calc(100vh-180px)]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Communications</h1>
          <p className="text-slate-500 font-medium text-sm">Review every AI interaction and call summary.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-blue-600 transition-all">
                <Filter size={20} />
            </button>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name or intent..." 
                    className="pl-12 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-64 transition-all"
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
        
        {/* LEFT: LIST VIEW */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Recent Calls</p>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {transcriptList.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full p-6 text-left border-b border-slate-50 dark:border-slate-900 transition-all flex items-center gap-4 ${
                  selectedId === item.id 
                  ? 'bg-blue-50/50 dark:bg-blue-600/10 border-l-4 border-l-blue-600' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    item.status === 'Voicemail' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                }`}>
                    {item.status === 'Voicemail' ? <PhoneMissed size={18} /> : <PhoneIncoming size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{item.customer}</p>
                    <span className="text-[10px] text-slate-400 font-bold">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{item.intent}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAIL VIEW */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col">
           {/* We can reuse the AITranscript component here, passing in the selectedId as a prop */}
           <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center text-slate-400 italic">
              {/* Placeholder for the detail view we built in the previous step */}
              <div className="text-center space-y-4">
                 <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
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