'use client';

import React, { useState } from 'react';
import NewJobModal from '@/components/v2/NewJobModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Target, Users, Plus } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  { name: 'Leads', href: '/dashboard/leads', icon: Target },
  { name: 'Clients', href: '/dashboard/customers', icon: Users },
];

export default function MobileNav() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 w-full border-t border-white/5 bg-white/90 px-2 pt-2 pb-8 backdrop-blur-xl dark:bg-[#0B0E14]/90">
      <div className="relative flex items-center justify-around">
        {/* LEFT NAV ITEMS (Home, Schedule) */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-16 flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={20} className={isActive ? 'animate-bounce-short' : ''} />
              <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
            </Link>
          );
        })}

        {/* CENTER ACTION BUTTON - Controls Modal State */}
        <div className="relative -top-8 flex justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 blur-xl" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative rounded-full border-4 border-white bg-blue-600 p-4 text-white shadow-xl shadow-blue-500/30 transition-transform active:scale-90 dark:border-[#0B0E14]"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* RIGHT NAV ITEMS (Leads, Clients) */}
        {navItems.slice(2, 4).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-16 flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={20} className={isActive ? 'animate-bounce-short' : ''} />
              <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* MODAL MOUNTED AT ROOT OF NAV */}
      <NewJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
