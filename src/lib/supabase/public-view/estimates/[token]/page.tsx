// app/public-view/estimates/[token]/page.tsx
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { CheckCircle, Building2, MapPin } from 'lucide-react';

export default async function PublicEstimatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createAdminClient();

  // Fetch the estimate and join company/customer data securely
  const { data: estimate, error } = await supabase
    .from('estimates')
    .select(
      `
      *,
      companies (name),
      customers (name, address)
    `
    )
    .eq('public_token', token)
    .single();

  if (error || !estimate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Estimate Not Found</h2>
          <p className="mt-2 text-gray-500">This link may have expired or is invalid.</p>
        </div>
      </div>
    );
  }

  // Inline Server Action to handle approval!
  async function approveEstimate() {
    'use server';
    const adminSupabase = createAdminClient();

    await adminSupabase.from('estimates').update({ status: 'approved' }).eq('public_token', token);

    // Revalidate the public page AND the contractor's dashboard
    revalidatePath(`/public-view/estimates/${token}`);
    revalidatePath('/estimates');
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Company Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {estimate.companies?.name || 'Zidro Services'}
          </h1>
          <p className="mt-2 text-gray-500">Official Service Estimate</p>
        </div>

        {/* The Quote Card */}
        <div className="overflow-hidden border border-gray-100 bg-white shadow-xl sm:rounded-2xl">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-8 sm:p-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                  Prepared For
                </p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">{estimate.customers?.name}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <MapPin className="mr-1.5 h-4 w-4" />
                  {estimate.customers?.address}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                  Total Amount
                </p>
                <p className="mt-2 text-4xl font-extrabold text-blue-600">
                  ${Number(estimate.amount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:p-10">
            <h4 className="mb-4 text-lg font-semibold text-gray-900">Job Description</h4>
            <div className="prose rounded-lg border border-gray-100 bg-gray-50 p-6 whitespace-pre-wrap text-gray-600">
              {estimate.description}
            </div>

            {/* Dynamic Status Button */}
            <div className="mt-10">
              {estimate.status === 'approved' ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                  <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
                  <h3 className="text-lg font-bold text-green-800">Estimate Approved!</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Thank you! We will be in touch shortly to schedule your service.
                  </p>
                </div>
              ) : (
                <form action={approveEstimate}>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-xl border border-transparent bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                  >
                    <CheckCircle className="mr-2 h-6 w-6" />
                    Approve Estimate
                  </button>
                  <p className="mt-4 text-center text-xs text-gray-400">
                    By clicking approve, you authorize the work described above.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400">
          Powered securely by <span className="font-semibold">Zidro</span>
        </p>
      </div>
    </div>
  );
}
