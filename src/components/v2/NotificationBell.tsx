'use client';

import { useState, useEffect } from 'react';
import { Bell, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function NotificationBell() {
  const [hasNew, setHasNew] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // REAL-TIME SUBSCRIPTION: Listen for new leads
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        setHasNew(true);
        // Play a subtle "Apple-esque" notification sound or just toast
        toast.info(`New Lead: ${payload.new.name}`, {
          icon: <Zap className="text-blue-600" />,
          description: 'Respond now to claim this slot.',
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <button
      onClick={() => setHasNew(false)}
      className="relative rounded-xl bg-white p-3 text-slate-400 shadow-sm transition-all hover:text-blue-600 dark:bg-white/5"
    >
      <Bell size={20} />
      {hasNew && (
        <span className="absolute top-2 right-2 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-600"></span>
        </span>
      )}
    </button>
  );
}
