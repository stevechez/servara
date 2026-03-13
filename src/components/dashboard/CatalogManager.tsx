'use client';

import { useState } from 'react';
import { useCatalog } from '@/hooks/useCatalog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Package, Hammer, Loader2 } from 'lucide-react';
import { AddCatalogItemModal } from './AddCatalogItemModal'; // IMPORT THE MODAL

export const CatalogManager = () => {
  const { items, loading, addItem, deleteItem } = useCatalog();
  const [isModalOpen, setIsModalOpen] = useState(false); // NEW STATE

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900">Service Catalog</h2>

        {/* WIRE THE BUTTON HERE */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700"
        >
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed p-12 text-center">
          <p className="mb-2 font-medium text-slate-500">Your catalog is empty.</p>
          <p className="text-sm text-slate-400">Add your first service to speed up estimating.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            // ... (keep your existing mapping code here) ...
            <Card
              key={item.id}
              className="group flex cursor-pointer items-center justify-between p-4 transition-all hover:border-blue-500"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600">
                  {item.category === 'labor' ? <Hammer size={20} /> : <Package size={20} />}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {item.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-slate-200 text-[10px] text-slate-400 uppercase"
                    >
                      Per {item.unit_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-900">${item.default_unit_price}</p>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-slate-300 transition-colors hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* RENDER THE MODAL AT THE BOTTOM */}
      <AddCatalogItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addItem}
      />
    </div>
  );
};
