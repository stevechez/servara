// app/(dashboard)/estimates/new/page.tsx
import { createClient } from '@/lib/supabase/server'
import { createEstimateFromLead } from '@/lib/actions/estimates'
import Link from 'next/link'
import { ArrowLeft, DollarSign, MapPin, FileText } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function NewEstimatePage({
  searchParams,
}: {
  searchParams: Promise<{ lead_id?: string }>
}) {
  const { lead_id } = await searchParams;
  
  if (!lead_id) {
    redirect('/leads') // If they try to load this without a lead, kick them back
  }

  const supabase = await createClient()
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', lead_id)
    .single()

  if (!lead) return <div>Lead not found</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/leads" className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote Job for {lead.name}</h1>
          <p className="text-sm text-gray-500">Convert this lead into an estimate.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
        <form action={createEstimateFromLead} className="space-y-6">
          
          <input type="hidden" name="lead_id" value={lead.id} />

          {/* Customer Address (Needed for the Job later) */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Service Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="address"
                id="address"
                required
                className="block w-full pl-10 rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                placeholder="123 Main St, City, State Zip"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">We need an address to upgrade them to a Customer.</p>
          </div>

          {/* Estimate Details */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                id="description"
                required
                rows={3}
                defaultValue={lead.service_requested || ''}
                className="block w-full pl-10 rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                placeholder="Describe the work to be done..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Estimate Amount ($) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                required
                step="0.01"
                min="0"
                className="block w-full pl-10 rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                placeholder="0.00"
              />

              
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t">
            <input name="address" type="text" defaultValue={lead.address} />
  
  
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Generate Estimate
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}