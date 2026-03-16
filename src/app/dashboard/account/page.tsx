'use client';

import { useState } from 'react';
import {
  User,
  Building2,
  Phone,
  Globe,
  Save,
  CheckCircle,
  Camera,
  Languages,
  Clock,
  Hash,
} from 'lucide-react';

export default function MyAccountPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  // Profile photo upload handler
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* HEADER */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          {/* text-3xl -> text-4xl */}
          <h1 className="text-4xl font-black tracking-tighter uppercase italic dark:text-white">
            Account Settings
          </h1>
          {/* text-sm -> text-base */}
          <p className="text-base font-bold tracking-widest text-slate-500 uppercase">
            Personalize your Zidro Pro profile
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-3 rounded-2xl bg-blue-600 px-10 py-6 text-[12px] font-black tracking-[0.2em] text-white uppercase shadow-2xl shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95"
        >
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {loading ? 'Syncing...' : saved ? 'Profile Updated' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-10">
        {/* SECTION 1: IDENTITY & PROFILE PHOTO */}
        <div className="rounded-[3rem] border border-slate-100 bg-white p-12 dark:border-white/5 dark:bg-[#12161D]">
          <div className="flex flex-col gap-12 md:flex-row">
            {/* Photo Upload Column */}
            <div className="flex flex-col items-center gap-4">
              {/* text-[10px] -> text-[12px] */}
              <h2 className="text-center text-[12px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Profile Photo
              </h2>
              {/* Click triggers file input */}
              <label
                htmlFor="photo-upload"
                className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-white/5"
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <User size={48} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-blue-600/80 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="text-white" size={24} />
                </div>
              </label>
              {/* Hidden file input */}
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {/* text-[10px] -> text-[12px] */}
              <p className="text-[12px] font-bold text-slate-400 uppercase">JPG, PNG or GIF</p>
            </div>

            {/* Basic Info Grid */}
            <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { label: 'First Name', placeholder: 'Steve', icon: User },
                { label: 'Last Name', placeholder: 'Macias', icon: User },
                { label: 'Display Name', placeholder: 'Steve M.', icon: User },
                { label: 'Email Address', placeholder: 'steve@zidro.pro', icon: Globe },
                { label: 'Phone Number', placeholder: '+1 (555) 000-0000', icon: Phone },
                { label: 'Job Title', placeholder: 'Lead Contractor', icon: Building2 },
              ].map((field) => (
                <div key={field.label}>
                  {/* text-[10px] -> text-[12px] */}
                  <label className="mb-2 block text-[12px] font-black tracking-widest text-slate-400 uppercase">
                    {field.label}
                  </label>
                  <div className="relative">
                    <field.icon className="absolute top-4 left-4 text-slate-300" size={18} />
                    {/* p-4 -> p-5, text-sm -> text-base */}
                    <input
                      placeholder={field.placeholder}
                      className="w-full rounded-2xl border-none bg-slate-50 p-5 pl-12 text-base font-bold focus:ring-2 focus:ring-blue-500 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: PROFESSIONAL & COMPANY */}
        <div className="rounded-[3rem] border border-slate-100 bg-white p-12 dark:border-white/5 dark:bg-[#12161D]">
          {/* text-[10px] -> text-[12px] */}
          <h2 className="mb-8 text-[12px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Company Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              {/* text-[10px] -> text-[12px] */}
              <label className="mb-2 block text-[12px] font-black tracking-widest text-slate-400 uppercase">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute top-4 left-4 text-slate-300" size={18} />
                {/* Add 'readOnly' to fix this field, text-sm -> text-base */}
                <input
                  readOnly
                  placeholder="Zidro Pro Services"
                  className="w-full rounded-2xl border-none bg-slate-50 p-5 pl-12 text-base font-bold dark:bg-white/5 dark:text-slate-400"
                />
              </div>
            </div>
            <div>
              {/* text-[10px] -> text-[12px] */}
              <label className="mb-2 block text-[12px] font-black tracking-widest text-slate-400 uppercase">
                Office Website
              </label>
              <div className="relative">
                <Globe className="absolute top-4 left-4 text-slate-300" size={18} />
                {/* text-sm -> text-base */}
                <input
                  placeholder="www.zidro.pro"
                  className="w-full rounded-2xl border-none bg-slate-50 p-5 pl-12 text-base font-bold dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: LOCALIZATION & REGIONAL */}
        <div className="rounded-[3rem] border border-slate-100 bg-white p-12 dark:border-white/5 dark:bg-[#12161D]">
          {/* text-[10px] -> text-[12px] */}
          <h2 className="mb-8 text-[12px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Locale & Preferences
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              {/* text-[10px] -> text-[12px] */}
              <label className="mb-2 block text-[12px] font-black tracking-widest text-slate-400 uppercase">
                Time Zone
              </label>
              <div className="relative">
                <Clock className="absolute top-4 left-4 text-slate-300" size={18} />
                {/* text-sm -> text-base */}
                <select className="w-full appearance-none rounded-2xl border-none bg-slate-50 p-5 pl-12 text-base font-bold dark:bg-white/5 dark:text-white">
                  <option>(GMT-08:00) Pacific Time</option>
                  <option>(GMT-05:00) Eastern Time</option>
                  <option>(GMT+00:00) London</option>
                </select>
              </div>
            </div>

            <div>
              {/* text-[10px] -> text-[12px] */}
              <label className="mb-2 block text-[12px] font-black tracking-widest text-slate-400 uppercase">
                Language
              </label>
              <div className="relative">
                <Languages className="absolute top-4 left-4 text-slate-300" size={18} />
                {/* text-sm -> text-base */}
                <select className="w-full appearance-none rounded-2xl border-none bg-slate-50 p-5 pl-12 text-base font-bold dark:bg-white/5 dark:text-white">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>

            <div>
              {/* text-[10px] -> text-[12px] */}
              <label className="mb-2 block text-[12px] font-black tracking-widest text-slate-400 uppercase">
                Date Format
              </label>
              <div className="relative">
                <Hash className="absolute top-4 left-4 text-slate-300" size={18} />
                {/* text-sm -> text-base */}
                <select className="w-full appearance-none rounded-2xl border-none bg-slate-50 p-5 pl-12 text-base font-bold dark:bg-white/5 dark:text-white">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
