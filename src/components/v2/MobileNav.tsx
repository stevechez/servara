'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Target, Users } from 'lucide-react';
import NewJobModal from './NewJobModal'; // Techs can dispatch from the field too!

const navItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Leads', href: '/leads', icon: Target },
  { name: 'Clients', href: '/customers', icon: Users },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[900] bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={20} className={isActive ? 'animate-bounce-short' : ''} />
              <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
            </Link>
          );
        })}

        {/* CENTER ACTION BUTTON: Dispatch Job */}
        <div className="relative -top-5">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-blue-600 text-white p-4 rounded-full shadow-xl shadow-blue-500/30 border-4 border-white dark:border-[#050608]">
            {/* We wrap NewJobModal so just the Plus icon shows, hiding the text on mobile */}
            <div className="[&>button>span]:hidden [&>button]:p-0 [&>button]:bg-transparent [&>button]:shadow-none [&>button:hover]:bg-transparent">
               <NewJobModal />
            </div>
          </div>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={20} className={isActive ? 'animate-bounce-short' : ''} />
              <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
            </Link>
          );
        })}

      </div>
    </div>
  );
}