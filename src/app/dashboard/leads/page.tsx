import { createClient } from '@/lib/supabase/server';
import LeadsClientPage from './LeadsClientPage';

export default async function LeadsPage() {
  const supabase = await createClient();

  // Fetch real leads
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  // ONLY return the Client Page. No grids, no duplicate headers!
  return (
    <div className="w-full">
      <LeadsClientPage initialLeads={leads || []} smsUsage={0} smsLimit={100} />
    </div>
  );
}
