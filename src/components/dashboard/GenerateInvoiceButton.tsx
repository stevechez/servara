'use client';

import React, { useState } from 'react';
import { FileText, Loader2, CreditCard, Send } from 'lucide-react';
import { generateInvoice } from '@/app/actions/invoices';
import { createPaymentLink } from '@/app/actions/stripe';

interface GenerateInvoiceProps {
  jobId: string;
  customerId: string;
  amount: number;
}

export default function GenerateInvoiceButton({ jobId, customerId, amount }: GenerateInvoiceProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // 1. Save the draft to Supabase
      await generateInvoice(jobId, customerId, amount);

      // 2. Ask Stripe for a checkout link
      const url = await createPaymentLink(amount, `Job #${jobId.split('-')[0]}`);

      // 3. Update the UI
      setPaymentUrl(url || null);
    } catch (error) {
      alert('Failed to process. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // If we have a Stripe link, show the "Collect Payment" UI
  if (paymentUrl) {
    return (
      <div className="flex gap-2">
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-black tracking-widest text-black uppercase shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
        >
          <CreditCard size={16} /> Tap to Pay
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(paymentUrl);
            alert('Payment link copied! You can now text it to the customer.');
          }}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B0E14] px-4 py-3 text-slate-400 transition hover:bg-white/5 hover:text-white"
          title="Copy Link to Text Message"
        >
          <Send size={16} />
        </button>
      </div>
    );
  }

  // Default "Generate" State
  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating || amount <= 0}
      className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
      {isGenerating ? 'Drafting...' : 'Generate Invoice'}
    </button>
  );
}
