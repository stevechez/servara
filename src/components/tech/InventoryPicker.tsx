'use client';

import React, { useState } from 'react';
import { Package, Plus, Search } from 'lucide-react';
import { addPartToJob } from '@/app/actions/inventory-actions';

export default function InventoryPicker({ jobId, partsLibrary }: any) {
  const [selectedPart, setSelectedPart] = useState('');

  const handleAdd = async () => {
    if (!selectedPart) return;
    const result = await addPartToJob(jobId, selectedPart, 1);
    if (result.success) {
      alert('Part added to invoice!');
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/5 bg-[#0B0E14] p-6 shadow-xl">
      <h3 className="mb-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">
        Materials & Parts
      </h3>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white"
            onChange={(e) => setSelectedPart(e.target.value)}
          >
            <option value="">Select a part...</option>
            {partsLibrary.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name} - ${p.price}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="rounded-xl bg-emerald-600 p-3 text-white transition hover:bg-emerald-500"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
