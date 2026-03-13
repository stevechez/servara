import { useState, useEffect, useCallback } from 'react';
import { CatalogItem } from '@/types';
import { createClient } from '@/utils/supabase/client';

export function useCatalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // 1. READ: Fetch all items for the logged-in contractor
  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('catalog_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setItems(data as CatalogItem[]);

    setLoading(false);
  }, [supabase]);

  // Initial fetch
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // 2. CREATE: Add a new service to the menu
  const addItem = async (newItem: Omit<CatalogItem, 'id' | 'created_at' | 'user_id'>) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('catalog_items')
      .insert([{ ...newItem, user_id: user.id }])
      .select()
      .single();

    if (error) return { error: error.message };

    // Update local state instantly without reloading the page
    setItems((prev) => [data as CatalogItem, ...prev]);
    return { data };
  };

  // 3. DELETE: Remove an outdated service
  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('catalog_items').delete().eq('id', id);

    if (error) return { error: error.message };

    // Remove from UI instantly
    setItems((prev) => prev.filter((item) => item.id !== id));
    return { success: true };
  };

  return { items, loading, error, addItem, deleteItem, refresh: fetchCatalog };
}
