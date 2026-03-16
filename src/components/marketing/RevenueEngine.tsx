'use client';

import React from 'react';
import { Target, TrendingUp, Zap, Map, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Neighborhood Blitz',
    description:
      'Turn one completed job into 5 new high-probability leads instantly using geo-radius targeting.',
    icon: <Target size={24} />,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'group-hover:border-blue-500/50',
  },
  {
    title: 'Margin Maximizer',
    description:
      'Smart tiered quotes that guide customers to your most profitable options while protecting your bottom line.',
    icon: <TrendingUp size={24} />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'group-hover:border-emerald-500/50',
  },
  {
    title: 'Client Portal',
    description:
      'Apple-quality live project tracking that builds 10x more trust and keeps homeowners off the phone.',
    icon: <Zap size={24} />,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'group-hover:border-purple-500/50',
  },
  {
    title: 'Revenue Heatmap',
    description:
      'Visual intelligence that shows exactly where the money is sitting in your service area based on home age.',
    icon: <Map size={24} />,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'group-hover:border-amber-500/50',
  },
];

// 1. DEFINE RADAR OUTSIDE THE MAIN COMPONENT
const RadarAnimation = () => (
  <div className="relative mb-8 flex h-48 w-full items-center justify-center overflow-hidden rounded-3xl bg-blue-600/5">
    {/* The Pulsing Radar Rings */}
    <div className="absolute h-32 w-32 animate-ping rounded-full border border-blue-500/30" />
    <div className="absolute h-24 w-24 animate-pulse rounded-full border border-blue-500/20" />

    {/* Central Completed Job */}
    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-2xl shadow-blue-600/50">
      <Zap size={18} className="text-white" fill="white" />
    </div>

    {/* Identified Targets */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1 }}
      className="absolute top-10 right-20 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
    />
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.4 }}
      className="absolute bottom-12 left-20 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
    />
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.8 }}
      className="absolute top-16 left-24 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
    />
  </div>
);

export default function RevenueEngine() {
  const scrollToForm = () => {
    window.scrollTo({ top: document.body.scrollHeight - 1500, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#0B0E14] px-6 py-24 dark:bg-[#050608]">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            {/* 2. WE ADD THE RADAR HERE TO SHOW "THE BLITZ" IN ACTION */}
            <RadarAnimation />

            <h2 className="mb-6 text-6xl leading-[0.9] font-black tracking-tighter text-white uppercase italic md:text-8xl">
              Stop Guessing. <br />
              <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">
                Start Scaling.
              </span>
            </h2>
            <p className="mb-10 text-xl leading-relaxed font-medium text-slate-400">
              Field service management is table stakes. Zidro PRO is the first platform that
              actually finds you more work and secures higher margins on every single quote.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToForm}
                className="group flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
              >
                Get Started Now
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group cursor-default rounded-[2.5rem] border border-white/5 bg-[#12161D]/50 p-8 backdrop-blur-sm transition-all duration-500 hover:bg-[#12161D] ${feature.border}`}
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-black tracking-tight text-white uppercase italic">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium text-slate-500 transition-colors group-hover:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
