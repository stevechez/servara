import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function WorldClassHero() {
  return (
     <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[500px] 
             bg-gradient-to-tr from-blue-600/20 via-purple-500/10 to-transparent 
             blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-900 text-xs font-bold mb-8">
              <Sparkles size={14} className="text-blue-600" />
              <span>The AI-First Operating System for Field Techs</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Build a <span className="text-blue-600">smarter</span> <br /> service business.
            </h1>
            
            <p className="text-xl text-slate-500 font-medium mb-10 leading-relaxed">
              Stop losing leads to voicemail. Servara uses AI to automate your office, 
              optimize your routes, and scale your revenue.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 flex items-center gap-2 group">
                Get Started for Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                <ShieldCheck size={18} className="text-emerald-500" />
                No credit card required
              </div>
            </div>
          </div>

          {/* WORLD CLASS UI MOCKUP */}
          <div className="relative mt-12">
            {/* The "Bezel" Frame */}
            <div className="relative mx-auto max-w-5xl rounded-[2.5rem] border border-white/10 bg-slate-900 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_40px_100px_-15px_rgba(0,0,0,0.5)]">
              {/* The "Screen" */}
              <div className="rounded-[2rem] bg-[#0B0E14] border border-slate-800 overflow-hidden h-[500px] md:h-[600px] relative">
                {/* Sidebar Mockup */}
                <div className="absolute left-0 top-0 bottom-0 w-64 border-r border-slate-800 p-6 space-y-8 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg" />
                    <div className="w-24 h-4 bg-slate-800 rounded-full" />
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-slate-800 rounded" />
                        <div className="w-32 h-3 bg-slate-800/50 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content Mockup */}
                <div className="ml-0 md:ml-64 p-8">
                  {/* AI Briefing Mockup */}
                  <div className="w-full h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl border border-blue-500/30 mb-8 flex items-center px-8 gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Sparkles className="text-white" size={24} />
                    </div>
                    <div className="space-y-2">
                      <div className="w-64 h-4 bg-white/10 rounded-full" />
                      <div className="w-48 h-3 bg-white/5 rounded-full" />
                    </div>
                  </div>

                  {/* Grid Mockup */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="h-64 bg-slate-800/30 rounded-[2rem] border border-slate-800 p-6">
                      <div className="w-24 h-4 bg-slate-700 rounded-full mb-6" />
                      <div className="flex items-end gap-2 h-32">
                        <div className="w-full h-1/2 bg-blue-500/20 rounded-t-lg" />
                        <div className="w-full h-3/4 bg-blue-500/40 rounded-t-lg" />
                        <div className="w-full h-full bg-blue-500 rounded-t-lg" />
                      </div>
                    </div>
                    <div className="h-64 bg-slate-800/30 rounded-[2rem] border border-slate-800 p-6 relative overflow-hidden">
                      <div className="w-24 h-4 bg-slate-700 rounded-full mb-6" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <div className="w-full h-[2px] bg-blue-500 rotate-45 transform" />
                        <div className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_blue]" />
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