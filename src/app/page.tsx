'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Moon, Sun } from 'lucide-react';
import Hero from '@/components/marketing/Hero';
import FeatureScroll from '@/components/marketing/FeatureScroll';
import Services from '@/components/marketing/Services';
import Pricing from '@/components/marketing/Pricing';
import Testimonials from '@/components/marketing/Testimonials';
import FAQ from '@/components/marketing/FAQ';
import Footer from '@/components/marketing/Footer';
import ConflictResolver from '@/components/v2/ConflictResolver';
import { createLead } from '@/app/actions/createLead';
import { useTheme } from 'next-themes';
import PublicLeadForm from '@/components/v2/PublicLeadForm';

export default function LandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  // ADD THIS FOR THE THEME FIX
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-2xl shadow-blue-600/40">
              <Zap size={22} className="text-white" fill="currentColor" />
            </div>

            <span className="text-4xl font-black tracking-normal uppercase italic">
              ZIDRO<span className="text-blue-600">PRO</span>
            </span>
          </div>

          {/* NAV ACTIONS */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* THEME TOGGLE */}
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
              className="rounded-full bg-slate-900 px-6 py-3.5 text-[11px] font-black tracking-[0.2em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:px-8 md:py-4 md:text-[12px] dark:bg-white dark:text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative">
        {/* NAV SPACER */}
        <div className="h-[96px] md:h-[110px]" />

        {/* HERO */}
        <section className="pb-16 md:pb-20 lg:pb-24">
          <Hero />
        </section>

        {/* LEAD MAGNET */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl" />

          <div className="relative rounded-[2.5rem] border border-slate-200 bg-white/70 p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] backdrop-blur-2xl md:p-10 dark:border-white/10 dark:bg-[#12161D]/60">
            <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/40 to-transparent opacity-40 dark:from-white/5"></div>

            {isSuccess ? (
              <div className="py-10 text-center">
                <CheckCircle2 size={64} className="mx-auto mb-6 text-emerald-500" />

                <h3 className="mb-2 text-3xl font-black tracking-tighter uppercase italic">
                  Success
                </h3>

                <p className="font-medium text-slate-500">Our team will reach out shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                <div className="text-center lg:text-left">
                  <h3 className="mb-4 text-3xl leading-[0.9] font-black tracking-tighter uppercase italic md:text-4xl">
                    Claim Your <br />
                    <span className="text-blue-600">Market Share.</span>
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

                  <button className="relative h-16 w-full overflow-hidden rounded-2xl bg-blue-600 text-xs font-black tracking-[0.2em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    {isSubmitting ? 'Submitting...' : 'Get Started Now'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.section>

        {/* FEATURES */}
        <section className="border-t border-slate-200 py-16 md:py-20 dark:border-white/5">
          <FeatureScroll />
        </section>

        {/* SERVICES */}
        <section className="border-t border-slate-200 bg-slate-50 py-16 md:py-20 dark:border-white/5 dark:bg-[#0B0D11]">
          <Services />
        </section>

        <section className="mx-auto max-w-4xl px-4 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black uppercase italic">Ready to scale?</h2>
            <p className="text-slate-500">Stop chasing leads. Let them chase you.</p>
          </div>
          <PublicLeadForm />
        </section>

        {/* PRICING */}
        <section className="border-t border-slate-200 py-16 md:py-20 dark:border-white/5">
          <Pricing />
        </section>

        {/* TESTIMONIALS */}
        <section className="border-t border-slate-200 bg-slate-50 py-16 md:py-20 dark:border-white/5 dark:bg-[#0B0D11]">
          <Testimonials />
        </section>

        {/* FAQ */}
        <section className="border-t border-slate-200 pt-16 pb-20 md:pt-20 md:pb-24 dark:border-white/5">
          <FAQ />
        </section>
      </main>

      <Footer />
    </div>
  );
}
