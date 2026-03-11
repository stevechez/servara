'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Folder, Wrench, Clock, X, Layers, Trash2 } from 'lucide-react';

export default function PricebookManager() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Tier Builder State
  const [activeService, setActiveService] = useState<any>(null); // The service currently being tiered
  const [tierName, setTierName] = useState('Good');
  const [tierPrice, setTierPrice] = useState('');

  // Form State
  const [catName, setCatName] = useState('');
  const [srvName, setSrvName] = useState('');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvPrice, setSrvPrice] = useState('');
  const [srvDuration, setSrvDuration] = useState('60');
  const [selectedCatId, setSelectedCatId] = useState('');

  // Fetch Data (Now pulling pricebook_options too!)
  const fetchData = async () => {
    setLoading(true);
    const { data: catData } = await supabase.from('pricebook_categories').select('*').order('name');
    
    // Notice we are fetching the related options in this query
    const { data: srvData } = await supabase
      .from('pricebook_services')
      .select('*, pricebook_categories(name), pricebook_options(*)')
      .order('name');
    
    if (catData) setCategories(catData);
    if (srvData) setServices(srvData);
    
    if (catData && catData.length > 0 && !selectedCatId) {
      setSelectedCatId(catData[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Base Services & Categories
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from('pricebook_categories').insert([{ name: catName, user_id: user.user?.id }]);
    if (!error) { setCatName(''); setShowAddForm(false); fetchData(); }
    setIsSubmitting(false);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from('pricebook_services').insert([{ 
      name: srvName, description: srvDesc, base_price: parseFloat(srvPrice) || 0,
      duration_minutes: parseInt(srvDuration) || 60, category_id: selectedCatId, user_id: user.user?.id
    }]);
    if (!error) {
      setSrvName(''); setSrvDesc(''); setSrvPrice(''); setSrvDuration('60');
      setShowAddForm(false); fetchData();
    }
    setIsSubmitting(false);
  };

  // Handlers for Tiers (Good/Better/Best)
  const handleAddTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService || !tierName || !tierPrice) return;
    setIsSubmitting(true);
    
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from('pricebook_options').insert([{
      service_id: activeService.id,
      tier_name: tierName,
      price: parseFloat(tierPrice),
      user_id: user.user?.id
    }]);

    if (!error) {
      setTierName(''); 
      setTierPrice('');
      await fetchData(); // Refresh data to show new tier
      
      // Update the activeService state so the modal reflects the new data immediately
      const updatedService = services.find(s => s.id === activeService.id);
      if (updatedService) setActiveService(updatedService);
    } else {
      alert("Failed to add tier.");
    }
    setIsSubmitting(false);
  };

  const handleDeleteTier = async (tierId: string) => {
    const { error } = await supabase.from('pricebook_options').delete().eq('id', tierId);
    if (!error) {
      await fetchData();
      const updatedService = services.find(s => s.id === activeService.id);
      if (updatedService) setActiveService(updatedService);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Pricebook...</div>;

  return (
    <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm overflow-hidden relative">
      
      {/* HEADER & TABS (Same as before) */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight italic">Pricebook</h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Manage your operational pricing engine.</p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button onClick={() => setActiveTab('services')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'services' ? 'bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Wrench size={14} /> Services
          </button>
          <button onClick={() => setActiveTab('categories')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'categories' ? 'bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Folder size={14} /> Categories
          </button>
        </div>
      </div>

      {/* ACTION BAR (Same as before) */}
      <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
          {activeTab === 'services' ? `${services.length} Total Services` : `${categories.length} Categories`}
        </span>
        <button onClick={() => setShowAddForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md shadow-blue-500/20">
          <Plus size={14} /> Add {activeTab === 'services' ? 'Service' : 'Category'}
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="p-6">
        
        {/* ADD FORMS (Same as before) ... */}
        {showAddForm && (
          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl relative">
            <button onClick={() => setShowAddForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={18} /></button>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest">New {activeTab === 'services' ? 'Service' : 'Category'}</h3>
            {activeTab === 'categories' ? (
              <form onSubmit={handleCreateCategory} className="flex gap-3">
                <input required type="text" placeholder="Category Name" value={catName} onChange={(e) => setCatName(e.target.value)} className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                <button type="submit" disabled={isSubmitting} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-sm font-black hover:opacity-90 transition-opacity disabled:opacity-50">Save</button>
              </form>
            ) : (
              <form onSubmit={handleCreateService} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block px-1">Service Name</label>
                    <input required type="text" value={srvName} onChange={(e) => setSrvName(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block px-1">Category</label>
                    <select required value={selectedCatId} onChange={(e) => setSelectedCatId(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      {categories.length === 0 && <option value="" disabled>Create a category first</option>}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block px-1">Base Price ($)</label>
                    <input required type="number" step="0.01" value={srvPrice} onChange={(e) => setSrvPrice(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block px-1">Est. Duration (Minutes)</label>
                    <input required type="number" value={srvDuration} onChange={(e) => setSrvDuration(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block px-1">Description (Optional)</label>
                    <textarea value={srvDesc} onChange={(e) => setSrvDesc(e.target.value)} rows={2} className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </div>
                <button type="submit" disabled={isSubmitting || categories.length === 0} className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-2.5 rounded-xl text-sm font-black hover:opacity-90 transition-opacity disabled:opacity-50">Save Service</button>
              </form>
            )}
          </div>
        )}

        {/* LISTINGS */}
        {activeTab === 'categories' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3 bg-slate-50 dark:bg-slate-900/30">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg"><Folder size={16} /></div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {services.map(srv => {
              const hasTiers = srv.pricebook_options && srv.pricebook_options.length > 0;
              return (
                <div key={srv.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors bg-white dark:bg-[#0B0E14]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md">
                        {srv.pricebook_categories?.name || 'Uncategorized'}
                      </span>
                      {hasTiers && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Layers size={10} /> {srv.pricebook_options.length} Tiers
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{srv.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-black px-3 py-1.5 rounded-lg text-xs tracking-widest uppercase">
                      ${srv.base_price.toFixed(2)}
                    </div>
                    {/* TRIGGER TIER BUILDER */}
                    <button 
                      onClick={() => setActiveService(srv)}
                      className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Manage Tiers
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TIER BUILDER MODAL OVERLAY */}
      {activeService && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setActiveService(null); fetchData(); }} />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0B0E14] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/30">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white italic tracking-tight">Tier Builder</h3>
                <p className="text-xs text-slate-500 font-medium">Pricing options for {activeService.name}</p>
              </div>
              <button onClick={() => { setActiveService(null); fetchData(); }} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Existing Tiers */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 px-1">Current Tiers</h4>
                {activeService.pricebook_options && activeService.pricebook_options.length > 0 ? (
                  activeService.pricebook_options.map((opt: any) => (
                    <div key={opt.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">{opt.tier_name}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">${opt.price.toFixed(2)}</span>
                      </div>
                      <button onClick={() => handleDeleteTier(opt.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">No tiers established yet.</p>
                )}
              </div>

              {/* Add New Tier Form */}
              <form onSubmit={handleAddTier} className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 px-1">Add New Tier</h4>
                <div className="flex gap-3">
                  <select required value={tierName} onChange={(e) => setTierName(e.target.value)} className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white outline-none appearance-none">
                    <option value="Good">Good</option>
                    <option value="Better">Better</option>
                    <option value="Best">Best</option>
                    <option value="Premium">Premium</option>
                    <option value="Basic">Basic</option>
                  </select>
                  <input required type="number" step="0.01" placeholder="Price ($)" value={tierPrice} onChange={(e) => setTierPrice(e.target.value)} className="w-1/3 px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-white outline-none" />
                </div>
                <button type="submit" disabled={isSubmitting || !tierPrice} className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Add Tier'}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}