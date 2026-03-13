'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function handleAuth(formData: FormData, mode: 'login' | 'signup') {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (mode === 'login') {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  } else {
    // 1. Sign up the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);

    // 2. IMPORTANT: Create the empty profile immediately so the dashboard works
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: 'New Contractor', // Temporary placeholder
        sms_limit: 100,
        sms_usage: 0,
      });
    }
  }

  redirect('/dashboard');
}
