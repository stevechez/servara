import Sidebar from '@/components/v2/Sidebar';
import MobileNav from '@/components/v2/MobileNav';
import MobileHeader from '@/components/v2/MobileHeader';
import DashboardHeader from '@/components/v2/DashboardHeader';
import { MapIcon, Clock } from 'lucide-react';
import QuickAddJob from '@/components/v2/QuickQuote';

// 1. FIX: Import Supabase
import { createClient } from '@/lib/supabase/server';

// 2. FIX: Added 'async' to the function signature
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 3. FIX: Initialize Supabase client
  const supabase = await createClient();

  // 1. Get the logged-in user info
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch their actual profile data
  let fullName = 'Contractor';
  let avatarUrl = null;
  const email = user?.email || '';

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, business_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (profile) {
      // Prioritize Full Name, fallback to Business Name, fallback to Auth Meta
      fullName =
        profile.full_name || profile.business_name || user.user_metadata?.full_name || 'Contractor';
      avatarUrl = profile.avatar_url;
    }
  }

  return (
    // Added 'flex-col md:flex-row' so it stacks properly on phones!
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 md:flex-row dark:bg-[#0B0E14]">
      {/* DESKTOP SIDEBAR (Sits on the left on desktop, hidden on mobile) */}
      <div className="z-50 hidden w-72 shrink-0 border-r border-slate-200 md:block dark:border-slate-800">
        <Sidebar />
      </div>

      {/* MOBILE HEADER (Sits perfectly at the top on phones, hidden on desktop) */}
      <div className="z-50 shrink-0 md:hidden">
        {/* Pro-tip: If your MobileHeader also shows the user profile, you can pass these same props to it! */}
        <MobileHeader />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* DESKTOP HEADER */}
        <div className="hidden md:block">
          {/* 4. FIX: Actually pass the data into the Header component! */}
          <DashboardHeader fullName={fullName} email={email} avatarUrl={avatarUrl} />
        </div>

        <main className="custom-scrollbar relative w-full flex-1 overflow-y-auto">
          {/* Note: changed p-6 to p-4 for better mobile spacing! */}
          <div className="min-h-full p-4 pb-32 md:p-10">{children}</div>
        </main>
      </div>

      {/* MOBILE NAVIGATION (Sits at the bottom on phones, hidden on desktop) */}
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
