'use client';

import { forwardRef } from 'react';
import { CheckCircle2, MapPin, Calendar } from 'lucide-react';

interface Props {
  customer: any;
  job: any;
}

export const PrintableJobReport = forwardRef<HTMLDivElement, Props>(({ customer, job }, ref) => {
  return (
    <div ref={ref} className="p-12 bg-white text-slate-900 min-h-screen">
      {/* PDF HEADER */}
      <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-blue-600">Servara Pro</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Official Service Report</p>
        </div>
        <div className="text-right">
          <p className="font-black text-sm uppercase">Job #{job.id.slice(0, 8)}</p>
          <p className="text-xs text-slate-500 font-medium">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* CLIENT & JOB INFO */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service For</p>
          <p className="font-bold text-lg">{customer.name}</p>
          <p className="text-sm text-slate-600 mt-1">{customer.address}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Performed</p>
          <p className="font-bold text-lg uppercase italic">{job.service_type}</p>
          <p className="text-sm text-slate-600 mt-1">Completed: {new Date(job.scheduled_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* THE PHOTOS */}
      <div className="space-y-8">
        <h2 className="text-sm font-black uppercase tracking-widest border-b border-slate-100 pb-2">Visual Evidence</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase text-center">Before Service</p>
            <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img src={job.job_reports[0]?.before_photo_url} className="w-full h-full object-cover" alt="Before" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase text-center">After Service</p>
            <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img src={job.job_reports[0]?.after_photo_url} className="w-full h-full object-cover" alt="After" />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-20 pt-8 border-t border-slate-100 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thank you for choosing Servara Pro. Verified Service Completed.</p>
      </div>
    </div>
  );
});

PrintableJobReport.displayName = 'PrintableJobReport';