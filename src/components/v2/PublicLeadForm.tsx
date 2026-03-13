'use client';

import { useState } from 'react';
import { submitLead } from '@/app/actions/submitLead';
import { Loader2, CheckCircle } from 'lucide-react';

export default function PublicLeadForm() {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitLead(formData);
    setPending(false);
    if (result.success) setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 text-emerald-500" size={48} />
        <h3 className="text-xl font-bold text-emerald-900">Request Sent!</h3>
        <p className="text-emerald-700">We'll be in touch within 15 minutes.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-[2rem] border border-slate-100 bg-white p-8 shadow-2xl dark:border-white/5 dark:bg-slate-900"
    >
      <h3 className="text-2xl font-black tracking-tight uppercase italic">Get a Free Quote</h3>
      <input
        name="name"
        placeholder="Full Name"
        required
        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-800"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-800"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          required
          className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-800"
        />
      </div>
      <textarea
        name="message"
        placeholder="What do you need help with?"
        rows={3}
        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:bg-slate-800"
      />
      <button
        disabled={pending}
        type="submit"
        className="w-full rounded-xl bg-blue-600 p-4 font-black text-white uppercase italic transition-all hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? <Loader2 className="mx-auto animate-spin" /> : 'Claim My Discount'}
      </button>
    </form>
  );
}
