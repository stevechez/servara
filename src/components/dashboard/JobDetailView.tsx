'use client';

import React, { useState } from 'react';
import EditJobModal from './EditJobModal';
import {
  MapPin,
  User,
  Clock,
  Phone,
  Wrench,
  Tag,
  Calendar,
  ChevronLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import JobProfitPanel from './JobProfitPanel';
import GenerateInvoiceButton from './GenerateInvoiceButton';
import { dispatchTechnician } from '@/app/actions/dispatch';
import TechActionCenter from './TechActionCenter';
import WorkNotes from './WorkNotes';
import SignaturePad from './SignaturePad'; // Ensure this is imported!

export default function JobDetailView({ job }: { job: any }) {
  // 1. Hooks
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  // 2. Early return
  if (!job) return <div className="p-8 text-white">Job not found.</div>;

  // 3. Data Extraction
  const customer = job.customers || {};
  const service = job.services || {};
  const tech = job.technicians || {};
  const costs = job.job_costs?.[0] || { labor_cost: 0, material_cost: 0, overhead_cost: 0 };
  const lead = job.lead_sources || null;

  // 4. Dispatch Handler
  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      const result = await dispatchTechnician(job.id);
      if (result.success) {
        alert('Technician Dispatched! Status updated to En Route.');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      alert('Failed to connect to the server.');
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] p-8 text-white">
      {/* HEADER SECTION */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/dispatch"
            className="rounded-xl bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                Job #{job.id.split('-')[0]}
              </h1>
              <span
                className={`rounded-md border px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
                  job.status === 'completed'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                    : job.status === 'en_route' || job.status === 'in_progress'
                      ? 'border-blue-500/30 bg-blue-500/10 text-blue-500'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-500'
                }`}
              >
                {job.status || 'Scheduled'}
              </span>
            </div>
            {lead && (
              <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Source: <span style={{ color: lead.color_code }}>{lead.name}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <GenerateInvoiceButton
            jobId={job.id}
            customerId={customer.id}
            amount={service.base_price || 0}
          />
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="rounded-xl border border-white/10 bg-[#0B0E14] px-6 py-3 text-xs font-black tracking-widest uppercase transition hover:bg-white/5"
          >
            Edit Job
          </button>
          <button
            onClick={handleDispatch}
            disabled={isDispatching || !job.assigned_technician_id}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-black tracking-widest uppercase shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:opacity-50"
          >
            {isDispatching && <Loader2 size={16} className="animate-spin" />}
            {isDispatching ? 'Dispatching...' : 'Dispatch Tech'}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: PRIMARY JOB INFO */}
        <div className="space-y-6 lg:col-span-2">
          {/* CLIENT DETAILS */}
          <div className="rounded-[2rem] border border-white/5 bg-[#0B0E14] p-8 shadow-2xl">
            <h2 className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              <User size={14} /> Client Details
            </h2>
            <p className="text-2xl font-black text-white">{customer.name || 'Unknown Client'}</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone size={16} className="text-blue-500" />
                <span>{customer.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin size={16} className="mt-0.5 text-emerald-500" />
                <span>{customer.address || 'No address provided'}</span>
              </div>
            </div>
          </div>

          {/* SCOPE OF WORK */}
          <div className="rounded-[2rem] border border-white/5 bg-[#0B0E14] p-8 shadow-2xl">
            <h2 className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              <Wrench size={14} /> Scope of Work
            </h2>
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div>
                <p className="text-xl font-black text-white">{service.name || 'General Service'}</p>
                <p className="mt-1 text-xs font-bold text-slate-500 uppercase">Pricebook Item</p>
              </div>
              <p className="text-2xl font-black text-emerald-500 italic">
                ${service.base_price?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="mt-6 flex gap-8">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar size={16} className="text-blue-500" />
                <span className="font-bold">
                  {job.scheduled_start_time
                    ? new Date(job.scheduled_start_time).toLocaleDateString()
                    : 'Unscheduled'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock size={16} className="text-blue-500" />
                <span className="font-bold">{service.estimated_duration_minutes || 60} Min</span>
              </div>
            </div>
          </div>

          {/* FIELD WORK SECTION */}
          <WorkNotes jobId={job.id} initialNotes={job.work_notes} />
          <SignaturePad jobId={job.id} initialSignature={job.customer_signature} />
        </div>

        {/* RIGHT COLUMN: ACTIONS & ASSIGNMENT */}
        <div className="space-y-6">
          <JobProfitPanel
            revenue={service.base_price || 0}
            labor={costs.labor_cost || 0}
            materials={costs.material_cost || 0}
            overhead={costs.overhead_cost || 0}
          />

          <TechActionCenter job={job} />

          <div className="rounded-[2rem] border border-white/5 bg-[#0B0E14] p-6 shadow-2xl">
            <h2 className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              <Tag size={14} /> Assigned Technician
            </h2>
            {tech.name ? (
              <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-black text-white">
                  {tech.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-white">{tech.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Primary Tech</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/20 p-6 text-center text-xs font-bold text-slate-500 uppercase">
                Unassigned
              </div>
            )}
          </div>
        </div>
      </div>

      <EditJobModal job={job} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
}
