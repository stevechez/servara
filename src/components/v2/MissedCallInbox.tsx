'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneMissed,
  MessageSquare,
  PhoneForwarded,
  X,
  Play,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import EmptyState from '../EmptyState';

// Mock data for AI-intercepted calls
const INITIAL_CALLS = [
  {
    id: 1,
    name: 'Mike Johnson',
    phone: '(555) 123-4567',
    time: '10m ago',
    intent: 'Emergency Leak',
    transcript:
      "AI: Hello, Thorne Plumbing. How can I help?\nMike: My pipe burst in the kitchen, there's water everywhere!\nAI: I'm so sorry to hear that. I am dispatching our emergency flow. Let me get your address...",
  },
  {
    id: 2,
    name: 'Sarah Connor',
    phone: '(555) 987-6543',
    time: '1h ago',
    intent: 'Quote Request',
    transcript:
      'AI: Zidro HVAC, how can I help?\nSarah: I need a quote for a new AC unit.\nAI: I can schedule an estimator to come out. Does tomorrow at 9 AM work for you?',
  },
];

export default function MissedCallInbox() {
  const [calls, setCalls] = useState(INITIAL_CALLS);

  // State for tracking which modal is open
  const [selectedTranscript, setSelectedTranscript] = useState<any | null>(null);
  const [takeoverCall, setTakeoverCall] = useState<any | null>(null);

  // Function to remove a call from the inbox once handled
  const handleDismiss = (id: number) => {
    setCalls(calls.filter((c) => c.id !== id));
    setSelectedTranscript(null);
    setTakeoverCall(null);
  };

  return (
    <div className="shadow-soft hover:shadow-float flex h-full flex-col rounded-[2.5rem] border border-slate-200 bg-white p-6 transition-all duration-300 dark:border-slate-800 dark:bg-[#0B0E14]">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <PhoneMissed size={18} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight uppercase dark:text-white">
              AI Call Inbox
            </h2>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Intercepted
            </p>
          </div>
        </div>
        <span className="rounded-lg bg-rose-100 px-2.5 py-1 text-xs font-black text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
          {calls.length} New
        </span>
      </div>

      {/* CALL LIST */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {calls.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-8 text-slate-400">
            <EmptyState
              icon={<CheckCircle2 size={28} className="text-emerald-500" />}
              title="Inbox Zero"
              description="You're all caught up on missed calls and voicemails."
            />
          </div>
        ) : (
          calls.map((call) => (
            <div
              key={call.id}
              className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-blue-500/30"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{call.name}</h3>
                  <p className="text-xs font-medium text-slate-500">{call.phone}</p>
                </div>
                <span className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-slate-400 dark:bg-slate-800">
                  <Clock size={10} /> {call.time}
                </span>
              </div>

              <div className="mb-4">
                <span className="inline-block rounded-md bg-amber-100 px-2 py-1 text-[10px] font-black tracking-widest text-amber-700 uppercase dark:bg-amber-500/20 dark:text-amber-400">
                  {call.intent}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTranscript(call)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-[10px] font-black tracking-widest text-slate-600 uppercase transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <MessageSquare size={12} /> Transcript
                </button>
                <button
                  onClick={() => setTakeoverCall(call)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-md shadow-blue-500/20 transition-colors hover:bg-blue-700"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTranscript(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0B0E14]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
                <div>
                  <h3 className="font-black dark:text-white">Call Transcript</h3>
                  <p className="text-xs font-medium text-slate-500">
                    {selectedTranscript.name} • {selectedTranscript.phone}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTranscript(null)}
                  className="rounded-full border border-slate-100 bg-white p-2 text-slate-500 shadow-sm hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto bg-white p-6 dark:bg-[#050608]">
                <div className="space-y-4">
                  {selectedTranscript.transcript.split('\n').map((line: string, i: number) => {
                    const isAI = line.startsWith('AI:');
                    return (
                      <div key={i} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl p-4 text-sm ${isAI ? 'rounded-tl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' : 'rounded-tr-sm bg-blue-600 text-white shadow-md shadow-blue-500/20'}`}
                        >
                          <span className="mb-1 block text-[10px] font-black tracking-widest uppercase opacity-50">
                            {isAI ? 'Zidro AI' : selectedTranscript.name}
                          </span>
                          {line.replace(/^(AI:|[^:]+:)/, '').trim()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 border-t border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <button
                  onClick={() => {
                    setTakeoverCall(selectedTranscript);
                    setSelectedTranscript(null);
                  }}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-black tracking-widest text-white uppercase shadow-md shadow-blue-500/20 transition-colors hover:bg-blue-700"
                >
                  Takeover Call
                </button>
                <button
                  onClick={() => handleDismiss(selectedTranscript.id)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black tracking-widest text-slate-600 uppercase transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTakeoverCall(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-[#0B0E14]"
            >
              {/* Radar pulse animation */}
              <div className="absolute top-12 left-1/2 h-32 w-32 -translate-x-1/2 animate-ping rounded-full bg-blue-500/20 blur-xl" />

              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-blue-600 shadow-xl shadow-blue-500/30 dark:border-[#0B0E14]">
                <PhoneForwarded size={32} className="animate-pulse text-white" />
              </div>

              <h3 className="mb-2 text-2xl font-black tracking-tight dark:text-white">
                Intercepting Call
              </h3>
              <p className="mb-1 text-sm font-medium text-slate-500">
                Muting AI & routing audio to your device...
              </p>
              <p className="mb-8 text-lg font-black text-blue-600 dark:text-blue-400">
                {takeoverCall.phone}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setTakeoverCall(null)}
                  className="flex-1 rounded-2xl bg-slate-100 py-4 text-xs font-black tracking-widest text-slate-600 uppercase transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                {/* Opens the phone's native dialer if on mobile, and dismisses the call from the inbox */}
                <a
                  href={`tel:${takeoverCall.phone.replace(/[^0-9]/g, '')}`}
                  onClick={() => handleDismiss(takeoverCall.id)}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-500/20 transition-colors hover:bg-emerald-600"
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
