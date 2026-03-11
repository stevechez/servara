// app/(dashboard)/jobs/[id]/report/page.tsx
'use client'

import { useState } from 'react'
import { Camera, CheckCircle2, Loader2 } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ServiceReportPage() {
  const { id: jobId } = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // In a full build, you'd handle file uploads to Supabase Storage here.
    // For this MVP, we'll save the notes and mock the photo URLs.
    const { error } = await supabase
      .from('service_reports')
      .insert([{
        job_id: jobId,
        technician_notes: notes,
        before_photo_url: 'https://via.placeholder.com/300?text=Before',
        after_photo_url: 'https://via.placeholder.com/300?text=After'
      }])

    if (!error) {
      router.push(`/jobs`)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Service Report</h1>
      
      <form onSubmit={handleUpload} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500">
            <Camera size={24} />
            <span className="text-xs mt-2 text-center">Before Photo</span>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500">
            <Camera size={24} />
            <span className="text-xs mt-2 text-center">After Photo</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Technician Notes</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            placeholder="Describe the work performed..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
          Complete Job & Send Report
        </button>
      </form>
    </div>
  )
}