// app/(dashboard)/jobs/new/page.tsx
import { createClient } from '@/lib/supabase/server'
import { scheduleJobFromEstimate } from '@/lib/actions/jobs'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, FileText } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ estimate_id?: string }>
}) {
  const { estimate_id } = await searchParams

  if (!estimate_id) {
    redirect('/estimates')
  }

  const supabase = await createClient()
  const { data: estimate } = await supabase
    .from('estimates')
    .select('*, customers(name, address)')
    .eq('id', estimate_id)
    .single()

  if (!estimate) return <div>Estimate not found</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/estimates" className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Job</h1>
          <p className="text-sm text-gray-500">Book {estimate.customers?.name} on the calendar.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
        {/* Job Summary Summary */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2 border-b border-blue-200 pb-2">Approved Estimate Details</h3>
          <p className="text-sm text-blue-800 font-medium">{estimate.customers?.address}</p>
          <p className="text-sm text-blue-700 mt-1">{estimate.description}</p>
          <p className="text-sm font-bold text-blue-900 mt-2">Total: ${Number(estimate.amount).toFixed(2)}</p>
        </div>

        <form action={scheduleJobFromEstimate} className="space-y-6">
          <input type="hidden" name="estimate_id" value={estimate.id} />

          {/* Date & Time Picker */}
          <div>
            <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Date & Time *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                name="scheduled_at"
                id="scheduled_at"
                required
                className="block w-full pl-10 rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">This will automatically trigger the day-before SMS reminder.</p>
          </div>

          {/* Internal Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Internal Notes for Technician (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="notes"
                id="notes"
                rows={3}
                className="block w-full pl-10 rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                placeholder="Gate code is 1234, watch out for the dog..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Confirm & Add to Calendar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}