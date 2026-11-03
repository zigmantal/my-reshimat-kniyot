import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { CatalogItem } from '../types';

export function useCatalogItems() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from('catalog_items')
      .select('*')
      .order('name', { ascending: true });
    if (!error && data) setItems(data as CatalogItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addItem = useCallback(
    async (input: {
      name: string;
      categoryId: string | null;
      brandOrNote?: string | null;
      defaultUnit?: string | null;
      email: string | null;
    }) => {
      const trimmed = input.name.trim();
      if (!trimmed) return null;
      const { data, error } = await supabase
        .from('catalog_items')
        .insert({
          name: trimmed,
          category_id: input.categoryId,
          brand_or_note: input.brandOrNote || null,
          default_unit: input.defaultUnit || null,
          created_by_email: input.email,
        })
        .select()
        .single();
      if (error) {
        console.error(error);
        return null;
      }
      await reload();
      return data as CatalogItem;
    },
    [reload]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      await supabase.from('catalog_items').delete().eq('id', id);
      await reload();
    },
    [reload]
  );

  return { items, loading, addItem, deleteItem, reload };
}
