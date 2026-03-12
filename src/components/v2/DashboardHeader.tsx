'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Settings, CreditCard, LogOut } from 'lucide-react';
import ThemeToggle from '@/components/v2/ThemeToggle';
import Link from 'next/link';
import router from 'next/router';

// 1. FIX: Added curly braces for a named import
import { signOut } from '@/lib/actions/auth';

export default function DashboardHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking anywhere else on the screen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. FIX: Wired this handler to actually call the Supabase action
  const handleLogout = async () => {
    // 1. Tell the server to kill the Supabase session
    await signOut();

    // 2. Teleport the user from the client side!
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10 dark:border-white/5 dark:bg-[#12161D]">
      {/* LEFT SIDE: Global Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="hidden w-72 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 md:flex lg:w-96 dark:border-white/5 dark:bg-[#0B0E14]">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search customers, jobs, or invoices..."
            className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <kbd className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-400 lg:inline-flex dark:border-white/10 dark:bg-[#12161D]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* RIGHT SIDE: Utilities */}
      <div className="flex items-center gap-3 md:gap-5">
        <ThemeToggle />

        <button
          className="relative rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 border-white bg-blue-500 dark:border-[#12161D]"></span>
        </button>

        <div className="mx-2 hidden h-6 w-px bg-slate-200 md:block dark:bg-white/10"></div>

        {/* PROFILE DROPDOWN WRAPPER */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group flex items-center gap-3 outline-none"
          >
            <div className="hidden text-right md:block">
              <p className="text-sm leading-none font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
                Admin
              </p>
              <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Workspace
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
              JS
            </div>
          </button>

          {/* THE DROPDOWN MENU */}
          {isDropdownOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-3 w-56 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl duration-200 dark:border-white/5 dark:bg-[#12161D]">
              <div className="mb-1 border-b border-slate-100 px-4 py-3 dark:border-white/5">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Admin User</p>
                <p className="truncate text-xs font-medium text-slate-500">admin@Zidropro.com</p>
              </div>

              <div className="space-y-1 px-2">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <User size={16} /> My Account
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <Settings size={16} /> Preferences
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <CreditCard size={16} /> Billing
                </Link>
              </div>

              <div className="mt-1 border-t border-slate-100 px-2 pt-1 dark:border-white/5">
                {/* 3. FIX: Changed onClick to trigger handleLogout */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
