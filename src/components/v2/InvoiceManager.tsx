'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, DollarSign } from 'lucide-react';

export default function InvoiceManager({ initialInvoices }: { initialInvoices: any[] }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  // Keep state in sync if server data changes
  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  // Dynamically calculate stats based on current state
  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0);
  const totalOutstanding = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + Number(i.amount), 0);

  const markAsPaid = async (id: string) => {
    setLoadingId(id);
    
    // 1. Optimistic UI update (Instant feedback)
    setInvoices(current => 
      current.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv)
    );

    // 2. Database update
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', id);
    
    setLoadingId(null);
    router.refresh(); // Sync server
  };

  return (
    <div className="space-y-8">
      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-6 rounded-[2rem] transition-all">
          <h3 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <DollarSign size={14} /> Total Collected
          </h3>
          <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
            ${totalCollected.toLocaleString()}
          </p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-6 rounded-[2rem] transition-all">
          <h3 className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Clock size={14} /> Outstanding
          </h3>
          <p className="text-3xl font-black text-rose-700 dark:text-rose-300">
            ${totalOutstanding.toLocaleString()}
          </p>
        </div>
      </div>

      {/* INVOICES TABLE */}
      <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Client & Job</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date Issued</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Amount</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map((invoice) => {
                const customer = Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers;
                const job = Array.isArray(invoice.jobs) ? invoice.jobs[0] : invoice.jobs;
                const isPaid = invoice.status === 'paid';

                return (
                  <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                        isPaid 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                      }`}>
                        {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-slate-900 dark:text-white">{customer?.name || 'Unknown Client'}</p>
                      <p className="text-xs text-slate-500 mt-1">{job?.title || 'General Service'}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-xs font-medium text-slate-500">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-6 text-right">
                      <p className={`text-lg font-black ${isPaid ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
                        ${Number(invoice.amount).toLocaleString()}
                      </p>
                    </td>
                    <td className="p-6 text-right">
                      {!isPaid ? (
                        <button 
                          onClick={() => markAsPaid(invoice.id)}
                          disabled={loadingId === invoice.id}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                          {loadingId === invoice.id ? 'Saving...' : 'Mark Paid'}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Settled</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 text-sm font-medium">
                    No invoices generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}