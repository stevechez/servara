'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Moon, Sun } from 'lucide-react';
import Hero from '@/components/marketing/Hero';
import FeatureScroll from '@/components/marketing/FeatureScroll';
import Services from '@/components/marketing/Services';
import Pricing from '@/components/marketing/Pricing';
import Testimonials from '@/components/marketing/Testimonials';
import FAQ from '@/components/marketing/FAQ';
import Footer from '@/components/marketing/Footer';
import { useTheme } from 'next-themes';
import PublicLeadForm from '@/components/v2/PublicLeadForm';
import RevenueEngine from '@/components/marketing/RevenueEngine';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Fix hydration mismatch for theme-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-600/10 dark:bg-[#050608] dark:text-white">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-200px] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 right-0 left-0 z-[100] border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-[#050608]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8 md:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-2xl shadow-blue-600/40">
              <Zap size={22} className="text-white" fill="currentColor" />
            </div>
            <span className="text-4xl font-black tracking-normal uppercase italic">
              ZIDRO<span className="text-blue-600">PRO</span>
            </span>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/5"
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
              className="rounded-full bg-slate-900 px-6 py-3.5 text-[11px] font-black tracking-[0.2em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative">
        <div className="h-[96px] md:h-[110px]" />

        {/* 1. HERO SECTION */}
        <section>
          <Hero />
        </section>

        {/* 2. REVENUE ENGINE (The 10x Section) */}
        {/* We place this here to bridge the Hero and the Features */}
        <RevenueEngine />

        {/* 3. CORE FEATURES LIST */}
        <section className="border-t border-slate-200 py-16 md:py-20 dark:border-white/5">
          <FeatureScroll />
        </section>

        {/* 4. PUBLIC LEAD GENERATOR (This is your conversion point) */}
        <section className="mx-auto max-w-4xl px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-5xl font-black tracking-tighter uppercase italic md:text-6xl">
              Ready to <span className="text-blue-600">Scale?</span>
            </h2>
            <p className="mt-4 text-lg font-medium text-slate-500">
              Stop chasing leads. Let Zidro PRO find them for you.
            </p>
          </motion.div>
          <PublicLeadForm />
        </section>

        {/* 5. SERVICES & TRUST */}
        <section className="border-t border-slate-200 bg-slate-50 py-16 md:py-20 dark:border-white/5 dark:bg-[#0B0D11]">
          <Services />
        </section>

        <section className="border-t border-slate-200 py-16 md:py-20 dark:border-white/5">
          <Pricing />
        </section>

        <section className="border-t border-slate-200 bg-slate-50 py-16 md:py-20 dark:border-white/5 dark:bg-[#0B0D11]">
          <Testimonials />
        </section>

        <section className="border-t border-slate-200 pt-16 pb-20 md:pt-20 md:pb-24 dark:border-white/5">
          <FAQ />
        </section>
      </main>

      <Footer />
    </div>
  );
}
