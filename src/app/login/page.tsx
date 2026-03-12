'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { signInWithEmail } from '@/lib/actions/auth'; // <-- Re-added import!

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // <-- Re-added state!
  const [errorMsg, setErrorMsg] = useState(''); // <-- Re-added state!

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(''); // Clear previous errors

    // Call our Supabase Server Action
    const result = await signInWithEmail(email, password);

    // If there's an error, stop loading and show the message
    if (result?.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    } else {
      // SUCCESS! Teleport them from the client side
      router.push('/dashboard');
    }
  };

  return (
    // The Background: Dark slate with subtle, glowing gradient orbs
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 dark:bg-[#0B0E14]">
      {/* Decorative Background Blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/20 blur-[120px] dark:bg-blue-600/20" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/20 blur-[120px] dark:bg-emerald-600/20" />

      {/* The Glass Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Area */}
        <div className="animate-in slide-in-from-bottom-4 mb-8 text-center duration-500">
          <div className="shadow-float mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-blue-500/30">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Zidro
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Field Service Command Center
          </p>
        </div>

        {/* Login Form */}
        <div className="shadow-float animate-in slide-in-from-bottom-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 delay-150 duration-700 dark:border-white/5 dark:bg-[#12161D]">
          {/* Re-added: Error Message Banner */}
          {errorMsg && (
            <div className="animate-in fade-in zoom-in mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 duration-300 dark:border-rose-500/20 dark:bg-rose-500/10">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-500" />
              <p className="text-xs leading-relaxed font-bold text-rose-600 dark:text-rose-400">
                {errorMsg}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Work Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-4 pl-11 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none dark:border-white/10 dark:bg-[#0B0E14] dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="ml-1 flex items-center justify-between">
                <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Password
                </label>
                <a href="#" className="text-[10px] font-bold text-blue-500 hover:text-blue-600">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password} // <-- Re-added wiring!
                  onChange={(e) => setPassword(e.target.value)} // <-- Re-added wiring!
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pr-4 pl-11 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none dark:border-white/10 dark:bg-[#0B0E14] dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-xs font-black tracking-widest text-white uppercase shadow-md shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Optional: Magic Link / Google Sign in divider */}
          <div className="mt-8 border-t border-slate-100 pt-6 text-center dark:border-white/5">
            <p className="text-xs font-medium text-slate-500">
              Don't have an account?{' '}
              <a href="#" className="font-bold text-blue-500 hover:text-blue-600">
                Request Access
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
