'use client';

import { useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    name: 'Marcus Thorne',
    role: 'Owner, Thorne Plumbing',
    content:
      'The AI Call Intercept changed everything. I used to lose 3-4 leads a day while I was under a sink. Now, Zidro books them before I even dry my hands.',
    stats: '30% Revenue Increase',
    avatar: 'MT',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Operations, AirPro HVAC',
    content:
      'We switched from Jobber in an afternoon. The routing engine alone saves our techs an hour of traffic every day. It paid for itself in the first week.',
    stats: '5 hrs/week saved per tech',
    avatar: 'SJ',
  },
  {
    name: 'David Chen',
    role: 'Founder, Sparky Electric',
    content:
      'The revenue forecasting is scary accurate. I finally know exactly when I can afford to hire another apprentice and buy a new van.',
    stats: 'Predictable Cash Flow',
    avatar: 'DC',
  },
  {
    name: 'Elena Rodriguez',
    role: 'CEO, Green Scapes Landscaping',
    content:
      'The 1-click PDF reports completely eliminated client disputes. We snap a photo, hit complete, and the client gets a beautiful branded report instantly.',
    stats: 'Zero Billing Disputes',
    avatar: 'ER',
  },
  {
    name: "Mike O'Connor",
    role: 'Manager, Clear Water Pools',
    content:
      'Selling Care Plans used to be a headache. Now my techs just click a button on the customer profile. Our recurring revenue is up 40% this quarter.',
    stats: '40% MRR Growth',
    avatar: 'MO',
  },
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
    <section className="overflow-hidden border-y border-slate-200 bg-white py-24 transition-colors duration-300 dark:border-white/5 dark:bg-[#0B0E14]">
      <div className="mx-auto max-w-7xl px-6">
        {/* HEADER SECTION */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="mb-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-blue-600 text-blue-600" />
              ))}
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl dark:text-white">
              Trusted by the pros <br /> who keep the world running.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-6 md:items-end">
            <div className="font-medium text-slate-500 md:text-right dark:text-slate-400">
              <p className="text-3xl leading-none font-black text-slate-900 dark:text-white">
                4.9/5
              </p>
              <p className="mt-1 text-sm">Average Rating across 500+ Pros</p>
            </div>

            {/* CAROUSEL NAVIGATION CONTROLS */}
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="rounded-full border border-slate-200 bg-slate-100 p-3 text-slate-600 transition-all hover:bg-blue-600 hover:text-white active:scale-95 dark:border-white/5 dark:bg-[#12161D] dark:text-slate-400"
                aria-label="Previous review"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="rounded-full border border-slate-200 bg-slate-100 p-3 text-slate-600 transition-all hover:bg-blue-600 hover:text-white active:scale-95 dark:border-white/5 dark:bg-[#12161D] dark:text-slate-400"
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
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l from-white to-transparent dark:from-[#0B0E14]" />

          <div
            ref={scrollRef}
            // scrollbar-hide class equivalent using standard CSS properties
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pt-4 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="relative flex w-[85vw] shrink-0 snap-start flex-col justify-between rounded-[2.5rem] border border-slate-200 bg-slate-50 p-8 shadow-sm transition-transform duration-300 hover:-translate-y-2 md:w-[400px] dark:border-white/5 dark:bg-[#12161D]"
              >
                <div className="absolute top-8 right-8 text-slate-200 transition-colors dark:text-slate-800">
                  <Quote size={40} />
                </div>

                <div>
                  <p className="relative z-10 mb-8 min-h-[140px] text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-300">
                    "{review.content}"
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-3 py-1.5 text-[10px] font-black tracking-wider text-blue-700 uppercase dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                    Result: {review.stats}
                  </div>

                  <div className="flex items-center gap-4 border-t border-slate-200 pt-6 dark:border-white/5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 font-black text-white shadow-lg dark:bg-white dark:text-slate-900">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="leading-none font-bold text-slate-900 dark:text-white">
                        {review.name}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {review.role}
                      </p>
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
