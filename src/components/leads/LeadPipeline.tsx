// components/leads/LeadPipeline.tsx
'use client'

import { updateLeadStatus } from '@/lib/actions/leads'
import { Phone, Mail, User } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

type Lead = {
  id: string
  name: string
  phone: string | null
  email: string | null
  service_requested: string
  status: 'new' | 'estimate_sent' | 'won' | 'lost'
  created_at: string
}

const STAGES = [
  { id: 'new', label: 'New Leads', color: 'bg-blue-100 border-blue-200 text-blue-800' },
  { id: 'estimate_sent', label: 'Estimate Sent', color: 'bg-amber-100 border-amber-200 text-amber-800' },
  { id: 'won', label: 'Won (Job Booked)', color: 'bg-green-100 border-green-200 text-green-800' },
  { id: 'lost', label: 'Lost', color: 'bg-gray-100 border-gray-200 text-gray-800' },
]

export default function LeadPipeline({ initialLeads }: { initialLeads: Lead[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setLoadingId(leadId)
    await updateLeadStatus(leadId, newStatus)
    setLoadingId(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 items-start">
      {STAGES.map((stage) => {
        const columnLeads = initialLeads.filter((l) => l.status === stage.id)

        return (
          <div key={stage.id} className="flex flex-col gap-4">
            {/* Column Header */}
            <div className={`px-4 py-2 rounded-md border font-semibold flex justify-between items-center ${stage.color}`}>
              <span>{stage.label}</span>
              <span className="bg-white/50 px-2 py-0.5 rounded-full text-sm">
                {columnLeads.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3">
              {columnLeads.map((lead) => (
                <div 
                  key={lead.id} 
                  className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-opacity ${loadingId === lead.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      {lead.name || 'Unnamed Lead'}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 font-medium mb-3">
                    {lead.service_requested || 'General Inquiry'}
                  </p>

                  <div className="space-y-1 mb-4 text-sm text-gray-500">
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-blue-600">
                        <Phone size={14} /> {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-blue-600 truncate">
                        <Mail size={14} /> {lead.email}
                      </a>
                    )}
                  </div>

                  {/* Stage Mover */}
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    disabled={loadingId === lead.id}
                    className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 py-1.5"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>

                  {/* Add this inside the lead card in components/leads/LeadPipeline.tsx */}
{lead.status === 'new' && (
  <Link 
    href={`/estimates/new?lead_id=${lead.id}`}
    className="mt-3 block w-full text-center py-1.5 px-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
  >
    Quote Job
  </Link>
)}
                </div>
              ))}

              

              {columnLeads.length === 0 && (
                <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                  No leads in this stage
                </div>
              )}
            </div>
            
          </div>
        )
      })}
    </div>
  )
}