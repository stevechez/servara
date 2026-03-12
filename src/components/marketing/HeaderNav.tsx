'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/v2/ThemeToggle'; // Assuming this is your working toggle

export default function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect scroll to change navbar background from transparent to frosted glass
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-[#0B0E14]/80'
          : 'border-transparent bg-transparent pt-4' // Added padding at the top when not scrolled
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* LOGO */}
        <Link href="/" className="group z-50 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
            Zidro<span className="text-blue-600">Pro</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-bold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-bold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Customers
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-bold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Pricing
          </Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="mr-2">
            <ThemeToggle />
          </div>
          <Link
            href="/login"
            className="px-2 text-sm font-bold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Log In
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-slate-900/10 transition-transform hover:scale-105 dark:bg-white dark:text-slate-900 dark:shadow-white/10"
          >
            Start Free Trial
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="z-50 flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-slate-900 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div
        className={`absolute inset-x-0 top-0 border-b border-slate-200 bg-white shadow-xl transition-all duration-300 ease-in-out md:hidden dark:border-white/5 dark:bg-[#0B0E14] ${
          isMobileMenuOpen
            ? 'visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible -translate-y-4 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-6 px-6 pt-24 pb-8">
          <Link
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-bold text-slate-900 dark:text-white"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-bold text-slate-900 dark:text-white"
          >
            Customers
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-bold text-slate-900 dark:text-white"
          >
            Pricing
          </Link>

          <hr className="my-2 border-slate-100 dark:border-white/5" />

          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-bold text-slate-900 dark:text-white"
          >
            Log In
          </Link>
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-center text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
          >
            Start Free Trial <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
