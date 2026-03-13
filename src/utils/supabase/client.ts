import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // We use the "!" at the end to promise TypeScript that these environment
  // variables will definitely exist when the app runs.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
