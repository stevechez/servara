'use client';

import Link from "next/link";
import { Navigation, ChevronRight } from "lucide-react";  
import { motion } from "framer-motion";

export default function MobileMapTeaser() {
  return (
    <Link 
      href="/map" 
      className="block bg-slate-900 dark:bg-[#0B0E14] rounded-[2rem] p-6 relative overflow-hidden group transition-all active:scale-[0.98] border border-white/5"
    >
      {/* The Tech Grid Background */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Animated Glow Effect on Hover */}
      <div className="absolute -right-4 -top-4 h-24 w-24 bg-blue-600/20 blur-2xl group-hover:bg-blue-600/40 transition-colors" />

      <div className="relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Navigation size={22} fill="white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Live Route</p>
            <h4 className="text-white font-bold tracking-tight">3 Jobs in San Francisco</h4>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-slate-500 group-hover:text-white transition-colors">
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">View Map</span>
          <ChevronRight size={18} />
        </div>
      </div>
    </Link>
  );
}