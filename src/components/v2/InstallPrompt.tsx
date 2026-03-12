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
        className="fixed right-6 bottom-24 left-6 z-[100] rounded-[2rem] border border-white/10 bg-slate-900 p-6 text-white shadow-2xl"
      >
        <button onClick={() => setShow(false)} className="absolute top-4 right-4 text-slate-500">
          <X size={18} />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600">
            <PlusSquare size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black">Install Zidro App</p>
            <p className="text-xs font-medium text-slate-400">
              Tap <Share size={14} className="mx-1 inline" /> then{' '}
              <strong className="text-white">"Add to Home Screen"</strong> for a native experience.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
