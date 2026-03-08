'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Supabase will send an email with a secure reset link.
    // The redirectTo parameter tells Supabase where to send them AFTER they click the link in their email.
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050608] p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#0B0E14] rounded-[2.5rem] p-10 shadow-xl border border-slate-200 dark:border-slate-800">
        
        <div className="mb-8">
          <h2 className="text-2xl font-black dark:text-white tracking-tight italic">Reset Password</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Enter your email and we'll send you a recovery link.
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl">
              ✓
            </div>
            <h3 className="font-black text-emerald-800 dark:text-emerald-400 text-lg">Email Sent</h3>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
              If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
            </p>
            <div className="pt-4">
               <Link href="/login" className="text-sm font-bold text-blue-600 hover:underline">
                 Return to Login
               </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="name@company.com"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-slate-900 dark:hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 mt-2"
            >
              {loading ? 'Sending Link...' : 'Send Recovery Link'}
            </button>
          </form>
        )}
        
        {!success && (
          <div className="mt-8 text-center">
            <Link 
              href="/login" 
              className="text-xs text-slate-400 font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        )}
        
      </div>
    </div>
  );
}