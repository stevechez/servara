import { createClient } from '@/lib/supabase/server';
import CatalogEmptyState from './CatalogEmptyState';
import { BookOpen } from 'lucide-react';
import AddServiceTrigger from '@/components/v2/AddServiceTrigger';

export default async function ServiceCatalogPage() {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ONLY fetch services belonging to this user
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', user?.id)
    .order('name', { ascending: true });

  const hasServices = services && services.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black uppercase italic dark:text-white">
            <BookOpen className="text-blue-600" size={32} />
            Service Catalog
          </h1>
          <p className="mt-1 text-sm font-bold tracking-tight text-slate-500 uppercase">
            Standardize your pricing & offerings
          </p>
        </div>

        {/* Modal Button - Ensured userId is passed correctly */}
        {user?.id && <AddServiceTrigger userId={user.id} />}
      </div>

      {/* Main Content */}
      {!hasServices ? (
        <CatalogEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:border-blue-500/30 hover:shadow-xl dark:border-white/5 dark:bg-[#12161D]"
            >
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                {service.name}
              </h3>
              <p className="mt-2 text-2xl font-black text-blue-600">${service.price}</p>

              <div className="mt-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                <span>Flat Rate Pricing</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
