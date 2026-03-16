'use client';

import React, { useState } from 'react';
import { Camera, CheckSquare, MapPin, Phone, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { updateJobStatus } from '@/app/actions/jobs';
import CampaignLauncher from '@/components/marketing/CampaignLauncher';

export default function TechnicianMobileView({ job }: { job: any }) {
  const [activeStep, setActiveStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showBlitz, setShowBlitz] = useState(false);

  const checklist = [
    'Safety Inspection Completed',
    'Pre-work Photos Captured',
    'Service Performed (Main Line Jetting)',
    'Post-work Cleanup & Testing',
    'Customer Walkthrough Completed',
  ];

  const handleComplete = async () => {
    if (activeStep < checklist.length) return;

    const result = await updateJobStatus(job.id, 'completed');
    if (result.success) {
      setShowBlitz(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white">
      {/* COMPACT STICKY HEADER */}
      <div className="sticky top-0 z-30 border-b border-white/5 bg-[#050608]/80 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black tracking-tight uppercase italic">
              {job.service_type}
            </h2>
            <p className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              <MapPin size={10} /> {job.customers?.address.split(',')[0]}
            </p>
          </div>
          <a
            href={`tel:${job.customers?.phone}`}
            className="rounded-full bg-blue-600 p-3 text-white"
          >
            <Phone size={20} />
          </a>
        </div>
      </div>

      <div className="space-y-8 p-6">
        {/* STEP PROGRESSION */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
            Task Checklist
          </h3>
          {checklist.map((task, i) => (
            <button
              key={i}
              onClick={() => i <= activeStep && setActiveStep(i + 1)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-5 transition-all ${
                i < activeStep
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : i === activeStep
                    ? 'border-blue-500 bg-blue-500/5 text-white'
                    : 'border-white/5 bg-white/5 text-slate-600'
              }`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                  i < activeStep ? 'border-emerald-500 bg-emerald-500' : 'border-current'
                }`}
              >
                {i < activeStep ? (
                  <CheckCircle size={14} className="text-black" />
                ) : (
                  <span className="text-[10px]">{i + 1}</span>
                )}
              </div>
              <span className="text-left text-sm font-bold tracking-tight uppercase">{task}</span>
            </button>
          ))}
        </div>

        {/* EVIDENCE CAPTURE */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
            Project Evidence
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-white/10 bg-white/5 py-10 text-slate-400 hover:border-blue-500 hover:text-blue-500">
              <Camera size={32} />
              <span className="text-[10px] font-black tracking-widest uppercase">Add Photo</span>
            </button>
            <div className="flex items-center justify-center rounded-[2rem] border border-white/5 bg-white/5">
              <p className="text-[10px] font-bold text-slate-600 uppercase italic">
                Before/After Ready
              </p>
            </div>
          </div>
        </div>

        {/* FINAL ACTION */}
        <button
          onClick={handleComplete}
          disabled={activeStep < checklist.length}
          className={`group relative flex w-full items-center justify-center gap-3 rounded-[2rem] py-6 text-sm font-black tracking-[0.3em] uppercase transition-all active:scale-95 ${
            activeStep >= checklist.length
              ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40'
              : 'bg-white/5 text-slate-700'
          }`}
        >
          <Play size={18} className={activeStep >= checklist.length ? 'animate-pulse' : ''} />
          Complete & Launch Blitz
          {activeStep < checklist.length && (
            <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[8px] text-black">
              <AlertCircle size={10} /> Finish Steps
            </div>
          )}
        </button>
      </div>

      <CampaignLauncher
        isOpen={showBlitz}
        onClose={() => setShowBlitz(false)}
        neighborCount={14}
        neighborName={job.customers?.name || 'Neighbor'}
      />
    </div>
  );
}
