// app/(dashboard)/leads/new/page.tsx
import { createLead } from '@/lib/actions/leads';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, Briefcase } from 'lucide-react';

export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/leads"
          className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Lead</h1>
          <p className="text-sm text-gray-500">
            Enter the prospect's details to start the sales process.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <form action={createLead} className="space-y-6 p-6">
          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-sm font-semibold tracking-wider text-gray-500 uppercase">
              Contact Information
            </h3>

            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Details Section */}
          <div className="space-y-4 pt-4">
            <h3 className="border-b pb-2 text-sm font-semibold tracking-wider text-gray-500 uppercase">
              Job Details
            </h3>

            <div>
              <label
                htmlFor="service_requested"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Service Requested *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="service_requested"
                  id="service_requested"
                  required
                  className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., House Wash & Driveway"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-6">
            <Link
              href="/dashboard/leads"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
