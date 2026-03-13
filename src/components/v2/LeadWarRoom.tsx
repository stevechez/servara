'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Phone, Loader2, ArrowUpRight } from 'lucide-react';
import { convertLeadToJob } from '@/app/actions/convertLead';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  service_type: string;
  email: string;
  phone?: string; // Added phone to the interface for scoring
  created_at: string;
  status: 'new' | 'contacted' | 'converted';
}

export default function LeadWarRoom({ leads }: { leads: Lead[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleConvert = async (id: string) => {
    setLoadingId(id);
    try {
      const result = await convertLeadToJob(id);
      if (result.success) {
        toast.success('Lead converted to Job!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Conversion failed');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="shadow-soft rounded-[2.5rem] border border-slate-200 bg-white p-8 dark:border-white/5 dark:bg-[#12161D]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-blue-600 uppercase">
            <UserPlus size={14} /> Inbound Pipeline
          </h2>
          <p className="mt-1 text-2xl font-black tracking-tighter italic dark:text-white">
            Active Opportunities
          </p>
        </div>
        <div className="rounded-full bg-blue-500/10 px-4 py-1 text-[10px] font-black tracking-widest text-blue-600 uppercase">
          {leads.length} Pending
        </div>
      </div>

      <div className="space-y-4">
        {leads.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-100 py-10 text-center dark:border-white/5">
            <p className="text-xs font-bold text-slate-400">Waiting for your first lead...</p>
          </div>
        ) : (
          leads.map((lead, idx) => {
            // LOGIC LIVES HERE - Inside the map, before the return
            const isHot = lead.phone && lead.service_type;

            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={lead.id}
                className="group flex items-center justify-between rounded-3xl border border-slate-50 bg-slate-50/50 p-6 transition-all hover:border-blue-500/30 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-colors ${
                      isHot
                        ? 'bg-orange-500 shadow-orange-500/20'
                        : 'bg-blue-600 shadow-blue-600/20'
                    }`}
                  >
                    <span className="font-black uppercase italic">{lead.name[0]}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black tracking-tight text-slate-900 dark:text-white">
                        {lead.name}
                      </h4>
                      {isHot && (
                        <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[8px] font-black tracking-widest text-orange-600 uppercase">
                          Hot Lead
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-black tracking-widest text-blue-500 uppercase">
                      {lead.service_type || 'General Inquiry'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-xl bg-white p-3 text-slate-400 shadow-sm transition-colors hover:text-blue-600 dark:bg-white/5">
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={() => handleConvert(lead.id)}
                    disabled={loadingId === lead.id}
                    className="rounded-xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                  >
                    {loadingId === lead.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
