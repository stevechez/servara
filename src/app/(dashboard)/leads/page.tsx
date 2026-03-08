import { createClient } from '@/lib/supabase/server'
import LeadsBoard from '@/components/v2/LeadsBoard';
import NewLeadModal from '@/components/v2/NewLeadModal';
import { Plus, Search, Filter, ArrowUpRight, Clock, CheckCircle } from 'lucide-react'

export const revalidate = 0;

export default async function LeadsPage() {
  const supabase = await createClient();
  
  // Fetch all leads, newest first
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-24 md:pb-8">
      
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic dark:text-white">LEADS PIPELINE</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage and convert your incoming prospects.</p>
        </div>
        
        {/* Put the trigger here */}
        <div className="flex items-center justify-end">
          <NewLeadModal />
        </div>
      </header>

      {/* THE INTERACTIVE BOARD */}
      <LeadsBoard initialLeads={leads || []} />
      
    </div>
  );
}