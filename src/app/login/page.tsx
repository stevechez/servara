'use client';

import { useState } from 'react';
import { handleAuth } from '@/lib/actions/auth';
import { Card } from '@/components/ui/card';
import { Wrench, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      await handleAuth(formData, mode);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-[#0B0E14]">
      <Card className="w-full max-w-md overflow-hidden rounded-[2.5rem] border-none p-8 shadow-2xl dark:bg-[#12161D]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-500/30">
            <Wrench size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
            Zidro <span className="text-blue-500">Pro</span>
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {mode === 'login' ? 'Welcome back, Chief.' : 'Start your 14-day free trial.'}
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 dark:bg-red-500/10">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/5 dark:bg-[#0B0E14] dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/5 dark:bg-[#0B0E14] dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : mode === 'login' ? (
              'SIGN IN'
            ) : (
              'CREATE ACCOUNT'
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center dark:border-white/5">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs font-bold tracking-tighter text-slate-400 uppercase transition-colors hover:text-blue-500"
          >
            {mode === 'login'
              ? "Don't have an account? Create one"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </Card>
    </div>
  );
}
