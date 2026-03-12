'use client';

import { useState } from 'react';
import {
  Plus,
  X,
  Calendar as CalIcon,
  User,
  Wrench,
  DollarSign,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function QuickAddJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    customer_name: '',
    service_type: '',
    scheduled_at: '',
    amount: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('jobs').insert([
        {
          service_type: formData.service_type,
          scheduled_at: formData.scheduled_at,
          amount: parseFloat(formData.amount) || 0,
          status: 'scheduled',
        },
      ]);

      if (error) throw error;

      // START SUCCESS SEQUENCE
      setShowSuccess(true);

      // TRIGGER REFRESH: This tells Next.js to re-run the server-side
      // data fetching for the Dashboard page instantly.
      router.refresh();

      // Auto-close after a moment of glory
      setTimeout(() => {
        setIsOpen(false);
        setShowSuccess(false);
        setFormData({ customer_name: '', service_type: '', scheduled_at: '', amount: '' });
      }, 1800);
    } catch (err) {
      console.error(err);
      alert('Error adding job. Check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-95"
      >
        <Plus size={18} /> Quick Add Job
      </button>

      {isOpen && (
        <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-200">
          <div className="animate-in zoom-in-95 w-full max-w-md overflow-hidden rounded-[3rem] border border-slate-200 bg-white shadow-2xl duration-200 dark:border-white/5 dark:bg-[#12161D]">
            {showSuccess ? (
              /* THE MAGIC SUCCESS SCREEN */
              <div className="animate-in zoom-in flex flex-col items-center p-12 text-center duration-300">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-inner">
                  <CheckCircle2
                    size={40}
                    strokeWidth={3}
                    className="animate-in slide-in-from-bottom-2"
                  />
                </div>
                <h2 className="text-2xl font-black tracking-tight italic dark:text-white">
                  Job Dispatched
                </h2>
                <p className="mt-2 text-sm font-bold tracking-widest text-slate-500 uppercase">
                  Schedule Updated
                </p>
              </div>
            ) : (
              /* THE FORM */
              <div className="p-8">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-black italic dark:text-white">New Dispatch</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 transition-colors hover:text-slate-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute top-4 left-4 text-slate-400" size={18} />
                    <input
                      required
                      placeholder="Customer Name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-4 pl-12 transition-all outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    />
                  </div>

                  <div className="relative">
                    <Wrench className="absolute top-4 left-4 text-slate-400" size={18} />
                    <input
                      required
                      placeholder="Service Type"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-4 pl-12 transition-all outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <CalIcon className="absolute top-4 left-4 text-slate-400" size={18} />
                      <input
                        required
                        type="date"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-4 pl-12 text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        value={formData.scheduled_at}
                        onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute top-4 left-4 text-slate-400" size={18} />
                      <input
                        placeholder="Price"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-4 pl-12 transition-all outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-5 text-[10px] font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 dark:bg-blue-600"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Confirm Dispatch'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
