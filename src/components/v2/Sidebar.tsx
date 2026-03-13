'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import {
  LayoutDashboard,
  Users,
  Zap,
  Wrench,
  Settings,
  LogOut,
  ExternalLink,
  BookOpen,
  Receipt, // <-- Combined imports
} from 'lucide-react';

const navItems = [
  { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads Pipeline', href: '/dashboard/leads', icon: Zap },
  { name: 'Customers & Jobs', href: '/dashboard/customers', icon: Users },
  { name: 'Service Catalog', href: '/dashboard/catalog', icon: BookOpen },
  { name: 'Invoices', href: '/dashboard/invoice', icon: Receipt }, // <-- Properly added to list
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 transition-all">
      {/* BRAND LOGO */}
      <div className="flex h-20 items-center border-b border-slate-800/50 px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-black tracking-tight text-white transition-opacity hover:opacity-80"
        >
          <div className="rounded-lg bg-blue-600 p-1.5 shadow-lg shadow-blue-900/50">
            <Wrench className="text-white" size={20} />
          </div>
          Zidro <span className="text-blue-500 uppercase italic">PRO</span>
        </Link>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        <p className="mb-4 px-2 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
          Main Menu
        </p>

        {navItems.map((item) => {
          // Robust path matching
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 transition-colors group-hover:text-blue-400'
                }
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM ACTION / SETTINGS */}
      <div className="space-y-1 border-t border-slate-800/50 p-4">
        <button
          onClick={() => alert('Portal Link Copied!')}
          className="group flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
        >
          <span className="flex items-center gap-3 text-left">
            <ExternalLink size={18} className="text-slate-500 group-hover:text-white" />
            Client Portal
          </span>
        </button>

        <Link
          href="/dashboard/settings"
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all ${
            pathname === '/dashboard/settings'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Settings size={18} className="text-slate-500 group-hover:text-white" />
          Settings
        </Link>
      </div>

      {/* USER PROFILE & LOGOUT */}
      {/* <div className="m-4 flex items-center justify-between rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-black text-white">
            A
          </div>
          <div>
            <p className="text-xs leading-none font-bold text-white uppercase italic">Admin</p>
            <p className="mt-1 text-[9px] font-black tracking-tighter text-slate-500 uppercase">
              Owner
            </p>
          </div>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            title="Sign Out"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-900 hover:text-red-400"
          >
            <LogOut size={16} />
          </button>
        </form>
      </div> */}
    </aside>
  );
}
