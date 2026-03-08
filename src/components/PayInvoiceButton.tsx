// src/components/PayInvoiceButton.tsx
'use client'

import { useState } from 'react'
import { CreditCard } from 'lucide-react'
import { createCheckoutSession } from '@/lib/actions/stripe'

interface PayButtonProps {
  invoiceId: string
  amount: string
  jobTitle: string
}

export default function PayInvoiceButton({ invoiceId, amount, jobTitle }: PayButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handlePayment = async () => {
    setIsRedirecting(true)
    
    const formData = new FormData()
    formData.append('invoiceId', invoiceId)
    formData.append('amount', amount)
    formData.append('jobTitle', jobTitle)

    try {
      // This will trigger the server-side redirect to Stripe
      await createCheckoutSession(formData)
    } catch (error) {
      console.error(error)
      alert("Failed to initiate payment.")
      setIsRedirecting(false)
    }
  }

  return (
    <button 
      onClick={handlePayment}
      disabled={isRedirecting}
      className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 w-full sm:w-auto"
    >
      <CreditCard size={18} /> 
      {isRedirecting ? 'Connecting to Stripe...' : 'Pay with Card'}
    </button>
  )
}