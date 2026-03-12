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
  const filteredCustomers = customers.filter(c => {
    const searchStr = searchTerm.toLowerCase();
    const name = (c.name || `${c.first_name || ''} ${c.last_name || ''}`).toLowerCase();
    const email = (c.email || '').toLowerCase();
    return name.includes(searchStr) || email.includes(searchStr);
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
            Customer Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
              Manage your client base and view service history.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95 whitespace-nowrap"
        >
          <UserPlus size={18} />
          Add Customer
        </button>
      </div>

      <AddCustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* SEARCH BAR */}
      <div className="relative w-full group">
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" 
          size={18} 
        />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email..." 
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[24px] text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm"
        />
      </div>

      {/* TABLE VIEW */}
      <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">
                    No customers found. Try a different search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {customer.name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unnamed Client'}
                      </div>
                      <div className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-slate-300 dark:text-slate-600" /> 
                        {customer.address || 'No address set'}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2 italic">
                          <Mail size={12} /> {customer.email || 'No email'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-2">
                          <Phone size={12} /> {customer.phone || 'No phone'}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest inline-block">
                        {customer.jobs?.[0]?.count || 0} Projects
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex justify-end items-center gap-3">
                        {/* THE NEW BUTTON */}
                        <CopyPortalButton customerId={customer.id} />
                        
                        <Link 
                          href={`/portal/${customer.id}`} 
                          target="_blank" 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                          title="View Public Portal"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        
                        <Link 
                          href={`/dashboard/customers/${customer.id}`}
                          className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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