import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { CheckCircle2, MapPin, Wrench, ShieldCheck } from 'lucide-react';

export default async function CustomerPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch job details (using maybeSingle to avoid PGRST116 errors)
  const { data: job } = await supabase
    .from('jobs')
    .select(
      `
      *,
      customers (name, address),
      services (name, base_price),
      technicians (name)
    `
    )
    .eq('id', id)
    .maybeSingle();

  if (!job) notFound();

  return (
    <div className="min-h-screen bg-[#050608] text-white selection:bg-blue-500/30">
      {/* GLOW DECORATION */}
      <div className="pointer-events-none fixed top-0 left-1/2 h-[300px] w-full -translate-x-1/2 bg-blue-600/10 blur-[120px]" />

      <main className="relative mx-auto max-w-2xl px-6 py-12">
        {/* BRANDING */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-emerald-500 uppercase">
            <ShieldCheck size={12} /> Service Verified
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Job Summary</h1>
          <p className="mt-2 font-medium text-slate-500">Prepared for {job.customers?.name}</p>
        </div>

        {/* ... inside the CustomerPortalPage component ... */}

        {/* WORK SUMMARY CARD */}
        <div className="mb-6 rounded-[2.5rem] border border-white/5 bg-[#0B0E14] p-8 shadow-2xl">
          <h2 className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            <Wrench size={14} /> Work Performed
          </h2>

          <p className="mb-4 text-xl font-bold text-white">{job.services?.name}</p>

          <div className="mb-8 rounded-2xl bg-white/5 p-6 text-sm leading-relaxed text-slate-300 italic">
            "{job.work_notes || 'Service performed as requested.'}"
          </div>

          {/* NEW: CUSTOMER SIGNATURE DISPLAY */}
          {job.customer_signature && (
            <div className="mt-6 border-t border-white/5 pt-6">
              <p className="mb-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Authorized Signature
              </p>
              <div className="inline-block rounded-xl bg-white/5 p-4">
                <img
                  src={job.customer_signature}
                  alt="Customer Signature"
                  className="max-h-20 brightness-200 invert"
                />
              </div>
              <p className="mt-2 text-[10px] font-bold text-slate-600 uppercase italic">
                Electronically Signed by {job.customers?.name}
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Completed by {job.technicians?.name || 'Lead Technician'}
          </div>
        </div>

        {/* PAYMENT CARD */}
        <div className="rounded-[2.5rem] border border-white/5 bg-[#0B0E14] p-8 shadow-2xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Amount Due
              </p>
              <p className="mt-1 text-5xl font-black text-white italic">
                ${job.services?.base_price?.toLocaleString()}
              </p>
            </div>
            <div className="text-right text-[10px] font-bold text-slate-500 uppercase">
              Inv # {job.id.split('-')[0]}
            </div>
          </div>

          {job.status === 'completed' ? (
            <button className="w-full rounded-2xl bg-blue-600 py-5 font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]">
              Pay Now with Card
            </button>
          ) : (
            <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/5 py-5 text-center font-black tracking-[0.2em] text-slate-500 uppercase">
              Payment Pending Completion
            </div>
          )}

          <p className="mt-6 text-center text-[10px] font-bold tracking-widest text-slate-600 uppercase">
            Secure Encryption via Stripe
          </p>
        </div>
      </main>
    </div>
  );
}
