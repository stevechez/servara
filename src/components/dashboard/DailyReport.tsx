import React from 'react';
import { DollarSign, CheckCircle, MessageSquare, BarChart3 } from 'lucide-react';

export default function DailyReport({ stats }: { stats: any }) {
  const cards = [
    { label: 'Revenue', value: `$${stats.revenue}`, icon: DollarSign, color: 'text-emerald-500' },
    { label: 'Completed', value: stats.completedCount, icon: CheckCircle, color: 'text-blue-500' },
    {
      label: 'Reviews Sent',
      value: stats.reviewsSent,
      icon: MessageSquare,
      color: 'text-amber-500',
    },
    {
      label: 'Completion',
      value: `${stats.completionRate}%`,
      icon: BarChart3,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[1.5rem] border border-white/5 bg-[#0B0E14] p-6 shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <card.icon size={20} className={card.color} />
            <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase">
              Today
            </span>
          </div>
          <p className="text-2xl font-black text-white">{card.value}</p>
          <p className="text-[10px] font-bold tracking-tighter text-slate-500 uppercase">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}
