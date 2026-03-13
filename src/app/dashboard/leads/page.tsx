import { createClient } from '@/lib/supabase/server';
import LeadsEmptyState from './LeadsEmptyState';
import { Plus } from 'lucide-react';

export default async function LeadsPage() {
  const supabase = await createClient();

  // Fetch real leads
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  const hasLeads = leads && leads.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase italic dark:text-white">Leads Pipeline</h1>
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            Incoming Opportunities
          </p>
        </div>

        {hasLeads && (
          <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700">
            <Plus size={18} />
            ADD NEW LEAD
          </button>
        )}
      </div>

      {/* Conditional Rendering */}
      {!hasLeads ? (
        <LeadsEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* We will build the actual Kanban board here later */}
          <p className="dark:text-white">Displaying {leads.length} leads...</p>
        </div>
      )}
    </div>
  );
}
