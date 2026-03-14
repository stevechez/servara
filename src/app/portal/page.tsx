'use client';

import { useState, useEffect, Suspense } from 'react'; // Added Suspense
import { useSearchParams } from 'next/navigation';
import { Wrench, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

function PortalContent() {
  const searchParams = useSearchParams();
  const [jobId, setJobId] = useState('');

  // Automatically grab the ID from the URL on load
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setJobId(idFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-md rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-xl shadow-slate-200/50">
      <h1 className="mb-2 text-3xl font-black text-slate-900">Track Your Project</h1>
      <p className="mb-8 font-medium text-slate-500">
        Enter your Job ID to see live updates, photos, and invoices.
      </p>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="e.g. #88241"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="w-full truncate rounded-2xl border border-slate-200 py-4 pr-4 pl-12 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-black tracking-widest text-white uppercase italic transition-all hover:bg-slate-800">
          Find My Project <ArrowRight size={18} />
        </button>
      </div>
      {/* ... rest of footer remains same */}
    </div>
  );
}

// Wrap in Suspense because useSearchParams() requires it in Next.js Client Components
export default function PortalLandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="mb-12 flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900">
        <div className="rounded-lg bg-blue-600 p-1.5 shadow-lg shadow-blue-600/20">
          <Wrench className="text-white" size={24} />
        </div>
        Zidro <span className="text-blue-600 uppercase italic">PRO</span>
        <span className="ml-2 font-medium text-slate-400">| Client Portal</span>
      </div>

      <Suspense
        fallback={<div className="rounded-3xl bg-white p-10 shadow-xl">Loading Portal...</div>}
      >
        <PortalContent />
      </Suspense>

      <Link
        href="/"
        className="mt-8 text-sm font-bold text-slate-400 transition-colors hover:text-slate-600"
      >
        Back to ZidroPro.com
      </Link>
    </div>
  );
}
