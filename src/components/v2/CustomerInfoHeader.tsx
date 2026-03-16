'use client';

import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Edit, User, Star, MoreHorizontal } from 'lucide-react';

interface CustomerInfoHeaderProps {
  customer: any; // Accept the customer object from the database
}

export default function CustomerInfoHeader({ customer }: CustomerInfoHeaderProps) {
  // Extract initials for the avatar (e.g., "John Smith" -> "JS")
  const getInitials = (name: string) => {
    if (!name) return <User size={24} />;
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* BREADCRUMB & BACK BUTTON */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:bg-slate-50 hover:shadow dark:bg-[#12161D] dark:hover:bg-white/5"
        >
          <ArrowLeft size={18} className="text-slate-500 dark:text-slate-400" />
        </Link>
        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          Customers / <span className="text-blue-600 dark:text-blue-400">{customer.name}</span>
        </span>
      </div>

      {/* MAIN HEADER CARD */}
      <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center dark:border-white/5 dark:bg-[#0B0E14]">
        {/* LEFT: Avatar & Name */}
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-black text-white shadow-lg shadow-blue-500/30">
            {getInitials(customer.name)}
          </div>

          {/* Name & Badges */}
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic md:text-4xl dark:text-white">
              {customer.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black tracking-widest text-emerald-600 uppercase dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
              </span>
              {/* Fake VIP Tag for demo flair */}
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black tracking-widest text-amber-600 uppercase dark:bg-amber-500/10 dark:text-amber-400">
                <Star size={10} className="fill-amber-500" /> VIP Client
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Call Button (actually triggers phone dialer) */}
          {customer.phone && (
            <a
              href={`tel:${customer.phone.replace(/\D/g, '')}`}
              className="flex items-center gap-2 rounded-2xl bg-slate-50 px-5 py-3 text-xs font-black tracking-widest text-slate-600 uppercase transition-colors hover:bg-slate-100 hover:text-blue-600 dark:bg-[#12161D] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-blue-400"
            >
              <Phone size={16} /> <span className="hidden sm:inline">Call</span>
            </a>
          )}

          {/* Email Button */}
          {customer.email && (
            <a
              href={`mailto:${customer.email}`}
              className="flex items-center gap-2 rounded-2xl bg-slate-50 px-5 py-3 text-xs font-black tracking-widest text-slate-600 uppercase transition-colors hover:bg-slate-100 hover:text-blue-600 dark:bg-[#12161D] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-blue-400"
            >
              <Mail size={16} /> <span className="hidden sm:inline">Email</span>
            </a>
          )}

          {/* Edit/More Actions */}
          <button className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:bg-[#12161D] dark:hover:bg-white/5 dark:hover:text-white">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
