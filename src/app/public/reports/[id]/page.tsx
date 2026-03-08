// app/public/reports/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { CheckCircle, MapPin, Calendar } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function PublicReportPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch report, job, and company details in one go
  const { data: report } = await supabase
    .from('service_reports')
    .select(`
      *,
      jobs (
        scheduled_at,
        service_type,
        customers (name, address),
        companies (name, logo_url)
      )
    `)
    .eq('id', params.id)
    .single()

  if (!report) return notFound()

  const job = report.jobs

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{job.companies.name}</h1>
            <p className="opacity-90">Service Completion Report</p>
          </div>
          <CheckCircle size={48} className="text-blue-200" />
        </div>

        <div className="p-8 space-y-8">
          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Customer</p>
              <p className="text-lg font-semibold">{job.customers.name}</p>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin size={16} className="mr-1" /> {job.customers.address}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Service Date</p>
              <div className="flex items-center text-lg font-semibold italic text-gray-800">
                <Calendar size={18} className="mr-2" />
                {new Date(job.scheduled_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Before/After Photos */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Work Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-center font-medium text-gray-500">Before</p>
                <img src={report.before_photo_url} alt="Before" className="rounded-lg border w-full h-64 object-cover" />
              </div>
              <div className="space-y-2">
                <p className="text-center font-medium text-gray-500">After</p>
                <img src={report.after_photo_url} alt="After" className="rounded-lg border w-full h-64 object-cover shadow-md" />
              </div>
            </div>
          </div>

          {/* Technician Notes */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2">Technician Notes</h4>
            <p className="text-blue-800 italic">"{report.technician_notes}"</p>
          </div>

          <div className="text-center pt-8">
            <p className="text-gray-400 text-sm">Thank you for choosing {job.companies.name}!</p>
          </div>
        </div>
      </div>
    </div>
  )
}