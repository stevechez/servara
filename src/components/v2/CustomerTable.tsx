'use client';

import { useState } from 'react';
import { Search, MoreHorizontal, Phone, Mail } from 'lucide-react';
import CustomerDrawer from './CustomerDrawer';

export default function CustomerTable({ customers }: { customers: any[] }) {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      {/* Search Bar Area */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/30">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-black">
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredCustomers.map((customer) => (
              <tr 
                key={customer.id} 
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => openCustomer(customer)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none">{customer.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Customer since {new Date(customer.created_at).getFullYear()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Phone size={12} className="text-slate-400"/> {customer.phone || '---'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Mail size={12} className="text-slate-400"/> {customer.email || '---'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-slate-600 font-medium max-w-[200px] truncate">
                    {customer.address || 'No address set'}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* THE DRAWER */}
      <CustomerDrawer 
        customer={selectedCustomer} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
}