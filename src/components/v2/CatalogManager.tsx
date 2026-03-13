'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Package, Hammer } from 'lucide-react';

export const CatalogManager = () => {
  // We'll link this to Supabase next, but let's build the UI logic first
  const [items, setItems] = useState([
    { name: 'Standard Roof Wash', price: 450, category: 'labor' },
    { name: 'Premium Sealant', price: 65, category: 'material' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900">Service Catalog</h2>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700">
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, i) => (
          <Card
            key={i}
            className="group flex cursor-pointer items-center justify-between p-4 transition-all hover:border-blue-500"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600">
                {item.category === 'labor' ? <Hammer size={20} /> : <Package size={20} />}
              </div>
              <div>
                <p className="font-bold text-slate-900">{item.name}</p>
                <Badge variant="secondary" className="text-[10px] uppercase">
                  {item.category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-slate-900">${item.price}</p>
              <button className="text-slate-300 transition-colors hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
