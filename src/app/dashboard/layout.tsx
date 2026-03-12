import Sidebar from '@/components/v2/Sidebar';
import MobileNav from '@/components/v2/MobileNav';
import MobileHeader from '@/components/v2/MobileHeader';
import DashboardHeader from '@/components/v2/DashboardHeader';
import { MapIcon, Clock } from 'lucide-react';
import QuickAddJob from '@/components/v2/QuickQuote';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // THE FIX: Added 'flex-col md:flex-row' so it stacks properly on phones!
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 md:flex-row dark:bg-[#0B0E14]">
      {/* DESKTOP SIDEBAR (Sits on the left on desktop, hidden on mobile) */}
      <div className="z-50 hidden w-72 shrink-0 border-r border-slate-200 md:block dark:border-slate-800">
        <Sidebar />
      </div>

      {/* MOBILE HEADER (Sits perfectly at the top on phones, hidden on desktop) */}
      <div className="z-50 shrink-0 md:hidden">
        <MobileHeader />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* DESKTOP HEADER */}
        <div className="hidden md:block">
          <DashboardHeader />
        </div>

        <main className="custom-scrollbar relative w-full flex-1 overflow-y-auto">
          {/* Note: I changed p-6 to p-4 for better mobile spacing! */}
          <div className="min-h-full p-4 pb-32 md:p-10">{children}</div>
        </main>
      </div>

      {/* MOBILE NAVIGATION (Sits at the bottom on phones, hidden on desktop) */}
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl md:hidden">
        <button className="flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:bg-white/10">
          <MapIcon size={20} />
        </button>

        {/* The Primary "Quick Add" Action */}
        <div className="relative -top-4">
          <QuickAddJob /> {/* Your component needs a 'compact' prop for mobile! */}
        </div>

        <button className="flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:bg-white/10">
          <Clock size={20} />
        </button>
      </div>
    </div>
  );
}
