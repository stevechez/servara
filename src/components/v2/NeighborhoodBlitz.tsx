'use client';

import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { launchNeighborhoodBlitz } from '@/lib/actions/blitz';
import { toast } from 'sonner';

export default function NeighborhoodBlitz({ activeJobId }: { activeJobId?: string }) {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');

  const startBlitz = async () => {
    if (!activeJobId) {
      toast.error('Select a completed job to blitz.');
      return;
    }

    setStatus('analyzing');

    try {
      const result = await launchNeighborhoodBlitz(activeJobId);

      if (result.success) {
        setStatus('done');
        toast.success(`AI Blitz Launched!`, {
          description: `Targeted ${result.count} neighbors in this area.`,
        });
      } else {
        setStatus('idle');
      }
    } catch (error) {
      setStatus('idle');
      toast.error('Blitz Failed');
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white shadow-2xl transition-all hover:scale-[1.02]">
      {status === 'analyzing' ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="mb-4 animate-spin text-indigo-200" size={40} />
          <p className="text-[10px] font-black tracking-[0.2em] uppercase">
            Targeting Neighbors...
          </p>
        </div>
      ) : (
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-white/20 p-2 backdrop-blur-md">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-[9px] font-black tracking-widest text-indigo-200 uppercase">
              Growth Engine
            </span>
          </div>

          <h2 className="text-2xl leading-none font-black tracking-tighter uppercase italic">
            AI Neighborhood <br /> Blitz
          </h2>
          <p className="mt-4 text-sm font-medium text-indigo-100/80">
            Generate 5+ leads from your last job site.
          </p>

          <button
            onClick={startBlitz}
            disabled={status === 'done'}
            className={`mt-8 w-full rounded-2xl py-4 text-[10px] font-black tracking-widest uppercase shadow-xl transition-all ${
              status === 'done'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-indigo-600 hover:bg-indigo-50 active:scale-95'
            }`}
          >
            {status === 'done' ? 'Blitz Active' : 'Launch AI Blitz'}
          </button>
        </div>
      )}
    </div>
  );
}
