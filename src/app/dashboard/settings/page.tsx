import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch their profile (it's okay if it doesn't exist yet)
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Workspace Settings
        </h1>
        <p className="mt-1 text-slate-500">Manage your profile and business details.</p>
      </div>

      {/* Hand the data over to the Client Form! */}
      <SettingsForm initialProfile={profile} />
    </div>
  );
}
