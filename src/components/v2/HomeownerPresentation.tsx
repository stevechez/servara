'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, Star, Wrench, ArrowRight, Loader2 } from 'lucide-react';

export default function HomeownerPresentation() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service_id');
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    const fetchServiceData = async () => {
      // Fetch the service AND its nested options from the database!
      const { data } = await supabase
        .from('pricebook_services')
        .select('*, pricebook_options(*)')
        .eq('id', serviceId)
        .single();

      if (data) {
        setService(data);
        // Sort the tiers by price (lowest to highest)
        const sortedTiers = (data.pricebook_options || []).sort((a: any, b: any) => a.price - b.price);
        setTiers(sortedTiers);
      }
      setLoading(false);
    };

    fetchServiceData();
  }, [serviceId, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#050608]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Building Proposal...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050608]">
        <p className="text-slate-500 font-medium">No service found. Please provide a valid service link.</p>
      </div>
    );
  }

  // If they have no tiers set up, we just show the base service as the only option
  const displayTiers = tiers.length > 0 ? tiers : [{
    id: service.id,
    tier_name: 'Standard Service',
    price: service.base_price
  }];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050608] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden pb-32">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Presentation Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl mb-6 shadow-sm">
          <Wrench size={28} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Your Service Options
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl mx-auto">
          {service.name}. Please review the options below and select the level of service that best fits your home.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl relative z-10 items-end">
        {displayTiers.map((tier, index) => {
          const isSelected = selectedTier === tier.id;
          // Dynamically make the middle tier the "Most Popular" highlight
          const isPopular = displayTiers.length >= 3 && index === 1; 
          
          return (
            <div 
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`relative flex flex-col p-8 rounded-[2rem] cursor-pointer transition-all duration-300 border-2 text-left bg-white dark:bg-[#0B0E14]
                ${isPopular ? 'md:-translate-y-4 shadow-2xl shadow-blue-500/10 z-20' : 'shadow-lg z-10'}
                ${isSelected 
                  ? 'border-blue-600 dark:border-blue-500 ring-4 ring-blue-500/20' 
                  : isPopular 
                    ? 'border-blue-300 dark:border-blue-500/50' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
                }
              `}
            >
              {isPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg whitespace-nowrap">
                  <Star size={12} className="fill-current" /> Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight mb-1">{tier.tier_name}</h3>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">${tier.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Dynamic Feature List (Fallback defaults for now) */}
              <div className="flex-1 space-y-4 mb-10">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${isPopular ? 'text-blue-500' : 'text-slate-400 dark:text-slate-600'}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">Professional Installation & Labor</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${isPopular ? 'text-blue-500' : 'text-slate-400 dark:text-slate-600'}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">{tier.tier_name === 'Best' ? 'Extended 5-Year Warranty' : tier.tier_name === 'Better' ? 'Standard 1-Year Warranty' : '30-Day Parts Guarantee'}</span>
                </div>
              </div>

              <div className={`w-full py-4 rounded-xl text-center font-black text-sm uppercase tracking-widest transition-all
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : isPopular
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }
              `}>
                {isSelected ? 'Selected' : 'Choose This Option'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-[#0B0E14]/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 transform transition-transform duration-500 flex justify-center z-50 ${selectedTier ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center justify-between w-full max-w-4xl">
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Authorized Amount</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
              ${displayTiers.find(t => t.id === selectedTier)?.price.toFixed(2)}
            </p>
          </div>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95">
            Approve & Sign <ArrowRight size={18} />
          </button>
        </div>
      </div>
      
    </div>
  );
}