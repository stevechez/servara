// components/GenerateInvoiceButton.tsx
'use client'

import { useTransition } from 'react'
import { generateInvoiceFromJob } from '@/lib/actions/invoices'
import { Receipt, Loader2 } from 'lucide-react'

export function GenerateInvoiceButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => generateInvoiceFromJob(jobId))}
      disabled={isPending}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
    >
      {isPending ? <Loader2 className="animate-spin" size={16} /> : <Receipt size={16} />}
      {isPending ? 'Generating...' : 'Generate Invoice'}
    </button>
  )
}