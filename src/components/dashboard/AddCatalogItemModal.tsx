'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CatalogItem } from '@/types';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<CatalogItem, 'id' | 'created_at' | 'user_id'>) => Promise<{ error?: string }>;
}

export const AddCatalogItemModal = ({ isOpen, onClose, onSave }: AddModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'labor' | 'material'>('labor');
  const [unitType, setUnitType] = useState<'flat_rate' | 'sq_ft' | 'hour'>('flat_rate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await onSave({
      name,
      default_unit_price: parseFloat(price),
      category,
      unit_type: unitType,
    });

    setIsSubmitting(false);

    if (!result?.error) {
      // Reset form and close on success
      setName('');
      setPrice('');
      onClose();
    } else {
      alert(`Error saving item: ${result.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h3 className="text-xl font-bold text-slate-900">Add Service Item</h3>
          <button
            onClick={onClose}
            className="text-slate-400 transition-colors hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Item Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Driveway Pressure Washing"
              className="mt-1 w-full rounded-lg border border-slate-200 p-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-3"
                value={category}
                onChange={(e) => setCategory(e.target.value as 'labor' | 'material')}
              >
                <option value="labor">Labor / Service</option>
                <option value="material">Material / Product</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Pricing Unit</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-3"
                value={unitType}
                onChange={(e) => setUnitType(e.target.value as any)}
              >
                <option value="flat_rate">Flat Rate</option>
                <option value="sq_ft">Per Sq Ft</option>
                <option value="hour">Per Hour</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Default Price</label>
            <div className="relative mt-1">
              <span className="absolute top-3 left-3 font-bold text-slate-500">$</span>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-200 p-3 pl-8 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-3 font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
