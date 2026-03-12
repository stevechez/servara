// app/(dashboard)/estimates/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Plus, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';

export const metadata = {
  title: 'Estimates | Zidro',
};

export default async function EstimatesPage() {
  const supabase = await createClient();

  // Fetch estimates and join with the customers table to get the name
  const { data: estimates, error } = await supabase
    .from('estimates')
    .select(
      `
      *,
      customers (name)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching estimates:', error.message);
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper for Status Badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
            <Clock size={12} /> Sent
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
            <XCircle size={12} /> Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Estimates</h1>
          <p className="text-sm text-gray-500">Manage your quotes and send them to customers.</p>
        </div>
      </div>

      {/* Estimates List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {estimates && estimates.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {estimates.map((estimate) => (
              <li key={estimate.id} className="p-4 transition-colors hover:bg-gray-50 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {estimate.customers?.name || 'Unknown Customer'}
                      </h3>
                      {getStatusBadge(estimate.status)}
                    </div>
                    <p className="line-clamp-2 text-sm text-gray-600">{estimate.description}</p>
                    <div className="mt-2 text-xs text-gray-400">
                      Created on {new Date(estimate.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Price & Actions */}
                  {/* Inside app/(dashboard)/estimates/page.tsx -> replace the Price & Actions div with this */}
                  <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(estimate.amount)}
                    </span>

                    <div className="flex items-center gap-4">
                      <Link
                        href={`/public-view/estimates/${estimate.public_token}`}
                        target="_blank"
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        Link <ExternalLink size={14} className="ml-1" />
                      </Link>

                      {/* NEW SCHEDULE BUTTON */}
                      {estimate.status === 'approved' && (
                        <Link
                          href={`/jobs/new?estimate_id=${estimate.id}`}
                          className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                        >
                          Schedule Job
                        </Link>
                      )}
                    </div>
                  </div>
                  <div>
                    {/* Public View Link */}
                    <Link
                      href={`/public-view/estimates/${estimate.public_token}`}
                      target="_blank"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View Public Link <ExternalLink size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          /* Empty State */
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No estimates</h3>
            <p className="mt-1 text-sm text-gray-500">
              Convert a lead from your pipeline to create your first estimate.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/leads"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Go to Leads
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
