'use client';

import { useState } from 'react';
import { Plus, Search, ArrowUpRight, PhoneMissed } from 'lucide-react';
import NewLeadModal from './NewLeadModal';
import { convertLead } from '@/app/actions/convertLead';

export default function LeadsListClient({ leads }: { leads: any[] }) {  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // COMBINED FILTER: Handles both the Pill Filter AND the Search Bar simultaneously
  const filteredLeads = leads.filter(lead => {
    // 1. Check Status
    const matchesStatus = statusFilter === 'All' || (lead.status || 'new').toLowerCase() === statusFilter.toLowerCase();
    
    // 2. Check Search Term
    const search = searchTerm.toLowerCase();
    const firstName = (lead.first_name || '').toLowerCase();
    const lastName = (lead.last_name || '').toLowerCase();
    const name = (lead.name || '').toLowerCase(); // Fallback for old records
    const email = (lead.email || '').toLowerCase();
    
    const matchesSearch = firstName.includes(search) || 
                          lastName.includes(search) || 
                          name.includes(search) || 
                          email.includes(search);

    // Only return the lead if it matches BOTH conditions
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Leads Pipeline</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Capture every opportunity before it goes cold.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={18} /> Add Lead
        </button>
      </div>

      <NewLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* The Pill Filter */}
        <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-2xl w-full md:w-fit">
          {['All', 'New', 'Contacted', 'Converted'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                statusFilter === status
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-white/5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* The Search Box */}
        <div className="relative w-full md:max-w-xs group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads..." 
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* MAIN TABLE CARD */}
      <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-[32px] shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Lead Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Source</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right px-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredLeads.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">
                     No leads match your search criteria.
                   </td>
                 </tr>
              ) : (
                filteredLeads.map((lead) => {
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs uppercase group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-500/20 dark:group-hover:text-blue-400 transition-colors border border-slate-200 dark:border-white/10">
                            {(lead.first_name?.[0] || lead.name?.[0] || '?')}{(lead.last_name?.[0] || '')}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {lead.first_name ? `${lead.first_name} ${lead.last_name}` : lead.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lead.phone || lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          {lead.source === 'missed_call' ? (
                            <div className="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 p-2 rounded-xl border border-purple-100 dark:border-purple-500/20" title="Missed Call AI">
                              <PhoneMissed size={16} />
                            </div>
                          ) : (
                            <div className="bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 p-2 rounded-xl border border-slate-100 dark:border-white/10" title="Manual Entry">
                              <ArrowUpRight size={16} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {lead.status === 'converted' ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-2 rounded-xl border border-green-100 dark:border-green-500/20">
                              Converted
                            </span>
                        ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-2 rounded-xl border border-blue-100 dark:border-blue-500/20">
                              New Lead
                            </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {lead.status === 'converted' ? (
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">
                            Closed Won
                          </span>
                        ) : (
                          <form action={async (formData) => {
                            await convertLead(lead.id, formData);
                          }}>
                            <button 
                              type="submit" 
                              className="bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-300 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95 border border-transparent dark:border-white/10"
                            >
                              Convert
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}