import { createClient } from '@/lib/supabase/server';
import CustomerListClient from '@/components/v2/CustomerListClient';

export const revalidate = 0;

export default async function CustomersPage() {
  const supabase = await createClient();
  
  // Fetch ALL customers for the list view
  const { data: customers, error } = await supabase
    .from('customers')
    .select(`
      *,
      jobs (id)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching customers:", error);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <CustomerListClient customers={customers || []} />
    </div>
  );
}