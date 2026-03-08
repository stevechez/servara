// app/(dashboard)/jobs/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, MapPin, Briefcase, DollarSign, FileText } from 'lucide-react'
import { updateJobStatus } from '@/lib/actions/jobs'
import { generateInvoiceFromJob } from '@/lib/actions/invoices'

// Next.js 16 requirement: params is a Promise
export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  
  const resolvedParams = await params
  const jobId = resolvedParams.id

  // 1. Fetch the Job and the attached Customer
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      customers ( name, email, phone, address )
    `)
    .eq('id', jobId)
    .single()

  // 2. The Diagnostic Screen
  if (error || !job) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto mt-10">
        <h2 className="text-xl font-bold text-red-700 mb-4">Job Not Found</h2>
        <p className="text-red-600 mb-2">ID searched: <strong>{jobId}</strong></p>
        <div className="bg-white p-4 rounded text-sm font-mono text-gray-800 overflow-auto">
          {error?.message || "No error message, but record doesn't exist."}
        </div>
        <Link href="/jobs" className="mt-6 inline-block text-blue-600 hover:underline font-bold">
          &larr; Go back to Jobs
        </Link>
      </div>
    )
  }

  // Handle Supabase's relationship formatting
  const customer = Array.isArray(job.customers) ? job.customers[0] : job.customers;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/jobs" className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-2">
            <ArrowLeft size={16} /> Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-blue-600" />
            {job.title || 'Service Job'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Job ID: {job.id.split('-')[0]}</p>
        </div>
        
        <div className="flex gap-3">
          {/* THE NEW GENERATE INVOICE BUTTON */}
          {job.status !== 'invoiced' && (
            <form action={generateInvoiceFromJob}>
              <input type="hidden" name="jobId" value={job.id} />
              <button 
                type="submit" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <FileText size={16} /> Generate Invoice
              </button>
            </form>
          )}
          
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Calendar size={16} /> Schedule Date
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MAIN CONTENT (Left Side) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Project Overview</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              
              {/* INTERACTIVE STATUS DROPDOWN */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 font-medium mb-2">Current Status</p>
                <form action={updateJobStatus} className="flex gap-2">
                  <input type="hidden" name="jobId" value={job.id} />
                  <select 
                    name="status" 
                    defaultValue={job.status}
                    className="text-sm font-bold uppercase tracking-wider bg-white border border-gray-300 text-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="invoiced">Invoiced</option>
                  </select>
                  <button 
                    type="submit" 
                    className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    Save
                  </button>
                </form>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 font-medium mb-1">Agreed Amount</p>
                <p className="text-xl font-bold text-gray-900 flex items-center">
                  <DollarSign size={20} className="text-gray-400 mr-1" />
                  {job.amount ? Number(job.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Job Notes</h3>
              <p className="text-gray-500 text-sm italic">No notes added yet. Click to add details about the work required.</p>
            </div>
          </div>
        </div>

        {/* SIDEBAR (Right Side) */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={16} className="text-gray-400" /> Client Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-gray-900 text-lg">{customer?.name}</p>
                <a href={`mailto:${customer?.email}`} className="text-sm text-blue-600 hover:underline block mt-1">{customer?.email}</a>
                <a href={`tel:${customer?.phone}`} className="text-sm text-gray-600 hover:text-gray-900 mt-1 block">{customer?.phone}</a>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
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