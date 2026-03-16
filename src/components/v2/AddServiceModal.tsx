'use client';

import {
  X,
  Wrench,
  DollarSign,
  Clock,
  Tag,
  FileText,
  Hash,
  User,
  Box,
  CheckSquare,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createService } from '@/app/actions/catalog'; // <-- Import the new action

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export default function AddServiceModal({ isOpen, onClose, userId }: AddServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTaxable, setIsTaxable] = useState(true);
  const router = useRouter();

  if (!isOpen) return null;

  // Next.js 14+ Form Action Handler
  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createService(formData); // Sends data to Supabase
      router.refresh(); // Refreshes the page to show new data
      onClose(); // Closes the modal
    } catch (error) {
      console.error('Failed to save service', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[3rem] bg-white shadow-2xl dark:bg-[#12161D]">
        {/* HEADER */}
        <div className="flex-shrink-0 border-b border-slate-100 p-8 px-10 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">
                New Service
              </h2>
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Add a new line item to your catalog
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 p-3 text-slate-400 transition-colors hover:bg-slate-200 dark:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE FORM CONTENT */}
        <div className="overflow-y-auto p-10">
          {/* Note the use of "action=" instead of "onSubmit=" */}
          <form id="service-form" action={handleFormAction} className="space-y-10">
            {/* HIDDEN INPUTS TO PASS STATE DATA */}
            <input type="hidden" name="user_id" value={userId} />
            <input type="hidden" name="taxable" value={isTaxable.toString()} />

            {/* --- BASIC DETAILS --- */}
            <div>
              <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
                Core Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Service Name *
                  </label>
                  <div className="relative">
                    <Wrench className="absolute top-4 left-4 text-slate-300" size={18} />
                    <input
                      name="name"
                      required
                      placeholder="e.g. Tankless Water Heater Flush"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Category *
                  </label>
                  <div className="relative">
                    <Tag className="absolute top-4 left-4 text-slate-300" size={18} />
                    <select
                      name="category"
                      required
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                      <option value="">Select Category...</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Customer-Facing Description (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute top-4 left-4 text-slate-300" size={18} />
                    <textarea
                      name="description"
                      rows={2}
                      placeholder="Describe what is included in this service..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- PRICING & TIME --- */}
            <div>
              <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
                Pricing & Fulfillment
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Client Price ($) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute top-4 left-4 text-slate-300" size={18} />
                    <input
                      name="price"
                      required
                      type="number"
                      step="0.01"
                      placeholder="150.00"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Materials Cost ($)
                  </label>
                  <div className="relative">
                    <Box className="absolute top-4 left-4 text-slate-300" size={18} />
                    <input
                      name="materials_cost"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 45.00"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Est. Duration *
                  </label>
                  <div className="relative">
                    <Clock className="absolute top-4 left-4 text-slate-300" size={18} />
                    <select
                      name="estimated_duration"
                      required
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                      <option value="">Select Time...</option>
                      <option value="30 Minutes">30 Minutes</option>
                      <option value="1 Hour">1 Hour</option>
                      <option value="1.5 Hours">1.5 Hours</option>
                      <option value="2 Hours">2 Hours</option>
                      <option value="Half Day (4h)">Half Day (4h)</option>
                      <option value="Full Day (8h)">Full Day (8h)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* --- ADVANCED / OPTIONAL --- */}
            <div>
              <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Advanced / Internal
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Service Code / SKU
                  </label>
                  <div className="relative">
                    <Hash className="absolute top-4 left-4 text-slate-300" size={18} />
                    <input
                      name="service_code"
                      placeholder="e.g. PLM-TNK-01"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Default Technician
                  </label>
                  <div className="relative">
                    <User className="absolute top-4 left-4 text-slate-300" size={18} />
                    <select
                      name="default_technician"
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-12 text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                      <option value="">Unassigned (Any Tech)</option>
                      <option value="Mike">Mike</option>
                      <option value="Sarah">Sarah (Specialist)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* AUTOMATIONS / SETTINGS */}
            <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6 md:flex-row md:items-center md:gap-8 dark:border-blue-500/20 dark:bg-blue-500/5">
              <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">
                Accounting
              </span>
              <label className="flex cursor-pointer items-center gap-3">
                <div onClick={() => setIsTaxable(!isTaxable)} className="text-blue-600">
                  {isTaxable ? (
                    <CheckSquare size={20} />
                  ) : (
                    <div className="h-5 w-5 rounded-[4px] border-2 border-slate-300 dark:border-slate-600" />
                  )}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Service is Taxable
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex-shrink-0 border-t border-slate-100 p-8 px-10 dark:border-white/5">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 py-5 text-[12px] font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-50 dark:border-white/5"
            >
              Cancel
            </button>
            {/* type="submit" will trigger the form's action handler */}
            <button
              form="service-form"
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-blue-600 py-5 text-[12px] font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving to Database...' : 'Save to Catalog'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
