'use client';

import { useState } from 'react';
import { Moon, Sun, Bell, Shield, Smartphone } from 'lucide-react';

export default function PreferencesPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase italic dark:text-white">Preferences</h1>
        <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
          Fine-tune your workspace experience
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 dark:border-white/5 dark:bg-[#12161D]">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 dark:bg-blue-500/10">
                <Moon size={24} />
              </div>
              <div>
                <h3 className="font-black dark:text-white">Dark Mode</h3>
                <p className="text-xs font-bold text-slate-400">
                  Reduce eye strain in low-light environments
                </p>
              </div>
            </div>
            <button className="h-8 w-14 rounded-full bg-blue-600 p-1 transition-all">
              <div className="h-6 w-6 translate-x-6 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-amber-50 p-4 text-amber-600 dark:bg-amber-500/10">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="font-black dark:text-white">Push Notifications</h3>
                <p className="text-xs font-bold text-slate-400">
                  Get alerted instantly when a new lead arrives
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`h-8 w-14 rounded-full p-1 transition-all ${notifications ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div
                className={`h-6 w-6 rounded-full bg-white shadow-sm transition-all ${notifications ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
