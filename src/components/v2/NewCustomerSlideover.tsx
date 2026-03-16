'use client';

import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Tag,
  Search,
  FileText,
  CheckSquare,
  Plus,
} from 'lucide-react';
import { useState } from 'react';

export default function NewCustomerSlideover() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [sms, setSms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <>
      {/* THE TRIGGER BUTTON ON THE DASHBOARD */}
      <button
        onClick={() => setIsOpen(true)}
        className="group flex w-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:border-emerald-500/30 hover:shadow-lg dark:border-white/5 dark:bg-[#12161D]"
      >
        <div className="rounded-2xl bg-emerald-500 p-3 text-white shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
          <User size={20} />
        </div>
        <span className="text-left font-black tracking-tight text-slate-900 uppercase dark:text-white">
          New Customer
        </span>
      </button>

      {/* THE SLIDEOVER PANEL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* The Panel (Slides in from right) */}
          <div className="animate-in slide-in-from-right relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl duration-300 sm:rounded-l-[3rem] dark:bg-[#12161D]">
            {/* HEADER (Sticky) */}
            <div className="flex-shrink-0 border-b border-slate-100 p-8 px-10 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">
                    New Customer
                  </h2>
                  <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Add a new profile to your CRM
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-slate-100 p-3 text-slate-400 transition-colors hover:bg-slate-200 dark:bg-white/5"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* SCROLLABLE FORM */}
            <div className="flex-1 overflow-y-auto p-10">
              <form id="customer-form" onSubmit={handleSubmit} className="space-y-8">
                {/* --- CONTACT INFO --- */}
                <div>
                  <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                    Contact Info
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute top-4 left-4 text-slate-300" size={18} />
                        <input
                          defaultValue="John Smith"
                          className="w-full rounded-2xl border-none bg-slate-50 p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-emerald-500 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute top-4 left-4 text-slate-300" size={18} />
                        <input
                          defaultValue="831-555-1923"
                          className="w-full rounded-2xl border-none bg-slate-50 p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-emerald-500 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute top-4 left-4 text-slate-300" size={18} />
                        <input
                          defaultValue="john@smith.com"
                          className="w-full rounded-2xl border-none bg-slate-50 p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-emerald-500 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Service Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute top-4 left-4 text-slate-300" size={18} />
                        <input
                          defaultValue="512 Seacliff Dr, Aptos"
                          className="w-full rounded-2xl border-none bg-slate-50 p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-emerald-500 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- SEGMENTATION --- */}
                <div>
                  <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                    Segmentation
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Customer Type
                      </label>
                      <div className="relative">
                        <Building className="absolute top-4 left-4 text-slate-300" size={18} />
                        <select className="w-full appearance-none rounded-2xl border-none bg-slate-50 p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-emerald-500 dark:bg-white/5 dark:text-white">
                          <option selected>Residential</option>
                          <option>Commercial</option>
                          <option>Property Management</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Lead Source
                      </label>
                      <div className="relative">
                        <Search className="absolute top-4 left-4 text-slate-300" size={18} />
                        <select className="w-full appearance-none rounded-2xl border-none bg-slate-50 p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-emerald-500 dark:bg-white/5 dark:text-white">
                          <option selected>Google Search</option>
                          <option>Yelp</option>
                          <option>Referral</option>
                          <option>Yard Sign</option>
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        CRM Tags
                      </label>
                      <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                          <Tag size={12} /> VIP
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
                          <Tag size={12} /> Maintenance Plan
                        </span>
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-3 py-1 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:border-emerald-500 hover:text-emerald-500"
                        >
                          <Plus size={12} /> Add Tag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- NOTES & PERMISSIONS --- */}
                <div>
                  <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                    Notes & Permissions
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <FileText className="absolute top-4 left-4 text-slate-300" size={18} />
                      <textarea
                        rows={2}
                        defaultValue="Gate code #2945 – dog in backyard"
                        className="w-full rounded-2xl border-none bg-slate-50 p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-emerald-500 dark:bg-white/5 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 md:flex-row md:items-center md:gap-8 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                      <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                        Preferences
                      </span>
                      <label className="flex cursor-pointer items-center gap-3">
                        <div onClick={() => setReminders(!reminders)} className="text-emerald-500">
                          {reminders ? (
                            <CheckSquare size={20} />
                          ) : (
                            <div className="h-5 w-5 rounded-[4px] border-2 border-slate-300 dark:border-slate-600" />
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Appointment reminders
                        </span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3">
                        <div onClick={() => setSms(!sms)} className="text-emerald-500">
                          {sms ? (
                            <CheckSquare size={20} />
                          ) : (
                            <div className="h-5 w-5 rounded-[4px] border-2 border-slate-300 dark:border-slate-600" />
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Allow SMS messages
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* FOOTER (Sticky) */}
            <div className="flex-shrink-0 border-t border-slate-100 p-8 px-10 dark:border-white/5">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 py-5 text-[12px] font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-50 dark:border-white/5"
                >
                  Cancel
                </button>
                <button
                  form="customer-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-2xl bg-emerald-500 py-5 text-[12px] font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-500/30 transition-all hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Profile...' : 'Create Customer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
