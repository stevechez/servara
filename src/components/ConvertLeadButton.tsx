// src/components/ConvertLeadButton.tsx
'use client';

import { useState } from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import { convertLeadToJob } from '@/app/actions/convertLead'; // Pointing to our master action!
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function ConvertLeadButton({ leadId }: { leadId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConvert = async () => {
    setLoading(true);
    try {
      const result = await convertLeadToJob(leadId);

      if (result.success) {
        toast.success('Lead converted to Job! Redirecting...');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

        setTimeout(() => {
          router.push('/dashboard/jobs'); // Change to /dashboard/customers if needed
        }, 2000);
      } else {
        toast.error(result?.error || 'Failed to convert lead.');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Conversion failed');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConvert}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Briefcase size={18} />}
      {loading ? 'Converting...' : 'Convert to Job'}
    </button>
  );
}
