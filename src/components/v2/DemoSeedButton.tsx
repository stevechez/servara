'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { seedDemoData } from '@/app/actions/seedDemoData';
import { toast } from 'sonner';

export default function DemoSeedButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSeed = async () => {
    setIsLoading(true);
    try {
      const result = await seedDemoData();
      if (result.success) {
        toast.success('Demo Data Injected! Welcome to ZidroPro.');
      } else {
        toast.error('Failed to inject data.');
      }
    } catch (error) {
      toast.error('System error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-xl bg-indigo-500/10 px-4 py-2 text-sm font-bold text-indigo-600 transition-colors hover:bg-indigo-500/20 dark:text-indigo-400"
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      {isLoading ? 'Injecting...' : 'Generate Demo Data'}
    </button>
  );
}
