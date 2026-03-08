import Sidebar from '@/components/v2/Sidebar';
import MobileNav from '@/components/v2/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050608] flex">
      
      {/* DESKTOP SIDEBAR (Hidden on mobile) */}
      <div className="hidden md:block w-72 fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      {/* MAIN CONTENT AREA */}
      {/* Note the md:pl-72 to push content to the right of the sidebar on desktop */}
      <main className="flex-1 md:pl-72 w-full">
        <div className="p-6 md:p-10 min-h-screen">
          {children}
        </div>
      </main>

      {/* MOBILE NAVIGATION (Hidden on desktop) */}
      <MobileNav />
      
    </div>
  );
}