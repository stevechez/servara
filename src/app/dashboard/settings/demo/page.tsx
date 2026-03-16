import DemoSeedButton from '@/components/v2/DemoSeedButton';
import { Database, AlertTriangle } from 'lucide-react';

export default function DemoSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">
          Developer Tools
        </h1>
        <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
          Hidden route for demo management
        </p>
      </div>

      <div className="rounded-[2.5rem] border border-amber-200 bg-amber-50 p-10 dark:border-amber-500/20 dark:bg-amber-500/5">
        <div className="mb-6 flex items-center gap-3 text-amber-600">
          <AlertTriangle size={24} />
          <h2 className="text-sm font-black tracking-widest uppercase">Database Seeding</h2>
        </div>
        <p className="mb-8 text-sm font-medium text-amber-700/80 dark:text-amber-400">
          Use this button to inject a full suite of mock data (Customers, Jobs, Leads) into your
          Supabase project. Do not click this during a live client presentation.
        </p>
        <DemoSeedButton />
      </div>
    </div>
  );
}
