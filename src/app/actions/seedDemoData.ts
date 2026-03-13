'use server';

import { createClient } from '@/lib/supabase/server'; // Adjust path to your server client
import { revalidatePath } from 'next/cache';

export async function seedDemoData() {
  const supabase = await createClient();
  // 1. Get the current logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  // 2. The Fake Leads (High Intent & General)
  const demoLeads = [
    {
      user_id: user.id,
      name: 'Michael Chen',
      email: 'm.chen@example.com',
      phone: '555-0101',
      service_type: 'Emergency Repair',
      status: 'new',
    },
    {
      user_id: user.id,
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '555-0102',
      service_type: 'Full Inspection',
      status: 'new',
    },
    {
      user_id: user.id,
      name: 'David Rodriguez',
      email: 'drod@example.com',
      phone: '555-0103',
      service_type: 'Maintenance',
      status: 'contacted',
    },
    {
      user_id: user.id,
      name: 'Emily Carter',
      email: 'emily.c@example.com',
      service_type: 'Quote Request',
      status: 'new',
    }, // No phone (Not a "Hot" lead)
  ];

  // 3. Insert the Leads
  const { error: leadsError } = await supabase.from('leads').insert(demoLeads);

  if (leadsError) {
    console.error('Seed Error:', leadsError);
    return { success: false, error: leadsError.message };
  }

  // 4. Force the dashboard to refresh and show the new data
  revalidatePath('/dashboard');

  return { success: true };
}
