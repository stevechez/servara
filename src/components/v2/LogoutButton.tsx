'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { signOut } from '@/lib/actions/auth';

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    // No need to set isLoggingOut to false, because the server action redirects us!
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-xl transition-all active:scale-95 disabled:opacity-50"
    >
      {isLoggingOut ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <LogOut size={16} />
      )}
      Sign Out
    </button>
  );
}