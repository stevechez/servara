'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Clock, Wrench, Phone, Map, DollarSign, ArrowRight, Loader2 } from 'lucide-react';
import Footer from '@/components/marketing/Footer'; 
import Services from '@/components/marketing/Services'; 
import Testimonials from '@/components/marketing/Testimonials';
import FAQ from '@/components/marketing/FAQ';
import { createLead } from '@/app/actions/createLead';
import Hero from '@/components/marketing/Hero'; 
import FeatureScroll from '@/components/marketing/FeatureScroll'; 
import HeaderNav from '@/components/marketing/HeaderNav';
import Pricing from '@/components/marketing/Pricing';

export default function LandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleGetQuote(formData: FormData) {
    setIsSubmitting(true);
    const result = await createLead(formData);
    
    if (result.success) {
      setIsSuccess(true);
    } else {
      alert("Something went wrong. Please try again.");
    }
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050608] selection:bg-blue-500/30 transition-colors duration-300">
      
      {/* 1. NAVIGATION BAR */}
      <HeaderNav />

      {/* 2. HERO SECTION */}
      <Hero />

      {/* 3. BENTO GRID FEATURES */}
      <Services />
      <FeatureScroll />
      <Pricing />
      <Testimonials />
      <FAQ />

      {/* 4. LOGO WALL / TRUST */}
      <section className="py-12 lg:py-16 border-y border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0B0E14]/50 text-center transition-colors duration-300">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 lg:mb-12">Powered by enterprise infrastructure</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale invert dark:invert-0 px-6">
          <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">SUPABASE</div>
          <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">STRIPE</div>
          <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">TWILIO</div>
          <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">OPENAI</div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
