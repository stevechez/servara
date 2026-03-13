'use client';

import { useState } from 'react';
import { User, Building, Save, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { updateProfile } from '@/lib/actions/settings';

export default function SettingsForm({ initialProfile }: { initialProfile: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 1. STATE: This forces the text to stay in the boxes after submit!
  const [fullName, setFullName] = useState(initialProfile?.full_name || '');
  const [businessName, setBusinessName] = useState(initialProfile?.business_name || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from refreshing!
    setIsSaving(true);
    setShowToast(false);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('businessName', businessName);

      await updateProfile(formData);

      // 2. TOAST: Trigger the success popup
      setShowToast(true);

      // Auto-hide the toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    } catch (error: any) {
      // Now it will actually tell you WHAT failed!
      alert(`Failed to save: ${error.message}`);
    } finally {
      // THE FIX: Properly close the finally block and reset the saving state
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* THE TOAST POPUP */}
      {showToast && (
        <div className="animate-in slide-in-from-bottom-5 fixed right-6 bottom-6 z-[100] flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-white shadow-2xl dark:bg-white dark:text-slate-900">
          <CheckCircle2 size={20} className="text-green-400 dark:text-green-500" />
          <p className="text-sm font-bold">Your information was successfully submitted!</p>
        </div>
      )}

      <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#12161D]">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/20">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Full Name Input */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <User size={16} className="text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Steve Macias"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-[#0B0E14] dark:text-white"
              />
            </div>

            {/* Business Name Input */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Building size={16} className="text-slate-400" /> Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Zidro Services LLC"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-[#0B0E14] dark:text-white"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}
