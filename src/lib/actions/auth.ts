'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function handleAuth(formData: FormData, mode: 'login' | 'signup') {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (mode === 'login') {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  } else {
    // 1. Sign up the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw new Error(error.message);

    // 2. Create the profile row immediately
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: 'New Contractor',
        sms_limit: 100,
        sms_usage: 0,
        updated_at: new Date().toISOString(),
      });
    }
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
