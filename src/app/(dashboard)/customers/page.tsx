import { createClient } from '@/lib/supabase/server';
import { Mail, Phone, MapPin } from 'lucide-react';

export const revalidate = 0;

export default async function CustomersPage() {
  const supabase = await createClient();
  
  // Fetch all customers, newest first
  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-24 md:pb-8">
      
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic dark:text-white">CLIENT ROSTER</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage your customer database and contact info.</p>
        </div>
      </header>

      {/* CUSTOMERS TABLE */}
      <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Client Name</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Contact</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Address</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="p-6">
                    <p className="font-bold text-slate-900 dark:text-white">{customer.name}</p>
                  </td>
                  <td className="p-6 space-y-2">
                    {customer.email && (
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Mail size={12} className="text-slate-400" /> {customer.email}
                      </p>
                    )}
                    {customer.phone && (
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Phone size={12} className="text-slate-400" /> {customer.phone}
                      </p>
                    )}
                  </td>
                  <td className="p-6">
                    {customer.address ? (
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <MapPin size={12} className="text-slate-400" /> {customer.address}
                      </p>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No address provided</span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <p className="text-xs font-medium text-slate-400">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </td>
                </tr>
              ))}
              
              {(!customers || customers.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 text-sm font-medium">
                    No customers found. Create a job to add your first client!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}