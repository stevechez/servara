'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Phone, Mail, Clock, Loader2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Props {
  customerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerProfileSlideover({ customerId, isOpen, onClose }: Props) {
  // Inside the component...
  const [sendingSms, setSendingSms] = useState<string | null>(null); // Track specific job ID

  const handleSendSms = async (job: any) => {
    setSendingSms(job.id);
    try {
      const res = await fetch('/api/sms/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customer.phone,
          customerName: customer.name,
          stripeLink: job.stripe_link,
        }),
      });

      if (res.ok) alert('Payment link texted to customer!');
    } catch (err) {
      alert('Failed to send SMS');
    } finally {
      setSendingSms(null);
    }
  };

  const [customer, setCustomer] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // New state for button loading

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (isOpen && customerId) {
      const fetchDetails = async () => {
        setLoading(true);
        const { data: custData } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .single();
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('customer_id', customerId)
          .order('scheduled_at', { ascending: false });

        setCustomer(custData);
        setJobs(jobsData || []);
        setLoading(false);
      };
      fetchDetails();
    }
  }, [isOpen, customerId, supabase]);

  // FIXED: Logic moved inside the component
  const handleCompleteJob = async (jobId: string, amount: number) => {
    const handleCompleteJob = async (jobId: string, amount: number) => {
      setActionLoading(true);
      try {
        // 1. Update Job Status in Supabase
        const { error } = await supabase
          .from('jobs')
          .update({ status: 'completed' })
          .eq('id', jobId);

        if (error) throw error;

        // 2. Generate Stripe Payment Link via our API
        const stripeRes = await fetch('/api/payments/create-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: jobId,
            amount: amount,
            customerEmail: customer?.email, // Pass email for Stripe receipt
          }),
        });

        const stripeData = await stripeRes.json();

        if (!stripeRes.ok) throw new Error(stripeData.error);

        // 3. UI Updates
        router.refresh();
        setJobs(
          jobs.map((j) =>
            j.id === jobId ? { ...j, status: 'completed', stripe_link: stripeData.url } : j
          )
        );

        alert('Job completed! Payment link generated.');
      } catch (err: any) {
        console.error(err);
        alert(`Error: ${err.message || 'Failed to complete job'}`);
      } finally {
        setActionLoading(false);
      }
    };

    setActionLoading(true);
    try {
      const { error } = await supabase.from('jobs').update({ status: 'completed' }).eq('id', jobId);

      if (error) throw error;

      // OPTIONAL: Trigger Stripe link here in the future

      router.refresh();
      // Refresh local state to show change immediately
      setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: 'completed' } : j)));
    } catch (err) {
      console.error(err);
      alert('Failed to complete job');
    } finally {
      setActionLoading(false);
    }
  };

  const ltv = jobs.reduce((sum, j) => sum + (Number(j.amount) || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/40 backdrop-blur-sm duration-300"
        onClick={onClose}
      />

      <div className="animate-in slide-in-from-right relative h-full w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white shadow-2xl duration-500 dark:border-white/5 dark:bg-[#0B0E14]">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="flex h-full flex-col">
            {/* Header: Identity & LTV */}
            <div className="border-b border-slate-100 bg-slate-50/50 p-8 dark:border-white/5 dark:bg-white/5">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-3xl leading-tight font-black italic dark:text-white">
                    {customer?.name}
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] font-black tracking-widest text-blue-600 uppercase">
                      Active Client
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 shadow-sm transition-all hover:bg-white dark:hover:bg-white/5"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-white/5 dark:bg-white/5">
                  <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Lifetime Value
                  </p>
                  <p className="text-xl font-black text-emerald-600">${ltv.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-white/5 dark:bg-white/5">
                  <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Total Jobs
                  </p>
                  <p className="text-xl font-black dark:text-white">{jobs.length}</p>
                </div>
              </div>
            </div>

            {/* Content: Contact & History */}
            <div className="space-y-8 p-8">
              <section>
                <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-[0.2em] text-slate-400 uppercase">
                  <MapPin size={14} /> Contact Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm font-bold dark:text-slate-300">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-white/5">
                      <Phone size={16} />
                    </div>
                    {customer?.phone || 'No phone recorded'}
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold dark:text-slate-300">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-white/5">
                      <Mail size={16} />
                    </div>
                    {customer?.email || 'No email recorded'}
                  </div>
                  <div className="flex items-start gap-4 text-sm font-bold dark:text-slate-300">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-white/5">
                      <MapPin size={16} />
                    </div>
                    <span className="flex-1">{customer?.address}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-[0.2em] text-slate-400 uppercase">
                  <Clock size={14} /> Service History
                </h3>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:border-blue-500/50 dark:border-white/5 dark:bg-white/5"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-bold dark:text-white">{job.service_type}</p>
                        <p className="text-[10px] font-medium text-slate-500">
                          {new Date(job.scheduled_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-xs font-black dark:text-white">${job.amount}</p>
                          <p
                            className={`text-[9px] font-black tracking-tighter uppercase ${job.status === 'completed' ? 'text-emerald-500' : 'text-blue-600'}`}
                          >
                            {job.status}
                          </p>
                        </div>

                        {/* THE MARK DONE BUTTON */}
                        {job.status === 'scheduled' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleCompleteJob(job.id, job.amount)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-[10px] font-black text-white uppercase shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:opacity-50"
                          >
                            {actionLoading ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Check size={12} strokeWidth={4} />
                            )}
                            Done
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
