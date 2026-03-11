import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Receipt, CheckCircle2, Building2, Download, CreditCard } from 'lucide-react';

export default async function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id: invoiceId } = await params;

  // Fetch the invoice, plus the linked job and customer data
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(`
      *,
      jobs (*),
      customers (*)
    `)
    .eq('id', invoiceId)
    .single();

  // ADD THIS LINE RIGHT HERE:
  console.log("SUPABASE ERROR:", error);

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Receipt size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Invoice Not Found</h1>
          <p className="text-slate-500 font-medium">This invoice may have been deleted or the link is invalid.</p>
        </div>
      </div>
    );
  }

  // Handle Supabase returning arrays vs objects
  const customer = Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers;
  const job = Array.isArray(invoice.jobs) ? invoice.jobs[0] : invoice.jobs;

  const isPaid = invoice.status === 'paid';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] py-12 px-6 selection:bg-blue-500/30">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Building2 className="text-white" size={16} />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
              Servara<span className="text-blue-600">Pro</span>
            </span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Download size={16} /> Save PDF
          </button>
        </div>

        {/* The Invoice Paper */}
        <div className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden relative">
          
          {/* PAID WATERMARK */}
          {isPaid && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none opacity-5 dark:opacity-10">
              <span className="text-9xl font-black text-green-500 uppercase tracking-widest border-8 border-green-500 rounded-3xl p-8">
                PAID
              </span>
            </div>
          )}

          <div className="p-8 md:p-12 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Invoice</h1>
              <p className="text-slate-500 font-medium">#{invoice.id.split('-')[0].toUpperCase()}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-slate-500 font-medium mb-1">Amount Due</p>
              <p className="text-4xl md:text-5xl font-black text-blue-600 tracking-tight">${invoice.amount}</p>
              <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                isPaid ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
              }`}>
                {isPaid ? <><CheckCircle2 size={12} /> Paid in Full</> : <><Receipt size={12} /> Pending Payment</>}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Billed To</h3>
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">{customer?.name || 'Valued Customer'}</p>
                <p className="text-sm text-slate-500 font-medium">{customer?.address || 'No address on file'}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{customer?.email}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Service Details</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">
                  <span className="font-bold text-slate-900 dark:text-white">Date:</span> {new Date(invoice.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <span className="font-bold text-slate-900 dark:text-white">Service:</span> {job?.service_type || 'General Service Call'}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden mb-12">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-white/5">
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  <tr className="border-b border-slate-100 dark:border-white/5">
                    <td className="p-4 text-slate-900 dark:text-white">Standard Service Call & Labor</td>
                    <td className="p-4 text-right text-slate-900 dark:text-white">${invoice.amount}</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-[#0B0E14]">
                    <td className="p-4 text-right font-bold text-slate-500">Total Due:</td>
                    <td className="p-4 text-right font-black text-lg text-slate-900 dark:text-white">${invoice.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Call to Action */}
            {!isPaid && (
              <div className="bg-slate-900 dark:bg-blue-600 rounded-2xl p-6 text-center text-white">
                <h3 className="text-lg font-black mb-2">Ready to settle up?</h3>
                <p className="text-slate-400 dark:text-blue-100 text-sm mb-6 font-medium">Pay securely via credit card or bank transfer.</p>
                <button className="w-full sm:w-auto mx-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 dark:bg-white text-white dark:text-blue-600 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-blue-500/20 active:scale-95">
                  <CreditCard size={18} /> Pay ${invoice.amount} Now
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">
          Powered by ServaraPro
        </p>
      </div>
    </div>
  );
}