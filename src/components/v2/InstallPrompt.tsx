'use client';

import { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on iOS browsers, not already installed
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isStandalone) {
      const hasDismissed = localStorage.getItem('hideInstallPrompt');
      if (!hasDismissed) setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-24 left-6 right-6 z-[100] bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl border border-white/10"
      >
        <button onClick={() => setShow(false)} className="absolute top-4 right-4 text-slate-500">
          <X size={18} />
        </button>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <PlusSquare size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black">Install Servara App</p>
            <p className="text-xs text-slate-400 font-medium">
              Tap <Share size={14} className="inline mx-1" /> then <strong className="text-white">"Add to Home Screen"</strong> for a native experience.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}