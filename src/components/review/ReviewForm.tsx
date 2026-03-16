'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { submitReview } from '@/app/actions/notification-actions';

export default function ReviewForm({ jobId }: { jobId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    await submitReview(jobId, rating, comment);
    setSubmitted(true);
  };

  if (submitted) return <p className="font-bold text-emerald-500">Feedback sent! Thank you.</p>;

  return (
    <div className="mt-12 rounded-[3rem] border border-slate-200 bg-white p-10 shadow-2xl dark:border-white/5 dark:bg-[#12161D]">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`${star <= rating ? 'text-yellow-400' : 'text-slate-200'} transition-colors`}
          >
            <Star size={40} fill="currentColor" />
          </button>
        ))}
      </div>
      <textarea
        placeholder="Anything else you'd like to share?"
        className="mt-8 w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm focus:border-blue-500 focus:outline-none dark:border-white/5 dark:bg-white/5 dark:text-white"
        rows={4}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-6 w-full rounded-2xl bg-blue-600 py-4 font-black tracking-widest text-white uppercase shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700"
      >
        Submit Feedback
      </button>
    </div>
  );
}
