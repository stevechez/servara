'use client';

import { motion } from 'framer-motion';

export default function LogoWall() {
  const logos = [
    "FORBES", "TECHCRUNCH", "CONTRACTOR MAG", "HOME ADVISOR", "PRO BUILDER"
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">
          Trusted by the industry's most successful teams
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale transition-all">
          {logos.map((logo) => (
            <motion.div 
              key={logo}
              whileHover={{ opacity: 1, filter: 'grayscale(0%)', scale: 1.05 }}
              className="text-2xl font-black text-slate-900 tracking-tighter italic cursor-default"
            >
              {logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}