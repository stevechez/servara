'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, Calendar, Clock, Check, Sparkles, User } from 'lucide-react';

export default function ConflictResolver() {
  const [isResolved, setIsResolved] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-none">Schedule Conflict</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Found in your Monday Calendar</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
            High Priority
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isResolved ? (
            <motion.div
              key="conflict"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* THE CONFLICTING JOBS */}
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs">JD</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">John Doe (HVAC)</p>
                      <p className="text-[10px] text-slate-500 font-medium">2:00 PM - 3:30 PM</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs">SJ</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Sarah Jenkins (Pipe)</p>
                      <p className="text-[10px] text-slate-500 font-medium">3:15 PM - 4:45 PM</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                </div>
              </div>

              {/* AI RECOMMENDATION */}
              <div className="p-6 bg-blue-600 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-blue-100">
                <Sparkles className="absolute -right-4 -top-4 text-white/10 w-32 h-32 rotate-12" />
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">AI Smart Recommendation</span>
                </div>
                <p className="text-sm font-bold mb-4 leading-relaxed">
                  Move Sarah Jenkins to 4:00 PM. This reduces travel time by 12 minutes and gives John Doe a buffer for cleanup.
                </p>
                <button 
                  onClick={() => setIsResolved(true)}
                  className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Apply & Notify Customers <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="resolved"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                <Check size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Conflict Resolved</h4>
                <p className="text-sm text-slate-500 font-medium max-w-[200px] mx-auto">Sarah was moved and both customers have been texted.</p>
              </div>
              <button onClick={() => setIsResolved(false)} className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500">
                Undo Action
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}