'use client';

import { useState } from 'react';
import { X, User, Mail, Phone, Loader2 } from 'lucide-react';
import { createLead } from '@/app/actions/createLead';

export default function NewLeadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createLead(formData);

    if (result.success) {
      onClose(); // Close the modal on success
    } else {
      alert(`Error: ${result.error}`);
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="animate-in fade-in zoom-in relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-2xl duration-200">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">New Lead</h2>
              <p className="text-sm font-medium text-slate-500">Manually add a new opportunity.</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="group space-y-2">
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-focus-within:text-blue-600">
                  First Name
                </label>
                <div className="relative">
                  <User
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                    size={18}
                  />
                  <input
                    required
                    name="first_name"
                    type="text"
                    placeholder="Jane"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-sm font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>
              <div className="group space-y-2">
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-focus-within:text-blue-600">
                  Last Name
                </label>
                <div className="relative">
                  <User
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                    size={18}
                  />
                  <input
                    required
                    name="last_name"
                    type="text"
                    placeholder="Smith"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-sm font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </div>

            <div className="group space-y-2">
              <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-focus-within:text-blue-600">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-sm font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors group-focus-within:text-blue-600">
                Phone
              </label>
              <div className="relative">
                <Phone
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                  size={18}
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-sm font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* Add this inside your <form> in NewLeadModal */}
            <div className="space-y-1">
              <label
                htmlFor="service_requested"
                className="text-[10px] font-black tracking-widest text-slate-400 uppercase"
              >
                Project Details / Requested Service
              </label>
              <textarea
                id="service_requested"
                name="service_requested"
                rows={3}
                required
                placeholder="e.g., Emergency roof leak repair over the master bedroom..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-black tracking-widest text-white uppercase shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Lead'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
