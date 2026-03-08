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
    <footer className="bg-white dark:bg-[#050608] border-t border-slate-100 dark:border-slate-900 overflow-hidden">
      {/* 1. TOP CTA SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative p-12 bg-blue-600 rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Decorative Background Circles */}
          <div className="absolute -right-10 -top-10 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 bg-blue-400/20 rounded-full blur-2xl" />

          <div className="relative z-10 text-center md:text-left space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Ready to automate your <br /> service office?
            </h2>
            <p className="text-blue-100 font-medium text-lg">
              Join 500+ pros scaling with AI.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <Link 
              href="/login" 
              className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-blue-700/20 flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <button className="px-8 py-4 bg-blue-700/50 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER LINKS */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
          
          {/* Logo & Info */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">SERVARA</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
              The AI-first operating system for field technicians. Stop losing leads, start winning time.
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
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{category}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">
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
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-50 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          © 2026 Servara AI. Built for the modern Pro.
        </p>
        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <Sparkles size={12} className="text-blue-500" />
          Status: <span className="text-emerald-500">All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
      {icon}
    </button>
  );
}