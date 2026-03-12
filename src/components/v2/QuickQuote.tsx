'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Calendar as CalIcon,
  User,
  Wrench,
  DollarSign,
  Loader2,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function QuickAddJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    customer_id: '',
    service_type: '',
    scheduled_at: '',
    amount: '',
  });

  // Fetch customers when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchCustomers = async () => {
        const { data } = await supabase.from('customers').select('id, name').order('name');
        if (data) setCustomers(data);
      };
      fetchCustomers();
    }
  }, [isOpen]);

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id) return alert('Please select a customer');
    setLoading(true);

    try {
      const { error } = await supabase.from('jobs').insert([
        {
          customer_id: formData.customer_id, // REAL RELATIONSHIP
          service_type: formData.service_type,
          scheduled_at: formData.scheduled_at,
          amount: parseFloat(formData.amount) || 0,
          status: 'scheduled',
        },
      ]);

      if (error) throw error;
      setShowSuccess(true);
      router.refresh();

      setTimeout(() => {
        setIsOpen(false);
        setShowSuccess(false);
        setFormData({ customer_id: '', service_type: '', scheduled_at: '', amount: '' });
        setSearchTerm('');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Error saving job');
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
        <div className="animate-in fade-in fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-200">
          <div className="animate-in zoom-in-95 w-full max-w-md overflow-hidden rounded-[3rem] bg-white shadow-2xl dark:bg-[#12161D]">
            {showSuccess ? (
              <div className="animate-in zoom-in p-12 text-center">
                <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500" />
                <h2 className="text-2xl font-black dark:text-white">Job Dispatched</h2>
              </div>
            ) : (
              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-black italic dark:text-white">New Dispatch</h2>
                  <button onClick={() => setIsOpen(false)}>
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* SEARCHABLE CUSTOMER DROPDOWN */}
                  <div className="relative">
                    <Search className="absolute top-4 left-4 text-slate-400" size={18} />
                    <input
                      placeholder="Search Customers..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-4 pl-12 transition-all outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && !formData.customer_id && (
                      <div className="absolute z-20 mt-2 max-h-40 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-800">
                        {filteredCustomers.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className="w-full border-b border-slate-50 px-4 py-3 text-left text-sm font-bold hover:bg-blue-50 dark:border-white/5 dark:text-white dark:hover:bg-blue-500/10"
                            onClick={() => {
                              setFormData({ ...formData, customer_id: c.id });
                              setSearchTerm(c.name);
                            }}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rest of form: Service Type, Date, Amount */}
                  <div className="relative">
                    <Wrench className="absolute top-4 left-4 text-slate-400" size={18} />
                    <input
                      required
                      placeholder="Service Type"
                      className="..."
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    />
                  </div>
                  {/* ... (Keep the date and amount fields from yesterday) ... */}

                  <button type="submit" className="...">
                    Confirm Dispatch
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
