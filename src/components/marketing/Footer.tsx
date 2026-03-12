'use client';

import Link from 'next/link';
import { Wrench, Twitter, Github, Linkedin, ArrowRight, Sparkles } from 'lucide-react';

const footerLinks = {
  Product: [
    { name: 'AI Call Intercept', href: '#' },
    { name: 'Route Mapping', href: '#' },
    { name: 'Revenue Forecast', href: '#' },
    { name: 'Mobile App', href: '#' },
  ],
  Company: [
    { name: 'About Us', href: '#' },
    { name: 'Customers', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Careers', href: '/careers' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-slate-100 bg-white dark:border-slate-900 dark:bg-[#050608]">
      {/* 1. TOP CTA SECTION */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[3rem] bg-blue-600 p-12 md:flex-row">
          {/* Decorative Background Circles */}
          <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />

          <div className="relative z-10 space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Ready to automate your <br /> service office?
            </h2>
            <p className="text-lg font-medium text-blue-100">Join 500+ pros scaling with AI.</p>
          </div>

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-black text-blue-600 shadow-xl shadow-blue-700/20 transition-all hover:scale-105"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <button className="rounded-2xl border border-white/10 bg-blue-700/50 px-8 py-4 text-lg font-black text-white backdrop-blur-md transition-all hover:bg-blue-700">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER LINKS */}
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6">
          {/* Logo & Info */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-600 p-1.5">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
                Zidro
              </span>
            </div>
            <p className="max-w-xs leading-relaxed font-medium text-slate-500">
              The AI-first operating system for field technicians. Stop losing leads, start winning
              time.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Twitter size={18} />} />
              <SocialLink icon={<Github size={18} />} />
              <SocialLink icon={<Linkedin size={18} />} />
            </div>
          </div>

          {/* Links Loops */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-bold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SUB-FOOTER */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-50 px-6 py-8 md:flex-row dark:border-slate-900">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          © 2026 Zidro AI. Built for the modern Pro.
        </p>
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
          <Sparkles size={12} className="text-blue-500" />
          Status: <span className="text-emerald-500">All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 transition-all hover:border-blue-600 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900">
      {icon}
    </button>
  );
}
