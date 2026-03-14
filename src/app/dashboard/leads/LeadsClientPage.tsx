'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Users, ArrowRight, Phone, Mail, Zap, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { sendNeighborhoodBlitz } from '@/lib/actions/blitz';

export default function LeadsClientPage({
  initialLeads,
  smsUsage,
  smsLimit,
}: {
  initialLeads: any[];
  smsUsage: number;
  smsLimit: number;
}) {
  // 1. STATE VARIABLES
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isBlitzModalOpen, setIsBlitzModalOpen] = useState(false);

  // 2. CREDIT LOGIC
  const creditsRemaining = smsLimit - smsUsage;
  const notEnoughCredits = selectedLeads.length > creditsRemaining;

  // 3. FUNCTIONS
  const toggleLead = (id: string) => {
    setSelectedLeads((prev) => (prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]));
  };

  const handleSend = async (body: string) => {
    try {
      // Log for debugging
      console.log('Sending blitz to:', selectedLeads);

      const results = await sendNeighborhoodBlitz(selectedLeads, body);

      if (results.success) {
        alert(`Blitz Complete! Successfully sent ${selectedLeads.length} messages.`);
        setSelectedLeads([]);
        setIsBlitzModalOpen(false);
      } else {
        alert('Blitz failed. Check your Twilio settings.');
      }
    } catch (error) {
      console.error('Blitz Error:', error);
      alert('System error during blitz.');
    }
  };

  // 4. UI RENDER
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Leads Pipeline</h1>
          <p className="mt-1 text-slate-500">Track and convert your incoming prospects.</p>
        </div>

        <div className="flex gap-3">
          {selectedLeads.length > 0 && (
            <button
              onClick={() => setIsBlitzModalOpen(true)}
              className="animate-in fade-in zoom-in flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600"
            >
              <Zap size={18} />
              Blitz {selectedLeads.length} Leads
            </button>
          )}
          <Link
            href="/dashboard/leads/new"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} /> New Lead
          </Link>
        </div>
      </div>

      {/* GRID OR EMPTY STATE */}
      {initialLeads.length === 0 ? (
        <Card className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
          <Users size={32} className="mb-4 text-blue-500" />
          <h3 className="mb-2 text-xl font-bold text-slate-900">No leads yet</h3>
          <p className="mx-auto mb-6 max-w-md text-slate-500">
            You haven't added any leads yet. Start building your pipeline by adding your first
            prospect, or run a Neighborhood Blitz to generate new ones.
          </p>
          <Link
            href="/dashboard/leads/new"
            className="flex items-center gap-2 font-bold text-blue-600"
          >
            Add your first lead <ArrowRight size={16} />
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {initialLeads.map((lead) => {
            const isSelected = selectedLeads.includes(lead.id);
            return (
              <div key={lead.id} className="group relative h-full">
                <div className="absolute top-4 right-4 z-20" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleLead(lead.id)}
                    className="h-6 w-6 cursor-pointer rounded-md border-slate-300 text-blue-600 shadow-sm transition-transform hover:scale-110 focus:ring-blue-500"
                  />
                </div>
                <Link href={`/dashboard/leads/${lead.id}`} className="block h-full">
                  <Card
                    className={`flex h-full flex-col justify-between rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-blue-500/10'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="pr-10">
                        <h3 className="line-clamp-1 text-xl font-black tracking-tight text-slate-900">
                          {lead.name}
                        </h3>
                        <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black tracking-widest text-blue-700 uppercase shadow-sm">
                          {lead.status}
                        </span>
                      </div>
                      <div className="mt-6 space-y-3 text-sm font-medium text-slate-600">
                        {lead.phone && (
                          <div className="flex items-center gap-3">
                            <Phone size={16} className="text-slate-400" /> {lead.phone}
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-slate-400" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {lead.service_requested && (
                      <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Requested Service
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm font-bold text-slate-800">
                          {lead.service_requested}
                        </p>
                      </div>
                    )}
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* THE BLITZ MODAL */}
      {isBlitzModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <Card className="animate-in zoom-in w-full max-w-lg rounded-3xl p-8 shadow-2xl duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Neighborhood Blitz</h2>
              <button onClick={() => setIsBlitzModalOpen(false)}>
                <X className="text-slate-400" />
              </button>
            </div>

            {/* THE CREDIT TRACKER */}
            <div
              className={`mb-6 rounded-xl border p-4 ${notEnoughCredits ? 'border-red-200 bg-red-50' : 'border-blue-100 bg-blue-50'}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Credits Remaining</span>
                <span
                  className={`font-black ${notEnoughCredits ? 'text-red-600' : 'text-blue-600'}`}
                >
                  {creditsRemaining} / {smsLimit}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full transition-all duration-500 ${notEnoughCredits ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min((smsUsage / smsLimit) * 100, 100)}%` }}
                ></div>
              </div>
              {notEnoughCredits && (
                <p className="mt-2 text-xs font-bold text-red-600">
                  You are trying to send {selectedLeads.length} texts, but only have{' '}
                  {creditsRemaining} credits left.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleSend("Hi [Name], we're doing work for your neighbor today...")}
                disabled={notEnoughCredits}
                className="w-full rounded-2xl border-2 border-slate-100 p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-100 disabled:hover:bg-transparent"
              >
                <div className="font-bold">Around the Corner</div>
                <div className="text-sm text-slate-500">
                  "We're doing work for your neighbor today..."
                </div>
              </button>

              <button
                onClick={() =>
                  handleSend('Hi [Name], we have 3 neighbors booked on your street...')
                }
                disabled={notEnoughCredits}
                className="w-full rounded-2xl border-2 border-slate-100 p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-100 disabled:hover:bg-transparent"
              >
                <div className="font-bold">Group Buy Discount</div>
                <div className="text-sm text-slate-500">
                  "We have 3 neighbors booked on your street..."
                </div>
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
