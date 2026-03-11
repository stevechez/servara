import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, Calendar, Camera } from 'lucide-react';
import ReportDownloader from '@/components/v2/ReportDownloader';

// Define the shape of our data for TypeScript
interface JobWithReports {
  id: string;
  status: string;
  service_type: string;
  scheduled_at: string;
  job_reports: {
    before_photo_url: string;
    after_photo_url: string;
  }[];
}

export default async function CustomerPortal({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  // 1. Fetch Customer + Jobs + Reports (Server-side)
  const { data: customer } = await supabase
    .from('customers')
    .select(`
      *,
      jobs (
        *,
        job_reports (*)
      )
    `)
    .eq('id', id)
    .single();

  if (!customer) return <div className="p-20 text-center font-black">Portal Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] pb-20">
      {/* HERO SECTION */}
      <div className="bg-white dark:bg-[#0B0E14] border-b border-slate-200 dark:border-white/5 pt-16 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="h-16 w-16 bg-blue-600 rounded-2xl mb-6 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
            Service Portal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-2">Welcome back, {customer.name}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-8 space-y-8">
        {/* RECENT SERVICE REPORTS */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Recent Service Reports</h2>
          
          {customer.jobs?.filter((j: any) => j.status === 'completed').map((job: JobWithReports) => (
            <div key={job.id} className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-[32px] p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{job.service_type}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Calendar size={14} /> {new Date(job.scheduled_at).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black uppercase rounded-lg">
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* PHOTO GALLERY */}
              {job.job_reports?.[0] ? (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Before</p>
                    <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-inner bg-slate-50 dark:bg-black/20">
                      <img src={job.job_reports[0].before_photo_url} className="w-full h-full object-cover" alt="Before service" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">After</p>
                    <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-inner bg-slate-50 dark:bg-black/20">
                      <img src={job.job_reports[0].after_photo_url} className="w-full h-full object-cover" alt="After service" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                  <Camera size={32} className="mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">No photos for this visit</p>
                </div>
              )}

              {/* PDF DOWNLOAD BUTTON (Client Component) */}
              {job.job_reports?.[0] && (
                <ReportDownloader customer={customer} job={job} />
              )}
            </div>
          ))}
        </div>

        {/* FEEDBACK & REVIEW SECTION */}
        <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-500/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <span className="text-2xl">⭐️</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black uppercase tracking-tight">How did we do?</h3>
              <p className="text-blue-100 text-sm font-medium mt-1">
                Your feedback helps us grow. If you're happy with the service, please leave us a quick review!
              </p>
            </div>
            <a 
              href="https://g.page/r/YOUR_GOOGLE_REVIEW_ID/review" 
              target="_blank"
              className="w-full md:w-auto px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95 text-center"
            >
              Leave a Review
            </a>
          </div>
        </div>

        {/* HELP & SUPPORT */}
        <div className="text-center py-8">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Need help with something else?</p>
          <div className="flex justify-center gap-4">
            <a href={`tel:${customer.phone}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">Call Support</a>
            <span className="text-slate-200 dark:text-white/10">•</span>
            <a href={`mailto:${customer.email}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">Email Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}