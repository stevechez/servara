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
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-sm' 
        : 'bg-transparent border-transparent pt-4' // Added padding at the top when not scrolled
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group z-50">
           <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
             <ShieldCheck className="text-white" size={20} />
           </div>
           <span className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
             Servara<span className="text-blue-600">Pro</span>
           </span>
        </Link>

        {/* DESKTOP LINKS */}
        <nav className="hidden md:flex items-center gap-8">
           <Link href="#features" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Features</Link>
           <Link href="#testimonials" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Customers</Link>
           <Link href="#pricing" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          <div className="mr-2">
            <ThemeToggle />
          </div>
          <Link href="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-2">
            Log In
          </Link>
          <Link href="/login" className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-slate-900/10 dark:shadow-white/10 flex items-center gap-2">
            Start Free Trial
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center gap-4 z-50">
          <ThemeToggle />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-slate-900 dark:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div className={`md:hidden absolute top-0 inset-x-0 bg-white dark:bg-[#0B0E14] border-b border-slate-200 dark:border-white/5 shadow-xl transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
      }`}>
         <div className="px-6 pt-24 pb-8 flex flex-col gap-6">
            <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-slate-900 dark:text-white">Features</Link>
            <Link href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-slate-900 dark:text-white">Customers</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-slate-900 dark:text-white">Pricing</Link>
            
            <hr className="border-slate-100 dark:border-white/5 my-2" />
            
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-slate-900 dark:text-white">Log In</Link>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full mt-2 py-4 bg-blue-600 text-white rounded-xl text-center font-black uppercase tracking-widest text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">
              Start Free Trial <ArrowRight size={16} />
            </Link>
         </div>
      </div>
    </header>
  );
}