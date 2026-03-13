'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { completeJob } from '@/lib/services/job-workflow';
import { useRouter } from 'next/navigation';

interface CompleteJobButtonProps {
  jobId: string;
  isCompleted?: boolean; // Pass current status from the server
}

export default function CompleteJobButton({ jobId, isCompleted = false }: CompleteJobButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    isCompleted ? 'success' : 'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleComplete() {
    // 1. Reset state
    setErrorMessage(null);
    setStatus('loading');

    try {
      const result = await completeJob(jobId);

      if (result.success) {
        setStatus('success');
        // 2. Refresh the server data to update headers/metrics
        router.refresh();
      } else {
        throw new Error(result.error || 'Failed to complete job');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus('error');
      // Reset back to idle after 3 seconds so they can try again
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  // 3. Pre-alpha check: If already success, show a "Completed" state instead of the button
  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-3 text-sm font-black tracking-widest text-emerald-600 uppercase">
        <CheckCircle2 size={18} />
        Job Completed
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleComplete}
        disabled={status === 'loading'}
        className={`flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-black tracking-widest uppercase shadow-xl transition-all active:scale-95 disabled:opacity-50 ${
          status === 'error'
            ? 'bg-red-600 text-white shadow-red-500/20'
            : 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700'
        } `}
      >
        {status === 'loading' ? (
          <Loader2 className="animate-spin" size={18} />
        ) : status === 'error' ? (
          <AlertCircle size={18} />
        ) : (
          <CheckCircle2 size={18} />
        )}

        {status === 'loading'
          ? 'Processing...'
          : status === 'error'
            ? 'Retry?'
            : 'Mark Job Complete'}
      </button>

      {/* 4. Elegant Error Message (No alerts!) */}
      {errorMessage && (
        <p className="animate-pulse text-center text-[10px] font-bold text-red-500 uppercase">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
