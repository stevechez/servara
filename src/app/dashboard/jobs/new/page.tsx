// app/(dashboard)/jobs/new/page.tsx
import { createClient } from '@/lib/supabase/server';
import { approveEstimateAndCreateJob } from '@/lib/actions/jobs';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ estimate_id?: string }>;
}) {
  const { estimate_id } = await searchParams;

  if (!estimate_id) {
    redirect('/estimates');
  }

  const supabase = await createClient();
  const { data: estimate } = await supabase
    .from('estimates')
    .select('*, customers(name, address)')
    .eq('id', estimate_id)
    .single();

  if (!estimate) return <div>Estimate not found</div>;

  // THE FIX: Bind the ID to the action just like we did on the detail page
  const boundAction = approveEstimateAndCreateJob.bind(null, estimate_id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/estimates" className="rounded-md p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Job</h1>
          <p className="text-sm text-gray-500">Book {estimate.customers?.name} on the calendar.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <h3 className="mb-2 border-b border-blue-200 pb-2 text-sm font-semibold text-blue-900">
            Approved Estimate Details
          </h3>
          <p className="text-sm font-medium text-blue-800">{estimate.customers?.address}</p>
          <p className="mt-1 text-sm text-blue-700">{estimate.description}</p>
          <p className="mt-2 text-sm font-bold text-blue-900">
            Total: ${Number(estimate.amount).toFixed(2)}
          </p>
        </div>

        {/* Use the boundAction here */}
        <form action={boundAction} className="space-y-6">
          <div>
            <label htmlFor="scheduled_at" className="mb-1 block text-sm font-medium text-gray-700">
              Scheduled Date & Time *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                name="scheduled_at"
                id="scheduled_at"
                required
                className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
              Internal Notes (Optional)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute top-3 left-3">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="notes"
                id="notes"
                rows={3}
                className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Gate code, etc..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Confirm & Add to Calendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
