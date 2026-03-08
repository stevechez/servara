'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, FileText, Settings, LogOut, Wrench, Target } from 'lucide-react';
import NewJobModal from './NewJobModal';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads Pipeline', href: '/leads', icon: Target },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0B0E14] border-r border-slate-200 dark:border-slate-800">
      
      {/* BRANDING */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <span className="font-black italic text-xl tracking-tight dark:text-white">SERVARA</span>
        </Link>
      </div>

      {/* PRIMARY ACTION: THE SLIDE-OUT DRAWER */}
      <div className="p-6">
        <div className="w-full [&>button]:w-full [&>button]:justify-center">
          <NewJobModal />
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / LOGOUT */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold text-sm text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
      
    </div>
  );
}