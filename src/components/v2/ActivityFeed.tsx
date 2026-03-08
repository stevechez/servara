'use client';

import { motion } from 'framer-motion';
import { 
  PhoneIncoming, 
  CheckCircle2, 
  CreditCard, 
  Star, 
  MessageSquare,
  Clock 
} from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'call',
    title: 'Lead Intercepted',
    desc: 'AI answered missed call from Mike R. for Pipe Repair.',
    time: '2m ago',
    icon: <PhoneIncoming size={16} />,
    color: 'bg-blue-50 text-blue-600'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Invoice Paid',
    desc: 'Sarah Jenkins paid $450.00 via Apple Pay.',
    time: '14m ago',
    icon: <CreditCard size={16} />,
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    id: 3,
    type: 'status',
    title: 'Job Completed',
    desc: 'Marcus marked "HVAC Service" as finished.',
    time: '1h ago',
    icon: <CheckCircle2 size={16} />,
    color: 'bg-slate-900 text-white'
  },
  {
    id: 4,
    type: 'review',
    title: '5-Star Review',
    desc: 'New feedback received from Thorne Bistro.',
    time: '3h ago',
    icon: <Star size={16} />,
    color: 'bg-amber-50 text-amber-600'
  }
];

export default function ActivityFeed() {
  return (
    <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Activity</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Field Updates</p>
        </div>
        <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 transition-colors">
          <Clock size={20} />
        </button>
      </div>

      <div className="relative space-y-8">
        {/* The Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-slate-100 -z-0" />

        {activities.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-6 z-10"
          >
            {/* ICON BUBBLE */}
            <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${item.color}`}>
              {item.icon}
            </div>

            {/* CONTENT */}
            <div className="flex-1 pt-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                <span className="text-[10px] font-bold text-slate-400 tabular-nums uppercase tracking-widest">
                  {item.time}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-10 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all">
        View All History
      </button>
    </div>
  );
}