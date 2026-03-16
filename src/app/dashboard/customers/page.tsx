export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import CustomersEmptyState from './CustomersEmptyState';
import { Plus, Users, Search } from 'lucide-react';
import CustomerListClient from '@/components/v2/CustomerListClient';

export default async function CustomersPage() {
  const supabase = await createClient();

  // Fetch real customers
  const { data: customers } = await supabase
    .from('customers')
    .select('*, jobs(id)')
    .order('name', { ascending: true });

  const hasCustomers = customers && customers.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-black uppercase italic dark:text-white">
            <Users className="text-blue-600" size={24} />
            Customers & Jobs
          </h1>
          <p className="mt-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
            Your growing database of relationships
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasCustomers && (
            <>
              <div className="relative hidden sm:block">
                <Search
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="rounded-2xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/5 dark:bg-[#12161D] dark:text-white"
                />
              </div>
              <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700">
                <Plus size={18} />
                ADD CUSTOMER
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      {!hasCustomers ? (
        <CustomersEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* Mapping actual customer rows would go here */}
          <p className="text-slate-500">Managing {customers.length} customers...</p>
          <CustomerListClient customers={customers || []} />
        </div>
      )}
    </div>
  );
}
