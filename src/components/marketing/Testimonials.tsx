'use client';

import { useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    name: "Marcus Thorne",
    role: "Owner, Thorne Plumbing",
    content: "The AI Call Intercept changed everything. I used to lose 3-4 leads a day while I was under a sink. Now, Servara books them before I even dry my hands.",
    stats: "30% Revenue Increase",
    avatar: "MT"
  },
  {
    name: "Sarah Jenkins",
    role: "Operations, AirPro HVAC",
    content: "We switched from Jobber in an afternoon. The routing engine alone saves our techs an hour of traffic every day. It paid for itself in the first week.",
    stats: "5 hrs/week saved per tech",
    avatar: "SJ"
  },
  {
    name: "David Chen",
    role: "Founder, Sparky Electric",
    content: "The revenue forecasting is scary accurate. I finally know exactly when I can afford to hire another apprentice and buy a new van.",
    stats: "Predictable Cash Flow",
    avatar: "DC"
  },
  {
    name: "Elena Rodriguez",
    role: "CEO, Green Scapes Landscaping",
    content: "The 1-click PDF reports completely eliminated client disputes. We snap a photo, hit complete, and the client gets a beautiful branded report instantly.",
    stats: "Zero Billing Disputes",
    avatar: "ER"
  },
  {
    name: "Mike O'Connor",
    role: "Manager, Clear Water Pools",
    content: "Selling Care Plans used to be a headache. Now my techs just click a button on the customer profile. Our recurring revenue is up 40% this quarter.",
    stats: "40% MRR Growth",
    avatar: "MO"
  }
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Scroll by the width of one card + gap (approx 432px)
      const scrollAmount = direction === 'left' ? -432 : 432;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-[#0B0E14] border-y border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-blue-600 text-blue-600" />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Trusted by the pros <br /> who keep the world running.
            </h2>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-6">
            <div className="text-slate-500 dark:text-slate-400 font-medium md:text-right">
              <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">4.9/5</p>
              <p className="text-sm mt-1">Average Rating across 500+ Pros</p>
            </div>
            
            {/* CAROUSEL NAVIGATION CONTROLS */}
            <div className="flex gap-2">
              <button 
                onClick={() => scroll('left')}
                className="p-3 rounded-full bg-slate-100 dark:bg-[#12161D] text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-slate-200 dark:border-white/5"
                aria-label="Previous review"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-3 rounded-full bg-slate-100 dark:bg-[#12161D] text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-slate-200 dark:border-white/5"
                aria-label="Next review"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* CAROUSEL TRACK */}
        <div className="relative -mx-6 px-6">
          {/* Right edge fade gradient to indicate more scrolling content */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-[#0B0E14] to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={scrollRef}
            // scrollbar-hide class equivalent using standard CSS properties
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="snap-start shrink-0 w-[85vw] md:w-[400px] relative p-8 rounded-[2.5rem] bg-slate-50 dark:bg-[#12161D] border border-slate-200 dark:border-white/5 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 shadow-sm"
              >
                <div className="absolute top-8 right-8 text-slate-200 dark:text-slate-800 transition-colors">
                  <Quote size={40} />
                </div>
                
                <div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8 relative z-10 min-h-[140px]">
                    "{review.content}"
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider border border-blue-200 dark:border-blue-500/20">
                    Result: {review.stats}
                  </div>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-white/5">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black shadow-lg">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-none">{review.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{review.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}