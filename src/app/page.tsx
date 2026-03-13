'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Moon, // Added for Toggle
  Sun, // Added for Toggle
} from 'lucide-react';

// Components
import Hero from '@/components/marketing/Hero';
import FeatureScroll from '@/components/marketing/FeatureScroll';
import Services from '@/components/marketing/Services';
import Pricing from '@/components/marketing/Pricing';
import Testimonials from '@/components/marketing/Testimonials';
import FAQ from '@/components/marketing/FAQ';
import Footer from '@/components/marketing/Footer';
import ConflictResolver from '@/components/v2/ConflictResolver';
import { createLead } from '@/app/actions/createLead';
import { useTheme } from 'next-themes'; // Ensure you have next-themes installed

export default function LandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await createLead(formData);
      if (result.success) setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-600/10 dark:bg-[#050608] dark:text-white">
      {/* 1. EXECUTIVE NAV */}
      <nav className="fixed top-0 right-0 left-0 z-[100] border-b border-slate-100 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-[#050608]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8 md:py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-2xl shadow-blue-600/40">
              <Zap size={22} className="text-white" fill="currentColor" />
            </div>
            <span className="text-2xl leading-none font-black tracking-tighter uppercase italic">
              ZIDRO<span className="text-blue-600">PRO</span>
            </span>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            {/* THE DISAPPEARING TOGGLE - RESTORED */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              href="/login"
              className="hidden text-[12px] font-bold tracking-[0.2em] text-slate-500 uppercase hover:text-blue-600 sm:block"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-slate-900 px-6 py-3.5 text-[11px] font-black tracking-[0.2em] text-white uppercase transition-all hover:scale-105 md:px-8 md:py-4 md:text-[12px] dark:bg-white dark:text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. THE MAIN WRAPPER - FORCED PADDING FIX */}
      <main className="relative">
        {/* We use a spacer div to guarantee the Hero is pushed down past the Nav */}
        <div className="h-[140px] md:h-[180px]" />

        {/* HERO SECTION */}
        <section className="pb-24 lg:pb-40">
          <Hero />
        </section>

        {/* LEAD MAGNET SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-24"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl" />
          <div className="rounded-[2.5rem] border border-slate-200 bg-white/50 p-6 shadow-2xl backdrop-blur-2xl md:rounded-[3rem] md:p-16 dark:border-white/5 dark:bg-[#12161D]/50">
            {isSuccess ? (
              <div className="py-10 text-center">
                <CheckCircle2 size={64} className="mx-auto mb-6 text-emerald-500" />
                <h3 className="mb-2 text-3xl font-black tracking-tighter uppercase italic">
                  Success
                </h3>
                <p className="font-medium text-slate-500">Our team will reach out shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
                <div className="text-center lg:text-left">
                  <h3 className="mb-4 text-3xl leading-[0.9] font-black tracking-tighter uppercase italic md:text-4xl">
                    Claim Your <br /> <span className="text-blue-600">Market Share.</span>
                  </h3>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input
                    name="name"
                    placeholder="Full Name"
                    required
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-6 text-base font-bold dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-6 text-base font-bold dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                  <button className="relative h-16 w-full overflow-hidden rounded-2xl bg-blue-600 text-xs font-black tracking-[0.2em] text-white uppercase">
                    Get Started Now
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.section>

        {/* REST OF SECTIONS */}
        <FeatureScroll />
        <Services />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
