'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { completeJob } from '@/lib/services/job-workflow';

export default function CompleteJobButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    if (!confirm("Are you sure? This will trigger the invoice and review request.")) return;
    
    setLoading(true);
    const result = await completeJob(jobId);
    if (!result.success) alert(result.error);
    setLoading(false);
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
      Mark Job Complete
    </button>
  );
}