import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ArrowLeft, Phone, Mail, MapPin, Briefcase, Plus, Home, Ruler, Car, Sparkles, Check, X } from 'lucide-react';
import MembershipCard from '@/components/v2/MembershipCard';

export const revalidate = 0;

export default async function CustomerDetailPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ edit?: string }>
}) {
  const supabase = await createClient();
  const { id: customerId } = await params;
  const resolvedSearchParams = await searchParams;
  const isEditingProperty = resolvedSearchParams?.edit === 'property';

  // 1. FETCH CUSTOMER + JOBS + MEMBERSHIPS + PROPERTIES
  const { data: customer, error } = await supabase
    .from('customers')
    .select(`
      *,
      jobs (*),
      memberships (*),
      properties (*)
    `)
    .eq('id', customerId)
    .single();

  if (error || !customer) {
    console.error("Error fetching customer:", error);
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
      console.error("Failed to create job", jobError);
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
      lot_size: 6500
    });
    revalidatePath(`/dashboard/customers/${customerId}`);
  }

  // NEW: Update existing property data safely
  async function updatePropertyProfile(formData: FormData) {
    'use server';
    
    const propertyId = formData.get('property_id') as string;
    if (!propertyId) return; // Failsafe

    const supabaseServer = await createClient();
    
    await supabaseServer.from('properties')
      .update({
        square_feet: parseInt(formData.get('square_feet') as string) || 0,
        driveway_type: formData.get('driveway_type') as string,
        roof_type: formData.get('roof_type') as string,
      })
      .eq('id', propertyId); // Use the safely extracted ID

    // Redirect to clear the ?edit=property from the URL
    redirect(`/dashboard/customers/${customerId}`);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* HEADER */}
      <div>
        <Link href="/dashboard/customers" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 flex items-center gap-2 mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to Customers
        </Link>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {customer.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Contact & History */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-[32px] p-8 shadow-sm">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Contact Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-medium">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg"><Phone size={16} /></div>
                {customer.phone || 'No phone number provided'}
              </div>
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-medium">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg"><Mail size={16} /></div>
                {customer.email || 'No email provided'}
              </div>
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-medium">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg"><MapPin size={16} /></div>
                {customer.address || 'No service address provided'}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Service History</h2>
              <form action={createQuickJob}>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-blue-500/20">
                  <Plus size={16} /> Schedule Job
                </button>
              </form>
            </div>
            
            {customer.jobs && customer.jobs.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {customer.jobs.map((job: any) => (
                  <Link href={`/dashboard/jobs/${job.id}`} key={job.id} className="py-4 flex justify-between items-center group hover:bg-slate-50 dark:hover:bg-white/5 -mx-4 px-4 rounded-2xl transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors">
                        <Briefcase size={16} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {job.service_type || 'General Service'}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-500">
                      {job.status?.replace('_', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
                <p className="text-sm text-slate-500 font-medium">No jobs recorded for this customer yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Intelligence & Monetization */}
        <div className="space-y-6">
          
          <div className="bg-slate-900 dark:bg-[#12161D] border border-slate-800 dark:border-white/5 rounded-[32px] p-8 shadow-xl text-white relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Home size={100} />
            </div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-400" size={18} />
                <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">Property Intel</h2>
              </div>
            </div>

            {property ? (
              isEditingProperty ? (
                // EDIT MODE
                <form action={updatePropertyProfile} className="relative z-10 space-y-4">
                  <input type="hidden" name="property_id" value={property.id} />
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Square Footage</label>
                    <input type="number" name="square_feet" defaultValue={property.square_feet} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Driveway Material</label>
                    <input type="text" name="driveway_type" defaultValue={property.driveway_type} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roof Type</label>
                    <input type="text" name="roof_type" defaultValue={property.roof_type} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                      <Check size={16} /> Save
                    </button>
                    <Link href={`/dashboard/customers/${customerId}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                      <X size={16} /> Cancel
                    </Link>
                  </div>
                </form>
              ) : (
                // VIEW MODE
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-sm font-medium text-slate-400 flex items-center gap-2"><Ruler size={14}/> Home Size</span>
                    <span className="font-bold">{property.square_feet?.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-sm font-medium text-slate-400 flex items-center gap-2"><Car size={14}/> Driveway</span>
                    <span className="font-bold">{property.driveway_type}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-sm font-medium text-slate-400 flex items-center gap-2"><Home size={14}/> Roof</span>
                    <span className="font-bold">{property.roof_type}</span>
                  </div>
                  
                  <div className="pt-4">
                    {/* The Edit Button transforms into a Link that triggers edit mode */}
                    <Link href={`/dashboard/customers/${customerId}?edit=property`} className="w-full block text-center py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                      Edit Property Data
                    </Link>
                  </div>
                </div>
              )
            ) : (
              <div className="relative z-10">
                <p className="text-sm text-slate-400 font-medium mb-6">
                  No property data exists. Initialize this profile to unlock AI Quoting and Neighborhood Blitz campaigns.
                </p>
                <form action={initializePropertyProfile}>
                  <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                    Initialize Profile
                  </button>
                </form>
              </div>
            )}
          </div>

          <MembershipCard 
            customerId={customer.id} 
            membership={customer.memberships?.[0]} 
          />
        </div>

      </div>
    </div>
  );
}