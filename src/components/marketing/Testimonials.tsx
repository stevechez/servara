'use client';

import { Star, Quote } from 'lucide-react';

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
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-blue-600 text-blue-600" />
              ))}
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Trusted by the pros <br /> who keep the world running.
            </h2>
          </div>
          <div className="text-slate-500 font-medium md:text-right">
            <p className="text-2xl font-black text-slate-900 leading-none">4.9/5</p>
            <p className="text-sm mt-1">Average Rating across 500+ Pros</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="relative p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="absolute top-8 right-8 text-slate-200">
                <Quote size={40} />
              </div>
              
              <div>
                <p className="text-lg text-slate-700 font-medium leading-relaxed mb-8 relative z-10">
                  "{review.content}"
                </p>
              </div>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                  Result: {review.stats}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-none">{review.name}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{review.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}