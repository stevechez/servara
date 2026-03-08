'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, User, Briefcase, MapPin, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function NewJobModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the Customer First (because Jobs require a customer_id)
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert([{ name: customerName, address: address }])
        .select('id')
        .single();

      if (customerError) throw customerError;

      // 2. Create the Job linked to the new Customer
      const { error: jobError } = await supabase
        .from('jobs')
        .insert([{
          customer_id: newCustomer.id,
          title: jobTitle,
          address: address,
          scheduled_date: new Date(date).toISOString(),
          status: 'scheduled'
        }]);

      if (jobError) throw jobError;

      // 3. Close modal, reset form, and refresh dashboard
      setIsOpen(false);
      setCustomerName('');
      setJobTitle('');
      setAddress('');
      setDate('');
      
      // This tells Next.js to re-fetch the server data instantly
      router.refresh(); 

    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-slate-900 dark:hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
      >
        <Plus size={18} />
        <span className="hidden sm:inline">Dispatch Job</span>
      </button>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[500] flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Slide-out Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0B0E14] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-black dark:text-white tracking-tight italic">New Dispatch</h2>
                  <p className="text-xs text-slate-500 font-medium">Create a customer and assign a job.</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                    <User size={12} /> Customer Name
                  </label>
                  <input 
                    required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                    <Briefcase size={12} /> Job Title
                  </label>
                  <input 
                    required type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Emergency HVAC Repair"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                    <MapPin size={12} /> Service Address
                  </label>
                  <input 
                    required type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Tech Lane, San Francisco, CA"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                    <Calendar size={12} /> Scheduled Date & Time
                  </label>
                  <input 
                    required type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>

              </form>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0E14]">
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-slate-900 dark:hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Dispatching...' : 'Save & Dispatch'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}