import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, ChevronRight, Receipt } from 'lucide-react';
import { redirect } from 'next/navigation';

export const revalidate = 0; // Kills the cache

export default async function InvoiceHistoryPage() {
  const supabase = await createClient();

  // 1. Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Fetch from the INVOICES table, locked to this user
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, customers(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-10">
        <h1 className="flex items-center gap-3 text-2xl font-black uppercase italic dark:text-white">
          <Receipt className="text-blue-600" size={24} />
          Billing History
        </h1>
        <p className="mt-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
          Archive of all generated invoices
        </p>
      </div>

      <div className="space-y-3">
        {invoices?.map((inv) => (
          <Link
            key={inv.id}
            href={`/dashboard/invoices/${inv.id}`}
            className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500/30 hover:shadow-xl dark:border-white/5 dark:bg-[#12161D]"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-slate-50 p-3 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-white/5">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-black tracking-tight text-slate-900 uppercase dark:text-white">
                  {inv.customers?.name || 'Unknown Customer'}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  <span>INV-{inv.id.toString().substring(0, 8)}</span>
                  <span>•</span>
                  <span>{new Date(inv.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span
                    className={`${
                      inv.status === 'paid'
                        ? 'text-emerald-500'
                        : inv.status === 'sent'
                          ? 'text-blue-500'
                          : 'text-slate-400'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* REAL AMOUNT FROM DATABASE */}
              <span className="text-sm font-black text-slate-900 dark:text-white">
                $
                {inv.amount?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </span>
              <ChevronRight
                size={18}
                className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500"
              />
            </div>
          </Link>
        ))}

        {(!invoices || invoices.length === 0) && (
          <div className="rounded-[3rem] border-2 border-dashed border-slate-100 py-20 text-center dark:border-white/5">
            <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
              No invoices generated yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
