'use client';

import { useState } from 'react';
import { ArrowRight, PlayCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import VideoModal from './VideoModal';

export default function HeroButtons() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          href="/login" 
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 flex items-center gap-2 group"
        >
          Get Started for Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <button 
          onClick={() => setShowVideo(true)}
          className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <PlayCircle size={20} className="text-blue-600" /> Watch Demo
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm font-bold">
        <ShieldCheck size={18} className="text-emerald-500" />
        No credit card required
      </div>

      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
    </>
  );
}