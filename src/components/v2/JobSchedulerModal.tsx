'use client';

import { useState } from 'react';
import { X, Calendar, DollarSign, Wrench, Loader2, Check } from 'lucide-react';
import { createJob } from '@/app/actions/createJob';

export default function JobSchedulerModal({ 
  isOpen, 
  onClose, 
  customerId, 
  customerName 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  customerId: string,
  customerName: string 
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('customer_id', customerId);
    
    const result = await createJob(formData);
    if (result.success) onClose();
    else alert(result.error);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Darkened Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container (Now supports Dark Mode!) */}
      <div className="relative bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-8">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1">Scheduler</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Book for {customerName}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Service Type */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Service Type</label>
              <div className="relative">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <select required name="service_type" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none transition-all outline-none">
                  <option value="" className="text-slate-500">Select a service...</option>
                  <option value="Standard Cleaning">Standard Cleaning</option>
                  <option value="Deep Repair">Deep Repair</option>
                  <option value="Installation">Installation</option>
                  <option value="Maintenance">Emergency Maintenance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input required name="amount" type="number" placeholder="0.00" step="0.01" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                </div>
              </div>
              
              {/* Date */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  {/* Note: the date picker icon might look slightly different based on browser, but the text is now fixed */}
                  <input required name="scheduled_at" type="date" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">
                Job Notes / Instructions
              </label>
              <textarea 
                name="notes" 
                rows={3}
                placeholder="e.g. Beware of dog, or specific parts used..." 
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none outline-none"
              />
            </div>

            {/* Restored Blue Submit Button */}
            <button 
              disabled={loading}
              type="submit" 
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Confirm Booking
                  <Check size={18} />
                </>
              )}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}