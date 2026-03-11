'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Settings, CreditCard, LogOut } from 'lucide-react';
import ThemeToggle from '@/components/v2/ThemeToggle';
import Link from 'next/link';
// If you have a dedicated signout action, you can import it here
import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleLogout = async () => {
    // You can wire this up to your actual Supabase signout logic later
    console.log("Logging out...");
    router.push('/login');
  };

  return (
    <header className="h-20 px-6 lg:px-10 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#12161D] flex items-center justify-between sticky top-0 z-40">
      
      {/* LEFT SIDE: Global Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-[#0B0E14] rounded-2xl border border-slate-200 dark:border-white/5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-72 lg:w-96">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers, jobs, or invoices..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-white placeholder:text-slate-400" 
          />
          <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-400">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* RIGHT SIDE: Utilities */}
      <div className="flex items-center gap-3 md:gap-5">
        
        <ThemeToggle />
        
        <button className="relative p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-white/5" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-[#12161D]"></span>
        </button>

        <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-white/10 mx-2"></div>

        {/* PROFILE DROPDOWN WRAPPER */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 group outline-none"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-none group-hover:text-blue-600 transition-colors">Admin</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Workspace</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              JS
            </div>
          </button>

          {/* THE DROPDOWN MENU */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#12161D] border border-slate-200 dark:border-white/5 rounded-2xl shadow-xl py-2 z-50 overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
              
              <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Admin User</p>
                <p className="text-xs font-medium text-slate-500 truncate">admin@servarapro.com</p>
              </div>

              <div className="px-2 space-y-1">
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <User size={16} /> My Account
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Settings size={16} /> Preferences
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <CreditCard size={16} /> Billing
                </Link>
              </div>

              <div className="px-2 mt-1 pt-1 border-t border-slate-100 dark:border-white/5">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
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