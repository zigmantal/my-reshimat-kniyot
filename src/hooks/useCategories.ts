import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setCategories(data as Category[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addCategory = useCallback(
    async (name: string, icon: string | null, email: string | null) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const { data, error } = await supabase
        .from('categories')
        .insert({ name: trimmed, icon, created_by_email: email, sort_order: 500 })
        .select()
        .single();
      if (error) {
        // ייתכן שהקטגוריה כבר קיימת (unique) — נטען מחדש ונחפש אותה
        await reload();
        const existing = await supabase
          .from('categories')
          .select('*')
          .ilike('name', trimmed)
          .maybeSingle();
        return (existing.data as Category) ?? null;
      }
      await reload();
      return data as Category;
    },
    [reload]
  );

  return { categories, loading, addCategory, reload };
}
