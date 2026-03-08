// app/(dashboard)/estimates/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Send, CheckCircle, FileText, User, MapPin } from 'lucide-react'
import { approveEstimateAndCreateJob } from '@/lib/actions/jobs'

// Note: In Next.js 15+, params is a Promise!
export default async function EstimateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  
  // 1. Await the params to get the ID (Next.js 16 requirement)
  const resolvedParams = await params;
  const estimateId = resolvedParams.id;

  // 2. Fetch the estimate
  const { data: estimate, error } = await supabase
    .from('estimates')
    .select(`
      id,
      amount,
      status,
      service_type,
      created_at,
      customers ( name, email, phone, address )
    `)
    .eq('id', estimateId)
    .single()

  // 3. THE DIAGNOSTIC SCREEN
  // Instead of a 404, we print exactly what went wrong.
  if (error || !estimate) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto mt-10">
        <h2 className="text-xl font-bold text-red-700 mb-4">Database Fetch Failed</h2>
        <p className="text-red-600 mb-2">We tried to find Estimate ID: <strong>{estimateId}</strong></p>
        <div className="bg-white p-4 rounded text-sm font-mono text-gray-800 overflow-auto">
          {error ? error.message : "No error message, but no data was returned either (record doesn't exist)."}
        </div>
        <Link href="/estimates" className="mt-6 inline-block text-blue-600 hover:underline font-bold">
          &larr; Go back to Estimates
        </Link>
      </div>
    )
  }

  // Handle Supabase's array-vs-object return type
  const customer = Array.isArray(estimate.customers) ? estimate.customers[0] : estimate.customers;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/estimates" className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-2">
            <ArrowLeft size={16} /> Back to Estimates
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-600" />
            Estimate Summary
          </h1>
          <p className="text-gray-500 text-sm mt-1">ID: {estimate.id.split('-')[0]}</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Send size={16} /> Email to Customer
          </button>
          {/* Wrap the button in a form pointing to our new action */}
<form action={approveEstimateAndCreateJob}>
  <input type="hidden" name="estimateId" value={estimateId} />
  <button 
    type="submit" 
    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-2 transition-colors shadow-sm"
  >
    <CheckCircle size={16} /> Approve & Schedule Job
  </button>
</form>
        </div>
      </div>

      {/* DOCUMENT PREVIEW */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        <div className="bg-gray-50/80 border-b border-gray-100 p-8 flex justify-between items-start">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
              estimate.status === 'sent' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
            }`}>
              Status: {estimate.status}
            </span>
            <h2 className="text-3xl font-light text-gray-900">
              ${Number(estimate.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-gray-500 font-medium mt-1">{estimate.service_type || 'General Service'}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p className="font-bold text-gray-900 mb-1">Generated On</p>
            <p>{new Date(estimate.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                <User size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">{customer?.name}</p>
                <p className="text-sm text-gray-500">{customer?.email}</p>
                <p className="text-sm text-gray-500">{customer?.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-gray-50 text-gray-600 p-2 rounded-lg">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Service Location</p>
                <p className="text-sm text-gray-500 mt-1 max-w-[200px] leading-relaxed">
                  {customer?.address || 'No address provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}