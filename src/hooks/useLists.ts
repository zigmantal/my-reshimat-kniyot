import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { ShoppingList, ListStatus } from '../types';

export function useLists(status: ListStatus) {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    if (!error && data) setLists(data as ShoppingList[]);
    setLoading(false);
  }, [status]);

  useEffect(() => {
    reload();

    const channel = supabase
      .channel(`lists-${status}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lists' },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reload, status]);

  return { lists, loading, reload };
}
