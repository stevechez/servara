'use client';

import React, { useState } from 'react';
import { Plus, Search, Tag, Clock, Trash2, Edit3, X } from 'lucide-react';
import { saveService } from '@/app/actions/services';

export default function PricebookManager({ initialServices }: { initialServices: any[] }) {
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await saveService(data);
      setIsModalOpen(false);
      // In a real app, you'd fetch the updated list or use optimistic updates
      window.location.reload();
    } catch (err) {
      alert('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] p-8 text-white">
      {/* HEADER */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Service Pricebook
          </h1>
          <p className="mt-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            Standardize your revenue units
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700"
        >
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* ... (Keep the Search and Table code from previous step) ... */}

      {/* ADD SERVICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#0B0E14] p-10 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase italic">New Service</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Service Name
                </label>
                <input
                  name="name"
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm outline-none focus:border-blue-500"
                  placeholder="e.g. Emergency Pipe Repair"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Base Price ($)
                  </label>
                  <input
                    name="base_price"
                    type="number"
                    required
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm outline-none focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Duration (Min)
                  </label>
                  <input
                    name="estimated_duration_minutes"
                    type="number"
                    required
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm outline-none focus:border-blue-500"
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Category
                </label>
                <select
                  name="category"
                  className="mt-2 w-full appearance-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Roofing">Roofing</option>
                  <option value="HVAC">HVAC</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 py-5 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Create Service Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
