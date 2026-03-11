import { createClient } from '@/lib/supabase/server';
import LeadsListClient from '@/components/v2/LeadsListClient';
import { Clock, CheckCircle, Zap } from 'lucide-react';

export const revalidate = 0;

export default async function LeadsPage() {
  const supabase = await createClient();
  
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  const safeLeads = leads || [];

  // KPI Calculations (Now crash-proof!)
  const newToday = safeLeads.filter(l => {
    const today = new Date().toISOString().split('T')[0];
    // The '?.' ensures it won't crash if created_at is null
    return l.created_at?.startsWith(today);
  }).length;

  const conversionRate = safeLeads.length > 0 
    ? Math.round((safeLeads.filter(l => l.status === 'converted').length / safeLeads.length) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* KPI STATS ROW */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-4 lg:mt-8">        <StatCard title="Active Pipeline" value={safeLeads.length} icon={<Zap size={18}/>} color="blue" />
        <StatCard title="New Today" value={newToday} icon={<Clock size={18}/>} color="amber" subtitle="Requires follow-up" />
        <StatCard title="Win Rate" value={`${conversionRate}%`} icon={<CheckCircle size={18}/>} color="green" subtitle="Historical average" />
      </div>

      {/* THE INTERACTIVE CLIENT COMPONENT */}
     {/* <div className="w-full overflow-x-auto pb-4">
  <div className="min-w-[800px]"> {/* Forces the table to stay wide, but lets the user swipe it */}
    {/* <LeadsListClient leads={safeLeads} /> */}
  {/* </div> */}
{/* </div> */}
    </div>
  );
}

// Helper component for the Stats
function StatCard({ title, value, icon, color, subtitle }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
  }
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${colors[color]}`}>{icon}</div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      {subtitle && <p className="text-[10px] text-slate-400 font-medium mt-1">{subtitle}</p>}
    </div>
  )
}