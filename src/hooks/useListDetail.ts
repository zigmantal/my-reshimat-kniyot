import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { ShoppingList, ListItem } from '../types';

export function useListDetail(listId: string | undefined) {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!listId) return;
    const [{ data: listData }, { data: itemsData }] = await Promise.all([
      supabase.from('lists').select('*').eq('id', listId).maybeSingle(),
      supabase
        .from('list_items')
        .select('*')
        .eq('list_id', listId)
        .order('created_at', { ascending: true }),
    ]);
    setList((listData as ShoppingList) ?? null);
    setItems((itemsData as ListItem[]) ?? []);
    setLoading(false);
  }, [listId]);

  useEffect(() => {
    reload();
    if (!listId) return;

    const channel = supabase
      .channel(`list-detail-${listId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'list_items', filter: `list_id=eq.${listId}` },
        () => reload()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lists', filter: `id=eq.${listId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listId, reload]);

  const toggleChecked = useCallback(async (itemId: string, checked: boolean) => {
    await supabase.from('list_items').update({ checked }).eq('id', itemId);
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    await supabase.from('list_items').delete().eq('id', itemId);
  }, []);

  const addQuickItem = useCallback(
    async (input: {
      listId: string;
      nameSnapshot: string;
      categoryId: string | null;
      categoryNameSnapshot: string | null;
      catalogItemId: string | null;
      brandOrNote: string | null;
      quantity: number;
      unit: string | null;
      email: string | null;
    }) => {
      await supabase.from('list_items').insert({
        list_id: input.listId,
        catalog_item_id: input.catalogItemId,
        name_snapshot: input.nameSnapshot,
        category_id: input.categoryId,
        category_name_snapshot: input.categoryNameSnapshot,
        brand_or_note: input.brandOrNote,
        quantity: input.quantity,
        unit: input.unit,
        added_by_email: input.email,
      });
    },
    []
  );

  const markDone = useCallback(async () => {
    if (!listId) return;
    await supabase
      .from('lists')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .eq('id', listId);
  }, [listId]);

  const deleteList = useCallback(async () => {
    if (!listId) return;
    await supabase.from('lists').delete().eq('id', listId);
  }, [listId]);

  return { list, items, loading, toggleChecked, removeItem, addQuickItem, markDone, deleteList, reload };
}
