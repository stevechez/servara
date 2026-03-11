import { createClient } from '@/lib/supabase/server';
import { FileText, CheckCircle2, Circle, DollarSign, Receipt, ArrowUpRight } from 'lucide-react';
import { togglePaid } from '@/app/actions/togglePaid';
import Link from 'next/link';

export const revalidate = 0;

export default async function InvoicesPage() {
  const supabase = await createClient();
  
  // Fetch all completed jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, customers(name, email)')
    .eq('status', 'completed')
    .order('scheduled_at', { ascending: false });

  const safeJobs = jobs || [];
  const totalOutstanding = safeJobs.filter(j => !j.is_paid).reduce((sum, j) => sum + (Number(j.amount) || 0), 0);
  const totalCollected = safeJobs.filter(j => j.is_paid).reduce((sum, j) => sum + (Number(j.amount) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* FINANCIAL OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
           <div className="relative z-10">
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Collected</p>
             <h2 className="text-4xl font-black">${totalCollected.toLocaleString()}</h2>
           </div>
           <DollarSign className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/5 rotate-12" />
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-8 text-amber-900 shadow-sm">
           <p className="text-amber-600/60 text-xs font-black uppercase tracking-widest mb-2">Outstanding Balance</p>
           <h2 className="text-4xl font-black text-amber-900">${totalOutstanding.toLocaleString()}</h2>
           <p className="text-xs font-medium mt-2 text-amber-700/80">{safeJobs.filter(j => !j.is_paid).length} Unpaid Invoices</p>
        </div>
      </div>

      {/* INVOICE LIST */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt size={20} className="text-blue-600" /> Recent Billing
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {safeJobs.map((job) => {
                const togglePaidAction = togglePaid.bind(null, job.id, !!job.is_paid);
                
                return (
                  <tr key={job.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900">{job.customers?.name}</p>
                      <p className="text-xs text-slate-400">{job.customers?.email || 'No email on file'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-slate-600">
                        {new Date(job.scheduled_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-900">${job.amount}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          job.is_paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {job.is_paid ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                          {job.is_paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end items-center gap-2">
                          {/* 1. PDF VIEW */}
                          <Link 
                            href={`/invoices/${job.id}`} 
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="View Invoice PDF"
                          >
                            <FileText size={18} />
                          </Link>

                          {/* 2. TOGGLE PAID */}
                          <form action={togglePaidAction}>
                            <button type="submit" className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              job.is_paid ? 'bg-slate-100 text-slate-400 hover:text-red-500' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100'
                            }`}>
                              {job.is_paid ? 'Undo' : 'Mark Paid'}
                            </button>
                          </form>

                          {/* 3. GO TO PROFILE */}
                          <Link href={`/customers/${job.customer_id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <ArrowUpRight size={18} />
                          </Link>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}