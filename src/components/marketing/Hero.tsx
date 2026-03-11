import { ArrowRight, Sparkles, ShieldCheck, Briefcase, TrendingUp, Users, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function WorldClassHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 dark:bg-[#0B0E14] border-b border-slate-200 dark:border-white/5">
      {/* Ambient SaaS Glow (Centered behind the mockup) - Fixed single line class */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HERO COPY */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8 shadow-sm">
            <Sparkles size={14} className="text-blue-500" />
            <span>The AI-First OS for Field Service</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Run your service business <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 italic">on autopilot.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium mb-10 leading-relaxed max-w-2xl mx-auto">
            Stop drowning in paperwork. Quote faster, dispatch smarter, and get paid instantly with the all-in-one software built for modern pros.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group active:scale-95">
              Start Free Trial <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={16} className="text-green-500" />
              No credit card required
            </div>
          </div>
        </div>

        {/* THE SHOWSTOPPER: LIVE DASHBOARD MOCKUP */}
        <div className="relative mx-auto max-w-5xl rounded-t-[2.5rem] md:rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12161D] p-2 md:p-4 shadow-2xl overflow-hidden group">
          
          {/* Mac window dots for realism */}
          <div className="flex gap-2 px-4 pt-2 pb-4 border-b border-slate-100 dark:border-white/5">
            <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="bg-slate-50 dark:bg-[#0B0E14] rounded-b-[2rem] md:rounded-[2rem] border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col md:flex-row h-[400px] md:h-[500px]">
            
            {/* Sidebar Mockup */}
            <div className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-white/5 p-6 bg-white dark:bg-[#12161D]">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={16} /></div>
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 opacity-60">
                    <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Main Dashboard Content Mockup */}
            <div className="flex-1 p-6 md:p-10 overflow-hidden relative">
              {/* Fake Stat Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                   <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl"><Briefcase size={20} /></div>
                   <div>
                     <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded-full mb-2" />
                     <div className="h-4 w-10 bg-slate-800 dark:bg-white rounded-full" />
                   </div>
                </div>
                <div className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4 shadow-sm hidden sm:flex">
                   <div className="p-3 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-xl"><TrendingUp size={20} /></div>
                   <div>
                     <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded-full mb-2" />
                     <div className="h-4 w-16 bg-slate-800 dark:bg-white rounded-full" />
                   </div>
                </div>
                <div className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4 shadow-sm hidden md:flex">
                   <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 rounded-xl"><Users size={20} /></div>
                   <div>
                     <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded-full mb-2" />
                     <div className="h-4 w-12 bg-slate-800 dark:bg-white rounded-full" />
                   </div>
                </div>
              </div>

              {/* Fake Daily Dispatch List */}
              <div className="bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                 <div className="flex items-center gap-2 mb-6">
                   <Clock size={16} className="text-blue-600" />
                   <div className="h-3 w-32 bg-slate-800 dark:bg-white rounded-full" />
                 </div>
                 
                 <div className="space-y-4">
                   {/* Job 1 */}
                   <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0B0E14] rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        <div>
                          <div className="h-3 w-32 bg-slate-800 dark:bg-white rounded-full mb-2" />
                          <div className="h-2 w-24 bg-slate-300 dark:bg-slate-600 rounded-full" />
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-600 rounded-lg">
                        <CheckCircle2 size={12} /> <div className="h-2 w-16 bg-green-600/50 rounded-full" />
                      </div>
                   </div>
                   
                   {/* Job 2 */}
                   <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0B0E14] rounded-2xl border border-slate-100 dark:border-white/5 opacity-50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        <div>
                          <div className="h-3 w-32 bg-slate-800 dark:bg-white rounded-full mb-2" />
                          <div className="h-2 w-24 bg-slate-300 dark:bg-slate-600 rounded-full" />
                        </div>
                      </div>
                   </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}