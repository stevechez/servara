'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Create the user in Supabase Auth
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // Store the business name in the user's raw_user_meta_data
          business_name: businessName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      // 2. Show success state (Supabase requires email confirmation by default)
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-[#050608]">
      <div className="w-full max-w-md rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-xl dark:border-slate-800 dark:bg-[#0B0E14]">
        <div className="mb-8">
          <h2 className="text-2xl font-black tracking-tight italic dark:text-white">Join Zidro</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Start your AI-powered office today.
          </p>
        </div>

        {success ? (
          <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              ✓
            </div>
            <h3 className="text-lg font-black text-emerald-800 dark:text-emerald-400">
              Check your email!
            </h3>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your
              account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="mb-2 block px-1 text-[10px] font-black text-slate-400 uppercase">
                Business Name
              </label>
              <input
                required
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                placeholder="Thorne Plumbing Co."
              />
            </div>

            <div>
              <label className="mb-2 block px-1 text-[10px] font-black text-slate-400 uppercase">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="mb-2 block px-1 text-[10px] font-black text-slate-400 uppercase">
                Password
              </label>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-blue-600 py-4 font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-700"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
