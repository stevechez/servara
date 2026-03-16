'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AddServiceModal({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);

    const { error } = await supabase.from('services').insert({ name, price, user_id: userId });

    if (!error) {
      setIsOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-blue-700 active:scale-95"
      >
        <Plus size={16} /> Add Service
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl dark:bg-[#12161D]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase italic dark:text-white">New Service</h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Service Name
            </label>
            <input
              name="name"
              required
              placeholder="e.g. Tankless Flush"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold focus:border-blue-500 focus:outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Flat Rate Price ($)
            </label>
            <input
              name="price"
              type="number"
              required
              placeholder="150"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold focus:border-blue-500 focus:outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-4 text-[10px] font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Save to Catalog'}
          </button>
        </form>
      </div>
    </div>
  );
}
