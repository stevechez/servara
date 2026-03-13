'use client';

import { useInvoice } from '@/hooks/useInvoice';
import { Loader2, ShieldCheck, CreditCard, Printer } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { payInvoice } from '@/lib/actions/stripe';

export const InvoiceView = ({ jobId }: { jobId: string }) => {
  const { invoice, loading, error } = useInvoice(jobId);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  if (error || !invoice)
    return (
      <div className="p-12 text-center font-bold text-red-500">{error || 'Invoice not found'}</div>
    );

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-bold text-green-600">
          <ShieldCheck size={16} /> Secure Payment Portal
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800"
        >
          <Printer size={16} /> Print / PDF
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl print:border-none print:shadow-none">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-slate-100 bg-slate-900 p-8 text-white md:flex-row md:p-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{siteConfig.name}</h1>
            <p className="mt-1 text-sm text-slate-400">{siteConfig.contact.email}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="mb-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
              Invoice
            </p>
            <p className="font-mono text-xl font-bold">#{invoice.id.split('-')[0].toUpperCase()}</p>
            <div className="mt-4 inline-block rounded bg-white/10 px-3 py-1 text-sm font-bold tracking-wider uppercase">
              {invoice.status === 'paid' ? 'Paid in Full' : 'Payment Due'}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 border-b border-slate-50 p-8 md:flex-row md:p-12">
          <div>
            <p className="mb-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              Billed To
            </p>
            <p className="text-lg font-bold text-slate-900">{invoice.customer_name}</p>
            <p className="text-slate-500">{invoice.location || 'Location on file'}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="mb-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
              Date Issued
            </p>
            <p className="font-bold text-slate-900">
              {new Date(invoice.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-slate-100 text-xs font-bold tracking-wider text-slate-400 uppercase">
                <th className="pb-4">Description</th>
                <th className="w-20 pb-4 text-center">Qty</th>
                <th className="w-32 pb-4 text-right">Price</th>
                <th className="w-32 pb-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {invoice.line_items?.map((item) => (
                <tr key={item.id} className="border-b border-slate-50">
                  <td className="py-4 font-bold text-slate-800">{item.description}</td>
                  <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-4 text-right text-slate-600">${item.unit_price.toFixed(2)}</td>
                  <td className="py-4 text-right font-bold text-slate-900">
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 flex justify-end">
            <div className="w-full space-y-3 md:w-1/2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>${invoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="mt-3 flex justify-between border-t-2 border-slate-900 pt-3 text-xl font-black text-slate-900">
                <span>Total Due</span>
                <span>${invoice.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button Footer */}
        {invoice.status !== 'paid' && (
          <div className="border-t border-slate-100 bg-slate-50 p-8 md:p-12 print:hidden">
            {/* We wrap the button in a form and bind the job data to the Stripe action */}
            <form action={payInvoice.bind(null, invoice.id, invoice.amount, invoice.customer_name)}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-1 hover:bg-blue-700"
              >
                <CreditCard size={24} />
                Pay ${invoice.amount.toFixed(2)} Now
              </button>
            </form>
            <p className="mt-4 flex items-center justify-center gap-1 text-center text-xs font-bold text-slate-400 uppercase">
              <ShieldCheck size={14} /> Powered by Stripe
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
