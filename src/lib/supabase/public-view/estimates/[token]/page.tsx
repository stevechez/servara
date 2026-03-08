// app/public-view/estimates/[token]/page.tsx
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { CheckCircle, Building2, MapPin } from 'lucide-react'

export default async function PublicEstimatePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = createAdminClient()

  // Fetch the estimate and join company/customer data securely
  const { data: estimate, error } = await supabase
    .from('estimates')
    .select(`
      *,
      companies (name),
      customers (name, address)
    `)
    .eq('public_token', token)
    .single()

  if (error || !estimate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900">Estimate Not Found</h2>
          <p className="text-gray-500 mt-2">This link may have expired or is invalid.</p>
        </div>
      </div>
    )
  }

  // Inline Server Action to handle approval!
  async function approveEstimate() {
    'use server'
    const adminSupabase = createAdminClient()
    
    await adminSupabase
      .from('estimates')
      .update({ status: 'approved' })
      .eq('public_token', token)

    // Revalidate the public page AND the contractor's dashboard
    revalidatePath(`/public-view/estimates/${token}`)
    revalidatePath('/estimates')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Company Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {estimate.companies?.name || 'Servara Services'}
          </h1>
          <p className="text-gray-500 mt-2">Official Service Estimate</p>
        </div>

        {/* The Quote Card */}
        <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100">
          <div className="px-6 py-8 sm:p-10 border-b border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Prepared For</p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">{estimate.customers?.name}</h3>
                <div className="mt-1 flex items-center text-gray-500 text-sm">
                  <MapPin className="mr-1.5 h-4 w-4" />
                  {estimate.customers?.address}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Total Amount</p>
                <p className="mt-2 text-4xl font-extrabold text-blue-600">
                  ${Number(estimate.amount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:p-10">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h4>
            <div className="prose text-gray-600 bg-gray-50 p-6 rounded-lg whitespace-pre-wrap border border-gray-100">
              {estimate.description}
            </div>

            {/* Dynamic Status Button */}
            <div className="mt-10">
              {estimate.status === 'approved' ? (
                <div className="rounded-xl bg-green-50 p-6 border border-green-200 text-center">
                  <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
                  <h3 className="text-lg font-bold text-green-800">Estimate Approved!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Thank you! We will be in touch shortly to schedule your service.
                  </p>
                </div>
              ) : (
                <form action={approveEstimate}>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <CheckCircle className="mr-2 h-6 w-6" />
                    Approve Estimate
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    By clicking approve, you authorize the work described above.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400">
          Powered securely by <span className="font-semibold">Servara</span>
        </p>
      </div>
    </div>
  )
}