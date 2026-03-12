// src/lib/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// export async function login(formData: FormData) {
//   const supabase = await createClient()
  
//   const email = formData.get('email') as string
//   const password = formData.get('password') as string

//   if (!email || !password) {
//     throw new Error("Email and password are required")
//   }

//   const { error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   })

//   if (error) {
//     throw new Error(`Login failed: ${error.message}`)
//   }

//   // If successful, send them to the dashboard!
//   redirect('/')
// }

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // FIX: Don't redirect from the server, just tell the client it worked!
  return { success: true };
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function signOut() {
  const supabase = await createClient();
  
  // Tell Supabase to destroy the active session
  await supabase.auth.signOut();
  
  // Kick them back out to the front door
  redirect('/login');
}