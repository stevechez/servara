import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TrendingUp, Users, DollarSign, Crown, Calendar } from 'lucide-react';

// 1. Tell TypeScript exactly what the database is returning
interface MembershipRecord {
  id: string;
  status: string;
  start_date: string;
  next_billing_date: string;
  customers: { name: string; email: string; phone: string } | null;
  membership_plans: { name: string; price: string | number; billing_cycle: string } | null;
}

export default async function MembershipsPage() {
  const supabase = await createClient();

  // 2. Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 3. Fetch Data
  const { data, error } = await supabase
    .from('customer_memberships')
    .select(
      `
      id,
      status,
      start_date,
      next_billing_date,
      customers ( name, email, phone ),
      membership_plans ( name, price, billing_cycle )
    `
    )
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Memberships fetch error:', error.message);
  }

  // 4. Safely Type the Data
  const memberships = (data as unknown as MembershipRecord[]) || [];
  const activeMemberships = memberships.filter((m) => m.status === 'active');

  // 5. Calculate MRR (Converting the String price to a Number first)
  const totalMRR = activeMemberships.reduce((sum, m) => {
    const price = Number(m.membership_plans?.price || 0);
    return sum + (m.membership_plans?.billing_cycle === 'yearly' ? price / 12 : price);
  }, 0);

  const avgRevenuePerUser = activeMemberships.length > 0 ? totalMRR / activeMemberships.length : 0;

  return (
    <div className="flex-1 overflow-auto bg-[#050608] p-8 text-white">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase italic">
            <Crown className="text-amber-500" size={28} />
            Membership Engine
          </h1>
          <p className="mt-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
            Recurring Revenue Command Center
          </p>
        </div>
        <button className="rounded-xl bg-amber-500 px-6 py-3 text-xs font-black tracking-widest text-black uppercase shadow-lg shadow-amber-500/20 transition hover:bg-amber-400">
          + New Plan
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* MRR Card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#0B0E14] p-6 shadow-2xl">
          <div className="absolute -top-4 -right-4 opacity-5">
            <TrendingUp size={120} />
          </div>
          <p className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            <TrendingUp size={14} className="text-emerald-500" /> Total MRR
          </p>
          <p className="text-5xl font-black tracking-tighter text-white italic">
            $
            {totalMRR.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="mt-2 inline-block rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500 uppercase">
            Guaranteed Monthly Income
          </p>
        </div>

        {/* Active Members Card */}
        <div className="rounded-[2rem] border border-white/5 bg-[#0B0E14] p-6 shadow-2xl">
          <p className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            <Users size={14} className="text-blue-500" /> Active VIPs
          </p>
          <p className="text-5xl font-black tracking-tighter text-white italic">
            {activeMemberships.length}
          </p>
          <p className="mt-2 text-[10px] font-bold text-slate-500 uppercase">
            Customers on Subscription
          </p>
        </div>

        {/* ARPU Card */}
        <div className="rounded-[2rem] border border-white/5 bg-[#0B0E14] p-6 shadow-2xl">
          <p className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            <DollarSign size={14} className="text-amber-500" /> ARPU
          </p>
          <p className="text-5xl font-black tracking-tighter text-white italic">
            $
            {avgRevenuePerUser.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="mt-2 text-[10px] font-bold text-slate-500 uppercase">
            Avg Revenue Per User
          </p>
        </div>
      </div>

      {/* RECENT SUBSCRIBERS TABLE */}
      <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-[#0B0E14] shadow-2xl">
        <div className="border-b border-white/5 bg-white/5 p-6">
          <h2 className="text-sm font-black tracking-widest text-white uppercase">
            Subscriber Ledger
          </h2>
        </div>

        {activeMemberships.length === 0 ? (
          <div className="p-12 text-center">
            <Crown size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
              No active memberships yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {activeMemberships.map((membership) => {
              // Safely parse the price for the UI
              const planPrice = Number(membership.membership_plans?.price || 0);

              return (
                <div
                  key={membership.id}
                  className="flex items-center justify-between p-6 transition hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500">
                      <Crown size={20} />
                    </div>
                    <div>
                      <p className="font-black text-white">
                        {membership.customers?.name || 'Unknown Customer'}
                      </p>
                      <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        {membership.membership_plans?.name || 'Custom Plan'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden text-right md:block">
                      <p className="mb-1 flex items-center justify-end gap-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        <Calendar size={10} /> Next Billing
                      </p>
                      <p className="text-xs font-bold text-white">
                        {membership.next_billing_date
                          ? new Date(membership.next_billing_date).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-emerald-500 italic">
                        ${planPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        <span className="ml-1 text-[10px] text-slate-500 uppercase not-italic">
                          / {membership.membership_plans?.billing_cycle === 'yearly' ? 'yr' : 'mo'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
