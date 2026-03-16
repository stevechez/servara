import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Plus,
  Home,
  Ruler,
  Car,
  Sparkles,
  Check,
  X,
} from 'lucide-react';

// --- IMPORT YOUR COMPONENTS ---
import CustomerInfoHeader from '@/components/v2/CustomerInfoHeader'; // <-- Added missing import
import MembershipCard from '@/components/v2/MembershipCard';
import CustomerTimeline from '@/components/v2/CustomerTimeline';

export const revalidate = 0;

export default async function CustomerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const supabase = await createClient();
  const { id: customerId } = await params;
  const resolvedSearchParams = await searchParams;
  const isEditingProperty = resolvedSearchParams?.edit === 'property';

  // 1. FETCH CUSTOMER + JOBS + MEMBERSHIPS + PROPERTIES
  const { data: customer, error } = await supabase
    .from('customers')
    .select(
      `
      *,
      jobs (*),
      memberships (*),
      properties (*)
    `
    )
    .eq('id', customerId)
    .single();

  if (error || !customer) {
    console.error('Error fetching customer:', error);
    return <div className="p-20 text-center font-black text-red-500">Customer not found.</div>;
  }

  const property = customer.properties?.[0];

  // --- SERVER ACTIONS ---

  async function createQuickJob() {
    'use server';
    const supabaseServer = await createClient();

    const { data: newJob, error: jobError } = await supabaseServer
      .from('jobs')
      .insert({
        customer_id: customerId,
        service_type: 'Standard Service Call',
        status: 'scheduled',
        scheduled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (newJob) {
      redirect(`/dashboard/jobs/${newJob.id}`);
    } else {
      console.error('Failed to create job', jobError);
    }
  }

  async function initializePropertyProfile() {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.from('properties').insert({
      customer_id: customerId,
      address: customer.address || 'Unknown Address',
      square_feet: 2400,
      driveway_type: 'Concrete',
      roof_type: 'Asphalt Shingle',
      lot_size: 6500,
    });
    revalidatePath(`/dashboard/customers/${customerId}`);
  }

  // Update existing property data safely
  async function updatePropertyProfile(formData: FormData) {
    'use server';

    const propertyId = formData.get('property_id') as string;
    if (!propertyId) return; // Failsafe

    const supabaseServer = await createClient();

    await supabaseServer
      .from('properties')
      .update({
        square_feet: parseInt(formData.get('square_feet') as string) || 0,
        driveway_type: formData.get('driveway_type') as string,
        roof_type: formData.get('roof_type') as string,
      })
      .eq('id', propertyId);

    // Redirect to clear the ?edit=property from the URL
    redirect(`/dashboard/customers/${customerId}`);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8 pb-20">
      {/* 1. CUSTOMER INFO HEADER */}
      <CustomerInfoHeader customer={customer} />

      {/* 2. THE NEW TIMELINE (Sits right in the middle, highly visible) */}
      <CustomerTimeline customerId={customer.id} />

      {/* 3. DETAILS GRID */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Contact & History */}
        <div className="space-y-8 lg:col-span-2">
          {/* Contact Details Card */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0B0E14]">
            <h2 className="mb-6 text-xs font-black tracking-widest text-slate-400 uppercase">
              Contact Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 font-medium text-slate-600 dark:text-slate-300">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10">
                  <Phone size={16} />
                </div>
                {customer.phone || 'No phone number provided'}
              </div>
              <div className="flex items-center gap-4 font-medium text-slate-600 dark:text-slate-300">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10">
                  <Mail size={16} />
                </div>
                {customer.email || 'No email provided'}
              </div>
              <div className="flex items-center gap-4 font-medium text-slate-600 dark:text-slate-300">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10">
                  <MapPin size={16} />
                </div>
                {customer.address || 'No service address provided'}
              </div>
            </div>
          </div>

          {/* Service History Card */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0B0E14]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase">
                Service History
              </h2>
              <form action={createQuickJob}>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black tracking-widest text-white uppercase shadow-md shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-95"
                >
                  <Plus size={16} /> Schedule Job
                </button>
              </form>
            </div>

            {customer.jobs && customer.jobs.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {customer.jobs.map((job: any) => (
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    key={job.id}
                    className="group -mx-4 flex items-center justify-between rounded-2xl px-4 py-4 transition-all hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-slate-100 p-2 text-slate-400 transition-colors group-hover:text-blue-600 dark:bg-white/5">
                        <Briefcase size={16} />
                      </div>
                      <span className="font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
                        {job.service_type || 'General Service'}
                      </span>
                    </div>
                    <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-[10px] font-black tracking-widest text-slate-500 uppercase dark:bg-white/5">
                      {job.status?.replace('_', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-10 text-center dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-medium text-slate-500">
                  No jobs recorded for this customer yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Intelligence & Monetization */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900 p-8 text-white shadow-xl transition-all duration-300 dark:border-white/5 dark:bg-[#12161D]">
            <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-10">
              <Home size={100} />
            </div>

            <div className="relative z-10 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-400" size={18} />
                <h2 className="text-xs font-black tracking-widest text-slate-300 uppercase">
                  Property Intel
                </h2>
              </div>
            </div>

            {property ? (
              isEditingProperty ? (
                // EDIT MODE
                <form action={updatePropertyProfile} className="relative z-10 space-y-4">
                  <input type="hidden" name="property_id" value={property.id} />
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Square Footage
                    </label>
                    <input
                      type="number"
                      name="square_feet"
                      defaultValue={property.square_feet}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Driveway Material
                    </label>
                    <input
                      type="text"
                      name="driveway_type"
                      defaultValue={property.driveway_type}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Roof Type
                    </label>
                    <input
                      type="text"
                      name="roof_type"
                      defaultValue={property.roof_type}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-95"
                    >
                      <Check size={16} /> Save
                    </button>
                    <Link
                      href={`/dashboard/customers/${customerId}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-xs font-black tracking-widest text-white uppercase transition-colors hover:bg-white/20"
                    >
                      <X size={16} /> Cancel
                    </Link>
                  </div>
                </form>
              ) : (
                // VIEW MODE
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
                      <Ruler size={14} /> Home Size
                    </span>
                    <span className="font-bold">{property.square_feet?.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
                      <Car size={14} /> Driveway
                    </span>
                    <span className="font-bold">{property.driveway_type}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
                      <Home size={14} /> Roof
                    </span>
                    <span className="font-bold">{property.roof_type}</span>
                  </div>

                  <div className="pt-4">
                    {/* The Edit Button transforms into a Link that triggers edit mode */}
                    <Link
                      href={`/dashboard/customers/${customerId}?edit=property`}
                      className="block w-full rounded-xl bg-white/10 py-3 text-center text-xs font-black tracking-widest text-white uppercase transition-colors hover:bg-white/20"
                    >
                      Edit Property Data
                    </Link>
                  </div>
                </div>
              )
            ) : (
              <div className="relative z-10">
                <p className="mb-6 text-sm font-medium text-slate-400">
                  No property data exists. Initialize this profile to unlock AI Quoting and
                  Neighborhood Blitz campaigns.
                </p>
                <form action={initializePropertyProfile}>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-95"
                  >
                    Initialize Profile
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Fallback check in case MembershipCard isn't ready or empty */}
          {customer.memberships && customer.memberships.length > 0 && (
            <MembershipCard customerId={customer.id} membership={customer.memberships[0]} />
          )}
        </div>
      </div>
    </div>
  );
}
