'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function InvoiceActions() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);

    // Simulating the PDF generation delay for the demo
    setTimeout(() => {
      // This creates a fake "Invoice.pdf" download for the demo
      const element = document.createElement('a');
      const file = new Blob([document.documentElement.innerHTML], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'Invoice_ZidroPro.pdf';
      document.body.appendChild(element);
      element.click();

      setIsGenerating(false);
    }, 1500); // 1.5 second "Processing" time looks great on video
  };

  return (
    <div className="no-print flex items-center justify-center border-t border-slate-100 bg-slate-50 p-10 dark:border-white/5 dark:bg-white/5">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex items-center gap-4 rounded-2xl bg-blue-600 px-12 py-5 text-[12px] font-black tracking-widest text-white uppercase shadow-2xl shadow-blue-600/40 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-70"
      >
        {isGenerating ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download size={14} />
            Download Invoice
          </>
        )}
      </button>
    </div>
  );
}
