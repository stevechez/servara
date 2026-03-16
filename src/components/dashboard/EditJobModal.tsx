'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { updateJobDetails } from '@/app/actions/jobs';
import { geocodeCustomerAddress } from '@/app/actions/geo-actions'; // Import our new geo action

interface EditJobModalProps {
  job: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditJobModal({ job, isOpen, onClose }: EditJobModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown Data States
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);

  // Form States
  const [serviceId, setServiceId] = useState(job?.service_id || '');
  const [techId, setTechId] = useState(job?.assigned_technician_id || '');
  const [status, setStatus] = useState(job?.status || 'scheduled');

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      const supabase = createClient();

      const { data: srvData } = await supabase
        .from('services')
        .select('id, name, base_price')
        .order('name');
      setServices(srvData || []);

      const { data: techData } = await supabase
        .from('technicians')
        .select('id, name')
        .eq('active', true)
        .order('name');
      setTechnicians(techData || []);
    };

    fetchData();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save the basic job details
      await updateJobDetails(job.id, {
        service_id: serviceId,
        assigned_technician_id: techId,
        status: status,
      });

      // 2. TRIGGER GEOCODING
      // If the job has a customer with an address, ensure we have their coordinates
      if (job.customers?.id && job.customers?.address) {
        // We run this in the background to keep the UI snappy
        geocodeCustomerAddress(job.customers.id, job.customers.address);
      }

      onClose();
    } catch (error) {
      alert('Failed to save job details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-white/10 bg-[#0B0E14] shadow-2xl transition-transform duration-300">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <h2 className="text-lg font-black tracking-tighter text-white uppercase italic">
              Edit Job Details
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            id="edit-job-form"
            onSubmit={handleSubmit}
            className="flex-1 space-y-6 overflow-y-auto p-6"
          >
            <div>
              <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Scope of Work
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#12161D] p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- Select a Service --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (${s.base_price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Assign Technician
              </label>
              <select
                value={techId}
                onChange={(e) => setTechId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#12161D] p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- Unassigned --</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Job Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#12161D] p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="scheduled">Scheduled</option>
                <option value="en_route">En Route</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-white/5 p-6">
            <button
              form="edit-job-form"
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
