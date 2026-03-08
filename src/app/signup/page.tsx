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
        }
      }
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050608] p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#0B0E14] rounded-[2.5rem] p-10 shadow-xl border border-slate-200 dark:border-slate-800">
        
        <div className="mb-8">
          <h2 className="text-2xl font-black dark:text-white tracking-tight italic">Join Servara</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Start your AI-powered office today.</p>
        </div>

        {success ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl">
              ✓
            </div>
            <h3 className="font-black text-emerald-800 dark:text-emerald-400 text-lg">Check your email!</h3>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl">
                <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1">Business Name</label>
              <input 
                required
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="Thorne Plumbing Co."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1">Email Address</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1">Password</label>
              <input 
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-slate-900 dark:hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 mt-2"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}