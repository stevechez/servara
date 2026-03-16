import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  Mail,
  User,
  Wrench,
  Calendar,
  CheckCircle,
  Briefcase,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { convertToJob } from '@/lib/actions/leads';
import { createClient } from '@/lib/supabase/server';
import ConvertLeadButton from '@/components/ConvertLeadButton';

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Await params (Next.js 15 requirement)
  const { id } = await params;

  // 2. Fetch the lead securely
  const supabase = await createClient();
  const { data: lead, error } = await supabase.from('leads').select('*').eq('id', id).single();

  if (error || !lead) {
    notFound();
  }

  // Bind the specific lead ID to the server action
  const convertAction = convertToJob.bind(null, lead.id);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-8">
      {/* Back Button */}
      <Link
        href="/dashboard/leads"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft size={16} /> Back to Pipeline
      </Link>
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{lead.name}</h1>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-600 uppercase">
              {lead.status}
            </span>
          </div>
          <p className="flex items-center gap-2 text-slate-500">
            <Calendar size={14} /> Added {new Date(lead.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* The Money Button */}
        {lead.status !== 'converted' ? (
          <ConvertLeadButton leadId={lead.id} />
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 font-bold text-slate-400">
            <CheckCircle size={18} />
            Already Converted
          </div>
        )}
      </div>{' '}
      {/* <-- THE FIX: This closing div was missing! */}
      {/* Info Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Info Card */}
        <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                <User size={18} className="text-slate-500" />
              </div>
              <div className="font-medium">{lead.name}</div>
            </div>

            {lead.phone && (
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                  <Phone size={18} className="text-slate-500" />
                </div>
                <div className="font-medium">{lead.phone}</div>
              </div>
            )}

            {lead.email && (
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                  <Mail size={18} className="text-slate-500" />
                </div>
                <div className="font-medium">{lead.email}</div>
              </div>
            )}
          </div>
        </Card>

        {/* Project Details Card */}
        <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">
            Project Details
          </h2>
          <div className="space-y-4">
            {lead.service_requested ? (
              <div className="flex items-start gap-3 text-slate-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <Wrench size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400">Requested Service</div>
                  <div className="mt-1 font-medium">{lead.service_requested}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400 italic">
                No specific service requested yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
