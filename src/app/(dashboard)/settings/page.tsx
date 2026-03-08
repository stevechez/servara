'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Building, User, Mail, Lock, CreditCard, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [fullName, setFullName] = useState('');

  // Fetch the user's current data when the page loads
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        setBusinessName(user.user_metadata?.business_name || '');
        setFullName(user.user_metadata?.full_name || '');
      }
      setLoading(false);
    }
    loadUser();
  }, [supabase.auth]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    // Update the user's custom metadata in Supabase
    const { error } = await supabase.auth.updateUser({
      data: {
        business_name: businessName,
        full_name: fullName,
      }
    });

    if (!error) {
      setSuccess(true);
      router.refresh();
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert("Failed to update profile: " + error.message);
    }
    
    setSaving(false);
  };

  const handlePasswordReset = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (!error) {
      alert("Password reset link sent to your email!");
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500 font-medium animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 md:pb-8">
      
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic dark:text-white">SETTINGS</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage your account and workspace preferences.</p>
        </div>
      </header>

      <div className="space-y-6">
        
        {/* 1. PROFILE & BUSINESS DETAILS */}
        <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-black dark:text-white tracking-tight uppercase">Workspace Profile</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Update your business info and personal details.</p>
          </div>
          
          <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
            
            {success && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Profile updated successfully!</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                  <Building size={12} /> Business Name
                </label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Thorne Plumbing"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                  <User size={12} /> Your Full Name
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-2 px-1">
                  <Mail size={12} /> Email Address (Cannot be changed here)
                </label>
                <input 
                  disabled
                  type="email" 
                  value={email}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-500 outline-none cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={saving}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-slate-900 dark:hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* 2. SECURITY & BILLING (Mocked layout for future Stripe integration) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Billing Card */}
          <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-500/20">
                <CreditCard size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-black dark:text-white mb-2">Subscription</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">You are currently on the <strong className="text-slate-900 dark:text-white">Free Trial</strong> plan. Upgrade to unlock SMS dispatching.</p>
            </div>
            <button className="w-full py-4 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
              Manage Billing
            </button>
          </div>

          {/* Security Card */}
          <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-100 dark:border-rose-500/20">
                <Lock size={20} className="text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-lg font-black dark:text-white mb-2">Security</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Need to update your credentials? Send a secure reset link to your email.</p>
            </div>
            <button 
              onClick={handlePasswordReset}
              className="w-full py-4 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
            >
              Reset Password
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}