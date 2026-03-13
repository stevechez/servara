import { createClient } from '@/lib/supabase/server';
import CatalogEmptyState from './CatalogEmptyState';
import { Plus, BookOpen } from 'lucide-react';

export default async function ServiceCatalogPage() {
  const supabase = await createClient();

  // Fetch real services from the 'services' table
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('name', { ascending: true });

  const hasServices = services && services.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-black uppercase italic dark:text-white">
            <BookOpen className="text-blue-600" size={24} />
            Service Catalog
          </h1>
          <p className="mt-1 text-xs font-bold tracking-widest text-slate-500 uppercase">
            Standardize your pricing & offerings
          </p>
        </div>

        {hasServices && (
          <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700">
            <Plus size={18} />
            ADD SERVICE
          </button>
        )}
      </div>

      {/* Main Content */}
      {!hasServices ? (
        <CatalogEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Real Service Cards will map here */}
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-white/5 dark:bg-[#12161D]"
            >
              <h3 className="font-bold dark:text-white">{service.name}</h3>
              <p className="mt-2 font-black text-blue-500">${service.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
