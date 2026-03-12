// app/(dashboard)/leads/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { createEstimateFromLead } from '@/lib/actions/estimates'
import { Phone, Mail, MapPin, User, ArrowRight, FileText } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!lead) return notFound()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500">
        <Link href="/dashboard/leads" className="hover:text-blue-600">Leads</Link> / <span>{lead.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <User size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{lead.name}</h1>
                <span className="text-xs font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                  {lead.status}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <a href={`tel:${lead.phone}`} className="hover:text-blue-600 font-medium">
                  {lead.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={16} className="text-gray-400" />
                <a href={`mailto:${lead.email}`} className="hover:text-blue-600">
                  {lead.email}
                </a>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin size={16} className="text-gray-400 mt-1" />
                <span>{lead.address || 'No address provided'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-dashed rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Service Requested</h3>
            <p className="text-gray-600 italic">"{lead.service_requested || 'General inquiry'}"</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Conversion Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Convert to Estimate
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Creating an estimate will automatically turn this lead into a permanent Customer.
              </p>
            </div>

            {/* Find the form on your Lead Detail page */}
<form action={createEstimateFromLead} className="p-6 space-y-4">
  {/* The "Anchor": This links the form to the specific lead */}
  <input type="hidden" name="lead_id" value={lead.id} />

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-1">
      <label className="text-sm font-bold text-gray-700">Estimate Amount ($)</label>
      <input 
        name="amount" 
        type="number" 
        step="0.01"
        required 
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="space-y-1">
      <label className="text-sm font-bold text-gray-700">Job Address</label>
      <input 
        name="address" 
        type="text" 
        defaultValue={lead.address}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  <button 
    type="submit" 
    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700"
  >
    Generate Estimate
  </button>
</form>
          </div>
        </div>

      </div>
    </div>
  )
}