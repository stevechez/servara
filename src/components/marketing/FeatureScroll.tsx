'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Map as MapIcon,
  TrendingUp,
  PhoneCall,
  CalendarCheck,
  DollarSign,
} from 'lucide-react';

// SaaS Pro-Tip: We build the mockups directly in code so they load instantly and look perfectly sharp on retina displays.
const features = [
  {
    title: 'AI Call Intercept',
    description:
      "Zidro's AI answers missed calls, quotes standard prices, and books the appointment directly onto your calendar while you're under the sink.",
    icon: Sparkles,
    color: 'text-indigo-500',
    bgIcon: 'bg-indigo-500/10',
    glow: 'from-indigo-600/20 to-transparent',
    tag: 'AUTOMATION',
    Mockup: () => (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
        <div className="relative w-full max-w-xs rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/30">
              <PhoneCall size={18} className="text-white" />
            </div>
            <div>
              <div className="mb-1 h-3 w-24 rounded-full bg-white/80" />
              <div className="h-2 w-16 rounded-full bg-indigo-400" />
            </div>
          </div>
          {/* Audio Waveform Animation */}
          <div className="flex h-8 items-center gap-1 px-2">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: ['20%', '100%', '20%'] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                className="w-2 flex-1 rounded-full bg-indigo-500/80"
              />
            ))}
          </div>
        </div>
        <div className="flex w-full max-w-xs items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-3">
          <CalendarCheck size={18} className="text-green-500" />
          <div className="h-3 w-32 rounded-full bg-green-500/80" />
        </div>
      </div>
    ),
  },
  {
    title: 'Smart Route Mapping',
    description:
      "Stop wasting fuel and windshield time. Our engine automatically arranges your day's jobs to calculate the most efficient path.",
    icon: MapIcon,
    color: 'text-emerald-500',
    bgIcon: 'bg-emerald-500/10',
    glow: 'from-emerald-600/20 to-transparent',
    tag: 'EFFICIENCY',
    Mockup: () => (
      <div className="relative flex h-full w-full items-center justify-center p-8">
        {/* Fake Map Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        {/* Route Lines & Waypoints */}
        <div className="relative h-64 w-full max-w-xs">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
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
          <div className="absolute top-[5%] right-[5%] z-10 h-6 w-6 rounded-full border-4 border-[#0B0E14] bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
          <div className="absolute top-[65%] left-[45%] z-10 h-4 w-4 rounded-full border-2 border-[#0B0E14] bg-emerald-400" />
          <div className="absolute bottom-[5%] left-[5%] z-10 h-5 w-5 rounded-full border-2 border-[#0B0E14] bg-blue-500" />

          <div className="absolute right-0 bottom-0 rounded-xl border border-slate-700 bg-slate-800/80 p-3 shadow-xl backdrop-blur">
            <div className="mb-2 h-2 w-16 rounded-full bg-slate-400" />
            <div className="h-4 w-24 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Revenue Forecasting',
    description:
      'See the future of your bank account. Predict monthly cash flow based on your current estimates, recurring memberships, and historical win rates.',
    icon: TrendingUp,
    color: 'text-amber-500',
    bgIcon: 'bg-amber-500/10',
    glow: 'from-amber-600/20 to-transparent',
    tag: 'FINANCIALS',
    Mockup: () => (
      <div className="flex h-full w-full flex-col justify-end gap-4 p-8 pb-12">
        <div className="mx-auto mb-4 flex w-full max-w-xs items-center justify-between">
          <div>
            <div className="mb-2 h-2 w-16 rounded-full bg-slate-500" />
            <div className="flex h-6 w-32 items-center gap-2 rounded-full bg-white">
              <DollarSign size={16} className="ml-1 text-amber-500" />
            </div>
          </div>
          <div className="rounded-lg bg-green-500/20 px-3 py-1 text-[10px] font-black text-green-400">
            +24%
          </div>
        </div>

        {/* Fake Bar Chart */}
        <div className="mx-auto flex h-48 w-full max-w-xs items-end justify-center gap-3 border-b border-slate-700/50 pb-2">
          {[40, 60, 45, 80, 55, 100].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              className={`w-10 rounded-t-lg ${i === 5 ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-700'}`}
            />
          ))}
        </div>
      </div>
    ),
  },
];

export default function FeatureScroll() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative mx-auto max-w-7xl bg-slate-50 px-6 py-24 md:py-32 dark:bg-[#0B0E14]">
      <div className="relative flex flex-col gap-12 lg:flex-row lg:gap-24">
        {/* LEFT SIDE: SCROLLING TEXT */}
        <div className="flex-1 py-[10vh] lg:py-[30vh]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              // This triggers when the element enters the middle of the viewport
              onViewportEnter={() => setActiveStep(index)}
              viewport={{ margin: '-50% 0px -50% 0px' }}
              className={`mb-[30vh] transition-all duration-700 lg:mb-[40vh] ${activeStep === index ? 'scale-100 opacity-100' : 'scale-95 opacity-30'}`}
            >
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${feature.bgIcon} ${feature.color} mb-6 border border-current/20 text-[10px] font-black tracking-widest uppercase`}
              >
                {feature.tag}
              </div>
              <h3 className="mb-6 flex items-center gap-4 text-3xl leading-tight font-black tracking-tight text-slate-900 md:text-5xl dark:text-white">
                <span className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex dark:border-white/5 dark:bg-[#12161D]">
                  <feature.icon className={feature.color} size={32} />
                </span>
                {feature.title}
              </h3>
              <p className="max-w-md text-lg leading-relaxed font-medium text-slate-600 md:text-xl dark:text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* RIGHT SIDE: STICKY MOCKUP */}
        <div className="sticky top-32 hidden h-[600px] flex-1 items-center justify-center lg:flex">
          <div className="relative h-[500px] w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-3 shadow-2xl dark:border-white/5 dark:bg-[#12161D]">
            {/* Dynamic Background Glow based on active feature */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${features[activeStep].glow} transition-colors duration-1000`}
            />

            {/* The "Screen" */}
            <div className="relative z-10 h-full w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-[#0B0E14]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="h-full w-full"
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
