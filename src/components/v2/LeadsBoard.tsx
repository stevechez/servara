'use client';

import { useState, useEffect } from 'react'; // 1. Add useEffect here
import { createClient } from '@/lib/supabase/client';
import { Phone, User, ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const COLUMNS = [
  { id: 'new', label: 'New Leads', color: 'blue' },
  { id: 'contacted', label: 'Contacted', color: 'amber' },
  { id: 'converted', label: 'Converted', color: 'emerald' },
  { id: 'lost', label: 'Lost', color: 'red' },
];

export default function LeadsBoard({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const supabase = createClient();
  const router = useRouter();

  // 2. THE FIX: Watch for new data from the server and update the board
  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const updateLeadStatus = async (id: string, newStatus: string) => {
    // Optimistic UI update for instant feel
    setLeads(current => 
      current.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead)
    );

    // Update database in the background
    await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    router.refresh(); // Keeps server state in sync
  };

  // ... rest of your component stays exactly the same

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
      {COLUMNS.map(col => {
        const columnLeads = leads.filter(l => l.status === col.id);
        
        return (
          <div key={col.id} className="min-w-[300px] flex-1 snap-start flex flex-col">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {col.label}
              </h3>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300`}>
                {columnLeads.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 bg-slate-50 dark:bg-[#0B0E14]/50 border border-slate-200 dark:border-slate-800/50 rounded-[2rem] p-4 space-y-4 min-h-[500px]">
              {columnLeads.map(lead => (
                <div 
                  key={lead.id}
                  className="bg-white dark:bg-[#0B0E14] p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate pr-2">{lead.name}</h4>
                    <span className="shrink-0 p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                      <User size={14} />
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{lead.service_type}</p>
                    {lead.phone && (
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Phone size={12} /> {lead.phone}
                      </p>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    
                    {col.id === 'new' && (
                      <button onClick={() => updateLeadStatus(lead.id, 'contacted')} className="w-full py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                        Contacted <ArrowRight size={12} />
                      </button>
                    )}

                    {col.id === 'contacted' && (
                      <div className="flex w-full gap-2">
                        <button onClick={() => updateLeadStatus(lead.id, 'lost')} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors">
                          <XCircle size={16} />
                        </button>
                        <button onClick={() => updateLeadStatus(lead.id, 'converted')} className="flex-[3] py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                          <CheckCircle2 size={14} /> Won
                        </button>
                      </div>
                    )}

                    {col.id === 'converted' && (
                      <span className="w-full text-center text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        Ready to Dispatch
                      </span>
                    )}

                    {col.id === 'lost' && (
                      <button onClick={() => updateLeadStatus(lead.id, 'new')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-1">
                        <ArrowLeft size={12} /> Re-open
                      </button>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}