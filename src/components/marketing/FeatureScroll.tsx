'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Map as MapIcon, TrendingUp, PhoneCall, CalendarCheck, DollarSign } from 'lucide-react';

// SaaS Pro-Tip: We build the mockups directly in code so they load instantly and look perfectly sharp on retina displays.
const features = [
  {
    title: "AI Call Intercept",
    description: "Servara's AI answers missed calls, quotes standard prices, and books the appointment directly onto your calendar while you're under the sink.",
    icon: Sparkles,
    color: "text-indigo-500",
    bgIcon: "bg-indigo-500/10",
    glow: "from-indigo-600/20 to-transparent",
    tag: "AUTOMATION",
    Mockup: () => (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <div className="w-full max-w-xs bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4 backdrop-blur-sm relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <PhoneCall size={18} className="text-white" />
            </div>
            <div>
              <div className="h-3 w-24 bg-white/80 rounded-full mb-1" />
              <div className="h-2 w-16 bg-indigo-400 rounded-full" />
            </div>
          </div>
          {/* Audio Waveform Animation */}
          <div className="flex items-center gap-1 h-8 px-2">
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: ['20%', '100%', '20%'] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                className="w-2 bg-indigo-500/80 rounded-full flex-1"
              />
            ))}
          </div>
        </div>
        <div className="w-full max-w-xs bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
          <CalendarCheck size={18} className="text-green-500" />
          <div className="h-3 w-32 bg-green-500/80 rounded-full" />
        </div>
      </div>
    )
  },
  {
    title: "Smart Route Mapping",
    description: "Stop wasting fuel and windshield time. Our engine automatically arranges your day's jobs to calculate the most efficient path.",
    icon: MapIcon,
    color: "text-emerald-500",
    bgIcon: "bg-emerald-500/10",
    glow: "from-emerald-600/20 to-transparent",
    tag: "EFFICIENCY",
    Mockup: () => (
      <div className="w-full h-full relative flex items-center justify-center p-8">
        {/* Fake Map Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Route Lines & Waypoints */}
        <div className="relative w-full max-w-xs h-64">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path 
              d="M 10 90 Q 30 50 50 70 T 90 10" 
              fill="none" 
              stroke="rgb(16 185 129)" 
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
          <div className="absolute top-[5%] right-[5%] w-6 h-6 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.6)] border-4 border-[#0B0E14] z-10" />
          <div className="absolute top-[65%] left-[45%] w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0B0E14] z-10" />
          <div className="absolute bottom-[5%] left-[5%] w-5 h-5 bg-blue-500 rounded-full border-2 border-[#0B0E14] z-10" />
          
          <div className="absolute bottom-0 right-0 bg-slate-800/80 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-xl">
             <div className="h-2 w-16 bg-slate-400 rounded-full mb-2" />
             <div className="h-4 w-24 bg-emerald-400 rounded-full" />
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Revenue Forecasting",
    description: "See the future of your bank account. Predict monthly cash flow based on your current estimates, recurring memberships, and historical win rates.",
    icon: TrendingUp,
    color: "text-amber-500",
    bgIcon: "bg-amber-500/10",
    glow: "from-amber-600/20 to-transparent",
    tag: "FINANCIALS",
    Mockup: () => (
      <div className="w-full h-full flex flex-col justify-end p-8 pb-12 gap-4">
        <div className="flex items-center justify-between w-full max-w-xs mx-auto mb-4">
           <div>
             <div className="h-2 w-16 bg-slate-500 rounded-full mb-2" />
             <div className="h-6 w-32 bg-white rounded-full flex items-center gap-2">
               <DollarSign size={16} className="text-amber-500 ml-1" />
             </div>
           </div>
           <div className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black rounded-lg">+24%</div>
        </div>
        
        {/* Fake Bar Chart */}
        <div className="flex items-end justify-center gap-3 h-48 w-full max-w-xs mx-auto border-b border-slate-700/50 pb-2">
          {[40, 60, 45, 80, 55, 100].map((height, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              className={`w-10 rounded-t-lg ${i === 5 ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-700'}`}
            />
          ))}
        </div>
      </div>
    )
  }
];

export default function FeatureScroll() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 bg-slate-50 dark:bg-[#0B0E14]">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        
        {/* LEFT SIDE: SCROLLING TEXT */}
        <div className="flex-1 py-[10vh] lg:py-[30vh]">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              // This triggers when the element enters the middle of the viewport
              onViewportEnter={() => setActiveStep(index)}
              viewport={{ margin: "-50% 0px -50% 0px" }}
              className={`mb-[30vh] lg:mb-[40vh] transition-all duration-700 ${activeStep === index ? 'opacity-100 scale-100' : 'opacity-30 scale-95'}`}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${feature.bgIcon} ${feature.color} text-[10px] font-black tracking-widest uppercase mb-6 border border-current/20`}>
                {feature.tag}
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-4 tracking-tight leading-tight">
                <span className="hidden md:flex p-4 bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                  <feature.icon className={feature.color} size={32} />
                </span>
                {feature.title}
              </h3>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* RIGHT SIDE: STICKY MOCKUP */}
        <div className="hidden lg:flex flex-1 sticky top-32 h-[600px] items-center justify-center">
          <div className="relative w-full max-w-lg h-[500px] bg-white dark:bg-[#12161D] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden p-3">
            
            {/* Dynamic Background Glow based on active feature */}
            <div className={`absolute inset-0 bg-gradient-to-br ${features[activeStep].glow} transition-colors duration-1000`} />
            
            {/* The "Screen" */}
            <div className="relative z-10 w-full h-full rounded-[2rem] bg-slate-50 dark:bg-[#0B0E14] border border-slate-100 dark:border-white/5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  {/* Render the custom mockup for the active feature */}
                  {features[activeStep].Mockup()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}