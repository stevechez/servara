'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Redirect to dashboard on success
      router.push('/dashboard');
      router.refresh(); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050608] p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#0B0E14] rounded-[2.5rem] p-10 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="mb-8">
          <h2 className="text-2xl font-black dark:text-white tracking-tight italic">Login to Servara</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Welcome back, Captain.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl">
              <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1">Email Address</label>
            <input 
  required
  type="email" 
  value={email}
  onChange={(e) => setEmail(e.target.value)} // <-- Removed the stray 'Z' here
  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
  placeholder="name@company.com"
/>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-slate-900 dark:hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
          
          <Link 
            href="/forgot-password" 
            className="block text-xs text-slate-400 font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}