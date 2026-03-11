import Sidebar from '@/components/v2/Sidebar';
import MobileNav from '@/components/v2/MobileNav';
import MobileHeader from '@/components/v2/MobileHeader';
import DashboardHeader from '@/components/v2/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // THE FIX: Added 'flex-col md:flex-row' so it stacks properly on phones!
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-[#0B0E14] overflow-hidden">
      
      {/* DESKTOP SIDEBAR (Sits on the left on desktop, hidden on mobile) */}
      <div className="hidden md:block w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 z-50">
        <Sidebar />
      </div>

      {/* MOBILE HEADER (Sits perfectly at the top on phones, hidden on desktop) */}
      <div className="md:hidden shrink-0 z-50">
        <MobileHeader />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* DESKTOP HEADER */}
        <div className="hidden md:block">
           <DashboardHeader />
        </div>

        <main className="flex-1 overflow-y-auto w-full relative custom-scrollbar">
          {/* Note: I changed p-6 to p-4 for better mobile spacing! */}
          <div className="p-4 md:p-10 min-h-full pb-32"> 
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE NAVIGATION (Sits at the bottom on phones, hidden on desktop) */}
      <div className="md:hidden shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50">
        <MobileNav />
      </div>
      
    </div>
  );
}