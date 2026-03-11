import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Zap, MapPin, Users, Send, CheckCircle2, Clock, MessageSquare, RefreshCw } from 'lucide-react';

export default async function NeighborhoodBlitzCard({ jobId }: { jobId: string }) {
  const supabase = await createClient();

  // 1. Fetch campaign AND its attached targets (with customer details)
  const { data: existingCampaign } = await supabase
    .from('neighborhood_campaigns')
    .select(`
      *,
      campaign_targets (
        id,
        status,
        customers (
          name,
          address
        )
      )
    `)
    .eq('origin_job_id', jobId)
    .single();

  // 2. The Server Action to launch the Blitz
  async function launchBlitz() {
    'use server';
    const supabaseServer = await createClient();

    // Create the campaign record
    const { data: campaign, error } = await supabaseServer
      .from('neighborhood_campaigns')
      .insert({
        origin_job_id: jobId,
        radius_miles: 1.5,
        status: 'sending'
      })
      .select()
      .single();

    if (error || !campaign) {
      console.error("Failed to launch blitz:", error);
      return;
    }

    // MOCK DATA GENERATOR: Grab 3 random customers to act as our "neighbors"
    const { data: randomCustomers } = await supabaseServer
      .from('customers')
      .select('id')
      .limit(3);

    if (randomCustomers && randomCustomers.length > 0) {
      const targetsToInsert = randomCustomers.map((c, index) => ({
        campaign_id: campaign.id,
        customer_id: c.id,
        status: index === 0 ? 'booked' : index === 1 ? 'sent' : 'pending',
      }));

      await supabaseServer.from('campaign_targets').insert(targetsToInsert);
    }

    revalidatePath(`/dashboard/jobs/${jobId}`);
  }

  // 3. DEV TOOL: Reset the campaign so you can test it again
  async function resetBlitz() {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.from('neighborhood_campaigns').delete().eq('origin_job_id', jobId);
    revalidatePath(`/dashboard/jobs/${jobId}`);
  }

  if (existingCampaign) {
    // Calculate live stats from the database
    const targets = existingCampaign.campaign_targets || [];
    const totalTargets = targets.length;
    const newBookings = targets.filter((t: any) => t.status === 'booked').length;

    // UI: CAMPAIGN ACTIVE WITH VISUAL LIST
    return (
      <div className="bg-gradient-to-br from-indigo-900 to-blue-900 dark:from-indigo-950 dark:to-blue-950 rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden border border-indigo-500/30">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Zap size={100} />
        </div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-400 fill-yellow-400" size={18} />
            <h2 className="text-xs font-black text-indigo-200 uppercase tracking-widest">Neighborhood Blitz</h2>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 border border-green-500/30">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Live
          </span>
        </div>

        <div className="relative z-10">
          
          {/* STATS ROW */}
          <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Targets Found</p>
               <p className="text-2xl font-black">{totalTargets}</p>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">New Bookings</p>
               <p className="text-2xl font-black text-green-400">{newBookings}</p>
             </div>
          </div>
          
          {/* TARGET LIST */}
          <div className="space-y-3 mt-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">Campaign Targets</h3>
            
            {targets.length > 0 ? (
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {targets.map((target: any) => {
                  const customer = Array.isArray(target.customers) ? target.customers[0] : target.customers;
                  return (
                    <div key={target.id} className="bg-black/20 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                      <div className="truncate pr-4">
                        <p className="text-sm font-bold text-white truncate">{customer?.name || 'Neighbor'}</p>
                        <p className="text-xs text-indigo-200 truncate">{customer?.address?.split(',')[0] || 'Unknown Address'}</p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="shrink-0">
                        {target.status === 'booked' && (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-green-500/20 text-green-400 rounded-lg">
                            <CheckCircle2 size={12} /> Booked!
                          </span>
                        )}
                        {target.status === 'sent' && (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg">
                            <MessageSquare size={12} /> Sent
                          </span>
                        )}
                        {target.status === 'pending' && (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-500/20 text-slate-300 rounded-lg">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 bg-black/20 rounded-xl border border-white/5">
                <p className="text-xs text-indigo-200 font-medium">No targets were attached to this old campaign.</p>
              </div>
            )}
          </div>

          {/* Reset button for testing */}
          <form action={resetBlitz} className="mt-4 pt-4 border-t border-indigo-500/30">
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-2 text-indigo-300 hover:text-white hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
              <RefreshCw size={14} /> Dev: Reset Campaign
            </button>
          </form>

        </div>
      </div>
    );
  }

  // UI: READY TO LAUNCH
  return (
    <div className="bg-slate-900 dark:bg-[#12161D] rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden border border-slate-800 dark:border-white/5">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <MapPin size={100} />
      </div>
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Zap className="text-yellow-500" size={18} />
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Neighborhood Blitz</h2>
      </div>

      <div className="relative z-10 space-y-4">
        <p className="text-sm font-medium text-slate-300 leading-relaxed">
          Turn this job into three more. We will scan a 1.5-mile radius, find past customers, and text them a localized discount offer.
        </p>

        <ul className="space-y-3 py-4">
          <li className="flex items-center gap-3 text-sm text-slate-400">
            <MapPin size={16} className="text-blue-500" /> 1.5 Mile Radius Scan
          </li>
          <li className="flex items-center gap-3 text-sm text-slate-400">
            <Users size={16} className="text-blue-500" /> Filter Eligible Neighbors
          </li>
          <li className="flex items-center gap-3 text-sm text-slate-400">
            <Send size={16} className="text-blue-500" /> Dispatch AI SMS Offer
          </li>
        </ul>

        <form action={launchBlitz}>
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/25 group">
            <Zap size={16} className="group-hover:text-yellow-400 transition-colors" /> Launch Blitz Campaign
          </button>
        </form>
      </div>
    </div>
  );
}