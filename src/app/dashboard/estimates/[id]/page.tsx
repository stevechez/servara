// app/(dashboard)/estimates/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle, FileText, User, MapPin } from 'lucide-react';
// This function must accept (id: string) in your actions file
import { approveEstimateAndCreateJob } from '@/lib/actions/jobs';

export default async function EstimateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();

  // 1. Unwrapping the ID
  const resolvedParams = await params;
  const estimateId = resolvedParams.id;

  // 2. THE FIX: Bind the ID to the action
  // This creates a new function that already knows which ID to use
  const boundApprove = approveEstimateAndCreateJob.bind(null, estimateId);

  // 3. Fetch the estimate
  const { data: estimate, error } = await supabase
    .from('estimates')
    .select(
      `
      id,
      amount,
      status,
      service_type,
      created_at,
      customers ( name, email, phone, address )
    `
    )
    .eq('id', estimateId)
    .single();

  if (error || !estimate) {
    return <div className="p-8 text-red-600">Estimate not found.</div>;
  }

  const customer = Array.isArray(estimate.customers) ? estimate.customers[0] : estimate.customers;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link href="/estimates" className="mb-2 flex items-center gap-1 text-sm text-gray-500">
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="text-2xl font-bold uppercase italic">Estimate Summary</h1>
        </div>

        <div className="flex gap-3">
          {/* THE FORM: Uses the bound action */}
          <form action={boundApprove}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-black text-white uppercase italic shadow-lg hover:bg-emerald-700"
            >
              <CheckCircle size={18} />
              Approve & Schedule
            </button>
          </form>
        </div>
      </div>

      {/* DOCUMENT PREVIEW ... rest of your UI */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <h2 className="text-3xl font-light">${Number(estimate.amount).toLocaleString()}</h2>
        <p className="text-gray-500">
          {customer?.name} — {estimate.service_type}
        </p>
      </div>
    </div>
  );
}
