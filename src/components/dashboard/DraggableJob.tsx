'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Clock, GripVertical, DollarSign, Crown } from 'lucide-react';

interface JobCardProps {
  job: {
    id: string;
    customers?: {
      name?: string;
      customer_memberships?: { status: string }[];
    };
    lead_sources?: {
      name: string;
      color_code: string;
    };
    services?: {
      base_price: number;
      estimated_duration_minutes: number;
    };
  };
}

export default function DraggableJob({ job }: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job.id,
    data: { job },
  });

  // TypeScript now automatically knows 'membership' has a 'status' string!
  const isVIP = job.customers?.customer_memberships?.some(
    (membership) => membership.status === 'active'
  );

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative w-full rounded-2xl border border-blue-500/30 bg-[#12161D] p-3 shadow-xl transition-all hover:border-blue-500/60 ${
        isDragging ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        {/* Marketing Lead Source Tag */}
        {job.lead_sources && (
          <span
            className="rounded-full border border-white/10 px-1.5 py-0.5 text-[7px] font-black uppercase"
            style={{
              backgroundColor: `${job.lead_sources.color_code}20`,
              color: job.lead_sources.color_code,
            }}
          >
            {job.lead_sources.name}
          </span>
        )}

        {/* Isolated Drag Handle */}
        <button
          {...listeners}
          {...attributes}
          className="ml-auto cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={12} className="text-slate-600 group-hover:text-blue-500" />
        </button>
      </div>

      {/* CUSTOMER NAME SECTION */}
      <div className="flex items-center gap-2">
        <p className="line-clamp-1 text-[11px] font-black tracking-tight text-white uppercase italic">
          {job.customers?.name || 'New Lead'}
        </p>
        {isVIP && (
          <span className="flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/20 px-1.5 py-0.5 text-[8px] font-black text-amber-500 uppercase">
            <Crown size={8} /> VIP
          </span>
        )}
      </div>

      {/* FINANCIALS & DURATION */}
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
        <div className="flex items-center gap-0.5 text-[10px] font-black text-emerald-500">
          <DollarSign size={10} />
          <span>{job.services?.base_price || 0}</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase">
          <Clock size={10} />
          <span>{job.services?.estimated_duration_minutes || 60}m</span>
        </div>
      </div>
    </div>
  );
}
