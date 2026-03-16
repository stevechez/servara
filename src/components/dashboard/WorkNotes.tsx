'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Save, Loader2 } from 'lucide-react';
import { updateWorkNotes } from '@/app/actions/tech-actions';

export default function WorkNotes({
  jobId,
  initialNotes,
}: {
  jobId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save logic: Saves 1.5 seconds after the tech stops typing
  useEffect(() => {
    if (notes === initialNotes) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      await updateWorkNotes(jobId, notes);
      setIsSaving(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [notes, jobId, initialNotes]);

  return (
    <div className="rounded-[2rem] border border-white/5 bg-[#0B0E14] p-8 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
          <FileText size={14} /> Technician Work Notes
        </h2>
        {isSaving && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase italic">
            <Loader2 size={12} className="animate-spin" /> Saving...
          </div>
        )}
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Describe the work performed, parts replaced, or issues found..."
        className="h-40 w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none"
      />
      <p className="mt-4 text-[10px] font-medium text-slate-600 italic">
        Notes are automatically saved and will appear on the final invoice.
      </p>
    </div>
  );
}
