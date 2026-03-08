'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Because the user clicked a secure link in their email, 
    // Supabase already knows who they are for this session.
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      
      // Automatically redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050608] p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#0B0E14] rounded-[2.5rem] p-10 shadow-xl border border-slate-200 dark:border-slate-800">
        
        <div className="mb-8">
          <h2 className="text-2xl font-black dark:text-white tracking-tight italic">Secure Account</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl">
              ✓
            </div>
            <h3 className="font-black text-emerald-800 dark:text-emerald-400 text-lg">Password Updated</h3>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
              Your password has been changed successfully. Redirecting you to the Command Center...
            </p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl">
                <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 px-1">New Password</label>
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
              {loading ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        )}
        
      </div>
    </div>
  );
}