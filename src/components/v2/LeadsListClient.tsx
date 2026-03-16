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
  const filteredLeads = leads.filter((lead) => {
    // 1. Check Status
    const matchesStatus =
      statusFilter === 'All' || (lead.status || 'new').toLowerCase() === statusFilter.toLowerCase();

    // 2. Check Search Term
    const search = searchTerm.toLowerCase();
    const firstName = (lead.first_name || '').toLowerCase();
    const lastName = (lead.last_name || '').toLowerCase();
    const name = (lead.name || '').toLowerCase(); // Fallback for old records
    const email = (lead.email || '').toLowerCase();

    const matchesSearch =
      firstName.includes(search) ||
      lastName.includes(search) ||
      name.includes(search) ||
      email.includes(search);

    // Only return the lead if it matches BOTH conditions
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 italic dark:text-white">
            Leads Pipeline
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Capture every opportunity before it goes cold.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-95 md:w-auto"
        >
          <Plus size={18} /> Add Lead
        </button>
      </div>

      <NewLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* The Pill Filter */}
        <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1 md:w-fit dark:border-white/5 dark:bg-[#0B0E14]">
          {['All', 'New', 'Contacted', 'Converted'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 rounded-xl px-4 py-2 text-xs font-black tracking-widest uppercase transition-all md:flex-none ${
                statusFilter === status
                  ? 'border border-slate-200 bg-white text-blue-600 shadow-sm dark:border-white/5 dark:bg-slate-800 dark:text-blue-400'
                  : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* The Search Box */}
        <div className="group relative w-full md:max-w-xs">
          <Search
            className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500"
            size={16}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none dark:border-white/5 dark:bg-[#0B0E14] dark:text-white"
          />
        </div>
      </div>

      {/* MAIN TABLE CARD */}
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-white/5 dark:bg-[#0B0E14]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-white/5">
                <th className="px-6 py-5 text-left text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Lead Details
                </th>
                <th className="px-6 py-5 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Source
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Status
                </th>
                <th className="px-6 px-10 py-5 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center font-medium text-slate-500">
                    No leads match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  return (
                    <tr
                      key={lead.id}
                      className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 uppercase transition-colors group-hover:bg-blue-100 group-hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-blue-500/20 dark:group-hover:text-blue-400">
                            {lead.first_name?.[0] || lead.name?.[0] || '?'}
                            {lead.last_name?.[0] || ''}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                              {lead.first_name ? `${lead.first_name} ${lead.last_name}` : lead.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                              {lead.phone || lead.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          {lead.source === 'missed_call' ? (
                            <div
                              className="rounded-xl border border-purple-100 bg-purple-50 p-2 text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400"
                              title="Missed Call AI"
                            >
                              <PhoneMissed size={16} />
                            </div>
                          ) : (
                            <div
                              className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
                              title="Manual Entry"
                            >
                              <ArrowUpRight size={16} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {lead.status === 'converted' ? (
                          <span className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-[10px] font-black tracking-widest text-green-600 uppercase dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
                            Converted
                          </span>
                        ) : (
                          <span className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] font-black tracking-widest text-blue-600 uppercase dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                            New Lead
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {lead.status === 'converted' ? (
                          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-600">
                            Closed Won
                          </span>
                        ) : (
                          <form
                            action={async (formData) => {
                              await convertLead(lead.id, formData);
                            }}
                          >
                            <button
                              type="submit"
                              className="rounded-xl border border-transparent bg-slate-900 px-5 py-2.5 text-[10px] font-black tracking-widest text-white uppercase shadow-md transition-all hover:bg-blue-600 hover:text-white active:scale-95 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-600"
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
