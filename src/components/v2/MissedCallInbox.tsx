'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneMissed, MessageSquare, PhoneForwarded, X, Play, Clock } from 'lucide-react';

// Mock data for AI-intercepted calls
const INITIAL_CALLS = [
  { 
    id: 1, 
    name: 'Mike Johnson', 
    phone: '(555) 123-4567', 
    time: '10m ago', 
    intent: 'Emergency Leak', 
    transcript: "AI: Hello, Thorne Plumbing. How can I help?\nMike: My pipe burst in the kitchen, there's water everywhere!\nAI: I'm so sorry to hear that. I am dispatching our emergency flow. Let me get your address..." 
  },
  { 
    id: 2, 
    name: 'Sarah Connor', 
    phone: '(555) 987-6543', 
    time: '1h ago', 
    intent: 'Quote Request', 
    transcript: "AI: Servara HVAC, how can I help?\nSarah: I need a quote for a new AC unit.\nAI: I can schedule an estimator to come out. Does tomorrow at 9 AM work for you?" 
  }
];

export default function MissedCallInbox() {
  const [calls, setCalls] = useState(INITIAL_CALLS);
  
  // State for tracking which modal is open
  const [selectedTranscript, setSelectedTranscript] = useState<any | null>(null);
  const [takeoverCall, setTakeoverCall] = useState<any | null>(null);

  // Function to remove a call from the inbox once handled
  const handleDismiss = (id: number) => {
    setCalls(calls.filter(c => c.id !== id));
    setSelectedTranscript(null);
    setTakeoverCall(null);
  };

  return (
    <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm p-6 flex flex-col h-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <PhoneMissed size={18} />
          </div>
          <div>
            <h2 className="text-lg font-black dark:text-white tracking-tight uppercase">AI Call Inbox</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Intercepted</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 rounded-lg text-xs font-black">
          {calls.length} New
        </span>
      </div>

      {/* CALL LIST */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
            <p className="text-sm font-bold">Inbox zero! All calls handled.</p>
          </div>
        ) : (
          calls.map(call => (
            <div key={call.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 group hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{call.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{call.phone}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg">
                  <Clock size={10} /> {call.time}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 rounded-md text-[10px] font-black uppercase tracking-widest">
                  {call.intent}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedTranscript(call)}
                  className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={12} /> Transcript
                </button>
                <button 
                  onClick={() => setTakeoverCall(call)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <PhoneForwarded size={12} /> Takeover
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 1. TRANSCRIPT MODAL */}
      <AnimatePresence>
        {selectedTranscript && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedTranscript(null)} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} 
              className="relative w-full max-w-md bg-white dark:bg-[#0B0E14] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <div>
                  <h3 className="font-black dark:text-white">Call Transcript</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedTranscript.name} • {selectedTranscript.phone}</p>
                </div>
                <button onClick={() => setSelectedTranscript(null)} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-100 dark:border-slate-700">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto bg-white dark:bg-[#050608]">
                <div className="space-y-4">
                  {selectedTranscript.transcript.split('\n').map((line: string, i: number) => {
                    const isAI = line.startsWith('AI:');
                    return (
                      <div key={i} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${isAI ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm' : 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-500/20'}`}>
                          <span className="block text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">
                            {isAI ? 'Servara AI' : selectedTranscript.name}
                          </span>
                          {line.replace(/^(AI:|[^:]+:)/, '').trim()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-2">
                <button onClick={() => { setTakeoverCall(selectedTranscript); setSelectedTranscript(null); }} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
                  Takeover Call
                </button>
                <button onClick={() => handleDismiss(selectedTranscript.id)} className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Mark Resolved
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. TAKEOVER MODAL */}
      <AnimatePresence>
        {takeoverCall && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setTakeoverCall(null)} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative w-full max-w-sm bg-white dark:bg-[#0B0E14] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 text-center p-8 overflow-hidden"
            >
              
              {/* Radar pulse animation */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-ping" />
              
              <div className="relative w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 mb-6 border-4 border-white dark:border-[#0B0E14]">
                <PhoneForwarded size={32} className="text-white animate-pulse" />
              </div>
              
              <h3 className="text-2xl font-black dark:text-white mb-2 tracking-tight">Intercepting Call</h3>
              <p className="text-sm text-slate-500 font-medium mb-1">Muting AI & routing audio to your device...</p>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400 mb-8">{takeoverCall.phone}</p>
              
              <div className="flex gap-3">
                <button onClick={() => setTakeoverCall(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
                {/* Opens the phone's native dialer if on mobile, and dismisses the call from the inbox */}
                <a 
                  href={`tel:${takeoverCall.phone.replace(/[^0-9]/g, '')}`} 
                  onClick={() => handleDismiss(takeoverCall.id)} 
                  className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Play size={14} fill="currentColor" /> Connect Now
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}