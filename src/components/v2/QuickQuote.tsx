'use client';

import { useState } from 'react';
import { Calculator, Settings2 } from 'lucide-react';

// This simulates the contractor's custom intake forms/price book from the database
const customTemplates = {
  interior_paint: {
    name: 'Interior Repaint (Walls & Trim)',
    unitName: 'Square Footage',
    rates: { ECO: 2.5, STD: 4.0, PRO: 6.5 }, // Contractor's Good, Better, Best
  },
  exterior_paint: {
    name: 'Exterior Stucco & Eaves',
    unitName: 'Square Footage',
    rates: { ECO: 1.8, STD: 3.2, PRO: 5.5 },
  },
  cabinets: {
    name: 'Kitchen Cabinet Refinishing',
    unitName: 'Linear Feet',
    rates: { ECO: 120, STD: 180, PRO: 250 },
  },
};

export default function QuickQuote() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<keyof typeof customTemplates>('interior_paint');
  const [inputValue, setInputValue] = useState<number | string>(1500);
  const [tier, setTier] = useState<'ECO' | 'STD' | 'PRO'>('STD');

  const template = customTemplates[selectedTemplate];
  const currentTotal = (Number(inputValue) || 0) * template.rates[tier];

  return (
    <div className="flex h-full flex-col justify-between rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#12161D]">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-400">
            <Calculator size={20} />
            <h2 className="text-[12px] font-black tracking-widest uppercase">Custom Quick Quote</h2>
          </div>
          {/* Settings icon implies they configure these templates elsewhere */}
          <button className="text-slate-300 transition-colors hover:text-blue-500">
            <Settings2 size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* SAVED TEMPLATE SELECTOR */}
          <div>
            <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Saved Estimate Template
            </label>
            <select
              value={selectedTemplate}
              suppressHydrationWarning
              onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof customTemplates)}
              className="w-full appearance-none rounded-2xl border-none bg-slate-50 p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 dark:bg-white/5 dark:text-white"
            >
              {Object.entries(customTemplates).map(([key, temp]) => (
                <option key={key} value={key}>
                  {temp.name}
                </option>
              ))}
            </select>
          </div>

          {/* DYNAMIC MEASUREMENT INPUT */}
          <div>
            <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              {template.unitName} {/* Changes based on template */}
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-2xl border-none bg-slate-50 p-4 text-2xl font-black text-slate-900 focus:ring-2 focus:ring-blue-600 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        {/* GOOD / BETTER / BEST TIERS */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {['ECO', 'STD', 'PRO'].map((t) => (
            <button
              key={t}
              onClick={() => setTier(t as any)}
              className={`rounded-2xl py-3 text-[10px] font-black tracking-widest uppercase transition-all ${
                tier === t
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* TOTAL DISPLAY */}
      <div className="mt-8 flex items-end justify-between border-t border-slate-100 pt-6 dark:border-white/5">
        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          Estimated Total
        </span>
        <span className="text-4xl font-black tracking-tighter text-blue-600 italic">
          $
          {currentTotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}
