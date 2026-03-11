'use client';

import { useState } from 'react';
import { ExternalLink, Check, Copy } from 'lucide-react';

export default function CopyPortalButton({ customerId }: { customerId: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    // This dynamically gets your current domain (localhost or production)
    const baseUrl = window.location.origin;
    const portalUrl = `${baseUrl}/portal/${customerId}`;

    try {
      await navigator.clipboard.writeText(portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
        copied 
          ? 'bg-green-500 text-white' 
          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white'
      }`}
    >
      {copied ? (
        <>
          <Check size={14} /> Copied!
        </>
      ) : (
        <>
          <Copy size={14} /> Portal Link
        </>
      )}
    </button>
  );
}