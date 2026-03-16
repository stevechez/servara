'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MapPin, User, Activity, LayoutGrid, Map as MapIcon } from 'lucide-react';
import Link from 'next/link';
import FleetMap from './FleetMap';
import { calculateJobPrediction } from '@/lib/utils/prediction';
import { sendArrivalAlert, sendReviewRequest } from '@/app/actions/sms-actions';
import { getInvoiceData } from '@/app/actions/invoice-actions';
import { sendCustomerNotification } from '@/app/actions/notification-actions';

export default function LiveDispatchBoard({ initialJobs }: { initialJobs: any[] }) {
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [jobs, setJobs] = useState(initialJobs);
  const supabase = createClient();

  // 1. Centralized fetcher
  const fetchUpdatedJobs = useCallback(async () => {
    const { data } = await supabase
      .from('jobs')
      .select(
        `
        id,
        status,
        actual_start_time,
        arrival_sms_sent,
        review_sms_sent,
        customers (name, address, phone),
        technicians (name),
        services (name, estimated_duration_minutes)
      `
      )
      .not('status', 'eq', 'completed')
      .order('status');

    if (data) setJobs(data as any[]);
  }, [supabase]);

  // 2. Realtime Watcher for status changes and Review SMS
  useEffect(() => {
    const channel = supabase
      .channel('dispatch_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'jobs' },
        async (payload) => {
          const updatedJob = payload.new as any;

          // AUTOMATION: Review SMS when job is completed
          // We fetch the full job details to get customer info since payload might be partial
          if (updatedJob.status === 'completed' && !updatedJob.review_sms_sent) {
            const { data: fullJob } = await supabase
              .from('jobs')
              .select('*, customers(name, phone)')
              .eq('id', updatedJob.id)
              .single();

            if (fullJob?.customers?.phone) {
              const result = await sendReviewRequest(
                fullJob.id,
                fullJob.customers.phone,
                fullJob.customers.name
              );
              if (result.success) {
                await supabase.from('jobs').update({ review_sms_sent: true }).eq('id', fullJob.id);
              }
            }
          }

          fetchUpdatedJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchUpdatedJobs]);

  // 3. Auto-Arrival SMS Watcher (Checks "In Progress" jobs)
  useEffect(() => {
    const checkArrivalThresholds = async () => {
      for (const job of jobs) {
        const prediction = job.status === 'in_progress' ? calculateJobPrediction(job) : null;

        if (prediction && prediction.progressPercent >= 90 && !job.arrival_sms_sent) {
          const result = await sendArrivalAlert(
            job.id, // Job ID for logging
            job.customers?.phone,
            job.customers?.name,
            job.technicians?.name
          );

          if (result.success) {
            await supabase.from('jobs').update({ arrival_sms_sent: true }).eq('id', job.id);
            fetchUpdatedJobs();
          }
        }
      }
    };

    const interval = setInterval(checkArrivalThresholds, 30000);
    return () => clearInterval(interval);
  }, [jobs, supabase, fetchUpdatedJobs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_route':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-500';
      case 'in_progress':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-500';
      default:
        return 'border-slate-500/30 bg-slate-500/10 text-slate-400';
    }
  };

  // Inside your update handler in LiveDispatchBoard.tsx
  const handleStatusChange = async (jobId: string, newStatus: string) => {
    // 1. Update Supabase
    const { data: job } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', jobId)
      .select('*, customers(*), technicians(*)')
      .single();

    // 2. If status is En Route, send the SMS
    if (newStatus === 'en_route' && job) {
      await sendCustomerNotification(job.customers.phone, job.customers.name, 'EN_ROUTE', {
        techName: job.technicians.name,
      });
    }
  };

  // Inside LiveDispatchBoard.tsx
  // import { sendInvoiceEmail } from '@/app/actions/email-actions'; // If you've built this

  const handleComplete = async (jobId: string) => {
    // 1. Update status
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', jobId);

    if (!error) {
      // 2. Trigger automated invoicing
      const invoiceData = await getInvoiceData(jobId);
      console.log('Invoice Generated:', invoiceData);

      // 3. Optional: Call your email server action here
      // await sendInvoiceEmail(invoiceData.customers.email, invoiceData);

      fetchUpdatedJobs(); // Refresh the board
    }
  };

  return (
    <div>
      {/* VIEW TOGGLE */}
      <div className="mb-8 flex justify-end">
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 shadow-2xl">
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition ${view === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <LayoutGrid size={14} /> Grid
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition ${view === 'map' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <MapIcon size={14} /> Map
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => {
            const prediction = job.status === 'in_progress' ? calculateJobPrediction(job) : null;

            return (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="group block rounded-[2rem] border border-white/5 bg-[#0B0E14] p-6 transition hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="mb-6 flex items-start justify-between">
                  <span
                    className={`rounded-md border px-3 py-1 text-[10px] font-black tracking-widest uppercase ${getStatusColor(job.status)}`}
                  >
                    {(job.status || 'scheduled').replace('_', ' ')}
                  </span>
                  <Activity
                    size={16}
                    className="text-slate-700 transition group-hover:text-blue-500"
                  />
                </div>

                <h3 className="mb-1 text-lg font-black text-white transition group-hover:text-blue-400">
                  {job.customers?.name || 'Unknown Client'}
                </h3>
                <p className="mb-4 text-sm font-bold text-slate-400 uppercase">
                  {job.services?.name || 'General Service'}
                </p>

                {prediction && (
                  <div className="mt-4 mb-6 space-y-2">
                    <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                      <span className={prediction.isOvertime ? 'text-red-500' : 'text-blue-500'}>
                        {prediction.isOvertime ? 'Overtime' : 'In Progress'}
                      </span>
                      <span className="font-mono text-slate-400">ETC: {prediction.etc}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full transition-all duration-1000 ${prediction.isOvertime ? 'bg-red-500' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                        style={{ width: `${prediction.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <User size={14} className="text-blue-500" />
                    <span>
                      Tech:{' '}
                      <strong className="text-slate-300">
                        {job.technicians?.name || 'Unassigned'}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <MapPin size={14} className="text-emerald-500" />
                    <span className="truncate">{job.customers?.address || 'No Address'}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <FleetMap jobs={jobs} />
      )}
    </div>
  );
}
