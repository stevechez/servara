// src/lib/actions/emails.ts
'use server'

import { Resend } from 'resend'

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvoiceEmail(formData: FormData) {
  const invoiceId = formData.get('invoiceId') as string
  const customerEmail = formData.get('customerEmail') as string
  const customerName = formData.get('customerName') as string
  const amount = formData.get('amount') as string

  if (!invoiceId || !customerEmail) {
    throw new Error("Missing invoice or customer email")
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme Corp <onboarding@resend.dev>', // Resend's required testing sender
      to: [customerEmail], // MUST be your own verified email address during testing!
      subject: `Your Invoice is ready (${invoiceId.split('-')[0].toUpperCase()})`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2>Hello ${customerName},</h2>
          <p>Thank you for your business! Your invoice for <strong>$${amount}</strong> is now ready for review.</p>
          <p>You can view your official invoice document by logging into your client portal or contacting us directly.</p>
          <br/>
          <p>Thank you,</p>
          <p><strong>Your Service Company</strong></p>
        </div>
      `,
    })

    if (error) {
      console.error("RESEND ERROR:", error)
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error: any) {
    throw new Error(`Failed to send email: ${error.message}`)
  }
}