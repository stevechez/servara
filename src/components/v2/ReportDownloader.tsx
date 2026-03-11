'use client';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrintableJobReport } from '@/components/v2/PrintableJobReport';
import { FileDown } from 'lucide-react';

export default function ReportDownloader({ customer, job }: { customer: any, job: any }) {
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  return (
    <>
      <button 
        onClick={() => handlePrint()} 
        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
      >
        <FileDown size={16} /> Download PDF
      </button>

      {/* Hidden printable component */}
      <div className="hidden">
        <div ref={componentRef}>
          <PrintableJobReport customer={customer} job={job} />
        </div>
      </div>
    </>
  );
}