'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close the menu when the user clicks a link and the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* GLOBAL MOBILE TOP BAR */}
      <div className="md:hidden shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <span className="font-black italic text-lg tracking-tight dark:text-white">SERVARA</span>
        </div>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* SLIDE-OUT DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[80%] max-w-sm h-[100dvh] shadow-2xl bg-white dark:bg-[#0B0E14] overflow-hidden"
            >
              {/* Close Button floating over the sidebar */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 z-50 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm"
              >
                <X size={18} />
              </button>
              
              {/* We just inject your exact desktop sidebar right here! */}
              <div className="h-full w-full">
                <Sidebar />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}