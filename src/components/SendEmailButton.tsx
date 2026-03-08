// src/components/SendEmailButton.tsx
'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { sendInvoiceEmail } from '@/lib/actions/emails'

interface EmailButtonProps {
  invoiceId: string
  customerEmail: string
  customerName: string
  amount: string
}

export default function SendEmailButton({ invoiceId, customerEmail, customerName, amount }: EmailButtonProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSend = async () => {
    // Prevent sending if no email exists
    if (!customerEmail) {
      alert("This customer doesn't have an email address saved!")
      return
    }

    setStatus('sending')
    
    const formData = new FormData()
    formData.append('invoiceId', invoiceId)
    formData.append('customerEmail', customerEmail)
    formData.append('customerName', customerName)
    formData.append('amount', amount)

    try {
      await sendInvoiceEmail(formData)
      setStatus('sent')
      
      // Reset the button back to normal after 3 seconds
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      console.error(error)
      alert("Failed to send email. Check your console.")
      setStatus('idle')
    }
  }

  return (
    <button 
      onClick={handleSend}
      disabled={status !== 'idle'}
      className={`px-4 py-2 text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-80
        ${status === 'sent' ? 'bg-green-600 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}
      `}
    >
      {status === 'idle' && <><Send size={16} /> Send to Client</>}
      {status === 'sending' && 'Sending...'}
      {status === 'sent' && <><CheckCircle size={16} /> Sent!</>}
    </button>
  )
}