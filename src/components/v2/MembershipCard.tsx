'use client';

import { useState } from 'react';
import { ShieldCheck, Star, CreditCard, Loader2 } from 'lucide-react';
import { enrollCustomer } from '@/app/actions/memberships';

export default function MembershipCard({ 
  customerId, 
  membership 
}: { 
  customerId: string, 
  membership: any 
}) {
  const [loading, setLoading] = useState(false);

  async function handleEnroll(planName: string, price: number) {
    if (!confirm(`Enroll this customer in the ${planName} for $${price}/mo?`)) return;
    
    setLoading(true);
    const res = await enrollCustomer(customerId, planName, price);
    if (!res.success) alert(`Enrollment failed: ${res.error}`);
    setLoading(false);
  }

  // VIP STATE: If they already have an active plan
  if (membership && membership.status === 'active') {
    return (
      <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 backdrop-blur-md">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Active Member</h3>
                <p className="text-blue-200 text-xs font-bold mt-1">{membership.plan_name}</p>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-[10px] font-black uppercase rounded-xl border border-green-500/20">
              Good Standing
            </span>
          </div>
          
          <div className="space-y-1 mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly MRR</p>
            <p className="text-4xl font-black flex items-center">
              <span className="text-blue-500 mr-1">$</span>{membership.price}
              <span className="text-sm text-slate-400 font-medium ml-1">/mo</span>
            </p>
          </div>
          
          <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
            <CreditCard size={14} className="text-slate-500" /> Next billing: {new Date(membership.next_billing_date).toLocaleDateString()}
          </p>
        </div>
        {/* Decorative Background Flare */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
      </div>
    );
  }

  // SALES STATE: If they don't have a plan yet
  return (
    <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-[32px] p-8 shadow-sm">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Star size={14} className="text-yellow-500" /> Pitch Care Plan
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-6 leading-relaxed">
        Lock in this customer with a recurring maintenance plan. Guaranteed monthly revenue and priority service.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => handleEnroll('Pro Care Plan', 29.00)}
          disabled={loading}
          className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 dark:border-white/5 hover:border-blue-500 dark:hover:border-blue-500 transition-all group active:scale-95 text-left disabled:opacity-50"
        >
          <div>
            <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Pro Care Plan</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Bi-annual checkups</p>
          </div>
          <div className="text-right">
            {loading ? <Loader2 className="animate-spin text-blue-500 mx-auto" size={20} /> : (
              <>
                <p className="text-lg font-black text-blue-600">$29</p>
                <p className="text-[10px] font-black text-slate-400 uppercase">/month</p>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}