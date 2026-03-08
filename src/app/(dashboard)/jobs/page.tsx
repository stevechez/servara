// app/(dashboard)/jobs/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Briefcase, ChevronRight, DollarSign, Calendar } from 'lucide-react'

export const revalidate = 0 // Forces the page to fetch fresh data every time

export default async function JobsListPage() {
  const supabase = await createClient()

  // 1. Fetch all jobs and grab the associated customer's name
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      status,
      amount,
      created_at,
      customers ( name )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl">
        Failed to load jobs: {error.message}
      </div>
    )
  }

  // 2. Calculate quick metrics (Total Pipeline Revenue)
  const totalRevenue = jobs?.reduce((sum, job) => sum + (Number(job.amount) || 0), 0) || 0;
  const activeJobsCount = jobs?.length || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* HEADER & METRICS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Briefcase className="text-blue-600" size={32} />
            Jobs Pipeline
          </h1>
          <p className="text-gray-500 mt-1">Manage and track your active service projects.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white border border-gray-200 px-6 py-3 rounded-xl shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{activeJobsCount}</p>
          </div>
          <div className="bg-white border border-gray-200 px-6 py-3 rounded-xl shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pipeline Value</p>
            <p className="text-2xl font-bold text-green-600 flex items-center">
              <DollarSign size={20} strokeWidth={3} />
              {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* JOBS TABLE */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {jobs && jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-4 pl-6">Job Details</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 pr-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => {
                  // Handle Supabase array-vs-object relationship return
                  const customersData = job.customers as any;
                  const customerName = Array.isArray(customersData) 
                    ? customersData[0]?.name 
                    : customersData?.name;

                  return (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-gray-900">{job.title || 'Service Job'}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-gray-700">{customerName || 'Unknown Client'}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                          {job.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ${Number(job.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <Link 
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center justify-center p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Briefcase size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No active jobs yet</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              When you approve an estimate, the scheduled job will automatically appear right here.
            </p>
            <Link href="/leads" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
              Go convert a Lead
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}