'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Target, Users } from 'lucide-react';
import NewJobModal from './NewJobModal';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Leads', href: '/leads', icon: Target },
  { name: 'Clients', href: '/customers', icon: Users },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    // FIX 2: Added 'pb-8' (padding-bottom) to push the icons up and away from the iOS URL/Swipe bar
    <div className="w-full bg-white/90 dark:bg-[#0B0E14]/90 backdrop-blur-xl pb-8 pt-2 px-2">
      <div className="flex items-center justify-around">
        
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

        {/* CENTER ACTION BUTTON */}
        <div className="relative -top-6">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-blue-600 text-white p-4 rounded-full shadow-xl shadow-blue-500/30 border-4 border-white dark:border-[#0B0E14]">
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