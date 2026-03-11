import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { generateInvoiceFromJob } from '@/lib/actions/invoices';
import ReportDownloader from '@/components/v2/ReportDownloader';
import { ArrowLeft, Receipt, Briefcase, Calendar, MapPin, CheckCircle2, Clock } from 'lucide-react';
import NeighborhoodBlitzCard from '@/components/v2/NeighborhoodBlitzCard';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id: jobId } = await params;

  // 1. Fetch Job + Customer + Reports
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      customers (*),
      job_reports (*)
    `)
    .eq('id', jobId)
    .single();

  if (error || !job) {
    return <div className="p-20 text-center font-black text-red-500">Job not found.</div>;
  }

  // Handle array vs object for customer relationship
  const customer = Array.isArray(job.customers) ? job.customers[0] : job.customers;
  const report = job.job_reports?.[0];

  // Bulletproof Inline Server Action
  async function handleGenerateInvoice() {
    'use server';
    await generateInvoiceFromJob(job.id);
    revalidatePath(`/dashboard/jobs/${job.id}`);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* 1. HEADER & NAVIGATION */}
      <div>
        <Link href="/dashboard" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 flex items-center gap-2 mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to Dispatch
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              {job.service_type || 'General Service'}
              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-xl ${
                job.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                job.status === 'invoiced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
              }`}>
                {job.status?.replace('_', ' ') || 'Scheduled'}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Work Order #{job.id.split('-')[0].toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-4 lg:mt-8">
        
        {/* LEFT COLUMN: Job & Customer Context */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          
          {/* Photos & PDF Report Section */}
          <div className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Service Report</h2>
              {/* PDF DOWNLOAD BUTTON LIVE HERE */}
              {report && (
                <div className="shrink-0">
                  <ReportDownloader customer={customer} job={job} />
                </div>
              )}
            </div>

            {report ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Before</p>
                  <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                    <img src={report.before_photo_url} className="w-full h-full object-cover" alt="Before" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">After</p>
                  <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                    <img src={report.after_photo_url} className="w-full h-full object-cover" alt="After" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/5">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">No photos uploaded for this job yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: The Financial Engine */}
        <div className="space-y-4 lg:space-y-6">
          <NeighborhoodBlitzCard jobId={job.id} />
          
          {/* Customer Quick Info */}
          <div className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Customer Info</h3>
            <Link href={`/dashboard/customers/${customer.id}`} className="font-bold text-lg text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors block mb-4">
              {customer?.name}
            </Link>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <MapPin size={16} className="text-slate-400" /> {customer?.address || 'No address'}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                <Calendar size={16} className="text-slate-400" /> {new Date(job.scheduled_at).toLocaleDateString()}
              </div>
            </div>
            
            <Link 
              href={`/portal/${customer.id}`} 
              target="_blank"
              className="mt-6 w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest text-center block hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              View Client Portal
            </Link>
          </div>

          {/* INVOICE ACTION CARD */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-500/20">
             <div className="flex items-center gap-3 mb-2">
               <Receipt className="text-blue-200" size={24} />
               <h3 className="text-xl font-black tracking-tight">Billing</h3>
             </div>
             
             {job.status === 'invoiced' ? (
               <div className="mt-6">
                 <div className="flex items-center justify-center gap-2 py-4 bg-white/10 rounded-xl border border-white/20 font-black text-sm uppercase tracking-widest text-green-300">
                   <CheckCircle2 size={18} /> Invoice Sent
                 </div>
               </div>
             ) : (
               <>
                 <p className="text-blue-100 text-sm font-medium mt-2 mb-6 leading-relaxed">
                   Job is marked complete. Generate the invoice to collect payment from the customer.
                 </p>
                 <form action={handleGenerateInvoice}>
                   <button 
                     type="submit"
                     className="w-full py-4 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-lg"
                   >
                     Generate Invoice
                   </button>
                 </form>
               </>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}