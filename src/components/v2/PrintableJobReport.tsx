'use client';

import { forwardRef } from 'react';
import { CheckCircle2, MapPin, Calendar } from 'lucide-react';

interface Props {
  customer: any;
  job: any;
}

export const PrintableJobReport = forwardRef<HTMLDivElement, Props>(({ customer, job }, ref) => {
  return (
    <div ref={ref} className="min-h-screen bg-white p-12 text-slate-900">
      {/* PDF HEADER */}
      <div className="mb-8 flex items-start justify-between border-b-2 border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-blue-600 uppercase italic">
            Zidro Pro
          </h1>
          <p className="mt-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
            Official Service Report
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black uppercase">Job #{job.id.slice(0, 8)}</p>
          <p className="text-xs font-medium text-slate-500">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* CLIENT & JOB INFO */}
      <div className="mb-12 grid grid-cols-2 gap-12">
        <div>
          <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Service For
          </p>
          <p className="text-lg font-bold">{customer.name}</p>
          <p className="mt-1 text-sm text-slate-600">{customer.address}</p>
        </div>
        <div>
          <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Service Performed
          </p>
          <p className="text-lg font-bold uppercase italic">{job.service_type}</p>
          <p className="mt-1 text-sm text-slate-600">
            Completed: {new Date(job.scheduled_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* THE PHOTOS */}
      <div className="space-y-8">
        <h2 className="border-b border-slate-100 pb-2 text-sm font-black tracking-widest uppercase">
          Visual Evidence
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="text-center text-[10px] font-black text-slate-400 uppercase">
              Before Service
            </p>
            <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src={job.job_reports[0]?.before_photo_url}
                className="h-full w-full object-cover"
                alt="Before"
              />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-center text-[10px] font-black text-slate-400 uppercase">
              After Service
            </p>
            <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src={job.job_reports[0]?.after_photo_url}
                className="h-full w-full object-cover"
                alt="After"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-20 border-t border-slate-100 pt-8 text-center">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Thank you for choosing Zidro Pro. Verified Service Completed.
        </p>
      </div>
    </div>
  );
});

PrintableJobReport.displayName = 'PrintableJobReport';
