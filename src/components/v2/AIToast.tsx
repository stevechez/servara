'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PhoneIncoming, X, MessageSquare, Calendar, ArrowRight } from 'lucide-react';

export default function AIToast() {
  const [isVisible, setIsVisible] = useState(false);

  // For demo purposes, let's trigger it 5 seconds after the dashboard loads
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed top-24 right-6 z-[100] w-full max-w-sm"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
            {/* PROGRESS BAR (AI IS LISTENING) */}
            <div className="h-1 w-full bg-white/5 overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
                className="h-full bg-blue-500"
              />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-xl animate-ping opacity-20" />
                    <div className="relative h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
                      <PhoneIncoming size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Live Intercept</p>
                    <p className="text-sm font-bold text-white tracking-tight">Incoming from (415) 555-0123</p>
                  </div>
                </div>
                <button onClick={() => setIsVisible(false)} className="text-white/30 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* AI TRANSCRIPT PREVIEW */}
              <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} className="text-blue-400" />
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">AI Analysis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Customer needs emergency pipe repair. AI is currently offering the 2:00 PM slot today..."
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button className="flex-1 bg-white text-slate-900 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all">
                  <MessageSquare size={14} /> View Transcript
                </button>
                <button className="px-4 bg-white/10 text-white py-2.5 rounded-xl font-black text-xs hover:bg-white/20 transition-all">
                  Take Over
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}