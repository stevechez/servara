'use client';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  Zap,
  MapPin,
  Users,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

export default async function NeighborhoodBlitzCard({ jobId }: { jobId: string }) {
  const supabase = await createClient();

  // 1. Fetch campaign AND its attached targets (with customer details)
  const { data: existingCampaign } = await supabase
    .from('neighborhood_campaigns')
    .select(
      `
      *,
      campaign_targets (
        id,
        status,
        customers (
          name,
          address
        )
      )
    `
    )
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
        status: 'sending',
      })
      .select()
      .single();

    if (error || !campaign) {
      console.error('Failed to launch blitz:', error);
      return;
    }

    // MOCK DATA GENERATOR: Grab 3 random customers to act as our "neighbors"
    const { data: randomCustomers } = await supabaseServer.from('customers').select('id').limit(3);

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
      <div className="relative overflow-hidden rounded-[2rem] border border-indigo-500/30 bg-gradient-to-br from-indigo-900 to-blue-900 p-8 text-white shadow-xl dark:from-indigo-950 dark:to-blue-950">
        <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-10">
          <Zap size={100} />
        </div>

        <div className="relative z-10 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="fill-yellow-400 text-yellow-400" size={18} />
            <h2 className="text-xs font-black tracking-widest text-indigo-200 uppercase">
              Neighborhood Blitz
            </h2>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/20 px-3 py-1 text-[10px] font-black tracking-widest text-green-400 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></span> Live
          </span>
        </div>

        <div className="relative z-10">
          {/* STATS ROW */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-[10px] font-black tracking-widest text-indigo-300 uppercase">
                Targets Found
              </p>
              <p className="text-2xl font-black">{totalTargets}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-[10px] font-black tracking-widest text-indigo-300 uppercase">
                New Bookings
              </p>
              <p className="text-2xl font-black text-green-400">{newBookings}</p>
            </div>
          </div>

          {/* TARGET LIST */}
          <div className="mt-6 space-y-3">
            <h3 className="mb-2 text-[10px] font-black tracking-widest text-indigo-300 uppercase">
              Campaign Targets
            </h3>

            {targets.length > 0 ? (
              <div className="custom-scrollbar max-h-[240px] space-y-2 overflow-y-auto pr-2">
                {targets.map((target: any) => {
                  const customer = Array.isArray(target.customers)
                    ? target.customers[0]
                    : target.customers;
                  return (
                    <div
                      key={target.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-3"
                    >
                      <div className="truncate pr-4">
                        <p className="truncate text-sm font-bold text-white">
                          {customer?.name || 'Neighbor'}
                        </p>
                        <p className="truncate text-xs text-indigo-200">
                          {customer?.address?.split(',')[0] || 'Unknown Address'}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        {target.status === 'booked' && (
                          <span className="flex items-center gap-1 rounded-lg bg-green-500/20 px-2 py-1 text-[10px] font-black tracking-widest text-green-400 uppercase">
                            <CheckCircle2 size={12} /> Booked!
                          </span>
                        )}
                        {target.status === 'sent' && (
                          <span className="flex items-center gap-1 rounded-lg bg-blue-500/20 px-2 py-1 text-[10px] font-black tracking-widest text-blue-300 uppercase">
                            <MessageSquare size={12} /> Sent
                          </span>
                        )}
                        {target.status === 'pending' && (
                          <span className="flex items-center gap-1 rounded-lg bg-slate-500/20 px-2 py-1 text-[10px] font-black tracking-widest text-slate-300 uppercase">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-white/5 bg-black/20 py-6 text-center">
                <p className="text-xs font-medium text-indigo-200">
                  No targets were attached to this old campaign.
                </p>
              </div>
            )}
          </div>

          {/* Reset button for testing */}
          <form action={resetBlitz} className="mt-4 border-t border-indigo-500/30 pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-black tracking-widest text-indigo-300 uppercase transition-colors hover:bg-white/10 hover:text-white"
            >
              <RefreshCw size={14} /> Dev: Reset Campaign
            </button>
          </form>
        </div>
      </div>
    );
  }

  // UI: READY TO LAUNCH
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-white shadow-xl dark:border-white/5 dark:bg-[#12161D]">
      <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-5">
        <MapPin size={100} />
      </div>

      <div className="relative z-10 mb-6 flex items-center gap-2">
        <Zap className="text-yellow-500" size={18} />
        <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase">
          Neighborhood Blitz
        </h2>
      </div>

      <div className="relative z-10 space-y-4">
        <p className="text-sm leading-relaxed font-medium text-slate-300">
          Turn this job into three more. We will scan a 1.5-mile radius, find past customers, and
          text them a localized discount offer.
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
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95"
          >
            <Zap size={16} className="transition-colors group-hover:text-yellow-400" /> Launch Blitz
            Campaign
          </button>
        </form>
      </div>
    </div>
  );
}
