'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wrench, Phone, Map, DollarSign, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import Footer from '@/components/marketing/Footer'; // Assuming you saved the footer here
import ThemeToggle from '@/components/v2/ThemeToggle'; // Brings in your dark mode toggle

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050608] selection:bg-blue-500/30">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-[#050608]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="font-black italic text-xl tracking-tight dark:text-white">SERVARA</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 dark:text-slate-400">
            <Link href="#features" className="hover:text-blue-600 dark:hover:text-white transition-colors">Features</Link>
            <Link href="/status" className="hover:text-blue-600 dark:hover:text-white transition-colors">System Status</Link>
            <Link href="/security" className="hover:text-blue-600 dark:hover:text-white transition-colors">Security</Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/login" 
              className="hidden md:block text-sm font-black text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-slate-900 dark:hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-32 overflow-hidden px-6">
        {/* Glowing Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 text-xs font-black uppercase tracking-widest"
          >
            <Zap size={14} fill="currentColor" /> Servara AI 2.0 is Live
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
          >
            The AI office for <br className="hidden md:block" />
            <span className="text-blue-600 italic">field service pros.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto"
          >
            Stop missing calls while you're under a sink. Servara intercepts leads, optimizes your driving route, and collects payments—all on autopilot.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-slate-900 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group"
            >
              Start Your 14-Day Trial 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" /> No credit card required
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. BENTO GRID FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-black dark:text-white tracking-tight">Everything you need, zero clutter.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: AI Intercept */}
          <div className="md:col-span-2 bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 transition-colors" />
            <div className="h-14 w-14 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-8">
              <Phone className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-black dark:text-white mb-4">AI Call Intercept</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">
              Our human-sounding AI answers missed calls, quotes standard prices, and books the job directly onto your calendar.
            </p>
          </div>

          {/* Feature 2: Smart Routing */}
          <div className="bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10">
            <div className="h-14 w-14 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-8">
              <Map className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-black dark:text-white mb-4">Smart Routing</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Eliminate windshield time. The map auto-arranges your day to save gas and maximize billed hours.
            </p>
          </div>

          {/* Feature 3: One-Tap Payments */}
          <div className="bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10">
            <div className="h-14 w-14 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-8">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-black dark:text-white mb-4">Field Payments</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Collect credit cards right from your phone. Cash hits your bank account the next business day.
            </p>
          </div>

          {/* Feature 4: Tech App */}
          <div className="md:col-span-2 bg-blue-600 rounded-[3rem] p-10 text-white relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
             <div className="relative z-10">
                <h3 className="text-3xl font-black mb-4 italic">Built for the Truck.</h3>
                <p className="text-blue-100 font-medium max-w-md mb-8">
                  The Servara mobile app is designed with massive buttons, high contrast, and zero distractions. Made for gloves and glare.
                </p>
                <Link href="/signup" className="inline-flex px-6 py-3 bg-white text-blue-600 font-black rounded-xl shadow-xl hover:scale-105 transition-transform">
                  See the Mobile App
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 4. LOGO WALL / TRUST */}
      <section className="py-20 border-y border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0B0E14]/50 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Powered by enterprise infrastructure</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale invert dark:invert-0 px-6">
          <div className="text-xl font-black tracking-tighter">SUPABASE</div>
          <div className="text-xl font-black tracking-tighter">STRIPE</div>
          <div className="text-xl font-black tracking-tighter">TWILIO</div>
          <div className="text-xl font-black tracking-tighter">OPENAI</div>
        </div>
      </section>

      {/* Include the Footer we built earlier */}
      <Footer />
    </div>
  );
}