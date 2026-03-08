'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Send, 
  Smile, 
  MessageSquare, 
  ThumbsUp, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const pendingReviews = [
  { 
    id: 1, 
    customer: "Marcus Thorne", 
    job: "HVAC Install", 
    date: "2h ago", 
    sentiment: "Very Positive",
    suggestedMsg: "Hi Marcus! It was a pleasure installing your new HVAC system today. If you're happy with the air quality, would you mind leaving us a quick review? It helps a small business like ours immensely!"
  },
  { 
    id: 2, 
    customer: "Elena Rodriguez", 
    job: "Pipe Repair", 
    date: "5h ago", 
    sentiment: "Positive",
    suggestedMsg: "Hi Elena, hope that sink is working perfectly now! Could you take 30 seconds to share your experience with Thorne Plumbing on Google? Thanks so much!"
  }
];

export default function ReviewAutomation() {
  const [sentIds, setSentIds] = useState<number[]>([]);

  const handleSend = (id: number) => {
    setSentIds([...sentIds, id]);
  };

  const handleFinish = (id: number) => {
    // 1. You could add a 'confetti' trigger here for a world-class feel
    // 2. Add the ID to our 'sent' state to animate it out of the list
    setSentIds((prev) => [...prev, id]);
    
    // 3. In a real app, you'd call your Supabase/Twilio API here:
    // await supabase.from('reviews').update({ status: 'sent' }).eq('id', id)
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Review Engine</h1>
          <p className="text-slate-500 font-medium">AI-generated requests for your recently completed jobs.</p>
        </div>
        <div className="flex gap-4">
          <StatMini label="Avg Rating" value="4.9" icon={<Star size={14} className="fill-blue-600 text-blue-600"/>} />
          <StatMini label="Sent Today" value="12" icon={<Send size={14} className="text-slate-400"/>} />
        </div>
      </div>

      {/* PENDING LIST */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ready to Request</h3>
        
        <AnimatePresence>
          {pendingReviews.map((item) => (
            !sentIds.includes(item.id) && (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-[2.5rem] p-8 flex flex-col lg:flex-row gap-8 items-center shadow-sm hover:shadow-md transition-shadow"
              >

                {/* EMPTY STATE / INBOX ZERO */}
{sentIds.length === pendingReviews.length && (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]"
  >
    <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle2 size={40} />
    </div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Review Inbox Cleared!</h3>
    <p className="text-slate-500 font-medium mt-2">You've sent all pending review requests for today.</p>
  </motion.div>
)}
                {/* Customer Info */}
                <div className="w-full lg:w-48 space-y-2 text-center lg:text-left">
                  <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{item.customer}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{item.job}</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase">
                    <ThumbsUp size={10} /> {item.sentiment}
                  </div>
                </div>

                {/* AI Draft Area */}
                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 relative group">
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg flex items-center gap-2">
                    <Sparkles size={10} /> AI DRAFT
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{item.suggestedMsg}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto">
                  <button 
                    onClick={() => handleFinish(item.id)}
                    className="flex-1 lg:w-40 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                  >
                    Send SMS <Send size={16} />
                  </button>
                  <button className="px-6 py-4 bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">
                    Edit
                  </button>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatMini({ label, value, icon }: any) {
  return (
    <div className="bg-[var(--card)] border border-[var(--card-border)] px-5 py-3 rounded-2xl flex items-center gap-4">
      <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-lg font-black dark:text-white">{value}</p>
      </div>
    </div>
  );
}