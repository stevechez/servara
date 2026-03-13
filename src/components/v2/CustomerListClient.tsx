'use client';

import { useState } from 'react';
import { UserPlus, Search, Phone, Mail, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import AddCustomerModal from './AddCustomerModal';
import CopyPortalButton from '@/components/v2/CopyPortalButton';

export default function CustomerListClient({ customers }: { customers: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic for the search bar
  const filteredCustomers = customers.filter((c) => {
    const searchStr = searchTerm.toLowerCase();
    const name = (c.name || `${c.first_name || ''} ${c.last_name || ''}`).toLowerCase();
    const email = (c.email || '').toLowerCase();
    return name.includes(searchStr) || email.includes(searchStr);
  });

  return (
    <div className="space-y-6">
      {/* TABLE VIEW */}
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#0B0E14]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Client
                </th>
                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Contact
                </th>
                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center font-medium text-slate-500">
                    No customers found. Try a different search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {customer.name ||
                          `${customer.first_name || ''} ${customer.last_name || ''}`.trim() ||
                          'Unnamed Client'}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-400">
                        <MapPin size={12} className="text-slate-300 dark:text-slate-600" />
                        {customer.address || 'No address set'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-2 text-sm text-slate-600 italic dark:text-slate-300">
                          <Mail size={12} /> {customer.email || 'No email'}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-slate-400">
                          <Phone size={12} /> {customer.phone || 'No phone'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-blue-600 uppercase dark:bg-blue-500/10 dark:text-blue-400">
                        {customer.jobs?.[0]?.count || 0} Projects
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3">
                        {/* THE NEW BUTTON */}
                        <CopyPortalButton customerId={customer.id} />

                        <Link
                          href={`/portal/${customer.id}`}
                          target="_blank"
                          className="rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10"
                          title="View Public Portal"
                        >
                          <ExternalLink size={18} />
                        </Link>

                        <Link
                          href={`/dashboard/customers/${customer.id}`}
                          className="p-2 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
