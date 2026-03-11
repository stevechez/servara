import { createClient } from '@/lib/supabase/server';
import { Building2, Mail, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';
import { updateSettings } from '@/app/actions/updateSettings';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('settings').select('*').single();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Business Settings</h1>
        <p className="text-slate-500 text-sm font-medium">Control your brand identity and contact info.</p>
      </div>

      <form action={updateSettings} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-8">
          
          {/* Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Building2 size={12} /> Company Name
              </label>
              <input 
                name="business_name"
                defaultValue={settings?.business_name}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="e.g. Stark Industries"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin size={12} /> Office Address
              </label>
              <input 
                name="business_address"
                defaultValue={settings?.business_address}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="123 Main St, Santa Cruz, CA"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} /> Support Email
              </label>
              <input 
                name="business_email"
                defaultValue={settings?.business_email}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Phone size={12} /> Business Phone
              </label>
              <input 
                name="business_phone"
                defaultValue={settings?.business_phone}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-blue-50 rounded-3xl border border-blue-100">
          <div className="flex items-center gap-3 text-blue-700">
            <ShieldCheck size={20} />
            <p className="text-xs font-bold italic">Changes update all live invoices immediately.</p>
          </div>
          <button 
            type="submit"
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
          >
            <Save size={18} /> Save Brand
          </button>
        </div>
      </form>
    </div>
  );
}