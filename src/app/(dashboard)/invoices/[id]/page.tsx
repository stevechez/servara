// app/(dashboard)/invoices/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Send, FileText, DollarSign, CheckCircle } from 'lucide-react'
import DownloadPdfButton from '@/components/DownloadPdfButton'
import SendEmailButton from '@/components/SendEmailButton'
import PayInvoiceButton from '@/components/PayInvoiceButton'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  
  const resolvedParams = await params
  const invoiceId = resolvedParams.id

  // 1. Fetch the Invoice, Jobs, and Customers
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(`
      *,
      jobs ( title ),
      customers ( name, email, address )
    `)
    .eq('id', invoiceId)
    .single()

  // 2. Fetch your Company Settings to stamp on the invoice!
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .limit(1)
    .single()

  if (error || !invoice) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto mt-10">
        <h2 className="text-xl font-bold text-red-700 mb-4">Invoice Not Found</h2>
        <div className="bg-white p-4 rounded text-sm font-mono text-gray-800 overflow-auto">
          {error?.message || "No error message, but record doesn't exist."}
        </div>
      </div>
    )
  }

  const customer = Array.isArray(invoice.customers) ? invoice.customers[0] : invoice.customers;
  const job = Array.isArray(invoice.jobs) ? invoice.jobs[0] : invoice.jobs;
  const amountFormatted = Number(invoice.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/jobs" className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-2">
            <ArrowLeft size={16} /> Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-600" />
            Invoice {invoice.id.split('-')[0].toUpperCase()}
          </h1>
        </div>
        
        <div className="flex gap-3">
          <DownloadPdfButton filename={`Invoice-${invoice.id.split('-')[0].toUpperCase()}`} />
          
          {/* OUR NEW SMART EMAIL BUTTON */}
          <SendEmailButton 
            invoiceId={invoice.id}
            customerEmail={customer?.email}
            customerName={customer?.name}
            amount={amountFormatted}
          />
        </div>
      </div>

      {/* THE INVOICE DOCUMENT */}
      <div id="invoice-document" className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-8 sm:p-12">
        
        {/* Top Section: Status & Dates */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 pb-8 border-b border-gray-100">
          <div>
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4 ${
              invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-700'
            }`}>
              {invoice.status}
            </span>
            <h2 className="text-4xl font-light text-gray-900 flex items-center">
              <DollarSign size={36} className="text-gray-400" />
              {amountFormatted}
            </h2>
          </div>
          
          <div className="text-right mt-6 md:mt-0 space-y-2">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Issued</p>
              <p className="font-medium text-gray-900">{new Date(invoice.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</p>
              <p className="font-bold text-red-600">{new Date(invoice.due_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Middle Section: FROM and BILLED TO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* FROM: Your Company Details */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">From</p>
            <p className="text-lg font-bold text-gray-900">{company?.name || 'Your Company Name'}</p>
            {company?.email && <p className="text-gray-500">{company.email}</p>}
            {company?.phone && <p className="text-gray-500">{company.phone}</p>}
            {company?.address && (
              <p className="text-gray-500 max-w-xs mt-1 whitespace-pre-wrap">{company.address}</p>
            )}
          </div>

          {/* BILLED TO: Customer Details */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
            <p className="text-lg font-bold text-gray-900">{customer?.name || 'Unknown Client'}</p>
            <p className="text-gray-500">{customer?.email}</p>
            <p className="text-gray-500 max-w-xs mt-1 whitespace-pre-wrap">{customer?.address || 'No billing address on file'}</p>
          </div>
        </div>

        {/* Bottom Section: Line Items */}
        <table className="w-full text-left border-collapse mb-8">
          <thead>
            <tr className="border-b-2 border-gray-900 text-sm font-bold text-gray-900 uppercase tracking-wider">
              <th className="pb-3">Description</th>
              <th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-4">
                <p className="font-bold text-gray-900">{job?.title || 'Service Rendering'}</p>
                <p className="text-sm text-gray-500">Agreed upon service fulfillment</p>
              </td>
              <td className="py-4 text-right font-medium text-gray-900">
                ${amountFormatted}
              </td>
            </tr>
          </tbody>
        </table>

             {/* ... your existing totals div ... */}

{/* ACTION ROW: Pay Button & Totals */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-end gap-6 mt-8 pt-8 border-t border-gray-100">
          
          {/* If the invoice is unpaid, show the magic Stripe button! */}
          {invoice.status !== 'paid' ? (
            <PayInvoiceButton 
              invoiceId={invoice.id} 
              amount={invoice.amount} 
              jobTitle={job?.title || 'Service'} 
            />
          ) : (
            <div className="px-6 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2">
              <CheckCircle size={18} /> Invoice Paid in Full
            </div>
          )}

          {/* The Existing Totals Block */}
          <div className="w-full sm:w-auto min-w-[250px] space-y-3 text-sm"></div>

</div>
             {/* If invoice is unpaid, show the Pay Now button */}
        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${amountFormatted}</span>
            </div>
            <div className="flex justify-between text-gray-500 pb-3 border-b border-gray-100">
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total Due</span>
              <span>${amountFormatted}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}