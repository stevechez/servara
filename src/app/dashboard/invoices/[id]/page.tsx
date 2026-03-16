import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Receipt, Download, Printer, ArrowLeft, CheckCircle2, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Fetch Invoice + Customer details
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, customers(*)')
    .eq('id', id)
    .single();

  if (!invoice) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Back Button */}
      <Link
        href="/dashboard/invoices"
        className="mb-8 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-all hover:text-blue-600"
      >
        <ArrowLeft size={14} />
        Back to All Invoices
      </Link>

      <div className="overflow-hidden rounded-[3rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 dark:border-white/5 dark:bg-[#12161D] dark:shadow-none">
        {/* TOP BANNER / HEADER */}
        <div className="bg-[#0B1021] p-10 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-6 flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-3 py-1.5">
                <Receipt size={18} />
                <span className="font-black tracking-tight">
                  Zidro <span className="text-blue-200 italic">PRO</span>
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase italic">Invoice</h1>
              <p className="mt-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                NO. {invoice.id.toString().substring(0, 8)}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase ${
                  invoice.status === 'paid'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {invoice.status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                {invoice.status}
              </div>
              <p className="mt-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Date Issued
              </p>
              <p className="text-lg font-bold">
                {new Date(invoice.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* INVOICE CONTENT */}
        <div className="p-12">
          <div className="mb-16 grid grid-cols-2 gap-20">
            <div>
              <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Bill To
              </h3>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {invoice.customers?.name}
              </p>
              <div className="mt-2 space-y-1 text-sm font-bold tracking-tight text-slate-500 uppercase">
                <p>{invoice.customers?.email}</p>
                <p>{invoice.customers?.address || 'No Address on File'}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Total Balance
              </h3>
              <p className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white">
                ${invoice.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* LINE ITEMS TABLE */}
          <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-1 dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center justify-between border-b border-slate-200 px-8 py-4 dark:border-white/10">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Description
              </span>
              <span className="text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Amount
              </span>
            </div>
            <div className="flex items-center justify-between px-8 py-10">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-black/20">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight text-slate-900 uppercase dark:text-white">
                    Professional Services Rendered
                  </p>
                  <p className="text-xs font-bold text-slate-400">Standard Labor & Materials</p>
                </div>
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ${invoice.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-12 flex items-center gap-4">
            <button className="group flex flex-1 items-center justify-center gap-3 rounded-2xl bg-[#0B1021] py-5 text-xs font-black tracking-[0.2em] text-white uppercase transition-all hover:bg-blue-600 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-blue-600 dark:hover:text-white">
              <Download size={18} className="transition-transform group-hover:-translate-y-1" />
              Download Invoice PDF
            </button>
            <button className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-10 py-5 text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              <Printer size={20} />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        Generated by Zidro Pro Cloud Billing System
      </p>
    </div>
  );
}
