'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Navigation, 
  Phone, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  MapPin, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function TechMobileView() {
  const [jobStarted, setJobStarted] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-[#050608] min-h-screen text-white flex flex-col font-sans">
      
      {/* TOP STATUS BAR */}
      <header className="p-6 flex justify-between items-center border-b border-white/5 bg-[#0B0E14]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center font-black">
            M
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">On Shift</p>
            <p className="text-sm font-bold">Marcus Thorne</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-500/20">
          ONLINE
        </div>
      </header>

      {/* CURRENT JOB CARD */}
      <main className="flex-1 p-6 space-y-6">
        <section className="bg-blue-600 rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(59,130,246,0.3)] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
          
          <div className="flex justify-between items-start mb-6">
            <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest">Next Job</span>
            <p className="text-xs font-bold text-white/70">Arrive by 2:00 PM</p>
          </div>

          <h2 className="text-3xl font-black mb-2">Thorne Bistro</h2>
          <div className="flex items-center gap-2 text-white/80 mb-8 font-medium italic">
            <MapPin size={16} />
            <p className="text-sm">452 Market St, San Francisco</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 bg-white text-blue-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
              <Navigation size={18} fill="currentColor" /> Navigate
            </button>
            <button className="py-4 bg-white/20 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Phone size={18} fill="currentColor" /> Call
            </button>
          </div>
        </section>

        {/* JOB DETAILS / CHECKLIST */}
        <section className="bg-[#0B0E14] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Job Scope</h3>
            <span className="text-xs font-bold text-blue-500">#INV-8829</span>
          </div>
          
          <div className="space-y-4">
             <ScopeItem text="Inspect commercial HVAC unit on roof" completed={true} />
             <ScopeItem text="Replace filter & check coolant levels" completed={false} />
             <ScopeItem text="Photo verification of serial number" completed={false} />
          </div>
        </section>

        {/* ACTION AREA */}
        <div className="space-y-4 pt-4">
          {!jobStarted ? (
            <button 
              onClick={() => setJobStarted(true)}
              className="w-full py-6 bg-slate-900 border border-white/10 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl"
            >
              <Clock size={24} className="text-blue-500" /> Start Job
            </button>
          ) : (
            <button 
              className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 animate-in fade-in zoom-in active:scale-95 transition-all shadow-2xl shadow-emerald-500/20"
            >
              <CreditCard size={24} /> Collect Payment
            </button>
          )}
          <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <ShieldCheck size={12} /> Secure encrypted checkout
          </p>
        </div>
      </main>

      {/* MOBILE NAV BAR */}
      <nav className="p-6 bg-[#0B0E14] border-t border-white/5 flex justify-around">
          <NavItem icon={<Clock size={20}/>} active />
          <NavItem icon={<MapPin size={20}/>} />
          <NavItem icon={<CheckCircle2 size={20}/>} />
      </nav>
    </div>
  );
}

function ScopeItem({ text, completed }: any) {
    return (
        <div className="flex items-center gap-4 group">
            <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${completed ? 'bg-blue-600 border-blue-600' : 'border-slate-800'}`}>
                {completed && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <p className={`text-sm font-bold ${completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{text}</p>
        </div>
    )
}

function NavItem({ icon, active }: any) {
    return (
        <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-600'}`}>
            {icon}
        </div>
    )
}