import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { FileText, Printer, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Fetch job and customer info to build the invoice
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*, customers(*)')
    .eq('id', params.id)
    .single();

  if (error || !job) notFound();

  // Mock total—future sprint: calculate from a 'line_items' table
  const totalAmount = 1250.0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href={`/dashboard/jobs/${params.id}`}
        className="mb-8 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-blue-600"
      >
        <ArrowLeft size={14} /> Back to Job
      </Link>

      <div className="overflow-hidden rounded-[3rem] border border-slate-200 bg-white shadow-2xl dark:border-white/5 dark:bg-[#12161D]">
        {/* INVOICE HEADER */}
        <div className="bg-slate-900 p-12 text-white dark:bg-black">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                Zidro <span className="text-blue-500">Pro</span>
              </h1>
              <p className="mt-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
                Official Invoice
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black tracking-widest text-blue-500 uppercase">
                Invoice #INV-{job.id.toString().substring(0, 5)}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-400">
                ISSUED: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* BILLING INFO */}
        <div className="grid grid-cols-1 gap-12 p-12 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Bill To
            </h2>
            <p className="text-xl font-black dark:text-white">{job.customers?.name}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{job.customers?.address}</p>
            <p className="text-sm font-medium text-slate-500">{job.customers?.phone}</p>
          </div>
          <div className="md:text-right">
            <h2 className="mb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Status
            </h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-500 uppercase">
              <CheckCircle2 size={14} /> Paid via Stripe
            </div>
          </div>
        </div>

        {/* LINE ITEMS */}
        <div className="px-12 pb-12">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="pb-4 text-left text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Description
                </th>
                <th className="pb-4 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              <tr>
                <td className="py-6">
                  <p className="font-black text-slate-900 dark:text-white">{job.service_type}</p>
                  <p className="text-xs font-medium text-slate-500">{job.description}</p>
                </td>
                <td className="py-6 text-right font-black dark:text-white">
                  ${totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900 dark:border-white/10">
                <td className="pt-6 text-right text-xs font-black text-slate-400 uppercase">
                  Total Due
                </td>
                <td className="pt-6 text-right text-2xl font-black text-blue-600">
                  ${totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-center gap-4 border-t border-slate-100 bg-slate-50 p-8 dark:border-white/5 dark:bg-white/5">
          <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-[10px] font-black tracking-widest text-slate-600 uppercase shadow-sm transition-all hover:bg-slate-100 dark:bg-[#12161D] dark:text-slate-300">
            <Printer size={14} /> Print
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[10px] font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
