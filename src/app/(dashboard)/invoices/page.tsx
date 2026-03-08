import { createClient } from '@/lib/supabase/server';
import InvoiceManager from '@/components/v2/InvoiceManager';

export const revalidate = 0;

export default async function InvoicesPage() {
  const supabase = await createClient();
  
  // Fetch invoices and JOIN the related customer and job data
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, customers(name), jobs(title)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-24 md:pb-8">
      
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic dark:text-white">FINANCIALS</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Track your revenue, collect payments, and settle accounts.</p>
        </div>
      </header>

      {/* INTERACTIVE INVOICE MANAGER */}
      <InvoiceManager initialInvoices={invoices || []} />
      
    </div>
  );
}