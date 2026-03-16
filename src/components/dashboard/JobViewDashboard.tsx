'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  MapPin,
  Calendar,
  User,
  Clock,
  ArrowLeft,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import CampaignLauncher from '@/components/marketing/CampaignLauncher';
import { updateJobStatus } from '@/app/actions/jobs';

export default function JobDetailView({ job }: { job: any }) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState(job.status);
  const [showBlitzModal, setShowBlitzModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Prevent Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const result = await updateJobStatus(job.id, newStatus);
      if (result.success) {
        setStatus(newStatus);
        // Trigger Blitz only when transitioning TO completed
        if (newStatus === 'completed') {
          setShowBlitzModal(true);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-[#050608]">
      {/* HEADER */}
      <div className="bg-[#0B1021] px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/dashboard/jobs"
            className="mb-8 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-white"
          >
            <ArrowLeft size={14} /> Back to Jobs
          </Link>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-600/20 px-3 py-1.5 text-blue-400">
                <Wrench size={18} />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  Active Project
                </span>
              </div>
              <h1 className="text-4xl leading-none font-black tracking-tighter uppercase italic md:text-6xl">
                {job.service_type || 'General Service'}
              </h1>
              <p className="mt-4 flex items-center gap-2 font-medium text-slate-400">
                <MapPin size={16} className="text-blue-500" />
                {job.customers?.address || 'No Address Provided'}
              </p>
            </div>

            <div className="flex min-w-[200px] flex-col gap-3">
              <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Update Status
              </p>
              <select
                value={status}
                disabled={isUpdating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="cursor-pointer rounded-2xl border-none bg-blue-600 px-6 py-4 text-sm font-black text-white uppercase italic shadow-xl shadow-blue-600/20 transition-all outline-none hover:bg-blue-700 disabled:opacity-50"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Mark Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* MAIN INFO */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-xl dark:border-white/5 dark:bg-[#12161D]">
              <h3 className="mb-8 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Customer Details
              </h3>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                    <User className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Contact
                    </p>
                    <p className="mt-1 text-lg leading-tight font-bold dark:text-white">
                      {job.customers?.name || 'Unknown Client'}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {job.customers?.phone || 'No Phone'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                    <Calendar className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Scheduled Date
                    </p>
                    <p className="mt-1 text-lg font-bold dark:text-white">
                      {job.scheduled_start_time
                        ? new Date(job.scheduled_start_time).toLocaleDateString()
                        : 'Unscheduled'}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Window: 8:00 AM - 12:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REVENUE INSIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-2xl">
              <div className="absolute -top-4 -right-4 opacity-10 transition-transform duration-500 group-hover:scale-110">
                <TrendingUp size={120} />
              </div>
              <TrendingUp className="mb-4 opacity-50" size={32} />
              <h3 className="text-[10px] font-black tracking-widest text-blue-200 uppercase">
                Project Value
              </h3>
              <p className="mt-1 text-5xl font-black tracking-tighter uppercase italic">
                ${job.amount?.toLocaleString() || '0'}
              </p>
              <div className="mt-8 flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 p-3 text-xs font-bold">
                <ShieldCheck size={16} className="text-emerald-400" /> Verified Profit Margin: 32%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THE 10x NEIGHBORHOOD BLITZ MODAL */}
      <CampaignLauncher
        isOpen={showBlitzModal}
        onClose={() => setShowBlitzModal(false)}
        neighborCount={14}
        neighborName={job.customers?.name || 'the homeowner'}
      />
    </div>
  );
}
