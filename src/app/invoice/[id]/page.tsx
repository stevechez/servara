import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Receipt, Download, Printer, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
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
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!invoice) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Back Button */}
      <Link
        href="/dashboard/invoices"
        className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        BACK TO BILLING
      </Link>

      <div className="overflow-hidden rounded-[3rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 dark:border-white/5 dark:bg-[#12161D] dark:shadow-none">
        {/* Invoice Header */}
        <div className="bg-[#0B1021] p-10 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-4 flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-3 py-1.5">
                <Receipt size={18} />
                <span className="font-black tracking-tight">
                  Zidro <span className="text-blue-200 italic">PRO</span>
                </span>
              </div>
              <h1 className="text-4xl font-black uppercase italic">Invoice</h1>
              <p className="mt-1 text-sm font-bold tracking-widest text-slate-400 uppercase">
                #{invoice.id.toString().substring(0, 8)}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-[10px] font-black tracking-widest uppercase ${
                  invoice.status === 'paid'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {invoice.status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                {invoice.status}
              </div>
              <p className="mt-4 text-sm font-medium text-slate-400">Issued on</p>
              <p className="font-bold">{new Date(invoice.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-10">
          <div className="mb-12 grid grid-cols-2 gap-10">
            <div>
              <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Bill To
              </p>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {invoice.customers?.name}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">{invoice.customers?.email}</p>
              <p className="text-sm font-medium text-slate-500">{invoice.customers?.address}</p>
            </div>
            <div className="text-right font-mono">
              <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Total Amount Due
              </p>
              <p className="text-5xl font-black text-slate-900 dark:text-white">
                ${invoice.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Description
              </span>
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Amount
              </span>
            </div>
            <div className="flex items-center justify-between py-6">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Professional Services Rendered
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                ${invoice.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex gap-4">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-blue-700">
              <Download size={18} />
              Download PDF
            </button>
            <button className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-slate-600 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              <Printer size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
