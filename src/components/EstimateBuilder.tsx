'use client';

import { useState } from 'react';
import { useCatalog } from '@/hooks/useCatalog';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Calculator, Save, Loader2 } from 'lucide-react';

interface EstimateLineItem {
  id: string; // Temporary ID for the UI
  description: string;
  quantity: number;
  unit_price: number;
}

export const EstimateBuilder = () => {
  // Bring in your live catalog items
  const { items: catalogItems, loading: catalogLoading } = useCatalog();

  // Start with one empty row
  const [lineItems, setLineItems] = useState<EstimateLineItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 },
  ]);

  // The 10X Instant Math Engine
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  const addRow = () => {
    setLineItems([
      ...lineItems,
      { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 },
    ]);
  };

  const removeRow = (id: string) => {
    if (lineItems.length === 1) return; // Keep at least one row
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateRow = (id: string, field: keyof EstimateLineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // The Magic Move: Auto-fill description and price when a catalog item is picked
  const handleCatalogSelect = (rowId: string, catalogItemId: string) => {
    const selectedItem = catalogItems.find((item) => item.id === catalogItemId);
    if (selectedItem) {
      setLineItems(
        lineItems.map((item) =>
          item.id === rowId
            ? {
                ...item,
                description: selectedItem.name,
                unit_price: selectedItem.default_unit_price,
              }
            : item
        )
      );
    }
  };

  if (catalogLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Card className="border-slate-200 p-6 shadow-sm md:p-8">
      <div className="mb-8 flex items-end justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black text-slate-900">
            <Calculator size={24} className="text-blue-600" />
            Create Estimate
          </h2>
          <p className="mt-1 text-sm text-slate-500">Draft a new quote for your client.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Table Headers (Hidden on small screens) */}
        <div className="hidden gap-4 px-2 text-xs font-bold tracking-wider text-slate-400 uppercase md:flex">
          <div className="flex-1">Service / Description</div>
          <div className="w-24 text-center">Qty</div>
          <div className="w-32 text-right">Unit Price</div>
          <div className="w-32 text-right">Line Total</div>
          <div className="w-10"></div>
        </div>

        {/* Dynamic Rows */}
        {lineItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 md:flex-row md:items-center"
          >
            <div className="w-full flex-1 space-y-2">
              {/* The "10X" Dropdown - Pulls from Supabase! */}
              <select
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                onChange={(e) => handleCatalogSelect(item.id, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select from catalog...
                </option>
                {catalogItems.map((catalogItem) => (
                  <option key={catalogItem.id} value={catalogItem.id}>
                    {catalogItem.name} (${catalogItem.default_unit_price})
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Or type custom description..."
                className="w-full border-b border-slate-200 bg-transparent p-2 text-sm outline-none focus:border-blue-600"
                value={item.description}
                onChange={(e) => updateRow(item.id, 'description', e.target.value)}
              />
            </div>

            <div className="flex w-full items-center gap-4 md:w-auto">
              <input
                type="number"
                min="1"
                className="w-24 rounded-lg border border-slate-200 bg-white p-2 text-center outline-none focus:ring-2 focus:ring-blue-600"
                value={item.quantity || ''}
                onChange={(e) => updateRow(item.id, 'quantity', parseFloat(e.target.value) || 0)}
              />

              <div className="relative w-32">
                <span className="absolute top-2.5 left-3 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 pl-7 outline-none focus:ring-2 focus:ring-blue-600"
                  value={item.unit_price || ''}
                  onChange={(e) =>
                    updateRow(item.id, 'unit_price', parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              <div className="w-32 text-right font-bold text-slate-700">
                ${(item.quantity * item.unit_price).toFixed(2)}
              </div>

              <button
                onClick={() => removeRow(item.id)}
                className="flex w-10 justify-end text-slate-300 transition-colors hover:text-red-500"
                disabled={lineItems.length === 1}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
        <button
          onClick={addRow}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-50"
        >
          <Plus size={16} /> Add Line Item
        </button>

        <div className="text-right">
          <p className="mb-1 text-sm font-bold tracking-wider text-slate-500 uppercase">
            Estimated Total
          </p>
          <p className="text-4xl font-black text-slate-900">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              subtotal
            )}
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl">
          <Save size={18} />
          Save & Preview
        </button>
      </div>
    </Card>
  );
};
