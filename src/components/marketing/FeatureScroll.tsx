'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Map, Bell, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: "AI Call Intercept",
    description: "Servara's AI answers missed calls in your own voice, books the appointment, and adds it to your calendar while you're on the job.",
    icon: <Sparkles className="text-blue-500" />,
    color: "bg-blue-500",
    image: "/mockups/call-ai.png", // Replace with your mockup exports
    tag: "AUTOMATION"
  },
  {
    title: "Smart Route Mapping",
    description: "Stop wasting fuel. Our engine calculates the most efficient path between jobs, saving the average tech 45 minutes of driving per day.",
    icon: <Map className="text-emerald-500" />,
    color: "bg-emerald-500",
    image: "/mockups/route-map.png",
    tag: "EFFICIENCY"
  },
  {
    title: "Revenue Forecasting",
    description: "See the future of your bank account. Predict monthly cash flow based on your current estimates and historical win rates.",
    icon: <Bell className="text-purple-500" />,
    color: "bg-purple-500",
    image: "/mockups/forecast.png",
    tag: "FINANCIALS"
  }
];

export default function FeatureScroll() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-32">
      <div className="flex flex-col lg:flex-row gap-20">
        
        {/* LEFT SIDE: SCROLLING TEXT */}
        <div className="flex-1 space-y-[40vh] pb-[40vh]">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              onViewportEnter={() => setActiveStep(index)}
              viewport={{ amount: 0.8 }}
              className={`transition-opacity duration-500 ${activeStep === index ? 'opacity-100' : 'opacity-20'}`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black tracking-widest uppercase mb-6">
                {feature.tag}
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-6 flex items-center gap-4">
                <span className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  {feature.icon}
                </span>
                {feature.title}
              </h3>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* RIGHT SIDE: STICKY MOCKUP */}
        <div className="hidden lg:block flex-1 sticky top-32 h-[600px] self-start">
          <div className="relative w-full h-full bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full h-full rounded-[2rem] bg-[#0B0E14] border border-slate-800 flex items-center justify-center p-8"
              >
                {/* Instead of real images for now, we'll show a placeholder 
                  that changes color based on the feature.
                */}
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-3xl ${features[activeStep].color} flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6`}>
                    {features[activeStep].icon}
                  </div>
                  <div className="space-y-3">
                    <div className="w-48 h-4 bg-slate-800 rounded-full mx-auto" />
                    <div className="w-32 h-3 bg-slate-800/50 rounded-full mx-auto" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}