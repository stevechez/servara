'use client';

import { useState } from 'react';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';
import { sendReviewRequest } from '@/lib/actions/reputation';
import { toast } from 'sonner';

export default function ReviewRequestButton({
  jobId,
  customerName,
}: {
  jobId: string;
  customerName: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await sendReviewRequest(jobId);
      toast.success(`Review request sent to ${customerName}!`);
    } catch (err) {
      toast.error('Failed to send SMS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSend}
      disabled={loading}
      className="flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-[10px] font-black tracking-widest text-white uppercase shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : <Star size={16} />}
      Send Review SMS
    </button>
  );
}
