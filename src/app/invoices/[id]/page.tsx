import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Receipt, CheckCircle2, Building2, Download, CreditCard } from 'lucide-react';

export default async function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id: invoiceId } = await params;

  // Fetch the invoice, plus the linked job and customer data
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(
      `
      *,
      jobs (*),
      customers (*)
    `
    )
    .eq('id', invoiceId)
    .single();

  // ADD THIS LINE RIGHT HERE:
  console.log('SUPABASE ERROR:', error);

  if (error || !invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-[#0B0E14]">
        <div className="space-y-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <Receipt size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Invoice Not Found</h1>
          <p className="font-medium text-slate-500">
            This invoice may have been deleted or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  // Handle Supabase returning arrays vs objects
  const customer = Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers;
  const job = Array.isArray(invoice.jobs) ? invoice.jobs[0] : invoice.jobs;

  const isPaid = invoice.status === 'paid';

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 selection:bg-blue-500/30 dark:bg-[#0B0E14]">
      <div className="mx-auto max-w-3xl">
        {/* Top Action Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <Building2 className="text-white" size={16} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
              Zidro<span className="text-blue-600">Pro</span>
            </span>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black tracking-widest text-slate-600 uppercase shadow-sm transition-colors hover:bg-slate-50 dark:border-white/5 dark:bg-[#12161D] dark:text-slate-300 dark:hover:bg-white/5">
            <Download size={16} /> Save PDF
          </button>
        </div>

        {/* The Invoice Paper */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl dark:border-white/5 dark:bg-[#12161D]">
          {/* PAID WATERMARK */}
          {isPaid && (
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-5 dark:opacity-10">
              <span className="rounded-3xl border-8 border-green-500 p-8 text-9xl font-black tracking-widest text-green-500 uppercase">
                PAID
              </span>
            </div>
          )}

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 border-b border-slate-100 p-8 md:flex-row md:items-center md:p-12 dark:border-white/5">
            <div>
              <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white">
                Invoice
              </h1>
              <p className="font-medium text-slate-500">
                #{invoice.id.split('-')[0].toUpperCase()}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="mb-1 text-sm font-medium text-slate-500">Amount Due</p>
              <p className="text-4xl font-black tracking-tight text-blue-600 md:text-5xl">
                ${invoice.amount}
              </p>
              <div
                className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black tracking-widest uppercase ${
                  isPaid
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                }`}
              >
                {isPaid ? (
                  <>
                    <CheckCircle2 size={12} /> Paid in Full
                  </>
                ) : (
                  <>
                    <Receipt size={12} /> Pending Payment
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-10 p-8 md:p-12">
            <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Billed To
                </h3>
                <p className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                  {customer?.name || 'Valued Customer'}
                </p>
                <p className="text-sm font-medium text-slate-500">
                  {customer?.address || 'No address on file'}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">{customer?.email}</p>
              </div>
              <div>
                <h3 className="mb-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Service Details
                </h3>
                <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">Date:</span>{' '}
                  {new Date(invoice.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">Service:</span>{' '}
                  {job?.service_type || 'General Service Call'}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:border-white/5 dark:bg-white/5">
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  <tr className="border-b border-slate-100 dark:border-white/5">
                    <td className="p-4 text-slate-900 dark:text-white">
                      Standard Service Call & Labor
                    </td>
                    <td className="p-4 text-right text-slate-900 dark:text-white">
                      ${invoice.amount}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-[#0B0E14]">
                    <td className="p-4 text-right font-bold text-slate-500">Total Due:</td>
                    <td className="p-4 text-right text-lg font-black text-slate-900 dark:text-white">
                      ${invoice.amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Call to Action */}
            {!isPaid && (
              <div className="rounded-2xl bg-slate-900 p-6 text-center text-white dark:bg-blue-600">
                <h3 className="mb-2 text-lg font-black">Ready to settle up?</h3>
                <p className="mb-6 text-sm font-medium text-slate-400 dark:text-blue-100">
                  Pay securely via credit card or bank transfer.
                </p>
                <button className="mx-auto flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-black tracking-widest text-white uppercase shadow-xl shadow-blue-500/20 transition-transform hover:scale-105 active:scale-95 sm:w-auto dark:bg-white dark:text-blue-600">
                  <CreditCard size={18} /> Pay ${invoice.amount} Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs font-bold tracking-widest text-slate-400 uppercase">
          Powered by ZidroPro
        </p>
      </div>
    </div>
  );
}
