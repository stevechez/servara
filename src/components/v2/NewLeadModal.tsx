'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, User, Phone, Wrench } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function NewLeadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          name,
          service_type: serviceType,
          phone,
          status: 'new' // Always starts in the first column
        }]);

      if (error) throw error;

      // Close modal, reset form, and refresh the board
      setIsOpen(false);
      setName('');
      setServiceType('');
      setPhone('');
      router.refresh(); 

    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to create lead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 rounded-2xl font-black text-sm hover:opacity-90 transition-all active:scale-95"
      >
        <Plus size={18} />
        <span className="hidden sm:inline">Add Lead</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[500] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0B0E14] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-black dark:text-white tracking-tight italic">New Prospect</h2>
                  <p className="text-xs text-slate-500 font-medium">Capture a new lead for the pipeline.</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                    <User size={12} /> Prospect Name
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Sarah Connor" 
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                    <Wrench size={12} /> Service Needed
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={serviceType} 
                    onChange={(e) => setServiceType(e.target.value)} 
                    placeholder="e.g. Water Heater Replacement" 
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                    <Phone size={12} /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="(555) 012-3456" 
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>
              </form>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0E14]">
                <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-slate-900 dark:hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50">
                  {loading ? 'Saving...' : 'Add to Pipeline'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}