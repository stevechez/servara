'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Star,
  Clock,
  Wrench,
  Phone,
  Map,
  DollarSign,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import Footer from '@/components/marketing/Footer';
import Services from '@/components/marketing/Services';
import Testimonials from '@/components/marketing/Testimonials';
import FAQ from '@/components/marketing/FAQ';
import { createLead } from '@/app/actions/createLead';
import Hero from '@/components/marketing/Hero';
import FeatureScroll from '@/components/marketing/FeatureScroll';
import HeaderNav from '@/components/marketing/HeaderNav';
import Pricing from '@/components/marketing/Pricing';
import ConflictResolver from '@/components/v2/ConflictResolver';

export default function LandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleGetQuote(formData: FormData) {
    setIsSubmitting(true);
    const result = await createLead(formData);

    if (result.success) {
      setIsSuccess(true);
    } else {
      alert('Something went wrong. Please try again.');
    }
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 selection:bg-blue-500/30 dark:bg-[#050608]">
      {/* 1. NAVIGATION BAR */}
      <HeaderNav />

      {/* 2. HERO SECTION */}
      <Hero />

      {/* 3. BENTO GRID FEATURES (Cont.) */}
      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight uppercase italic dark:text-white">
            Built-in Dispatch Intelligence
          </h2>
          <p className="mt-2 font-bold text-slate-500">
            Watch the AI resolve scheduling overlaps in real-time.
          </p>
        </div>

        {/* Pass MOCK data so the landing page doesn't crash */}
        <ConflictResolver
          jobs={[
            {
              id: 1,
              scheduled_at: new Date().toISOString(),
              status: 'scheduled',
              customers: { name: 'Sarah J.' },
            },
            {
              id: 2,
              scheduled_at: new Date(Date.now() + 15 * 60000).toISOString(),
              status: 'scheduled',
              customers: { name: 'Mike R.' },
            },
          ]}
        />
      </div>

      {/* 4. LOGO WALL / TRUST */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-12 text-center transition-colors duration-300 lg:py-16 dark:border-white/5 dark:bg-[#0B0E14]/50">
        <p className="mb-8 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase lg:mb-12">
          Powered by enterprise infrastructure
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 px-6 opacity-40 grayscale invert md:gap-24 dark:invert-0">
          <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
            SUPABASE
          </div>
          <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
            STRIPE
          </div>
          <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
            TWILIO
          </div>
          <div className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
            OPENAI
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
