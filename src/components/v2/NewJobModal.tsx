'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, User, Briefcase, MapPin, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function NewJobModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Data State for Pricebook
  const [services, setServices] = useState<any[]>([]);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');

  // Fetch Pricebook Services when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchServices = async () => {
        const { data } = await supabase
          .from('pricebook_services')
          .select('*')
          .eq('is_active', true)
          .order('name');
        if (data) setServices(data);
      };
      fetchServices();
    }
  }, [isOpen, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get the actual service details from our state
      const selectedService = services.find(s => s.id === selectedServiceId);
      if (!selectedService) throw new Error("Please select a service.");

      // 2. Create the Customer First
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert([{ name: customerName, address: address }])
        .select('id')
        .single();

      if (customerError) throw customerError;

      // 3. Create the Job (Using the Pricebook Service Name for the title)
      const { error: jobError } = await supabase
        .from('jobs')
        .insert([{
          customer_id: newCustomer.id,
          title: selectedService.name, // <-- Pulled directly from the Pricebook!
          address: address,
          scheduled_date: new Date(date).toISOString(),
          status: 'scheduled'
        }]);

      if (jobError) throw jobError;

      // 4. Close modal, reset form, and refresh dashboard
      setIsOpen(false);
      setCustomerName('');
      setSelectedServiceId('');
      setAddress('');
      setDate('');
      
      router.refresh(); 

    } catch (error: any) {
      console.error("Error creating job:", error);
      alert(error.message || "Failed to create job. Check the console.");
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
          <div className="fixed inset-0 z-[1000] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0B0E14] h-[100dvh] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
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
              <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
                
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

                {/* THE NEW PRICEBOOK DROPDOWN */}
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                    <Briefcase size={12} /> Select Service
                  </label>
                  <select 
                    required 
                    value={selectedServiceId} 
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Choose a service from your Pricebook...</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} (${service.base_price})
                      </option>
                    ))}
                    {services.length === 0 && (
                      <option value="" disabled>No services found. Add one in Settings!</option>
                    )}
                  </select>
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
              <div className="p-6 pb-12 sm:pb-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B0E14]">
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !selectedServiceId}
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